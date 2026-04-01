"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  Minus,
  Plus,
  Search,
} from "lucide-react";
import {
  OIL_GRAMS_MIN,
  OIL_ML_MIN,
  OIL_ML_STEP,
  OIL_PRESET_PERCENT_EDP,
  OIL_PRESET_PERCENT_EDT,
  OIL_PRESET_PERCENT_EXTRAIT,
  maxOilMlForBottle,
  oilMlFromBottlePercent,
  usePerfumeStore,
} from "@/store/perfume-store";
import { OilSyringeVisual } from "@/components/builder/oil-syringe-visual";
import {
  ALCOHOL_PRICE_PER_LITER_DT,
  buildIngredientMap,
  computeTotals,
} from "@/lib/pricing";
import { applyShareToBottle, decodeShare } from "@/lib/share-state";
import { createOrder } from "@/app/actions/orders";
import type { Bottle, Ingredient, IngredientCategory } from "@/types";
import {
  INGREDIENT_CATEGORY_LABELS,
  INGREDIENT_CATEGORIES,
} from "@/lib/ingredient-category";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const STEP_TITLES = [
  "اختر القارورة",
  "اختر العطر الزيتي",
  "الكمية بالمل",
  "الهاتف والتأكيد",
];

/** قارورة فارغة — توضيح بصري للخطوة الأولى */
function EmptyBottleIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="empty-bottle-glass" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgb(228 228 231)" stopOpacity="0.5" />
          <stop offset="50%" stopColor="rgb(244 244 245)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="rgb(212 212 216)" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id="empty-bottle-cap" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d4d4d8" />
          <stop offset="100%" stopColor="#a1a1aa" />
        </linearGradient>
      </defs>
      <rect x="48" y="12" width="44" height="22" rx="4" fill="url(#empty-bottle-cap)" />
      <rect x="58" y="34" width="24" height="10" rx="2" fill="#e4e4e7" />
      <path
        d="M42 48h56c4 0 8 3 8 8v142c0 10-8 18-18 18H52c-10 0-18-8-18-18V56c0-5 4-8 8-8z"
        fill="url(#empty-bottle-glass)"
        stroke="#d4d4d8"
        strokeWidth="2.5"
      />
      <path
        d="M52 68h36v100c0 6-4 10-10 10H62c-6 0-10-4-10-10V68z"
        fill="rgb(250 250 250 / 0.6)"
        stroke="#e4e4e7"
        strokeWidth="1"
        strokeDasharray="4 3"
      />
      <text
        x="70"
        y="128"
        textAnchor="middle"
        fill="#a1a1aa"
        style={{ fontFamily: "system-ui, sans-serif", fontSize: "12px", fontWeight: 700 }}
      >
        فارغة
      </text>
    </svg>
  );
}

function StepHeroTile({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-4 shrink-0 rounded-2xl border-2 border-zinc-200/90 bg-gradient-to-b from-white to-zinc-50/80 px-4 py-4 text-center shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)] sm:px-5 sm:py-5">
      {children}
      <h2 className="mt-2 text-2xl font-black leading-[1.15] tracking-tight text-zinc-900 sm:text-[1.65rem] md:text-3xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-zinc-500">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

/** زجاجة عطر زيتي مركّز — أيقونة خطوة اختيار المكوّن الزيتي */
function OilIngredientBottleIllustration({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const gLiquid = `oil-liq-${uid}`;
  const gGlass = `oil-glass-${uid}`;
  const gCap = `oil-cap-${uid}`;
  return (
    <svg
      viewBox="0 0 120 136"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={gLiquid} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#8F6B28" />
          <stop offset="55%" stopColor="#D4A84B" />
          <stop offset="100%" stopColor="#F0D78C" />
        </linearGradient>
        <linearGradient id={gGlass} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgb(255 255 255 / 0.5)" />
          <stop offset="50%" stopColor="rgb(255 255 255 / 0.08)" />
          <stop offset="100%" stopColor="rgb(228 228 231 / 0.35)" />
        </linearGradient>
        <linearGradient id={gCap} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3f3f46" />
          <stop offset="100%" stopColor="#18181b" />
        </linearGradient>
      </defs>
      <path
        d="M60 6h12v14c0 2-1.2 3.8-3 4.5L62 28v6h16v8H42v-8h16v-6l-7-3.5a5 5 0 0 1-3-4.5V6h12z"
        fill={`url(#${gCap})`}
      />
      <rect x="52" y="34" width="16" height="8" rx="2" fill="#d4d4d8" />
      <path
        d="M44 42h32c6 0 10 4.5 10 10.5v58c0 12-9.5 21.5-21.5 21.5h-9C43.5 132 34 122.5 34 110.5v-58C34 46.5 38 42 44 42z"
        fill={`url(#${gGlass})`}
        stroke="#c4c4c9"
        strokeWidth="2"
      />
      <path
        d="M46 72h28v38c0 8.5-6.5 15-15 15s-15-6.5-15-15V72z"
        fill={`url(#${gLiquid})`}
        opacity="0.88"
      />
      <ellipse cx="52" cy="78" rx="5" ry="14" fill="white" opacity="0.25" />
      <path
        d="M48 48h24v6H48z"
        fill="rgb(255 255 255 / 0.25)"
      />
    </svg>
  );
}

const panel =
  "rounded-2xl border border-zinc-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]";

type Props = {
  bottles: Bottle[];
  ingredients: Ingredient[];
};

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function BottleImage({
  src,
  alt,
  className,
  priority,
}: {
  src: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className={cn("object-cover", className)}
        sizes="(max-width: 768px) 45vw, 200px"
        unoptimized
      />
    );
  }
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-100 via-yellow-50/30 to-zinc-50 text-3xl",
        className,
      )}
      aria-hidden
    >
      🫙
    </div>
  );
}

