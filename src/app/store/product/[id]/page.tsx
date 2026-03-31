import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchStoreProductById } from "@/lib/store-data";
import { slugForCategory, STORE_CATEGORIES } from "@/lib/store-categories";
import { ProductGallery } from "@/components/store/product-gallery";
import { StoreOrderForm } from "@/components/store/store-order-form";

export const dynamic = "force-dynamic";

export default async function StoreProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchStoreProductById(id);
  if (!product) return notFound();

  const backSlug = slugForCategory(product.category);
  const catInfo = STORE_CATEGORIES.find((c) => c.slug === backSlug);
  const catTitle = catInfo?.title ?? "المتجر";

  const hasSizes = product.size_options && product.size_options.length > 0;
  const minPrice = hasSizes
    ? Math.min(...product.size_options.map((s) => s.price))
    : product.price;
  const maxPrice = hasSizes
    ? Math.max(...product.size_options.map((s) => s.price))
    : product.price;

  return (
    <div className="py-8 sm:py-10">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-stone-400">
        <Link href="/" className="transition hover:text-stone-600">الرئيسية</Link>
        <span>/</span>
        <Link href={`/store/${backSlug}`} className="transition hover:text-stone-600">{catTitle}</Link>
        <span>/</span>
        <span className="line-clamp-1 max-w-[10rem] font-semibold text-stone-700">{product.name}</span>
      </nav>

      <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Gallery */}
        <ProductGallery images={product.image_urls ?? []} productName={product.name} />

        {/* Product info */}
        <div className="space-y-5 lg:sticky lg:top-24">
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-[#A67C2E]">
              {catTitle}
            </p>
            <h1 className="mt-2 text-2xl font-black leading-tight text-stone-900 sm:text-3xl">
              {product.name}
            </h1>
          </div>

          {product.description && (
            <p className="text-sm leading-relaxed text-stone-600">
              {product.description}
            </p>
          )}

          {/* Price display */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-stone-900">
              {minPrice.toFixed(2)}
            </span>
            {hasSizes && minPrice !== maxPrice && (
              <>
                <span className="text-sm text-stone-400">—</span>
                <span className="text-lg font-bold text-stone-600">
                  {maxPrice.toFixed(2)}
                </span>
              </>
            )}
            <span className="text-sm font-medium text-stone-400">د.ت</span>
          </div>

          {/* Size pills */}
          {hasSizes && product.size_options.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {product.size_options.map((s) => (
                <span
                  key={s.volume_ml}
                  className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-semibold text-stone-600"
                >
                  <span dir="ltr">{s.volume_ml}ml</span>
                  <span className="mx-1.5 text-stone-300">·</span>
                  {s.price.toFixed(2)} د.ت
                </span>
              ))}
            </div>
          )}

          <hr className="border-stone-200/60" />

          {/* Order form */}
          <StoreOrderForm product={product} />
        </div>
      </div>
    </div>
  );
}
