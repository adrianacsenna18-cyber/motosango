import { NextResponse } from "next/server";

import { createMotoSessionResponse } from "@/lib/moto-auth";
import { getAdminSupabaseClient } from "@/lib/admin-supabase";

export const dynamic = "force-dynamic";

type DriverRow = {
  id: string;
  nome: string;
  telefone: string;
  foto_base64?: string | null;
  modelo_moto?: string | null;
  placa?: string | null;
  chave_pix?: string | null;
  cpf?: string | null;
  status_online?: boolean | null;
  aprovado_admin?: boolean | null;
};

export async function POST(request: Request) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Payload inválido." },
        { status: 400 },
      );
    }

    const telefone =
      body && typeof body === "object" && "telefone" in body
        ? (body as any).telefone
        : undefined;
    const nome =
      body && typeof body === "object" && "nome" in body
        ? (body as any).nome
        : undefined;

    if (
      typeof telefone !== "string" ||
      telefone.trim() === "" ||
      typeof nome !== "string" ||
      nome.trim() === ""
    ) {
      return NextResponse.json(
        { error: "Telefone e nome são obrigatórios." },
        { status: 400 },
      );
    }

    let cleanTelefone = telefone.replace(/\D/g, "");
    const cleanNome = nome.trim();

    if (cleanTelefone.startsWith("55") && cleanTelefone.length >= 12) {
      cleanTelefone = cleanTelefone.substring(2);
    }

    if (cleanTelefone.length < 10 || cleanTelefone.length > 11) {
      return NextResponse.json(
        { error: "Informe o telefone com DDD." },
        { status: 400 },
      );
    }

    let formattedTelefone = cleanTelefone;
    const ddd = cleanTelefone.substring(0, 2);
    const numero = cleanTelefone.substring(2);

    if (cleanTelefone.startsWith("55") && cleanTelefone.length >= 12) {
      const dddInterno = cleanTelefone.substring(2, 4);
      const numeroInterno = cleanTelefone.substring(4);
      formattedTelefone = numeroInterno.length === 9
        ? `+55 ${dddInterno} ${numeroInterno.substring(0, 5)}-${numeroInterno.substring(5)}`
        : `+55 ${dddInterno} ${numeroInterno.substring(0, 4)}-${numeroInterno.substring(4)}`;
    } else {
      formattedTelefone = numero.length === 9
        ? `+55 ${ddd} ${numero.substring(0, 5)}-${numero.substring(5)}`
        : `+55 ${ddd} ${numero.substring(0, 4)}-${numero.substring(4)}`;
    }

    const supabase = getAdminSupabaseClient();

    const { data, error } = await supabase
      .from("drivers")
      .select(
        `
        id,
        nome,
        telefone,
        foto_base64,
        modelo_moto,
        placa,
        chave_pix,
        cpf,
        status_online,
        aprovado_admin
      `,
      )
      .in("telefone", [formattedTelefone, cleanTelefone, telefone])
      .ilike("nome", `%${cleanNome}%`)
      .limit(1);

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Credenciais incorretas ou mototaxista não encontrado. Verifique se os dados estão corretos." },
        { status: 401 },
      );
    }

    const driver = data[0] as DriverRow;

    if (!driver.aprovado_admin) {
      return NextResponse.json(
        { error: "Seu cadastro ainda está aguardando aprovação do administrador." },
        { status: 403 },
      );
    }

    return createMotoSessionResponse({
      id: driver.id,
      nome: driver.nome,
      telefone: driver.telefone,
      modelo_moto: driver.modelo_moto ?? null,
      placa: driver.placa ?? null,
      chave_pix: driver.chave_pix ?? null,
      cpf: driver.cpf ?? null,
      status_online: driver.status_online ?? null,
      aprovado_admin: driver.aprovado_admin ?? null,
    });
  } catch (error: any) {
    console.error("Erro na API de login do mototaxista:", error?.message || error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 },
    );
  }
}