function BottleTile({
  b,
  active,
  onPick,
}: {
  b: Bottle;
  active: boolean;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border-2 bg-white text-start transition-all duration-200",
        active
          ? "border-[#C5973E] shadow-lg shadow-yellow-700/20 ring-1 ring-[#C5973E]/25"
          : "border-zinc-200/80 hover:border-[#D4A84B]/50 hover:shadow-md",
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-100">
        <BottleImage
          src={b.image_url}
          alt="قارورة عطر"
          priority
          className="transition-transform duration-300 group-hover:scale-105"
        />
        <span
          className={cn(
            "absolute start-2 top-2 flex size-6 items-center justify-center rounded-full bg-[#C5973E] text-white shadow transition-all duration-200",
            active
              ? "scale-100 opacity-100"
              : "pointer-events-none scale-0 opacity-0",
          )}
          aria-hidden
        >
          <Check className="size-3.5" strokeWidth={3} />
        </span>
      </div>
      <div className="shrink-0 border-t border-zinc-100 px-2 py-1.5 text-center">
        <div className="mt-0.5 flex items-center justify-center gap-2 text-[10px]">
          <span className="text-zinc-500">{b.capacity_ml} مل</span>
          <span className="text-zinc-200">·</span>
          <span
            className="font-semibold tabular-nums text-[#8F6B28]"
            dir="ltr"
          >
            {b.base_price.toFixed(2)} د.ت
          </span>
        </div>
      </div>
    </button>
  );
}

function IngTile({
  ing,
  active,
  onPick,
}: {
  ing: Ingredient;
  active: boolean;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border-2 bg-white text-start transition-all duration-200",
        active
          ? "border-[#C5973E] shadow-lg shadow-yellow-700/20 ring-1 ring-[#C5973E]/25"
          : "border-zinc-200/80 hover:border-[#D4A84B]/50 hover:shadow-md",
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-100">
        {ing.image_url ? (
          <Image
            src={ing.image_url}
            alt={ing.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 45vw, 200px"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl text-zinc-300">
            ✧
          </div>
        )}
        <span
          className={cn(
            "absolute start-2 top-2 flex size-6 items-center justify-center rounded-full bg-[#C5973E] text-white shadow transition-all duration-200",
            active
              ? "scale-100 opacity-100"
              : "pointer-events-none scale-0 opacity-0",
          )}
          aria-hidden
        >
          <Check className="size-3.5" strokeWidth={3} />
        </span>
      </div>
      <div className="border-t border-zinc-100 px-2 py-1.5 text-center">
        <p className="line-clamp-1 text-xs font-semibold text-zinc-900">
          {ing.name}
        </p>
      </div>
    </button>
  );
}

const slideVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};

