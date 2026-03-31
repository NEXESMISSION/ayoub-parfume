"use server";

import { createClient } from "@/lib/supabase/server";
import type { StoreCategory } from "@/types";
import { revalidatePath, revalidateTag } from "next/cache";
import { STORE_PRODUCTS_CACHE_TAG } from "@/lib/store-data";
import type { StoreProductSizeOption } from "@/types";

function parseImageUrls(raw: string): string[] {
  return raw
    .split(/\r?\n|,/)
    .map((s) => s.trim())
    .filter((s) => /^https?:\/\//i.test(s));
}

function parseSizeOptions(raw: string): StoreProductSizeOption[] {
  return raw
    .split(/\r?\n|,/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      // Format: "10:45" => 10ml for 45 DT
      const [mlRaw, priceRaw] = line.split(":").map((s) => s.trim());
      const volume_ml = Number(mlRaw ?? 0);
      const price = Number(priceRaw ?? 0);
      if (!Number.isFinite(volume_ml) || volume_ml <= 0) return null;
      if (!Number.isFinite(price) || price < 0) return null;
      return { volume_ml, price };
    })
    .filter((v): v is StoreProductSizeOption => v !== null);
}

function revalidateStore() {
  try {
    revalidateTag(STORE_PRODUCTS_CACHE_TAG);
    revalidatePath("/store", "layout");
    revalidatePath("/admin");
  } catch {
    /* non-fatal */
  }
}

export async function saveStoreProduct(input: {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: StoreCategory;
  image_urls_raw: string;
  size_options_raw?: string;
  sort_order: number;
  is_active: boolean;
}) {
  const supabase = await createClient();
  if (!supabase) return { ok: false as const, error: "قاعدة البيانات غير متصلة" };

  const image_urls = parseImageUrls(input.image_urls_raw);
  const size_options = parseSizeOptions(input.size_options_raw ?? "");
  const categoryNeedsSizes =
    input.category === "prefilled_bottle" || input.category === "air_freshener";
  if (categoryNeedsSizes && size_options.length === 0) {
    return {
      ok: false as const,
      error: "أضف المقاسات لهذه الفئة بصيغة ml:price (مثال 10:25)",
    };
  }
  const row = {
    name: input.name.trim() || "بدون اسم",
    description: input.description.trim() || null,
    price:
      size_options.length > 0 ? Number(size_options[0]?.price ?? 0) : Number(input.price),
    category: input.category,
    image_urls,
    size_options,
    sort_order: Math.max(0, Math.floor(input.sort_order)),
    is_active: input.is_active,
  };

  if (input.id) {
    const { error } = await supabase
      .from("store_products")
      .update(row)
      .eq("id", input.id);
    if (error) return { ok: false as const, error: error.message };
  } else {
    const { error } = await supabase.from("store_products").insert(row);
    if (error) return { ok: false as const, error: error.message };
  }

  revalidateStore();
  return { ok: true as const };
}

export async function deactivateStoreProduct(id: string) {
  const supabase = await createClient();
  if (!supabase) return { ok: false as const, error: "قاعدة البيانات غير متصلة" };
  const { error } = await supabase
    .from("store_products")
    .update({ is_active: false })
    .eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidateStore();
  return { ok: true as const };
}

/** حذف نهائي — الطلبات المرتبطة تُفصل (SET NULL) وتبقى أسماء المنتجات في لقطة الطلب */
export async function deleteStoreProductPermanent(id: string) {
  const supabase = await createClient();
  if (!supabase) return { ok: false as const, error: "قاعدة البيانات غير متصلة" };
  const { error } = await supabase.from("store_products").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidateStore();
  return { ok: true as const };
}
