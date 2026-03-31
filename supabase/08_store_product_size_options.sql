-- =============================================================================
-- Store product size options (multi-size per one product)
-- Run once in Supabase SQL Editor.
-- =============================================================================

alter table public.store_products
  add column if not exists size_options jsonb not null default '[]'::jsonb;

-- Backfill simple size option from existing base price where missing.
-- Uses 100ml as generic fallback for legacy rows; edit from dashboard later.
update public.store_products
set size_options = jsonb_build_array(
  jsonb_build_object('volume_ml', 100, 'price', price)
)
where coalesce(jsonb_array_length(size_options), 0) = 0;
