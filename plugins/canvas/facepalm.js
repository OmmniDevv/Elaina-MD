/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { createCanvas, loadImage } from "@napi-rs/canvas";
import { downloadMediaMessage, getContentType } from '@rexxhayanasi/elaina-baileys';
import te from "../../src/lib/elaina-error.js";
import axios from "axios";

const pluginConfig = {
  name: "facepalm",
  alias: [],
  category: "canvas",
  description: "Bikin gambar facepalm dari fotomu",
  usage: ".facepalm (reply/kirim foto)",
  example: ".facepalm",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 2,
  isEnabled: true,
};

async function handler(m, { sock }) {
  let media = null;
  const msgObj = m.quoted?.message ? m.quoted : m;
  const type = getContentType(msgObj.message);

  if (!type || type !== "imageMessage") {
    return m.reply(`⚠️ Harap kirim atau reply foto dengan perintah \`${m.prefix}${m.command}\``);
  }
  
  await m.react("🕕");
  
  try {
    media = await downloadMediaMessage(msgObj, "buffer", {});
    if (!media) throw new Error("Gagal membaca media");

    // Mengambil layer overlay secara on the fly dari repository publik terbuka (wabot)
    const overlayUrl = "https://raw.githubusercontent.com/BochilGaming/games-wabot/master/src/image/facepalm.png";
    const layerBuffer = await axios.get(overlayUrl, { responseType: "arraybuffer" }).then(r => r.data);

    const avatar = await loadImage(media);
    const layer = await loadImage(Buffer.from(layerBuffer));

    const canvas = createCanvas(632, 357);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 632, 357);
    ctx.drawImage(avatar, 199, 112, 235, 235);
    ctx.drawImage(layer, 0, 0, 632, 357);

    const buffer = await canvas.encode("png");
    await sock.sendMessage(m.chat, { image: buffer, caption: "🤦‍♂️ *Facepalm*" }, { quoted: m });
    await m.react("✅");

  } catch (err) {
    await m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
