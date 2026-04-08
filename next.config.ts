import path from "path";
import { fileURLToPath } from "url";
import type { NextConfig } from "next";

/**
 * Force app root: a `package-lock.json` in a parent folder (e.g. user home) makes Next
 * infer the wrong workspace root; Turbopack then corrupts `.next` manifests after a while (ENOENT).
 */
const PROJECT_ROOT = path.dirname(fileURLToPath(import.meta.url));

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
  outputFileTracingRoot: PROJECT_ROOT,
  turbopack: {
    root: PROJECT_ROOT,
  },
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
