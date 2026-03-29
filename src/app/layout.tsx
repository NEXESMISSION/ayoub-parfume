import type { Metadata, Viewport } from "next";
import { Tajawal } from "next/font/google";
import { PullToRefresh } from "@/components/pwa/pull-to-refresh";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-ar",
});

export const metadata: Metadata = {
  title: "ORIX — عطور فاخرة حسب الطلب",
  description:
    "صمّم عطرك المخصص مع ORIX، احسب السعر مباشرة، وأرسل الطلب بسهولة.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ORIX",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#D4A84B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body
        className={`${tajawal.className} min-h-screen bg-[#faf8f5] antialiased text-stone-800`}
      >
        <PullToRefresh />
        {children}
      </body>
    </html>
  );
}
