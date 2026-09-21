/**
 * DEMO DATA — floor-plan geometry for Zodiak's five rooms, hand-traced
 * from the designer's PDF furniture-layout drawings ("Зодиак SKY мебель",
 * "зодиак КРАСНЫЙ ЗАЛ", "Зодиак РЕСТОРАН_ПУЛ мебель" — pool wing only,
 * "Зодиак Спорт", "зодиак ХЭВЕН ЗАЛ"). Wall outlines, doors and fixed
 * furniture (bar counters, lounges, restrooms, elevator, stairs) are
 * traced by eye against those PDFs, not a precise survey — confirm real
 * table counts/positions on site before this becomes the sole source of
 * truth for the physical layout.
 *
 * Coordinates are in each zone's own SVG viewBox space and are consumed
 * directly by components/BilliardHall/ZoneFloorPlan.tsx. Per-table
 * geometry (which table sits where) lives on each BilliardTable's
 * `position` field in data/tables.ts, keyed by zone via `zone`.
 */
import type { TableZoneKey } from "@/types";

export interface ZoneDoor {
  x: number;
  y: number;
  r: number;
  /** sweep start/end angle in degrees */
  a1: number;
  a2: number;
}

export type ZoneFeatureType =
  | "rect"
  | "circle"
  | "bar"
  | "bar-curve"
  | "lounge"
  | "stairs";

export interface ZoneFeature {
  type: ZoneFeatureType;
  label?: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  cx?: number;
  cy?: number;
  r?: number;
}

export interface ZoneSmallTable {
  x: number;
  y: number;
  w: number;
  h: number;
  rot?: number;
}

export interface ZoneDefinition {
  key: TableZoneKey;
  label: string;
  floor: string;
  note: string;
  /** SVG viewBox, e.g. "0 0 560 720" */
  viewBox: string;
  /** SVG path `d` for the room's wall outline */
  wallPath: string;
  columns?: { x: number; y: number }[];
  doors?: ZoneDoor[];
  features?: ZoneFeature[];
  /** Decorative, non-bookable guest/dining tables shown faintly on the map */
  smallTables?: ZoneSmallTable[];
}

