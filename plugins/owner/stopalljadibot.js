/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { stopAllJadibots, getActiveJadibots } from '../../src/lib/elaina-jadibot-manager.js'
import te from '../../src/lib/elaina-error.js'
const pluginConfig = {
    name: 'stopalljadibot',
    alias: ['stopsemuajadibot', 'killalljadibots'],
    category: 'owner',
    description: 'Hentikan semua jadibot yang aktif',
    usage: '.stopalljadibot',
    example: '.stopalljadibot',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    const active = getActiveJadibots()

    if (active.length === 0) {
        return m.reply(`❌ Tidak ada jadibot yang aktif`)
    }

    await m.react('🕕')

    try {
        const stopped = await stopAllJadibots()

        await m.react('✅')

        const names = stopped.map(id => `@${id}`).join(', ')

        await sock.sendMessage(m.chat, {
            text: `🛑 *sᴇᴍᴜᴀ ᴊᴀᴅɪʙᴏᴛ ᴅɪʜᴇɴᴛɪᴋᴀɴ*\n\n` +
                `> 📊 Total: *${stopped.length}* jadibot\n` +
                `> 💾 Session: *Tersimpan*\n\n` +
                `Dihentikan: ${names}\n\n` +
                `> Semua session disimpan dan bisa diaktifkan ulang.`,
            mentions: stopped.map(id => id + '@s.whatsapp.net')
        }, { quoted: m })
    } catch (error) {
        await m.react('☢')
        await m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }