import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client using service role key
const getSupabase = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jeulwmhsiftstikszoku.supabase.co';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_publishable_QUb7JP_TwRgxJ9JlMoZMBg_yl-zBvgz';

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.from("settings").select("*").limit(1);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, settings: data && data.length > 0 ? data[0] : null });
  } catch (error: any) {
    console.error("Erro ao ler settings:", error.message || error);
    return NextResponse.json(
      { error: "Erro interno ao ler configurações: " + (error.message || "Desconhecido") },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabase();
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

    // Primeiro busca o ID da configuração
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
      updated_at: new Date().toISOString()
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
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  return POST(request);
}
