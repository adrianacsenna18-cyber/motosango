import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  MOTO_SESSION_COOKIE,
  type MotoSessionUser,
  createMotoSessionToken,
  getMotoSessionExpiresAt,
  isMotoSessionConfigured,
  verifyMotoSessionToken,
} from "@/lib/moto-session";

function getCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  };
}

export async function createMotoSessionResponse(
  user: MotoSessionUser,
  driver: Record<string, unknown>,
) {
  if (!isMotoSessionConfigured()) {
    throw new Error(
      "MOTO_SESSION_SECRET, CLIENTE_SESSION_SECRET ou ADMIN_SESSION_SECRET não configurado.",
    );
  }

  const response = NextResponse.json({
    success: true,
    driver,
  });

  const { token, expiresAt } = await createMotoSessionToken(user);
  response.cookies.set(MOTO_SESSION_COOKIE, token, getCookieOptions(expiresAt));

  return response;
}

export function clearMotoSessionCookie(response: NextResponse) {
  response.cookies.set(MOTO_SESSION_COOKIE, "", getCookieOptions(new Date(0)));
  return response;
}

export async function getMotoSession() {
  if (!isMotoSessionConfigured()) {
    return null;
  }

  const token = cookies().get(MOTO_SESSION_COOKIE)?.value;
  return verifyMotoSessionToken(token);
}

export async function requireMotoSession() {
  const session = await getMotoSession();

  if (!session) {
    return {
      authorized: false as const,
      response: NextResponse.json(
        { error: "Sessão do mototaxista inválida ou expirada." },
        { status: 401 },
      ),
    };
  }

  return {
    authorized: true as const,
    session,
  };
}

export function createMotoLogoutResponse() {
  return clearMotoSessionCookie(
    NextResponse.json({ success: true, message: "Sessão encerrada com sucesso." }),
  );
}

export function getMotoCookieRefreshOptions() {
  return getCookieOptions(getMotoSessionExpiresAt());
}
