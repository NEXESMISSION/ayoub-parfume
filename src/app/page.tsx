import Link from "next/link";
import Image from "next/image";
import { PrefetchStoreHubAndCategories } from "@/components/store/prefetch-store-navigation";

export default function Home() {
  return (
    <main className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-[#faf8f5]">
      {/* Animated background layer */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Gradient mesh */}
        <div className="animate-gradient-shift absolute inset-0 bg-[linear-gradient(135deg,_rgba(212,168,75,0.06)_0%,_transparent_40%,_rgba(143,107,40,0.04)_60%,_transparent_100%)]" />
        <div className="animate-gradient-shift absolute inset-0 bg-[linear-gradient(225deg,_transparent_0%,_rgba(197,151,62,0.05)_30%,_transparent_60%)]" style={{ animationDelay: "-4s" }} />

        {/* Floating orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* Rising particles */}
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />

        {/* Decorative gold ring */}
        <div className="animate-pulse-ring absolute left-1/2 top-1/3 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4A84B]/10 sm:size-[600px]" />
        <div className="animate-pulse-ring absolute left-1/2 top-1/3 size-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4A84B]/[0.06] sm:size-[420px]" style={{ animationDelay: "-2s" }} />
      </div>

      {/* Hero */}
      <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-5 pt-[max(2rem,env(safe-area-inset-top))] pb-12 text-center sm:px-8 sm:py-20">
        <div className="animate-fade-up">
          <Image
            src="/logo.png"
            alt="ORIX"
            width={200}
            height={100}
            className="mx-auto mb-8 h-20 w-auto drop-shadow-[0_4px_32px_rgba(180,130,40,0.22)] sm:mb-10 sm:h-24 md:h-28"
            priority
            sizes="(max-width: 768px) 180px, 220px"
          />
        </div>

        <h1 className="animate-fade-up-1 max-w-3xl text-3xl font-bold leading-[1.2] text-stone-900 sm:text-4xl md:text-5xl">
          عطور فاخرة
          <span className="animate-shimmer mt-1 block bg-[linear-gradient(90deg,_#8F6B28_0%,_#D4A84B_25%,_#F5D78E_50%,_#D4A84B_75%,_#8F6B28_100%)] bg-clip-text text-transparent">
            حسب الطلب
          </span>
        </h1>

        <p className="animate-fade-up-2 mt-5 max-w-lg text-sm leading-relaxed text-stone-500 sm:mt-6 sm:text-base">
          اختر القارورة والمكوّن، شاهد السعر فوراً، ثم أرسل طلبك بخطوة بسيطة.
          <br className="hidden sm:block" />
          نتواصل معك لتأكيد التفاصيل والتوصيل.
        </p>

        <div className="animate-fade-up-3 mt-9 flex w-full flex-col items-stretch gap-4 sm:mt-12 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-5">
          {/* Primary — لوح ذهبي لامع */}
          <Link
            href="/build"
            prefetch
            className="group relative isolate flex h-[3.25rem] w-full min-w-[14rem] items-center justify-center gap-2.5 overflow-hidden rounded-2xl px-7 text-[0.95rem] font-bold tracking-wide text-white no-underline shadow-[0_14px_36px_-8px_rgba(120,85,30,0.55),inset_0_1px_0_rgba(255,255,255,0.35)] transition duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_22px_44px_-10px_rgba(120,85,30,0.6),inset_0_1px_0_rgba(255,255,255,0.4)] active:translate-y-0 sm:h-14 sm:w-auto sm:min-w-[15.5rem] sm:px-9 sm:text-base"
          >
            <span
              className="absolute inset-0 -z-20 bg-[linear-gradient(145deg,#f0d78e_0%,#D4A84B_35%,#A67C2E_72%,#6b4f1e_100%)]"
              aria-hidden
            />
            <span
              className="absolute -inset-8 -z-10 opacity-0 mix-blend-soft-light transition duration-500 group-hover:translate-x-[40%] group-hover:opacity-100 motion-reduce:transition-none"
              aria-hidden
            >
              <span className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            </span>
            <span
              className="pointer-events-none absolute inset-x-4 top-0 -z-10 h-1/2 rounded-t-xl bg-gradient-to-b from-white/25 to-transparent opacity-70"
              aria-hidden
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              className="relative size-5 shrink-0 text-white/95 drop-shadow-sm"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M9 3h6v2.5a6 6 0 0 1 3 5.2V20a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-9.3a6 6 0 0 1 3-5.2V3z" />
              <path d="M9 10h6" />
            </svg>
            <span className="relative drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]">
              صمّم عطرك المخصّص
            </span>
          </Link>

        </div>
      </section>

      {/* Direct shopping */}
      <section id="store" className="animate-fade-up-4 relative z-10 mx-auto w-full max-w-6xl px-5 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-8">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold tracking-[0.3em] text-[#A67C2E]">
            ORIX STORE
          </p>
          <h2 className="mt-3 text-3xl font-black text-stone-900 sm:text-4xl">
            تسوّق مباشرة
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-stone-500 sm:text-base">
            عطور جاهزة، ومعطّرات جو — اختر الباب واكتشف المنتجات.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <Link
            href="/store/original-bottles"
            className="group relative isolate flex min-h-[22rem] flex-col justify-end overflow-hidden rounded-[1.75rem] sm:min-h-[26rem]"
          >
            <Image
              src="/store-categories/original-bottles.jpg"
              alt="عطور اصلية"
              fill
              className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.08]"
              sizes="(max-width: 640px) 92vw, 360px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/40 to-transparent" />
            <div className="absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-white/[0.06] transition duration-500 group-hover:ring-[#D4A84B]/25" />
            <div className="relative z-10 flex items-end justify-between gap-3 p-6">
              <div>
                <p className="mb-1 text-[10px] font-bold tracking-[0.25em] text-[#D4A84B]/70">٠١</p>
                <h3 className="text-[1.35rem] font-extrabold leading-tight text-white">
                  عطور اصلية
                </h3>
                <p className="mt-1.5 text-[13px] leading-snug text-white/50">
                  زجاج فاخر وجودة عالية
                </p>
              </div>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/70 backdrop-blur-sm transition duration-300 group-hover:border-[#D4A84B]/40 group-hover:bg-[#D4A84B]/20 group-hover:text-[#D4A84B]" aria-hidden>
                ←
              </span>
            </div>
          </Link>

          <Link
            href="/store/prefilled-bottles"
            className="group relative isolate flex min-h-[22rem] flex-col justify-end overflow-hidden rounded-[1.75rem] sm:min-h-[26rem]"
          >
            <Image
              src="/store-categories/prefilled-bottles.jpg"
              alt="عطور مركبة"
              fill
              className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.08]"
              sizes="(max-width: 640px) 92vw, 360px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/40 to-transparent" />
            <div className="absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-white/[0.06] transition duration-500 group-hover:ring-[#D4A84B]/25" />
            <div className="relative z-10 flex items-end justify-between gap-3 p-6">
              <div>
                <p className="mb-1 text-[10px] font-bold tracking-[0.25em] text-[#D4A84B]/70">٠٢</p>
                <h3 className="text-[1.35rem] font-extrabold leading-tight text-white">
                  عطور مركبة
                </h3>
                <p className="mt-1.5 text-[13px] leading-snug text-white/50">
                  جاهزة بالكمية والتركيبة
                </p>
              </div>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/70 backdrop-blur-sm transition duration-300 group-hover:border-[#D4A84B]/40 group-hover:bg-[#D4A84B]/20 group-hover:text-[#D4A84B]" aria-hidden>
                ←
              </span>
            </div>
          </Link>

          <Link
            href="/store/air-freshener"
            className="group relative isolate flex min-h-[22rem] flex-col justify-end overflow-hidden rounded-[1.75rem] sm:min-h-[26rem]"
          >
            <Image
              src="/store-categories/air-freshener.avif"
              alt="عطور الجو"
              fill
              className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.08]"
              sizes="(max-width: 640px) 92vw, 360px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/40 to-transparent" />
            <div className="absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-white/[0.06] transition duration-500 group-hover:ring-[#D4A84B]/25" />
            <div className="relative z-10 flex items-end justify-between gap-3 p-6">
              <div>
                <p className="mb-1 text-[10px] font-bold tracking-[0.25em] text-[#D4A84B]/70">٠٣</p>
                <h3 className="text-[1.35rem] font-extrabold leading-tight text-white">
                  عطور الجو
                </h3>
                <p className="mt-1.5 text-[13px] leading-snug text-white/50">
                  للمساحات والسيارة
                </p>
              </div>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/70 backdrop-blur-sm transition duration-300 group-hover:border-[#D4A84B]/40 group-hover:bg-[#D4A84B]/20 group-hover:text-[#D4A84B]" aria-hidden>
                ←
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-stone-200/60 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-5 py-5 sm:flex-row sm:justify-between sm:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="ORIX"
              width={48}
              height={24}
              className="h-5 w-auto opacity-70"
              sizes="48px"
            />
            <span className="text-xs text-stone-400">
              © {new Date().getFullYear()} ORIX
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a
              href="tel:+21658415506"
              className="text-xs font-medium text-stone-500 transition hover:text-[#A67C2E]"
              dir="ltr"
            >
              +216 58 415 506
            </a>
            <Link
              href="/admin"
              prefetch={false}
              className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium text-stone-300 transition hover:bg-stone-100 hover:text-stone-500"
              title="لوحة التحكم (يتطلب تسجيل الدخول)"
              aria-label="الدخول إلى لوحة التحكم"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="size-3 opacity-70"
                aria-hidden
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>لوحة التحكم</span>
            </Link>
          </div>
        </div>
      </footer>

      <PrefetchStoreHubAndCategories />
    </main>
  );
}
