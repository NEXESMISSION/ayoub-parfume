"use server";

import { createClient } from "@/lib/supabase/server";
import type { IngredientCategory } from "@/types";
import { revalidatePath } from "next/cache";

function slugify(name: string) {
  const s = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\u0600-\u06ff-]/gi, "");
  return s || `item-${Date.now().toString(36)}`;
}

export async function saveBottle(input: {
  id?: string;
  name: string;
  capacity_ml: number;
  base_price: number;
  image_url: string;
  is_active: boolean;
}) {
  const supabase = await createClient();
  if (!supabase) return { ok: false as const, error: "قاعدة البيانات غير متصلة" };

  const row = {
    name: input.name.trim() || "بدون اسم",
    capacity_ml: Math.max(1, Math.floor(input.capacity_ml)),
    base_price: Number(input.base_price),
    image_url: input.image_url.trim() || null,
    is_active: input.is_active,
  };

  if (input.id) {
    const { error } = await supabase.from("bottles").update(row).eq("id", input.id);
    if (error) return { ok: false as const, error: error.message };
  } else {
    const { error } = await supabase.from("bottles").insert(row);
    if (error) return { ok: false as const, error: error.message };
  }

  revalidatePath("/build");
  revalidatePath("/admin");
  return { ok: true as const };
}

export async function deactivateBottle(id: string) {
  const supabase = await createClient();
  if (!supabase) return { ok: false as const, error: "قاعدة البيانات غير متصلة" };
  const { error } = await supabase.from("bottles").update({ is_active: false }).eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/build");
  revalidatePath("/admin");
  return { ok: true as const };
}

/** حذف نهائي إن لم تكن هناك طلبات مرتبطة */
export async function deleteBottlePermanent(id: string) {
  const supabase = await createClient();
  if (!supabase) return { ok: false as const, error: "قاعدة البيانات غير متصلة" };
  const { error } = await supabase.from("bottles").delete().eq("id", id);
  if (error) {
    if (error.code === "23503" || error.message.includes("foreign key")) {
      return {
        ok: false as const,
        error:
          "لا يمكن الحذف: توجد طلبات تستخدم هذه القارورة. استخدم «إخفاء» بدلاً من ذلك.",
      };
    }
    return { ok: false as const, error: error.message };
  }
  revalidatePath("/build");
  revalidatePath("/admin");
  return { ok: true as const };
}

export async function saveIngredient(input: {
  id?: string;
  name: string;
  category: IngredientCategory;
  price_per_gram: number;
  intensity_factor: number;
  image_url: string;
  is_active: boolean;
}) {
  const supabase = await createClient();
  if (!supabase) return { ok: false as const, error: "قاعدة البيانات غير متصلة" };

  const slug = slugify(input.name).slice(0, 120);

  const row = {
    name: input.name.trim() || "بدون اسم",
    slug,
    category: input.category,
    price_per_gram: Number(input.price_per_gram),
    intensity_factor: Math.max(0.1, Number(input.intensity_factor) || 1),
    image_url: input.image_url.trim() || null,
    is_active: input.is_active,
  };

  if (input.id) {
    const { error } = await supabase.from("ingredients").update(row).eq("id", input.id);
    if (error) return { ok: false as const, error: error.message };
  } else {
    const { error } = await supabase.from("ingredients").insert(row);
    if (error) return { ok: false as const, error: error.message };
  }

  revalidatePath("/build");
  revalidatePath("/admin");
  return { ok: true as const };
}

export async function deactivateIngredient(id: string) {
  const supabase = await createClient();
  if (!supabase) return { ok: false as const, error: "قاعدة البيانات غير متصلة" };
  const { error } = await supabase
    .from("ingredients")
    .update({ is_active: false })
    .eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/build");
  revalidatePath("/admin");
  return { ok: true as const };
}
