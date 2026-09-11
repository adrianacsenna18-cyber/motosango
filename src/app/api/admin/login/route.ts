import { NextResponse } from "next/server";

import { createAdminSessionResponse } from "@/lib/admin-auth";
import { getAdminSupabaseClient } from "@/lib/admin-supabase";

export async function POST(request: Request) {
  try {
    const supabase = getAdminSupabaseClient();

    const { login, senha } = await request.json();

    if (!login || !senha) {
      return NextResponse.json(
        { error: "Login e senha são obrigatórios" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("admin")
      .select("login")
      .eq("login", login)
      .eq("senha", senha)
      .limit(1);

    if (error || !data || data.length === 0) {
      return NextResponse.json(
        { error: "Credenciais incorretas" },
        { status: 401 },
      );
    }

    return createAdminSessionResponse(data[0].login);
  } catch (error: any) {
    console.error("Erro na API de login do admin:", error.message || error);
    return NextResponse.json(
      { error: "Erro interno do servidor: " + (error.message || "Desconhecido") },
      { status: 500 },
    );
  }
}
