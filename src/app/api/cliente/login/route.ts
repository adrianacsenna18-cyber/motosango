import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { createClienteSessionResponse } from "@/lib/cliente-auth";

type ClienteLoginPayload = {
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
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Erro de configuração do servidor." },
        { status: 500 }
      );
    }

    const body = (await request.json()) as ClienteLoginPayload;
    const nome = body.nome?.trim() || "";
    const telefone = body.telefone?.trim() || "";

    if (!nome || !telefone) {
      return NextResponse.json(
        { error: "Nome e telefone são obrigatórios." },
        { status: 400 }
      );
    }

    const { cleanTelefone, formattedTelefone, telefonesBusca } = formatTelefone(telefone);

    if (cleanTelefone.length < 10 || cleanTelefone.length > 11) {
      return NextResponse.json(
        { error: "Informe o telefone com DDD." },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data: existingUsers, error: selectError } = await supabase
      .from("users")
      .select("id, nome, telefone")
      .in("telefone", telefonesBusca)
      .limit(1);

    if (selectError) {
      throw selectError;
    }

    if (existingUsers && existingUsers.length > 0) {
      return createClienteSessionResponse(existingUsers[0]);
    }

    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([{ nome, telefone: formattedTelefone }])
      .select("id, nome, telefone")
      .single();

    if (insertError) {
      throw insertError;
    }

    return createClienteSessionResponse(newUser);
  } catch (error: any) {
    console.error("Erro na API de login do cliente:", error.message || error);

    return NextResponse.json(
      { error: "Erro ao acessar. Tente novamente." },
      { status: 500 }
    );
  }
}
