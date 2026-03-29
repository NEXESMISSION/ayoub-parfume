-- =============================================================================
-- Orders independent of catalog: FKs SET NULL on delete + snapshot labels
-- Run once in Supabase SQL Editor (safe to re-run).
-- =============================================================================

-- Snapshot text so admin still shows names after bottle/product row is removed
alter table public.orders add column if not exists bottle_name_snapshot text;
alter table public.orders add column if not exists store_product_name_snapshot text;

-- Backfill from current relations
update public.orders o
set bottle_name_snapshot = b.name
from public.bottles b
where o.bottle_id = b.id
  and (o.bottle_name_snapshot is null or trim(o.bottle_name_snapshot) = '');

update public.orders o
set store_product_name_snapshot = p.name
from public.store_products p
where o.store_product_id = p.id
  and (o.store_product_name_snapshot is null or trim(o.store_product_name_snapshot) = '');

-- Store orders: copy from sticker_text if still empty (legacy rows)
update public.orders
set store_product_name_snapshot = sticker_text
where order_kind = 'store'
  and (store_product_name_snapshot is null or trim(store_product_name_snapshot) = '')
  and sticker_text is not null
  and trim(sticker_text) <> '';

-- Bottle FK: allow deleting bottles — orders keep row, refs nulled
alter table public.orders drop constraint if exists orders_bottle_id_fkey;
alter table public.orders
  add constraint orders_bottle_id_fkey
  foreign key (bottle_id) references public.bottles (id)
  on delete set null;

-- Store product FK: ensure SET NULL (recreate if an older DB had RESTRICT)
alter table public.orders drop constraint if exists orders_store_product_id_fkey;
alter table public.orders
  add constraint orders_store_product_id_fkey
  foreign key (store_product_id) references public.store_products (id)
  on delete set null;
