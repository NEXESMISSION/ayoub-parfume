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
      <div className="flex aspect-square w-full items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-gradient-to-br from-stone-100 to-stone-50">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="mx-auto size-10 text-stone-300" aria-hidden>
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <circle cx="9" cy="9" r="1.5" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
          <p className="mt-2 text-sm text-stone-400">لا صور لهذا المنتج</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-stone-100 shadow-[0_16px_48px_-20px_rgba(28,25,23,0.15)] ring-1 ring-stone-200/80">
        <Image
          src={current}
          alt={productName}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>

      {safe.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {safe.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`صورة ${i + 1}`}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-xl transition sm:size-[4.5rem]",
                i === active
                  ? "ring-2 ring-[#C5973E] ring-offset-2 ring-offset-[#faf8f5]"
                  : "opacity-60 ring-1 ring-stone-200 hover:opacity-100",
              )}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="72px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
