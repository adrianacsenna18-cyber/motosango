import { NextResponse } from "next/server";

import { getAdminSupabaseClient } from "@/lib/admin-supabase";

export async function GET() {
  try {
    const supabase = getAdminSupabaseClient();
    const { data, error } = await supabase.from("settings").select("*").limit(1);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, settings: data && data.length > 0 ? data[0] : null });
  } catch (error: any) {
    console.error("Erro ao ler settings:", error.message || error);
    return NextResponse.json(
      { error: "Erro interno ao ler configurações: " + (error.message || "Desconhecido") },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getAdminSupabaseClient();
    const body = await request.json();

    const {
      tarifa_base,
      mensalidade_valor,
      pix_admin,
      regra_noite,
      regra_sabado,
      regra_domingo,
      regra_feriado_nacional,
      regra_feriado_local
    } = body;

    const { data: currentSettings } = await supabase.from("settings").select("id").limit(1);

    const payload = {
      tarifa_base,
      mensalidade_valor,
      pix_admin,
      regra_noite,
      regra_sabado,
      regra_domingo,
      regra_feriado_nacional,
      regra_feriado_local,
      updated_at: new Date().toISOString(),
    };

    let resultError;

    if (currentSettings && currentSettings.length > 0) {
      const { error } = await supabase
        .from("settings")
        .update(payload)
        .eq("id", currentSettings[0].id);
      resultError = error;
    } else {
      const { error } = await supabase
        .from("settings")
        .insert([payload]);
      resultError = error;
    }

    if (resultError) {
      throw resultError;
    }

    return NextResponse.json({ success: true, message: "Configurações salvas com sucesso!" });
  } catch (error: any) {
    console.error("Erro ao salvar settings:", error.message || error);
    return NextResponse.json(
      { error: "Erro interno ao salvar configurações: " + (error.message || "Desconhecido") },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  return POST(request);
}
