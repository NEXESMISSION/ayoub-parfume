import type { Bottle, Ingredient, RecipeItem } from "@/types";

/** سعر الكحول الإيثيلي المعطّر — بالدينار التونسي للّتر الواحد */
export const ALCOHOL_PRICE_PER_LITER_DT = 20;

/** سعر التوصيل الثابت — بالدينار التونسي */
export const DELIVERY_PRICE_DT = 7;

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

  const usedMl = recipe.reduce((acc, item) => acc + item.grams, 0);
  const capacity = bottle?.capacity_ml ?? 0;
  const remainingMl = Math.max(0, capacity - usedMl);
  const overCapacity = capacity > 0 && usedMl > capacity;

  const alcoholPrice =
    !overCapacity && remainingMl > 0
      ? (remainingMl / 1000) * ALCOHOL_PRICE_PER_LITER_DT
      : 0;

  const subtotal = bottlePrice + ingredientsTotal + alcoholPrice;
  const deliveryPrice = DELIVERY_PRICE_DT;
  const totalPrice = subtotal + deliveryPrice;

  return {
    ingredientsTotal,
    bottlePrice,
    alcoholPrice,
    subtotal,
    deliveryPrice,
    totalPrice,
    usedMl,
    remainingMl,
    overCapacity,
  };
}

/** حصة كل فئة جمهور من إجمالي الغرامات (للتحليلات لاحقاً) */
export function scentBalance(recipe: RecipeItem[], map: Record<string, Ingredient | undefined>) {
  const byCat = { women: 0, man: 0, kids: 0 };
  let total = 0;
  for (const r of recipe) {
    const ing = map[r.ingredientId];
    if (!ing) continue;
    byCat[ing.category] += r.grams;
    total += r.grams;
  }
  if (total === 0) {
    return { women: 0, man: 0, kids: 0, deviation: 0 };
  }
  return {
    women: (byCat.women / total) * 100,
    man: (byCat.man / total) * 100,
    kids: (byCat.kids / total) * 100,
    deviation: 0,
  };
}
