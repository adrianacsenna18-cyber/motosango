-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Table: users (Clientes)
create table users (
  id uuid default uuid_generate_v4() primary key,
  nome text not null,
  telefone text not null unique,
  endereco text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Table: drivers (Mototaxistas)
create table drivers (
  id uuid default uuid_generate_v4() primary key,
  nome text not null,
  telefone text not null unique,
  cpf text not null unique,
  placa text not null,
  modelo_moto text not null,
  chave_pix text,
  foto_base64 text,
  status_online boolean default false,
  status_plano text default 'ativo', -- 'ativo' ou 'vencido'
  vencimento_plano date,
  mensalidade_valor numeric(10,2) default 50.00,
  corridas_mes integer default 0,
  total_corridas integer default 0,
  aprovado_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Table: cities (Áreas de Operação)
create table cities (
  id uuid default uuid_generate_v4() primary key,
  nome_cidade text not null,
  ativo boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Table: settings (Configurações do Sistema)
create table settings (
  id uuid default uuid_generate_v4() primary key,
  tarifa_base numeric(10,2) default 10.00,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert default settings
insert into settings (tarifa_base) values (10.00);

-- 5. Table: admin (Administrador)
create table admin (
  id uuid default uuid_generate_v4() primary key,
  login text not null unique,
  senha text not null, -- Em produção, usar hash
  pix_admin text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Inserir o admin padrão para você conseguir fazer login
insert into admin (login, senha, pix_admin) 
values ('admin', '123', 'seu@pix.aqui')
on conflict (login) do nothing;

-- 6. Table: rides (Corridas)
create table rides (
  id uuid default uuid_generate_v4() primary key,
  cliente_id uuid references users(id) on delete set null,
  motorista_id uuid references drivers(id) on delete set null,
  origem text not null,
  destino text not null,
  referencia text,
  valor numeric(10,2),
  status text default 'aguardando', -- 'aguardando', 'aceito', 'a_caminho', 'concluido', 'cancelado'
  forma_pagamento text, -- 'pix', 'dinheiro'
  tipo_corrida text default 'normal', -- 'normal', 'especial'
  motivo_cancelamento text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Table: payments (Pagamentos)
create table payments (
  id uuid default uuid_generate_v4() primary key,
  ride_id uuid references rides(id) on delete cascade,
  tipo_pagamento text not null, -- 'pix', 'dinheiro'
  status text default 'pendente', -- 'pendente', 'pago'
  valor numeric(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Enable Realtime
alter publication supabase_realtime add table rides;
alter publication supabase_realtime add table drivers;
