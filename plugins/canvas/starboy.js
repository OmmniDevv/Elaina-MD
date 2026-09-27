/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import te from "../../src/lib/elaina-error.js";
import config from "../../config.js";
import axios from "axios";
import { uploadImage } from "../../src/lib/elaina-uploader.js";

const pluginConfig = {
  name: "starboy",
  alias: ["canvasstarboy", "efekstarboy"],
  category: "canvas",
  description: "Buat gambar efek Starboy dari foto",
  usage: ".starboy <reply/kirim foto>",
  example: ".starboy",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock }) {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";

  if (!mime.startsWith("image/")) {
    return m.reply(
      `🌟 *S T A R B O Y*\n\n> Kirim gambar dengan caption *${m.prefix + m.command}* atau balas gambar yang sudah dikirim.`,
    );
  }

  m.react("🕕");

  try {
    const media = await q.download();
    if (!media) throw new Error("Gagal mengunduh media");

    const imageUrl = await uploadImage(media);
    if (!imageUrl) throw new Error("Gagal mengunggah gambar");

    const url = `https://api.cuki.biz.id/api/canvas/starboy?apikey=${config.APIkey.cuki}&image=${encodeURIComponent(imageUrl)}`;
    
    const { data } = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 30000
    });

    const imageBuffer = Buffer.from(data, 'binary');

    m.react("✅");
    await sock.sendMessage(m.chat, { 
      image: imageBuffer, 
      caption: `🌟 *S T A R B O Y*` 
    }, { quoted: m });
  } catch (error) {
    console.log(error);
    m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
