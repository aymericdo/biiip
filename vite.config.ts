import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type HtmlTagDescriptor, type Plugin } from "vite";
import { faqItems, seoDescription as description, seoTitle as title } from "./src/seo-content";


function normalizeSiteUrl(rawUrl?: string) {
  if (!rawUrl) return "https://portailuniversel.fr";
  try { const url = new URL(rawUrl); url.pathname = "/"; url.search = ""; url.hash = ""; return url.toString().replace(/\/$/, ""); }
  catch { return "https://portailuniversel.fr"; }
}

function seoPlugin(siteUrl: string): Plugin {
  const canonicalUrl = `${siteUrl}/`;
  const imageUrl = `${siteUrl}/biip-product.png`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${canonicalUrl}#website`,
        name: "Biip",
        alternateName: ["Bip portail", "Biiip"],
        url: canonicalUrl,
        inLanguage: "fr-FR",
      },
      {
        "@type": "Product",
        "@id": `${canonicalUrl}#product`,
        name: "Biip, boîtier universel pour portail",
        alternateName: ["Bip portail universel", "Biiip portail"],
        category: "Boîtier connecté pour portail",
        description,
        url: canonicalUrl,
        image: imageUrl,
        brand: { "@type": "Brand", name: "Biip" },
        offers: [
          { "@type": "Offer", priceCurrency: "EUR", price: "5", description: "Abonnement mensuel" },
          { "@type": "Offer", priceCurrency: "EUR", price: "200", description: "Accès à vie" },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        mainEntity: faqItems.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
    ],
  };
  const tags: HtmlTagDescriptor[] = [
    { tag: "link", attrs: { rel: "canonical", href: canonicalUrl } },
    { tag: "meta", attrs: { name: "robots", content: "index, follow, max-image-preview:large" } },
    { tag: "meta", attrs: { property: "og:type", content: "website" } },
    { tag: "meta", attrs: { property: "og:locale", content: "fr_FR" } },
    { tag: "meta", attrs: { property: "og:title", content: title } },
    { tag: "meta", attrs: { property: "og:description", content: description } },
    { tag: "meta", attrs: { property: "og:url", content: canonicalUrl } },
    { tag: "meta", attrs: { property: "og:image", content: imageUrl } },
    { tag: "meta", attrs: { name: "twitter:card", content: "summary_large_image" } },
    { tag: "meta", attrs: { name: "twitter:title", content: title } },
    { tag: "meta", attrs: { name: "twitter:description", content: description } },
    { tag: "meta", attrs: { name: "twitter:image", content: imageUrl } },
    { tag: "script", attrs: { type: "application/ld+json" }, children: JSON.stringify(data) },
  ].map((tag) => ({ ...tag, injectTo: "head" }));
  return { name: "biip-seo", transformIndexHtml(html) { return { html: html.replace(/<title>.*<\/title>/, `<title>${title}</title>`).replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/, `<meta name="description" content="${description}" />`), tags }; } };
}

function readBody(request: import("node:http").IncomingMessage) {
  return new Promise<Record<string, unknown>>((resolve, reject) => { let body = ""; request.on("data", (chunk) => { body += chunk; }); request.on("end", () => { try { resolve(body ? JSON.parse(body) : {}); } catch (error) { reject(error); } }); request.on("error", reject); });
}

function contactApiPlugin(webhookUrl?: string): Plugin {
  return { name: "biip-contact-api-dev", configureServer(server) { server.middlewares.use("/api/contact", async (request, response) => { const { sendContactToDiscord, sendJson } = await import("./api/contact-handler.js"); if (request.method !== "POST") { sendJson(response, 405, { error: "Method not allowed" }); return; } try { const body = await readBody(request); const result = await sendContactToDiscord({ email: body.email, source: body.source, webhookUrl }); sendJson(response, result.statusCode, result.payload); } catch { sendJson(response, 400, { error: "Invalid JSON payload" }); } }); } };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return { base: "./", plugins: [react(), seoPlugin(normalizeSiteUrl(env.VITE_SITE_URL || env.SITE_URL || env.URL)), contactApiPlugin(env.DISCORD_WEBHOOK_URL)] };
});
