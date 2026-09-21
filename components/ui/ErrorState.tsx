import { AlertTriangle } from "lucide-react";

export function ErrorState({
  title = "Что-то пошло не так",
  description = "Попробуйте ещё раз.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-md border border-status-occupied/40 bg-status-occupied/10 px-4 py-3 text-sm text-warmwhite"
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-status-occupied" aria-hidden />
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-warmwhite-dim">{description}</p>
      </div>
    </div>
  );
}
