/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'cekotaku',
    alias: ['otaku'],
    category: 'cek',
    description: 'Cek tingkat otaku kamu',
    usage: '.cekotaku <nama>',
    example: '.cekotaku Budi',
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
    if (percent >= 90) desc = 'SUGOI! True otaku desu! 🎌✨'
    else if (percent >= 70) desc = 'Weeb level tinggi~ 🇯🇵'
    else if (percent >= 50) desc = 'Casual anime enjoyer 📺'
    else if (percent >= 30) desc = 'Tau anime dikit-dikit 🤔'
    else desc = 'Normie detected! 😂'
    
    let txt = mentioned === m.sender ? `Hai @${mentioned.split('@')[0]}
    
Tingkat keotakuan kamu *${percent}%*
\`\`\`${desc}\`\`\`` : `Kamu ingin ngecek tingkat keotakuan @${mentioned.split('@')[0]} yak? 
    
Tingkat keotakuan dia sebesar *${percent}%*
\`\`\`${desc}\`\`\``
    
    await m.reply(txt, { mentions: [mentioned] })
}

export { pluginConfig as config, handler }