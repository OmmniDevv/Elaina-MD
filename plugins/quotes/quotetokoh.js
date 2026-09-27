/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import te from "../../src/lib/elaina-error.js";

const config = {
  name: "quotetokoh",
  alias: ["katatokoh", "quotes", "quotestokoh", "katabijak"],
  category: "quotes",
  description: "Mendapatkan kata-kata bijak / quote acak dari tokoh terkenal",
  usage: ".quotetokoh",
  example: ".quotetokoh",
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

const API_URL = "https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/tokoh-quotes.json";

function normalizeQuotes(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.quotes)) return data.quotes;
  if (Array.isArray(data.result)) return data.result;
  if (Array.isArray(data.data)) return data.data;
  return [];
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

async function handler(m, { sock }) {
  m.react("💬");

  try {
    const res = await fetch(API_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json,text/plain,*/*"
      }
    });

    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);

    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      throw new Error("Gagal memproses data JSON");
    }

    const quotes = normalizeQuotes(json);
    const selected = pickRandom(quotes);

    if (!selected) {
      m.react("❌");
      return m.reply("❌ Tidak ada quote yang ditemukan.");
    }

    const quoteText = selected.quote || selected.text || selected.kata || "Tidak ada teks quote.";
    const figureName = selected.figure || selected.author || selected.name || selected.tokoh || "Anonim";
    const figureImage = selected.image || selected.img || selected.avatar || null;

    let caption = `💬 *QUOTES TOKOH*\n\n`;
    caption += `_"${quoteText}"_\n\n`;
    caption += `— *${figureName}*`;

    m.react("✨");

    // Jika JSON menyediakan URL foto/gambar tokoh, kirim berupa gambar
    if (figureImage && typeof figureImage === "string" && figureImage.startsWith("http")) {
      await sock.sendMessage(m.chat, {
        image: { url: figureImage },
        caption: caption
      }, { quoted: m });
    } else {
      await m.reply(caption);
    }

  } catch (e) {
    console.error(e);
    m.react("❌");

    if (typeof te === "function") {
      m.reply(te(m.prefix, m.command, m.pushName));
    } else {
      m.reply("❌ Terjadi kesalahan saat mengambil quote tokoh.");
    }
  }
}

export { config, handler };
