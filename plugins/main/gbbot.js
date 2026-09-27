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

const dbFile = path.join(process.cwd(), "database", "gbbot.json");

function readDb() {
  try {
    if (fs.existsSync(dbFile)) {
      return JSON.parse(fs.readFileSync(dbFile, "utf-8"));
    }
  } catch (e) {}
  return { link: "" };
}

function writeDb(data) {
  try {
    const dir = path.dirname(dbFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
  } catch (e) {}
}

const pluginConfig = {
  name: "gbbot",
  alias: ["botgb", "officialgb", "grupbot", "gcbot", "setgbbot"],
  category: "main",
  description: "Menampilkan dan mengatur link Grup Official Bot",
  usage: ".gbbot / .setgbbot <link>",
  example: ".setgbbot https://chat.whatsapp.com/xxxxxxxxxxxxxxxxxxxx",
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

  // Mode Pengaturan Link Khusus Owner (.setgbbot <link>)
  if (/^[\/.!#]?setgbbot/i.test(m.command || fullText)) {
    const checkOwner = m.isOwner || isOwner;
    if (!checkOwner) {
      await m.react("❌");
      return m.reply("❌ Perintah ini *khusus untuk Owner Bot*!");
    }

    const newLink = fullText.replace(/^[\/.!#]?setgbbot\s*/i, "").trim();
    if (!newLink || !newLink.includes("chat.whatsapp.com")) {
      return m.reply(`❌ Masukkan link grup WhatsApp yang valid!\nContoh: \`${prefix}setgbbot https://whatsapp.com/channel/RIMURU_CHANNEL\``);
    }

    writeDb({ link: newLink });
    await m.react("✅");
    return m.reply(`✅ Link *gbbot* berhasil diperbarui!\n🔗 Link Baru: ${newLink}`);
  }

  // --- MODE TAMPILKAN UNTUK SEMUA USER (.gbbot) ---
  await m.react("🌐");

  try {
    const db = readDb();
    const groupLink = db.link || "https://whatsapp.com/channel/RIMURU_CHANNEL";
    const pushName = m.pushName || "Kak";

    let caption = `╭───〔 🌐 *OFFICIAL COMMUNITY* 〕───\n`;
    caption += `├ 🤖 *Bot Name:* Tendou deluxe\n`;
    caption += `├ 📌 *Status:* Active & Official\n`;
    caption += `╰─────────────────────────\n\n`;
    caption += `Halo Kak *@${m.sender.split("@")[0]}* 👋\n\n`;
    caption += `Grup khusus bot tendou deluxe\n\n`;
    caption += `🔗 *Group Link:*\n${groupLink}\n\n`;
    caption += `⚠️ *Catatan:* Bagi yang mau join tetapi tidak bayar, maka tidak akan gw acc`;

    await m.react("✅");

    return await sock.sendMessage(m.chat, {
      text: caption.trim(),
      mentions: [m.sender]
    }, { quoted: m });

  } catch (error) {
    console.error("[GBBot Error]:", error?.message);
    await m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
