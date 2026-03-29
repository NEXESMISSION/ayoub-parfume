import type { Bottle, RecipeItem } from "@/types";

export type SharePayload = {
  bottleId: string | null;
  recipe: RecipeItem[];
};

export function encodeShare(payload: SharePayload): string {
  const json = JSON.stringify(payload);
  return btoa(unescape(encodeURIComponent(json)));
}

export function decodeShare(encoded: string): SharePayload | null {
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    const data = JSON.parse(json) as SharePayload;
    if (!data || !Array.isArray(data.recipe)) return null;
    return data;
  } catch {
    return null;
  }
}

export function applyShareToBottle(
  payload: SharePayload,
  bottles: Bottle[]
): Bottle | null {
  if (!payload.bottleId) return null;
  return bottles.find((b) => b.id === payload.bottleId) ?? null;
}
