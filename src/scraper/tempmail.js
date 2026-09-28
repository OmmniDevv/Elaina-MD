/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";

function generateCORS(length = 15) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++)
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}

function buildHeaders() {
  return {
    "Content-Type": "application/json",
    "Application-Name": "web",
    "Application-Version": "4.0.0",
    "X-CORS-Header": generateCORS(),
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    Referer: "https://temp-mail.io/",
  };
}

async function TempMailCreate() {
  try {
    const response = await axios.post(
      "https://api.internal.temp-mail.io/api/v3/email/new",
      { min_name_length: 10, max_name_length: 12 },
      { headers: buildHeaders() },
    );
    return { status: true, email: response.data.email };
  } catch (e) {
    return { status: false, error: e.message };
  }
}

async function TempMailInbox(email) {
  try {
    const response = await axios.get(
      `https://api.internal.temp-mail.io/api/v3/email/${email}/messages`,
      { headers: buildHeaders() },
    );
    const messages = response.data || [];
    return { status: true, email, count: messages.length, messages };
  } catch (e) {
    return { status: false, error: e.message };
  }
}

export { TempMailCreate, TempMailInbox };
