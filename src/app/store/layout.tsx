import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { PrefetchStoreHubAndCategories } from "@/components/store/prefetch-store-navigation";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-[#faf8f5]">
      <header className="sticky top-0 z-50 border-b border-stone-200/60 bg-[#faf8f5]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:h-16 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="ORIX"
              width={96}
              height={48}
              className="h-7 w-auto sm:h-8"
              sizes="96px"
              priority
            />
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/#store"
              className="rounded-lg px-3 py-1.5 text-[13px] font-semibold text-stone-600 transition hover:bg-stone-100 hover:text-stone-900"
            >
              المتجر
            </Link>
            <Link
              href="/build"
              className="rounded-lg bg-gradient-to-b from-[#e8c56e] via-[#C5973E] to-[#A67C2E] px-4 py-1.5 text-[13px] font-bold text-white shadow-sm transition hover:shadow-md"
            >
              صمّم عطرك
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        {children}
      </main>

      <footer className="mt-16 border-t border-stone-200/60 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 py-6 text-center sm:flex-row sm:justify-between sm:px-8 sm:text-start">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="ORIX"
              width={48}
              height={24}
              className="h-5 w-auto opacity-60"
              sizes="48px"
            />
            <span className="text-xs text-stone-400">
              © {new Date().getFullYear()} ORIX
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs font-medium text-stone-500 transition hover:text-[#A67C2E]">
              الرئيسية
            </Link>
            <a
              href="tel:+21658415506"
              className="text-xs font-medium text-stone-500 transition hover:text-[#A67C2E]"
              dir="ltr"
            >
              +216 58 415 506
            </a>
          </div>
        </div>
      </footer>

      <PrefetchStoreHubAndCategories />
    </div>
  );
}
