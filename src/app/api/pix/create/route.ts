import { NextRequest, NextResponse } from 'next/server';
import { requireClienteSession } from '@/lib/cliente-auth';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';
import {
  MercadoPagoClientNotConfiguredError,
  mercadoPagoClient,
  type MpPixPaymentOutput,
} from '@/lib/integrations/mercadopago/client';
import { isMercadoPagoPixAutomationEnabled } from '@/lib/financeiro/payments';

type RideRow = {
  id: string;
  cliente_id: string;
  forma_pagamento: string | null;
  valor: number | null;
  tipo_corrida: string | null;
  status: string | null;
  users?: {
    nome?: string | null;
    email?: string | null;
  } | null;
};

type MpPaymentRow = {
  id: string;
  ride_id: string;
  mp_payment_id?: string | null;
  mp_external_reference?: string | null;
  mp_status?: string | null;
  mp_status_detail?: string | null;
  pix_qr_code_base64?: string | null;
  pix_qr_code_text?: string | null;
  pix_expires_at?: string | null;
  created_at?: string;
};

const ACTIVE_MP_STATUSES = new Set([
  'pending',
  'in_process',
  'authorized',
  'approved',
  'accredited',
]);

const EXPIRED_OR_CANCELLED_STATUSES = new Set([
  'cancelled',
  'canceled',
  'expired',
  'rejected',
  'refunded',
  'charged_back',
]);

