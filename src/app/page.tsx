import Link from "next/link";
import Image from "next/image";

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
              صمّم عطرك الآن
            </span>
          </Link>

          {/* المتجر — إطار متدرّج زجاجي */}
          <div className="relative w-full rounded-2xl bg-[linear-gradient(135deg,#D4A84B_0%,#f5e0a8_45%,#8F6B28_100%)] p-px shadow-[0_12px_28px_-10px_rgba(143,107,40,0.35)] transition duration-300 hover:shadow-[0_18px_36px_-12px_rgba(143,107,40,0.42)] sm:w-auto">
            <Link
              href="/store"
              prefetch
              className="flex h-[3.25rem] w-full min-w-[14rem] items-center justify-center gap-2 rounded-[0.9375rem] bg-white/88 px-7 text-[0.95rem] font-bold text-[#5c4420] no-underline backdrop-blur-md transition duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-white/95 hover:text-[#3d2c12] active:translate-y-0 sm:h-14 sm:min-w-[15rem] sm:px-8 sm:text-base"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                className="size-[1.15rem] text-[#A67C2E]"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M6 6h15l-1.5 9h-12z" />
                <path d="M6 6 5 3H2" />
                <circle cx="9" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
              المتجر
            </Link>
          </div>

          {/* هاتف — قرص أنيق */}
          <a
            href="tel:+21658415506"
            aria-label="اتصل بنا على الرقم +216 58 415 506"
            className="group flex h-[3.25rem] w-full min-w-[14rem] items-center justify-center gap-3 rounded-2xl border border-stone-200/70 bg-gradient-to-b from-white via-white to-stone-50/95 px-5 text-[0.9rem] font-semibold text-stone-800 no-underline shadow-[0_8px_24px_-8px_rgba(28,25,23,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-stone-900/[0.04] transition duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[#D4A84B]/45 hover:shadow-[0_14px_32px_-10px_rgba(212,168,75,0.28)] active:translate-y-0 sm:h-14 sm:w-auto sm:min-w-[15.5rem] sm:px-6 sm:text-[0.95rem]"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#D4A84B]/20 via-white to-[#8F6B28]/15 text-[#7a5a22] shadow-inner ring-1 ring-[#D4A84B]/25 transition group-hover:from-[#D4A84B]/30 group-hover:text-[#5c4420]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-[1.05rem]"
                aria-hidden
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </span>
            <span
              dir="ltr"
              className="shrink-0 text-center font-bold tabular-nums tracking-wide text-stone-800"
            >
              +216 58 415 506
            </span>
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="animate-fade-up-4 relative z-10 mx-auto w-full max-w-6xl px-5 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-8">
        <ul className="grid gap-3 sm:grid-cols-3 sm:gap-5">
          <li className="group overflow-hidden rounded-2xl border border-stone-200/80 bg-white/80 shadow-sm backdrop-blur-sm transition hover:border-[#D4A84B]/30 hover:shadow-lg">
            <div className="relative h-28 w-full overflow-hidden sm:h-32">
              <Image
                src="/feature-1.png"
                alt="سعر شفّاف"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 92vw, 280px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <div className="p-4">
              <p className="font-semibold text-stone-900">سعر شفّاف</p>
              <p className="mt-1 text-sm leading-relaxed text-stone-500">
                السعر يتحدّث مباشرة مع كل غرام تختاره — بلا مفاجآت.
              </p>
            </div>
          </li>

          <li className="group overflow-hidden rounded-2xl border border-stone-200/80 bg-white/80 shadow-sm backdrop-blur-sm transition hover:border-[#D4A84B]/30 hover:shadow-lg">
            <div className="relative h-28 w-full overflow-hidden sm:h-32">
              <Image
                src="/feature-2.png"
                alt="تصميم بصري"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 92vw, 280px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <div className="p-4">
              <p className="font-semibold text-stone-900">تصميم بصري</p>
              <p className="mt-1 text-sm leading-relaxed text-stone-500">
                صور حقيقية للقوارير والزيوت تسهّل عليك الاختيار.
              </p>
            </div>
          </li>

          <li className="group overflow-hidden rounded-2xl border border-stone-200/80 bg-white/80 shadow-sm backdrop-blur-sm transition hover:border-[#D4A84B]/30 hover:shadow-lg">
            <div className="relative h-28 w-full overflow-hidden sm:h-32">
              <Image
                src="/feature-3.png"
                alt="طلب فوري"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 92vw, 280px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <div className="p-4">
              <p className="font-semibold text-stone-900">طلب فوري</p>
              <p className="mt-1 text-sm leading-relaxed text-stone-500">
                أدخل رقمك وأكّد — نتّصل بك خلال ساعات للمراجعة والتوصيل.
              </p>
            </div>
          </li>
        </ul>
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
    </main>
  );
}
