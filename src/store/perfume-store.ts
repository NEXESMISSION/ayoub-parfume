"use client";

import { create } from "zustand";
import type { Bottle, RecipeItem } from "@/types";

/** حدود كمية الزيت في المنشئ (مل — نفس الحقل `grams` في الوصفة) */
export const OIL_GRAMS_MIN = 5;
/** أقصى كمية عندما لا توجد قارورة بعد (للتوافق) */
export const OIL_GRAMS_MAX = 60;
export const OIL_ML_MIN = OIL_GRAMS_MIN;
export const OIL_ML_MAX = OIL_GRAMS_MAX;
/** زيادة/نقصان الكمية بخطوات 5 مل (5، 10، 15، …) */
export const OIL_ML_STEP = 5;

/** أقصى مل مسموح به = سعة القارورة (مقرب لأسفل لخطوة 5 مل)، أو 60 مل بدون قارورة */
export function maxOilMlForBottle(bottle: Bottle | null): number {
  const cap = bottle?.capacity_ml;
  if (cap == null || cap <= 0) return OIL_GRAMS_MAX;
  const stepped = Math.floor(cap / OIL_ML_STEP) * OIL_ML_STEP;
  return Math.max(OIL_GRAMS_MIN, stepped);
}

/** نسب تركيز مقترحة من سعة القارورة (العطر الزيتي؛ الباقي كحول معطّر) */
export const OIL_PRESET_PERCENT_EDT = 10;
export const OIL_PRESET_PERCENT_EDP = 20;
export const OIL_PRESET_PERCENT_EXTRAIT = 30;

/** يحسب مل العطر من نسبة مئوية لسعة القارورة، مع تقريب لخطوة 5 مل والحد الأقصى */
export function oilMlFromBottlePercent(
  bottle: Bottle | null,
  percentOfCapacity: number
): number {
  const cap = maxOilMlForBottle(bottle);
  const capMl = bottle?.capacity_ml ?? 0;
  if (capMl <= 0) return Math.min(cap, OIL_GRAMS_MIN);
  const raw = capMl * (percentOfCapacity / 100);
  const snapped = Math.round(raw / OIL_ML_STEP) * OIL_ML_STEP;
  return Math.min(cap, Math.max(OIL_GRAMS_MIN, snapped));
}

function snapOilMl(ml: number, cap: number): number {
  const snapped = Math.round(ml / OIL_ML_STEP) * OIL_ML_STEP;
  return Math.min(cap, Math.max(OIL_GRAMS_MIN, snapped));
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
  setBottle: (bottle) =>
    set((state) => {
      const cap = maxOilMlForBottle(bottle);
      const r = state.recipe[0];
      const recipe = r
        ? [{ ...r, grams: snapOilMl(r.grams, cap) }]
        : state.recipe;
      return { bottle, recipe };
    }),
  setRecipe: (recipe) => set({ recipe: recipe.slice(0, 1) }),
  selectIngredient: (ingredientId) => {
    const cur = get().recipe[0];
    if (cur?.ingredientId === ingredientId) {
      set({ recipe: [] });
      return;
    }
    const cap = maxOilMlForBottle(get().bottle);
    set({ recipe: [{ ingredientId, grams: snapOilMl(OIL_GRAMS_MIN, cap) }] });
  },
  setGrams: (grams) => {
    const r = get().recipe[0];
    if (!r) return;
    const cap = maxOilMlForBottle(get().bottle);
    set({
      recipe: [{ ...r, grams: snapOilMl(grams, cap) }],
    });
  },
  hydrateFromShare: (payload) => {
    const bottle = payload.bottle ?? get().bottle;
    const cap = maxOilMlForBottle(bottle);
    set({
      bottle,
      recipe: (payload.recipe ?? [])
        .slice(0, 1)
        .map((item) => ({
          ...item,
          grams: snapOilMl(item.grams, cap),
        })),
    });
  },
  reset: () => set({ bottle: null, recipe: [] }),
}));
