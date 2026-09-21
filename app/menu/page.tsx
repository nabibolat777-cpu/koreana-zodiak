import type { Metadata } from "next";
import { MenuExplorer } from "@/components/Menu/MenuExplorer";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Koreana BBQ Menu — Astana",
};

export default function MenuPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Menu" title="Что попробовать сегодня" className="mb-8" />
      <MenuExplorer />
    </div>
  );
}
