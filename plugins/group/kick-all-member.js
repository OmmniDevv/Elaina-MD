/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'kickall',
    alias: ['kicksemua','cleargrup'],
    category: 'group',
    description: 'Kick semua member (non-admin)',
    usage: '.kickall member',
    example: '.kickall member',
    isGroup: true,
    isAdmin: true,
    isBotAdmin: true,
    cooldown: 10,
    isEnabled: true
}

async function handler(m, { sock }) {

    const args = m.args?.[0]

    if (!args || args !== 'member') {
        return m.reply(
`╭━━〔 ❤️ RIMURU MASS KICK 〕━━⬣
┃
┃ ⚔️ *MODE PEMBERSIHAN*
┃
┃ Gunakan:
┃ • .kickall member
┃
┃ ⚠️ Akan menghapus semua
┃ member non-admin
┃
╰━━━━━━━━━━━━━━━━⬣`
        )
    }

    m.react("⏳")

    try {

        const group = await sock.groupMetadata(m.chat)

        const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net'

        const members = group.participants.filter(p => 
            !p.admin && p.id !== botNumber
        )

        if (members.length === 0) {
            return m.reply("❌ Tidak ada member untuk di kick")
        }

        for (let user of members) {
            await sock.groupParticipantsUpdate(m.chat, [user.id], 'remove')
        }

        m.react("✅")

        return m.reply(
`╭━━〔 ❤️ RIMURU SYSTEM 〕━━⬣
┃
┃ 💀 *MASS CLEAN SUCCESS*
┃
┃ 👥 Member dihapus:
┃ ${members.length} orang
┃
┃ ⚡ Grup sekarang lebih bersih
┃
╰━━━━━━━━━━━━━━━━⬣`
        )

    } catch (e) {
        m.react("❌")
        return m.reply(
`╭━━〔 ❌ ERROR SYSTEM 〕━━⬣
┃
┃ ${e.message}
┃
╰━━━━━━━━━━━━━━━━⬣`
        )
    }
}

export { pluginConfig as config, handler };
