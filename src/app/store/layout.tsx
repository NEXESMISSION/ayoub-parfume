import type { ReactNode } from "react";
import { PrefetchStoreHubAndCategories } from "@/components/store/prefetch-store-navigation";

/** ISR للمجلد — يكمّل التخزين المؤقت في store-data */
export const revalidate = 120;

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PrefetchStoreHubAndCategories />
      {children}
    </>
  );
}
