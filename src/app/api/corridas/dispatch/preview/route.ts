import { NextResponse } from "next/server";

import { getAdminSupabaseClient } from "@/lib/admin-supabase";
import { requireAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const PREVIEW_LIMIT = 5;
const RECENT_LOCATION_MINUTES = 60;

function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const toRad = (v: number) => (v * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    let body: any = null;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Payload JSON inválido." },
        { status: 400 }
      );
    }

    const isObj = body && typeof body === "object";
    const bodyObj = isObj ? (body as Record<string, unknown>) : null;
    const rideIdRaw = bodyObj && "ride_id" in bodyObj ? bodyObj.ride_id : undefined;
    const rideId = typeof rideIdRaw === "string" ? rideIdRaw.trim() : "";

    if (!rideId) {
      return NextResponse.json(
        { success: false, error: "ride_id é obrigatório." },
        { status: 400 }
      );
    }

    const supabase = getAdminSupabaseClient();

    const { data: ride, error: rideErr } = await supabase
      .from("rides")
      .select("id, status, origem_lat, origem_lng, origem, created_at")
      .eq("id", rideId)
      .maybeSingle();

    if (rideErr) {
      console.error("[DISPATCH PREVIEW] Erro ao buscar corrida:", rideErr);
      return NextResponse.json(
        { success: false, error: "Erro ao consultar corrida." },
        { status: 500 }
      );
    }

    if (!ride) {
      return NextResponse.json(
        { success: false, error: "Corrida não encontrada." },
        { status: 404 }
      );
    }

    if (String(ride.status ?? "").toLowerCase() !== "aguardando") {
      return NextResponse.json(
        {
          success: false,
          error: "Corrida não está em status 'aguardando'.",
          ride_status: ride.status,
        },
        { status: 409 }
      );
    }

    const origemLat =
      typeof ride.origem_lat === "number" && Number.isFinite(ride.origem_lat)
        ? ride.origem_lat
        : null;
    const origemLng =
      typeof ride.origem_lng === "number" && Number.isFinite(ride.origem_lng)
        ? ride.origem_lng
        : null;

    if (origemLat === null || origemLng === null) {
      return NextResponse.json(
        {
          success: false,
          error: "Coordenadas de origem insuficientes para matching por proximidade.",
          ride_id: ride.id,
          origem_lat: ride.origem_lat ?? null,
          origem_lng: ride.origem_lng ?? null,
        },
        { status: 409 }
      );
    }

    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();
    const recentLocationCutoff = new Date(
      Date.now() - RECENT_LOCATION_MINUTES * 60 * 1000
    ).toISOString();

    const { data: activeRides, error: activeErr } = await supabase
      .from("rides")
      .select("motorista_id")
      .in("status", ["aceito", "a_caminho", "em_andamento"])
      .gte("created_at", twelveHoursAgo)
      .not("motorista_id", "is", null);

    if (activeErr) {
      console.error(
        "[DISPATCH PREVIEW] Erro ao buscar corridas ativas:",
        activeErr
      );
      return NextResponse.json(
        { success: false, error: "Erro ao identificar motoristas ocupados." },
        { status: 500 }
      );
    }

    const occupiedDriverIds = new Set<string>();
    if (activeRides) {
      for (const r of activeRides) {
        if (r.motorista_id) occupiedDriverIds.add(String(r.motorista_id));
      }
    }

    const { data: drivers, error: driversErr } = await supabase
      .from("drivers")
      .select("id, nome, lat, lng, last_location_update, status_online, aprovado_admin, bloqueado_mensalidade, status_plano")
      .eq("status_online", true)
      .not("lat", "is", null)
      .not("lng", "is", null)
      .gte("last_location_update", recentLocationCutoff)
      .order("last_location_update", { ascending: false });

    if (driversErr) {
      console.error(
        "[DISPATCH PREVIEW] Erro ao buscar motoristas online:",
        driversErr
      );
      return NextResponse.json(
        { success: false, error: "Erro ao consultar motoristas." },
        { status: 500 }
      );
    }

    type Candidate = {
      driver_id: string;
      nome: string;
      distancia_km: number;
      localizacao_disponivel: boolean;
      status_online: boolean;
      last_location_update: string | null;
    };

    const candidates: Candidate[] = [];

    if (drivers && drivers.length > 0) {
      for (const d of drivers) {
        if (!d || !d.id) continue;
        if (occupiedDriverIds.has(String(d.id))) continue;
        if (!d.aprovado_admin) continue;
        if (d.bloqueado_mensalidade) continue;
        if (
          typeof d.lat !== "number" ||
          !Number.isFinite(d.lat) ||
          typeof d.lng !== "number" ||
          !Number.isFinite(d.lng)
        ) {
          continue;
        }

        const distancia = haversineKm(origemLat, origemLng, d.lat, d.lng);
        if (!Number.isFinite(distancia) || distancia < 0) continue;

        candidates.push({
          driver_id: String(d.id),
          nome: typeof d.nome === "string" ? d.nome : "Mototaxista",
          distancia_km: Math.round(distancia * 1000) / 1000,
          localizacao_disponivel: true,
          status_online: Boolean(d.status_online),
          last_location_update:
            typeof d.last_location_update === "string"
              ? d.last_location_update
              : null,
        });
      }
    }

    candidates.sort((a, b) => a.distancia_km - b.distancia_km);

    const topCandidates = candidates.slice(0, PREVIEW_LIMIT);

    return NextResponse.json({
      success: true,
      preview: true,
      ride_id: ride.id,
      ride_status: ride.status,
      origin: {
        lat: origemLat,
        lng: origemLng,
      },
      filters: {
        recent_location_minutes: RECENT_LOCATION_MINUTES,
        recent_location_cutoff: recentLocationCutoff,
        occupied_driver_ids_count: occupiedDriverIds.size,
        online_eligible_pool_size: candidates.length,
        preview_limit: PREVIEW_LIMIT,
      },
      candidates_count: topCandidates.length,
      candidates: topCandidates,
    });
  } catch (error: any) {
    console.error("[DISPATCH PREVIEW] Erro inesperado:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro inesperado ao gerar preview de candidatos.",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
