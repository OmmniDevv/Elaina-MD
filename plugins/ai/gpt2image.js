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
  name: "gpt2image",
  alias: ["gptimg2img", "image2image"],
  category: "ai",
  description: "Image-to-image memakai GPT2Image",
  usage: ".gpt2image <prompt> (reply gambar)",
  example: ".gpt2image ubah jadi style anime",
  isPremium: true,
  cooldown: 60,
  energi: 3,
  isEnabled: true,
};

async function upload(buffer, mimetype) {
  const form = new FormData();
  form.append("cdnFile", buffer, { filename: `gpt2img-${Date.now()}.jpg`, contentType: mimetype || "image/jpeg" });
  const res = await axios.post("https://aliceecdn.vercel.app/upload", form, { headers: form.getHeaders(), timeout: 60000 });
  if (!res.data?.url) throw new Error("Upload gagal");
  return res.data.url;
}

async function handler(m, { sock }) {
  if (!m.quoted || !/image\//i.test(String(m.quoted.mimetype || ""))) {
    return m.reply(`🖼️ Reply gambar dengan *${m.prefix}${m.command} prompt*.`);
  }
  const prompt = m.args?.join(" ").trim();
  if (!prompt) return m.reply("Masukkan prompt.");
  const key = config.aquaApi?.freeRestApiKey || "";
  if (!key) return m.reply("❌ API key Aqua belum diisi di config.js (aquaApi.freeRestApiKey).");

  await m.react("🕕");
  try {
    const buffer = await m.quoted.download();
    const url = await upload(buffer, m.quoted.mimetype);
    const { data } = await axios.get("https://free-restapi.biz.id/api/gpt2image", {
      params: { url, prompt, apikey: key },
      timeout: 180000,
    });
    const imageUrl = data?.result?.url || data?.result?.image || data?.url || data?.image;
    if (!imageUrl) throw new Error("API tidak mengembalikan URL gambar");
    await sock.sendMessage(m.chat, { image: { url: imageUrl }, caption: `✨ GPT2Image\nPrompt: ${prompt}` }, { quoted: m });
    await m.react("✅");
  } catch (e) {
    console.error("[AQUA-GPT2IMAGE]", e?.message || e);
    await m.react("❌").catch(() => {});
    return m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
