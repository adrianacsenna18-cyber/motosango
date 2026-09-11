import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  CLIENTE_SESSION_COOKIE,
  type ClienteSessionUser,
  createClienteSessionToken,
  getClienteSessionExpiresAt,
  isClienteSessionConfigured,
  verifyClienteSessionToken,
} from "@/lib/cliente-session";

function getCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  };
}

export async function createClienteSessionResponse(user: ClienteSessionUser) {
  if (!isClienteSessionConfigured()) {
    throw new Error("CLIENTE_SESSION_SECRET ou ADMIN_SESSION_SECRET não configurado.");
  }

  const response = NextResponse.json({
    success: true,
    user,
  });

  const { token, expiresAt } = await createClienteSessionToken(user);
  response.cookies.set(CLIENTE_SESSION_COOKIE, token, getCookieOptions(expiresAt));

  return response;
}

export function clearClienteSessionCookie(response: NextResponse) {
  response.cookies.set(CLIENTE_SESSION_COOKIE, "", getCookieOptions(new Date(0)));
  return response;
}

export async function getClienteSession() {
  if (!isClienteSessionConfigured()) {
    return null;
  }

  const token = cookies().get(CLIENTE_SESSION_COOKIE)?.value;
  return verifyClienteSessionToken(token);
}

export async function requireClienteSession() {
  const session = await getClienteSession();

  if (!session) {
    return {
      authorized: false as const,
      response: NextResponse.json(
        { error: "Sessão do cliente inválida ou expirada." },
        { status: 401 },
      ),
    };
  }

  return {
    authorized: true as const,
    session,
  };
}

export function createClienteLogoutResponse() {
  return clearClienteSessionCookie(
    NextResponse.json({ success: true, message: "Sessão encerrada com sucesso." }),
  );
}

export function getClienteCookieRefreshOptions() {
  return getCookieOptions(getClienteSessionExpiresAt());
}
