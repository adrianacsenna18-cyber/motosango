-- Estrutura inicial do modulo financeiro de corridas
-- Etapa 1: resumo financeiro por corrida + historico imutavel de movimentacoes
-- Nao executa calculos, nao cria automacoes e nao altera tabelas existentes

CREATE TABLE IF NOT EXISTS ride_financial_summary (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  ride_id uuid NOT NULL REFERENCES rides(id),
  driver_id uuid NOT NULL REFERENCES drivers(id),
  financial_event_type text NOT NULL CHECK (financial_event_type IN (
    'completed_ride',
    'customer_no_show_credit',
    'admin_adjusted'
  )),
  payment_method text NOT NULL CHECK (payment_method IN (
    'pix',
    'dinheiro',
    'none'
  )),
  commission_rate_applied numeric(5,4) NOT NULL DEFAULT 0 CHECK (commission_rate_applied >= 0),
  gross_ride_amount numeric(12,2) NOT NULL DEFAULT 0 CHECK (gross_ride_amount >= 0),
  policy_credit_amount numeric(12,2) NOT NULL DEFAULT 0 CHECK (policy_credit_amount >= 0),
  adjustment_net_amount numeric(12,2) NOT NULL DEFAULT 0,
  platform_commission_amount numeric(12,2) NOT NULL DEFAULT 0 CHECK (platform_commission_amount >= 0),
  gateway_cost_amount numeric(12,2) NOT NULL DEFAULT 0 CHECK (gateway_cost_amount >= 0),
  pending_commission_discount_amount numeric(12,2) NOT NULL DEFAULT 0 CHECK (pending_commission_discount_amount >= 0),
  economic_net_amount numeric(12,2) NOT NULL DEFAULT 0,
  driver_direct_receipt_amount numeric(12,2) NOT NULL DEFAULT 0 CHECK (driver_direct_receipt_amount >= 0),
  driver_owes_platform_amount numeric(12,2) NOT NULL DEFAULT 0 CHECK (driver_owes_platform_amount >= 0),
  platform_owes_driver_amount numeric(12,2) NOT NULL DEFAULT 0 CHECK (platform_owes_driver_amount >= 0),
  payment_status text NOT NULL CHECK (payment_status IN (
    'not_applicable',
    'cash_received_by_driver',
    'pix_pending',
    'pix_paid_to_platform',
    'cancelled',
    'manual_credit'
  )),
  settlement_status text NOT NULL CHECK (settlement_status IN (
    'not_applicable',
    'driver_owes_platform',
    'driver_debt_partially_settled',
    'driver_debt_settled',
    'platform_owes_driver',
    'partially_released',
    'fully_released'
  )),
  provider_name text,
  provider_payment_id text,
  provider_external_reference text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT ride_financial_summary_ride_id_unique UNIQUE (ride_id),
  CONSTRAINT ride_financial_summary_provider_external_reference_unique UNIQUE (provider_external_reference)
);

CREATE INDEX IF NOT EXISTS idx_ride_financial_summary_driver_id
  ON ride_financial_summary(driver_id);

CREATE INDEX IF NOT EXISTS idx_ride_financial_summary_payment_status
  ON ride_financial_summary(payment_status);

CREATE INDEX IF NOT EXISTS idx_ride_financial_summary_settlement_status
  ON ride_financial_summary(settlement_status);

CREATE TABLE IF NOT EXISTS financial_movements (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  summary_id uuid NOT NULL REFERENCES ride_financial_summary(id),
  ride_id uuid NOT NULL REFERENCES rides(id),
  driver_id uuid NOT NULL REFERENCES drivers(id),
  movement_type text NOT NULL CHECK (movement_type IN (
    'debit',
    'credit',
    'abatement',
    'adjustment'
  )),
  movement_code text NOT NULL CHECK (movement_code IN (
    'cash_commission_pending',
    'platform_payable_to_driver',
    'driver_direct_receipt_cash',
    'customer_no_show_credit',
    'pending_commission_abatement',
    'admin_adjustment_credit',
    'admin_adjustment_debit',
    'gateway_cost'
  )),
  amount numeric(12,2) NOT NULL CHECK (amount >= 0),
  origin_movement_id uuid REFERENCES financial_movements(id),
  reason text,
  responsible_type text NOT NULL CHECK (responsible_type IN (
    'system',
    'admin'
  )),
  responsible_id uuid,
  event_key text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT financial_movements_event_key_unique UNIQUE (event_key)
);

CREATE INDEX IF NOT EXISTS idx_financial_movements_summary_id
  ON financial_movements(summary_id);

CREATE INDEX IF NOT EXISTS idx_financial_movements_ride_id
  ON financial_movements(ride_id);

CREATE INDEX IF NOT EXISTS idx_financial_movements_driver_id
  ON financial_movements(driver_id);

CREATE INDEX IF NOT EXISTS idx_financial_movements_origin_movement_id
  ON financial_movements(origin_movement_id);

CREATE INDEX IF NOT EXISTS idx_financial_movements_movement_code
  ON financial_movements(movement_code);
