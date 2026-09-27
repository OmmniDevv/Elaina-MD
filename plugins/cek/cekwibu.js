/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'cekwibu',
    alias: ['wibu', 'weeb'],
    category: 'cek',
    description: 'Cek seberapa wibu kamu',
    usage: '.cekwibu <nama>',
    example: '.cekwibu Budi',
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
        desc = 'WIBU SEJATI! Ara ara~ 🎌'
    } else if (percent >= 70) {
        desc = 'Wibu parah! Kimochi~ 😍'
    } else if (percent >= 50) {
        desc = 'Lumayan wibu 🌸'
    } else if (percent >= 30) {
        desc = 'Sedikit wibu 😊'
    } else {
        desc = 'Bukan wibu, normal! 😎'
    }
    
    let txt = mentioned === m.sender ? `Hai @${mentioned.split('@')[0]}
    
Tingkat kewibuan kamu *${percent}%*
\`\`\`${desc}\`\`\`` : `Kamu ingin ngecek tingkat kewibuan @${mentioned.split('@')[0]} yak? 
    
Tingkat kewibuan dia sebesar *${percent}%*
\`\`\`${desc}\`\`\``
    
    await m.reply(txt, { mentions: [mentioned] })
}

export { pluginConfig as config, handler }