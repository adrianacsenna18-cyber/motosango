import { NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/admin-auth";

export async function GET() {
  const auth = await requireAdminSession();

  if (!auth.authorized) {
    return auth.response;
  }

  return NextResponse.json({
    success: true,
    authenticated: true,
    user: {
      login: auth.session.login,
    },
  });
}
