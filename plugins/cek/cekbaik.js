/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'cekbaik',
    alias: ['baik', 'kind'],
    category: 'cek',
    description: 'Cek seberapa baik kamu',
    usage: '.cekbaik <nama>',
    example: '.cekbaik Budi',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m) {
    const percent = Math.floor(Math.random() * 101)
    const mentioned = m.mentionedJid[0] || m.sender
    
    let desc = ''
    if (percent >= 90) {
        desc = 'Mantappp! kamu adalah orang paling Baik di dunia ini! 😇✨'
    } else if (percent >= 70) {
        desc = 'Baik hati dan tidak sombong! 💝'
    } else if (percent >= 50) {
        desc = 'Lumayan baik 😊'
    } else if (percent >= 30) {
        desc = 'Sedikit baik 🙂'
    } else {
        desc = 'Hmm, perlu introspeksi ?? 🤔'
    }
    
    let txt = mentioned === m.sender ? `Hai @${mentioned.split('@')[0]}
    
Tingkat kebaikan kamu *${percent}%*
\`\`\`${desc}\`\`\`` : `Kamu ingin ngecek tingkat kebaikan @${mentioned.split('@')[0]} yak? 
    
Tingkat kebaikan dia sebesar *${percent}%*
\`\`\`${desc}\`\`\``
    
    await m.reply(txt, { mentions: [mentioned] })
}

export { pluginConfig as config, handler }