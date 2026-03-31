import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchStoreProducts } from "@/lib/store-data";
import { categoryInfo, STORE_CATEGORIES } from "@/lib/store-categories";
import { PrefetchStoreProductIds } from "@/components/store/prefetch-store-navigation";

export const dynamic = "force-dynamic";

export default async function StoreCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const info = categoryInfo(slug);
  if (!info) return notFound();

  const products = await fetchStoreProducts(info.category);
  const otherCategories = STORE_CATEGORIES.filter((c) => c.slug !== slug);

  return (
    <div className="py-8 sm:py-10">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-stone-400">
        <Link href="/" className="transition hover:text-stone-600">الرئيسية</Link>
        <span>/</span>
        <span className="font-semibold text-stone-700">{info.title}</span>
      </nav>

      {/* Category header */}
      <div className="relative mb-8 overflow-hidden rounded-3xl sm:mb-10">
        <div className="relative flex min-h-[10rem] items-end sm:min-h-[14rem]">
          <Image
            src={info.coverSrc}
            alt={info.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-900/40 to-stone-900/20" />
          <div className="relative z-10 w-full p-6 sm:p-8">
            <p className="text-[10px] font-bold tracking-[0.3em] text-[#D4A84B]/70">
              ORIX STORE
            </p>
            <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
              {info.title}
            </h1>
            <p className="mt-1 text-sm text-white/60">{info.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Products */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-stone-300 bg-white/60 px-6 py-16">
          <div className="flex size-14 items-center justify-center rounded-full bg-stone-100">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-6 text-stone-400" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="m20 7-8-4-8 4m16 0-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p className="text-sm font-medium text-stone-500">لا توجد منتجات حالياً في هذه الفئة</p>
          <Link href="/#store" className="text-xs font-bold text-[#A67C2E] transition hover:underline">
            تصفّح الفئات الأخرى
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => {
            const hasImage = p.image_urls && p.image_urls.length > 0;
            const hasSizes = p.size_options && p.size_options.length > 0;
            const minPrice = hasSizes
              ? Math.min(...p.size_options.map((s) => s.price))
              : p.price;

            return (
              <Link
                key={p.id}
                href={`/store/product/${p.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_-16px_rgba(143,107,40,0.18)]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                  {hasImage ? (
                    <Image
                      src={p.image_urls![0]}
                      alt={p.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-stone-300">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-10" aria-hidden>
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <circle cx="9" cy="9" r="1.5" />
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h2 className="line-clamp-2 text-[0.95rem] font-bold leading-snug text-stone-900">
                    {p.name}
                  </h2>
                  {p.description && (
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-stone-500">
                      {p.description}
                    </p>
                  )}
                  <div className="mt-auto flex items-end justify-between gap-2 pt-3">
                    <div>
                      {hasSizes ? (
                        <p className="text-xs text-stone-500">
                          <span className="text-[0.95rem] font-extrabold text-stone-900">
                            {minPrice.toFixed(2)}
                          </span>{" "}
                          <span className="text-stone-400">د.ت</span>
                          {p.size_options.length > 1 && (
                            <span className="mr-1 text-stone-400"> وما فوق</span>
                          )}
                        </p>
                      ) : (
                        <p className="text-xs text-stone-500">
                          <span className="text-[0.95rem] font-extrabold text-stone-900">
                            {Number(p.price).toFixed(2)}
                          </span>{" "}
                          <span className="text-stone-400">د.ت</span>
                        </p>
                      )}
                    </div>
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs text-stone-400 transition group-hover:bg-[#D4A84B]/15 group-hover:text-[#A67C2E]" aria-hidden>
                      ←
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Other categories */}
      {otherCategories.length > 0 && (
        <div className="mt-14 sm:mt-16">
          <h2 className="mb-5 text-lg font-bold text-stone-900">فئات أخرى</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {otherCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/store/${c.slug}`}
                className="group flex items-center gap-4 overflow-hidden rounded-2xl border border-stone-200/80 bg-white p-1 shadow-sm transition hover:shadow-md"
              >
                <div className="relative size-20 shrink-0 overflow-hidden rounded-xl sm:size-24">
                  <Image
                    src={c.coverSrc}
                    alt={c.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="96px"
                  />
                </div>
                <div className="py-2 pe-3">
                  <h3 className="text-sm font-bold text-stone-900">{c.title}</h3>
                  <p className="mt-0.5 text-xs text-stone-500">{c.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <PrefetchStoreProductIds productIds={products.map((p) => p.id)} />
    </div>
  );
}
