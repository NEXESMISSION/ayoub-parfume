"use client";

import { create } from "zustand";
import type { Bottle, RecipeItem } from "@/types";

/** حدود كمية الزيت في منشئ العطر (غرام) */
export const OIL_GRAMS_MIN = 1;
export const OIL_GRAMS_MAX = 60;

function clampOilGrams(grams: number): number {
  return Math.min(OIL_GRAMS_MAX, Math.max(OIL_GRAMS_MIN, grams));
}

export type PerfumeState = {
  bottle: Bottle | null;
  /** At most one ingredient in the blend */
  recipe: RecipeItem[];
  setBottle: (b: Bottle | null) => void;
  setRecipe: (r: RecipeItem[]) => void;
  /** Selects a single ingredient; replaces any previous selection */
  selectIngredient: (ingredientId: string) => void;
  setGrams: (grams: number) => void;
  hydrateFromShare: (
    payload: Partial<Pick<PerfumeState, "bottle" | "recipe">>
  ) => void;
  reset: () => void;
};

export const usePerfumeStore = create<PerfumeState>((set, get) => ({
  bottle: null,
  recipe: [],
  setBottle: (bottle) => set({ bottle }),
  setRecipe: (recipe) => set({ recipe: recipe.slice(0, 1) }),
  selectIngredient: (ingredientId) => {
    const cur = get().recipe[0];
    if (cur?.ingredientId === ingredientId) {
      set({ recipe: [] });
      return;
    }
    set({ recipe: [{ ingredientId, grams: OIL_GRAMS_MIN }] });
  },
  setGrams: (grams) => {
    const r = get().recipe[0];
    if (!r) return;
    set({
      recipe: [{ ...r, grams: clampOilGrams(grams) }],
    });
  },
  hydrateFromShare: (payload) =>
    set({
      bottle: payload.bottle ?? get().bottle,
      recipe: (payload.recipe ?? [])
        .slice(0, 1)
        .map((item) => ({
          ...item,
          grams: clampOilGrams(item.grams),
        })),
    }),
  reset: () => set({ bottle: null, recipe: [] }),
}));
