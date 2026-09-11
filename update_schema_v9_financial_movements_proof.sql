-- =====================================================================
-- MOTOSANGO — MIGRATION V9
-- Adiciona colunas de comprovante do repasse manual em financial_movements
-- =====================================================================
-- Escopo: ETAPA 1 — somente as 3 colunas que identificam o arquivo de
-- comprovante enviado no momento do lançamento do repasse manual.
-- NÃO MODIFICA nenhuma coluna, constraint, default, RLS ou trigger existente.
-- Valores default = NULL para todas as rows antigas.
-- =====================================================================

DO $$
BEGIN
  -- Coluna 1: URL pública ou signed do arquivo do comprovante
  -- Pode ser do Storage Supabase, S3, ou URL assinada de provedor externo.
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'financial_movements'
      AND column_name  = 'proof_url'
  ) THEN
    ALTER TABLE public.financial_movements
    ADD COLUMN proof_url TEXT;
  END IF;

  -- Coluna 2: Nome original do arquivo enviado (ex: comprovante_12345.jpg)
  -- Utilizado no download e na exibição amigável para o mototaxista.
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'financial_movements'
      AND column_name  = 'proof_filename'
  ) THEN
    ALTER TABLE public.financial_movements
    ADD COLUMN proof_filename TEXT;
  END IF;

  -- Coluna 3: Data e hora do upload (UTC / timestamptz)
  -- Registrada no momento do upload do arquivo, antes do INSERT do movimento.
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'financial_movements'
      AND column_name  = 'proof_uploaded_at'
  ) THEN
    ALTER TABLE public.financial_movements
    ADD COLUMN proof_uploaded_at TIMESTAMPTZ;
  END IF;
END
$$;
