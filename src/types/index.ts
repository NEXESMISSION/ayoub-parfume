/** فئة الجمهور للمكوّن (عرض في صفحة البناء) */
export type IngredientCategory = "women" | "man" | "kids";

export type OrderStatus =
  | "new"
  | "mixing"
  | "labeling"
  | "ready"
  | "completed"
  | "cancelled";

export type RecipeItem = {
  ingredientId: string;
  grams: number;
};

export type Bottle = {
  id: string;
  name: string | null;
  capacity_ml: number;
  base_price: number;
  image_url: string | null;
  is_active: boolean | null;
};

export type Ingredient = {
  id: string;
  name: string;
  slug: string | null;
  category: IngredientCategory;
  price_per_gram: number;
  intensity_factor: number | null;
  image_url: string | null;
  is_active: boolean | null;
};

export type OrderKind = "custom" | "store";

export type StoreCategory =
  | "original_bottle"
  | "prefilled_bottle"
  | "air_freshener";

export type StoreProduct = {
  id: string;
  created_at: string;
  name: string;
  description: string | null;
  price: number;
  category: StoreCategory;
  image_urls: string[] | null;
  sort_order: number;
  is_active: boolean;
};

export type OrderRow = {
  id: string;
  created_at: string;
  customer_name: string | null;
  whatsapp_number: string | null;
  bottle_id: string | null;
  recipe: RecipeItem[];
  sticker_text: string | null;
  total_price: number | null;
  status: OrderStatus;
  admin_notes: string | null;
  delivery_address: string | null;
  /** يُعبأ بعد ترقية قاعدة البيانات؛ يُعامل كـ custom إن وُجد undefined */
  order_kind?: OrderKind | null;
  store_product_id: string | null;
  /** نسخة من اسم القارورة عند الطلب — تبقى بعد حذف القارورة */
  bottle_name_snapshot?: string | null;
  /** نسخة من اسم منتج المتجر عند الطلب */
  store_product_name_snapshot?: string | null;
};
