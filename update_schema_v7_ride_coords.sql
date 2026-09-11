-- Etapa 2 Fila Inteligente: coordenadas numéricas de origem e destino na tabela rides
-- Campos numéricos para matching por proximidade (Haversine / PostGIS futuro).
-- Os campos texto existentes (origem, destino) são preservados integralmente.

ALTER TABLE rides ADD COLUMN IF NOT EXISTS origem_lat double precision;
ALTER TABLE rides ADD COLUMN IF NOT EXISTS origem_lng double precision;
ALTER TABLE rides ADD COLUMN IF NOT EXISTS destino_lat double precision;
ALTER TABLE rides ADD COLUMN IF NOT EXISTS destino_lng double precision;

-- Confirmação (opcional para rodar no SQL Editor)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'rides'
  AND column_name IN ('origem_lat', 'origem_lng', 'destino_lat', 'destino_lng')
ORDER BY ordinal_position;
