import { MenuCardSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 px-4 py-16 sm:px-6 md:grid-cols-4 lg:px-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <MenuCardSkeleton key={i} />
      ))}
    </div>
  );
}
