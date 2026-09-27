/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";
import FormData from "form-data";
import config from "../../config.js";
import te from "../../src/lib/elaina-error.js";

const pluginConfig = {
  name: "talkingphoto",
  alias: ["talkphoto"],
  category: "ai",
  description: "Mengubah foto menjadi talking photo/video",
  usage: ".talkingphoto <teks> | woman1|woman2|man1|man2 (reply gambar)",
  example: ".talkingphoto aku adalah asisten AI | woman1",
  isPremium: true,
  cooldown: 60,
  energi: 3,
  isEnabled: true,
};

async function uploadToAlice(buffer, mimetype = "image/jpeg") {
  const form = new FormData();
  form.append("cdnFile", buffer, {
    filename: `talking-${Date.now()}.jpg`,
    contentType: mimetype,
  });
  const res = await axios.post("https://aliceecdn.vercel.app/upload", form, {
    headers: form.getHeaders(),
    timeout: 60000,
  });
  if (!res.data?.url) throw new Error("Upload gambar gagal");
  return res.data.url;
}

async function handler(m, { sock }) {
  const quoted = m.quoted;
  if (!/image\//i.test(String(quoted?.mimetype || m.mimetype || ""))) {
    return m.reply(`🖼️ Reply/kirim gambar lalu gunakan *${m.prefix}${m.command} teks | woman1*.`);
  }

  let text = m.args?.join(" ").trim() || "";
  let voice = "woman1";
  const voiceMatch = text.match(/\|\s*(woman1|woman2|man1|man2)\s*$/i);
  if (voiceMatch) {
    voice = voiceMatch[1].toLowerCase();
    text = text.replace(/\|\s*(woman1|woman2|man1|man2)\s*$/i, "").trim();
  }
  if (!text) return m.reply("Masukkan teks yang akan dibacakan.");

  const key = config.aquaApi?.freeRestApiKey || "";
  if (!key) return m.reply("❌ API key Aqua belum diisi di config.js (aquaApi.freeRestApiKey).");

  await m.react("🕕");
  try {
    const buffer = await quoted.download();
    const imageUrl = await uploadToAlice(buffer, quoted.mimetype);
    const res = await axios.get("https://free-restapi.biz.id/api/talkingphoto", {
      params: { url: imageUrl, text, voice, apikey: key },
      responseType: "arraybuffer",
      timeout: 180000,
    });
    const video = Buffer.from(res.data);
    if (!video.length) throw new Error("Video hasil kosong");
    await sock.sendMessage(m.chat, { video, mimetype: "video/mp4", caption: `✅ Talking Photo\n🎤 Voice: ${voice}` }, { quoted: m });
    await m.react("✅");
  } catch (e) {
    console.error("[AQUA-TALKINGPHOTO]", e?.message || e);
    await m.react("❌").catch(() => {});
    return m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
