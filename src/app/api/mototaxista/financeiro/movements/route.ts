import { NextResponse } from "next/server";

import { getAdminSupabaseClient } from "@/lib/admin-supabase";
import { requireMotoSession } from "@/lib/moto-auth";

export const dynamic = "force-dynamic";

type MovementRow = {
  id: string;
  summary_id: string;
  ride_id: string;
  driver_id: string;
  movement_type: string;
  movement_code: string;
  amount: number;
  created_at: string;
  proof_url: string | null;
  proof_filename: string | null;
  proof_uploaded_at: string | null;
};

export async function GET(request: Request) {
  const auth = await requireMotoSession();
  if (!auth.authorized) return auth.response;

  try {
    const driverId = auth.session.user.id;
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const limitRaw = searchParams.get("limit");
    const offsetRaw = searchParams.get("offset");
    const onlyWithProof = searchParams.get("only_with_proof") === "1";

    const limit = Math.min(1000, limitRaw ? Number(limitRaw) : 500);
    const offset = offsetRaw ? Number(offsetRaw) : 0;

    const supabase = getAdminSupabaseClient();

    let query = supabase
      .from("financial_movements")
      .select(
        `
        id,
        summary_id,
        ride_id,
        driver_id,
        movement_type,
        movement_code,
        amount,
        created_at,
        proof_url,
        proof_filename,
        proof_uploaded_at
      `,
      )
      .eq("driver_id", driverId)
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
    if (onlyWithProof) {
      query = query.not("proof_url", "is", null);
    }

    const { data, error } = await query.range(offset, offset + Math.max(0, limit - 1));
    if (error) throw error;

    const rows = ((data as MovementRow[]) || []).map((r) => ({
      id: r.id,
      summary_id: r.summary_id,
      ride_id: r.ride_id,
      driver_id: r.driver_id,
      movement_type: r.movement_type,
      movement_code: r.movement_code,
      amount: Number(r.amount) || 0,
      created_at: r.created_at,
      proof_url:
        typeof r.proof_url === "string" && r.proof_url.trim() !== "" ? r.proof_url : null,
      proof_filename:
        typeof r.proof_filename === "string" && r.proof_filename.trim() !== ""
          ? r.proof_filename
          : null,
      proof_uploaded_at:
        typeof r.proof_uploaded_at === "string" && r.proof_uploaded_at.trim() !== ""
          ? r.proof_uploaded_at
          : null,
    }));

    const bySummaryMap = new Map<string, any[]>();
    for (const r of rows) {
      if (!r.summary_id) continue;
      const arr = bySummaryMap.get(r.summary_id) || [];
      arr.push(r);
      bySummaryMap.set(r.summary_id, arr);
    }

    return NextResponse.json({
      success: true,
      driver_id: driverId,
      filters: {
        start_date: startDate,
        end_date: endDate,
        only_with_proof: onlyWithProof,
      },
      rows,
      by_summary: Object.fromEntries(bySummaryMap),
    });
  } catch (err: any) {
    console.error("mototaxista/financeiro/movements ->", err?.message || err);
    return NextResponse.json(
      { error: "Erro interno ao consultar movimentações financeiras." },
      { status: 500 },
    );
  }
}
