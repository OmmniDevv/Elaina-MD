/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";
import FormData from "form-data";
import te from "../../src/lib/elaina-error.js";

const pluginConfig = {
  name: "susutaro",
  alias: ["taro"],
  category: "canvas",
  description: "Memberikan efek Susu Taro pada gambar",
  usage: ".susutaro <reply image>",
  example: ".susutaro",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const q = m.quoted ? m.quoted : m;
  const isImage = q?.isImage

  if (!isImage) {
    return m.reply(`*SUSU TARO*\n> Reply Gambarnya sambil ketik \`${m.prefix}susutaro\``);
  }

  m.react("🕕");

  try {
    const buffer = await q.download();

    const fd = new FormData();
    fd.append("file", buffer, {
      filename: "img.jpg",
      contentType: "image/jpeg",
    });

    const { data: cdn } = await axios.post(
      "https://cloud.yardansh.com/upload",
      fd,
      { headers: fd.getHeaders() },
    );

    if (!cdn?.url) throw new Error("Upload CDN gagal");

    const api = `https://api.cuki.biz.id/api/canvas/susu-taro?apikey=cuki-x&image=${encodeURIComponent(cdn.url)}`;

    await sock.sendMedia(m.chat, api, null, m, {
      type: "image",
    });

    m.react("✅");
  } catch (error) {
    console.error(error);
    m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
