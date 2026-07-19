import { NextResponse } from "next/server";

import { getAdminSupabaseClient } from "@/lib/admin-supabase";

export const dynamic = "force-dynamic";

const COMMISSION_RATE = 0.15;

type RideRow = {
  id: string;
  motorista_id: string | null;
  valor: number | string | null;
  forma_pagamento: string | null;
  tipo_corrida: string | null;
  status: string | null;
};

function isValidRideValue(value: number | string | null) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) && numericValue > 0;
}

function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function getInitialSummaryValues(paymentMethod: "pix" | "dinheiro", rawGrossAmount: number) {
  const grossAmount = roundMoney(rawGrossAmount);
  const platformCommissionAmount = roundMoney(grossAmount * COMMISSION_RATE);
  const economicNetAmount = roundMoney(grossAmount - platformCommissionAmount);

  if (paymentMethod === "dinheiro") {
    return {
      commissionRateApplied: COMMISSION_RATE.toFixed(4),
      grossRideAmount: grossAmount,
      platformCommissionAmount,
      economicNetAmount,
      paymentStatus: "cash_received_by_driver" as const,
      settlementStatus: "driver_owes_platform" as const,
      driverDirectReceiptAmount: grossAmount,
      driverOwesPlatformAmount: platformCommissionAmount,
      platformOwesDriverAmount: 0,
    };
  }

  return {
    commissionRateApplied: COMMISSION_RATE.toFixed(4),
    grossRideAmount: grossAmount,
    platformCommissionAmount,
    economicNetAmount,
    paymentStatus: "pix_pending" as const,
    settlementStatus: "not_applicable" as const,
    driverDirectReceiptAmount: 0,
    driverOwesPlatformAmount: 0,
    platformOwesDriverAmount: 0,
  };
}

export async function POST(request: Request) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Payload inválido. Envie apenas ride_id." },
        { status: 400 },
      );
    }

    const bodyKeys = body && typeof body === "object" ? Object.keys(body) : [];
    const rideId =
      body && typeof body === "object" && "ride_id" in body ? body.ride_id : undefined;

    if (
      !body ||
      typeof body !== "object" ||
      bodyKeys.length !== 1 ||
      typeof rideId !== "string" ||
      rideId.trim() === ""
    ) {
      return NextResponse.json(
        { error: "Payload inválido. Envie apenas ride_id." },
        { status: 400 },
      );
    }

    const supabase = getAdminSupabaseClient();

    const { data: rideData, error: rideError } = await supabase
      .from("rides")
      .select("id, motorista_id, valor, forma_pagamento, tipo_corrida, status")
      .eq("id", rideId.trim())
      .maybeSingle();

    if (rideError) {
      throw rideError;
    }

    const ride = rideData as RideRow | null;

    if (!ride) {
      return NextResponse.json(
        { error: "Corrida não encontrada." },
        { status: 404 },
      );
    }

    if (ride.status !== "concluido") {
      return NextResponse.json(
        { error: "A corrida precisa estar exatamente com status concluido." },
        { status: 409 },
      );
    }

    if (!ride.motorista_id) {
      return NextResponse.json(
        { error: "A corrida concluída não possui motorista vinculado." },
        { status: 409 },
      );
    }

    if (!isValidRideValue(ride.valor)) {
      return NextResponse.json(
        { error: "A corrida concluída não possui valor final válido." },
        { status: 409 },
      );
    }

    if (ride.forma_pagamento !== "pix" && ride.forma_pagamento !== "dinheiro") {
      return NextResponse.json(
        { error: "A corrida concluída não possui forma_pagamento válida." },
        { status: 409 },
      );
    }

    const { data: existingSummary, error: existingSummaryError } = await supabase
      .from("ride_financial_summary")
      .select("id, ride_id")
      .eq("ride_id", ride.id)
      .maybeSingle();

    if (existingSummaryError) {
      throw existingSummaryError;
    }

    if (existingSummary) {
      return NextResponse.json({
        success: true,
        alreadyExists: true,
        message: "O resumo financeiro desta corrida já estava criado.",
        summary: existingSummary,
      });
    }

    const summaryValues = getInitialSummaryValues(ride.forma_pagamento, Number(ride.valor));

    const insertPayload = {
      ride_id: ride.id,
      driver_id: ride.motorista_id,
      financial_event_type: "completed_ride",
      payment_method: ride.forma_pagamento,
      commission_rate_applied: summaryValues.commissionRateApplied,
      gross_ride_amount: summaryValues.grossRideAmount,
      platform_commission_amount: summaryValues.platformCommissionAmount,
      economic_net_amount: summaryValues.economicNetAmount,
      driver_direct_receipt_amount: summaryValues.driverDirectReceiptAmount,
      driver_owes_platform_amount: summaryValues.driverOwesPlatformAmount,
      platform_owes_driver_amount: summaryValues.platformOwesDriverAmount,
      payment_status: summaryValues.paymentStatus,
      settlement_status: summaryValues.settlementStatus,
    };

    const { data: createdSummary, error: insertError } = await supabase
      .from("ride_financial_summary")
      .insert([insertPayload])
      .select("id, ride_id")
      .single();

    if (insertError) {
      if (insertError.code === "23505") {
        const { data: duplicatedSummary, error: duplicatedSummaryError } = await supabase
          .from("ride_financial_summary")
          .select("id, ride_id")
          .eq("ride_id", ride.id)
          .maybeSingle();

        if (duplicatedSummaryError) {
          throw duplicatedSummaryError;
        }

        return NextResponse.json({
          success: true,
          alreadyExists: true,
          message: "O resumo financeiro desta corrida já havia sido criado por outra solicitação.",
          summary: duplicatedSummary,
        });
      }

      throw insertError;
    }

    return NextResponse.json({
      success: true,
      alreadyExists: false,
      message: "Resumo financeiro criado com sucesso.",
      summary: createdSummary,
    });
  } catch (error: any) {
    console.error("Erro ao criar resumo financeiro da corrida:", error.message || error);
    return NextResponse.json(
      { error: "Erro interno ao criar resumo financeiro da corrida." },
      { status: 500 },
    );
  }
}
