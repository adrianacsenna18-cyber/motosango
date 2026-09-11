import { createMotoLogoutResponse } from "@/lib/moto-auth";

export async function POST() {
  return createMotoLogoutResponse();
}
