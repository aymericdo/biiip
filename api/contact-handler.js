const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(payload));
}

export async function sendContactToDiscord({ email, source, webhookUrl }) {
  const cleanEmail = typeof email === "string" ? email.trim() : "";
  if (!webhookUrl) return { statusCode: 503, payload: { error: "Discord webhook is not configured" } };
  if (!emailPattern.test(cleanEmail)) return { statusCode: 400, payload: { error: "A valid email is required" } };

  const discordResponse = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "Biip",
      content: "Nouvelle demande depuis la landing page Biip.",
      embeds: [{
        title: "Une personne veut son Biip",
        color: 13172567,
        fields: [
          { name: "Email", value: cleanEmail, inline: false },
          { name: "Source", value: typeof source === "string" ? source : "biip-landing", inline: false },
        ],
        timestamp: new Date().toISOString(),
      }],
    }),
  });

  if (!discordResponse.ok) return { statusCode: 502, payload: { error: "Discord webhook request failed" } };
  return { statusCode: 200, payload: { ok: true } };
}
