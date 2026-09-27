/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { Txt2Img2 } from "../../src/scraper/txt2img2.js";

const pluginConfig = {
  name: "text2img4",
  alias: ["t2i2", "imggen2", "flux"],
  category: "ai",
  description: "Buat gambar dari teks pakai Flux Klein 4B",
  usage: ".txt2img2 <deskripsi gambar>",
  example: ".txt2img2 Mobil Lamborghini revuelto",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 30,
  energi: 3,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const text = m.args.join(" ");
  if (!text) {
    m.react("❌");
    return m.reply(
      `🎨 *Text to Image (Flux)*\n\n` +
      `Buat gambar dari deskripsi teks pakai AI Flux Klein 4B.\n\n` +
      `*PENGGUNAAN:*\n` +
      `> *${m.prefix}txt2img2 <deskripsi>*\n\n` +
      `*CONTOH:*\n` +
      `> *${m.prefix}txt2img2 Mobil Lamborghini revuelto*\n` +
      `> *${m.prefix}txt2img2 Kucing lucu pakai topi*\n\n` +
      `_Proses generate agak lama, sekitar 30-60 detik_`
    );
  }

  m.react("🕕");

  try {
    const result = await Txt2Img2(text);

    if (!result.status) {
      m.react("☢");
      return m.reply(`❌ *Generate Gagal*\n\n> ${result.error}`);
    }

    await sock.sendMedia(m.chat, result.url, `🎨 *Flux Klein 4B*\n\n> Prompt: *${result.prompt}*`, m, {
      type: "image",
    });

    m.react("✅");
  } catch (e) {
    console.error(e);
    m.react("☢");
    m.reply("❌ Gagal generate gambar, coba lagi nanti");
  }
}

export { pluginConfig as config, handler };
