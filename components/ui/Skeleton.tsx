import { clsx } from "@/lib/clsx";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={clsx("animate-pulse rounded-md bg-charcoal-700/70", className)}
      aria-hidden
    />
  );
}

export function MenuCardSkeleton() {
  return (
    <div className="rounded-md border border-charcoal-700 bg-charcoal-900 p-3">
      <Skeleton className="mb-3 h-40 w-full" />
      <Skeleton className="mb-2 h-4 w-2/3" />
      <Skeleton className="h-3 w-full" />
    </div>
  );
}

export function TableCardSkeleton() {
  return (
    <div className="rounded-md border border-charcoal-700 bg-charcoal-900 p-4">
      <Skeleton className="mb-3 h-16 w-full" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}
