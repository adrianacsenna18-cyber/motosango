-- Adicionar colunas para mensalidade
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS vencimento_mensalidade timestamp with time zone;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS bloqueado_mensalidade boolean default false;
