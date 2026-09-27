/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import FormData from "form-data";
import fetch from "node-fetch";
import mime from "mime-types";
import { downloadMediaMessage, getContentType } from '@rexxhayanasi/elaina-baileys';
import te from "../../src/lib/elaina-error.js";

const pluginConfig = {
  name: "gura",
  alias: ["guracanvas"],
  category: "canvas",
  description: "Bikin efek canvas gura dari fotomu",
  usage: ".gura (reply/kirim foto)",
  example: ".gura",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

async function uploadToCatbox(buffer, filename = "file.jpg") {
  const form = new FormData();
  form.append("reqtype", "fileupload");
  form.append("fileToUpload", buffer, {
    filename,
    contentType: mime.lookup(filename) || "image/jpeg",
  });

  const res = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: form,
    headers: form.getHeaders(),
    timeout: 30000,
  });

  if (!res.ok) throw new Error("Catbox gagal");
  const url = await res.text();
  if (!url.startsWith("http")) throw new Error("Invalid response");
  return url;
}

async function handler(m, { sock }) {
  let media = null;

  if (m.quoted?.message) {
    const type = getContentType(m.quoted.message);
    if (!type || type !== "imageMessage") {
      return m.reply("⚠️ Kak, tolong reply ke pesan gambar ya!");
    }
    media = await downloadMediaMessage(m.quoted, "buffer", {});
  } else if (m.message) {
    const type = getContentType(m.message);
    if (!type || type !== "imageMessage") {
      return m.reply(`🦈 *GURA CANVAS*\n\nKirim atau reply foto dengan perintah \`${m.prefix}gura\` untuk memberikan efek Gura!`);
    }
    media = await downloadMediaMessage(m, "buffer", {});
  }

  if (!media) return m.reply("❌ Gagal membaca media, coba lagi!");

  await m.react("🕕");

  try {
    const imgUrl = await uploadToCatbox(media);

    const apiUrl = `https://api.nexray.eu.cc/canvas/gura?url=${encodeURIComponent(imgUrl)}`;
    const res = await fetch(apiUrl);
    
    if (!res.ok) throw new Error("API Nexray error");
    
    const buffer = Buffer.from(await res.arrayBuffer());

    await sock.sendMessage(m.chat, { image: buffer, caption: "🦈 *RAWWRR! Gura is here!*" }, { quoted: m });
    await m.react("✅");

  } catch (err) {
    await m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
