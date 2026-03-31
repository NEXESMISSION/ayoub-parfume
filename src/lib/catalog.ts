import { createClient } from "@/lib/supabase/server";
import type { Bottle, Ingredient } from "@/types";

export async function getCatalog(): Promise<{
  bottles: Bottle[];
  ingredients: Ingredient[];
}> {
  const supabase = await createClient();
  if (!supabase) {
    return { bottles: [], ingredients: [] };
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

  return {
    bottles: bErr ? [] : ((bottles ?? []) as Bottle[]),
    ingredients: iErr ? [] : ((ingredients ?? []) as Ingredient[]),
  };
}
