import type { NextConfig } from "next";

/** Prefer explicit Supabase host — wildcards like *.supabase.co are unreliable across Next/Vercel versions. */
function supabaseImageHost():
  | { protocol: "https"; hostname: string; pathname: string }
  | undefined {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) return undefined;
  try {
    const host = new URL(raw).hostname;
    if (!host) return undefined;
    return {
      protocol: "https",
      hostname: host,
      pathname: "/storage/**",
    };
  } catch {
    return undefined;
  }
}

const remotePatterns: NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
> = [
  {
    protocol: "https",
    hostname: "images.unsplash.com",
    pathname: "/**",
  },
];

const sb = supabaseImageHost();
if (sb) remotePatterns.push(sb);

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
  experimental: {
    /** كاش أطول للتنقّل العميل — يقلّل إعادة جلب واجهة RSC عند التنقّل */
    staleTimes: {
      dynamic: 90,
      static: 300,
    },
    /** إظهار الكاش السابق فوراً أثناء التنقّل عندما يكون متاحاً */
    optimisticClientCache: true,
  },
};

export default nextConfig;
