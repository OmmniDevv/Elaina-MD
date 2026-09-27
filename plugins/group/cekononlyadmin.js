/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'cekonlyadmin',
    alias: ['onlyadminstatus', 'statusadminonly'],
    category: 'group',
    description: 'Cek status mode onlyadmin di grup',
    usage: '.cekonlyadmin',
    example: '.cekonlyadmin',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true
}

async function handler(m, { db }) {
    const groupData = db.getGroup(m.chat) || {}
    const isEnabled = groupData.onlyAdmin === true
    
    const status = isEnabled ? '🟢 *AKTIF*' : '🔴 *NONAKTIF*'
    const deskripsi = isEnabled 
        ? 'Hanya admin grup yang bisa menggunakan bot'
        : 'Semua member grup bisa menggunakan bot'
    
    m.reply(
`╭───〔 𝗭𝗘𝗥𝗢 𝗧𝗪𝗢 𝗦𝗧𝗔𝗧𝗨𝗦 〕───⬣
│
│ ✦ *Mode OnlyAdmin*
│
│  ${status}
│
│ ${deskripsi}
│
│ ✦ *Diubah oleh*
│  Hanya owner bot
│
╰──────────────────⬣`
    )
}

export { pluginConfig as config, handler };
