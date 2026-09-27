/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import os from 'os'

let handler = async (m) => {
  try {
    const uptime = process.uptime()
    const hours = Math.floor(uptime / 3600)
    const minutes = Math.floor((uptime % 3600) / 60)
    const seconds = Math.floor(uptime % 60)

    return m.reply(
      `🌷 *RUNTIME BOT*\n\n` +
      `❏ Runtime : ${hours} Jam ${minutes} Menit ${seconds} Detik\n` +
      `❏ System : ${os.platform()}\n` +
      `❏ Arch : ${os.arch()}\n` +
      `❏ RAM : ${(os.totalmem() / 1024 / 1024).toFixed(0)} MB`
    )
  } catch (e) {
    console.error('[Runtime]', e)
    return m.reply('🌷 Terjadi kesalahan saat mengambil data runtime.')
  }
}

handler.help = ['runtime']
handler.tags = ['info']
handler.command = ['runtime']

export default handler
