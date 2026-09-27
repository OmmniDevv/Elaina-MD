/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { config, httpRequest } from "../../src/lib/elaina-rioo-bridge.js";
import fs from "node:fs/promises";
import path from "node:path";

const pluginConfig = {
  name: "rimuru-otp",
  alias: [
    "otpmenu",
    "otplayanan",
    "otpprofile",
    "otporder",
    "otpgetorder",
    "otpsms",
    "otpcancel",
    "otpcancelsms",
  ],
  category: "owner",
  description: "Layanan OTP Rimuru dengan API dan key yang dipindahkan ke config Rimuru",
  usage: ".otpmenu / .otplayanan / .otporder <id> / .otpgetorder <id> / .otpsms <id> / .otpcancel <id>",
  isOwner: true,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 2,
  energi: 0,
  isEnabled: true,
};

const otpUrl = (pathName, extra = "") => {
  const { baseUrl, apiKey } = config.riooApi.otp;
  return `${baseUrl.replace(/\/$/, "")}/${pathName}/${encodeURIComponent(apiKey)}${extra}`;
};

async function api(pathName, extra = "") {
  const data = await httpRequest(otpUrl(pathName, extra), "json");
  if (!data) throw new Error("API OTP tidak merespons.");
  if (data.success === false || data.succes === false) {
    throw new Error(data?.data?.messages || data?.message || "Request OTP gagal.");
  }
  return data;
}

function formatMoney(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n.toLocaleString("id-ID") : String(value ?? "-");
}

async function handler(m) {
  const command = (m.command || m.args.shift?.() || "otpmenu").toLowerCase();
  try {
    if (command === "otpmenu") {
      return m.reply(`*L A Y A N A N  O T P*\n\n• ${m.prefix}otpprofile — cek profil & saldo\n• ${m.prefix}otplayanan — daftar layanan\n• ${m.prefix}otporder <id> — order layanan\n• ${m.prefix}otpgetorder <id> — detail order\n• ${m.prefix}otpsms <id> — cek detail SMS/order\n• ${m.prefix}otpcancel <id> — batalkan order\n• ${m.prefix}otpcancelsms — bersihkan data OTP lokal`);
    }

    if (command === "otpprofile") {
      const res = await api("get-profile");
      const d = res.data?.data || res.data || {};
      return m.reply(`*GET PROFILE*\n\n》 Username: ${d.username ?? "-"}\n》 Saldo: Rp ${formatMoney(d.saldo)}\n》 Email: ${d.email ?? "-"}`);
    }

    if (command === "otplayanan") {
      const res = await api("get-services");
      const list = res.data?.data || res.data || [];
      const rows = Array.isArray(list) ? list : [];
      if (!rows.length) return m.reply("Tidak ada layanan OTP yang tersedia.");
      return m.reply(`*LIST LAYANAN OTP*\n\n${rows.map(x => `• ID: ${x.id}\n  ${x.name}\n  Harga: Rp${formatMoney(x.price)}`).join("\n\n")}`);
    }

    const id = m.args[0];
    if (["otporder", "otpgetorder", "otpsms", "otpcancel"].includes(command) && !id) {
      return m.reply(`Masukkan ID. Contoh: ${m.prefix}${command} 14`);
    }

    if (command === "otporder") {
      const res = await api("set-orders", `/${encodeURIComponent(id)}`);
      const d = res.data?.data || res.data || {};
      return m.reply(`*DETAIL ORDER OTP*\n\n• Order ID: ${d.order_id ?? "-"}\n• Aplikasi ID: ${d.aplikasi_id ?? "-"}\n• Number: ${d.number ?? "-"}\n• Status: ${d.status ?? "-"}\n• SMS: ${d.sms ?? "-"}\n• Status SMS: ${d.status_sms ?? "-"}\n• Harga: Rp${formatMoney(d.price)}\n• Saldo terakhir: Rp${formatMoney(d.last_saldo)}\n• Dibuat: ${d.created_at ?? "-"}\n• App: ${d.aplikasi_name ?? "-"}`);
    }

    if (command === "otpgetorder" || command === "otpsms") {
      const res = await api("set-orders", `/${encodeURIComponent(id)}`);
      const d = res.data?.data || res.data || {};
      return m.reply(`*DETAIL OTP*\n\n• Order ID: ${d.order_id ?? "-"}\n• Aplikasi ID: ${d.aplikasi_id ?? "-"}\n• Number: ${d.number ?? "-"}\n• Status: ${d.status ?? "-"}\n• SMS: ${d.sms ?? "-"}\n• Status SMS: ${d.status_sms ?? "-"}\n• Dibuat: ${d.created_at ?? "-"}\n• App: ${d.aplikasi_name ?? "-"}`);
    }

    if (command === "otpcancel") {
      await api("cancle-orders", `/${encodeURIComponent(id)}`);
      return m.reply(`✅ Order *${id}* berhasil diminta untuk dibatalkan.`);
    }

    if (command === "otpcancelsms") {
      const dir = path.resolve("database/rioo-otp");
      try { await fs.rm(dir, { recursive: true, force: true }); } catch {}
      await fs.mkdir(dir, { recursive: true });
      return m.reply("✅ Data OTP lokal dibersihkan.");
    }

    return m.reply(`Gunakan *${m.prefix}otpmenu* untuk melihat menu OTP.`);
  } catch (error) {
    return m.reply(`❌ OTP Error: ${error.message}`);
  }
}

export { pluginConfig as config, handler };