export async function POST(req: NextRequest) {
  try {
    const sessionResult = await requireClienteSession();
    if (!sessionResult.authorized) {
      return sessionResult.response ?? NextResponse.json({ error: 'Nao autenticado.' }, { status: 401 });
    }
    const authenticatedUserId = sessionResult.session.user.id;

    if (!isMercadoPagoPixAutomationEnabled() || !mercadoPagoClient.isConfigured()) {
      return NextResponse.json(
        { error: 'Automação Pix Mercado Pago não está habilitada nesta etapa.' },
        { status: 503 },
      );
    }

    let body: { ride_id?: unknown };
    try {
      body = (await req.json()) as { ride_id?: unknown };
    } catch {
      return NextResponse.json({ error: 'Body JSON inválido.' }, { status: 400 });
    }

    const rideId = typeof body.ride_id === 'string' ? body.ride_id.trim() : '';
    if (!rideId) {
      return NextResponse.json({ error: 'ride_id é obrigatório.' }, { status: 400 });
    }

    const admin = getAdminSupabaseClient();

    const { data: rideRow, error: rideErr } = await admin
      .from('rides')
      .select(
        'id, cliente_id, forma_pagamento, valor, tipo_corrida, status, users(nome, email)',
      )
      .eq('id', rideId)
      .single();

    if (rideErr || !rideRow) {
      return NextResponse.json(
        { error: 'Corrida não encontrada.' },
        { status: 404 },
      );
    }
    const ride = rideRow as RideRow;

    if (ride.cliente_id !== authenticatedUserId) {
      return NextResponse.json(
        { error: 'Esta corrida não pertence ao cliente autenticado.' },
        { status: 403 },
      );
    }

    if (ride.forma_pagamento !== 'pix') {
      return NextResponse.json(
        { error: 'Esta corrida não utiliza Pix como forma de pagamento.' },
        { status: 409 },
      );
    }

    if (ride.status === 'cancelado') {
      return NextResponse.json(
        { error: 'Corrida cancelada, não é possível criar Pix.' },
        { status: 409 },
      );
    }

    const valor = typeof ride.valor === 'number' && Number.isFinite(ride.valor) ? ride.valor : null;
    if (valor === null || valor <= 0) {
      return NextResponse.json(
        { error: 'Valor da corrida ainda não definido.' },
        { status: 409 },
      );
    }

    const externalReference = `motosango_ride_${ride.id}`;

    const { data: existingRows } = await admin
      .from('mercado_pago_payments')
      .select(
        'id, ride_id, mp_payment_id, mp_external_reference, mp_status, mp_status_detail, pix_qr_code_base64, pix_qr_code_text, pix_expires_at, created_at',
      )
      .eq('ride_id', ride.id)
      .order('created_at', { ascending: false })
      .limit(20);

    const existingPayments = (existingRows || []) as MpPaymentRow[];
    const activePayment = existingPayments.find(
      (p) => !!p.mp_status && ACTIVE_MP_STATUSES.has(String(p.mp_status).toLowerCase()),
    );

    if (activePayment) {
      return NextResponse.json(
        {
          already_created: true,
          ride_id: ride.id,
          mp_payment_id: activePayment.mp_payment_id || null,
          mp_external_reference: activePayment.mp_external_reference || externalReference,
          mp_status: activePayment.mp_status || 'pending',
          qr_code_base64: activePayment.pix_qr_code_base64 || null,
          qr_code_text: activePayment.pix_qr_code_text || null,
          pix_expires_at: activePayment.pix_expires_at || null,
        },
        { status: 200 },
      );
    }

    let created: MpPixPaymentOutput;
    try {
      created = await mercadoPagoClient.createPixPayment({
        rideId: ride.id,
        externalReference,
        amount: valor,
        expirationMinutes: mercadoPagoClient.getDefaultExpirationMinutes(),
        customerEmail:
          typeof ride.users?.email === 'string' && ride.users.email.trim()
            ? ride.users.email.trim()
            : undefined,
        customerName:
          typeof ride.users?.nome === 'string' && ride.users.nome.trim()
            ? ride.users.nome.trim()
            : undefined,
        description: `MotoSango - Corrida #${ride.id.slice(0, 8)}`,
      });
    } catch (error: unknown) {
      if (error instanceof MercadoPagoClientNotConfiguredError) {
        return NextResponse.json(
          { error: 'Mercado Pago não configurado nesta etapa.' },
          { status: 503 },
        );
      }
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? `Falha ao criar pagamento no Mercado Pago: ${error.message}`
              : 'Falha ao criar pagamento no Mercado Pago.',
        },
        { status: 502 },
      );
    }

    const insertRow = {
      ride_id: ride.id,
      mp_payment_id: created.mpPaymentId,
      mp_external_reference: created.externalReference,
      mp_status: created.status,
      mp_status_detail: created.statusDetail,
      pix_qr_code_base64: created.qrCodeBase64 || null,
      pix_qr_code_text: created.qrCodeText || null,
      pix_expires_at: created.expiresAt.toISOString(),
      raw_payload_json: created.rawPayload as object | null,
    };

    let persisted: MpPaymentRow | null = null;

    try {
      const { data: inserted, error: insertErr } = await admin
        .from('mercado_pago_payments')
        .insert(insertRow)
        .select(
          'id, ride_id, mp_payment_id, mp_external_reference, mp_status, mp_status_detail, pix_qr_code_base64, pix_qr_code_text, pix_expires_at, created_at',
        )
        .single();
      if (!insertErr && inserted) {
        persisted = inserted as MpPaymentRow;
      }
    } catch (insertError: unknown) {
      const pgErr = insertError as { code?: string };
      if (pgErr.code !== '23505') {
        throw insertError;
      }
    }

    if (!persisted) {
      const { data: retryData } = await admin
        .from('mercado_pago_payments')
        .select(
          'id, ride_id, mp_payment_id, mp_external_reference, mp_status, mp_status_detail, pix_qr_code_base64, pix_qr_code_text, pix_expires_at, created_at',
        )
        .eq('mp_external_reference', externalReference)
        .order('created_at', { ascending: false })
        .limit(1);
      if (retryData && retryData.length) {
        persisted = retryData[0] as MpPaymentRow;
      }
    }

    const responseStatus = persisted?.mp_status && EXPIRED_OR_CANCELLED_STATUSES.has(String(persisted.mp_status).toLowerCase())
      ? persisted.mp_status.toLowerCase()
      : (persisted?.mp_status || created.status);

    return NextResponse.json(
      {
        already_created: false,
        ride_id: ride.id,
        mp_payment_id: persisted?.mp_payment_id || created.mpPaymentId || null,
        mp_external_reference: persisted?.mp_external_reference || created.externalReference || externalReference,
        mp_status: responseStatus,
        qr_code_base64: persisted?.pix_qr_code_base64 || created.qrCodeBase64 || null,
        qr_code_text: persisted?.pix_qr_code_text || created.qrCodeText || null,
        pix_expires_at: persisted?.pix_expires_at || created.expiresAt.toISOString() || null,
      },
      { status: 201 },
    );
  } catch (err: unknown) {
    console.error('[pix/create] Erro inesperado:', err);
    return NextResponse.json(
      { error: 'Erro interno ao criar Pix.' },
      { status: 500 },
    );
  }
}
