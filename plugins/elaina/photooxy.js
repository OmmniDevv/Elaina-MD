/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";
import FormData from "form-data";
import * as cheerio from "cheerio";
import te from "../../src/lib/elaina-error.js";

const EFFECT_ALIASES = ["photooxy", "photofx", "poxy", "oxyfx"];

const pluginConfig = {
  name: EFFECT_ALIASES,
  alias: [],
  category: "elaina",
  description: "PhotoOxy text effects yang dipindahkan ke struktur RimuruMD",
  usage: ".photooxy <url-effect>|<teks>",
  example: ".photooxy https://photooxy.com/xxx.html|Rimuru",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 1,
  isEnabled: true,
};

function cookieHeader(setCookie = []) {
  return Array.isArray(setCookie) ? setCookie.map((v) => v.split(";")[0]).join("; ") : "";
}

async function photoOxy(url, texts) {
  const headers = {
    "user-agent":
      "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/124.0 Mobile Safari/537.36",
  };

  const first = await axios.get(url, { headers, timeout: 20000 });
  const $ = cheerio.load(first.data);
  const token = $('input[name="token"]').val();
  const buildServer = $('input[name="build_server"]').val();
  const buildServerId = $('input[name="build_server_id"]').val();

  if (!token || !buildServer || !buildServerId) {
    throw new Error("Token PhotoOxy tidak ditemukan. Link effect mungkin sudah berubah.");
  }

  const form = new FormData();
  for (const text of Array.isArray(texts) ? texts : [texts]) {
    form.append("text[]", text);
  }
  form.append("sumbit", "GO");
  form.append("token", token);
  form.append("build_server", buildServer);
  form.append("build_server_id", buildServerId);

  const second = await axios.post(url, form, {
    timeout: 30000,
    headers: { ...headers, cookie: cookieHeader(first.headers["set-cookie"]), ...form.getHeaders() },
  });

  const $$ = cheerio.load(second.data);
  let raw =
    $$('div#form_value').text().trim() ||
    $$('input[name="form_value"]').val() ||
    $$('input[name="form_value_input"]').val();

  if (!raw) {
    const match = String(second.data).match(/id\s*=\s*["']form_value["'][^>]*>\s*([\s\S]*?)\s*<\/div>/i);
    raw = match?.[1]?.trim();
  }

  if (!raw) throw new Error("Data proses PhotoOxy tidak ditemukan.");

  let params;
  try {
    params = JSON.parse(raw);
  } catch {
    try {
      params = JSON.parse(raw.replace(/&quot;/g, '"'));
    } catch {
      throw new Error("Respons PhotoOxy tidak valid.");
    }
  }

  const final = await axios.get("https://photooxy.com/effect/create-image", {
    params,
    timeout: 30000,
    headers: { ...headers, cookie: cookieHeader(first.headers["set-cookie"]) },
  });

  const image = final.data?.image;
  if (!image) throw new Error("PhotoOxy tidak mengembalikan gambar.");
  return /^https?:\/\//i.test(image) ? image : `${buildServer}${image}`;
}

async function handler(m, { sock }) {
  const command = String(m.command || "").toLowerCase();
  const text = m.text?.trim();

  if (!text || !text.includes("|")) {
    return m.reply(
      `🖼️ *PHOTO OXY EFFECT*\n\n` +
      `Format: ${m.prefix}${command} <url-effect>|<teks>\n\n` +
      `Contoh:\n${m.prefix}${command} https://photooxy.com/xxx.html|Rimuru`
    );
  }

  const [effectUrl, ...textParts] = text.split("|");
  const url = effectUrl.trim();
  const effectText = textParts.map((v) => v.trim()).filter(Boolean);

  if (!/^https?:\/\/(?:www\.)?photooxy\.com\//i.test(url)) {
    return m.reply("❌ URL effect harus berasal dari photooxy.com");
  }
  if (!effectText.length) return m.reply("❌ Teks effect belum diisi.");

  await m.react("⏳");
  try {
    const imageUrl = await photoOxy(url, effectText);
    await m.react("✅");
    await m.reply(`🖼️ *PHOTO OXY*\n\n> Effect berhasil dibuat.`);
    await sock.sendMedia(m.chat, imageUrl, "✨ PhotoOxy Effect", m, { type: "image" });
  } catch (error) {
    await m.react("❌");
    return m.reply(`❌ *PhotoOxy Error*\n\n${te(m.prefix, command, error?.message || "Gagal memproses.")}`);
  }
}

export { pluginConfig as config, handler };
