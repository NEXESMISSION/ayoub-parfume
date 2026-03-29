"use server";

import { createClient } from "@/lib/supabase/server";
import type { RecipeItem } from "@/types";
import { revalidatePath } from "next/cache";

export async function createOrder(input: {
  customerName: string;
  whatsappNumber: string;
  bottleId: string;
  /** يُخزَّن مع الطلب حتى يبقى الاسم ظاهراً بعد حذف القارورة من الكتالوج */
  bottleNameSnapshot: string;
  recipe: RecipeItem[];
  stickerText: string;
  totalPrice: number;
  deliveryAddress: string;
}) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      const mockId = crypto.randomUUID();
      return { ok: true as const, id: mockId, demo: true };
    }

    // Anon users can insert (orders_insert_public) but cannot SELECT rows back
    // (orders_select_admin only). .select().single() would error or leave data null
    // and crash the action — breaking fetchServerAction with a non-Flight response.
    const recipeJson = JSON.parse(
      JSON.stringify(input.recipe)
    ) as typeof input.recipe;

    const { error } = await supabase.from("orders").insert({
      order_kind: "custom",
      customer_name: input.customerName,
      whatsapp_number: input.whatsappNumber,
      delivery_address: input.deliveryAddress.trim() || null,
      bottle_id: input.bottleId,
      bottle_name_snapshot: input.bottleNameSnapshot.trim() || null,
      recipe: recipeJson,
      sticker_text: input.stickerText,
      total_price: input.totalPrice,
      status: "new",
    });

    if (error) {
      return { ok: false as const, error: error.message };
    }

    try {
      revalidatePath("/admin");
    } catch {
      /* non-fatal */
    }
    return { ok: true as const, id: "", demo: false };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "خطأ غير متوقع";
    return { ok: false as const, error: msg };
  }
}

export async function createStoreOrder(input: {
  storeProductId: string;
  whatsappNumber: string;
  deliveryAddress: string;
  customerName?: string;
}) {
  if (input.deliveryAddress.trim().length < 5) {
    return { ok: false as const, error: "عنوان التوصيل قصير جداً" };
  }
  try {
    const supabase = await createClient();
    if (!supabase) {
      const mockId = crypto.randomUUID();
      return { ok: true as const, id: mockId, demo: true };
    }

    const { data: product, error: selErr } = await supabase
      .from("store_products")
      .select("id, name, price, is_active")
      .eq("id", input.storeProductId)
      .maybeSingle();

    if (selErr || !product || !product.is_active) {
      return {
        ok: false as const,
        error: selErr?.message ?? "المنتج غير متوفر",
      };
    }

    const price = Number(product.price);
    const { error } = await supabase.from("orders").insert({
      order_kind: "store",
      store_product_id: product.id,
      store_product_name_snapshot: product.name,
      customer_name:
        (input.customerName ?? input.whatsappNumber).trim() || null,
      whatsapp_number: input.whatsappNumber,
      delivery_address: input.deliveryAddress.trim(),
      bottle_id: null,
      recipe: [],
      sticker_text: product.name,
      total_price: price,
      status: "new",
    });

    if (error) {
      return { ok: false as const, error: error.message };
    }

    try {
      revalidatePath("/admin");
    } catch {
      /* non-fatal */
    }
    return { ok: true as const, id: "", demo: false };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "خطأ غير متوقع";
    return { ok: false as const, error: msg };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient();
  if (!supabase) {
    return { ok: true as const, demo: true };
  }
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin");
  return { ok: true as const, demo: false };
}

export async function cancelOrder(orderId: string) {
  return updateOrderStatus(orderId, "cancelled");
}

/** حذف صف الطلب نهائياً (لوحة الإدارة فقط — RLS) */
export async function deleteOrderPermanent(orderId: string) {
  const supabase = await createClient();
  if (!supabase) {
    return { ok: true as const, demo: true };
  }
  const { error } = await supabase.from("orders").delete().eq("id", orderId);
  if (error) return { ok: false as const, error: error.message };
  try {
    revalidatePath("/admin");
  } catch {
    /* non-fatal */
  }
  return { ok: true as const, demo: false };
}
