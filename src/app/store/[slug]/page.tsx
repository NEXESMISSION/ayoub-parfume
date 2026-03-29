import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  STORE_CATEGORY_SLUGS,
  categoryFromSlug,
  categoryInfo,
} from "@/lib/store-categories";
import { fetchStoreProducts } from "@/lib/store-data";
import type { StoreProduct } from "@/types";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return STORE_CATEGORY_SLUGS.map((slug) => ({ slug }));
}

function primaryImage(p: StoreProduct): string | null {
  const u = p.image_urls?.filter(Boolean) ?? [];
  return u[0] ?? null;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const info = categoryInfo(slug);
  if (!info) return { title: "المتجر" };
  return { title: `${info.title} — ORIX` };
}

export default async function StoreCategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = categoryFromSlug(slug);
  const info = categoryInfo(slug);
  if (!category || !info) notFound();

  const products = await fetchStoreProducts(category);

  return (
    <main className="min-h-[100dvh] bg-[#faf8f5]">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(212,168,75,0.08),transparent),radial-gradient(ellipse_50%_35%_at_100%_60%,rgba(143,107,40,0.04),transparent)]"
        aria-hidden
      />

      <header className="sticky top-0 z-20 border-b border-stone-200/80 bg-[#faf8f5]/85 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link
            href="/store"
            className="text-xs font-semibold text-[#8F6B28] transition hover:text-[#A67C2E] sm:text-sm"
          >
            ← الفئات
          </Link>
          <span className="min-w-0 truncate text-center text-xs font-bold text-stone-900 sm:text-sm">
            {info.title}
          </span>
          <Link
            href="/"
            className="text-xs font-medium text-stone-600 transition hover:text-stone-900 sm:text-sm"
          >
            الرئيسية
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-8">
        {/* عنوان الفئة */}
        <div className="mb-6 border-b border-stone-200/80 pb-6 sm:mb-8 sm:pb-8">
          <h1 className="text-2xl font-bold leading-tight text-stone-900 sm:text-3xl">
            {info.title}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-500 sm:text-base">
            {info.subtitle}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white/60 py-16 text-center">
            <p className="text-sm font-medium text-stone-600">
              لا توجد منتجات في هذه الفئة حالياً.
            </p>
            <Link
              href="/store"
              className="mt-4 text-sm font-semibold text-[#8F6B28] underline-offset-4 hover:underline"
            >
              العودة إلى الفئات
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {products.map((p) => {
              const img = primaryImage(p);
              return (
                <li key={p.id} className="min-w-0">
                  <Link
                    href={`/store/product/${p.id}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-[0_2px_16px_-6px_rgba(28,25,23,0.1)] ring-1 ring-stone-900/[0.02] transition duration-300 hover:-translate-y-1 hover:border-[#D4A84B]/45 hover:shadow-[0_16px_40px_-12px_rgba(143,107,40,0.22)]"
                  >
                    <div className="relative aspect-[1/1.08] w-full overflow-hidden bg-gradient-to-b from-stone-100 to-stone-50">
                      {img ? (
                        <Image
                          src={img}
                          alt=""
                          fill
                          className="object-cover transition duration-500 ease-out group-hover:scale-[1.06]"
                          sizes="(max-width: 640px) 46vw, (max-width: 1024px) 31vw, 320px"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center text-xs text-stone-400">
                          بدون صورة
                        </div>
                      )}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-900/25 via-transparent to-transparent opacity-40" />
                    </div>
                    <div className="flex flex-1 flex-col p-3 sm:p-4">
                      <h2 className="line-clamp-2 min-h-[2.5rem] text-[0.8125rem] font-bold leading-snug text-stone-900 sm:min-h-[2.75rem] sm:text-[0.9375rem]">
                        {p.name}
                      </h2>
                      {p.description && (
                        <p
                          className="mt-1.5 line-clamp-2 text-[0.65rem] leading-relaxed text-stone-500 sm:text-xs"
                          dir="auto"
                        >
                          {p.description}
                        </p>
                      )}
                      <div className="mt-auto flex items-end justify-between gap-2 border-t border-stone-100 pt-3">
                        <p
                          className="text-[0.8125rem] font-bold tabular-nums tracking-tight text-[#7a5a22] sm:text-base"
                          dir="ltr"
                        >
                          {p.price.toFixed(2)}
                          <span className="me-1 text-[0.65rem] font-semibold text-stone-400 sm:text-xs">
                            د.ت
                          </span>
                        </p>
                        <span className="shrink-0 rounded-full bg-[#D4A84B]/12 px-2 py-0.5 text-[0.6rem] font-bold text-[#8F6B28] transition group-hover:bg-[#D4A84B]/20 sm:text-[0.65rem]">
                          عرض
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
