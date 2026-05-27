export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const body = req.body;

  // Verificación inicial de Slack (URL verification challenge)
  if (body.type === "url_verification") {
    return res.status(200).json({ challenge: body.challenge });
  }

  // Solo procesar eventos de mensajes
  const event = body.event;
  if (!event || event.type !== "message" || event.subtype || event.bot_id) {
    return res.status(200).send("OK");
  }

  // Solo procesar mensajes del canal configurado
  if (event.channel !== process.env.SLACK_CHANNEL_ID) {
    return res.status(200).send("OK");
  }

  // Responder a Slack de inmediato (evitar timeout)
  res.status(200).send("OK");

  // Mencionar a @DrafteVAR en el hilo para que el agente de ChatGPT responda
  await mentionAgentInThread(event);
}

async function mentionAgentInThread(event) {
  const token = process.env.SLACK_BOT_TOKEN;
  const botUserId = process.env.DRAFTEVAR_USER_ID;

  // El thread_ts es el timestamp del mensaje original
  const threadTs = event.thread_ts || event.ts;

  const message = `<@${botUserId}> ${event.text}`;

  await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      channel: event.channel,
      thread_ts: threadTs,
      text: message,
    }),
  });
}
