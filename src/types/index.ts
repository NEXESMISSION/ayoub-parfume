export type IngredientCategory = "top" | "heart" | "base";

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
};
