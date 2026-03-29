import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
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
    icon: [{ url: "/icon", type: "image/png" }],
  },
};

export const viewport = {
  width: "device-width" as const,
  initialScale: 1,
  viewportFit: "cover" as const,
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
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(217,119,6,0.06),_transparent_50%)]" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
