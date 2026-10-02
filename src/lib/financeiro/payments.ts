export type PaymentMethod = "pix" | "dinheiro";

export type MpPixPaymentMethod = "pix_mercado_pago";

export type AnyPaymentMethod = PaymentMethod | MpPixPaymentMethod;

export type PaymentStatus =
  | "not_applicable"
  | "cash_received_by_driver"
  | "pix_pending"
  | "pix_paid_to_platform"
  | "cancelled"
  | "manual_credit"
  | "pix_mp_created"
  | "pix_mp_paid"
  | "pix_mp_expired"
  | "pix_mp_cancelled";

export type MovementCode =
  | "cash_commission_pending"
  | "platform_payable_to_driver"
  | "driver_direct_receipt_cash"
  | "customer_no_show_credit"
  | "pending_commission_abatement"
  | "admin_adjustment_credit"
  | "admin_adjustment_debit"
  | "gateway_cost"
  | "mercadopago_pix_receipt"
  | "mercadopago_gateway_fee"
  | "mercadopago_refund"
  | "mercadopago_chargeback";

export type SettlementStatus =
  | "not_applicable"
  | "driver_owes_platform"
  | "driver_debt_partially_settled"
  | "driver_debt_settled"
  | "platform_owes_driver"
  | "partially_released"
  | "fully_released";

export type ManualPixPaymentRecord = {
  id: string;
  ride_id: string;
  tipo_pagamento: "pix";
  status: "pendente" | "pago";
  valor: number;
  created_at: Date;
};

export type MercadoPagoPixPaymentRecord = {
  id: string;
  ride_id: string;
  summary_id?: string;
  mp_payment_id?: string;
  mp_external_reference?: string;
  mp_status?: string;
  mp_status_detail?: string;
  pix_qr_code_base64?: string;
  pix_qr_code_text?: string;
  pix_expires_at?: Date;
  pix_total_paid_amount: number;
  created_at: Date;
  updated_at: Date;
};

export const COMMISSION_RATE = 0.15;

export function isMercadoPagoPixAutomationEnabled(): boolean {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  return Boolean(
    process.env.MERCADO_PAGO_PIX_ENABLED === 'true' &&
    accessToken &&
    accessToken.trim().length > 0,
  );
}

export function isMpPixPaymentMethod(
  method: string | null | undefined,
): method is MpPixPaymentMethod {
  return method === "pix_mercado_pago";
}

export function isPaymentMethodSupported(
  method: unknown,
): method is PaymentMethod {
  return method === "pix" || method === "dinheiro";
}

export function resolveDefaultSettlementStatus(
  paymentMethod: PaymentMethod,
): SettlementStatus {
  if (paymentMethod === "dinheiro") {
    return "driver_owes_platform";
  }
  return "platform_owes_driver";
}

export function resolveDefaultPaymentStatus(
  paymentMethod: PaymentMethod,
): PaymentStatus {
  if (paymentMethod === "dinheiro") {
    return "cash_received_by_driver";
  }
  return "pix_pending";
}
