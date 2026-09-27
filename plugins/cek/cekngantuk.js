/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'cekngantuk',
    alias: ['ngantuk', 'sleepy'],
    category: 'cek',
    description: 'Cek tingkat ngantuk kamu',
    usage: '.cekngantuk <nama>',
    example: '.cekngantuk Budi',
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
    if (percent >= 90) desc = 'ZZZZZ... Tidur sana! 😴💤'
    else if (percent >= 70) desc = 'Mata 5 watt nih~ 😪'
    else if (percent >= 50) desc = 'Agak ngantuk dikit 🥱'
    else if (percent >= 30) desc = 'Masih fresh! ☕'
    else desc = 'Melek banget! Insomnia? 👀'
    
    let txt = mentioned === m.sender ? `Hai @${mentioned.split('@')[0]}
    
Tingkat kengantukan kamu *${percent}%*
\`\`\`${desc}\`\`\`` : `Kamu ingin ngecek tingkat kengantukan @${mentioned.split('@')[0]} yak? 
    
Tingkat kengantukan dia sebesar *${percent}%*
\`\`\`${desc}\`\`\``
    
    await m.reply(txt, { mentions: [mentioned] })
}

export { pluginConfig as config, handler }