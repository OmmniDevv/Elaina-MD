/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: ['star', 'bintang'],
    alias: [],
    category: 'owner',
    description: 'Beri/hapus bintang pada pesan',
    usage: '.star (reply pesan) atau .star hapus (reply pesan)',
    example: '.star',
    isOwner: true,
    cooldown: 3,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    if (!m.quoted) {
        return m.reply(
            '⭐ *sᴛᴀʀ ᴍᴇssᴀɢᴇ*\n\n' +
            '> `.star` (reply pesan) — Beri bintang\n' +
            '> `.star hapus` (reply pesan) — Hapus bintang'
        )
    }

    const unstar = m.args[0]?.toLowerCase() === 'hapus' || m.args[0]?.toLowerCase() === 'unstar'
    const key = m.quoted.key

    try {
        await sock.chatModify({
            star: {
                messages: [{ id: key.id, fromMe: key.fromMe }],
                star: !unstar
            }
        }, m.chat)

        await m.react('⭐')
        return m.reply(
            unstar
                ? '❌ *Bintang dihapus dari pesan*'
                : '⭐ *Pesan ditandai bintang*'
        )
    } catch (err) {
        return m.reply(`❌ Gagal: ${err.message}`)
    }
}

export { pluginConfig as config, handler }
