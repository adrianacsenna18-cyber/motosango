-- Migração para adicionar as colunas de regras de preço dinâmico na tabela settings
-- Etapa 2: Horários, Fins de Semana e Feriados

ALTER TABLE settings ADD COLUMN IF NOT EXISTS regra_noite BOOLEAN DEFAULT false;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS regra_sabado BOOLEAN DEFAULT false;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS regra_domingo BOOLEAN DEFAULT false;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS regra_feriado_nacional BOOLEAN DEFAULT false;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS regra_feriado_local BOOLEAN DEFAULT false;

-- Confirmação opcional (para visualizar no SQL Editor)
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'settings' AND column_name LIKE 'regra_%';