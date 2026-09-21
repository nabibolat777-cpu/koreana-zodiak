// Static export for GitHub Pages (see .github/workflows/deploy-pages.yml).
// GITHUB_PAGES is only set by that workflow, so `npm run dev`/`npm run
// build` locally keep serving from "/" as before.
const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoName = "koreana-zodiak";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Prototype ships local SVG placeholders only; real photography/CDN
    // can be wired up later without touching component code.
    unoptimized: true,
  },
  output: "export",
  basePath: isGithubPages ? `/${repoName}` : "",
  assetPrefix: isGithubPages ? `/${repoName}/` : "",
  env: {
    // next/image with images.unoptimized doesn't rewrite its `src` through
    // the basePath the way <Link>/the router do, so plain "/images/..."
    // strings (data/*.ts, CSS background-image) need this at hand too —
    // see lib/assetPath.ts.
    NEXT_PUBLIC_BASE_PATH: isGithubPages ? `/${repoName}` : "",
  },
};

module.exports = nextConfig;
