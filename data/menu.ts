/**
 * DEMO DATA
 * ---------
 * Menu content below is mock data for the prototype (see PRD #14, #78).
 * It is NOT the real Koreana BBQ menu, real prices, or real preparation
 * times. Replace with confirmed data from the kitchen/POS before launch.
 */
import type { MenuCategory, MenuItem } from "@/types";

export const MENU_CATEGORIES: MenuCategory[] = [
  { id: "popular", label: "Популярное" },
  { id: "korean-bbq", label: "Korean BBQ" },
  { id: "appetizers", label: "Закуски" },
  { id: "salads", label: "Салаты" },
  { id: "soups", label: "Супы" },
  { id: "main-courses", label: "Горячее" },
  { id: "sushi-rolls", label: "Суши / Роллы" },
  { id: "desserts", label: "Десерты" },
  { id: "drinks", label: "Напитки" },
];

const img = (category: string) => `/images/menu/${category}.svg`;

export const MENU_ITEMS: MenuItem[] = [
  // Korean BBQ
  {
    id: "bbq-beef-short-rib",
    name: "Говяжьи рёбра BBQ",
    description: "Мраморная говядина на живом огне, соевый маринад, кунжут.",
    category: "korean-bbq",
    price: 8900,
    currency: "₸",
    preparationTime: 20,
    image: img("korean-bbq"),
    isPopular: true,
  },
  {
    id: "bbq-samgyeopsal",
    name: "Самгёпсаль",
    description: "Толсто нарезанная свиная грудинка, жарится прямо за столом.",
    category: "korean-bbq",
    price: 6500,
    currency: "₸",
    preparationTime: 18,
    image: img("korean-bbq"),
    isPopular: true,
  },
  {
    id: "bbq-chicken-bulgogi",
    name: "Курица булгоги",
    description: "Маринованное куриное бедро в сладко-пряном соусе.",
    category: "korean-bbq",
    price: 5400,
    currency: "₸",
    preparationTime: 15,
    image: img("korean-bbq"),
    isPopular: false,
  },
  {
    id: "bbq-galbi",
    name: "Говяжьи галби",
    description: "Классические корейские рёбрышки в грушево-соевом маринаде.",
    category: "korean-bbq",
    price: 9800,
    currency: "₸",
    preparationTime: 22,
    image: img("korean-bbq"),
    isPopular: false,
  },
  {
    id: "bbq-set-for-two",
    name: "BBQ сет на двоих",
    description: "Ассорти из трёх видов мяса, овощи гриль, соусы.",
    category: "korean-bbq",
    price: 15900,
    currency: "₸",
    preparationTime: 25,
    image: img("korean-bbq"),
    isPopular: true,
  },

  // Appetizers
  {
    id: "app-kimchi",
    name: "Кимчи",
    description: "Ферментированная пекинская капуста с острыми специями.",
    category: "appetizers",
    price: 1900,
    currency: "₸",
    preparationTime: 5,
    image: img("appetizers"),
    isPopular: false,
  },
  {
    id: "app-japchae",
    name: "Чапче",
    description: "Стеклянная лапша с овощами и говядиной, кунжутное масло.",
    category: "appetizers",
    price: 3200,
    currency: "₸",
    preparationTime: 12,
    image: img("appetizers"),
    isPopular: false,
  },
  {
    id: "app-mandu",
    name: "Манду",
    description: "Корейские пельмени на пару с соусом на основе сои.",
    category: "appetizers",
    price: 2800,
    currency: "₸",
    preparationTime: 12,
    image: img("appetizers"),
    isPopular: true,
  },

  // Salads
  {
    id: "salad-chuka",
    name: "Салат чука",
    description: "Маринованные водоросли, кунжут, острая заправка.",
    category: "salads",
    price: 2600,
    currency: "₸",
    preparationTime: 8,
    image: img("salads"),
    isPopular: false,
  },
  {
    id: "salad-funchoza",
    name: "Фунчоза с овощами",
    description: "Рисовая лапша, свежие овощи, кисло-сладкая заправка.",
    category: "salads",
    price: 2900,
    currency: "₸",
    preparationTime: 10,
    image: img("salads"),
    isPopular: false,
  },

  // Soups
  {
    id: "soup-kimchi-jjigae",
    name: "Кимчи-чиге",
    description: "Острый тушёный суп с кимчи, тофу и свининой.",
    category: "soups",
    price: 3400,
    currency: "₸",
    preparationTime: 15,
    image: img("soups"),
    isPopular: false,
  },
  {
    id: "soup-sundubu-jjigae",
    name: "Сундубу-чиге",
    description: "Мягкий тофу, морепродукты, острый бульон.",
    category: "soups",
    price: 3600,
    currency: "₸",
    preparationTime: 15,
    image: img("soups"),
    isPopular: false,
  },

  // Main courses
  {
    id: "main-bibimbap",
    name: "Бибимбап",
    description: "Рис с овощами, говядиной и яйцом в раскалённом каменном горшке.",
    category: "main-courses",
    price: 4200,
    currency: "₸",
    preparationTime: 18,
    image: img("main-courses"),
    isPopular: true,
  },
  {
    id: "main-jeyuk-bokkeum",
    name: "Чеюк-боккым",
    description: "Острая жареная свинина с луком и кунжутом.",
    category: "main-courses",
    price: 4600,
    currency: "₸",
    preparationTime: 16,
    image: img("main-courses"),
    isPopular: false,
  },
  {
    id: "main-dak-galbi",
    name: "Так-Галби",
    description: "Курица с рисовыми лепёшками в остро-сладком соусе на сковороде.",
    category: "main-courses",
    price: 5200,
    currency: "₸",
    preparationTime: 20,
    image: img("main-courses"),
    isPopular: false,
  },

  // Sushi / rolls
  {
    id: "sushi-philadelphia",
    name: "Ролл Philadelphia",
    description: "Лосось, сливочный сыр, огурец.",
    category: "sushi-rolls",
    price: 4400,
    currency: "₸",
    preparationTime: 14,
    image: img("sushi-rolls"),
    isPopular: true,
  },
  {
    id: "sushi-spicy-tuna",
    name: "Спайси тунец ролл",
    description: "Тунец, острый майонез, зелёный лук.",
    category: "sushi-rolls",
    price: 4700,
    currency: "₸",
    preparationTime: 14,
    image: img("sushi-rolls"),
    isPopular: false,
  },
  {
    id: "sushi-dragon",
    name: "Ролл Dragon",
    description: "Угорь, авокадо, унаги-соус.",
    category: "sushi-rolls",
    price: 5300,
    currency: "₸",
    preparationTime: 16,
    image: img("sushi-rolls"),
    isPopular: false,
  },

  // Desserts
  {
    id: "dessert-hotteok",
    name: "Хоттоки",
    description: "Корейские сладкие блины с коричневым сахаром и орехами.",
    category: "desserts",
    price: 2200,
    currency: "₸",
    preparationTime: 10,
    image: img("desserts"),
    isPopular: false,
  },
  {
    id: "dessert-mochi",
    name: "Моти ассорти",
    description: "Три вида японских рисовых десертов.",
    category: "desserts",
    price: 2600,
    currency: "₸",
    preparationTime: 5,
    image: img("desserts"),
    isPopular: false,
  },
  {
    id: "dessert-cheesecake",
    name: "Чизкейк маття",
    description: "Чизкейк с зелёным чаем маття, лёгкий и свежий.",
    category: "desserts",
    price: 2400,
    currency: "₸",
    preparationTime: 5,
    image: img("desserts"),
    isPopular: true,
  },

  // Drinks
  {
    id: "drink-yuzu-tea",
    name: "Юдзу-чай",
    description: "Тёплый или холодный чай с цитрусовым юдзу.",
    category: "drinks",
    price: 1600,
    currency: "₸",
    preparationTime: 5,
    image: img("drinks"),
    isPopular: false,
  },
  {
    id: "drink-soju-cocktail",
    name: "Soju коктейль",
    description: "Классический соджу-коктейль с фруктовым сиропом.",
    category: "drinks",
    price: 3200,
    currency: "₸",
    preparationTime: 6,
    image: img("drinks"),
    isPopular: true,
  },
  {
    id: "drink-house-lemonade",
    name: "Домашний лимонад",
    description: "Сезонный лимонад собственного приготовления.",
    category: "drinks",
    price: 1800,
    currency: "₸",
    preparationTime: 5,
    image: img("drinks"),
    isPopular: false,
  },
];

/** Convenience selector — items flagged isPopular, used by Best Sellers. */
export function getBestSellers(limit = 6): MenuItem[] {
  return MENU_ITEMS.filter((item) => item.isPopular).slice(0, limit);
}

export function getMenuItemsByCategory(category: string): MenuItem[] {
  if (category === "popular") return getBestSellers(MENU_ITEMS.length);
  return MENU_ITEMS.filter((item) => item.category === category);
}
