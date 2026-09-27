/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: ['hapusgrup', 'deletegrup', 'delgrup'],
    alias: [],
    category: 'owner',
    description: 'Keluar dari grup / hapus grup',
    usage: '.hapusgrup (di dalam grup) atau .hapusgrup <jid>',
    example: '.hapusgrup',
    isOwner: true,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    let targetJid = null

    if (m.args[0]) {
        targetJid = m.args[0].replace(/[^0-9@.]/g, '')
        if (!targetJid.endsWith('@g.us')) targetJid += '@g.us'
    } else if (m.isGroup) {
        targetJid = m.chat
    }

    if (!targetJid || !targetJid.endsWith('@g.us')) {
        return m.reply(
            '🗑️ *ʜᴀᴘᴜs ɢʀᴜᴘ*\n\n' +
            '> `.hapusgrup` (di dalam grup) — Keluar dari grup ini\n' +
            '> `.hapusgrup <id_grup>` — Keluar dari grup tertentu\n\n' +
            '⚠️ Bot akan keluar dari grup, bukan menghapus grup secara permanen'
        )
    }

    try {
        const metadata = await sock.groupMetadata(targetJid).catch(() => null)
        const groupName = metadata?.subject || targetJid

        await sock.groupLeave(targetJid)
        await m.react('✅')
        return m.reply(
            `🗑️ *ʙᴏᴛ ᴋᴇʟᴜᴀʀ ᴅᴀʀɪ ɢʀᴜᴘ*\n\n` +
            `> Grup: ${groupName}\n` +
            `> ID: ${targetJid}`
        )
    } catch (err) {
        return m.reply(`❌ Gagal keluar dari grup: ${err.message}`)
    }
}

export { pluginConfig as config, handler }
