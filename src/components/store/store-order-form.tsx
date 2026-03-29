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
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);

  const phoneDigits = digitsOnly(phone);
  const canSubmit =
    phoneDigits.length >= 8 && address.trim().length >= 5 && !submitting;

  async function onSubmit() {
    setError(null);
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const res = await createStoreOrder({
        storeProductId: product.id,
        whatsappNumber: phoneDigits,
        deliveryAddress: address.trim(),
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
      <div
        className={cn(
          "relative overflow-hidden rounded-[1.25rem]",
          "border border-stone-200/90 bg-white",
          "shadow-[0_12px_40px_-20px_rgba(143,107,40,0.18)]",
          "ring-1 ring-[#D4A84B]/10",
        )}
      >
        <div
          className="absolute start-0 top-0 h-1 w-full bg-gradient-to-l from-[#D4A84B] via-[#f5e0a8] to-[#8F6B28]"
          aria-hidden
        />
        <div className="p-5 sm:p-6">
          <h3 className="text-center text-base font-bold text-stone-900 sm:text-lg">
            طلب هذا المنتج
          </h3>
          <p className="mt-1 text-center text-xs leading-relaxed text-stone-500 sm:text-sm">
            أدخل رقمك وعنوان التوصيل — نتواصل معك لإتمام الطلب
          </p>

          <div className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="store-phone" className="text-xs font-bold text-stone-700">
                رقم الهاتف
              </Label>
              <Input
                id="store-phone"
                inputMode="numeric"
                autoComplete="tel"
                dir="ltr"
                className="h-12 rounded-xl border-stone-200/90 bg-stone-50/50 text-center text-base font-semibold tabular-nums transition focus-visible:border-[#C5973E] focus-visible:ring-[#C5973E]/25"
                placeholder="مثال: 58415506"
                value={phone}
                onChange={(e) => setPhone(digitsOnly(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="store-address"
                className="text-xs font-bold text-stone-700"
              >
                عنوان التوصيل
              </Label>
              <textarea
                id="store-address"
                dir="rtl"
                rows={3}
                className="flex w-full resize-none rounded-xl border border-stone-200/90 bg-stone-50/50 px-3 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5973E]/35"
                placeholder="المدينة، الحي، أقرب نقطة دالة…"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            {error && (
              <p
                className="rounded-xl bg-red-50 px-3 py-2 text-center text-xs text-red-800"
                role="alert"
              >
                {error}
              </p>
            )}
            <Button
              type="button"
              className="h-12 w-full rounded-xl bg-gradient-to-b from-[#e8c56e] via-[#C5973E] to-[#8F6B28] text-sm font-bold text-white shadow-[0_8px_24px_-8px_rgba(143,107,40,0.45)] transition hover:from-[#D4A84B] hover:via-[#A67C2E] hover:to-[#6b4f1e] disabled:opacity-45"
              disabled={!canSubmit}
              onClick={onSubmit}
            >
              {submitting ? "جاري الإرسال…" : "إرسال الطلب"}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="max-w-sm gap-4 rounded-2xl border-stone-200/90 bg-[#faf8f5] p-0">
          <div className="rounded-t-2xl bg-gradient-to-br from-[#D4A84B] via-[#A67C2E] to-[#6b4f1e] px-6 pb-5 pt-8 text-center text-white">
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
            <p className="mt-2 text-sm text-white/90">
              سنتواصل معك قريباً لتأكيد {product.name}.
            </p>
          </div>
          <div className="px-4 pb-6">
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
