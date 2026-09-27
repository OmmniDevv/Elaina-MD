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
  name: "age-detection",
  alias: ["detectage", "age-detect"],
  category: "tools",
  description: "Deteksi perkiraan usia dari foto",
  usage: ".age-detection (reply gambar)",
  example: ".age-detection",
  isPremium: true,
  cooldown: 30,
  energi: 3,
  isEnabled: true,
};

async function upload(buffer, mimetype) {
  const form = new FormData();
  form.append("cdnFile", buffer, { filename: `age-${Date.now()}.jpg`, contentType: mimetype || "image/jpeg" });
  const res = await axios.post("https://aliceecdn.vercel.app/upload", form, { headers: form.getHeaders(), timeout: 60000 });
  if (!res.data?.url) throw new Error("Upload gagal");
  return res.data.url;
}

async function handler(m) {
  if (!m.quoted || !/image\//i.test(String(m.quoted.mimetype || ""))) return m.reply(`Reply foto lalu gunakan *${m.prefix}${m.command}*.`);
  const key = config.aquaApi?.freeRestApiKey || "";
  if (!key) return m.reply("❌ API key Aqua belum diisi di config.js (aquaApi.freeRestApiKey).");

  await m.react("🕕");
  try {
    const buffer = await m.quoted.download();
    const url = await upload(buffer, m.quoted.mimetype);
    const { data } = await axios.get("https://free-restapi.biz.id/api/age-detection", { params: { url, apikey: key }, timeout: 60000 });
    const age = data?.result?.age ?? data?.data?.result?.age;
    if (age == null) throw new Error("Usia tidak ditemukan");
    await m.react("✅");
    return m.reply(`👤 *Hasil Deteksi Umur*\n\n📸 Perkiraan usia: *${age} tahun*`);
  } catch (e) {
    console.error("[AQUA-AGE]", e?.message || e);
    await m.react("❌").catch(() => {});
    return m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
