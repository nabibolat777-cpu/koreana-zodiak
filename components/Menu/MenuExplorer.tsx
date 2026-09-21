"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { MENU_CATEGORIES, MENU_ITEMS } from "@/data/menu";
import { MenuCard } from "@/components/MenuCard/MenuCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { clsx } from "@/lib/clsx";
import type { MenuCategoryId } from "@/types";

/**
 * Interactive menu (PRD #12-14): category tabs + free-text filter, backed
 * entirely by data/menu.ts so swapping in a real menu feed later is a
 * one-file change.
 */
export function MenuExplorer() {
  const [category, setCategory] = useState<MenuCategoryId | "all">("all");
  const [query, setQuery] = useState("");

  const items = useMemo(() => {
    let list = MENU_ITEMS;
    if (category !== "all") {
      list = category === "popular" ? list.filter((i) => i.isPopular) : list.filter((i) => i.category === category);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [category, query]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setCategory("all")}
            className={clsx(
              "shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors",
              category === "all"
                ? "border-gold-600 bg-gold-600 text-charcoal-950"
                : "border-charcoal-600 text-warmwhite-dim hover:border-gold-700 hover:text-gold-400"
            )}
          >
            Все
          </button>
          {MENU_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={clsx(
                "shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors",
                category === cat.id
                  ? "border-gold-600 bg-gold-600 text-charcoal-950"
                  : "border-charcoal-600 text-warmwhite-dim hover:border-gold-700 hover:text-gold-400"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <label className="relative shrink-0 sm:w-64">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warmwhite-dim"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Найти блюдо..."
            aria-label="Поиск по меню"
            className="w-full rounded-sm border border-charcoal-600 bg-charcoal-900 py-2 pl-9 pr-3 text-sm text-warmwhite placeholder:text-warmwhite-dim/60 focus-visible:border-gold-600"
          />
        </label>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Ничего не найдено"
          description="Попробуйте другую категорию или измените запрос."
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
