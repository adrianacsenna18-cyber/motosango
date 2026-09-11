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
  driver_direct_receipt_amount: number;
  driver_owes_platform_amount: number;
  platform_owes_driver_amount: number;
  payment_status: string;
  settlement_status: string;
  created_at: string;
  ride?: any;
  driver?: any;
};

export async function GET(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    const supabase = getAdminSupabaseClient();

    let query = supabase
      .from("ride_financial_summary")
      .select(
        `
        id,
        ride_id,
        driver_id,
        payment_method,
        gross_ride_amount,
        platform_commission_amount,
        economic_net_amount,
        driver_direct_receipt_amount,
        driver_owes_platform_amount,
        platform_owes_driver_amount,
        payment_status,
        settlement_status,
        created_at,
        ride:rides(id, created_at, origem, destino, valor, forma_pagamento, tipo_corrida, status, users(nome)),
        driver:drivers(id, nome, telefone, chave_pix)
      `,
      )
      .order("created_at", { ascending: false });

    if (startDate) {
      try {
        const d = new Date(startDate);
        if (Number.isFinite(d.getTime())) query = query.gte("created_at", d.toISOString());
      } catch {
        /* ignore */
      }
    }
    if (endDate) {
      try {
        const d = new Date(endDate);
        if (Number.isFinite(d.getTime())) query = query.lte("created_at", d.toISOString());
      } catch {
        /* ignore */
      }
    }

    const { data, error } = await query;
    if (error) throw error;

    const records = ((data as SummaryRow[]) || []).map((r) => {
      const rawRide = r.ride;
      let rideObj: any = null;
      if (rawRide) {
        rideObj = Array.isArray(rawRide) ? rawRide[0] || null : rawRide;
        if (rideObj && rideObj.users) {
          const u = rideObj.users;
          rideObj.cliente_nome = Array.isArray(u) ? u[0]?.nome || null : u?.nome || null;
        }
      }
      const rawDriver = r.driver;
      const driverObj = Array.isArray(rawDriver) ? rawDriver[0] || null : rawDriver || null;

      return {
        id: r.id,
        ride_id: r.ride_id,
        driver_id: r.driver_id,
        payment_method: r.payment_method,
        gross_ride_amount: Number(r.gross_ride_amount) || 0,
        platform_commission_amount: Number(r.platform_commission_amount) || 0,
        economic_net_amount: Number(r.economic_net_amount) || 0,
        driver_direct_receipt_amount: Number(r.driver_direct_receipt_amount) || 0,
        driver_owes_platform_amount: Number(r.driver_owes_platform_amount) || 0,
        platform_owes_driver_amount: Number(r.platform_owes_driver_amount) || 0,
        payment_status: r.payment_status,
        settlement_status: r.settlement_status,
        created_at: r.created_at,
        ride: rideObj,
        driver: driverObj,
      };
    });

    // === RESUMO TOTAL ===
    const totals = records.reduce(
      (acc, r) => {
        acc.total_gross += r.gross_ride_amount;
        acc.total_commission += r.platform_commission_amount;
        acc.total_net += r.economic_net_amount;
        acc.total_driver_direct_receipt += r.driver_direct_receipt_amount;
        acc.total_driver_owes += r.driver_owes_platform_amount;
        acc.total_platform_owes += r.platform_owes_driver_amount;
        acc.rides_count += 1;
        return acc;
      },
      {
        total_gross: 0,
        total_commission: 0,
        total_net: 0,
        total_driver_direct_receipt: 0,
        total_driver_owes: 0,
        total_platform_owes: 0,
        rides_count: 0,
      },
    );

    const totalsRounded = {
      total_gross: roundMoney(totals.total_gross),
      total_commission: roundMoney(totals.total_commission),
      total_net: roundMoney(totals.total_net),
      total_driver_direct_receipt: roundMoney(totals.total_driver_direct_receipt),
      total_driver_owes: roundMoney(totals.total_driver_owes),
      total_platform_owes: roundMoney(totals.total_platform_owes),
      rides_count: totals.rides_count,
    };

    // === POR MOTOTAXISTA ===
    const byDriverMap = new Map<
      string,
      {
        driver_id: string;
        driver_nome: string;
        driver_telefone: string | null;
        driver_chave_pix: string | null;
        rides_count: number;
        gross: number;
        commission: number;
        net: number;
        driver_owes: number;
        platform_owes: number;
        // "já repassado" = liquidações executadas. Como a migration não tem um campo específico,
        // aproximamos: o que foi repassado = (líquido total) - (pendência atual da plataforma).
        // Se necessário, futuramente pode ser baseado em financial_movements de abatimento.
      }
    >();

    records.forEach((r) => {
      const id = r.driver_id;
      const prev = byDriverMap.get(id) || {
        driver_id: id,
        driver_nome: r.driver?.nome || "Mototaxista #" + id.slice(0, 6),
        driver_telefone: r.driver?.telefone || null,
        driver_chave_pix: r.driver?.chave_pix || null,
        rides_count: 0,
        gross: 0,
        commission: 0,
        net: 0,
        driver_owes: 0,
        platform_owes: 0,
      };
      prev.rides_count += 1;
      prev.gross += r.gross_ride_amount;
      prev.commission += r.platform_commission_amount;
      prev.net += r.economic_net_amount;
      prev.driver_owes = r.driver_owes_platform_amount; // Último registro da soma
      prev.platform_owes = r.platform_owes_driver_amount;
      byDriverMap.set(id, prev);
    });

    // Soma acumulada real (último valor pendente por driver é por summary; para total do período
    // usamos a soma das pendências por summary)
    const perDriver = Array.from(byDriverMap.values()).map((d) => {
      const pendingOwes = records
        .filter((r) => r.driver_id === d.driver_id)
        .reduce((a, r) => a + r.driver_owes_platform_amount, 0);
      const pendingPlatform = records
        .filter((r) => r.driver_id === d.driver_id)
        .reduce((a, r) => a + r.platform_owes_driver_amount, 0);

      // "já repassado" = líquido econômico acumulado - pendência da plataforma (aproximação)
      const repassado = Math.max(0, roundMoney(d.net - pendingPlatform));

      return {
        driver_id: d.driver_id,
        driver_nome: d.driver_nome,
        driver_telefone: d.driver_telefone,
        driver_chave_pix: d.driver_chave_pix,
        rides_count: d.rides_count,
        gross: roundMoney(d.gross),
        commission: roundMoney(d.commission),
        net: roundMoney(d.net),
        driver_owes_pending: roundMoney(pendingOwes), // comissão que motorista ainda deve
        platform_owes_pending: roundMoney(pendingPlatform), // valor que plataforma deve liberar
        repassado,
      };
    });

    // === VALORES PENDENTES GLOBAIS ===
    const pendingOwesTotal = roundMoney(
      records.reduce((a, r) => a + r.driver_owes_platform_amount, 0),
    );
    const pendingPlatformTotal = roundMoney(
      records.reduce((a, r) => a + r.platform_owes_driver_amount, 0),
    );

    return NextResponse.json({
      success: true,
      filters: { start_date: startDate, end_date: endDate },
      counts: { records: records.length },
      totals: {
        ...totalsRounded,
        pending_driver_owes_total: pendingOwesTotal,
        pending_platform_owes_total: pendingPlatformTotal,
      },
      per_driver: perDriver,
      records,
    });
  } catch (err: any) {
    console.error("admin/financeiro/overview ->", err?.message || err);
    return NextResponse.json(
      { error: "Erro interno ao carregar visão geral financeira." },
      { status: 500 },
    );
  }
}
