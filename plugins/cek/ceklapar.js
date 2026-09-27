/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'ceklapar',
    alias: ['lapar', 'hungry'],
    category: 'cek',
    description: 'Cek tingkat kelaparan kamu',
    usage: '.ceklapar <nama>',
    example: '.ceklapar Budi',
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
    if (percent >= 90) desc = 'LAPARRR! Makan sekarang! 🍔🍕🍜'
    else if (percent >= 70) desc = 'Perut keroncongan~ 😋'
    else if (percent >= 50) desc = 'Bisa lah ngemil 🍿'
    else if (percent >= 30) desc = 'Masih kenyang 😊'
    else desc = 'Kekenyangan! 🤰'
    
    let txt = mentioned === m.sender ? `Hai @${mentioned.split('@')[0]}
    
Tingkat kelaparan kamu *${percent}%*
\`\`\`${desc}\`\`\`` : `Kamu ingin ngecek tingkat kelaparan @${mentioned.split('@')[0]} yak? 
    
Tingkat kelaparan dia sebesar *${percent}%*
\`\`\`${desc}\`\`\``
    
    await m.reply(txt, { mentions: [mentioned] })
}

export { pluginConfig as config, handler }