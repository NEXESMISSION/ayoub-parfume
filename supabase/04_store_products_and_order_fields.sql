-- =============================================================================
-- Store products + order delivery address & store linkage
-- Run once in Supabase SQL Editor (safe to re-run where noted).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Store products (عرض في /store — يُدار من لوحة التحكم)
-- ---------------------------------------------------------------------------

create table if not exists public.store_products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  description text,
  price numeric(10,2) not null,
  category text not null check (
    category in ('original_bottle', 'prefilled_bottle', 'air_freshener')
  ),
  image_urls text[] not null default '{}',
  sort_order int not null default 0,
  is_active boolean not null default true
);

create index if not exists idx_store_products_category_active
  on public.store_products (category, is_active, sort_order);

-- ---------------------------------------------------------------------------
-- Orders: عنوان التوصيل، نوع الطلب، ربط بمنتج المتجر
-- ---------------------------------------------------------------------------

alter table public.orders add column if not exists delivery_address text;
alter table public.orders add column if not exists order_kind text not null default 'custom';

-- Relax then re-apply check (existing rows get default)
alter table public.orders drop constraint if exists orders_order_kind_check;
alter table public.orders
  add constraint orders_order_kind_check
  check (order_kind in ('custom', 'store'));

alter table public.orders add column if not exists store_product_id uuid;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'orders_store_product_id_fkey'
  ) then
    alter table public.orders
      add constraint orders_store_product_id_fkey
      foreign key (store_product_id) references public.store_products(id)
      on delete set null;
  end if;
end $$;

create index if not exists idx_orders_store_product_id on public.orders (store_product_id);

-- ---------------------------------------------------------------------------
-- RLS — منتجات المتجر
-- ---------------------------------------------------------------------------

alter table public.store_products enable row level security;

drop policy if exists "store_products_select_public" on public.store_products;
create policy "store_products_select_public"
  on public.store_products for select
  using (is_active = true);

drop policy if exists "store_products_all_admin" on public.store_products;
create policy "store_products_all_admin"
  on public.store_products for all
  using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));
