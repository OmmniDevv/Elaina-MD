/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'cekprocastinator',
    alias: ['procrastinator', 'nunda'],
    category: 'cek',
    description: 'Cek tingkat suka menunda',
    usage: '.cekprocastinator <nama>',
    example: '.cekprocastinator Budi',
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
    if (percent >= 90) desc = 'Deadline? Besok aja deh~ 😴'
    else if (percent >= 70) desc = 'Master procrastination! 🦥'
    else if (percent >= 50) desc = 'Kadang nunda, kadang rajin 😅'
    else if (percent >= 30) desc = 'Cukup produktif! 💪'
    else desc = 'Disiplin tinggi! Salut! 🏆'
    
    let txt = mentioned === m.sender ? `Hai @${mentioned.split('@')[0]}
    
Tingkat keprocastinatoran kamu *${percent}%*
\`\`\`${desc}\`\`\`` : `Kamu ingin ngecek tingkat keprocastinatoran @${mentioned.split('@')[0]} yak? 
    
Tingkat keprocastinatoran dia sebesar *${percent}%*
\`\`\`${desc}\`\`\``
    
    await m.reply(txt, { mentions: [mentioned] })
}

export { pluginConfig as config, handler }