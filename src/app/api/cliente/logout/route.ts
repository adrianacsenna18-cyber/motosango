import { createClienteLogoutResponse } from "@/lib/cliente-auth";

export async function POST() {
  return createClienteLogoutResponse();
}
