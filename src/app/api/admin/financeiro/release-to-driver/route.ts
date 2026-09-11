import { NextResponse } from "next/server";

import { getAdminSupabaseClient } from "@/lib/admin-supabase";
import { requireAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const EPS = Number.EPSILON;

function roundMoney(v: number) {
  return Math.round((v + EPS) * 100) / 100;
}

type SummaryRow = {
  id: string;
  ride_id: string;
  driver_id: string;
  payment_method: string;
  gross_ride_amount: number;
  platform_commission_amount: number;
  economic_net_amount: number;
  payment_status: string;
  settlement_status: string;
  driver_owes_platform_amount: number;
  platform_owes_driver_amount: number;
  created_at: string;
};

function isNonEmptyUuid(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isPositiveMoney(value: unknown): value is number {
  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0;
  }
  if (typeof value === "string") {
    const n = Number(value);
    return Number.isFinite(n) && n > 0;
  }
  return false;
}

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  const responsibleLogin = auth.session.login;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Payload inválido." },
      { status: 400 },
    );
  }

  const isObj = body && typeof body === "object";
  const bodyObj = (isObj ? body : {}) as Record<string, unknown>;
  const summaryId = bodyObj.summary_id;
  const amountRaw = bodyObj.amount;
  const reason = bodyObj.reason;
  const providerPaymentId = bodyObj.provider_payment_id;
  const providerExternalReference = bodyObj.provider_external_reference;
  const proofUrlRaw = bodyObj.proof_url;
  const proofFilenameRaw = bodyObj.proof_filename;
  const proofUploadedAtRaw = bodyObj.proof_uploaded_at;

  const proof_url =
    typeof proofUrlRaw === "string" && proofUrlRaw.trim() !== ""
      ? proofUrlRaw.trim()
      : null;
  const proof_filename =
    typeof proofFilenameRaw === "string" && proofFilenameRaw.trim() !== ""
      ? proofFilenameRaw.trim()
      : null;
  const proof_uploaded_at =
    typeof proofUploadedAtRaw === "string" && proofUploadedAtRaw.trim() !== ""
      ? proofUploadedAtRaw.trim()
      : null;

  if (!isNonEmptyUuid(summaryId)) {
    return NextResponse.json(
      { error: "summary_id inválido ou ausente." },
      { status: 400 },
    );
  }

  if (!isPositiveMoney(amountRaw)) {
    return NextResponse.json(
      { error: "amount deve ser um valor monetário positivo." },
      { status: 400 },
    );
  }

  if (reason !== undefined && typeof reason !== "string") {
    return NextResponse.json(
      { error: "reason deve ser string." },
      { status: 400 },
    );
  }

  const amount = roundMoney(Number(amountRaw));

  const supabase = getAdminSupabaseClient();

  const { data: summary, error: summaryErr } = await supabase
    .from("ride_financial_summary")
    .select(
      "id, ride_id, driver_id, payment_method, gross_ride_amount, platform_commission_amount, economic_net_amount, payment_status, settlement_status, driver_owes_platform_amount, platform_owes_driver_amount, created_at",
    )
    .eq("id", summaryId.trim())
    .maybeSingle();

  if (summaryErr) {
    console.error("release-to-driver -> erro ao buscar summary:", summaryErr);
    return NextResponse.json(
      { error: "Erro interno ao carregar resumo financeiro." },
      { status: 500 },
    );
  }

  const s = summary as SummaryRow | null;

  if (!s) {
    return NextResponse.json(
      { error: "Resumo financeiro não encontrado." },
      { status: 404 },
    );
  }

  if (s.payment_status !== "pix_paid_to_platform") {
    return NextResponse.json(
      {
        error:
          "O recebimento do Pix ainda não foi confirmado na plataforma (aguardando pix_paid_to_platform).",
      },
      { status: 409 },
    );
  }

  if (
    s.settlement_status !== "platform_owes_driver" &&
    s.settlement_status !== "partially_released"
  ) {
    if (s.settlement_status === "fully_released") {
      return NextResponse.json({
        success: true,
        already_released: true,
        message: "Valor do Pix já foi totalmente liberado para o mototaxista.",
        summary_id: s.id,
      });
    }
    return NextResponse.json(
      { error: "Status de liquidação atual não permite liberação de valor ao mototaxista." },
      { status: 409 },
    );
  }

  const pendingAmount = roundMoney(Number(s.platform_owes_driver_amount) || 0);

  if (pendingAmount <= 0) {
    return NextResponse.json({
      success: true,
      already_released: true,
      message: "Nenhum valor pendente de liberação para este resumo.",
      summary_id: s.id,
    });
  }

  if (amount > pendingAmount) {
    return NextResponse.json(
      {
        error: `Valor informado (R$ ${amount.toFixed(
          2,
        )}) é superior ao saldo que a plataforma deve ao mototaxista (R$ ${pendingAmount.toFixed(2)}).`,
      },
      { status: 409 },
    );
  }

  const newPending = roundMoney(pendingAmount - amount);
  const newSettlementStatus = newPending <= 0 ? "fully_released" : "partially_released";

  const eventKey = `release_to_driver:${s.id}:${Date.now()}`;

  const summaryPatch: Record<string, any> = {
    platform_owes_driver_amount: newPending,
    settlement_status: newSettlementStatus,
    updated_at: new Date().toISOString(),
  };

  if (typeof providerPaymentId === "string" && providerPaymentId.trim() !== "") {
    summaryPatch.provider_payment_id = providerPaymentId.trim();
  }
  if (typeof providerExternalReference === "string" && providerExternalReference.trim() !== "") {
    summaryPatch.provider_external_reference = providerExternalReference.trim();
  }

  const { error: updateErr } = await supabase
    .from("ride_financial_summary")
    .update(summaryPatch)
    .eq("id", s.id);

  if (updateErr) {
    console.error("release-to-driver -> erro ao atualizar summary:", updateErr);
    return NextResponse.json(
      { error: "Erro interno ao registrar liberação de valor ao mototaxista." },
      { status: 500 },
    );
  }

  const movementPayload: Record<string, any> = {
    summary_id: s.id,
    ride_id: s.ride_id,
    driver_id: s.driver_id,
    movement_type: "debit",
    movement_code: "admin_adjustment_debit",
    amount: amount,
    reason:
      (typeof reason === "string" && reason.trim() !== "" ? reason.trim() + " | " : "") +
      `Liberação de Pix ao mototaxista. Pendência anterior R$ ${pendingAmount.toFixed(
        2,
      )} - liberado R$ ${amount.toFixed(2)} = R$ ${newPending.toFixed(2)}.`,
    responsible_type: "admin",
    responsible_id: "00000000-0000-0000-0000-000000000000",
    event_key: eventKey,
    proof_url: proof_url,
    proof_filename: proof_filename,
    proof_uploaded_at: proof_uploaded_at,
  };

  const { error: mvErr } = await supabase.from("financial_movements").insert([movementPayload]);

  if (mvErr) {
    console.error("release-to-driver -> erro ao inserir movement:", mvErr);
    return NextResponse.json(
      { error: "Erro interno ao registrar movimentação financeira." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    already_released: false,
    message:
      newSettlementStatus === "fully_released"
        ? "Valor totalmente liberado ao mototaxista."
        : "Valor parcialmente liberado ao mototaxista.",
    summary_id: s.id,
    event_key: eventKey,
    settlement_status: newSettlementStatus,
    amount_released: amount,
    previous_pending_amount: pendingAmount,
    new_pending_amount: newPending,
    movement_code_used: "admin_adjustment_debit",
    movement_code_note:
      "Nesta etapa, sem migration, foi reutilizado o código admin_adjustment_debit já permitido pela constraint movement_code, em vez de adicionar um novo movimento específico (ex: platform_settlement_paid).",
  });
}
