import type { Bottle, Ingredient, RecipeItem } from "@/types";

export function buildIngredientMap(ingredients: Ingredient[]) {
  return Object.fromEntries(ingredients.map((i) => [i.id, i])) as Record<
    string,
    Ingredient
  >;
}

export function computeTotals(
  bottle: Bottle | null,
  recipe: RecipeItem[],
  ingredientsMap: Record<string, Ingredient | undefined>
) {
  const ingredientsTotal = recipe.reduce((acc, item) => {
    const ing = ingredientsMap[item.ingredientId];
    if (!ing) return acc;
    return acc + ing.price_per_gram * item.grams;
  }, 0);

  const bottlePrice = bottle?.base_price ?? 0;
  const totalPrice = bottlePrice + ingredientsTotal;

  const usedMl = recipe.reduce((acc, item) => acc + item.grams, 0);
  const capacity = bottle?.capacity_ml ?? 0;
  const remainingMl = Math.max(0, capacity - usedMl);
  const overCapacity = capacity > 0 && usedMl > capacity;

  return {
    ingredientsTotal,
    bottlePrice,
    totalPrice,
    usedMl,
    remainingMl,
    overCapacity,
  };
}

/** Target pyramid: top 30%, heart 50%, base 20% by gram share */
export function scentBalance(recipe: RecipeItem[], map: Record<string, Ingredient | undefined>) {
  const byCat = { top: 0, heart: 0, base: 0 };
  let total = 0;
  for (const r of recipe) {
    const ing = map[r.ingredientId];
    if (!ing) continue;
    byCat[ing.category] += r.grams;
    total += r.grams;
  }
  if (total === 0) {
    return { top: 0, heart: 0, base: 0, deviation: 0 };
  }
  const pTop = (byCat.top / total) * 100;
  const pHeart = (byCat.heart / total) * 100;
  const pBase = (byCat.base / total) * 100;
  const deviation =
    Math.abs(pTop - 30) * 0.3 +
    Math.abs(pHeart - 50) * 0.5 +
    Math.abs(pBase - 20) * 0.2;
  return { top: pTop, heart: pHeart, base: pBase, deviation };
}
