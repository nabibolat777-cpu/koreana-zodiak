/**
 * Prefixes a root-relative asset path (e.g. "/images/menu/pool.svg") with
 * the app's basePath. Needed because next/image with `images.unoptimized`
 * (static export, see next.config.js) renders `src` as a literal string —
 * unlike <Link>/the router, it does NOT rewrite it under basePath itself.
 */
export function withBasePath(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${basePath}${path}`;
}
