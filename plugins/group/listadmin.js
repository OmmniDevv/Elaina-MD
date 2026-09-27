/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getParticipantJid } from '../../src/lib/elaina-lid.js'
import te from '../../src/lib/elaina-error.js'
const pluginConfig = {
    name: 'listadmin',
    alias: ['admins', 'adminlist'],
    category: 'group',
    description: 'Menampilkan daftar admin grup',
    usage: '.listadmin',
    example: '.listadmin',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    cooldown: 10,
    energi: 0,
    isEnabled: true,
    isAdmin: false,
    isBotAdmin: false
}

async function handler(m, { sock }) {
    try {
        const groupMeta = m.groupMetadata
        const participants = groupMeta.participants || []
        const admins = participants.filter(p => p.admin)

        if (admins.length === 0) {
            await m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Tidak ada admin di grup ini.`)
            return
        }

        const owner = admins.find(a => a.admin === 'superadmin')
        const regularAdmins = admins.filter(a => a.admin === 'admin')

        let adminList = `👑 *ʟɪsᴛ ᴀᴅᴍɪɴ*\n\n`

        if (owner) {
            adminList += `\`\`\`━━━ ᴏᴡɴᴇʀ ━━━\`\`\`\n`
            adminList += `\`\`\`👑 @${getParticipantJid(owner).split('@')[0]}\`\`\`\n\n`
        }

        if (regularAdmins.length > 0) {
            adminList += `\`\`\`━━━ ᴀᴅᴍɪɴ ━━━\`\`\`\n`
            regularAdmins.forEach((admin, i) => {
                adminList += `\`\`\`${i + 1}. @${getParticipantJid(admin).split('@')[0]}\`\`\`\n`
            })
        }
        adminList += `\n\`Total Admin: ${admins.length}\``

        const mentions = admins.map(a => getParticipantJid(a))

        await m.reply(adminList, { mentions })

    } catch (error) {
        m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }