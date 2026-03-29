"use server";

import { createClient } from "@/lib/supabase/server";
import type { RecipeItem } from "@/types";
import { revalidatePath } from "next/cache";

export async function createOrder(input: {
  customerName: string;
  whatsappNumber: string;
  bottleId: string;
  recipe: RecipeItem[];
  stickerText: string;
  totalPrice: number;
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
      customer_name: input.customerName,
      whatsapp_number: input.whatsappNumber,
      bottle_id: input.bottleId,
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
