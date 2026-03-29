import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchStoreProductById } from "@/lib/store-data";
import {
  slugForCategory,
  categoryInfo,
} from "@/lib/store-categories";
import { StoreOrderForm } from "@/components/store/store-order-form";
import { ProductGallery } from "@/components/store/product-gallery";

type Props = { params: Promise<{ id: string }> };

const uuidRe =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  if (!uuidRe.test(id)) return { title: "منتج" };
  const p = await fetchStoreProductById(id);
  if (!p) return { title: "منتج" };
  return { title: `${p.name} — ORIX` };
}

export default async function StoreProductPage({ params }: Props) {
  const { id } = await params;
  if (!uuidRe.test(id)) notFound();

  const product = await fetchStoreProductById(id);
  if (!product) notFound();

  const images =
    product.image_urls?.filter((u) => /^https?:\/\//i.test(u)) ?? [];
  const backSlug = slugForCategory(product.category);
  const cat = categoryInfo(backSlug);

  return (
    <main className="min-h-[100dvh] bg-[#faf8f5] pb-12 sm:pb-16">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_65%_40%_at_20%_10%,rgba(212,168,75,0.09),transparent),radial-gradient(ellipse_50%_35%_at_90%_80%,rgba(143,107,40,0.05),transparent)]"
        aria-hidden
      />

      <header className="sticky top-0 z-20 border-b border-stone-200/80 bg-[#faf8f5]/88 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
          <Link
            href={`/store/${backSlug}`}
            prefetch
            className="shrink-0 text-xs font-semibold text-[#8F6B28] transition hover:text-[#A67C2E] sm:text-sm"
          >
            ← رجوع
          </Link>
          <span className="min-w-0 truncate px-1 text-center text-[0.7rem] font-medium text-stone-500 sm:text-xs">
            {product.name}
          </span>
          <Link
            href="/store"
            prefetch
            className="shrink-0 text-xs font-medium text-stone-600 transition hover:text-stone-900 sm:text-sm"
          >
            الفئات
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-10">
        {/* مسار قصير */}
        <nav
          className="mb-6 flex flex-wrap items-center gap-1.5 text-[0.7rem] text-stone-500 sm:text-xs"
          aria-label="مسار التنقل"
        >
          <Link href="/store" prefetch className="font-medium hover:text-[#8F6B28]">
            المتجر
          </Link>
          <span className="text-stone-300" aria-hidden>
            /
          </span>
          <Link
            href={`/store/${backSlug}`}
            prefetch
            className="font-medium hover:text-[#8F6B28]"
          >
            {cat?.title ?? "الفئة"}
          </Link>
          <span className="text-stone-300" aria-hidden>
            /
          </span>
          <span className="max-w-[12rem] truncate font-semibold text-stone-700 sm:max-w-md">
            {product.name}
          </span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12 xl:gap-16">
          {/* معرض الصور */}
          <div className="mx-auto w-full lg:mx-0 lg:sticky lg:top-20">
            <ProductGallery images={images} productName={product.name} />
          </div>

          {/* التفاصيل والطلب */}
          <div className="flex min-w-0 flex-col">
            <h1 className="text-2xl font-bold leading-snug text-stone-900 sm:text-3xl lg:text-[1.85rem] lg:leading-tight xl:text-4xl">
              {product.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-baseline gap-3 border-b border-stone-200/90 pb-5">
              <p
                className="text-3xl font-bold tabular-nums tracking-tight text-[#7a5a22] sm:text-4xl"
                dir="ltr"
              >
                {product.price.toFixed(2)}
                <span className="me-2 text-lg font-semibold text-stone-400 sm:text-xl">
                  د.ت
                </span>
              </p>
            </div>

            {product.description && (
              <div className="mt-5 rounded-2xl border border-stone-200/70 bg-white/70 p-4 shadow-[0_2px_18px_-12px_rgba(28,25,23,0.12)] sm:p-5">
                <h2 className="text-sm font-bold text-[#8F6B28]">الوصف</h2>
                <p
                  className="mt-2 whitespace-pre-wrap text-sm leading-[1.75] text-stone-600 sm:text-[0.9375rem]"
                  dir="auto"
                >
                  {product.description}
                </p>
              </div>
            )}

            <div className="mt-8">
              <StoreOrderForm product={product} />
            </div>

            <a
              href="tel:+21658415506"
              className="mt-5 flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-stone-200/90 bg-white text-sm font-semibold text-stone-800 shadow-[0_2px_12px_-8px_rgba(28,25,23,0.12)] transition hover:border-[#D4A84B]/40 hover:bg-[#faf8f5] sm:mt-6"
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-[#D4A84B]/15 text-[#7a5a22]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="size-4"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                  />
                </svg>
              </span>
              <span>اتصل بنا</span>
              <span dir="ltr" className="font-bold tabular-nums text-stone-700">
                +216 58 415 506
              </span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
