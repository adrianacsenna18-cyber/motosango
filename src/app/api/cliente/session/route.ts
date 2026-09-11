import { NextResponse } from "next/server";

import { requireClienteSession } from "@/lib/cliente-auth";

export async function GET() {
  const auth = await requireClienteSession();

  if (!auth.authorized) {
    return auth.response;
  }

  return NextResponse.json({
    success: true,
    user: auth.session.user,
  });
}
