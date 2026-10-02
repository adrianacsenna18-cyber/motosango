-- v11_users_email_column.sql
-- Adiciona coluna `email` opcional na tabela public.users.
-- Objetivo: armazenar e-mail do cliente usado no primeiro pagamento Pix Mercado Pago.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
      FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name   = 'users'
       AND column_name  = 'email'
  ) THEN
    ALTER TABLE public.users
      ADD COLUMN email text;
  END IF;
END $$;
