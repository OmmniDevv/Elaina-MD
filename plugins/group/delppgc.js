/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'delppgc',
    alias: ['delprofilegc', 'delppgroup', 'hapusppgc'],
    category: 'group',
    description: 'Menghapus foto profil grup',
    usage: '.delppgc',
    example: '.delppgc',
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
    try {
        await sock.removeProfilePicture(m.chat)
        
        await m.reply(
            `✅ PP Grup sekarang sudah botak`
        )
    } catch (error) {
        await m.reply(
            `❌ *ɢᴀɢᴀʟ*\n\n` +
            `> Tidak dapat menghapus foto grup.\n` +
            `> _${error.message}_`
        )
    }
}

export { pluginConfig as config, handler }