"use server";

import { createClient } from "@/lib/supabase/server";

const BUCKET = "product-images";
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);

export async function uploadImage(
  formData: FormData,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "لم يتم اختيار ملف" };
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return { ok: false, error: "نوع الملف غير مدعوم (استخدم JPG, PNG, WebP)" };
  }
  if (file.size > MAX_SIZE) {
    return { ok: false, error: "حجم الملف يتجاوز 5 ميجابايت" };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { ok: false, error: "قاعدة البيانات غير متصلة" };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    return { ok: false, error: error.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return { ok: true, url: publicUrl };
}
