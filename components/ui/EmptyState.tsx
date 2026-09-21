import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-charcoal-600 bg-charcoal-900/50 px-6 py-14 text-center">
      <p className="font-serif text-xl text-warmwhite">{title}</p>
      {description && <p className="max-w-sm text-sm text-warmwhite-dim">{description}</p>}
      {action}
    </div>
  );
}
