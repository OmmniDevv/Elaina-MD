/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'setppgc',
    alias: ['setprofilegc', 'setppgroup', 'setppgrup'],
    category: 'group',
    description: 'Mengubah foto profil grup',
    usage: '.setppgc (reply gambar)',
    example: '.setppgc',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    isAdmin: true,
    isBotAdmin: true,
    cooldown: 10,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    let buffer = null
    if (m.quoted?.isImage) {
        try {
            buffer = await m.quoted.download()
        } catch (e) {
            await m.reply(`❌ Gagal mengambil gambar.`)
            return
        }
    } else if (m.isImage) {
        try {
            buffer = await m.download()
        } catch (e) {
            await m.reply(`❌ Gagal mengambil gambar.`)
            return
        }
    }
    if (!buffer) {
        await m.reply(
            `⚠️ *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ*\n\n` +
            `> Reply gambar + \`${m.prefix}setppgc\`\n` +
            `> Kirim gambar + caption \`${m.prefix}setppgc\``
        )
        return
    }
    try {
        await sock.updateProfilePicture(m.chat, buffer)
        await m.reply(
            `✅ Foto profil grup berhasil diperbarui!`
        )
    } catch (error) {
        await m.reply(
            `❌ Gagal mengubah foto grup.\n` +
            `> _${error.message}_`
        )
    }
}

export { pluginConfig as config, handler }