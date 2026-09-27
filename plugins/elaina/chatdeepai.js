/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";
import * as cheerio from "cheerio";
import te from "../../src/lib/elaina-error.js";

const pluginConfig = {
  name: ["chatdeepai", "deepaiv2"],
  alias: [],
  category: "elaina",
  description: "Chat DeepAI/DeepSeek tanpa API key",
  usage: ".chatdeepai <pertanyaan>",
  example: ".chatdeepai jelaskan AI",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 8,
  energi: 1,
  isEnabled: true,
};

const pickUA = () =>
  [
    "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/124.0 Mobile Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36",
  ][Math.floor(Math.random() * 2)];

const clientId = () =>
  Array.from({ length: 10 }, () =>
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(
      Math.floor(Math.random() * 62)
    )
  ).join("");

function extractResponse(data) {
  let value = null;
  if (data?.success && data.data) {
    value =
      typeof data.data === "string"
        ? data.data
        : data.data.response ||
          data.data.message ||
          data.data.content ||
          data.data.text ||
          data.data.reply ||
          data.data.answer;
  }
  if (!value && typeof data?.data === "string") value = data.data;
  if (!value && typeof data?.data === "object") {
    value =
      data.data.response ||
      data.data.message ||
      data.data.content ||
      data.data.text;
  }
  value =
    value ||
    data?.response ||
    data?.result ||
    data?.content ||
    data?.answer ||
    data?.text ||
    data?.reply;

  if (typeof value !== "string") return null;
  return value
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function askDeepAI(message) {
  const ua = pickUA();
  let nonce = null;
  let cookies = "";

  for (const page of [
    "https://www.chatdeepai.com/",
    "https://www.chatdeepai.com/chat/",
    "https://www.chatdeepai.com/deepseek/",
  ]) {
    try {
      const res = await axios.get(page, {
        timeout: 15000,
        headers: { "User-Agent": ua, Accept: "text/html,application/xhtml+xml" },
      });

      if (res.headers["set-cookie"]) {
        cookies = res.headers["set-cookie"]
          .map((v) => v.split(";")[0])
          .join("; ");
      }

      const $ = cheerio.load(res.data);
      nonce =
        $("#wpaicg-chatbot-nonce").val() ||
        $('input[name="_wpnonce"]').val() ||
        $('input[name="nonce"]').val();

      if (!nonce) {
        nonce =
          String(res.data).match(/"nonce"\s*:\s*"([^"]+)"/i)?.[1] ||
          String(res.data).match(/data-nonce=["']([^"']+)["']/i)?.[1];
      }
      if (nonce) break;
    } catch {}
  }

  nonce ||= Date.now().toString();

  let lastError = null;
  for (const action of [
    "deepseek_chat",
    "wpaicg_chat_shortcode_message",
    "ai_chat",
    "chatbot_message",
  ]) {
    try {
      const form = new URLSearchParams();
      form.set("action", action);
      form.set("message", message);
      form.set("nonce", nonce);
      form.set("_wpnonce", nonce);
      form.set("stream", "false");
      form.set("max_tokens", "2000");
      form.set("post_id", "2");
      form.set("url", "https://www.chatdeepai.com");
      form.set("bot_id", "0");
      form.set("chatbot_identity", "shortcode");
      form.set("wpaicg_chat_client_id", clientId());

      const { data } = await axios.post(
        "https://www.chatdeepai.com/wp-admin/admin-ajax.php",
        form.toString(),
        {
          timeout: 30000,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": ua,
            Origin: "https://www.chatdeepai.com",
            Referer: "https://www.chatdeepai.com/",
            "X-Requested-With": "XMLHttpRequest",
            Cookie: cookies,
          },
        }
      );

      const result = extractResponse(data);
      if (result) return result;
      lastError = new Error(data?.data?.message || "Tidak ada respons.");
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Tidak ada respons dari ChatDeepAI.");
}

async function handler(m) {
  const text = m.text?.trim();
  if (!text) return m.reply(`🔮 Contoh: ${m.prefix}${m.command} jelaskan apa itu AI`);

  await m.react("⏳");
  try {
    const result = await askDeepAI(text);
    await m.react("✅");
    const output = result.length > 3500 ? `${result.slice(0, 3500)}\n\n_(Dipotong)_` : result;
    return m.reply(`🔮 *CHAT DEEPAI*\n\n${output}`);
  } catch (error) {
    await m.react("❌");
    return m.reply(`❌ *ChatDeepAI Error*\n\n${te(m.prefix, m.command, error?.message || "Gagal mendapatkan jawaban.")}`);
  }
}

export { pluginConfig as config, handler };
