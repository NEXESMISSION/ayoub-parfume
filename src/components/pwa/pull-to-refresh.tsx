"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const THRESHOLD = 72;
const MAX_PULL = 130;
/** مقاومة السحب — يحتاج سحباً أطول كما في التطبيقات */
const RESISTANCE = 0.42;

/** لمس داخل منطقة تمرير داخلية (مثل منشئ العطر) — window.scrollY يبقى 0 فلا نفعّل السحب للتحديث */
function isInsideVerticalScrollContainer(target: EventTarget | null): boolean {
  if (!target || !(target instanceof Element)) return false;
  let node: Element | null = target;
  while (node) {
    if (node === document.documentElement || node === document.body) break;
    const el = node as HTMLElement;
    const st = window.getComputedStyle(el);
    const oy = st.overflowY;
    if (
      (oy === "auto" || oy === "scroll" || oy === "overlay") &&
      el.scrollHeight > el.clientHeight + 2
    ) {
      return true;
    }
    node = el.parentElement;
  }
  return false;
}

function isStandaloneDisplay(): boolean {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    nav.standalone === true
  );
}

/**
 * سحب للأسفل من أعلى الصفحة (عند scrollY ≈ 0) لتحديث كامل — يعمل في وضع PWA فقط.
 */
export function PullToRefresh() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  const [pull, setPull] = useState(0);
  const startY = useRef<number | null>(null);
  const pullRef = useRef(0);

  useEffect(() => {
    setEnabled(isStandaloneDisplay());
    const mq = window.matchMedia("(display-mode: standalone)");
    const onChange = () => setEnabled(isStandaloneDisplay());
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    /** صفحة المنشئ: تمرير داخلي فقط — تعطيل السحب للتحديث بالكامل */
    if (pathname === "/build") return;

    const onStart = (e: TouchEvent) => {
      if (isInsideVerticalScrollContainer(e.target)) return;
      if (window.scrollY > 6) return;
      startY.current = e.touches[0].clientY;
    };

    const onMove = (e: TouchEvent) => {
      if (startY.current === null) return;
      if (window.scrollY > 6) {
        startY.current = null;
        pullRef.current = 0;
        setPull(0);
        return;
      }
      const y = e.touches[0].clientY;
      const delta = y - startY.current;
      if (delta > 0) {
        e.preventDefault();
        const p = Math.min(delta * RESISTANCE, MAX_PULL);
        pullRef.current = p;
        setPull(p);
      } else {
        pullRef.current = 0;
        setPull(0);
      }
    };

    const onEnd = () => {
      if (startY.current === null) return;
      const p = pullRef.current;
      startY.current = null;
      pullRef.current = 0;
      setPull(0);
      if (p >= THRESHOLD) {
        window.location.reload();
      }
    };

    document.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend", onEnd);
    document.addEventListener("touchcancel", onEnd);

    return () => {
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
      document.removeEventListener("touchcancel", onEnd);
    };
  }, [enabled, pathname]);

  if (!enabled || pathname === "/build") return null;

  const progress = Math.min(pull / THRESHOLD, 1);
  const showHint = pull > 8;
  /** يبرز المؤشر أسفل الشريط الآمن */
  const offset = Math.max(0, pull * 0.85 - 8);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[200] flex justify-center"
      style={{
        paddingTop: "max(4px, env(safe-area-inset-top))",
      }}
      aria-hidden
    >
      <div
        className="flex flex-col items-center transition-opacity duration-150"
        style={{
          opacity: showHint ? Math.min(0.2 + progress * 0.8, 1) : 0,
          transform: `translateY(${offset}px)`,
        }}
      >
        <div className="flex flex-col items-center rounded-2xl border border-stone-200/90 bg-white/95 px-4 py-2.5 shadow-lg shadow-stone-900/10 backdrop-blur-md ring-1 ring-[#D4A84B]/20">
          <div
            className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-[#f5e0a8]/80 to-[#D4A84B]/40"
            style={{
              transform: `rotate(${progress * 220}deg)`,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7a5a22"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5"
            >
              <path d="M12 5v10" />
              <path d="m8 11 3.5 3.5a1.5 1.5 0 0 0 2.2 0L17 11" />
            </svg>
          </div>
          <span className="mt-1 max-w-[10rem] text-center text-[0.65rem] font-bold leading-tight text-stone-600">
            {progress >= 1
              ? "اترك للتحديث"
              : "اسحب للأسفل لتحديث الصفحة"}
          </span>
        </div>
      </div>
    </div>
  );
}
