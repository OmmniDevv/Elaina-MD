/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'antiremove',
    alias: ['antidelete', 'antihapus', 'ar'],
    category: 'group',
    description: 'Mengaktifkan/menonaktifkan anti hapus pesan di grup',
    usage: '.antiremove <on/off>',
    example: '.antiremove on',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true,
    isAdmin: true,
    isBotAdmin: false
}

async function handler(m, { sock, db }) {
    const action = (m.args || [])[0]?.toLowerCase()
    const group = db.getGroup(m.chat) || {}

    if (!action) {
        const status = group.antiremove || 'off'
        await m.reply(
            `🗑️ *AntiRemove*\n\n` +
            `> Status: *${status === 'on' ? '✅ Aktif' : '❌ Nonaktif'}*\n\n` +
            `> \`.antiremove on/off\``
        )
        return
    }

    if (action === 'on') {
        db.setGroup(m.chat, { ...group, antiremove: 'on' })
        m.react('✅')
        await m.reply(`✅ *AntiRemove diaktifkan*\n> Pesan yang dihapus akan di-forward ulang.`)
        return
    }

    if (action === 'off') {
        db.setGroup(m.chat, { ...group, antiremove: 'off' })
        m.react('❌')
        await m.reply(`❌ *AntiRemove dinonaktifkan*`)
        return
    }

    await m.reply(`❌ Gunakan \`.antiremove on\` atau \`.antiremove off\``)
}

export { pluginConfig as config, handler }