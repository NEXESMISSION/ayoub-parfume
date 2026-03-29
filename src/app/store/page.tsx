import Link from "next/link";
import Image from "next/image";
import { STORE_CATEGORIES } from "@/lib/store-categories";

export const metadata = {
  title: "المتجر — ORIX",
  description: "قوارير أصلية، معبأة، ومعطّرات جو.",
};

const INDEX_BADGE = ["٠١", "٠٢", "٠٣"] as const;

export default function StoreHomePage() {
  return (
    <main className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-[#faf8f5]">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(212,168,75,0.11),transparent),radial-gradient(ellipse_55%_40%_at_100%_40%,rgba(143,107,40,0.06),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-20 -z-10 h-44 w-[min(90vw,20rem)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,168,75,0.22)_0%,transparent_68%)] opacity-90 blur-2xl sm:top-28 sm:h-56 sm:w-[26rem]"
        aria-hidden
      />

      <header className="relative z-10 shrink-0 border-b border-stone-200/70 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link
            href="/"
            prefetch
            className="text-xs font-semibold text-[#8F6B28] transition hover:text-[#A67C2E] sm:text-sm"
          >
            ← الرئيسية
          </Link>
          <h1 className="text-xs font-bold text-stone-900 sm:text-base">
            متجر ORIX
          </h1>
          <Link
            href="/build"
            prefetch
            className="text-xs font-medium text-stone-600 transition hover:text-stone-900 sm:text-sm"
          >
            صمّم عطرك
          </Link>
        </div>
      </header>

      <div className="relative z-10 flex flex-1 flex-col justify-start py-8 sm:py-10 lg:justify-center lg:py-14">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
          <div className="mb-8 text-center sm:mb-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D4A84B]/35 bg-[#D4A84B]/10 px-3 py-1 text-[0.65rem] font-bold text-[#7a5a22] sm:text-xs">
              <span className="size-1.5 rounded-full bg-[#C5973E] shadow-[0_0_8px_rgba(197,151,62,0.8)]" />
              تسوق مباشرة
            </span>
            <h2 className="mt-4 text-2xl font-bold leading-tight text-stone-900 sm:text-3xl md:text-4xl">
              <span className="animate-shimmer bg-[linear-gradient(90deg,_#5c4420_0%,_#D4A84B_28%,_#F5D78E_50%,_#D4A84B_72%,_#5c4420_100%)] bg-clip-text text-transparent">
                ثلاث فئات
              </span>
              <span className="mt-1 block text-stone-800">للذوق الرفيع</span>
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[0.8rem] leading-relaxed text-stone-500 sm:text-sm">
              قوارير، عطور جاهزة، ومعطّرات جو — اختر الباب واكتشف المنتجات.
            </p>
            <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-l from-transparent via-[#D4A84B]/70 to-transparent sm:w-28" />
          </div>

          <ul className="store-stagger mx-auto grid max-w-md grid-cols-1 gap-3 sm:max-w-none sm:grid-cols-3 sm:gap-5 lg:gap-6">
            {STORE_CATEGORIES.map((c, i) => (
              <li key={c.slug} className="store-rise min-w-0">
                <Link
                  href={`/store/${c.slug}`}
                  prefetch
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-stone-200/90 bg-white shadow-[0_4px_24px_-12px_rgba(28,25,23,0.12)] ring-1 ring-stone-900/[0.04] transition duration-300 hover:-translate-y-1 hover:border-[#D4A84B]/55 hover:shadow-[0_20px_40px_-16px_rgba(143,107,40,0.28)] sm:rounded-2xl"
                >
                  <span
                    className="absolute start-3 top-3 z-10 flex size-8 items-center justify-center rounded-lg bg-black/35 text-[0.65rem] font-bold text-white backdrop-blur-sm sm:start-4 sm:top-4 sm:size-9 sm:text-xs"
                    aria-hidden
                  >
                    {INDEX_BADGE[i]}
                  </span>
                  <div className="relative h-[7.5rem] w-full shrink-0 overflow-hidden sm:aspect-[4/3] sm:h-auto sm:min-h-[11.5rem] lg:min-h-[13rem]">
                    <Image
                      src={c.coverSrc}
                      alt=""
                      fill
                      className="object-cover transition duration-500 ease-out group-hover:scale-[1.05]"
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 30vw, 300px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent sm:from-black/58" />
                    <div className="absolute inset-x-0 bottom-0 px-3 pb-2.5 pt-10 text-white sm:p-4 sm:pt-14">
                      <p className="text-[0.9375rem] font-bold leading-tight sm:text-lg">
                        {c.title}
                      </p>
                      <p className="mt-1 text-[0.65rem] leading-snug text-white/88 sm:text-xs">
                        {c.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="relative flex items-center justify-between gap-2 overflow-hidden border-t border-stone-100/90 bg-gradient-to-b from-white to-stone-50/90 px-2.5 py-2.5 sm:px-4 sm:py-3">
                    <span className="absolute inset-0 -z-10 opacity-0 transition duration-300 group-hover:opacity-100">
                      <span className="absolute inset-0 bg-gradient-to-l from-[#D4A84B]/8 to-transparent" />
                    </span>
                    <span className="text-[0.65rem] font-bold text-[#8F6B28] sm:text-xs">
                      تصفّح المنتجات
                    </span>
                    <span
                      className="flex size-7 items-center justify-center rounded-full bg-stone-100 text-[0.65rem] text-stone-500 transition group-hover:bg-[#D4A84B] group-hover:text-white sm:size-8 sm:text-xs"
                      aria-hidden
                    >
                      ←
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-center sm:mt-12">
            <Link
              href="/"
              prefetch
              className="text-xs font-semibold text-stone-500 underline-offset-4 transition hover:text-[#8F6B28] hover:underline"
            >
              الصفحة الرئيسية
            </Link>
            <span className="text-stone-300" aria-hidden>
              ·
            </span>
            <Link
              href="/build"
              prefetch
              className="text-xs font-semibold text-stone-500 underline-offset-4 transition hover:text-[#8F6B28] hover:underline"
            >
              صمّم عطرك المخصّص
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
