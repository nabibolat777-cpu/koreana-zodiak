"use client";

import { useEffect } from "react";
import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-32 text-center">
      <WifiOff className="h-10 w-10 text-status-occupied" aria-hidden />
      <p className="font-serif text-2xl text-warmwhite">Connection lost</p>
      <p className="text-sm text-warmwhite-dim">
        Please check your internet connection and try again.
      </p>
      <Button onClick={reset}>Попробовать снова</Button>
    </div>
  );
}
