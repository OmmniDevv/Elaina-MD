/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'setbio',
    alias: ['setbiobot', 'setstatus', 'setabout'],
    category: 'tools',
    description: 'Mengubah bio/status bot',
    usage: '.setbio <bio baru>',
    example: '.setbio Bot WhatsApp by Lucky Archz',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    const newBio = m.text?.trim()
    
    if (!newBio && m.args?.length === 0) {
        await m.reply(
            `⚠️ *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ*\n\n` +
            `> \`${m.prefix}setbio Bio bot baru\`\n` +
            `> \`${m.prefix}setbio clear\` - Hapus bio`
        )
        return
    }
    
    const bioToSet = newBio?.toLowerCase() === 'clear' ? '' : (newBio || '')
    
    if (bioToSet.length > 139) {
        await m.reply(
            `⚠️ *ᴠᴀʟɪᴅᴀsɪ*\n\n` +
            `> Bio maksimal 139 karakter.`
        )
        return
    }
    
    try {
        await sock.updateProfileStatus(bioToSet)
        
        if (bioToSet) {
            await m.reply(
                `✅ *ʙɪᴏ ʙᴏᴛ ᴅɪᴜʙᴀʜ*\n\n` +
                `> Bio bot sekarang:\n` +
                `> _${bioToSet}_`
            )
        } else {
            await m.reply(
                `✅ *ʙɪᴏ ʙᴏᴛ ᴅɪʜᴀᴘᴜs*\n\n` +
                `> Bio bot berhasil dihapus!`
            )
        }
    } catch (error) {
        await m.reply(
            `❌ *ɢᴀɢᴀʟ*\n\n` +
            `> Tidak dapat mengubah bio bot.\n` +
            `> _${error.message}_`
        )
    }
}

export { pluginConfig as config, handler }