/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";
import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import path from "node:path";
import config from "../../config.js";
import te from "../../src/lib/elaina-error.js";

const pluginConfig = {
  name: "lobbyff",
  alias: ["fflobby", "freefirelobby"],
  category: "maker",
  description: "Membuat gambar lobby Free Fire dengan 22 template Aqua",
  usage: ".lobbyff <1-22|random>|<nama>",
  example: ".lobbyff random|Jagoan FF",
  isPremium: false,
  cooldown: 15,
  energi: 2,
  isEnabled: true,
};

const TEMPLATES = [
  "https://cloud-fukushima.vercel.app/uploader/8fjhd6ftps.jpg",
  "https://cloud-fukushima.vercel.app/uploader/oz8hb4ow75.jpg",
  "https://cloud-fukushima.vercel.app/uploader/tvz1cie8df.jpg",
  "https://cloud-fukushima.vercel.app/uploader/yo9sg4vmo3.jpg",
  "https://i.ibb.co/twtSvQXv/image.jpg",
  "https://i.ibb.co/n80Bc1wV/image.jpg",
  "https://i.ibb.co/mCwmt019/image.jpg",
  "https://i.ibb.co/JwG60TwF/image.jpg",
  "https://i.ibb.co/zWNLw6bV/image.jpg",
  "https://i.ibb.co/d4DvnHw6/image.jpg",
  "https://i.ibb.co/hxMGbx9v/image.jpg",
  "https://i.ibb.co/jvd5xfvK/image.jpg",
  "https://i.ibb.co/KxTQ0r0x/image.jpg",
  "https://i.ibb.co/rRyxvrJW/image.jpg",
  "https://i.ibb.co/PG5jwG6S/image.jpg",
  "https://i.ibb.co/MDdH7kjG/image.jpg",
  "https://i.ibb.co/6cnHvL31/image.jpg",
  "https://i.ibb.co/dwg4CGdf/image.jpg",
  "https://i.ibb.co/pvx1PZyW/image.jpg",
  "https://i.ibb.co/kVkbxhwg/image.jpg",
  "https://i.ibb.co/rK8ZTPbt/image.jpg",
  "https://i.ibb.co/vC3p8NjP/image.jpg",
];

let fontReady = false;
function ensureFont() {
  if (fontReady) return;
  const fontPath = path.resolve("./assets/fonts/AGENCYB.TTF");
  try {
    GlobalFonts.registerFromPath(fontPath, "AGENCYB");
  } catch (e) {
    console.warn("[AQUA-LOBBYFF] Font register gagal, memakai fallback.");
  }
  fontReady = true;
}

async function handler(m, { sock }) {
  const text = m.args?.join(" ").trim() || "";
  if (!text.includes("|")) return m.reply(`🎮 *FREE FIRE LOBBY MAKER*\n\nContoh:\n${m.prefix}${m.command} 1|Jagoan FF\n${m.prefix}${m.command} random|Jagoan FF\n\nTemplate: 1 - 22 atau random`);

  let [numStr, name] = text.split("|");
  numStr = String(numStr || "").trim().toLowerCase();
  name = String(name || "").trim();
  if (!name) return m.reply("Masukkan nama.");

  const num = numStr === "random" ? Math.floor(Math.random() * TEMPLATES.length) + 1 : Number(numStr);
  if (!Number.isInteger(num) || num < 1 || num > TEMPLATES.length) return m.reply("Template tidak valid. Gunakan 1-22 atau random.");

  await m.react("🕕");
  try {
    ensureFont();
    const response = await axios.get(TEMPLATES[num - 1], { responseType: "arraybuffer", timeout: 60000 });
    const base = await loadImage(Buffer.from(response.data));
    const canvas = createCanvas(base.width, base.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(base, 0, 0, base.width, base.height);

    const ratio = name.length <= 6 ? 0.055 : name.length <= 10 ? 0.045 : name.length <= 15 ? 0.038 : 0.030;
    const fontSize = Math.max(18, Math.round(base.width * ratio));
    ctx.font = `${fontSize}px AGENCYB, Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = Math.max(2, Math.round(fontSize / 18));
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#ffff00";
    const x = base.width / 2;
    const y = base.height * 0.80;
    ctx.strokeText(name.toUpperCase(), x, y);
    ctx.fillText(name.toUpperCase(), x, y);

    const out = await canvas.encode("jpeg", 90);
    await sock.sendMessage(m.chat, { image: out, caption: `🎮 *FREE FIRE LOBBY*\n\n👤 Name: ${name.toUpperCase()}\n🖼️ Template: ${num}` }, { quoted: m });
    await m.react("✅");
  } catch (e) {
    console.error("[AQUA-LOBBYFF]", e?.message || e);
    await m.react("❌").catch(() => {});
    return m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
