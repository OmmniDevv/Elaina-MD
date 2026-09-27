/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fs from "fs";
import path from "path";
import te from "../../src/lib/elaina-error.js";

const dbFile = path.join(process.cwd(), "database", "hargapanel.json");

function readDb() {
  try {
    if (fs.existsSync(dbFile)) {
      return JSON.parse(fs.readFileSync(dbFile, "utf-8"));
    }
  } catch (e) {}
  return { text: "" };
}

function writeDb(data) {
  try {
    const dir = path.dirname(dbFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
  } catch (e) {}
}

const pluginConfig = {
  name: "hargapanel",
  alias: ["sethargapanel"],
  category: "main",
  description: "Menampilkan dan mengatur daftar harga sewa/beli panel",
  usage: ".hargapanel / .sethargapanel <teks>",
  example: ".sethargapanel RAM 1GB = 1k",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock, isOwner }) {
  const fullText = (m.text || m.body || "").trim();
  const prefix = m.prefix || ".";

  // Cek kalau command-nya sethargapanel
  if (/^[\/.!#]?sethargapanel/i.test(m.command || fullText)) {
    // Proteksi khusus Owner
    const checkOwner = m.isOwner || isOwner;
    if (!checkOwner) {
      await m.react("❌");
      return m.reply("❌ Perintah ini *khusus untuk Owner Bot*!");
    }

    const newText = fullText.replace(/^[\/.!#]?sethargapanel\s*/i, "").trim();
    if (!newText) {
      return m.reply(`❌ Masukkan teksnya juga!\nContoh: \`${prefix}sethargapanel ⭐ PRICE LIST PANEL ⭐\nRAM 1GB -> Rp1.000\``);
    }

    writeDb({ text: newText });
    await m.react("✅");
    return m.reply(`✅ Daftar harga untuk *hargapanel* berhasil diubah!`);
  }

  // --- MEMBER BIASA & OWNER BISA AKSES DENGAN COMMAND .hargapanel ---
  await m.react("⭐");

  try {
    const db = readDb();
    let caption = db.text;

    if (!caption) {
      caption = 
        `⭐ *PRICE LIST PANEL TENDOU* ⭐\n\n` +
        `*RAM 1GB* ➔ *Rp1.000* ✨\n` +
        `*RAM 2GB* ➔ *Rp2.000* ✨\n` +
        `*RAM 3GB* ➔ *Rp3.000* ✨\n` +
        `*RAM 4GB* ➔ *Rp4.000* ✨\n` +
        `*RAM UNLIMITED* ➔ *Rp10.000* ✨\n\n` +
        `📌 *Minat? Chat Owner ya!*\n` +
        `Terima kasih telah menggunakan Tendou Panel ❤️`;
    }

    await m.react("✅");
    return await sock.sendMessage(m.chat, {
      text: caption.trim()
    }, { quoted: m });

  } catch (error) {
    console.error("[Hargapanel Error]:", error?.message);
    await m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
