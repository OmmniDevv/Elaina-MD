/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import gemini from "./gemini.js";

function buildMessage({ message, history = [], imageBuffer = null }) {
  const parts = [];

  if (Array.isArray(history) && history.length > 0) {
    const historyText = history
      .slice(-10)
      .map((item) => {
        const role = item?.role === "assistant" ? "Assistant" : "User";
        const content = String(item?.content || "").trim();
        return content ? `${role}: ${content}` : "";
      })
      .filter(Boolean)
      .join("\n");

    if (historyText) {
      parts.push(`Riwayat percakapan:\n${historyText}`);
    }
  }

  if (imageBuffer) {
    parts.push(
      "User mengirim gambar. Jika model tidak bisa melihat gambar secara langsung, tetap jawab sebaik mungkin dari konteks teks yang ada.",
    );
  }

  parts.push(String(message || "").trim());

  return parts.filter(Boolean).join("\n\n").trim();
}

async function chat({
  message,
  instruction = "",
  imageBuffer = null,
  history = [],
} = {}) {
  const result = await gemini({
    message: buildMessage({ message, history, imageBuffer }),
    instruction,
  });

  return {
    text: result.text,
    raw: result.raw || result.text,
    model: result.model || "gemini",
    sessionId: result.sessionId || null,
  };
}

export { chat };