export const ZONES: ZoneDefinition[] = [
  {
    key: "sky",
    label: "SKY",
    floor: "3 этаж",
    note: "Мансардный зал, зонирован портьерами",
    viewBox: "0 0 560 720",
    wallPath:
      "M 70,220 L 70,150 L 250,150 L 250,120 L 370,120 L 370,150 L 400,150 L 400,215 L 465,375 L 480,585 L 460,610 L 505,650 L 505,680 L 460,680 L 425,715 L 155,715 L 100,660 L 100,555 L 70,555 Z",
    columns: [
      { x: 400, y: 255 },
      { x: 433, y: 330 },
    ],
    doors: [
      { x: 250, y: 150, r: 22, a1: 180, a2: 270 },
      { x: 100, y: 565, r: 18, a1: 0, a2: 90 },
    ],
    features: [
      { type: "rect", x: 78, y: 158, w: 95, h: 70, label: "тех. помещение" },
      { type: "rect", x: 180, y: 128, w: 95, h: 80, label: "офис 21,1 м²" },
      { type: "rect", x: 330, y: 625, w: 120, h: 62, label: "караоке" },
      { type: "rect", x: 158, y: 655, w: 60, h: 50, label: "С/У жен" },
      { type: "rect", x: 225, y: 655, w: 60, h: 50, label: "С/У муж" },
      { type: "rect", x: 295, y: 586, w: 44, h: 34, label: "маркер" },
      { type: "rect", x: 408, y: 558, w: 50, h: 54, label: "курилка" },
      { type: "circle", cx: 488, cy: 624, r: 19, label: "лифт" },
      { type: "stairs", x: 440, y: 475, w: 55, h: 70 },
    ],
  },
  {
    key: "red",
    label: "Красный зал",
    floor: "2 этаж",
    note: "Основной зал у лестницы",
    viewBox: "0 0 560 720",
    wallPath:
      "M 85,225 L 85,150 L 265,150 L 415,375 L 440,565 L 460,660 L 400,700 L 355,700 L 320,660 L 130,660 L 85,610 L 85,540 Z",
    columns: [
      { x: 397, y: 300 },
      { x: 470, y: 450 },
      { x: 635, y: 600 },
    ],
    doors: [
      { x: 270, y: 570, r: 20, a1: 180, a2: 270 },
      { x: 470, y: 635, r: 16, a1: 0, a2: 90 },
      { x: 560, y: 660, r: 16, a1: 90, a2: 180 },
    ],
    features: [
      { type: "bar", x: 355, y: 415, w: 100, h: 80, label: "стойка регистрации" },
      { type: "lounge", x: 290, y: 505, w: 100, h: 42, label: "лаунж" },
      { type: "stairs", x: 420, y: 575, w: 55, h: 80 },
    ],
    smallTables: [
      { x: 222, y: 190, w: 36, h: 34 },
      { x: 222, y: 290, w: 36, h: 34 },
      { x: 222, y: 390, w: 36, h: 34 },
      { x: 130, y: 565, w: 36, h: 34 },
    ],
  },
  {
    key: "heaven",
    label: "Хэвен",
    floor: "2 этаж",
    note: "Круглый зал с барной стойкой в центре",
    viewBox: "0 0 620 640",
    wallPath:
      "M 110,290 C 110,220 165,175 230,175 L 350,175 L 470,280 L 545,370 L 545,470 L 500,560 L 430,610 L 420,565 L 350,620 L 220,620 L 130,560 L 90,470 L 90,340 Z",
    doors: [
      { x: 365, y: 190, r: 20, a1: 200, a2: 290 },
      { x: 470, y: 285, r: 16, a1: 30, a2: 120 },
      { x: 520, y: 555, r: 16, a1: 250, a2: 340 },
    ],
    features: [
      { type: "bar-curve", label: "барная стойка" },
      { type: "lounge", x: 150, y: 520, w: 120, h: 44, label: "лаунж" },
    ],
    smallTables: [
      { x: 415, y: 210, w: 32, h: 28, rot: 20 },
      { x: 460, y: 235, w: 32, h: 28, rot: 20 },
      { x: 232, y: 292, w: 28, h: 30 },
      { x: 232, y: 372, w: 28, h: 30 },
      { x: 232, y: 452, w: 28, h: 30 },
    ],
  },
  {
    key: "sport",
    label: "Спорт-бар",
    floor: "1 этаж",
    note: "У входа, совмещён с баром",
    viewBox: "0 0 560 720",
    wallPath:
      "M 75,175 L 75,120 L 250,120 L 250,150 L 310,150 L 310,290 L 435,510 L 440,660 L 555,790 L 555,850 L 460,940 L 240,940 L 120,880 L 75,880 Z",
    columns: [
      { x: 300, y: 340 },
      { x: 300, y: 465 },
      { x: 420, y: 600 },
      { x: 480, y: 680 },
    ],
    doors: [
      { x: 120, y: 890, r: 22, a1: 150, a2: 240 },
      { x: 195, y: 890, r: 22, a1: 270, a2: 0 },
    ],
    features: [
      { type: "rect", x: 80, y: 790, w: 110, h: 90, label: "склад" },
      { type: "bar", x: 355, y: 760, w: 150, h: 80, label: "барная стойка" },
      { type: "stairs", x: 530, y: 730, w: 60, h: 90 },
    ],
  },
  {
    key: "pool",
    label: "Пул",
    floor: "1 этаж",
    note: "Часть комплекса Ресторан/Пул",
    viewBox: "0 0 620 560",
    wallPath:
      "M 300,90 L 460,90 L 560,200 L 560,300 L 500,400 L 340,470 L 260,470 L 120,400 L 60,300 L 60,200 L 160,90 Z",
    doors: [
      { x: 380, y: 95, r: 18, a1: 200, a2: 290 },
      { x: 300, y: 465, r: 18, a1: 70, a2: 160 },
    ],
    features: [
      { type: "rect", x: 75, y: 225, w: 70, h: 44, label: "стойка" },
      { type: "rect", x: 456, y: 250, w: 46, h: 110, label: "кий-стойка" },
    ],
  },
];

export function getZone(key: TableZoneKey): ZoneDefinition {
  const zone = ZONES.find((z) => z.key === key);
  if (!zone) throw new Error(`Unknown zone: ${key}`);
  return zone;
}
