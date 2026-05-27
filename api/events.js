export default async function handler(req, res) {
  const body = req.body || {};

  if (body.type === "url_verification") {
    res.setHeader("Content-Type", "application/json");
    return res.status(200).end(JSON.stringify({ challenge: body.challenge }));
  }

  const event = body.event;

  if (!event || event.type !== "message" || event.subtype || event.bot_id || event.app_id) {
    return res.status(200).send("OK");
  }

  res.status(200).send("OK");
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
