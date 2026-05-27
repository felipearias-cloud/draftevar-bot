export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const body = await req.json().catch(() => ({}));

  if (body.type === "url_verification") {
    return new Response(JSON.stringify({ challenge: body.challenge }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const event = body.event;

  // Ignorar bots, ediciones, y mensajes que ya son respuestas en un hilo
  if (
    !event ||
    event.type !== "message" ||
    event.subtype ||
    event.bot_id ||
    event.bot_profile ||
    event.thread_ts  // Si tiene thread_ts es una respuesta en hilo, no mensaje nuevo
  ) {
    return new Response("OK", { status: 200 });
  }

  const token = process.env.SLACK_BOT_TOKEN;
  const agentId = process.env.DRAFTEVAR_USER_ID;

  await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      channel: event.channel,
      thread_ts: event.ts,
      text: `<!subteam^${agentId}>`,
    }),
  });

  return new Response("OK", { status: 200 });
}
