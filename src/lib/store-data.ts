import { unstable_cache } from "next/cache";
import { createPublicSupabase } from "@/lib/supabase/public-server";
import type { StoreCategory, StoreProduct } from "@/types";

export const STORE_PRODUCTS_CACHE_TAG = "store-products";

function normalizeProduct(row: Record<string, unknown>): StoreProduct {
  const urls = row.image_urls;
  const sizeOptionsRaw = row.size_options;
  const size_options = Array.isArray(sizeOptionsRaw)
    ? sizeOptionsRaw
        .map((item) => {
          const obj = item as Record<string, unknown>;
          const volume_ml = Number(obj.volume_ml ?? 0);
          const price = Number(obj.price ?? 0);
          if (volume_ml <= 0 || price < 0) return null;
          return { volume_ml, price };
        })
        .filter((v): v is { volume_ml: number; price: number } => v !== null)
    : [];
  return {
    id: String(row.id),
    created_at: String(row.created_at ?? ""),
    name: String(row.name ?? ""),
    description: row.description != null ? String(row.description) : null,
    price: Number(row.price ?? 0),
    category: row.category as StoreProduct["category"],
    image_urls: Array.isArray(urls) ? (urls as string[]) : null,
    size_options,
    sort_order: Number(row.sort_order ?? 0),
    is_active: Boolean(row.is_active ?? true),
  };
}

async function fetchStoreProductsUncached(
  category: StoreCategory,
): Promise<StoreProduct[]> {
  const supabase = createPublicSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("store_products")
    .select("*")
    .eq("category", category)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map((row) => normalizeProduct(row as Record<string, unknown>));
}

/** يُخبَّأ على الخادم ~٢ دقيقة — تنقل أسرع بين صفحات المتجر */
export function fetchStoreProducts(category: StoreCategory): Promise<StoreProduct[]> {
  return unstable_cache(
    () => fetchStoreProductsUncached(category),
    ["store-products-list", category],
    {
      revalidate: 120,
      tags: [STORE_PRODUCTS_CACHE_TAG],
    },
  )();
}

async function fetchStoreProductByIdUncached(
  id: string,
): Promise<StoreProduct | null> {
  const supabase = createPublicSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("store_products")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();
  if (error || !data) return null;
  return normalizeProduct(data as Record<string, unknown>);
}

export function fetchStoreProductById(id: string): Promise<StoreProduct | null> {
  return unstable_cache(
    () => fetchStoreProductByIdUncached(id),
    ["store-product", id],
    {
      revalidate: 120,
      tags: [STORE_PRODUCTS_CACHE_TAG, `store-product-${id}`],
    },
  )();
}
