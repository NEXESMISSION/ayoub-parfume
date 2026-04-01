-- =============================================================================
-- Perfume app — full schema + RLS (fresh project or first-time setup)
-- Run in Supabase → SQL Editor as a single script.
-- =============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.bottles (
  id uuid primary key default gen_random_uuid(),
  name text,
  capacity_ml int not null,
  base_price numeric(10,2) not null,
  image_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  category text not null check (category in ('women','man','kids')),
  price_per_gram numeric(10,2) not null,
  intensity_factor numeric(5,2) default 1,
  image_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.store_products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  description text,
  price numeric(10,2) not null,
  size_options jsonb not null default '[]'::jsonb,
  category text not null check (
    category in ('original_bottle', 'prefilled_bottle', 'air_freshener')
  ),
  image_urls text[] not null default '{}',
  sort_order int not null default 0,
  is_active boolean not null default true
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  customer_name text,
  whatsapp_number text,
  bottle_id uuid references public.bottles(id) on delete set null,
  recipe jsonb not null default '[]'::jsonb,
  sticker_text text,
  total_price numeric(10,2),
  status text not null default 'new' check (
    status in ('new','mixing','labeling','ready','completed','cancelled')
  ),
  admin_notes text,
  delivery_address text,
  order_kind text not null default 'custom' check (order_kind in ('custom', 'store')),
  store_product_id uuid references public.store_products(id) on delete set null,
  bottle_name_snapshot text,
  store_product_name_snapshot text,
  alcohol_fill_requested boolean not null default false,
  alcohol_fill_ml numeric(10,2)
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade
);

-- ---------------------------------------------------------------------------
-- Indexes (performance + admin queries)
-- ---------------------------------------------------------------------------

create index if not exists idx_orders_created_at on public.orders (created_at desc);
create index if not exists idx_orders_status on public.orders (status);
create index if not exists idx_orders_bottle_id on public.orders (bottle_id);
create index if not exists idx_orders_store_product_id on public.orders (store_product_id);
create index if not exists idx_store_products_category_active
  on public.store_products (category, is_active, sort_order);
create index if not exists idx_bottles_is_active on public.bottles (is_active);
create index if not exists idx_ingredients_is_active on public.ingredients (is_active);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.bottles enable row level security;
alter table public.ingredients enable row level security;
alter table public.store_products enable row level security;
alter table public.orders enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "ingredients_select_public" on public.ingredients;
create policy "ingredients_select_public"
  on public.ingredients for select
  using (is_active = true);

drop policy if exists "ingredients_all_admin" on public.ingredients;
create policy "ingredients_all_admin"
  on public.ingredients for all
  using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

drop policy if exists "bottles_select_public" on public.bottles;
create policy "bottles_select_public"
  on public.bottles for select
  using (is_active = true);

drop policy if exists "bottles_all_admin" on public.bottles;
create policy "bottles_all_admin"
  on public.bottles for all
  using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

drop policy if exists "store_products_select_public" on public.store_products;
create policy "store_products_select_public"
  on public.store_products for select
  using (is_active = true);

drop policy if exists "store_products_all_admin" on public.store_products;
create policy "store_products_all_admin"
  on public.store_products for all
  using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

drop policy if exists "orders_insert_public" on public.orders;
create policy "orders_insert_public"
  on public.orders for insert
  with check (true);

drop policy if exists "orders_select_admin" on public.orders;
create policy "orders_select_admin"
  on public.orders for select
  using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

drop policy if exists "orders_update_admin" on public.orders;
create policy "orders_update_admin"
  on public.orders for update
  using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

drop policy if exists "orders_delete_admin" on public.orders;
create policy "orders_delete_admin"
  on public.orders for delete
  using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

drop policy if exists "admin_users_select_self" on public.admin_users;
create policy "admin_users_select_self"
  on public.admin_users for select
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Realtime (orders) — safe if already configured
-- ---------------------------------------------------------------------------

alter table public.orders replica identity full;

do $pub$
begin
  alter publication supabase_realtime add table public.orders;
exception
  when others then
    raise notice 'realtime: %', sqlerrm;
end
$pub$;

-- ---------------------------------------------------------------------------
-- Optional seed (comment out if you manage products only from admin UI)
-- ---------------------------------------------------------------------------

-- insert into public.bottles (name, capacity_ml, base_price, image_url, is_active)
-- select * from (values
--   ('Royal', 50, 45.00, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80', true)
-- ) as v(name, capacity_ml, base_price, image_url, is_active)
-- where not exists (select 1 from public.bottles limit 1);

-- insert into public.ingredients (name, slug, category, price_per_gram, intensity_factor, image_url, is_active)
-- select * from (values
--   ('Bergamot', 'bergamot', 'top', 2.50, 1.0, null::text, true)
-- ) as v(name, slug, category, price_per_gram, intensity_factor, image_url, is_active)
-- where not exists (select 1 from public.ingredients limit 1);
