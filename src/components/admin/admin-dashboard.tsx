"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import {
  cancelOrder,
  deleteOrderPermanent,
  updateOrderStatus,
} from "@/app/actions/orders";
import {
  deactivateBottle,
  deactivateIngredient,
  deleteBottlePermanent,
  deleteIngredientPermanent,
  saveBottle,
  saveIngredient,
} from "@/app/actions/catalog";
import {
  deactivateStoreProduct,
  deleteStoreProductPermanent,
  saveStoreProduct,
} from "@/app/actions/store-catalog";
import type {
  Bottle,
  Ingredient,
  IngredientCategory,
  OrderRow,
  OrderStatus,
  StoreCategory,
  StoreProduct,
  StoreProductSizeOption,
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
import { INGREDIENT_CATEGORY_LABELS } from "@/lib/ingredient-category";

type Tab = "orders" | "bottles" | "ingredients" | "store";

type OrderWithBottle = OrderRow & {
  bottles?: { name: string | null } | null;
  store_products?: { name: string | null } | null;
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

function sizeOptionsToRaw(options: StoreProductSizeOption[] | null | undefined) {
  return (options ?? []).map((s) => `${s.volume_ml}:${s.price}`).join("\n");
}

function parseSizeOptionsRaw(raw: string): StoreProductSizeOption[] {
  return raw
    .split(/\r?\n|,/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [mlRaw, priceRaw] = line.split(":").map((v) => v.trim());
      const volume_ml = Number(mlRaw ?? 0);
      const price = Number(priceRaw ?? 0);
      if (!Number.isFinite(volume_ml) || volume_ml <= 0) return null;
      if (!Number.isFinite(price) || price < 0) return null;
      return { volume_ml, price };
    })
    .filter((v): v is StoreProductSizeOption => v !== null);
}

export function AdminDashboard({ hasSupabase }: { hasSupabase: boolean }) {
  const [tab, setTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<OrderWithBottle[]>([]);
  const [bottles, setBottles] = useState<Bottle[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [storeProducts, setStoreProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const [bottleForm, setBottleForm] = useState<Partial<Bottle> | null>(null);
  const [ingForm, setIngForm] = useState<Partial<Ingredient> | null>(null);
  const [storeForm, setStoreForm] = useState<
    (Partial<StoreProduct> & {
      image_urls_raw?: string;
      size_options_raw?: string;
      size_options_list?: { volume_ml: number; price: number }[];
    }) | null
  >(null);
  const [savingBottle, setSavingBottle] = useState(false);
  const [savingIng, setSavingIng] = useState(false);
  const [savingStore, setSavingStore] = useState(false);
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
      .select("*, bottles(name), store_products(name)")
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

  const loadStoreProducts = useCallback(async () => {
    if (!hasSupabase) return;
    const supabase = createClient();
    if (!supabase) return;
    const { data } = await supabase
      .from("store_products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    setStoreProducts((data as StoreProduct[]) ?? []);
  }, [hasSupabase]);

  const refresh = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      loadOrders(),
      loadBottles(),
      loadIngredients(),
      loadStoreProducts(),
    ]);
    setLoading(false);
  }, [loadOrders, loadBottles, loadIngredients, loadStoreProducts]);

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

  async function onDeleteOrder(orderId: string) {
    if (
      !confirm(
        "حذف هذا الطلب نهائياً من قاعدة البيانات؟ لا يمكن التراجع.",
      )
    )
      return;
    const res = await deleteOrderPermanent(orderId);
    if (res.ok) void loadOrders();
    else alert(res.error);
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
        category: (ingForm.category ?? "women") as IngredientCategory,
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

  async function submitStoreProduct() {
    if (!storeForm || savingStore) return;
    setSavingStore(true);
    try {
      const sizeList = (storeForm.size_options_list ?? []).filter(
        (s) => s.volume_ml > 0,
      );
      const sizeRaw = sizeList
        .map((s) => `${s.volume_ml}:${s.price}`)
        .join("\n");
      const res = await saveStoreProduct({
        id: storeForm.id,
        name: String(storeForm.name ?? ""),
        description: String(storeForm.description ?? ""),
        price:
          sizeList.length > 0
            ? Number(sizeList[0]?.price ?? 0)
            : Number(storeForm.price ?? 0),
        category: (storeForm.category ?? "original_bottle") as StoreCategory,
        image_urls_raw: String(storeForm.image_urls_raw ?? ""),
        size_options_raw: sizeRaw,
        sort_order: Number(storeForm.sort_order ?? 0),
        is_active: storeForm.is_active !== false,
      });
      if (res.ok) {
        setStoreForm(null);
        void loadStoreProducts();
      } else alert(res.error);
    } finally {
      setSavingStore(false);
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
    <div className="mx-auto max-w-6xl px-3 py-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] sm:px-4 sm:py-10">
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" className="shrink-0 transition hover:opacity-70 active:scale-95">
            <Image
              src="/logo.png"
              alt="ORIX"
              width={96}
              height={48}
              className="h-8 w-auto sm:h-9"
              sizes="96px"
            />
          </Link>
          <div className="h-8 w-px bg-stone-200" aria-hidden />
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-stone-900 sm:text-xl">لوحة التحكم</h1>
            <p className="mt-0.5 text-[11px] text-stone-500 sm:text-xs">
              الطلبات مجمّعة حسب الحالة · المنتجات
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="w-fit" asChild>
            <Link href="/">الرئيسية</Link>
          </Button>
          <Button variant="secondary" size="sm" className="w-fit" asChild>
            <Link href="/build">البناء</Link>
          </Button>
        </div>
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto border-b border-stone-200 pb-3 sm:mb-6 sm:pb-4">
        {(
          [
            ["orders", "الطلبات"],
            ["bottles", "القوارير"],
            ["ingredients", "المكوّنات"],
            ["store", "المتجر"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition",
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
                <CardContent>
                  {/* Desktop table */}
                  <div className="hidden overflow-x-auto md:block">
                    <table className="w-full min-w-[820px] border-separate border-spacing-0 text-sm">
                      <thead>
                        <tr className="border-b-2 border-stone-200 text-right text-stone-500">
                          <th className="px-3 pb-3 pt-1 text-start font-medium">التاريخ</th>
                          <th className="px-3 pb-3 pt-1 text-start font-medium">الهاتف</th>
                          <th className="px-3 pb-3 pt-1 text-start font-medium">النوع / المنتج</th>
                          <th className="px-3 pb-3 pt-1 text-start font-medium">العنوان</th>
                          <th className="px-3 pb-3 pt-1 text-start font-medium">المجموع</th>
                          <th className="px-3 pb-3 pt-1 text-start font-medium">تغيير الحالة</th>
                          <th className="px-3 pb-3 pt-1 text-start font-medium">إجراءات</th>
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
                            <td className="max-w-[140px] px-3 py-3 text-stone-700">
                              <span className="block text-[10px] font-medium text-stone-400">
                                {(o.order_kind ?? "custom") === "store"
                                  ? "متجر"
                                  : "مخصّص"}
                              </span>
                              <span className="line-clamp-2">
                                {(o.order_kind ?? "custom") === "store"
                                  ? (o.store_products?.name ??
                                      o.store_product_name_snapshot ??
                                      o.sticker_text ??
                                      "—")
                                  : (o.bottles?.name ??
                                      o.bottle_name_snapshot ??
                                      "—")}
                              </span>
                            </td>
                            <td className="max-w-[160px] px-3 py-3 text-xs text-stone-600">
                              <span className="line-clamp-3">{o.delivery_address ?? "—"}</span>
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
                              <div className="flex flex-wrap items-center gap-1.5">
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
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="border-red-300 text-red-800 hover:bg-red-50"
                                  onClick={() => onDeleteOrder(o.id)}
                                >
                                  حذف نهائي
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile card list */}
                  <div className="space-y-3 md:hidden">
                    {list.map((o) => (
                      <div
                        key={o.id}
                        className="rounded-xl border border-stone-200 bg-white p-3.5 shadow-sm"
                      >
                        <div className="mb-2.5 flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-medium text-stone-800" dir="ltr">
                              {o.whatsapp_number ?? o.customer_name ?? "—"}
                            </p>
                            <p className="mt-0.5 text-xs text-stone-500" dir="ltr">
                              {new Date(o.created_at).toLocaleString("ar-TN")}
                            </p>
                          </div>
                          <p className="shrink-0 text-sm font-bold tabular-nums text-stone-900" dir="ltr">
                            {(o.total_price ?? 0).toFixed(2)} د.ت
                          </p>
                        </div>
                        <p className="mb-2 text-xs text-stone-600">
                          {(o.order_kind ?? "custom") === "store"
                            ? "منتج"
                            : "قارورة"}
                          :{" "}
                          <span className="font-medium">
                            {(o.order_kind ?? "custom") === "store"
                              ? (o.store_products?.name ??
                                  o.store_product_name_snapshot ??
                                  o.sticker_text ??
                                  "—")
                              : (o.bottles?.name ??
                                  o.bottle_name_snapshot ??
                                  "—")}
                          </span>
                        </p>
                        {o.delivery_address && (
                          <p className="mb-3 line-clamp-3 text-xs text-stone-500">
                            العنوان: {o.delivery_address}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-2">
                          <select
                            className="min-w-0 flex-1 rounded-lg border border-stone-200 bg-white px-2.5 py-2 text-xs font-medium"
                            value={o.status}
                            disabled={o.status === "cancelled"}
                            onChange={(e) =>
                              onStatusChange(o.id, e.target.value as OrderStatus)
                            }
                          >
                            {ALL_STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {STATUS_AR[s]}
                              </option>
                            ))}
                          </select>
                          {o.status !== "cancelled" && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="shrink-0"
                              onClick={() => onCancel(o.id)}
                            >
                              إلغاء
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="shrink-0 border-red-300 text-red-800 hover:bg-red-50"
                            onClick={() => onDeleteOrder(o.id)}
                          >
                            حذف نهائي
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
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
                  <div className="flex items-start gap-3">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
                      {b.image_url ? (
                        <Image
                          src={b.image_url}
                          alt="معاينة القارورة"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-lg text-stone-400">
                          🫙
                        </div>
                      )}
                    </div>
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
                            "حذف هذه القارورة نهائياً؟ الطلبات السابقة تبقى؛ يُزال فقط الربط بالكتالوج.",
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

      {tab === "store" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() => {
                if (storeForm) return;
                setStoreForm({
                  name: "",
                  description: "",
                  price: 0,
                  category: "original_bottle",
                  image_urls_raw: "",
                  size_options_list: [],
                  sort_order: 0,
                  is_active: true,
                });
              }}
            >
              + منتج متجر
            </Button>
          </div>
          <div className="grid gap-3">
            {storeProducts.map((p) => (
              <Card key={p.id}>
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-stone-900">{p.name}</p>
                    <p className="text-xs text-stone-500">
                      {p.category} ·
                      {p.size_options?.length
                        ? ` مقاسات ${p.size_options
                            .map((s) => `${s.volume_ml}مل`)
                            .join(" / ")} ·`
                        : ` ${Number(p.price).toFixed(2)} د.ت ·`}{" "}
                      {p.is_active ? "ظاهر" : "مخفي"} · ترتيب {p.sort_order}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        setStoreForm({
                          ...p,
                          price: Number(p.price),
                          image_urls_raw: (p.image_urls ?? []).join("\n"),
                          size_options_list: (p.size_options ?? []).map((s) => ({
                            volume_ml: s.volume_ml,
                            price: s.price,
                          })),
                          sort_order: p.sort_order ?? 0,
                        })
                      }
                    >
                      تعديل
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        if (!confirm("إخفاء هذا المنتج من المتجر؟")) return;
                        const r = await deactivateStoreProduct(p.id);
                        if (r.ok) void loadStoreProducts();
                        else alert(r.error);
                      }}
                    >
                      إخفاء
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-red-300 text-red-800 hover:bg-red-50"
                      onClick={async () => {
                        if (
                          !confirm(
                            "حذف هذا المنتج نهائياً من قاعدة البيانات؟ طلبات المتجر السابقة تبقى مع الاسم المحفوظ في الطلب.",
                          )
                        )
                          return;
                        const r = await deleteStoreProductPermanent(p.id);
                        if (r.ok) void loadStoreProducts();
                        else alert(r.error);
                      }}
                    >
                      حذف من القاعدة
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
                  category: "women",
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
                  <div className="flex items-start gap-3">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
                      {ing.image_url ? (
                        <Image
                          src={ing.image_url}
                          alt="معاينة المكوّن"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-lg text-stone-400">
                          ✧
                        </div>
                      )}
                    </div>
                    <div>
                    <p className="font-semibold text-stone-900">{ing.name}</p>
                    <p className="text-xs text-stone-500">
                      {INGREDIENT_CATEGORY_LABELS[ing.category]} ·{" "}
                      {ing.price_per_gram} د.ت/غ ·{" "}
                      {ing.is_active ? "ظاهر" : "مخفي"}
                    </p>
                    </div>
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
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-red-300 text-red-800 hover:bg-red-50"
                      onClick={async () => {
                        if (
                          !confirm(
                            "حذف هذا المكوّن نهائياً؟ الطلبات القديمة لا تُحذف؛ وصفة الزيت محفوظة داخل الطلب.",
                          )
                        )
                          return;
                        const r = await deleteIngredientPermanent(ing.id);
                        if (r.ok) void loadIngredients();
                        else alert(r.error);
                      }}
                    >
                      حذف من القاعدة
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
                    onFocus={(e) => e.target.select()}
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
                    onFocus={(e) => e.target.select()}
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
              <div className="space-y-1">
                <Label>معاينة الصورة</Label>
                <div className="relative h-32 w-full overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
                  {bottleForm.image_url ? (
                    <Image
                      src={bottleForm.image_url}
                      alt="معاينة القارورة"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-stone-400">
                      أدخل رابط صورة لعرض المعاينة
                    </div>
                  )}
                </div>
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
                <Label>الفئة</Label>
                <select
                  className="flex h-10 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm"
                  value={ingForm.category ?? "women"}
                  onChange={(e) =>
                    setIngForm({
                      ...ingForm,
                      category: e.target.value as IngredientCategory,
                    })
                  }
                >
                  <option value="women">نساء</option>
                  <option value="man">رجال</option>
                  <option value="kids">أطفال</option>
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
                    onFocus={(e) => e.target.select()}
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
                    onFocus={(e) => e.target.select()}
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
              <div className="space-y-1">
                <Label>معاينة الصورة</Label>
                <div className="relative h-32 w-full overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
                  {ingForm.image_url ? (
                    <Image
                      src={ingForm.image_url}
                      alt="معاينة المكوّن"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-stone-400">
                      أدخل رابط صورة لعرض المعاينة
                    </div>
                  )}
                </div>
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

      <Dialog
        key={
          storeForm?.id ??
          (storeForm && !storeForm.id ? "new-store" : "closed-store")
        }
        open={!!storeForm}
        onOpenChange={(o) => !o && setStoreForm(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {storeForm?.id ? "تعديل منتج المتجر" : "منتج متجر جديد"}
            </DialogTitle>
          </DialogHeader>
          {storeForm && (
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>الاسم</Label>
                <Input
                  value={storeForm.name ?? ""}
                  onChange={(e) =>
                    setStoreForm({ ...storeForm, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>الوصف</Label>
                <textarea
                  className="flex min-h-[72px] w-full resize-y rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5973E]/40"
                  dir="rtl"
                  value={storeForm.description ?? ""}
                  onChange={(e) =>
                    setStoreForm({ ...storeForm, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>
                    السعر الأساسي (د.ت)
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    dir="ltr"
                    value={storeForm.price ?? ""}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) =>
                      setStoreForm({
                        ...storeForm,
                        price: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label>ترتيب العرض</Label>
                  <Input
                    type="number"
                    dir="ltr"
                    value={storeForm.sort_order ?? 0}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) =>
                      setStoreForm({
                        ...storeForm,
                        sort_order: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              {(storeForm.category === "prefilled_bottle" ||
                storeForm.category === "air_freshener") && (
                <div className="space-y-2">
                  <Label>المقاسات والأسعار</Label>
                  <div className="space-y-2">
                    {(storeForm.size_options_list ?? []).map((opt, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 p-2"
                      >
                        <div className="flex flex-1 items-center gap-2">
                          <div className="flex-1 space-y-0.5">
                            <span className="text-[10px] font-medium text-stone-500">
                              الحجم (مل)
                            </span>
                            <Input
                              type="number"
                              dir="ltr"
                              className="h-9 text-sm"
                              placeholder="50"
                              value={opt.volume_ml || ""}
                              onFocus={(e) => e.target.select()}
                              onChange={(e) => {
                                const list = [
                                  ...(storeForm.size_options_list ?? []),
                                ];
                                list[idx] = {
                                  ...list[idx],
                                  volume_ml: e.target.value === "" ? ("" as unknown as number) : Number(e.target.value),
                                };
                                setStoreForm({
                                  ...storeForm,
                                  size_options_list: list,
                                });
                              }}
                            />
                          </div>
                          <div className="flex-1 space-y-0.5">
                            <span className="text-[10px] font-medium text-stone-500">
                              السعر (د.ت)
                            </span>
                            <Input
                              type="number"
                              step="0.01"
                              dir="ltr"
                              className="h-9 text-sm"
                              placeholder="25.00"
                              value={opt.price || ""}
                              onFocus={(e) => e.target.select()}
                              onChange={(e) => {
                                const list = [
                                  ...(storeForm.size_options_list ?? []),
                                ];
                                list[idx] = {
                                  ...list[idx],
                                  price: e.target.value === "" ? ("" as unknown as number) : Number(e.target.value),
                                };
                                setStoreForm({
                                  ...storeForm,
                                  size_options_list: list,
                                });
                              }}
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-3.5 size-9 shrink-0 border-red-200 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                          onClick={() => {
                            const list = [
                              ...(storeForm.size_options_list ?? []),
                            ];
                            list.splice(idx, 1);
                            setStoreForm({
                              ...storeForm,
                              size_options_list: list,
                            });
                          }}
                        >
                          ✕
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full border-dashed"
                    onClick={() =>
                      setStoreForm({
                        ...storeForm,
                        size_options_list: [
                          ...(storeForm.size_options_list ?? []),
                          { volume_ml: "" as unknown as number, price: "" as unknown as number },
                        ],
                      })
                    }
                  >
                    + إضافة مقاس
                  </Button>
                </div>
              )}
              <div className="space-y-1">
                <Label>الفئة</Label>
                <select
                  className="flex h-10 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm"
                  value={storeForm.category ?? "original_bottle"}
                  onChange={(e) =>
                    setStoreForm({
                      ...storeForm,
                      category: e.target.value as StoreCategory,
                    })
                  }
                >
                  <option value="original_bottle">عطور اصلية</option>
                  <option value="prefilled_bottle">عطور مركبة</option>
                  <option value="air_freshener">عطور الجو</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label>روابط الصور (سطر لكل رابط https)</Label>
                <textarea
                  dir="ltr"
                  className="flex min-h-[80px] w-full resize-y rounded-xl border border-stone-200 bg-white px-3 py-2 font-mono text-xs text-stone-800 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5973E]/40"
                  placeholder="https://…"
                  value={storeForm.image_urls_raw ?? ""}
                  onChange={(e) =>
                    setStoreForm({
                      ...storeForm,
                      image_urls_raw: e.target.value,
                    })
                  }
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-stone-700">
                <input
                  type="checkbox"
                  checked={storeForm.is_active !== false}
                  onChange={(e) =>
                    setStoreForm({
                      ...storeForm,
                      is_active: e.target.checked,
                    })
                  }
                />
                ظاهر في المتجر
              </label>
              <Button
                type="button"
                className="w-full"
                disabled={savingStore}
                onClick={submitStoreProduct}
              >
                {savingStore ? "جاري الحفظ…" : "حفظ"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
