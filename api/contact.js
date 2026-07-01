import { sendContactToDiscord, sendJson } from "./contact-handler.js";

export default async function handler(request, response) {
  if (request.method === "OPTIONS") { response.statusCode = 204; response.end(); return; }
  if (request.method !== "POST") { sendJson(response, 405, { error: "Method not allowed" }); return; }

  const result = await sendContactToDiscord({
    email: request.body?.email,
    source: request.body?.source,
    webhookUrl: process.env.DISCORD_WEBHOOK_URL,
  });
  sendJson(response, result.statusCode, result.payload);
}
