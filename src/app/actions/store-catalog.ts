"use server";

import { createClient } from "@/lib/supabase/server";
import type { StoreCategory } from "@/types";
import { revalidatePath } from "next/cache";

function parseImageUrls(raw: string): string[] {
  return raw
    .split(/\r?\n|,/)
    .map((s) => s.trim())
    .filter((s) => /^https?:\/\//i.test(s));
}

function revalidateStore() {
  try {
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
  sort_order: number;
  is_active: boolean;
}) {
  const supabase = await createClient();
  if (!supabase) return { ok: false as const, error: "قاعدة البيانات غير متصلة" };

  const image_urls = parseImageUrls(input.image_urls_raw);
  const row = {
    name: input.name.trim() || "بدون اسم",
    description: input.description.trim() || null,
    price: Number(input.price),
    category: input.category,
    image_urls,
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
