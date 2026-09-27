/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'cekoverpower',
    alias: ['overpower', 'op'],
    category: 'cek',
    description: 'Cek tingkat overpower kamu',
    usage: '.cekoverpower <nama>',
    example: '.cekoverpower Budi',
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
    if (percent >= 90) desc = 'OVERPOWER BANGET! LEGEND! 👑🔥'
    else if (percent >= 70) desc = 'Kuat banget nih! 💪'
    else if (percent >= 50) desc = 'Lumayan strong~ 😎'
    else if (percent >= 30) desc = 'Biasa aja sih 🤔'
    else desc = 'Masih perlu latihan 📝'
    
    let txt = mentioned === m.sender ? `Hai @${mentioned.split('@')[0]}
    
Tingkat keoverpoweran kamu *${percent}%*
\`\`\`${desc}\`\`\`` : `Kamu ingin ngecek tingkat keoverpoweran @${mentioned.split('@')[0]} yak? 
    
Tingkat keoverpoweran dia sebesar *${percent}%*
\`\`\`${desc}\`\`\``
    
    await m.reply(txt, { mentions: [mentioned] })
}

export { pluginConfig as config, handler }