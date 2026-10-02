import { createHmac, timingSafeEqual } from "crypto";

export type MpWebhookValidationInput = {
  body: string;
  signatureHeader: string | undefined;
  requestIdHeader: string | undefined;
};

export type MpWebhookValidationResult = {
  valid: boolean;
  reason?: string;
};

export type MpParsedWebhookPayload = {
  action?: string;
  api_version?: string;
  data?: { id?: string };
  date_created?: string;
  id?: number | string;
  live_mode?: boolean;
  type?: string;
  user_id?: number | string;
};

export function isMercadoPagoWebhookSecretConfigured(): boolean {
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
  return Boolean(secret && secret.trim().length > 0);
}

export function validateMercadoPagoWebhook(
  input: MpWebhookValidationInput,
): MpWebhookValidationResult {
  if (!isMercadoPagoWebhookSecretConfigured()) {
    return {
      valid: false,
      reason: "MERCADO_PAGO_WEBHOOK_SECRET nao configurado.",
    };
  }

  if (!input.signatureHeader || !input.requestIdHeader) {
    return {
      valid: false,
      reason: "Cabecalhos x-signature e x-request-id sao obrigatorios.",
    };
  }

  try {
    const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET!.trim();
    const requestId = input.requestIdHeader.trim();
    const signature = input.signatureHeader.trim();

    const params = new URLSearchParams(signature.split(",").join("&"));
    const ts = params.get("ts");
    const hash = params.get("v1");

    if (!ts || !hash) {
      return {
        valid: false,
        reason: "Assinatura invalida: ts ou v1 ausentes.",
      };
    }

    const manifest = `id:${requestId};request-id:${requestId};ts:${ts};body:${input.body};`;
    const expected = createHmac("sha256", secret).update(manifest).digest("hex");

    const expectedBuffer = Buffer.from(expected, "hex");
    const receivedBuffer = Buffer.from(hash, "hex");

    if (
      expectedBuffer.length !== receivedBuffer.length ||
      !timingSafeEqual(expectedBuffer, receivedBuffer)
    ) {
      return {
        valid: false,
        reason: "Assinatura HMAC nao confere.",
      };
    }

    return { valid: true };
  } catch (error: unknown) {
    return {
      valid: false,
      reason:
        error instanceof Error
          ? `Erro durante validacao: ${error.message}`
          : "Erro desconhecido durante validacao.",
    };
  }
}

export function parseMercadoPagoWebhookPayload(
  rawBody: unknown,
): MpParsedWebhookPayload | null {
  if (!rawBody || typeof rawBody !== "object") {
    return null;
  }

  const obj = rawBody as Record<string, unknown>;
  const dataObj =
    obj.data && typeof obj.data === "object" ? (obj.data as Record<string, unknown>) : undefined;

  return {
    action: typeof obj.action === "string" ? obj.action : undefined,
    api_version: typeof obj.api_version === "string" ? obj.api_version : undefined,
    data: dataObj ? { id: typeof dataObj.id === "string" || typeof dataObj.id === "number" ? String(dataObj.id) : undefined } : undefined,
    date_created: typeof obj.date_created === "string" ? obj.date_created : undefined,
    id:
      typeof obj.id === "string" || typeof obj.id === "number"
        ? String(obj.id)
        : undefined,
    live_mode: typeof obj.live_mode === "boolean" ? obj.live_mode : undefined,
    type: typeof obj.type === "string" ? obj.type : undefined,
    user_id:
      typeof obj.user_id === "string" || typeof obj.user_id === "number"
        ? String(obj.user_id)
        : undefined,
  };
}
