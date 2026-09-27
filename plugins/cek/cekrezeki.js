/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'cekrezeki',
    alias: ['rezeki', 'fortune'],
    category: 'cek',
    description: 'Cek tingkat rezeki kamu hari ini',
    usage: '.cekrezeki <nama>',
    example: '.cekrezeki Budi',
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
    if (percent >= 90) desc = 'Rezeki melimpah! Jackpot! 💰🎉'
    else if (percent >= 70) desc = 'Rezeki lancar hari ini~ 💵'
    else if (percent >= 50) desc = 'Rezeki cukup, bersyukurlah 🙏'
    else if (percent >= 30) desc = 'Rezeki pas-pasan 😅'
    else desc = 'Sabar ya, rezeki akan datang~ 🫂'
    
    let txt = mentioned === m.sender ? `Hai @${mentioned.split('@')[0]}
    
Tingkat kerezekian kamu *${percent}%*
\`\`\`${desc}\`\`\`` : `Kamu ingin ngecek tingkat kerezekian @${mentioned.split('@')[0]} yak? 
    
Tingkat kerezekian dia sebesar *${percent}%*
\`\`\`${desc}\`\`\``
    
    await m.reply(txt, { mentions: [mentioned] })
}

export { pluginConfig as config, handler }