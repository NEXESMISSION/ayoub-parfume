import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="relative flex min-h-[100dvh] flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(180,130,40,0.07),_transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(160,110,30,0.04),_transparent_50%)]" />

      {/* Hero */}
      <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-5 pt-[max(2rem,env(safe-area-inset-top))] pb-12 text-center sm:px-8 sm:py-20">
        <Image
          src="/logo.png"
          alt="ORIX"
          width={280}
          height={140}
          className="mb-8 h-24 w-auto drop-shadow-[0_4px_24px_rgba(180,130,40,0.18)] sm:mb-10 sm:h-32 md:h-40"
          priority
          unoptimized
        />

        <h1 className="max-w-3xl text-3xl font-bold leading-[1.2] text-stone-900 sm:text-4xl md:text-5xl">
          عطور فاخرة
          <span className="mt-1 block bg-gradient-to-l from-[#8F6B28] via-[#D4A84B] to-[#8F6B28] bg-clip-text text-transparent">
            حسب الطلب
          </span>
        </h1>

        <p className="mt-5 max-w-lg text-sm leading-relaxed text-stone-500 sm:mt-6 sm:text-base">
          اختر القارورة والمكوّن، شاهد السعر فوراً، ثم أرسل طلبك بخطوة بسيطة.
          <br className="hidden sm:block" />
          نتواصل معك لتأكيد التفاصيل والتوصيل.
        </p>

        <div className="mt-8 flex w-full flex-col items-center gap-3 sm:mt-10 sm:flex-row sm:justify-center sm:gap-4">
          <Button
            size="lg"
            className="h-12 w-full max-w-xs rounded-full px-10 text-base font-bold sm:w-auto"
            asChild
          >
            <Link href="/build" prefetch>
              صمّم عطرك الآن
            </Link>
          </Button>
          <a
            href="tel:+21658415506"
            className="flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-8 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-yellow-600/40 hover:bg-yellow-50/50 sm:w-auto"
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
      <section className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-8">
        <ul className="grid gap-3 sm:grid-cols-3 sm:gap-5">
          <li className="group overflow-hidden rounded-2xl border border-stone-200/80 bg-white/80 shadow-sm backdrop-blur-sm transition hover:border-yellow-600/30 hover:shadow-md">
            <div className="relative h-40 w-full overflow-hidden sm:h-44">
              <Image
                src="/feature-1.png"
                alt="سعر شفّاف"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 33vw"
                unoptimized
              />
            </div>
            <div className="p-4">
              <p className="font-semibold text-stone-900">سعر شفّاف</p>
              <p className="mt-1 text-sm leading-relaxed text-stone-500">
                السعر يتحدّث مباشرة مع كل غرام تختاره — بلا مفاجآت.
              </p>
            </div>
          </li>

          <li className="group overflow-hidden rounded-2xl border border-stone-200/80 bg-white/80 shadow-sm backdrop-blur-sm transition hover:border-yellow-600/30 hover:shadow-md">
            <div className="relative h-40 w-full overflow-hidden sm:h-44">
              <Image
                src="/feature-2.png"
                alt="تصميم بصري"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 33vw"
                unoptimized
              />
            </div>
            <div className="p-4">
              <p className="font-semibold text-stone-900">تصميم بصري</p>
              <p className="mt-1 text-sm leading-relaxed text-stone-500">
                صور حقيقية للقوارير والزيوت تسهّل عليك الاختيار.
              </p>
            </div>
          </li>

          <li className="group overflow-hidden rounded-2xl border border-stone-200/80 bg-white/80 shadow-sm backdrop-blur-sm transition hover:border-yellow-600/30 hover:shadow-md">
            <div className="relative h-40 w-full overflow-hidden sm:h-44">
              <Image
                src="/feature-3.png"
                alt="طلب فوري"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 33vw"
                unoptimized
              />
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
            className="text-xs font-medium text-stone-500 transition hover:text-yellow-700"
            dir="ltr"
          >
            +216 58 415 506
          </a>
        </div>
      </footer>
    </main>
  );
}
