import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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
            width={280}
            height={140}
            className="mx-auto mb-8 h-24 w-auto drop-shadow-[0_4px_32px_rgba(180,130,40,0.22)] sm:mb-10 sm:h-32 md:h-40"
            priority
            unoptimized
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

        <div className="animate-fade-up-3 mt-8 flex w-full flex-col items-center gap-3 sm:mt-10 sm:flex-row sm:justify-center sm:gap-4">
          <Button
            size="lg"
            className="h-12 w-full max-w-xs rounded-full px-10 text-base font-bold shadow-lg shadow-[#A67C2E]/20 transition-shadow hover:shadow-xl hover:shadow-[#A67C2E]/30 sm:w-auto"
            asChild
          >
            <Link href="/build" prefetch>
              صمّم عطرك الآن
            </Link>
          </Button>
          <a
            href="tel:+21658415506"
            className="flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-full border border-stone-200 bg-white/80 px-8 text-sm font-semibold text-stone-700 shadow-sm backdrop-blur-sm transition hover:border-[#D4A84B]/40 hover:bg-white sm:w-auto"
          >
            <span dir="ltr">+216 58 415 506</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="animate-fade-up-4 relative z-10 mx-auto w-full max-w-6xl px-5 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-8">
        <ul className="grid gap-3 sm:grid-cols-3 sm:gap-5">
          <li className="group overflow-hidden rounded-2xl border border-stone-200/80 bg-white/80 shadow-sm backdrop-blur-sm transition hover:border-[#D4A84B]/30 hover:shadow-lg">
            <div className="relative h-40 w-full overflow-hidden sm:h-44">
              <Image
                src="/feature-1.png"
                alt="سعر شفّاف"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, 33vw"
                unoptimized
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
            <div className="relative h-40 w-full overflow-hidden sm:h-44">
              <Image
                src="/feature-2.png"
                alt="تصميم بصري"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, 33vw"
                unoptimized
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
            <div className="relative h-40 w-full overflow-hidden sm:h-44">
              <Image
                src="/feature-3.png"
                alt="طلب فوري"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, 33vw"
                unoptimized
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
              width={60}
              height={30}
              className="h-6 w-auto opacity-70"
              unoptimized
            />
            <span className="text-xs text-stone-400">
              © {new Date().getFullYear()} ORIX
            </span>
          </div>
          <a
            href="tel:+21658415506"
            className="text-xs font-medium text-stone-500 transition hover:text-[#A67C2E]"
            dir="ltr"
          >
            +216 58 415 506
          </a>
        </div>
      </footer>
    </main>
  );
}
