"use client";

import { useState } from "react";
import { createStoreOrder } from "@/app/actions/orders";
import type { StoreProduct } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

function digitsOnly(s: string) {
  return s.replace(/\D/g, "");
}

type Props = {
  product: StoreProduct;
};

export function StoreOrderForm({ product }: Props) {
  const sizeOptions = (product.size_options ?? []).filter(
    (s) => s.volume_ml > 0,
  );
  const [selectedVolumeMl, setSelectedVolumeMl] = useState<number>(
    sizeOptions[0]?.volume_ml ?? 0,
  );
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);

  const phoneDigits = digitsOnly(phone);
  const canSubmit =
    phoneDigits.length >= 8 && address.trim().length >= 5 && !submitting;

  const selectedOption = sizeOptions.find(
    (s) => s.volume_ml === selectedVolumeMl,
  );

  async function onSubmit() {
    setError(null);
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const res = await createStoreOrder({
        storeProductId: product.id,
        whatsappNumber: phoneDigits,
        deliveryAddress: address.trim(),
        selectedVolumeMl: selectedVolumeMl || undefined,
        customerName: phoneDigits,
      });
      if (res.ok) {
        setPhone("");
        setAddress("");
        setSuccessOpen(true);
      } else {
        setError(res.error ?? "تعذّر إرسال الطلب");
      }
    } catch {
      setError("تعذّر الاتصال بالخادم.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="space-y-4">
        {/* Size selector */}
        {sizeOptions.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs font-bold text-stone-700">
              اختر الحجم
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {sizeOptions.map((opt) => (
                <button
                  key={opt.volume_ml}
                  type="button"
                  onClick={() => setSelectedVolumeMl(opt.volume_ml)}
                  className={cn(
                    "flex flex-col items-center gap-0.5 rounded-xl border-2 px-3 py-3 text-center transition",
                    selectedVolumeMl === opt.volume_ml
                      ? "border-[#C5973E] bg-[#fffbf0] shadow-sm"
                      : "border-stone-200 bg-white hover:border-stone-300",
                  )}
                >
                  <span
                    className={cn(
                      "text-sm font-bold",
                      selectedVolumeMl === opt.volume_ml
                        ? "text-[#8F6B28]"
                        : "text-stone-700",
                    )}
                    dir="ltr"
                  >
                    {opt.volume_ml} ml
                  </span>
                  <span
                    className={cn(
                      "text-xs",
                      selectedVolumeMl === opt.volume_ml
                        ? "text-[#A67C2E]"
                        : "text-stone-500",
                    )}
                  >
                    {opt.price.toFixed(2)} د.ت
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Summary line */}
        {selectedOption && (
          <div className="flex items-center justify-between rounded-xl bg-stone-100/80 px-4 py-2.5">
            <span className="text-xs text-stone-500">المجموع</span>
            <span className="text-base font-extrabold text-stone-900">
              {selectedOption.price.toFixed(2)}{" "}
              <span className="text-xs font-medium text-stone-400">د.ت</span>
            </span>
          </div>
        )}

        {/* Phone */}
        <div className="space-y-1.5">
          <Label htmlFor="store-phone" className="text-xs font-bold text-stone-700">
            رقم الهاتف
          </Label>
          <Input
            id="store-phone"
            inputMode="numeric"
            autoComplete="tel"
            dir="ltr"
            className="h-12 rounded-xl border-stone-200 bg-white text-center text-base font-semibold tabular-nums transition focus-visible:border-[#C5973E] focus-visible:ring-[#C5973E]/25"
            placeholder="مثال: 58415506"
            value={phone}
            onChange={(e) => setPhone(digitsOnly(e.target.value))}
          />
        </div>

        {/* Address */}
        <div className="space-y-1.5">
          <Label htmlFor="store-address" className="text-xs font-bold text-stone-700">
            عنوان التوصيل
          </Label>
          <textarea
            id="store-address"
            dir="rtl"
            rows={3}
            className="flex w-full resize-none rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5973E]/35"
            placeholder="المدينة، الحي، أقرب نقطة دالة…"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {error && (
          <p
            className="rounded-xl bg-red-50 px-3 py-2 text-center text-xs font-medium text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}

        <Button
          type="button"
          className="h-12 w-full rounded-xl bg-gradient-to-b from-[#e8c56e] via-[#C5973E] to-[#8F6B28] text-sm font-bold text-white shadow-[0_8px_24px_-8px_rgba(143,107,40,0.4)] transition hover:shadow-[0_12px_30px_-8px_rgba(143,107,40,0.5)] disabled:opacity-40"
          disabled={!canSubmit}
          onClick={onSubmit}
        >
          {submitting ? "جاري الإرسال…" : "إرسال الطلب"}
        </Button>

        <p className="text-center text-[11px] leading-relaxed text-stone-400">
          سنتواصل معك لتأكيد التفاصيل والتوصيل
        </p>
      </div>

      {/* Success dialog */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="max-w-sm gap-0 overflow-hidden rounded-3xl border-0 p-0 shadow-2xl">
          <div className="bg-gradient-to-br from-[#D4A84B] via-[#A67C2E] to-[#6b4f1e] px-6 pb-6 pt-8 text-center text-white">
            <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-white/20 ring-2 ring-white/25">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                className="size-7"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-bold text-white">
                تم استلام طلبك
              </DialogTitle>
            </DialogHeader>
            <p className="mt-2 text-sm text-white/85">
              سنتواصل معك قريباً لتأكيد الطلب.
            </p>
          </div>
          <div className="bg-[#faf8f5] px-6 py-5">
            <Button
              type="button"
              className="h-11 w-full rounded-xl bg-stone-900 text-sm font-semibold text-white hover:bg-stone-800"
              onClick={() => setSuccessOpen(false)}
            >
              حسناً
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
