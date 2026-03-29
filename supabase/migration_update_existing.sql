-- =============================================================================
-- UPDATE existing database (run once if you already deployed an older schema)
-- Safe to re-run: uses IF NOT EXISTS / DO blocks where needed.
-- =============================================================================

create extension if not exists "pgcrypto";

-- Tables (no-op if already exist)
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
  category text not null check (category in ('top','heart','base')),
  price_per_gram numeric(10,2) not null,
  intensity_factor numeric(5,2) default 1,
  image_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  customer_name text,
  whatsapp_number text,
  bottle_id uuid references public.bottles(id),
  recipe jsonb not null default '[]'::jsonb,
  sticker_text text,
  total_price numeric(10,2),
  status text not null default 'new' check (
    status in ('new','mixing','labeling','ready','completed','cancelled')
  ),
  admin_notes text
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade
);

-- Indexes
create index if not exists idx_orders_created_at on public.orders (created_at desc);
create index if not exists idx_orders_status on public.orders (status);
create index if not exists idx_orders_bottle_id on public.orders (bottle_id);
create index if not exists idx_bottles_is_active on public.bottles (is_active);
create index if not exists idx_ingredients_is_active on public.ingredients (is_active);

-- RLS + policies (drop/recreate names)
alter table public.bottles enable row level security;
alter table public.ingredients enable row level security;
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

-- Realtime
alter table public.orders replica identity full;

do $pub$
begin
  alter publication supabase_realtime add table public.orders;
exception
  when others then
    raise notice 'realtime: %', sqlerrm;
end
$pub$;
