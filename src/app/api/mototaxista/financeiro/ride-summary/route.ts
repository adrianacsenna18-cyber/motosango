import { NextResponse } from "next/server";

import { getAdminSupabaseClient } from "@/lib/admin-supabase";
import { requireMotoSession } from "@/lib/moto-auth";

export const dynamic = "force-dynamic";

type RideSummaryRow = {
  id: string;
  ride_id: string;
  driver_id: string;
  financial_event_type: string;
  payment_method: string;
  commission_rate_applied: string;
  gross_ride_amount: number;
  platform_commission_amount: number;
  economic_net_amount: number;
  driver_direct_receipt_amount: number;
  driver_owes_platform_amount: number;
  platform_owes_driver_amount: number;
  payment_status: string;
  settlement_status: string;
  created_at: string;
  ride?:
    | Array<{
        id: string;
        created_at: string;
        origem: string | null;
        destino: string | null;
        valor: number | null;
        forma_pagamento: string | null;
        tipo_corrida: string | null;
        status: string | null;
      }>
    | {
        id: string;
        created_at: string;
        origem: string | null;
        destino: string | null;
        valor: number | null;
        forma_pagamento: string | null;
        tipo_corrida: string | null;
        status: string | null;
      }
    | null;
};

type RideSummaryWithRide = Omit<RideSummaryRow, "ride"> & {
  ride: {
    id: string;
    created_at: string;
    origem: string | null;
    destino: string | null;
    valor: number | null;
    forma_pagamento: string | null;
    tipo_corrida: string | null;
    status: string | null;
  } | null;
};

export async function GET(request: Request) {
  try {
    const auth = await requireMotoSession();

    if (!auth.authorized) {
      return auth.response;
    }

    const driverId = auth.session.user.id;

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const limitRaw = searchParams.get("limit");
    const offsetRaw = searchParams.get("offset");

    const limit = limitRaw ? Number(limitRaw) : 500;
    const offset = offsetRaw ? Number(offsetRaw) : 0;

    const supabase = getAdminSupabaseClient();

    let query = supabase
      .from("ride_financial_summary")
      .select(
        `
        id,
        ride_id,
        driver_id,
        financial_event_type,
        payment_method,
        commission_rate_applied,
        gross_ride_amount,
        platform_commission_amount,
        economic_net_amount,
        driver_direct_receipt_amount,
        driver_owes_platform_amount,
        platform_owes_driver_amount,
        payment_status,
        settlement_status,
        created_at,
        ride:rides (
          id,
          created_at,
          origem,
          destino,
          valor,
          forma_pagamento,
          tipo_corrida,
          status
        )
      `,
      )
      .eq("driver_id", driverId)
      .order("created_at", { ascending: false })
      .order("created_at", { foreignTable: "rides", ascending: false });

    if (startDate) {
      query = query.gte("created_at", startDate);
    }

    if (endDate) {
      query = query.lte("created_at", endDate);
    }

    if (Number.isFinite(limit) && limit > 0) {
      query = query.limit(limit);
    }

    if (Number.isFinite(offset) && offset > 0) {
      query = query.range(offset, offset + (Number.isFinite(limit) && limit > 0 ? limit - 1 : 499));
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    const rawRecords = (data as RideSummaryRow[]) || [];

    const records: RideSummaryWithRide[] = rawRecords.map((r) => {
      const rawRide = r.ride;
      let ride: RideSummaryWithRide["ride"] = null;

      if (rawRide) {
        if (Array.isArray(rawRide) && rawRide.length > 0) {
          ride = rawRide[0];
        } else if (!Array.isArray(rawRide)) {
          ride = rawRide;
        }
      }

      return {
        id: r.id,
        ride_id: r.ride_id,
        driver_id: r.driver_id,
        financial_event_type: r.financial_event_type,
        payment_method: r.payment_method,
        commission_rate_applied: r.commission_rate_applied,
        gross_ride_amount: r.gross_ride_amount,
        platform_commission_amount: r.platform_commission_amount,
        economic_net_amount: r.economic_net_amount,
        driver_direct_receipt_amount: r.driver_direct_receipt_amount,
        driver_owes_platform_amount: r.driver_owes_platform_amount,
        platform_owes_driver_amount: r.platform_owes_driver_amount,
        payment_status: r.payment_status,
        settlement_status: r.settlement_status,
        created_at: r.created_at,
        ride,
      };
    });

    const totalGrossAmount = records.reduce((acc, r) => acc + (Number(r.gross_ride_amount) || 0), 0);
    const totalNetAmount = records.reduce((acc, r) => acc + (Number(r.economic_net_amount) || 0), 0);
    const totalCommissionAmount = records.reduce(
      (acc, r) => acc + (Number(r.platform_commission_amount) || 0),
      0,
    );
    const totalDriverOwes = records.reduce(
      (acc, r) => acc + (Number(r.driver_owes_platform_amount) || 0),
      0,
    );
    const totalPlatformOwes = records.reduce(
      (acc, r) => acc + (Number(r.platform_owes_driver_amount) || 0),
      0,
    );
    const totalDriverDirectReceipt = records.reduce(
      (acc, r) => acc + (Number(r.driver_direct_receipt_amount) || 0),
      0,
    );

    return NextResponse.json({
      success: true,
      driver_id: driverId,
      count: records.length,
      totals: {
        gross_ride_amount: Number(totalGrossAmount.toFixed(2)),
        economic_net_amount: Number(totalNetAmount.toFixed(2)),
        platform_commission_amount: Number(totalCommissionAmount.toFixed(2)),
        driver_direct_receipt_amount: Number(totalDriverDirectReceipt.toFixed(2)),
        driver_owes_platform_amount: Number(totalDriverOwes.toFixed(2)),
        platform_owes_driver_amount: Number(totalPlatformOwes.toFixed(2)),
      },
      records,
    });
  } catch (error: any) {
    console.error(
      "Erro ao consultar resumos financeiros do mototaxista:",
      error?.message || error,
    );
    return NextResponse.json(
      { error: "Erro interno ao consultar resumos financeiros." },
      { status: 500 },
    );
  }
}