export function ScentBuilder({ bottles, ingredients }: Props) {
  const searchParams = useSearchParams();
  const map = useMemo(() => buildIngredientMap(ingredients), [ingredients]);

  const {
    bottle,
    recipe,
    setBottle,
    setGrams,
    selectIngredient,
    hydrateFromShare,
  } = usePerfumeStore();

  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [addressShortOpen, setAddressShortOpen] = useState(false);
  const [confirmedPhone, setConfirmedPhone] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [ingSearch, setIngSearch] = useState("");
  const [ingAudience, setIngAudience] = useState<IngredientCategory | "all">(
    "all",
  );

  const mainScrollRef = useRef<HTMLDivElement>(null);
  const oilCapMl = useMemo(() => maxOilMlForBottle(bottle), [bottle]);
  const oilPresets = useMemo(() => {
    if (!bottle)
      return {
        edt: OIL_GRAMS_MIN,
        edp: OIL_GRAMS_MIN,
        extrait: OIL_GRAMS_MIN,
      };
    return {
      edt: oilMlFromBottlePercent(bottle, OIL_PRESET_PERCENT_EDT),
      edp: oilMlFromBottlePercent(bottle, OIL_PRESET_PERCENT_EDP),
      extrait: oilMlFromBottlePercent(bottle, OIL_PRESET_PERCENT_EXTRAIT),
    };
  }, [bottle]);

  useEffect(() => {
    const el = mainScrollRef.current;
    if (el) el.scrollTop = 0;
  }, [step]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevHtmlOs = document.documentElement.style.overscrollBehaviorY;
    const prevBodyOs = document.body.style.overscrollBehaviorY;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overscrollBehaviorY = "none";
    document.body.style.overscrollBehaviorY = "none";
    return () => {
      document.body.style.overflow = prevOverflow;
      document.documentElement.style.overscrollBehaviorY = prevHtmlOs;
      document.body.style.overscrollBehaviorY = prevBodyOs;
    };
  }, []);

  useEffect(() => {
    const raw = searchParams.get("s");
    if (!raw) return;
    const decoded = decodeShare(raw);
    if (!decoded) return;
    const b = applyShareToBottle(decoded, bottles);
    hydrateFromShare({ bottle: b, recipe: decoded.recipe });
  }, [searchParams, bottles, hydrateFromShare]);

  const totals = useMemo(
    () => computeTotals(bottle, recipe, map),
    [bottle, recipe, map],
  );

  const selected = recipe[0];
  const selectedIng = selected ? map[selected.ingredientId] : undefined;

  const filteredIngredients = useMemo(() => {
    const q = ingSearch.trim().toLowerCase();
    return ingredients.filter((ing) => {
      if (ingAudience !== "all" && ing.category !== ingAudience) return false;
      if (!q) return true;
      const name = ing.name.toLowerCase();
      const slug = (ing.slug ?? "").toLowerCase();
      return name.includes(q) || slug.includes(q);
    });
  }, [ingredients, ingSearch, ingAudience]);

  const phoneDigits = digitsOnly(phone);
  const canNext = [
    !!bottle,
    !!selected,
    !!selected && !totals.overCapacity,
    phoneDigits.length >= 8 &&
      !totals.overCapacity &&
      !!bottle &&
      !!selected &&
      address.trim().length >= 5,
  ];

  const goNext = () => {
    if (step < 3 && canNext[step]) setStep((s) => s + 1);
  };
  const goBack = () => setStep((s) => Math.max(0, s - 1));

  const onSubmit = async () => {
    setSubmitError(null);
    if (address.trim().length < 5) {
      setAddressShortOpen(true);
      return;
    }
    if (
      !bottle ||
      phoneDigits.length < 8 ||
      !recipe.length ||
      totals.overCapacity
    )
      return;
    setSubmitting(true);
    try {
      const alcoholMl =
        totals.remainingMl > 0 ? totals.remainingMl : null;
      const res = await createOrder({
        customerName: phoneDigits,
        whatsappNumber: phoneDigits,
        bottleId: bottle.id,
        bottleNameSnapshot: "",
        recipe,
        stickerText: "",
        totalPrice: totals.totalPrice,
        deliveryAddress: address.trim(),
        alcoholFillRequested: alcoholMl != null,
        alcoholFillMl: alcoholMl,
      });
      if (res.ok) {
        setConfirmedPhone(phoneDigits);
        setPhone("");
        setAddress("");
        setSuccessOpen(true);
        setStep(0);
      } else {
        setSubmitError(res.error ?? "تعذّر إرسال الطلب");
      }
    } catch {
      setSubmitError(
        "تعذّر الاتصال بالخادم. تحقق من الشبكة وحاول مجدداً.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const stepTransition = {
    duration: 0.2,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  return (
    <>
      <div
        className="fixed inset-0 z-20 flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden overscroll-none bg-zinc-50"
        style={{ maxHeight: "100dvh" }}
      >
        {/* ── Header ── */}
        <header className="shrink-0 px-3 pt-[max(6px,env(safe-area-inset-top))]">
          <div className={cn("mx-auto max-w-4xl px-3 py-2", panel)}>
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                <Link
                  href="/"
                  className="flex shrink-0 items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-zinc-800 active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="size-3.5" aria-hidden>
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  الرئيسية
                </Link>
                <h1 className="min-w-0 truncate text-sm font-bold text-zinc-900 sm:text-base">
                  {STEP_TITLES[step]}
                </h1>
              </div>
              <span className="shrink-0 rounded-full bg-zinc-900 px-2.5 py-0.5 text-[11px] font-bold tabular-nums text-white">
                {step + 1}/4
              </span>
            </div>
            <div className="flex gap-1">
              {STEP_TITLES.map((_, i) => (
                <div
                  key={i}
                  className="h-1 flex-1 overflow-hidden rounded-full bg-zinc-200"
                >
                  <motion.div
                    className={cn(
                      "h-full rounded-full",
                      i < step
                        ? "bg-emerald-500"
                        : i === step
                          ? "bg-[#C5973E]"
                          : "bg-transparent",
                    )}
                    initial={false}
                    animate={{ width: i <= step ? "100%" : "0%" }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* ── Main: منطقة تمرير واحدة (عمودي + أفقي عند الحاجة) لكل الخطوات ── */}
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 py-2 sm:px-4">
          <div
            ref={mainScrollRef}
            className={cn(
              "relative z-0 mx-auto min-h-0 w-full max-w-4xl flex-1 touch-pan-y overflow-y-auto overflow-x-hidden overscroll-y-none",
              "[-webkit-overflow-scrolling:touch]",
            )}
          >
            <AnimatePresence mode="wait">
              {/* Step 0 — Bottles */}
              {step === 0 && (
                <motion.section
                  key="s0"
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={stepTransition}
                  style={{ height: "auto", minHeight: "min-content" }}
                  className="block w-full min-h-0 min-w-0 space-y-3 pb-24"
                >
                  <StepHeroTile
                    title="اختر قارورتك"
                    subtitle="هذه خطوتك الأولى: القارورة تبدأ فارغة — بعدها تختار الزيت ثم الكمية. مرّر لأسفل لرؤية كل القوارير."
                  >
                    <EmptyBottleIllustration className="mx-auto h-36 w-28 sm:h-40 sm:w-32" />
                  </StepHeroTile>
                  {bottles.length === 0 ? (
                    <p className="py-8 text-center text-sm text-zinc-400">
                      لا توجد قوارير متاحة حالياً.
                    </p>
                  ) : (
                    <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                      {bottles.map((b) => (
                        <BottleTile
                          key={b.id}
                          b={b}
                          active={bottle?.id === b.id}
                          onPick={() => setBottle(b)}
                        />
                      ))}
                    </div>
                  )}
                </motion.section>
              )}

              {/* Step 1 — Ingredients (search fixed on top, grid scrolls below) */}
              {step === 1 && (
                <motion.section
                  key="s1"
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={stepTransition}
                  style={{ height: "auto", minHeight: "min-content" }}
                  className="block w-full min-h-0 min-w-0 space-y-3 pb-24"
                >
                  <StepHeroTile
                    title="اختر العطر الزيتي"
                    subtitle="المكوّن الزيتي هو رائحة عطرك — اختر الرائحة التي تعجبك من القائمة أدناه."
                  >
                    <OilIngredientBottleIllustration className="mx-auto h-[5.5rem] w-[5.25rem] sm:h-28 sm:w-28" />
                  </StepHeroTile>
                  <div className="flex flex-wrap justify-center gap-1.5 px-0.5">
                    <button
                      type="button"
                      onClick={() => setIngAudience("all")}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-[11px] font-semibold transition",
                        ingAudience === "all"
                          ? "bg-zinc-900 text-white"
                          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200",
                      )}
                    >
                      الكل
                    </button>
                    {INGREDIENT_CATEGORIES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setIngAudience(c)}
                        className={cn(
                          "rounded-full px-3 py-1.5 text-[11px] font-semibold transition",
                          ingAudience === c
                            ? "bg-[#C5973E] text-white shadow-sm"
                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200",
                        )}
                      >
                        {INGREDIENT_CATEGORY_LABELS[c]}
                      </button>
                    ))}
                  </div>
                  <div className="relative mx-auto w-full max-w-md">
                    <Search className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                    <Input
                      type="search"
                      dir="rtl"
                      placeholder="بحث عن مكوّن…"
                      value={ingSearch}
                      onChange={(e) => setIngSearch(e.target.value)}
                      className="h-10 rounded-xl border-zinc-200/90 bg-white pe-10 ps-4 text-sm shadow-sm placeholder:text-zinc-400 focus-visible:border-[#C5973E] focus-visible:ring-2 focus-visible:ring-[#C5973E]/20"
                    />
                  </div>

                  {filteredIngredients.length === 0 ? (
                    <p className="py-6 text-center text-sm text-zinc-400">
                      لا نتائج
                    </p>
                  ) : (
                    <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                      {filteredIngredients.map((ing) => (
                        <IngTile
                          key={ing.id}
                          ing={ing}
                          active={selected?.ingredientId === ing.id}
                          onPick={() => selectIngredient(ing.id)}
                        />
                      ))}
                    </div>
                  )}
                </motion.section>
              )}

              {/* Step 2 — Quantity */}
              {step === 2 && selected && selectedIng && (
                <motion.section
                  key="s2"
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={stepTransition}
                  style={{ height: "auto", minHeight: "min-content" }}
                  className="block w-full min-h-0 min-w-0 space-y-3 pb-24"
                >
                  <div className={cn("flex flex-col gap-3 p-3 sm:p-4", panel)}>
                    <p className="text-center text-[11px] leading-relaxed text-zinc-500">
                      اضبط كمية العطر بخطوات {OIL_ML_STEP} مل. الحد الأعلى يطابق
                      سعة القارورة (
                      <span dir="ltr" className="font-semibold text-zinc-700">
                        {oilCapMl} مل
                      </span>
                      ).
                    </p>

                    <div className="flex flex-wrap items-stretch justify-center gap-3 sm:gap-4">
                      <div className="flex w-[100px] shrink-0 flex-col items-center gap-1 sm:w-[110px]">
                        <span className="text-[10px] font-bold text-zinc-500">
                          القارورة
                        </span>
                        <div className="relative aspect-square w-full overflow-hidden rounded-xl border-2 border-zinc-200/90 bg-zinc-50">
                          <BottleImage
                            src={bottle?.image_url ?? null}
                            alt={bottle?.name ?? "قارورة"}
                            className="rounded-lg"
                          />
                        </div>
                        {bottle ? (
                          <span
                            dir="ltr"
                            className="text-[10px] font-semibold tabular-nums text-zinc-600"
                          >
                            {bottle.capacity_ml} مل
                          </span>
                        ) : null}
                      </div>
                      <div className="flex w-[100px] shrink-0 flex-col items-center gap-1 sm:w-[110px]">
                        <span className="text-[10px] font-bold text-zinc-500">
                          العطر
                        </span>
                        <div className="relative aspect-square w-full overflow-hidden rounded-xl border-2 border-[#C5973E]/35 bg-zinc-50">
                          {selectedIng.image_url ? (
                            <Image
                              src={selectedIng.image_url}
                              alt={selectedIng.name}
                              fill
                              className="object-cover"
                              sizes="110px"
                              unoptimized
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-2xl text-zinc-300">
                              ✧
                            </div>
                          )}
                        </div>
                        <span className="line-clamp-2 text-center text-[10px] font-semibold text-zinc-800">
                          {selectedIng.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-1 py-0.5">
                      <OilSyringeVisual
                        compact
                        valueMl={selected.grams}
                        minMl={OIL_ML_MIN}
                        maxMl={oilCapMl}
                      />
                    </div>

                    <div className="rounded-xl bg-zinc-100/80 px-3 py-2.5">
                      <div className="mb-3 text-center">
                        <p className="text-[10px] font-bold text-zinc-500">
                          الكمية الحالية
                        </p>
                        <p
                          className="mt-0.5 text-[1.75rem] font-black leading-none tabular-nums tracking-tight text-zinc-900 sm:text-3xl"
                          dir="ltr"
                        >
                          {selected.grams.toFixed(0)}
                          <span className="ms-1.5 text-base font-bold text-zinc-500 sm:text-lg">
                            مل
                          </span>
                        </p>
                      </div>
                      {bottle ? (
                        <div className="mb-3 space-y-2">
                          <p className="text-center text-[10px] font-bold text-zinc-600">
                            اختيار سريع — نسبة من سعة القارورة (
                            <span dir="ltr" className="tabular-nums">
                              {bottle.capacity_ml}
                            </span>{" "}
                            مل)
                          </p>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setGrams(oilPresets.edt)}
                              className={cn(
                                "h-auto min-h-[4.25rem] flex-col gap-0.5 rounded-xl border-2 px-2 py-2 text-center shadow-none transition",
                                selected.grams === oilPresets.edt
                                  ? "border-[#C5973E] bg-[#fdf8ee] ring-1 ring-[#C5973E]/20"
                                  : "border-zinc-200/90 bg-white hover:bg-zinc-50",
                              )}
                            >
                              <span className="text-[11px] font-bold text-zinc-900">
                                عادي
                              </span>
                              <span className="text-[9px] leading-tight text-zinc-500">
                                Eau de toilette ·{" "}
                                <span dir="ltr">{OIL_PRESET_PERCENT_EDT}%</span>
                              </span>
                              <span
                                dir="ltr"
                                className="text-sm font-black tabular-nums text-[#8F6B28]"
                              >
                                {oilPresets.edt} مل
                              </span>
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setGrams(oilPresets.edp)}
                              className={cn(
                                "h-auto min-h-[4.25rem] flex-col gap-0.5 rounded-xl border-2 px-2 py-2 text-center shadow-none transition",
                                selected.grams === oilPresets.edp
                                  ? "border-[#C5973E] bg-[#fdf8ee] ring-1 ring-[#C5973E]/20"
                                  : "border-zinc-200/90 bg-white hover:bg-zinc-50",
                              )}
                            >
                              <span className="text-[11px] font-bold text-zinc-900">
                                مميّز
                              </span>
                              <span className="text-[9px] leading-tight text-zinc-500">
                                Eau de parfum ·{" "}
                                <span dir="ltr">{OIL_PRESET_PERCENT_EDP}%</span>
                              </span>
                              <span
                                dir="ltr"
                                className="text-sm font-black tabular-nums text-[#8F6B28]"
                              >
                                {oilPresets.edp} مل
                              </span>
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setGrams(oilPresets.extrait)}
                              className={cn(
                                "h-auto min-h-[4.25rem] flex-col gap-0.5 rounded-xl border-2 px-2 py-2 text-center shadow-none transition",
                                selected.grams === oilPresets.extrait
                                  ? "border-[#C5973E] bg-[#fdf8ee] ring-1 ring-[#C5973E]/20"
                                  : "border-zinc-200/90 bg-white hover:bg-zinc-50",
                              )}
                            >
                              <span className="text-[11px] font-bold text-zinc-900">
                                مميّز جداً
                              </span>
                              <span className="text-[9px] leading-tight text-zinc-500">
                                Extrait de parfum ·{" "}
                                <span dir="ltr">
                                  {OIL_PRESET_PERCENT_EXTRAIT}%
                                </span>
                              </span>
                              <span
                                dir="ltr"
                                className="text-sm font-black tabular-nums text-[#8F6B28]"
                              >
                                {oilPresets.extrait} مل
                              </span>
                            </Button>
                          </div>
                          <p className="text-center text-[9px] leading-snug text-zinc-400">
                            يمكنك أيضاً ضبط الكمية يدوياً بالشريط أدناه (خطوات{" "}
                            {OIL_ML_STEP} مل).
                          </p>
                        </div>
                      ) : null}
                      <div className="mb-1.5 flex justify-between text-[10px] font-medium text-zinc-500">
                        <span dir="ltr">{OIL_ML_MIN} مل</span>
                        <span dir="ltr">{oilCapMl} مل</span>
                      </div>
                      <div dir="ltr" className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          aria-label={`نقص ${OIL_ML_STEP} مل`}
                          className="size-9 shrink-0 rounded-lg border-zinc-200 bg-white"
                          onClick={() =>
                            setGrams(
                              Math.max(
                                OIL_GRAMS_MIN,
                                selected.grams - OIL_ML_STEP,
                              ),
                            )
                          }
                        >
                          <Minus className="size-4" strokeWidth={2.5} />
                        </Button>
                        <Slider
                          value={[selected.grams]}
                          min={OIL_GRAMS_MIN}
                          max={oilCapMl}
                          step={OIL_ML_STEP}
                          size="touch"
                          onValueChange={(v) =>
                            setGrams(v[0] ?? selected.grams)
                          }
                          className="min-w-0 flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          aria-label={`زِد ${OIL_ML_STEP} مل`}
                          className="size-9 shrink-0 rounded-lg border-zinc-200 bg-white"
                          onClick={() =>
                            setGrams(
                              Math.min(
                                oilCapMl,
                                selected.grams + OIL_ML_STEP,
                              ),
                            )
                          }
                        >
                          <Plus className="size-4" strokeWidth={2.5} />
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-xl border border-zinc-100 bg-gradient-to-b from-white to-zinc-50/90 px-3 py-2.5 text-start shadow-sm">
                      <dl className="space-y-1.5 text-[11px] sm:space-y-2">
                        <div className="flex justify-between gap-2 border-b border-zinc-100 pb-1.5">
                          <dt className="text-zinc-500">كمية العطر</dt>
                          <dd
                            dir="ltr"
                            className="font-bold tabular-nums text-zinc-900"
                          >
                            {selected.grams.toFixed(0)} مل
                          </dd>
                        </div>
                        <div className="flex justify-between gap-2 border-b border-zinc-100 pb-1.5">
                          <dt className="text-zinc-500">
                            المتبقي في القارورة
                          </dt>
                          <dd
                            dir="ltr"
                            className="font-bold tabular-nums text-sky-800"
                          >
                            {Math.max(0, totals.remainingMl).toFixed(1)} مل
                          </dd>
                        </div>
                        <div className="flex justify-between gap-2 border-b border-zinc-100 pb-1.5">
                          <dt className="text-zinc-500">تكلفة الكحول</dt>
                          <dd
                            dir="ltr"
                            className="font-bold tabular-nums text-sky-800"
                          >
                            {totals.alcoholPrice.toFixed(2)} د.ت
                          </dd>
                        </div>
                        <div className="flex justify-between gap-2">
                          <dt className="text-zinc-500">تكلفة العطر</dt>
                          <dd
                            dir="ltr"
                            className="font-bold tabular-nums text-[#8F6B28]"
                          >
                            {(
                              selectedIng.price_per_gram * selected.grams
                            ).toFixed(2)}{" "}
                            د.ت
                          </dd>
                        </div>
                      </dl>
                      <p className="mt-2 border-t border-dashed border-zinc-200 pt-2 text-center text-[10px] leading-relaxed text-zinc-400">
                        <span className="text-zinc-500">سعر المل (العطر)</span>{" "}
                        <span dir="ltr" className="font-semibold text-zinc-700">
                          {selectedIng.price_per_gram.toFixed(2)} د.ت
                        </span>
                        <span className="mx-2 text-zinc-300" aria-hidden>
                          ·
                        </span>
                        <span className="text-zinc-500">كحول</span>{" "}
                        <span dir="ltr" className="font-semibold text-zinc-700">
                          {ALCOHOL_PRICE_PER_LITER_DT} د.ت
                        </span>
                        <span className="text-zinc-500"> / لتر</span>
                      </p>
                    </div>

                    {totals.overCapacity && (
                      <p className="flex items-center justify-center gap-1 rounded-lg bg-red-50 px-2 py-2 text-center text-[11px] text-red-700">
                        <AlertTriangle className="size-3.5 shrink-0" />
                        تجاوزت سعة القارورة — قلّل الكمية أو غيّر القارورة.
                      </p>
                    )}
                  </div>
                </motion.section>
              )}

              {/* Step 3 — Phone & Confirm */}
              {step === 3 && (
                <motion.section
                  key="s3"
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={stepTransition}
                  style={{ height: "auto", minHeight: "min-content" }}
                  className="block w-full min-h-0 min-w-0 space-y-3 pb-24"
                >
                  <div
                    className={cn("mx-auto w-full max-w-sm space-y-3 p-4", panel)}
                  >
                    <div className="rounded-xl border border-zinc-200/90 bg-gradient-to-b from-zinc-50 to-white px-3 py-3 text-center">
                      <p className="text-xl font-black text-zinc-900 sm:text-2xl">
                        أرسل طلبك
                      </p>
                      <p className="mt-1 text-[11px] leading-snug text-zinc-500">
                        راجع الملخص ثم أدخل عنوان التوصيل ورقم الهاتف لنتواصل معك. سعر
                        التوصيل الثابت{" "}
                        <span dir="ltr" className="font-semibold text-zinc-700">
                          {totals.deliveryPrice.toFixed(0)} د.ت
                        </span>{" "}
                        يُضاف تلقائياً للمجموع.
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900">
                        ملخص الطلب
                      </p>
                      <div className="mt-2 space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-zinc-500">المكوّن</span>
                          <span className="truncate text-end font-medium text-zinc-900">
                            {selectedIng?.name}
                          </span>
                        </div>
                        <div className="flex justify-between text-zinc-600">
                          <span>العطر (مل)</span>
                          <span dir="ltr" className="tabular-nums">
                            {selected?.grams.toFixed(0)} مل
                          </span>
                        </div>
                        {bottle && (
                          <>
                            <div className="flex justify-between text-zinc-600">
                              <span>الكحول المعطّر (مل)</span>
                              <span dir="ltr" className="tabular-nums">
                                {Math.max(0, totals.remainingMl).toFixed(1)} مل
                              </span>
                            </div>
                            <div className="flex justify-between text-zinc-600">
                              <span>تكلفة الكحول</span>
                              <span dir="ltr" className="tabular-nums">
                                {totals.alcoholPrice.toFixed(2)} د.ت
                              </span>
                            </div>
                            <div className="flex justify-between text-zinc-600">
                              <span>تكلفة العطر</span>
                              <span dir="ltr" className="tabular-nums">
                                {totals.ingredientsTotal.toFixed(2)} د.ت
                              </span>
                            </div>
                            <p className="text-[10px] leading-snug text-zinc-400">
                              سعر الكحول:{" "}
                              <span dir="ltr" className="font-medium text-zinc-500">
                                {ALCOHOL_PRICE_PER_LITER_DT} د.ت
                              </span>{" "}
                              للّتر
                            </p>
                          </>
                        )}
                        <div className="flex justify-between border-t border-zinc-200 pt-1.5 text-zinc-600">
                          <span>المجموع (بدون توصيل)</span>
                          <span dir="ltr" className="tabular-nums">
                            {totals.subtotal.toFixed(2)} د.ت
                          </span>
                        </div>
                        <div className="flex justify-between text-zinc-600">
                          <span>التوصيل</span>
                          <span dir="ltr" className="tabular-nums">
                            {totals.deliveryPrice.toFixed(2)} د.ت
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-dashed border-zinc-200 pt-1.5 font-semibold text-zinc-900">
                          <span>الإجمالي</span>
                          <span
                            dir="ltr"
                            className="tabular-nums text-[#8F6B28]"
                          >
                            {totals.totalPrice.toFixed(2)} د.ت
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-zinc-100" />

                    <div className="space-y-2">
                      <div className="text-center">
                        <Label
                          htmlFor="addr"
                          className="text-sm font-bold text-zinc-900"
                        >
                          عنوان التوصيل
                        </Label>
                        <p className="mt-0.5 text-[11px] text-zinc-500">
                          نحتاج عنواناً تقريبياً للتوصيل
                        </p>
                      </div>
                      <textarea
                        id="addr"
                        dir="rtl"
                        rows={3}
                        className="flex w-full resize-none rounded-xl border-2 border-zinc-200/90 bg-white px-3 py-2 text-sm text-zinc-900 shadow-inner placeholder:text-zinc-400 focus-visible:outline-none focus-visible:border-[#C5973E] focus-visible:ring-2 focus-visible:ring-[#C5973E]/25"
                        placeholder="المدينة، الحي، أقرب نقطة دالة…"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="text-center">
                        <Label
                          htmlFor="phone"
                          className="text-sm font-bold text-zinc-900"
                        >
                          رقم الهاتف
                        </Label>
                        <p className="mt-0.5 text-[11px] text-zinc-500">
                          سنتواصل معك لتأكيد الطلب
                        </p>
                      </div>
                      <Input
                        id="phone"
                        inputMode="numeric"
                        autoComplete="tel"
                        dir="ltr"
                        className="h-11 rounded-xl border-2 border-[#D4A84B]/30 bg-white text-center text-lg font-semibold tabular-nums shadow-inner focus-visible:border-[#C5973E] focus-visible:ring-[#C5973E]/30"
                        placeholder="مثال: 58415506"
                        value={phone}
                        onChange={(e) =>
                          setPhone(digitsOnly(e.target.value))
                        }
                      />
                      {submitError && (
                        <p
                          className="rounded-lg bg-red-50 px-2 py-1.5 text-center text-xs text-red-800"
                          role="alert"
                        >
                          {submitError}
                        </p>
                      )}
                      <Button
                        type="button"
                        className="h-11 w-full rounded-xl bg-gradient-to-b from-[#D4A84B] to-[#A67C2E] text-sm font-bold text-white shadow-md hover:from-[#C9A045] hover:to-[#8F6B28] disabled:opacity-40"
                        disabled={
                          submitting ||
                          phoneDigits.length < 8 ||
                          !bottle ||
                          !selected ||
                          totals.overCapacity
                        }
                        onClick={onSubmit}
                      >
                        {submitting ? "جاري الإرسال…" : "إرسال الطلب"}
                      </Button>
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* ── Footer ── */}
        <footer className="shrink-0 border-t border-zinc-200/80 bg-white/90 px-3 py-2 pb-[max(8px,env(safe-area-inset-bottom))] backdrop-blur-md sm:px-4">
          <div className="mx-auto flex max-w-4xl gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={step === 0}
              onClick={goBack}
              className={cn(
                "h-10 flex-1 rounded-xl border-zinc-200 bg-white text-sm font-semibold text-zinc-800 hover:bg-zinc-50",
                step === 0 && "pointer-events-none opacity-40",
              )}
            >
              <span className="flex items-center justify-center gap-1.5">
                <ArrowRight className="size-4" />
                السابق
              </span>
            </Button>
            {step < 3 && (
              <Button
                type="button"
                disabled={!canNext[step]}
                onClick={goNext}
                className="h-10 flex-1 rounded-xl bg-gradient-to-b from-[#D4A84B] to-[#A67C2E] text-sm font-semibold text-white hover:from-[#C9A045] hover:to-[#8F6B28] disabled:opacity-40"
              >
                <span className="flex items-center justify-center gap-1.5">
                  التالي
                  <ArrowLeft className="size-4" />
                </span>
              </Button>
            )}
          </div>
        </footer>
      </div>

      {/* ── عنوان التوصيل قصير ── */}
      <Dialog open={addressShortOpen} onOpenChange={setAddressShortOpen}>
        <DialogContent className="max-w-sm rounded-2xl border-zinc-200 sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-start text-lg text-zinc-900">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                <AlertTriangle className="size-5" strokeWidth={2} />
              </span>
              عنوان التوصيل غير كافٍ
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm leading-relaxed text-zinc-600">
            يرجى كتابة عنوان أوضح للتوصيل (المدينة، الحي، أو أقرب نقطة دالة). الحد
            الأدنى{" "}
            <span dir="ltr" className="font-semibold text-zinc-800">
              5
            </span>{" "}
            أحرف — والأفضل تفاصيل أكثر حتى يصل الطلب بسهولة.
          </p>
          <Button
            type="button"
            className="h-11 w-full rounded-xl bg-zinc-900 text-sm font-semibold text-white hover:bg-zinc-800"
            onClick={() => setAddressShortOpen(false)}
          >
            حسناً، سأعدّل العنوان
          </Button>
        </DialogContent>
      </Dialog>

      {/* ── Success Dialog ── */}
      <Dialog open={successOpen} onOpenChange={() => {}}>
        <DialogContent
          className="max-w-sm overflow-hidden rounded-2xl border-0 p-0 shadow-2xl"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <div className="flex flex-col items-center bg-gradient-to-br from-[#D4A84B] to-[#8F6B28] px-6 pb-5 pt-8 text-white">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="mb-4 flex size-16 items-center justify-center rounded-full bg-white/20 ring-4 ring-white/10"
            >
              <Check className="size-8" strokeWidth={2.5} />
            </motion.div>
            <DialogHeader className="items-center">
              <DialogTitle className="text-center text-xl font-bold text-white">
                تم بنجاح!
              </DialogTitle>
            </DialogHeader>
            <p className="mt-1.5 text-center text-sm text-white/85">
              استلمنا طلبك وسنتواصل معك قريباً
            </p>
          </div>

          <div className="space-y-3 px-6 py-5">
            <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 text-center">
              <p className="mb-1 text-[11px] font-medium text-zinc-500">
                رقم الهاتف المسجّل
              </p>
              <p
                className="text-xl font-bold tabular-nums tracking-wider text-zinc-900"
                dir="ltr"
              >
                {confirmedPhone}
              </p>
            </div>

            <a
              href="tel:+21658415506"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-[#D4A84B]/30 bg-[#D4A84B]/10 text-sm font-semibold text-[#8F6B28] transition hover:bg-[#D4A84B]/20"
            >
              <span>اتصل بنا</span>
              <span dir="ltr" className="tabular-nums">+216 58 415 506</span>
            </a>

            <Button
              type="button"
              className="h-11 w-full rounded-xl bg-zinc-900 text-sm font-semibold text-white hover:bg-zinc-800"
              onClick={() => setSuccessOpen(false)}
            >
              إغلاق
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
