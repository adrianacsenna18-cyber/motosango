import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { createMotoSessionResponse } from "@/lib/moto-auth";
import type { MotoSessionUser } from "@/lib/moto-session";

type MotoLoginPayload = {
  nome?: string;
  telefone?: string;
};

const formatTelefone = (telefone: string) => {
  let cleanTelefone = telefone.replace(/\D/g, "");

  if (cleanTelefone.startsWith("55") && cleanTelefone.length >= 12) {
    cleanTelefone = cleanTelefone.substring(2);
  }

  const ddd = cleanTelefone.substring(0, 2);
  const numero = cleanTelefone.substring(2);
  const formattedTelefone =
    numero.length === 9
      ? `+55 ${ddd} ${numero.substring(0, 5)}-${numero.substring(5)}`
      : `+55 ${ddd} ${numero.substring(0, 4)}-${numero.substring(4)}`;

  return {
    cleanTelefone,
    formattedTelefone,
    telefonesBusca: [formattedTelefone, cleanTelefone, telefone].filter(Boolean),
  };
};

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Erro de configuração do servidor." },
        { status: 500 },
      );
    }

    const body = (await request.json()) as MotoLoginPayload;
    const nome = body.nome?.trim() || "";
    const telefone = body.telefone?.trim() || "";

    if (!nome || !telefone) {
      return NextResponse.json(
        { error: "Nome e telefone são obrigatórios." },
        { status: 400 },
      );
    }

    const { cleanTelefone, telefonesBusca } = formatTelefone(telefone);

    if (cleanTelefone.length < 10 || cleanTelefone.length > 11) {
      return NextResponse.json(
        { error: "Informe o telefone com DDD." },
        { status: 400 },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data, error } = await supabase
      .from("drivers")
      .select("*")
      .in("telefone", telefonesBusca)
      .ilike("nome", `%${nome}%`)

    if (error || !data || data.length === 0) {
      return NextResponse.json(
        {
          error:
            "Credenciais incorretas ou mototaxista não encontrado. Verifique se os dados estão corretos.",
        },
        { status: 401 },
      );
    }

    const driver = data[0];

    if (!driver.aprovado_admin) {
      return NextResponse.json(
        { error: "Seu cadastro ainda está aguardando aprovação do administrador." },
        { status: 403 },
      );
    }

    const sessionUser: MotoSessionUser = {
      id: driver.id,
      nome: driver.nome,
      telefone: driver.telefone,
    };

    return createMotoSessionResponse(sessionUser, driver);
  } catch (error: any) {
    console.error("Erro na API de login do mototaxista:", error.message || error);

    return NextResponse.json(
      { error: "Erro ao acessar. Tente novamente." },
      { status: 500 },
    );
  }
}
