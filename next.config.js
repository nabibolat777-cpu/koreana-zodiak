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
};

module.exports = nextConfig;
