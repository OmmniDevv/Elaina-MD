/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const config = {
  name: "asyntai",
  alias: ["asynt", "asyntai-chat"],
  category: "ai",
  description: "Bercakap-cakap dengan AI dari Asynt AI",
  usage: ".asyntai <pesan>",
  example: ".asyntai Halo, siapa kamu?",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 1,
  isEnabled: true,
};

function generateSessionId() {
  return 'session_' + Math.random().toString(36).substring(2, 12);
}

async function fetchAsyntAI(message, sessionId = null) {
  const currentSessionId = sessionId || generateSessionId();

  const requestData = {
    widget_id: "asyntai_2bcd9dfbae24",
    message: message,
    session_id: currentSessionId
  };

  const response = await fetch("https://asyntai.com/api/widget-chat/", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36',
      'Origin': 'https://asyntai.com',
      'Referer': 'https://asyntai.com/'
    },
    body: JSON.stringify(requestData)
  });

  if (!response.ok) {
    throw new Error(`Gagal terhubung ke server (HTTP ${response.status})`);
  }

  const data = await response.json();
  return data.reply;
}

export async function handler(m, { text, usedPrefix, prefix, command }) {
  const pfx = usedPrefix || prefix || '/';

  // Ambil teks dari argumen atau dari pesan yang di-reply
  let prompt = text?.trim();

  if (!prompt && m.quoted?.text) {
    prompt = m.quoted.text.trim();
  }

  if (!prompt) {
    return m.reply(
      `*Format Salah!*\n\n` +
      `📌 *Cara Penggunaan:*\n` +
      `${pfx}${command} <pertanyaan/pesan>\n\n` +
      `_Contoh:_ ${pfx}${command} Buatkan puisi tentang malam`
    );
  }

  await m.react('⏳');

  try {
    const reply = await fetchAsyntAI(prompt);

    if (!reply) {
      throw new Error("Tidak ada respon dari Asynt AI.");
    }

    await m.reply(reply.trim());
    await m.react('🤖');

  } catch (err) {
    console.error(err);
    await m.react('❌');
    m.reply(`❌ *Terjadi Kesalahan:*\n${err.message || String(err)}`);
  }
}
