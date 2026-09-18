-- ObjektHaus data schema for your PERSONAL Supabase project.
-- Run this once in your personal project's SQL editor.
-- Auth stays on the app's managed backend; this database only holds app data
-- and is reached exclusively through server functions using the service role
-- key, so RLS is enabled with no public policies (locked to service role).

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  no text not null default '',
  name text not null,
  latin text not null default '',
  note text not null default '',
  product text not null default '',
  edition text not null default '',
  price numeric not null default 0,
  weight_kg numeric not null default 0,
  represents text not null default '',
  why text not null default '',
  story text not null default '',
  card_url text not null default '',
  images jsonb not null default '[]'::jsonb,
  specs jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  published boolean not null default true,
  stock_out boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  reference text not null default (to_char(now(), 'YYMMDD') || '-' || upper(substr(md5(random()::text), 1, 5))),
  customer_name text not null,
  phone text not null,
  address text not null,
  email text,
  note text,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric not null default 0,
  shipping numeric not null default 0,
  total numeric not null default 0,
  total_weight numeric not null default 0,
  delivery_zone text not null default 'inside',
  status text not null default 'new',
  user_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

grant all on public.products to service_role;
grant all on public.site_settings to service_role;
grant all on public.orders to service_role;

alter table public.products enable row level security;
alter table public.site_settings enable row level security;
alter table public.orders enable row level security;
-- No policies on purpose: only the service role (server functions) may read/write.
