import { NextResponse } from "next/server";

import { requireMotoSession } from "@/lib/moto-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireMotoSession();

  if (!auth.authorized) {
    return auth.response;
  }

  return NextResponse.json({
    success: true,
    authenticated: true,
    driver: auth.session.user,
  });
}
