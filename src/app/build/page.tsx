import { Suspense } from "react";
import { getCatalog } from "@/lib/catalog";
import { ScentBuilder } from "@/components/builder/scent-builder";

export const dynamic = "force-dynamic";

export default async function BuildPage() {
  const { bottles, ingredients } = await getCatalog();

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-stone-400">
          Loading builder…
        </div>
      }
    >
      <ScentBuilder bottles={bottles} ingredients={ingredients} />
    </Suspense>
  );
}
