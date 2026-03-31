"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { STORE_CATEGORY_SLUGS } from "@/lib/store-categories";

const MAX_PRODUCT_PREFETCH = 32;

function scheduleIdle(fn: () => void) {
  if (typeof requestIdleCallback !== "undefined") {
    requestIdleCallback(() => fn(), { timeout: 1200 });
  } else {
    window.setTimeout(fn, 150);
  }
}

export function PrefetchStoreHubAndCategories() {
  const router = useRouter();

  useEffect(() => {
    scheduleIdle(() => {
      for (const slug of STORE_CATEGORY_SLUGS) {
        router.prefetch(`/store/${slug}`);
      }
    });
  }, [router]);

  return null;
}

type ProductPrefetchProps = { productIds: string[] };

export function PrefetchStoreProductIds({ productIds }: ProductPrefetchProps) {
  const router = useRouter();
  const key = productIds.join(",");

  useEffect(() => {
    if (!key) return;
    const ids = key.split(",").filter(Boolean).slice(0, MAX_PRODUCT_PREFETCH);
    scheduleIdle(() => {
      for (const id of ids) {
        router.prefetch(`/store/product/${id}`);
      }
    });
  }, [router, key]);

  return null;
}
