import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-32 text-center">
      <p className="font-serif text-3xl text-warmwhite">404</p>
      <p className="text-warmwhite-dim">Страница не найдена.</p>
      <Link href="/">
        <Button>На главную</Button>
      </Link>
    </div>
  );
}
