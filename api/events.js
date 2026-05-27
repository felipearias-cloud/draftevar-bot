export const config = {
  runtime: 'edge',
};

const WORKFLOW_ID = "Wf0B59QZPE04";

export default async function handler(req) {
  const body = await req.json().catch(() => ({}));

  if (body.type === "url_verification") {
    return new Response(JSON.stringify({ challenge: body.challenge }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const event = body.event;

  // Solo responder a mensajes del workflow específico
  if (!event || event.workflow_id !== WORKFLOW_ID) {
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
