/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'delpp',
    alias: ['delprofilebot', 'delppbot', 'hapusppbot'],
    category: 'tools',
    description: 'Menghapus foto profil bot',
    usage: '.delpp',
    example: '.delpp',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    try {
        const botJid = sock.user?.id
        if (!botJid) {
            await m.reply(`❌ Bot JID tidak ditemukan.`)
            return
        }
        
        await sock.removeProfilePicture(botJid)
        
        await m.reply(
            `✅ *ᴘᴘ ʙᴏᴛ ᴅɪʜᴀᴘᴜs*\n\n` +
            `> Foto profil bot berhasil dihapus!`
        )
    } catch (error) {
        await m.reply(
            `❌ *ɢᴀɢᴀʟ*\n\n` +
            `> Tidak dapat menghapus foto bot.\n` +
            `> _${error.message}_`
        )
    }
}

export { pluginConfig as config, handler }