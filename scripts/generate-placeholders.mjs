#!/usr/bin/env node
/**
 * Generates elegant, on-brand SVG placeholders for menu categories and
 * restaurant gallery photos (PRD #55 — "do not use random unrelated
 * stock imagery; if images are unavailable, create elegant
 * placeholders"). Pure Node, no dependencies — safe to re-run any time
 * categories change.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public", "images");

const PALETTE = {
  bgFrom: "#1b1917",
  bgTo: "#0a0908",
  gold: "#e0bd6f",
  goldDim: "#7d642a",
  burgundy: "#5c1522",
};

function svgWrapper(id, label, glyphPath, viewBoxSize = 64) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="grad-${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${PALETTE.bgFrom}"/>
      <stop offset="100%" stop-color="${PALETTE.bgTo}"/>
    </linearGradient>
    <radialGradient id="glow-${id}" cx="50%" cy="35%" r="60%">
      <stop offset="0%" stop-color="${PALETTE.burgundy}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${PALETTE.burgundy}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="800" height="600" fill="url(#grad-${id})"/>
  <rect width="800" height="600" fill="url(#glow-${id})"/>
  ${Array.from({ length: 6 })
    .map(
      (_, i) =>
        `<line x1="${-100 + i * 180}" y1="600" x2="${200 + i * 180}" y2="0" stroke="${PALETTE.gold}" stroke-opacity="0.05" stroke-width="2"/>`
    )
    .join("\n  ")}
  <rect x="24" y="24" width="752" height="552" fill="none" stroke="${PALETTE.gold}" stroke-opacity="0.25" stroke-width="1.5"/>
  <g transform="translate(400 250)" fill="none" stroke="${PALETTE.gold}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <g transform="translate(${-viewBoxSize / 2} ${-viewBoxSize / 2})">
      ${glyphPath}
    </g>
  </g>
  <text x="400" y="360" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="34" fill="${PALETTE.gold}" letter-spacing="1">${escapeXml(label)}</text>
  <text x="400" y="392" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" letter-spacing="3" fill="${PALETTE.goldDim}">KOREANA BBQ × ZODIAK</text>
</svg>
`;
}

function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Simple line-art glyphs per category (64x64 box), no external icon deps.
const GLYPHS = {
  flame:
    '<path d="M32 4C22 18 14 24 14 38a18 18 0 0 0 36 0c0-8-4-12-8-18 1 8-4 12-8 8 4-8-2-16-2-24z"/>',
  skewer:
    '<line x1="8" y1="56" x2="56" y2="8"/><circle cx="20" cy="44" r="6"/><circle cx="32" cy="32" r="6"/><circle cx="44" cy="20" r="6"/>',
  bowl:
    '<path d="M8 30h48a24 22 0 0 1-48 0z"/><line x1="32" y1="10" x2="32" y2="24"/>',
  leaf: '<path d="M12 52C12 24 36 12 52 12c0 16-12 40-40 40z"/><line x1="16" y1="48" x2="46" y2="18"/>',
  soup: '<path d="M10 28h44l-4 20a10 8 0 0 1-9 8H23a10 8 0 0 1-9-8z"/><path d="M22 28c0-8 4-14 10-16" /><path d="M34 28c0-10 6-16 12-18"/>',
  wok: '<path d="M6 32h52a26 14 0 0 1-52 0z"/><line x1="6" y1="32" x2="-4" y2="26"/><line x1="58" y1="32" x2="68" y2="26"/>',
  roll: '<circle cx="32" cy="32" r="22"/><circle cx="32" cy="32" r="10"/>',
  dessert:
    '<path d="M16 40c0-13 7-24 16-24s16 11 16 24"/><line x1="10" y1="40" x2="54" y2="40"/><line x1="14" y1="48" x2="50" y2="48"/>',
  drink:
    '<path d="M16 10h32l-6 40a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4z"/><line x1="12" y1="10" x2="52" y2="10"/>',
  cue: '<line x1="8" y1="56" x2="46" y2="18"/><circle cx="50" cy="14" r="6"/>',
  photo:
    '<rect x="6" y="14" width="52" height="38" rx="3"/><circle cx="24" cy="30" r="6"/><path d="M6 46l14-14 12 10 10-8 16 14"/>',
};

const MENU_CATEGORY_GLYPHS = {
  popular: GLYPHS.flame,
  "korean-bbq": GLYPHS.skewer,
  appetizers: GLYPHS.bowl,
  salads: GLYPHS.leaf,
  soups: GLYPHS.soup,
  "main-courses": GLYPHS.wok,
  "sushi-rolls": GLYPHS.roll,
  desserts: GLYPHS.dessert,
  drinks: GLYPHS.drink,
};

const MENU_CATEGORY_LABELS = {
  popular: "Популярное",
  "korean-bbq": "Korean BBQ",
  appetizers: "Закуски",
  salads: "Салаты",
  soups: "Супы",
  "main-courses": "Горячее",
  "sushi-rolls": "Суши / Роллы",
  desserts: "Десерты",
  drinks: "Напитки",
};

const RESTAURANT_IMAGES = {
  interior: "Интерьер",
  "korean-bbq": "Korean BBQ",
  food: "Блюда",
  tables: "Столы",
  vip: "VIP-зона",
  atmosphere: "Атмосфера",
};

function run() {
  const menuDir = join(publicDir, "menu");
  const restaurantDir = join(publicDir, "restaurant");
  mkdirSync(menuDir, { recursive: true });
  mkdirSync(restaurantDir, { recursive: true });

  for (const [id, label] of Object.entries(MENU_CATEGORY_LABELS)) {
    const glyph = MENU_CATEGORY_GLYPHS[id] ?? GLYPHS.photo;
    writeFileSync(join(menuDir, `${id}.svg`), svgWrapper(id, label, glyph));
  }

  for (const [id, label] of Object.entries(RESTAURANT_IMAGES)) {
    writeFileSync(join(restaurantDir, `${id}.svg`), svgWrapper(id, label, GLYPHS.photo));
  }

  writeFileSync(
    join(publicDir, "hero-bg.svg"),
    svgWrapper("hero", "Restaurant. BBQ. Billiard.", GLYPHS.cue)
  );

  console.log("Generated placeholder images in public/images/");
}

run();
