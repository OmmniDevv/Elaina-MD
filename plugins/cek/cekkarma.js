/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'cekkarma',
    alias: ['karma'],
    category: 'cek',
    description: 'Cek tingkat karma kamu',
    usage: '.cekkarma <nama>',
    example: '.cekkarma Budi',
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
    if (percent >= 80) desc = 'Karma baik! Surga menantimu~ ✨'
    else if (percent >= 60) desc = 'Cukup baik, terus tingkatkan! 🙏'
    else if (percent >= 40) desc = 'Netral, perbanyak kebaikan~ ⚖️'
    else if (percent >= 20) desc = 'Hati-hati dengan karma buruk! ⚠️'
    else desc = 'Wah perlu banyak tobat nih... 😱'
    
    let txt = mentioned === m.sender ? `Hai @${mentioned.split('@')[0]}
    
Tingkat kekarmaan kamu *${percent}%*
\`\`\`${desc}\`\`\`` : `Kamu ingin ngecek tingkat kekarmaan @${mentioned.split('@')[0]} yak? 
    
Tingkat kekarmaan dia sebesar *${percent}%*
\`\`\`${desc}\`\`\``
    
    await m.reply(txt, { mentions: [mentioned] })
}

export { pluginConfig as config, handler }