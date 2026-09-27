/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { live3d } from "../../src/scraper/seaart.js";
const pluginConfig = {
  name: "rimurubanana",
  alias: [],
  category: "ai",
  description: "Edit gambar dengan AI menggunakan prompt",
  usage: ".rimurubanana <prompt>",
  example: ".rimurubanana make it anime style",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 30,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const prompt = m.args.join(" ");
  if (!prompt) {
    return m.reply(
      `🍌 *RIMURU BANANA SUPER*\n\n` +
        `> Edit gambar dengan AI\n\n` +
        `\`Contoh: ${m.prefix}rimurubanana make it anime style\`\n\n` +
        `> Reply atau kirim gambar dengan caption`,
    );
  }

  const isImage = m.isImage || (m.quoted && m.quoted.isImage);
  if (!isImage) {
    return m.reply(
      `🍌 *ɴᴀɴᴏ ʙᴀɴᴀɴᴀ*\n\n> Reply atau kirim gambar dengan caption`,
    );
  }

  m.react("🕕");

  try {
    let mediaBuffer;
    if (m.isImage && m.download) {
      mediaBuffer = await m.download();
    } else if (m.quoted && m.quoted.isImage && m.quoted.download) {
      mediaBuffer = await m.quoted.download();
    }

    if (!mediaBuffer || !Buffer.isBuffer(mediaBuffer)) {
      m.react("❌");
      return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Gagal mengunduh gambar`);
    }

    const resultBuffer = await live3d(mediaBuffer, prompt).then(
      (res) => res.image,
    );

    m.react("✅");

    await sock.sendMedia(m.chat, resultBuffer, null, m, {
      type: "image",
    });
  } catch (error) {
    console.log(error);
    m.react("❌");
    m.reply(`🍀 *Waduhh, sepertinya ini ada kendala*
Silahkan coba lagi nanti, dimohon jangan spam`);
  }
}

export { pluginConfig as config, handler };