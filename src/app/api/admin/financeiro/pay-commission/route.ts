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
    console.error("pay-commission -> erro ao buscar summary:", summaryErr);
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

  if (s.payment_method !== "dinheiro") {
    return NextResponse.json(
      { error: "Este resumo não se refere a pagamento em dinheiro (comissão não devida)." },
      { status: 409 },
    );
  }

  if (
    s.settlement_status !== "driver_owes_platform" &&
    s.settlement_status !== "driver_debt_partially_settled"
  ) {
    if (s.settlement_status === "driver_debt_settled") {
      return NextResponse.json({
        success: true,
        already_settled: true,
        message: "Comissão desta corrida já está totalmente quitada.",
        summary_id: s.id,
      });
    }
    return NextResponse.json(
      { error: "Status de liquidação atual não permite abatimento de comissão." },
      { status: 409 },
    );
  }

  const pendingAmount = roundMoney(Number(s.driver_owes_platform_amount) || 0);

  if (pendingAmount <= 0) {
    return NextResponse.json({
      success: true,
      already_settled: true,
      message: "Nenhuma comissão pendente para este resumo.",
      summary_id: s.id,
    });
  }

  if (amount > pendingAmount) {
    return NextResponse.json(
      {
        error: `Valor informado (R$ ${amount.toFixed(
          2,
        )}) é superior ao saldo pendente de comissão (R$ ${pendingAmount.toFixed(2)}).`,
      },
      { status: 409 },
    );
  }

  const newPending = roundMoney(pendingAmount - amount);
  const newSettlementStatus =
    newPending <= 0 ? "driver_debt_settled" : "driver_debt_partially_settled";

  const eventKey = `commission_abatement:${s.id}:${Date.now()}`;

  const { error: updateErr } = await supabase
    .from("ride_financial_summary")
    .update({
      driver_owes_platform_amount: newPending,
      settlement_status: newSettlementStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", s.id);

  if (updateErr) {
    console.error("pay-commission -> erro ao atualizar summary:", updateErr);
    return NextResponse.json(
      { error: "Erro interno ao registrar pagamento de comissão." },
      { status: 500 },
    );
  }

  const movementPayload: Record<string, any> = {
    summary_id: s.id,
    ride_id: s.ride_id,
    driver_id: s.driver_id,
    movement_type: "abatement",
    movement_code: "pending_commission_abatement",
    amount: amount,
    reason:
      (typeof reason === "string" && reason.trim() !== "" ? reason.trim() + " | " : "") +
      `Abatimento de comissão (pendência R$ ${pendingAmount.toFixed(2)} - abatido R$ ${amount.toFixed(2)} = R$ ${newPending.toFixed(2)}).`,
    responsible_type: "admin",
    responsible_id: "00000000-0000-0000-0000-000000000000",
    event_key: eventKey,
  };

  const { error: mvErr } = await supabase.from("financial_movements").insert([movementPayload]);

  if (mvErr) {
    console.error("pay-commission -> erro ao inserir movement:", mvErr);
    return NextResponse.json(
      { error: "Erro interno ao registrar movimentação financeira." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    already_settled: false,
    message:
      newSettlementStatus === "driver_debt_settled"
        ? "Comissão totalmente quitada."
        : "Comissão parcialmente quitada.",
    summary_id: s.id,
    event_key: eventKey,
    settlement_status: newSettlementStatus,
    amount_settled: amount,
    previous_pending_amount: pendingAmount,
    new_pending_amount: newPending,
  });
}
