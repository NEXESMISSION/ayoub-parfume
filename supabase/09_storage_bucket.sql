-- =============================================================================
-- Supabase Storage bucket for product images
-- Run once in Supabase SQL Editor.
-- =============================================================================

-- 1. Create the bucket (public so images are served without auth)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880, -- 5 MB max
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
)
on conflict (id) do nothing;

-- 2. Allow anyone to READ (public bucket)
create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- 3. Allow authenticated users to UPLOAD
create policy "Auth users upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images');

-- 4. Allow authenticated users to UPDATE (overwrite)
create policy "Auth users update product images"
  on storage.objects for update
  using (bucket_id = 'product-images');

-- 5. Allow authenticated users to DELETE
create policy "Auth users delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images');
