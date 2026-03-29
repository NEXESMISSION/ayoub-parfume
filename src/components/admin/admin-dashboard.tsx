"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { cancelOrder, updateOrderStatus } from "@/app/actions/orders";
import {
  deactivateBottle,
  deactivateIngredient,
  deleteBottlePermanent,
  saveBottle,
  saveIngredient,
} from "@/app/actions/catalog";
import type {
  Bottle,
  Ingredient,
  IngredientCategory,
  OrderRow,
  OrderStatus,
} from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Tab = "orders" | "bottles" | "ingredients";

type OrderWithBottle = OrderRow & {
  bottles?: { name: string | null } | null;
};

const STATUS_AR: Record<OrderStatus, string> = {
  new: "جديد",
  mixing: "خلط",
  labeling: "تسمية",
  ready: "جاهز",
  completed: "مكتمل",
  cancelled: "ملغى",
};

const PIPELINE: OrderStatus[] = [
  "new",
  "mixing",
  "labeling",
  "ready",
  "completed",
];

const ALL_STATUSES: OrderStatus[] = [...PIPELINE, "cancelled"];

/** ترتيب عرض المجموعات في الواجهة */
const GROUP_ORDER: OrderStatus[] = [
  "new",
  "mixing",
  "labeling",
  "ready",
  "completed",
  "cancelled",
];

