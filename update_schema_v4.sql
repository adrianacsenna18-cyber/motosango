-- Adicionar colunas em settings
ALTER TABLE settings ADD COLUMN IF NOT EXISTS mensalidade_valor numeric(10,2) default 50.00;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS pix_admin text;

-- Adicionar controle de confirmacao de pagamento no driver
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS pagamento_em_analise boolean default false;
