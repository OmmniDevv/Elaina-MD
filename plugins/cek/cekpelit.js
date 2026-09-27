/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'cekpelit',
    alias: ['pelit', 'kikir'],
    category: 'cek',
    description: 'Cek seberapa pelit kamu',
    usage: '.cekpelit <nama>',
    example: '.cekpelit Budi',
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
        desc = 'SUPER PELIT! Duit dijaga mati-matian! 💸'
    } else if (percent >= 70) {
        desc = 'Pelit banget! 🙊'
    } else if (percent >= 50) {
        desc = 'Lumayan pelit 😅'
    } else if (percent >= 30) {
        desc: 'Sedikit hemat 😊'
    } else {
        desc = 'Dermawan banget! 🎁'
    }
    
    let txt = mentioned === m.sender ? `Hai @${mentioned.split('@')[0]}
    
Tingkat kepelitan kamu *${percent}%*
\`\`\`${desc}\`\`\`` : `Kamu ingin ngecek tingkat kepelitan @${mentioned.split('@')[0]} yak? 
    
Tingkat kepelitan dia sebesar *${percent}%*
\`\`\`${desc}\`\`\``
    
    await m.reply(txt, { mentions: [mentioned] })
}

export { pluginConfig as config, handler }