export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  let body = req.body;

  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).send("Bad Request");
    }
  }

  if (body && body.type === "url_verification") {
    return res.status(200).json({ challenge: body.challenge });
  }

  const event = body && body.event;

  if (!event || event.type !== "message" || event.subtype || event.bot_id || event.app_id) {
    return res.status(200).send("OK");
  }

  if (event.channel !== process.env.SLACK_CHANNEL_ID) {
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
