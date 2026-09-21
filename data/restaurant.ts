/**
 * REAL BUSINESS DATA
 * ------------------
 * Only publicly-confirmed facts about the venue live in this block.
 * Everything else in this file (hours, capacity, descriptive copy) is
 * DEMO DATA for the prototype and must be replaced with confirmed
 * business information before launch (see PRD #78).
 */
export const REAL_BUSINESS_DATA = {
  name: "Koreana BBQ × Zodiak",
  city: "Астана, Казахстан",
  address: "ул. Кажымукана, 3, Астана",
} as const;

/**
 * DEMO DATA — placeholder opening hours, not confirmed. Replace with the
 * venue's real schedule.
 */
export const DEMO_OPENING_HOURS = {
  everyday: "12:00 – 02:00",
} as const;

export interface ExperienceHighlight {
  id: string;
  title: string;
  description: string;
}

/** DEMO DATA — illustrative copy for the "Restaurant / BBQ Experience" cards. */
export const EXPERIENCE_HIGHLIGHTS: ExperienceHighlight[] = [
  {
    id: "korean-bbq",
    title: "Корейский BBQ",
    description: "Готовьте мясо прямо за столом на живом огне — ритуал, а не просто ужин.",
  },
  {
    id: "premium-meat",
    title: "Premium мясо",
    description: "Отборные отрубы говядины и свинины для сочного, насыщенного вкуса.",
  },
  {
    id: "social-dining",
    title: "Social dining",
    description: "Общие блюда и живой гриль создают атмосферу для разговоров и тостов.",
  },
  {
    id: "group-dining",
    title: "Для компаний",
    description: "Просторные столы и VIP-зоны для больших групп и особых поводов.",
  },
  {
    id: "interior",
    title: "Комфортный интерьер",
    description: "Тёплый свет, дерево и латунь — premium атмосфера без лишнего пафоса.",
  },
  {
    id: "entertainment",
    title: "Развлечения",
    description: "После ужина — бильярдный клуб Zodiak в двух шагах от вашего стола.",
  },
];

/** Gallery images for the Restaurant section — see scripts/generate-placeholders.mjs */
export interface RestaurantGalleryImage {
  id: string;
  src: string;
  label: string;
}

export const RESTAURANT_GALLERY: RestaurantGalleryImage[] = [
  { id: "interior", src: "/images/restaurant/interior.svg", label: "Интерьер" },
  { id: "korean-bbq", src: "/images/restaurant/korean-bbq.svg", label: "Korean BBQ" },
  { id: "food", src: "/images/restaurant/food.svg", label: "Блюда" },
  { id: "tables", src: "/images/restaurant/tables.svg", label: "Столы" },
  { id: "vip", src: "/images/restaurant/vip.svg", label: "VIP-зона" },
  { id: "atmosphere", src: "/images/restaurant/atmosphere.svg", label: "Атмосфера" },
];
