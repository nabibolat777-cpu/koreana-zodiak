/**
 * Menu domain types.
 *
 * NOTE: preparationTime is prototype/mock data. In production this value
 * (and price/availability) should be sourced from the kitchen/POS backend.
 */

export type MenuCategoryId =
  | "popular"
  | "korean-bbq"
  | "appetizers"
  | "salads"
  | "soups"
  | "main-courses"
  | "sushi-rolls"
  | "desserts"
  | "drinks";

export interface MenuCategory {
  id: MenuCategoryId;
  label: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: MenuCategoryId;
  price: number;
  currency: string;
  /** minutes */
  preparationTime: number;
  image: string;
  isPopular: boolean;
}
