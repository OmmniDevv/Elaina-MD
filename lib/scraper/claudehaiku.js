/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import crypto from "node:crypto";

const API = "https://api.overchat.ai/v1/chat/completions";

const ua =
  "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36";

async function ClaudeHaiku(prompt, options = {}) {
  const chatId = options.chatId || crypto.randomUUID();
  const deviceId = options.deviceId || crypto.randomUUID();
  const model = "claude-haiku-4-5-20251001";

  const messages = [
    ...(options.history || []).map((item) => ({
      id: crypto.randomUUID(),
      role: item.role,
      content: item.content,
    })),
    {
      id: crypto.randomUUID(),
      role: "user",
      content: prompt,
    },
    {
      id: crypto.randomUUID(),
      role: "system",
      content: "Ikuti bahasa user dan jawab dengan gaya natural, singkat, dan jelas.",
    },
  ];

  const body = {
    chatId,
    model,
    messages,
    personaId: "claude-haiku-4-5-landing",
    frequency_penalty: 0,
    max_tokens: 4000,
    presence_penalty: 0,
    stream: true,
    temperature: 0.5,
    top_p: 0.95,
  };

  const headers = {
    "sec-ch-ua-platform": `"Android"`,
    "x-device-uuid": deviceId,
    "sec-ch-ua": `"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"`,
    "sec-ch-ua-mobile": "?1",
    "x-device-language": "id-ID",
    "x-device-platform": "web",
    "x-device-version": "1.0.44",
    "user-agent": ua,
    accept: "*/*",
    "content-type": "application/json",
    origin: "https://overchat.ai",
    referer: "https://overchat.ai/",
    "accept-language": "id-ID,id;q=0.9",
    priority: "u=1, i",
  };

  const response = await fetch(API, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    return { status: false, code: response.status, error: text };
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";
  let answer = "";
  let responseId = null;
  let responseModel = null;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line.startsWith("data:")) continue;

      const data = line.slice(5).trim();
      if (!data || data === "[DONE]") continue;

      try {
        const json = JSON.parse(data);
        if (typeof json.id === "string") responseId = json.id;
        if (typeof json.model === "string") responseModel = json.model;

        const content = json.choices?.[0]?.delta?.content;
        if (typeof content === "string") answer += content;
      } catch {}
    }
  }

  return {
    status: true,
    code: response.status,
    question: prompt,
    chatId,
    deviceId,
    responseId,
    model: responseModel || model,
    answer,
  };
}

export { ClaudeHaiku };
