import { createClient } from "@/lib/supabase/server";
import type { StoreCategory, StoreProduct } from "@/types";

function normalizeProduct(row: Record<string, unknown>): StoreProduct {
  const urls = row.image_urls;
  return {
    id: String(row.id),
    created_at: String(row.created_at ?? ""),
    name: String(row.name ?? ""),
    description: row.description != null ? String(row.description) : null,
    price: Number(row.price ?? 0),
    category: row.category as StoreProduct["category"],
    image_urls: Array.isArray(urls) ? (urls as string[]) : null,
    sort_order: Number(row.sort_order ?? 0),
    is_active: Boolean(row.is_active ?? true),
  };
}

export async function fetchStoreProducts(
  category: StoreCategory,
): Promise<StoreProduct[]> {
  const supabase = await createClient();
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

export async function fetchStoreProductById(
  id: string,
): Promise<StoreProduct | null> {
  const supabase = await createClient();
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
