/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios"

const pluginConfig = {
  name: "barcode",
  alias: ["code128"],
  category: "tools",
  description: "Membuat barcode Code-128",
  usage: ".barcode <teks>",
  example: ".barcode 1234567890",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
}
const API_BASE = "https://barcodeapi.org/api/128/"

async function handler(m, { sock }) {
  const text = m.text?.trim()
  if (!text) return m.reply(`📊 *BARCODE*\n\nContoh: \`${m.prefix}barcode 1234567890\``)
  await m.react("🕕")
  try {
    const res = await axios.get(API_BASE + encodeURIComponent(text), { responseType: "arraybuffer", timeout: 30000 })
    const buffer = Buffer.from(res.data)
    if (!buffer.length) throw new Error("Barcode kosong")
    await sock.sendMessage(m.chat, { image: buffer, caption: `✅ Barcode Code-128\n\nData: *${text}*` }, { quoted: m })
    await m.react("✅")
  } catch (e) {
    await m.react("❌")
    m.reply(`❌ Gagal membuat barcode: ${e.message}`)
  }
}

export { pluginConfig as config, handler }
