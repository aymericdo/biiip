import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

function normalizeSiteUrl(rawUrl) {
  if (!rawUrl) return "https://portailuniversel.fr";
  try { const url = new URL(rawUrl); url.pathname = "/"; url.search = ""; url.hash = ""; return url.toString().replace(/\/$/, ""); }
  catch { return "https://portailuniversel.fr"; }
}

const siteUrl = normalizeSiteUrl(process.env.VITE_SITE_URL || process.env.SITE_URL || process.env.URL);
const distDir = path.resolve("dist");
const today = new Date().toISOString().slice(0, 10);
await mkdir(distDir, { recursive: true });
await Promise.all([
  writeFile(path.join(distDir, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`),
  writeFile(path.join(distDir, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteUrl}/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>\n</urlset>\n`),
]);
