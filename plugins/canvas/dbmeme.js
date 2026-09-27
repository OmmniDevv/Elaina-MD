/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

// plugins/dbmeme.js
const pluginConfig = {
  name: "dbmeme",
  alias: ['distractedboy', 'dbm', 'memedb'],
  category: "canvas",
  description: "Membuat meme 'Distracted Boyfriend' dengan 3 teks custom",
  usage: ".dbmeme <text1> | <text2> | <text3>",
  example: ".dbmeme Ah tu cewe cakep | Hei kamu ngeliatin kemana | tu cowo ngeliatin gw",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

const API_BASE = "https://api.synoxcloud.xyz/canvas/distracted-boy-meme";
const API_KEY = "FREE";

async function handler(m, ctx = {}) {
  const conn = ctx.conn || ctx.client || ctx.sock || m?.conn || m?.client;
  const usedPrefix = ctx.usedPrefix ?? ctx.prefix ?? m?.prefix ?? ".";
  const command = ctx.command ?? ctx.cmd ?? m?.command ?? "dbmeme";

  try {
    // Ambil teks dari berbagai sumber
    let text =
      (ctx.text ?? ctx.body ?? m?.text ?? m?.body ?? "").trim() ||
      (ctx.args ? ctx.args.join(" ") : "");

    // Buang prefix + command dari awal
    if (text.startsWith(usedPrefix)) text = text.slice(usedPrefix.length);
    const parts = text.split(/\s+/);
    if (parts[0]?.toLowerCase() === command.toLowerCase()) parts.shift();
    text = parts.join(" ").trim();

    if (!text) {
      return m.reply(
        `🎨 *Distracted Boyfriend Meme*\n\n` +
        `*Cara pakai:*\n` +
        `${usedPrefix}${command} <text1> | <text2> | <text3>\n\n` +
        `*Keterangan:*\n` +
        `• text1 = tulisan di cewek\n` +
        `• text2 = tulisan di cowok\n` +
        `• text3 = tulisan di cewek yang dipegang\n\n` +
        `*Contoh:*\n` +
        `${usedPrefix}${command} Cewe cakep | Kamu ngeliatin kemana | Naksir ya?`
      );
    }

    // Split dengan pemisah "|"
    const splitArr = text.split("|").map((s) => s.trim()).filter(Boolean);

    if (splitArr.length < 3) {
      return m.reply(
        `⚠️ *Format salah!*\n\n` +
        `Harus 3 teks dipisah dengan *|*\n\n` +
        `*Contoh:*\n` +
        `${usedPrefix}${command} text1 | text2 | text3`
      );
    }

    const [text1, text2, text3] = splitArr;

    await m.reply("🎨 Membuat meme, mohon tunggu...");

    const url =
      `${API_BASE}?text1=${encodeURIComponent(text1)}` +
      `&text2=${encodeURIComponent(text2)}` +
      `&text3=${encodeURIComponent(text3)}` +
      `&apikey=${API_KEY}`;

    const res = await fetch(url, { method: "GET" });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

    const contentType = res.headers.get("content-type") || "";

    let buffer;
    if (contentType.includes("application/json")) {
      // Beberapa API canvas mengembalikan JSON berisi URL gambar
      const json = await res.json();
      const imgUrl =
        json?.result?.url ||
        json?.result ||
        json?.url ||
        json?.data?.url ||
        json?.data;
      if (typeof imgUrl !== "string" || !/^https?:\/\//.test(imgUrl)) {
        throw new Error("Response JSON tidak mengandung URL gambar.");
      }
      const imgRes = await fetch(imgUrl);
      if (!imgRes.ok) throw new Error(`Gagal unduh gambar: ${imgRes.status}`);
      buffer = Buffer.from(await imgRes.arrayBuffer());
    } else if (contentType.startsWith("image/") || contentType === "application/octet-stream") {
      buffer = Buffer.from(await res.arrayBuffer());
    } else {
      // Fallback: coba baca sebagai buffer
      const ab = await res.arrayBuffer();
      buffer = Buffer.from(ab);
      if (!buffer.length) throw new Error("Response kosong.");
    }

    if (!buffer || !buffer.length) {
      throw new Error("Gambar kosong atau gagal diunduh.");
    }

    await conn.sendMessage(
      m.chat,
      {
        image: buffer,
        caption:
          `🎨 *Distracted Boyfriend Meme*\n\n` +
          `1️⃣ ${text1}\n` +
          `2️⃣ ${text2}\n` +
          `3️⃣ ${text3}`,
      },
      { quoted: m }
    );
  } catch (err) {
    console.error("[dbmeme] error:", err);
    try {
      await m.reply(`❌ Gagal membuat meme:\n${err.message || err}`);
    } catch (_) {}
  }
}

export { pluginConfig as config, handler };
export default { config: pluginConfig, handler };