"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  images: string[];
  productName: string;
};

export function ProductGallery({ images, productName }: Props) {
  const [active, setActive] = useState(0);
  const safe = images.filter((u) => /^https?:\/\//i.test(u));
  const current = safe[active] ?? safe[0];

  if (safe.length === 0) {
    return (
      <div className="flex aspect-square w-full max-w-xl items-center justify-center rounded-[1.25rem] border border-dashed border-stone-300/90 bg-gradient-to-b from-stone-100/80 to-stone-50 text-sm text-stone-400">
        لا صور لهذا المنتج
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl lg:max-w-none">
      <div
        className={cn(
          "relative aspect-square w-full overflow-hidden rounded-[1.25rem]",
          "bg-gradient-to-br from-stone-100 via-white to-stone-50",
          "shadow-[0_20px_50px_-24px_rgba(28,25,23,0.25),inset_0_1px_0_rgba(255,255,255,0.9)]",
          "ring-1 ring-stone-200/90",
        )}
      >
        <Image
          src={current}
          alt={productName}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,transparent_40%,rgba(40,35,30,0.12)_100%)]"
          aria-hidden
        />
      </div>
      {safe.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {safe.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`صورة ${i + 1}`}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-xl border-2 transition sm:size-[4.25rem]",
                i === active
                  ? "border-[#C5973E] shadow-md shadow-[#D4A84B]/20 ring-2 ring-[#D4A84B]/25"
                  : "border-stone-200/90 opacity-80 hover:border-stone-300 hover:opacity-100",
              )}
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                sizes="68px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
