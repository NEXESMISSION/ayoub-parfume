-- =============================================================================
-- Custom orders: optional alcohol fill (remainder of bottle after oil ml)
-- Run once in Supabase SQL Editor.
-- =============================================================================

alter table public.orders
  add column if not exists alcohol_fill_requested boolean not null default false;

alter table public.orders
  add column if not exists alcohol_fill_ml numeric(10, 2);

comment on column public.orders.alcohol_fill_requested is 'Customer asked to fill remaining bottle volume with perfumer alcohol';
comment on column public.orders.alcohol_fill_ml is 'Remaining ml to fill with alcohol at order time';
