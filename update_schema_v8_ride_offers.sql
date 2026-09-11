-- Etapa 3 Fila Inteligente: tabela de ofertas individuais de corrida por mototaxista.
-- Tabela preparatória; NÃO é usada pelo sistema nesta etapa.

CREATE TABLE IF NOT EXISTS ride_offers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

  ride_id uuid NOT NULL
    REFERENCES rides(id) ON DELETE CASCADE,

  driver_id uuid NOT NULL
    REFERENCES drivers(id) ON DELETE CASCADE,

  offered_at timestamp with time zone NOT NULL
    DEFAULT timezone('utc'::text, now()),

  expires_at timestamp with time zone NOT NULL,

  status text NOT NULL DEFAULT 'offered'
    CONSTRAINT ride_offers_status_check
    CHECK (status IN ('offered', 'accepted', 'rejected', 'timed_out', 'cancelled')),

  created_at timestamp with time zone NOT NULL
    DEFAULT timezone('utc'::text, now()),

  updated_at timestamp with time zone NOT NULL
    DEFAULT timezone('utc'::text, now())
);

-- 1 oferta ativa (offered) por corrida + motorista (evita duplicação de oferta)
CREATE UNIQUE INDEX IF NOT EXISTS idx_ride_offers_ride_driver_active
  ON ride_offers(ride_id, driver_id)
  WHERE status = 'offered';

-- Índices para consultas futuras do dispatch
CREATE INDEX IF NOT EXISTS idx_ride_offers_ride_id
  ON ride_offers(ride_id);

CREATE INDEX IF NOT EXISTS idx_ride_offers_driver_id
  ON ride_offers(driver_id);

CREATE INDEX IF NOT EXISTS idx_ride_offers_status
  ON ride_offers(status);

CREATE INDEX IF NOT EXISTS idx_ride_offers_expires_at
  ON ride_offers(expires_at);

CREATE INDEX IF NOT EXISTS idx_ride_offers_driver_status
  ON ride_offers(driver_id, status);

-- Confirmação opcional (rodar no SQL Editor)
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'ride_offers'
ORDER BY ordinal_position;
