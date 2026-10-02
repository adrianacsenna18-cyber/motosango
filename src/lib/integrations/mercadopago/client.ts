import MercadoPagoConfig, { Payment } from 'mercadopago';

export type MpPixPaymentInput = {
  rideId: string;
  externalReference: string;
  amount: number;
  customerEmail?: string;
  customerName?: string;
  description?: string;
  expirationMinutes: number;
};

export type MpPixPaymentOutput = {
  mpPaymentId: string;
  externalReference: string;
  status: string;
  statusDetail: string;
  qrCodeBase64?: string;
  qrCodeText?: string;
  expiresAt: Date;
  transactionAmount: number;
  rawPayload: unknown;
};

export type MpPaymentStatus = {
  mpPaymentId: string;
  status: string;
  statusDetail: string;
  totalPaidAmount?: number;
  paidAt?: Date;
};

export class MercadoPagoClientNotConfiguredError extends Error {
  constructor() {
    super("Mercado Pago client nao esta configurado nesta etapa.");
    this.name = "MercadoPagoClientNotConfiguredError";
  }
}

export class MercadoPagoClient {
  private client: Payment | null = null;
  private clientAccessToken: string | null = null;
  private clientEnabled: boolean = false;
  private expirationMinutes: number | null = null;

  constructor() {
    this.client = null;
    this.clientAccessToken = null;
    this.clientEnabled = false;
    this.expirationMinutes = null;
  }

  private static isEnabledRuntime(): boolean {
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    return Boolean(
      process.env.MERCADO_PAGO_PIX_ENABLED === 'true' &&
      accessToken &&
      accessToken.trim().length > 0,
    );
  }

  private static getRuntimeAccessToken(): string | null {
    const v = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    return v && v.trim().length > 0 ? v.trim() : null;
  }

  private ensureRuntimeClient(): Payment {
    const enabled = MercadoPagoClient.isEnabledRuntime();
    const token = MercadoPagoClient.getRuntimeAccessToken();

    if (!enabled || !token) {
      this.client = null;
      this.clientAccessToken = null;
      this.clientEnabled = false;
      throw new MercadoPagoClientNotConfiguredError();
    }

    const dirty =
      this.client === null ||
      this.clientAccessToken !== token ||
      this.clientEnabled !== enabled;

    if (dirty) {
      this.client = new Payment(new MercadoPagoConfig({ accessToken: token }));
      this.clientAccessToken = token;
      this.clientEnabled = enabled;
    }

    return this.client!;
  }

  isConfigured(): boolean {
    if (!MercadoPagoClient.isEnabledRuntime()) {
      this.client = null;
      this.clientAccessToken = null;
      this.clientEnabled = false;
      return false;
    }
    try {
      this.ensureRuntimeClient();
      return true;
    } catch (err) {
      if (err instanceof MercadoPagoClientNotConfiguredError) return false;
      throw err;
    }
  }

  private ensureConfigured(): void {
    this.ensureRuntimeClient();
  }

  getDefaultExpirationMinutes(): number {
    if (this.expirationMinutes === null) {
      this.expirationMinutes = Math.max(
        5,
        Math.min(
          1440,
          parseInt(process.env.NEXT_PUBLIC_MERCADO_PAGO_PIX_EXPIRATION_MINUTES || '30', 10),
        ),
      );
    }
    return this.expirationMinutes;
  }

  async createPixPayment(input: MpPixPaymentInput): Promise<MpPixPaymentOutput> {
    this.ensureConfigured();

    if (!Number.isFinite(input.amount) || input.amount <= 0) {
      throw new Error(`Valor do pagamento invalido: ${String(input.amount)}`);
    }
    if (!input.externalReference || !input.externalReference.trim()) {
      throw new Error('external_reference e obrigatoria.');
    }

    const expirationMinutes = Number.isFinite(input.expirationMinutes) && input.expirationMinutes > 0
      ? input.expirationMinutes
      : this.getDefaultExpirationMinutes();

    const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);

    const body = {
      transaction_amount: Number(input.amount.toFixed(2)),
      description: input.description || `Corrida MotoSango ${input.rideId}`,
      payment_method_id: 'pix',
      external_reference: input.externalReference.trim(),
      date_of_expiration: expiresAt.toISOString(),
      installments: 1,
      ...(input.customerEmail && input.customerEmail.trim()
        ? {
            payer: {
              email: input.customerEmail.trim(),
              ...(input.customerName && input.customerName.trim()
                ? { first_name: input.customerName.trim() }
                : {}),
            },
          }
        : {}),
    };

    const response = await this.client!.create({ body });

    const qrCodeBase64 =
      (response.point_of_interaction?.transaction_data?.qr_code_base64 as string | undefined) ||
      undefined;
    const qrCodeText =
      (response.point_of_interaction?.transaction_data?.qr_code as string | undefined) ||
      undefined;
    const returnedExpiresAt = response.date_of_expiration
      ? new Date(response.date_of_expiration)
      : expiresAt;
    const returnedStatus = response.status || 'pending';
    const returnedStatusDetail = response.status_detail || '';

    return {
      mpPaymentId: String(response.id),
      externalReference: response.external_reference || input.externalReference,
      status: returnedStatus,
      statusDetail: returnedStatusDetail,
      qrCodeBase64,
      qrCodeText,
      expiresAt: returnedExpiresAt,
      transactionAmount: Number(response.transaction_amount) || Number(input.amount),
      rawPayload: response,
    };
  }

  async getPaymentById(mpPaymentId: string): Promise<MpPaymentStatus> {
    this.ensureConfigured();
    const response = await this.client!.get({ id: mpPaymentId });
    return {
      mpPaymentId: String(response.id),
      status: response.status || 'unknown',
      statusDetail: response.status_detail || '',
      totalPaidAmount:
        typeof (response as { transaction_details?: { total_paid_amount?: number } }).transaction_details?.total_paid_amount === 'number'
          ? (response as { transaction_details: { total_paid_amount: number } }).transaction_details.total_paid_amount
          : undefined,
      paidAt: response.date_approved ? new Date(response.date_approved) : undefined,
    };
  }

  async cancelPayment(mpPaymentId: string): Promise<void> {
    this.ensureConfigured();
    try {
      await this.client!.cancel({ id: mpPaymentId });
    } catch (error: unknown) {
      const err = error as { status?: number; cause?: unknown };
      if (err.status && err.status >= 400 && err.status < 500) {
        return;
      }
      throw error;
    }
  }
}

export const mercadoPagoClient = new MercadoPagoClient();
