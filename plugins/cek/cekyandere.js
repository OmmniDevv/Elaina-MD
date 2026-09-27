/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'cekyandere',
    alias: ['yandere'],
    category: 'cek',
    description: 'Cek tingkat yandere kamu',
    usage: '.cekyandere <nama>',
    example: '.cekyandere Budi',
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
    if (percent >= 90) desc = 'Kamu milikku selamanya~ 🔪💕'
    else if (percent >= 70) desc = 'Jangan dekati dia ya... 👁️'
    else if (percent >= 50) desc = 'Overprotective sedikit~ 🫂'
    else if (percent >= 30) desc = 'Agak posesif 😅'
    else desc = 'Normal kok, santai~ 😊'
    
    let txt = mentioned === m.sender ? `Hai @${mentioned.split('@')[0]}
    
Tingkat keyanderean kamu *${percent}%*
\`\`\`${desc}\`\`\`` : `Kamu ingin ngecek tingkat keyanderean @${mentioned.split('@')[0]} yak? 
    
Tingkat keyanderean dia sebesar *${percent}%*
\`\`\`${desc}\`\`\``
    
    await m.reply(txt, { mentions: [mentioned] })
}

export { pluginConfig as config, handler }