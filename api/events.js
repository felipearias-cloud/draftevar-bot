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

  if (!event || event.type !== "message" || event.subtype || event.bot_id || event.bot_profile) {
    return new Response("OK", { status: 200 });
  }

  const token = process.env.SLACK_BOT_TOKEN;
  const agentId = process.env.DRAFTEVAR_USER_ID;
  const threadTs = event.thread_ts || event.ts;

  const result = await fetch("https://slack.com/api/chat.postMessage", {
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

  const data = await result.json();
  console.log("SLACK RESPONSE:", JSON.stringify(data));

  return new Response("OK", { status: 200 });
}
