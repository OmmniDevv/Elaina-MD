/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'cekbucin',
    alias: ['bucin'],
    category: 'cek',
    description: 'Cek seberapa bucin kamu',
    usage: '.cekbucin <nama>',
    example: '.cekbucin Budi',
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
    if (percent >= 90) {
        desc = 'BUCIN AKUT! Udah gabisa diselamatkan 😭💔'
    } else if (percent >= 70) {
        desc = 'Bucin parah nih~ 🥺'
    } else if (percent >= 50) {
        desc = 'Lumayan bucin 💕'
    } else if (percent >= 30) {
        desc = 'Sedikit bucin 😊'
    } else {
        desc = 'Santai aja, gak bucin 😎'
    }
    
    let txt = mentioned === m.sender ? `Hai @${mentioned.split('@')[0]}
    
Tingkat kebucinan kamu *${percent}%*
\`\`\`${desc}\`\`\`` : `Kamu ingin ngecek tingkat kebucinan @${mentioned.split('@')[0]} yak? 
    
Tingkat kebucinan dia sebesar *${percent}%*
\`\`\`${desc}\`\`\``
    
    await m.reply(txt, { mentions: [mentioned] })
}

export { pluginConfig as config, handler }