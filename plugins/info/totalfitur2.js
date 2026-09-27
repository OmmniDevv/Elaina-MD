/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import { getAllPlugins, getCommandsByCategory } from "../../src/lib/elaina-plugins.js"
import { getCaseCount } from "../../case/rimuru.js"

const pluginConfig = {
  name: "totalfitur2",
  alias: ["totalfeature2", "totalcmd2", "countplugin2", "distribusi2"],
  category: "info",
  description: "Lihat total fitur/command bot secara otomatis",
  usage: ".totalfitur2",
  example: ".totalfitur2",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 0,
  isEnabled: true,
}

async function handler(m) {
  try {
    const plugins = getAllPlugins().filter(p => p?.config?.isEnabled !== false)
    const commandsByCategory = getCommandsByCategory()
    const totalCommand = Object.values(commandsByCategory)
      .reduce((sum, commands) => sum + commands.length, 0)
    const totalCase = getCaseCount()
    const totalFitur = totalCommand + totalCase
    const totalKategori = Object.values(commandsByCategory)
      .filter(commands => commands.length > 0).length

    await m.reply(
      `📊 *TOTAL FITUR BOT*\n\n` +
      `🔌 Total Plugin Aktif : *${plugins.length}*\n` +
      `⚡ Total Command      : *${totalCommand}*\n` +
      `🧩 Total Case         : *${totalCase}*\n` +
      `✨ Total Fitur        : *${totalFitur}*\n` +
      `📁 Total Kategori     : *${totalKategori}*`
    )
  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : String(error ?? "Unknown error")
    console.error("[TotalFitur]", error)
    return m.reply(`❌ Gagal menghitung total fitur.\n> ${errorMessage}`)
  }
}

export { pluginConfig as config, handler }
