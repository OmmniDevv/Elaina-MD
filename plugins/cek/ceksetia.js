/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'ceksetia',
    alias: ['setia', 'loyal'],
    category: 'cek',
    description: 'Cek tingkat kesetiaan kamu',
    usage: '.ceksetia <nama>',
    example: '.ceksetia Budi',
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
    if (percent >= 90) desc = 'Setia sampai mati! 💍💕'
    else if (percent >= 70) desc = 'Sangat setia dan tulus! ❤️'
    else if (percent >= 50) desc = 'Cukup setia~ 😊'
    else if (percent >= 30) desc = 'Hmm... kadang goyah 😅'
    else desc = 'Playboy/Playgirl mode? 😏'
    
    let txt = mentioned === m.sender ? `Hai @${mentioned.split('@')[0]}
    
Tingkat kesetiaan kamu *${percent}%*
\`\`\`${desc}\`\`\`` : `Kamu ingin ngecek tingkat kesetiaan @${mentioned.split('@')[0]} yak? 
    
Tingkat kesetiaan dia sebesar *${percent}%*
\`\`\`${desc}\`\`\``
    
    await m.reply(txt, { mentions: [mentioned] })
}

export { pluginConfig as config, handler }