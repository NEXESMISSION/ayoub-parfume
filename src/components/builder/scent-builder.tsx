"use client";

import {
  useEffect,
  useMemo,
  useState,
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
  Info,
  Minus,
  Plus,
  Search,
} from "lucide-react";
import {
  OIL_GRAMS_MAX,
  OIL_GRAMS_MIN,
  usePerfumeStore,
} from "@/store/perfume-store";
import { buildIngredientMap, computeTotals } from "@/lib/pricing";
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
  "اختر المكوّن",
  "الكمية والحجم",
  "الهاتف والتأكيد",
];

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
          alt={b.name ?? ""}
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
        <p className="line-clamp-1 text-xs font-semibold text-zinc-900">
          {b.name}
        </p>
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
  const [confirmedPhone, setConfirmedPhone] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [ingSearch, setIngSearch] = useState("");
  const [ingAudience, setIngAudience] = useState<IngredientCategory | "all">(
    "all",
  );

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
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
    if (
      !bottle ||
      phoneDigits.length < 8 ||
      address.trim().length < 5 ||
      !recipe.length ||
      totals.overCapacity
    )
      return;
    setSubmitting(true);
    try {
      const res = await createOrder({
        customerName: phoneDigits,
        whatsappNumber: phoneDigits,
        bottleId: bottle.id,
        recipe,
        stickerText: "",
        totalPrice: totals.totalPrice,
        deliveryAddress: address.trim(),
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
              <div className="flex min-w-0 items-center gap-2">
                <Link
                  href="/"
                  className="flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
                  aria-label="الرئيسية"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-4"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </Link>
                <h1 className="min-w-0 truncate text-sm font-bold text-zinc-900">
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

        {/* ── Main ── */}
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 py-2 sm:px-4">
          <div className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col overflow-hidden">
            <AnimatePresence mode="wait">
              {/* Step 0 — Bottles (scrollable grid) */}
              {step === 0 && (
                <motion.section
                  key="s0"
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={stepTransition}
                  className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-1"
                >
                  {bottles.length === 0 ? (
                    <p className="py-8 text-center text-sm text-zinc-400">
                      لا توجد قوارير متاحة حالياً.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
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
                  className="flex min-h-0 flex-1 flex-col overflow-hidden"
                >
                  <div className="mb-2 flex shrink-0 flex-wrap justify-center gap-1.5 px-0.5">
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
                  <div className="relative mx-auto mb-2 w-full max-w-md shrink-0">
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

                  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-1">
                    {filteredIngredients.length === 0 ? (
                      <p className="py-6 text-center text-sm text-zinc-400">
                        لا نتائج
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
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
                  </div>
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
                  className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden"
                >
                  <div
                    className={cn("w-full max-w-sm space-y-3 p-4", panel)}
                  >
                    <div className="flex gap-2 rounded-xl border border-[#C5973E]/25 bg-gradient-to-br from-[#fdf8ee] to-[#f5ebe0]/90 px-3 py-2.5 shadow-sm shadow-amber-900/5">
                      <Info
                        className="size-4 shrink-0 text-[#8F6B28]"
                        strokeWidth={2}
                        aria-hidden
                      />
                      <div className="min-w-0 text-start">
                        <p className="text-[10px] font-bold text-[#5c4420]">
                          موصى به
                        </p>
                        <p className="mt-0.5 text-[10px] leading-relaxed text-[#6b5340]">
                          غالباً تكفي{" "}
                          <span dir="ltr" className="tabular-nums font-semibold">
                            5–15 غ
                          </span>{" "}
                          للعطور الشخصية حسب القارورة؛ لا تتجاوز سعة القارورة
                          بالمليلتر حتى لا يظهر التحذير أسفل الشريط.
                        </p>
                      </div>
                    </div>

                    <div className="border-b border-zinc-100 pb-2.5 text-center">
                      <p className="text-sm font-bold text-zinc-900">
                        {selectedIng.name}
                      </p>
                      <p className="mt-0.5 text-[11px] text-zinc-500">
                        كمية الزيت والتكلفة
                      </p>
                    </div>

                    <div className="flex flex-wrap items-baseline justify-center gap-x-3 rounded-xl bg-zinc-50 px-3 py-2.5">
                      <span
                        className="text-2xl font-bold tabular-nums text-zinc-900"
                        dir="ltr"
                      >
                        {selected.grams}
                        <span className="ms-0.5 text-sm font-semibold text-zinc-400">
                          غ
                        </span>
                      </span>
                      <span className="text-zinc-300">|</span>
                      <span
                        className="text-base font-bold tabular-nums text-[#8F6B28]"
                        dir="ltr"
                      >
                        {(
                          selectedIng.price_per_gram * selected.grams
                        ).toFixed(2)}{" "}
                        د.ت
                      </span>
                    </div>

                    <p className="text-center text-[11px] text-zinc-500">
                      سعر الغرام{" "}
                      <span
                        dir="ltr"
                        className="font-medium text-zinc-700"
                      >
                        {selectedIng.price_per_gram.toFixed(2)} د.ت
                      </span>
                    </p>

                    <div className="rounded-xl bg-zinc-100/80 px-3 py-2.5">
                      <div className="mb-1.5 flex justify-between text-[10px] font-medium text-zinc-500">
                        <span dir="ltr">
                          {OIL_GRAMS_MIN} غ
                        </span>
                        <span dir="ltr">
                          {OIL_GRAMS_MAX} غ
                        </span>
                      </div>
                      <div
                        dir="ltr"
                        className="flex items-center gap-2"
                      >
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          aria-label="نقص نصف غرام"
                          className="size-9 shrink-0 rounded-lg border-zinc-200 bg-white"
                          onClick={() =>
                            setGrams(
                              Math.max(
                                OIL_GRAMS_MIN,
                                selected.grams - 0.5,
                              ),
                            )
                          }
                        >
                          <Minus className="size-4" strokeWidth={2.5} />
                        </Button>
                        <Slider
                          value={[selected.grams]}
                          min={OIL_GRAMS_MIN}
                          max={OIL_GRAMS_MAX}
                          step={0.5}
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
                          aria-label="زِد نصف غرام"
                          className="size-9 shrink-0 rounded-lg border-zinc-200 bg-white"
                          onClick={() =>
                            setGrams(
                              Math.min(
                                OIL_GRAMS_MAX,
                                selected.grams + 0.5,
                              ),
                            )
                          }
                        >
                          <Plus className="size-4" strokeWidth={2.5} />
                        </Button>
                      </div>
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
                  className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden"
                >
                  <div
                    className={cn("w-full max-w-sm space-y-3 p-4", panel)}
                  >
                    <div>
                      <p className="text-xs font-bold text-zinc-900">
                        ملخص الطلب
                      </p>
                      <div className="mt-2 space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-zinc-500">القارورة</span>
                          <span className="truncate text-end font-medium text-zinc-900">
                            {bottle?.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">المكوّن</span>
                          <span className="truncate text-end font-medium text-zinc-900">
                            {selectedIng?.name}
                          </span>
                        </div>
                        <div className="flex justify-between text-zinc-600">
                          <span>الكمية</span>
                          <span dir="ltr" className="tabular-nums">
                            {selected?.grams.toFixed(1)} غ
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
                          !canNext[3] ||
                          phoneDigits.length < 8 ||
                          address.trim().length < 5
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
