import { NextRequest, NextResponse } from 'next/server';
import { requireClienteSession } from '@/lib/cliente-auth';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';
import { isMercadoPagoPixAutomationEnabled } from '@/lib/financeiro/payments';

type RideRow = {
  id: string;
  cliente_id: string;
  forma_pagamento: string | null;
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

export async function GET(req: NextRequest) {
  try {
    const sessionResult = await requireClienteSession();
    if (!sessionResult.authorized) {
      return sessionResult.response ?? NextResponse.json({ error: 'Nao autenticado.' }, { status: 401 });
    }
    const authenticatedUserId = sessionResult.session.user.id;

    const { searchParams } = new URL(req.url);
    const rideId = (searchParams.get('ride_id') || '').trim();
    if (!rideId) {
      return NextResponse.json({ error: 'ride_id é obrigatório.' }, { status: 400 });
    }

    const admin = getAdminSupabaseClient();

    const { data: rideRow, error: rideErr } = await admin
      .from('rides')
      .select('id, cliente_id, forma_pagamento')
      .eq('id', rideId)
      .single();

    if (rideErr || !rideRow) {
      return NextResponse.json({ error: 'Corrida não encontrada.' }, { status: 404 });
    }
    const ride = rideRow as RideRow;

    if (ride.cliente_id !== authenticatedUserId) {
      return NextResponse.json(
        { error: 'Esta corrida não pertence ao cliente autenticado.' },
        { status: 403 },
      );
    }

    const enabled = isMercadoPagoPixAutomationEnabled();

    if (!enabled || ride.forma_pagamento !== 'pix') {
      return NextResponse.json({
        ride_id: ride.id,
        enabled,
        has_mp_payment: false,
        mp_payment: null,
      });
    }

    const { data: payments } = await admin
      .from('mercado_pago_payments')
      .select(
        'id, ride_id, mp_payment_id, mp_external_reference, mp_status, mp_status_detail, pix_qr_code_base64, pix_qr_code_text, pix_expires_at, created_at',
      )
      .eq('ride_id', ride.id)
      .order('created_at', { ascending: false })
      .limit(1);

    const payment = (payments && payments.length ? payments[0] : null) as MpPaymentRow | null;

    if (!payment) {
      return NextResponse.json({
        ride_id: ride.id,
        enabled,
        has_mp_payment: false,
        mp_payment: null,
      });
    }

    const expiresAt = payment.pix_expires_at ? new Date(payment.pix_expires_at) : null;
    const isExpired = expiresAt ? expiresAt.getTime() < Date.now() : false;

    return NextResponse.json({
      ride_id: ride.id,
      enabled,
      has_mp_payment: true,
      mp_payment: {
        mp_payment_id: payment.mp_payment_id || null,
        mp_status: payment.mp_status || null,
        mp_status_detail: payment.mp_status_detail || null,
        mp_external_reference: payment.mp_external_reference || null,
        qr_code_base64: payment.pix_qr_code_base64 || null,
        qr_code_text: payment.pix_qr_code_text || null,
        pix_expires_at_iso: payment.pix_expires_at || null,
        is_expired: isExpired,
        created_at_iso: payment.created_at || null,
      },
    });
  } catch (err: unknown) {
    console.error('[pix/status] Erro inesperado:', err);
    return NextResponse.json({ error: 'Erro interno ao consultar Pix.' }, { status: 500 });
  }
}
