/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
  name: "halah",
  alias: ["hilih"],
  category: "fun",
  description: "Ubah teks ke gaya Halah/Hilih",
  usage: ".halah <teks> / .hilih <teks>",
  example: ".halah congratulations",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 0,
  isEnabled: true,
}

function gayaHalah(text) {
  if (/cangratalataans|laval|rala|raward|samakan|sarang|barantaraksa|nashakaga chasata/i.test(text)) return null
  return text.replace(/[aeou]/gi, "a").replace(/congratulations/gi, "cangratalataans").replace(/you/gi, "yaa").replace(/level/gi, "laval").replace(/role/gi, "rala").replace(/reward/gi, "raward").replace(/semakin/gi, "samakan").replace(/sering/gi, "sarang").replace(/berinteraksi/gi, "barantaraksa").replace(/dengan/gi, "dangan").replace(/nishikigi chisato/gi, "nashakaga chasata").replace(/money/gi, "manay")
}
function gayaHilih(text) {
  if (/cingritilitiins|livil|rili|riwird|simikin|siring|birintiriksi|nishikigi chisiti/i.test(text)) return null
  return text.replace(/[aeou]/gi, "i").replace(/congratulations/gi, "cingritilitiins").replace(/you/gi, "yii").replace(/level/gi, "livil").replace(/role/gi, "rili").replace(/reward/gi, "riwird").replace(/semakin/gi, "simikin").replace(/sering/gi, "siring").replace(/berinteraksi/gi, "birintiriksi").replace(/dengan/gi, "dingin").replace(/nishikigi chisato/gi, "nishikigi chisiti").replace(/money/gi, "miniy")
}

async function handler(m) {
  const text = m.text?.trim() || ""
  if (!text) return m.reply(`🔁 Kirim teks setelah \`${m.prefix}${m.command}\` atau reply ke pesan teks.`)
  const out = m.command === "hilih" ? gayaHilih(text) : gayaHalah(text)
  if (!out) return m.reply("🚫 Teks ini sudah pernah diubah sebelumnya.")
  return m.reply(out)
}

export { pluginConfig as config, handler }
