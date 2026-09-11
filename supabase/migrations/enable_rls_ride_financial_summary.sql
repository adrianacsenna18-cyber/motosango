-- Protege a tabela ride_financial_summary contra leitura publica
-- sem alterar a logica de negocio da trigger existente.

ALTER TABLE public.ride_financial_summary ENABLE ROW LEVEL SECURITY;

ALTER FUNCTION public.create_ride_financial_summary_on_completion() SECURITY DEFINER;

ALTER FUNCTION public.create_ride_financial_summary_on_completion()
  SET search_path = public, pg_temp;
