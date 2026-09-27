/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'cekgila',
    alias: ['gila', 'crazy'],
    category: 'cek',
    description: 'Cek seberapa gila kamu',
    usage: '.cekgila <nama>',
    example: '.cekgila Budi',
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
        desc = 'GILA BENERAN! Masuk RSJ! 🤪'
    } else if (percent >= 70) {
        desc = 'Hampir gila 😵'
    } else if (percent >= 50) {
        desc = 'Lumayan waras 😅'
    } else if (percent >= 30) {
        desc: 'Normal kok 🙂'
    } else {
        desc = 'Waras banget! 😇'
    }
    
    let txt = mentioned === m.sender ? `Hai @${mentioned.split('@')[0]}
    
Tingkat kegilaan kamu *${percent}%*
\`\`\`${desc}\`\`\`` : `Kamu ingin ngecek tingkat kegilaan @${mentioned.split('@')[0]} yak? 
    
Tingkat kegilaan dia sebesar *${percent}%*
\`\`\`${desc}\`\`\``
    
    await m.reply(txt, { mentions: [mentioned] })
}

export { pluginConfig as config, handler }