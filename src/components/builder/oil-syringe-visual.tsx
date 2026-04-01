"use client";

import { cn } from "@/lib/utils";

type Props = {
  valueMl: number;
  minMl: number;
  maxMl: number;
  /** أقصر للشاشات الصغيرة — يبقي ملخص الأسعار أعلى دون تمرير كثير */
  compact?: boolean;
  className?: string;
};

/**
 * Syringe-style liquid + plunger; level follows valueMl between min and max.
 */
export function OilSyringeVisual({
  valueMl,
  minMl,
  maxMl,
  compact = false,
  className,
}: Props) {
  const span = Math.max(0.001, maxMl - minMl);
  const t = Math.min(1, Math.max(0, (valueMl - minMl) / span));
  const BARREL_H = compact ? 132 : 200;
  const PLUNGER_H = compact ? 20 : 24;
  const barrelW = compact ? 64 : 76;
  const PAD = compact ? 5 : 6;
  const travel = BARREL_H - PLUNGER_H - PAD * 2;
  const plungerTop = PAD + (1 - t) * travel;
  const liquidHeightPct = 6 + t * 88;

  return (
    <div
      className={cn("flex items-start justify-center gap-2", className)}
      aria-hidden
    >
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "rounded-full border border-zinc-200 bg-gradient-to-b from-zinc-100 to-zinc-200/90 shadow-sm",
            compact ? "h-1.5 w-16" : "h-2 w-20",
          )}
        />
        <div
          className={cn(
            "relative mt-0.5 overflow-hidden rounded-xl border-2 border-zinc-200/90 bg-gradient-to-r from-white via-zinc-50/80 to-white shadow-[inset_0_2px_8px_rgba(0,0,0,0.06)]",
            compact ? "rounded-lg" : "",
          )}
          style={{ height: BARREL_H, width: barrelW }}
        >
          {/* سائل ذهبي يمثّل تركيز العطر الزيتي */}
          <div
            className="absolute bottom-0 left-0 right-0 overflow-hidden rounded-b-lg transition-[height] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            style={{
              height: `${liquidHeightPct}%`,
              background:
                "linear-gradient(180deg, rgba(252, 231, 176, 0.98) 0%, rgba(212, 168, 75, 0.95) 42%, rgba(166, 124, 46, 0.96) 100%)",
              boxShadow:
                "inset 0 2px 12px rgba(255,255,255,0.5), 0 -4px 14px rgba(197, 151, 62, 0.4)",
            }}
          >
            <div className="absolute inset-0 opacity-50 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.65),transparent)]" />
            <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/35 to-transparent" />
          </div>
          <div
            className="absolute left-1/2 z-10 w-[88%] -translate-x-1/2 rounded-lg border border-zinc-400/70 bg-gradient-to-b from-zinc-100 via-zinc-300 to-zinc-400 shadow-md transition-[top] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            style={{ top: plungerTop, height: PLUNGER_H }}
          >
            <div className="absolute left-1/2 top-1/2 h-0.5 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-600/35" />
          </div>
        </div>
        <div
          className={cn(
            "mt-0.5 rounded-sm border border-zinc-300 bg-gradient-to-b from-zinc-200 to-zinc-500",
            compact ? "h-2.5 w-4" : "h-3.5 w-5",
          )}
        />
        <div
          className={cn(
            "w-1.5 rounded-b-sm bg-gradient-to-r from-zinc-500 via-zinc-300 to-zinc-500",
            compact ? "h-7" : "h-12",
          )}
        />
      </div>
      <div
        className="flex flex-col justify-between py-1 text-[9px] font-semibold tabular-nums text-zinc-400"
        style={{ marginTop: compact ? 6 : 10, height: BARREL_H + (compact ? 12 : 18) }}
      >
        <span dir="ltr">{maxMl} مل</span>
        <span dir="ltr">{minMl} مل</span>
      </div>
    </div>
  );
}
