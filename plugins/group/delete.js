/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'delete',
    alias: ['del', 'hapus', 'd'],
    category: 'group',
    description: 'Hapus pesan dengan reply',
    usage: '.delete (reply pesan)',
    example: '.delete',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    isAdmin: true,
    isBotAdmin: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    if (!m.quoted) {
        return m.reply('⚠️ *Reply pesan yang ingin dihapus!*')
    }

    const quotedSender = m.quoted.sender || m.quoted.key?.participant
    const botJid = sock.user?.id?.split(':')[0] + '@s.whatsapp.net'
    const isOwnMessage = m.quoted.key?.fromMe || quotedSender === m.sender
    const isBotMessage = quotedSender === botJid || m.quoted.key?.fromMe

    if (!isOwnMessage && !isBotMessage) {
        if (!m.isBotAdmin) {
            return m.reply('⚠️ *Bot harus jadi admin untuk hapus pesan orang lain!*')
        }
        if (!m.isAdmin && !m.isOwner) {
            return m.reply('⚠️ *Hanya admin yang bisa hapus pesan orang lain!*')
        }
    }

    try {
        const key = {
            remoteJid: m.chat,
            id: m.quoted.key.id,
            fromMe: m.quoted.key.fromMe,
            participant: quotedSender
        }

        await sock.sendMessage(m.chat, { delete: key })
        await m.react('✅')

    } catch (err) {
        if (err.message?.includes('not found') || err.message?.includes('forbidden')) {
            await m.reply('❌ *Gagal menghapus!*\n> Pesan mungkin sudah dihapus atau terlalu lama.')
        } else {
            await m.react('❌')
        }
    }
}

export { pluginConfig as config, handler }