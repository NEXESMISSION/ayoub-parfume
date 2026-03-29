-- =============================================================================
-- Ingredients: audience categories (women / man / kids)
-- Fixes: ERROR 23514 ingredients_category_check when app sends 'women' but DB
-- still enforces ('top','heart','base'). Drops ANY check on category, then
-- normalizes data, then adds one clean constraint.
-- Run once in Supabase SQL Editor.
-- =============================================================================

-- 1) Drop every CHECK constraint on public.ingredients that mentions category
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT c.oid, c.conname
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON t.relnamespace = n.oid
    WHERE n.nspname = 'public'
      AND t.relname = 'ingredients'
      AND c.contype = 'c'
      AND pg_get_constraintdef(c.oid) ILIKE '%category%'
  LOOP
    EXECUTE format('ALTER TABLE public.ingredients DROP CONSTRAINT %I', r.conname);
  END LOOP;
END $$;

-- 2) Normalize old pyramid / أي قيمة غير معروفة → women
UPDATE public.ingredients
SET category = 'women'
WHERE category IS NULL
   OR category NOT IN ('women', 'man', 'kids');

-- 3) Single constraint for the app
ALTER TABLE public.ingredients
  DROP CONSTRAINT IF EXISTS ingredients_category_check;

ALTER TABLE public.ingredients
  ADD CONSTRAINT ingredients_category_check
  CHECK (category IN ('women', 'man', 'kids'));
