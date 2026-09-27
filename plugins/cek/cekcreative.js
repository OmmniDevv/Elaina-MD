/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'cekcreative',
    alias: ['creative', 'kreatif'],
    category: 'cek',
    description: 'Cek tingkat kreativitas kamu',
    usage: '.cekcreative <nama>',
    example: '.cekcreative Budi',
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
    if (percent >= 90) desc = 'SUPER KREATIF! Artis sejati! 🎨✨'
    else if (percent >= 70) desc = 'Imajinatif banget! 💡'
    else if (percent >= 50) desc = 'Cukup kreatif 😊'
    else if (percent >= 30) desc = 'Biasa aja sih 🤔'
    else desc = 'Kurang imajinasi nih 😅'
    
    let txt = mentioned === m.sender ? `Hai @${mentioned.split('@')[0]}
    
Tingkat kecreativean kamu *${percent}%*
\`\`\`${desc}\`\`\`` : `Kamu ingin ngecek tingkat kecreativean @${mentioned.split('@')[0]} yak? 
    
Tingkat kecreativean dia sebesar *${percent}%*
\`\`\`${desc}\`\`\``
    
    await m.reply(txt, { mentions: [mentioned] })
}

export { pluginConfig as config, handler }