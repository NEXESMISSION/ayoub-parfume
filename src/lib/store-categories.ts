import type { StoreCategory } from "@/types";

export const STORE_CATEGORY_SLUGS = [
  "original-bottles",
  "prefilled-bottles",
  "air-freshener",
] as const;

export type StoreCategorySlug = (typeof STORE_CATEGORY_SLUGS)[number];

export type StoreCategoryInfo = {
  slug: StoreCategorySlug;
  category: StoreCategory;
  title: string;
  subtitle: string;
  /** Hero tile on /store — use optimized static assets from /public */
  coverSrc: string;
};

export const STORE_CATEGORIES: StoreCategoryInfo[] = [
  {
    slug: "original-bottles",
    category: "original_bottle",
    title: "عطور اصلية",
    subtitle: "زجاج فاخر وجودة عالية",
    coverSrc: "/store-categories/original-bottles.jpg",
  },
  {
    slug: "prefilled-bottles",
    category: "prefilled_bottle",
    title: "عطور مركبة",
    subtitle: "جاهزة بالكمية والتركيبة",
    coverSrc: "/store-categories/prefilled-bottles.jpg",
  },
  {
    slug: "air-freshener",
    category: "air_freshener",
    title: "عطور الجو",
    subtitle: "للمساحات والسيارة",
    coverSrc: "/store-categories/air-freshener.avif",
  },
];

const SLUG_TO_CATEGORY = Object.fromEntries(
  STORE_CATEGORIES.map((c) => [c.slug, c.category] as const),
) as Record<StoreCategorySlug, StoreCategory>;

export function categoryFromSlug(
  slug: string,
): StoreCategory | null {
  return SLUG_TO_CATEGORY[slug as StoreCategorySlug] ?? null;
}

export function categoryInfo(
  slug: string,
): StoreCategoryInfo | undefined {
  return STORE_CATEGORIES.find((c) => c.slug === slug);
}

export function slugForCategory(
  category: StoreCategory,
): StoreCategorySlug {
  const row = STORE_CATEGORIES.find((c) => c.category === category);
  if (!row) return "original-bottles";
  return row.slug;
}
