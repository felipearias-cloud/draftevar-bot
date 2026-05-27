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
  console.log("EVENT FULL:", JSON.stringify(event));

  if (
    !event ||
    event.type !== "message" ||
    event.subtype ||
    event.bot_id ||
    event.bot_profile ||
    event.thread_ts
  ) {
    console.log("FILTERED subtype:", event?.subtype, "bot_id:", event?.bot_id, "thread_ts:", event?.thread_ts);
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
