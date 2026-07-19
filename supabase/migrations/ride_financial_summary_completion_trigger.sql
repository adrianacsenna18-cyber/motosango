-- Cria automaticamente o resumo financeiro quando a corrida muda para concluido.
-- A trigger executa apenas na transicao para concluido e aborta a conclusao se os
-- dados financeiros minimos da corrida forem invalidos.

CREATE OR REPLACE FUNCTION public.create_ride_financial_summary_on_completion()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_gross_amount numeric(12,2);
  v_platform_commission_amount numeric(12,2);
  v_economic_net_amount numeric(12,2);
BEGIN
  IF NEW.status <> 'concluido' OR OLD.status = 'concluido' THEN
    RETURN NEW;
  END IF;

  IF NEW.motorista_id IS NULL THEN
    RAISE EXCEPTION 'Nao e permitido concluir corrida sem motorista vinculado.'
      USING ERRCODE = '23514';
  END IF;

  IF NEW.valor IS NULL OR NEW.valor <= 0 THEN
    RAISE EXCEPTION 'Nao e permitido concluir corrida sem valor final valido.'
      USING ERRCODE = '23514';
  END IF;

  IF NEW.forma_pagamento NOT IN ('pix', 'dinheiro') THEN
    RAISE EXCEPTION 'Nao e permitido concluir corrida sem forma_pagamento valida.'
      USING ERRCODE = '23514';
  END IF;

  v_gross_amount := round(NEW.valor::numeric, 2);
  v_platform_commission_amount := round(v_gross_amount * 0.15, 2);
  v_economic_net_amount := round(v_gross_amount - v_platform_commission_amount, 2);

  INSERT INTO public.ride_financial_summary (
    ride_id,
    driver_id,
    financial_event_type,
    payment_method,
    commission_rate_applied,
    gross_ride_amount,
    platform_commission_amount,
    economic_net_amount,
    driver_direct_receipt_amount,
    driver_owes_platform_amount,
    platform_owes_driver_amount,
    payment_status,
    settlement_status
  )
  VALUES (
    NEW.id,
    NEW.motorista_id,
    'completed_ride',
    NEW.forma_pagamento,
    0.1500,
    v_gross_amount,
    v_platform_commission_amount,
    v_economic_net_amount,
    CASE
      WHEN NEW.forma_pagamento = 'dinheiro' THEN v_gross_amount
      ELSE 0
    END,
    CASE
      WHEN NEW.forma_pagamento = 'dinheiro' THEN v_platform_commission_amount
      ELSE 0
    END,
    0,
    CASE
      WHEN NEW.forma_pagamento = 'dinheiro' THEN 'cash_received_by_driver'
      ELSE 'pix_pending'
    END,
    CASE
      WHEN NEW.forma_pagamento = 'dinheiro' THEN 'driver_owes_platform'
      ELSE 'not_applicable'
    END
  )
  ON CONFLICT (ride_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_create_ride_financial_summary_on_completion ON public.rides;

CREATE TRIGGER trg_create_ride_financial_summary_on_completion
AFTER UPDATE ON public.rides
FOR EACH ROW
WHEN (
  OLD.status IS DISTINCT FROM 'concluido'
  AND NEW.status = 'concluido'
)
EXECUTE FUNCTION public.create_ride_financial_summary_on_completion();
