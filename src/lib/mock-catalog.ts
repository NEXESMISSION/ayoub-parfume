import type { Bottle, Ingredient } from "@/types";

export const MOCK_BOTTLES: Bottle[] = [
  {
    id: "mock-bottle-1",
    name: "Royal",
    capacity_ml: 50,
    base_price: 45,
    image_url:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80",
    is_active: true,
  },
  {
    id: "mock-bottle-2",
    name: "Signature",
    capacity_ml: 30,
    base_price: 35,
    image_url:
      "https://images.unsplash.com/photo-1595425974618-759fc9e9de7a?w=600&q=80",
    is_active: true,
  },
];

export const MOCK_INGREDIENTS: Ingredient[] = [
  {
    id: "mock-ing-1",
    name: "Bergamot",
    slug: "bergamot",
    category: "top",
    price_per_gram: 2.5,
    intensity_factor: 1,
    image_url: null,
    is_active: true,
  },
  {
    id: "mock-ing-2",
    name: "Pink Pepper",
    slug: "pink-pepper",
    category: "top",
    price_per_gram: 3,
    intensity_factor: 1.1,
    image_url: null,
    is_active: true,
  },
  {
    id: "mock-ing-3",
    name: "Rose",
    slug: "rose",
    category: "heart",
    price_per_gram: 4.5,
    intensity_factor: 1,
    image_url: null,
    is_active: true,
  },
  {
    id: "mock-ing-4",
    name: "Jasmine",
    slug: "jasmine",
    category: "heart",
    price_per_gram: 5,
    intensity_factor: 1.2,
    image_url: null,
    is_active: true,
  },
  {
    id: "mock-ing-5",
    name: "Oud",
    slug: "oud",
    category: "base",
    price_per_gram: 8,
    intensity_factor: 1.3,
    image_url: null,
    is_active: true,
  },
  {
    id: "mock-ing-6",
    name: "Vanilla",
    slug: "vanilla",
    category: "base",
    price_per_gram: 3.5,
    intensity_factor: 0.9,
    image_url: null,
    is_active: true,
  },
];
