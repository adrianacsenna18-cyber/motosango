-- Adicionar colunas para a lógica avançada do PRD

-- Na tabela drivers (GPS e Push)
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS lat double precision;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS lng double precision;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS push_token text;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS last_location_update timestamp with time zone;

-- Na tabela users (Push)
ALTER TABLE users ADD COLUMN IF NOT EXISTS push_token text;

-- Na tabela rides (Negociação Especial e Matching)
ALTER TABLE rides ADD COLUMN IF NOT EXISTS valor_sugerido numeric(10,2);
ALTER TABLE rides ADD COLUMN IF NOT EXISTS status_negociacao text default 'nenhuma'; -- 'nenhuma', 'sugerido', 'aceito', 'recusado'
ALTER TABLE rides ADD COLUMN IF NOT EXISTS rejected_by text[]; -- Array de IDs de motoristas que recusaram ou ignoraram (para não enviar de novo)

-- Desabilitar RLS se não estiver
alter table admin disable row level security;
alter table users disable row level security;
alter table drivers disable row level security;
alter table rides disable row level security;
alter table payments disable row level security;
alter table cities disable row level security;
alter table settings disable row level security;