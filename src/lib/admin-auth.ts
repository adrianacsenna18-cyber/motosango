import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminSessionExpiresAt,
  verifyAdminSessionToken,
} from "@/lib/admin-session";

function isAdminSessionSecretConfigured() {
  return Boolean(process.env.ADMIN_SESSION_SECRET);
}

function getCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  };
}

export async function createAdminSessionResponse(login: string) {
  const response = NextResponse.json({
    success: true,
    user: { login },
  });

  if (!isAdminSessionSecretConfigured()) {
    return response;
  }

  const { token, expiresAt } = await createAdminSessionToken(login);
  response.cookies.set(ADMIN_SESSION_COOKIE, token, getCookieOptions(expiresAt));

  return response;
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set(ADMIN_SESSION_COOKIE, "", getCookieOptions(new Date(0)));
  return response;
}

export async function getAdminSession() {
  if (!isAdminSessionSecretConfigured()) {
    return null;
  }

  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSessionToken(token);
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    return {
      authorized: false as const,
      response: NextResponse.json(
        { error: "Sessão administrativa inválida ou expirada" },
        { status: 401 },
      ),
    };
  }

  return {
    authorized: true as const,
    session,
  };
}

export function createAdminLogoutResponse() {
  return clearAdminSessionCookie(
    NextResponse.json({ success: true, message: "Sessão encerrada com sucesso" }),
  );
}

export function getAdminCookieRefreshOptions() {
  return getCookieOptions(getAdminSessionExpiresAt());
}
