export default async function handler(req, res) {
  const body = req.body || {};

  // Verificación de Slack
  if (body.type === "url_verification") {
    res.setHeader("Content-Type", "application/json");
    return res.status(200).end(JSON.stringify({ challenge: body.challenge }));
  }

  const event = body.event;

  // Ignorar bots y ediciones
  if (!event || event.type !== "message" || event.subtype || event.bot_id || event.app_id) {
    return res.status(200).send("OK");
  }

  // Solo el canal configurado
  if (event.channel !== process.env.SLACK_CHANNEL_ID) {
    return res.status(200).send("OK");
  }

  // Responder a Slack de inmediato
  res.status(200).send("OK");

  // Mencionar al agente en el hilo
  await mentionAgent(event);
}

async function mentionAgent(event) {
  const token = process.env.SLACK_BOT_TOKEN;
  const agentId = process.env.DRAFTEVAR_USER_ID;
  const threadTs = event.thread_ts || event.ts;

  await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      channel: event.channel,
      thread_ts: threadTs,
      text: `<@${agentId}> ${event.text}`,
    }),
  });
}
