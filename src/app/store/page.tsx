import Link from "next/link";
import Image from "next/image";
import { STORE_CATEGORIES } from "@/lib/store-categories";

export const metadata = {
  title: "المتجر — ORIX",
  description: "قوارير أصلية، معبأة، ومعطّرات جو.",
};

export default function StoreHomePage() {
  return (
    <main className="flex min-h-[100dvh] flex-col bg-[#faf8f5]">
      {/* خلفية خفيفة */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(212,168,75,0.09),transparent),radial-gradient(ellipse_60%_40%_at_100%_50%,rgba(143,107,40,0.05),transparent)]"
        aria-hidden
      />

      <header className="shrink-0 border-b border-stone-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="text-xs font-semibold text-[#8F6B28] transition hover:text-[#A67C2E] sm:text-sm"
          >
            ← الرئيسية
          </Link>
          <h1 className="text-xs font-bold text-stone-900 sm:text-base">
            متجر ORIX
          </h1>
          <Link
            href="/build"
            className="text-xs font-medium text-stone-600 transition hover:text-stone-900 sm:text-sm"
          >
            صمّم عطرك
          </Link>
        </div>
      </header>

      {/* عموديًا في المنتصف على الشاشات الواسعة؛ هوامش مريحة على الجوال */}
      <div className="flex flex-1 flex-col justify-start py-6 sm:py-8 lg:justify-center lg:py-12">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
          <ul className="mx-auto grid max-w-md grid-cols-1 gap-2.5 sm:max-w-none sm:grid-cols-3 sm:gap-5 lg:gap-6">
            {STORE_CATEGORIES.map((c) => (
              <li key={c.slug} className="min-w-0">
                <Link
                  href={`/store/${c.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-stone-200/90 bg-white shadow-[0_2px_12px_-4px_rgba(28,25,23,0.08)] ring-1 ring-stone-900/[0.03] transition duration-300 hover:-translate-y-0.5 hover:border-[#D4A84B]/50 hover:shadow-[0_12px_28px_-8px_rgba(143,107,40,0.18)] sm:rounded-2xl"
                >
                  {/* صورة أصغر على الجوال */}
                  <div className="relative h-[7.25rem] w-full shrink-0 overflow-hidden sm:aspect-[4/3] sm:h-auto sm:min-h-[11rem] lg:min-h-[13rem]">
                    <Image
                      src={c.coverSrc}
                      alt=""
                      fill
                      className="object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 30vw, 280px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent sm:from-black/55" />
                    <div className="absolute inset-x-0 bottom-0 px-3 pb-2.5 pt-8 text-white sm:p-4 sm:pt-12">
                      <p className="text-[0.9375rem] font-bold leading-tight sm:text-lg">
                        {c.title}
                      </p>
                      <p className="mt-0.5 text-[0.65rem] text-white/88 sm:mt-1 sm:text-xs">
                        {c.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 border-t border-stone-100/90 bg-white px-2.5 py-2 sm:px-4 sm:py-3">
                    <span className="text-[0.65rem] font-semibold text-[#8F6B28] sm:text-xs">
                      تصفّح المنتجات
                    </span>
                    <span
                      className="flex size-6 items-center justify-center rounded-full bg-stone-100 text-[0.65rem] text-stone-500 transition group-hover:bg-[#D4A84B]/15 group-hover:text-[#A67C2E] sm:size-7 sm:text-xs"
                      aria-hidden
                    >
                      ←
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
