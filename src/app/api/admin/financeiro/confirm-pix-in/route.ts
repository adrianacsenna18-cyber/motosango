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
  const reason = bodyObj.reason;
  const providerPaymentId = bodyObj.provider_payment_id;
  const providerExternalReference = bodyObj.provider_external_reference;

  if (!isNonEmptyUuid(summaryId)) {
    return NextResponse.json(
      { error: "summary_id inválido ou ausente." },
      { status: 400 },
    );
  }

  if (reason !== undefined && typeof reason !== "string") {
    return NextResponse.json(
      { error: "reason deve ser string." },
      { status: 400 },
    );
  }

  const supabase = getAdminSupabaseClient();

  const { data: summary, error: summaryErr } = await supabase
    .from("ride_financial_summary")
    .select(
      "id, ride_id, driver_id, payment_method, gross_ride_amount, platform_commission_amount, economic_net_amount, payment_status, settlement_status, driver_owes_platform_amount, platform_owes_driver_amount, created_at",
    )
    .eq("id", summaryId.trim())
    .maybeSingle();

  if (summaryErr) {
    console.error("confirm-pix-in -> erro ao buscar summary:", summaryErr);
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

  if (s.payment_method !== "pix") {
    return NextResponse.json(
      { error: "Este resumo não corresponde a uma corrida via Pix." },
      { status: 409 },
    );
  }

  if (s.payment_status === "pix_paid_to_platform") {
    return NextResponse.json(
      {
        success: true,
        already_processed: true,
        message: "Recebimento do Pix já havia sido confirmado anteriormente.",
        summary_id: s.id,
      },
      { status: 200 },
    );
  }

  if (s.payment_status !== "pix_pending") {
    return NextResponse.json(
      {
        error:
          "Status de pagamento atual não permite confirmação de recebimento (esperado pix_pending).",
      },
      { status: 409 },
    );
  }

  const net = roundMoney(Number(s.economic_net_amount) || 0);
  if (net <= 0) {
    return NextResponse.json(
      { error: "Valor líquido da corrida é inválido para liquidação." },
      { status: 409 },
    );
  }

  const newSummaryPatch: Record<string, any> = {
    payment_status: "pix_paid_to_platform",
    settlement_status: "platform_owes_driver",
    platform_owes_driver_amount: net,
    updated_at: new Date().toISOString(),
  };

  if (typeof providerPaymentId === "string" && providerPaymentId.trim() !== "") {
    newSummaryPatch.provider_payment_id = providerPaymentId.trim();
  }
  if (typeof providerExternalReference === "string" && providerExternalReference.trim() !== "") {
    newSummaryPatch.provider_external_reference = providerExternalReference.trim();
  }

  const eventKey = `pix_confirmed_in:${s.id}`;

  const { error: updateErr } = await supabase
    .from("ride_financial_summary")
    .update(newSummaryPatch)
    .eq("id", s.id);

  if (updateErr) {
    console.error("confirm-pix-in -> erro ao atualizar summary:", updateErr);
    return NextResponse.json(
      { error: "Erro interno ao confirmar recebimento do Pix." },
      { status: 500 },
    );
  }

  const movementPayload: Record<string, any> = {
    summary_id: s.id,
    ride_id: s.ride_id,
    driver_id: s.driver_id,
    movement_type: "credit",
    movement_code: "platform_payable_to_driver",
    amount: net,
    reason:
      (typeof reason === "string" && reason.trim() !== "" ? reason.trim() + " | " : "") +
      "Confirmação de recebimento do Pix na plataforma (liquidação pendência para o motorista).",
    responsible_type: "admin",
    responsible_id: "00000000-0000-0000-0000-000000000000",
    event_key: eventKey,
  };

  const { error: mvErr } = await supabase.from("financial_movements").insert([movementPayload]);

  if (mvErr) {
    if (mvErr.code === "23505") {
      return NextResponse.json({
        success: true,
        already_processed: true,
        message: "Recebimento do Pix já havia sido registrado (movimento duplicado evitado).",
        summary_id: s.id,
        event_key: eventKey,
      });
    }
    console.error("confirm-pix-in -> erro ao inserir movement:", mvErr);
    return NextResponse.json(
      { error: "Erro interno ao registrar movimentação financeira." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    already_processed: false,
    message: "Recebimento do Pix confirmado e pendência criada para o motorista.",
    summary_id: s.id,
    event_key: eventKey,
    settlement_status: newSummaryPatch.settlement_status,
    payment_status: newSummaryPatch.payment_status,
    platform_owes_driver_amount: net,
  });
}
