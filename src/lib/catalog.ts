import { createClient } from "@/lib/supabase/server";
import { MOCK_BOTTLES, MOCK_INGREDIENTS } from "@/lib/mock-catalog";
import type { Bottle, Ingredient } from "@/types";

export async function getCatalog(): Promise<{
  bottles: Bottle[];
  ingredients: Ingredient[];
}> {
  const supabase = await createClient();
  if (!supabase) {
    return { bottles: MOCK_BOTTLES, ingredients: MOCK_INGREDIENTS };
  }

  const [{ data: bottles, error: bErr }, { data: ingredients, error: iErr }] =
    await Promise.all([
      supabase
        .from("bottles")
        .select("*")
        .eq("is_active", true)
        .order("name"),
      supabase
        .from("ingredients")
        .select("*")
        .eq("is_active", true)
        .order("category")
        .order("name"),
    ]);

  if (bErr || iErr || !bottles?.length || !ingredients?.length) {
    return { bottles: MOCK_BOTTLES, ingredients: MOCK_INGREDIENTS };
  }

  return {
    bottles: bottles as Bottle[],
    ingredients: ingredients as Ingredient[],
  };
}
