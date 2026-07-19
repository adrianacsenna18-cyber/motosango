import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import {
  clearMotoSessionCookie,
  requireMotoSession,
} from "@/lib/moto-auth";

export const dynamic = "force-dynamic";

const DRIVER_SESSION_SELECT = `
  id,
  nome,
  telefone,
  foto_base64,
  modelo_moto,
  placa,
  chave_pix,
  cpf,
  status_online,
  aprovado_admin,
  bloqueado_mensalidade,
  status_plano,
  vencimento_mensalidade,
  vencimento_plano,
  mensalidade_valor
`;

export async function GET() {
  const auth = await requireMotoSession();

  if (!auth.authorized) {
    return auth.response;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json(
      { error: "Erro de configuração do servidor." },
      { status: 500 },
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data: driver, error } = await supabase
    .from("drivers")
    .select(DRIVER_SESSION_SELECT)
    .eq("id", auth.session.user.id)
    .maybeSingle();

  if (error || !driver || !driver.aprovado_admin) {
    return clearMotoSessionCookie(
      NextResponse.json(
        { error: "Sessão do mototaxista inválida ou expirada." },
        { status: 401 },
      ),
    );
  }

  return NextResponse.json({
    success: true,
    driver,
  });
}
