import { createClient } from "@supabase/supabase-js";

/**
 * عميل قراءة فقط بدون ملفات تعريف الارتباط — مناسب لـ unstable_cache ولتقليل
 * جعل المسارات ديناميكية بلا داعٍ (أسرع في التنقّل بين صفحات المتجر).
 */
export function createPublicSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
