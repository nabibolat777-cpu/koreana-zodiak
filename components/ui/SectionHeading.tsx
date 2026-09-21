import { clsx } from "@/lib/clsx";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={clsx(align === "center" && "text-center", className)}>
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif text-3xl sm:text-4xl text-warmwhite">{title}</h2>
      {subtitle && (
        <p
          className={clsx(
            "mt-3 max-w-2xl text-warmwhite-dim text-base",
            align === "center" && "mx-auto"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