export function AdminDashboard({ hasSupabase }: { hasSupabase: boolean }) {
  const [tab, setTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<OrderWithBottle[]>([]);
  const [bottles, setBottles] = useState<Bottle[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);

  const [bottleForm, setBottleForm] = useState<Partial<Bottle> | null>(null);
  const [ingForm, setIngForm] = useState<Partial<Ingredient> | null>(null);
  const [savingBottle, setSavingBottle] = useState(false);
  const [savingIng, setSavingIng] = useState(false);
  const newBottleLock = useRef(false);

  const bottlesUnique = useMemo(() => {
    const m = new Map<string, Bottle>();
    for (const b of bottles) m.set(b.id, b);
    return [...m.values()];
  }, [bottles]);

  const ordersByStatus = useMemo(() => {
    const g: Record<OrderStatus, OrderWithBottle[]> = {
      new: [],
      mixing: [],
      labeling: [],
      ready: [],
      completed: [],
      cancelled: [],
    };
    for (const o of orders) {
      g[o.status].push(o);
    }
    return g;
  }, [orders]);

  const loadOrders = useCallback(async () => {
    if (!hasSupabase) return;
    const supabase = createClient();
    if (!supabase) return;
    const { data } = await supabase
      .from("orders")
      .select("*, bottles(name)")
      .order("created_at", { ascending: false });
    setOrders((data as OrderWithBottle[]) ?? []);
  }, [hasSupabase]);

  const loadBottles = useCallback(async () => {
    if (!hasSupabase) return;
    const supabase = createClient();
    if (!supabase) return;
    const { data } = await supabase
      .from("bottles")
      .select("*")
      .order("created_at", { ascending: false });
    setBottles((data as Bottle[]) ?? []);
  }, [hasSupabase]);

  const loadIngredients = useCallback(async () => {
    if (!hasSupabase) return;
    const supabase = createClient();
    if (!supabase) return;
    const { data } = await supabase
      .from("ingredients")
      .select("*")
      .order("created_at", { ascending: false });
    setIngredients((data as Ingredient[]) ?? []);
  }, [hasSupabase]);

  const refresh = useCallback(async () => {
    setLoading(true);
    await Promise.all([loadOrders(), loadBottles(), loadIngredients()]);
    setLoading(false);
  }, [loadOrders, loadBottles, loadIngredients]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function onStatusChange(orderId: string, status: OrderStatus) {
    const res = await updateOrderStatus(orderId, status);
    if (res.ok) void loadOrders();
  }

  async function onCancel(orderId: string) {
    if (!confirm("إلغاء هذا الطلب؟")) return;
    const res = await cancelOrder(orderId);
    if (res.ok) void loadOrders();
  }

  function openNewBottleForm() {
    if (newBottleLock.current) return;
    newBottleLock.current = true;
    setBottleForm({
      name: "",
      capacity_ml: 50,
      base_price: 0,
      image_url: "",
      is_active: true,
    });
    window.setTimeout(() => {
      newBottleLock.current = false;
    }, 600);
  }

  async function submitBottle() {
    if (!bottleForm || savingBottle) return;
    setSavingBottle(true);
    try {
      const res = await saveBottle({
        id: bottleForm.id,
        name: String(bottleForm.name ?? ""),
        capacity_ml: Number(bottleForm.capacity_ml ?? 30),
        base_price: Number(bottleForm.base_price ?? 0),
        image_url: String(bottleForm.image_url ?? ""),
        is_active: bottleForm.is_active !== false,
      });
      if (res.ok) {
        setBottleForm(null);
        void loadBottles();
      } else alert(res.error);
    } finally {
      setSavingBottle(false);
    }
  }

  async function submitIngredient() {
    if (!ingForm || savingIng) return;
    setSavingIng(true);
    try {
      const res = await saveIngredient({
        id: ingForm.id,
        name: String(ingForm.name ?? ""),
        slug: ingForm.slug ?? undefined,
        category: (ingForm.category ?? "heart") as IngredientCategory,
        price_per_gram: Number(ingForm.price_per_gram ?? 0),
        intensity_factor: Number(ingForm.intensity_factor ?? 1),
        image_url: String(ingForm.image_url ?? ""),
        is_active: ingForm.is_active !== false,
      });
      if (res.ok) {
        setIngForm(null);
        void loadIngredients();
      } else alert(res.error);
    } finally {
      setSavingIng(false);
    }
  }

  if (!hasSupabase) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-stone-600">
        <p>
          اضبط متغيرات Supabase في{" "}
          <code className="text-[#8F6B28]">.env.local</code> ثم أعد التحميل.
        </p>
        <Button className="mt-6" variant="secondary" asChild>
          <Link href="/">الرئيسية</Link>
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="px-4 py-20 text-center text-stone-500">جاري التحميل…</div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] sm:py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">ORIX — لوحة التحكم</h1>
          <p className="text-sm text-stone-500">
            الطلبات مجمّعة حسب الحالة · المنتجات (قارورة / مكوّنات)
          </p>
        </div>
        <Button variant="secondary" asChild>
          <Link href="/build">الصفحة العامة</Link>
        </Button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-stone-200 pb-4">
        {(
          [
            ["orders", "الطلبات"],
            ["bottles", "القوارير"],
            ["ingredients", "المكوّنات"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition",
              tab === id
                ? "bg-[#A67C2E] text-white shadow"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "orders" && (
        <div className="space-y-8">
          <p className="text-sm text-stone-500">
            اسحب الطلبات بين الأعمدة من خلال تغيير الحالة من القائمة داخل كل
            مجموعة.
          </p>
          {GROUP_ORDER.map((status) => {
            const list = ordersByStatus[status];
            if (list.length === 0) return null;
            return (
              <Card key={status}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <span
                      className={cn(
                        "inline-block size-2.5 rounded-full",
                        status === "new" && "bg-sky-500",
                        status === "mixing" && "bg-violet-500",
                        status === "labeling" && "bg-[#C5973E]",
                        status === "ready" && "bg-emerald-500",
                        status === "completed" && "bg-stone-400",
                        status === "cancelled" && "bg-red-400"
                      )}
                    />
                    {STATUS_AR[status]}
                    <span className="text-sm font-normal text-stone-400">
                      ({list.length})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <table className="w-full min-w-[700px] border-separate border-spacing-0 text-sm">
                    <thead>
                      <tr className="border-b-2 border-stone-200 text-right text-stone-500">
                        <th className="px-3 pb-3 pt-1 text-start font-medium">التاريخ</th>
                        <th className="px-3 pb-3 pt-1 text-start font-medium">الهاتف</th>
                        <th className="px-3 pb-3 pt-1 text-start font-medium">القارورة</th>
                        <th className="px-3 pb-3 pt-1 text-start font-medium">المجموع</th>
                        <th className="px-3 pb-3 pt-1 text-start font-medium">تغيير الحالة</th>
                        <th className="px-3 pb-3 pt-1 text-start font-medium">إجراء</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((o) => (
                        <tr
                          key={o.id}
                          className="border-b border-stone-100 transition-colors hover:bg-stone-50/60"
                        >
                          <td className="whitespace-nowrap px-3 py-3 text-stone-600" dir="ltr">
                            {new Date(o.created_at).toLocaleString("ar-TN")}
                          </td>
                          <td className="whitespace-nowrap px-3 py-3 font-medium text-stone-800" dir="ltr">
                            {o.whatsapp_number ?? o.customer_name ?? "—"}
                          </td>
                          <td className="whitespace-nowrap px-3 py-3 text-stone-700">
                            {o.bottles?.name ?? "—"}
                          </td>
                          <td className="whitespace-nowrap px-3 py-3 font-semibold tabular-nums text-stone-800" dir="ltr">
                            {(o.total_price ?? 0).toFixed(2)} د.ت
                          </td>
                          <td className="px-3 py-3">
                            <select
                              className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium transition hover:border-stone-300"
                              value={o.status}
                              disabled={o.status === "cancelled"}
                              onChange={(e) =>
                                onStatusChange(
                                  o.id,
                                  e.target.value as OrderStatus
                                )
                              }
                            >
                              {ALL_STATUSES.map((s) => (
                                <option key={s} value={s}>
                                  {STATUS_AR[s]}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-3 py-3">
                            {o.status !== "cancelled" && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => onCancel(o.id)}
                              >
                                إلغاء
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            );
          })}
          {orders.length === 0 && (
            <p className="py-8 text-center text-stone-500">لا توجد طلبات بعد.</p>
          )}
        </div>
      )}

      {tab === "bottles" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button type="button" onClick={openNewBottleForm}>
              + قارورة جديدة
            </Button>
          </div>
          <div className="grid gap-3">
            {bottlesUnique.map((b) => (
              <Card key={b.id}>
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-stone-900">{b.name}</p>
                    <p className="text-xs text-stone-500">
                      {b.capacity_ml} مل · {b.base_price.toFixed(2)} د.ت ·{" "}
                      {b.is_active ? "ظاهر" : "مخفي"}
                    </p>
                    <p className="mt-1 font-mono text-[10px] text-stone-400" dir="ltr">
                      {b.id}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setBottleForm({ ...b })}
                    >
                      تعديل
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        if (!confirm("إخفاء هذه القارورة من المتجر؟")) return;
                        const r = await deactivateBottle(b.id);
                        if (r.ok) void loadBottles();
                        else alert(r.error);
                      }}
                    >
                      إخفاء
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        if (
                          !confirm(
                            "حذف نهائي؟ ينجح فقط إن لم تُسجَّل أي طلبات بهذه القارورة."
                          )
                        )
                          return;
                        const r = await deleteBottlePermanent(b.id);
                        if (r.ok) void loadBottles();
                        else alert(r.error);
                      }}
                    >
                      حذف نهائي
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === "ingredients" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() => {
                if (ingForm) return;
                setIngForm({
                  name: "",
                  slug: "",
                  category: "heart",
                  price_per_gram: 0,
                  intensity_factor: 1,
                  image_url: "",
                  is_active: true,
                });
              }}
            >
              + مكوّن جديد
            </Button>
          </div>
          <div className="grid gap-3">
            {ingredients.map((ing) => (
              <Card key={ing.id}>
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-stone-900">{ing.name}</p>
                    <p className="text-xs text-stone-500">
                      {ing.category} · {ing.price_per_gram} د.ت/غ ·{" "}
                      {ing.is_active ? "ظاهر" : "مخفي"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setIngForm({ ...ing })}
                    >
                      تعديل
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        if (!confirm("إخفاء هذا المكوّن من المتجر؟")) return;
                        const r = await deactivateIngredient(ing.id);
                        if (r.ok) void loadIngredients();
                        else alert(r.error);
                      }}
                    >
                      إخفاء
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Dialog
        key={bottleForm?.id ?? (bottleForm && !bottleForm.id ? "new-bottle" : "closed-bottle")}
        open={!!bottleForm}
        onOpenChange={(o) => !o && setBottleForm(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {bottleForm?.id ? "تعديل قارورة" : "قارورة جديدة"}
            </DialogTitle>
          </DialogHeader>
          {bottleForm && (
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>الاسم</Label>
                <Input
                  value={bottleForm.name ?? ""}
                  onChange={(e) =>
                    setBottleForm({ ...bottleForm, name: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>السعة (مل)</Label>
                  <Input
                    type="number"
                    dir="ltr"
                    value={bottleForm.capacity_ml ?? ""}
                    onChange={(e) =>
                      setBottleForm({
                        ...bottleForm,
                        capacity_ml: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label>السعر الأساسي (د.ت)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    dir="ltr"
                    value={bottleForm.base_price ?? ""}
                    onChange={(e) =>
                      setBottleForm({
                        ...bottleForm,
                        base_price: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label>رابط الصورة (https)</Label>
                <Input
                  dir="ltr"
                  value={bottleForm.image_url ?? ""}
                  onChange={(e) =>
                    setBottleForm({ ...bottleForm, image_url: e.target.value })
                  }
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-stone-700">
                <input
                  type="checkbox"
                  checked={bottleForm.is_active !== false}
                  onChange={(e) =>
                    setBottleForm({
                      ...bottleForm,
                      is_active: e.target.checked,
                    })
                  }
                />
                ظاهر في المتجر
              </label>
              <Button
                type="button"
                className="w-full"
                disabled={savingBottle}
                onClick={submitBottle}
              >
                {savingBottle ? "جاري الحفظ…" : "حفظ"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        key={ingForm?.id ?? (ingForm && !ingForm.id ? "new-ing" : "closed-ing")}
        open={!!ingForm}
        onOpenChange={(o) => !o && setIngForm(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {ingForm?.id ? "تعديل مكوّن" : "مكوّن جديد"}
            </DialogTitle>
          </DialogHeader>
          {ingForm && (
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>الاسم</Label>
                <Input
                  value={ingForm.name ?? ""}
                  onChange={(e) =>
                    setIngForm({ ...ingForm, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>المعرّف (slug)</Label>
                <Input
                  dir="ltr"
                  value={ingForm.slug ?? ""}
                  onChange={(e) =>
                    setIngForm({ ...ingForm, slug: e.target.value })
                  }
                  placeholder="اختياري"
                />
              </div>
              <div className="space-y-1">
                <Label>الفئة</Label>
                <select
                  className="flex h-10 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm"
                  value={ingForm.category ?? "heart"}
                  onChange={(e) =>
                    setIngForm({
                      ...ingForm,
                      category: e.target.value as IngredientCategory,
                    })
                  }
                >
                  <option value="top">علوي</option>
                  <option value="heart">قلب</option>
                  <option value="base">قاعدة</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>السعر لكل غرام</Label>
                  <Input
                    type="number"
                    step="0.01"
                    dir="ltr"
                    value={ingForm.price_per_gram ?? ""}
                    onChange={(e) =>
                      setIngForm({
                        ...ingForm,
                        price_per_gram: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label>معامل الشدة</Label>
                  <Input
                    type="number"
                    step="0.1"
                    dir="ltr"
                    value={ingForm.intensity_factor ?? ""}
                    onChange={(e) =>
                      setIngForm({
                        ...ingForm,
                        intensity_factor: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label>رابط الصورة (https)</Label>
                <Input
                  dir="ltr"
                  value={ingForm.image_url ?? ""}
                  onChange={(e) =>
                    setIngForm({ ...ingForm, image_url: e.target.value })
                  }
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-stone-700">
                <input
                  type="checkbox"
                  checked={ingForm.is_active !== false}
                  onChange={(e) =>
                    setIngForm({ ...ingForm, is_active: e.target.checked })
                  }
                />
                ظاهر في المتجر
              </label>
              <Button
                type="button"
                className="w-full"
                disabled={savingIng}
                onClick={submitIngredient}
              >
                {savingIng ? "جاري الحفظ…" : "حفظ"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
