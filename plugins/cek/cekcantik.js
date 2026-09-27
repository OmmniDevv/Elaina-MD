/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'cekcantik',
    alias: ['cantik', 'beautiful'],
    category: 'cek',
    description: 'Cek seberapa cantik kamu',
    usage: '.cekcantik <nama>',
    example: '.cekcantik Ani',
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
        desc = 'Cantik banget kayak bidadari! 👸✨'
    } else if (percent >= 70) {
        desc = 'Cantik banget! 💕'
    } else if (percent >= 50) {
        desc = 'Manis dan cantik~ 🌸'
    } else if (percent >= 30) {
        desc = 'Lumayan cantik 😊'
    } else {
        desc = 'Tetep cantik kok! 💖'
    }
    
    let txt = mentioned === m.sender ? `Hai @${mentioned.split('@')[0]}
    
Tingkat kecantikan kamu *${percent}%*
\`\`\`${desc}\`\`\`` : `Kamu ingin ngecek tingkat kecantikan @${mentioned.split('@')[0]} yak? 
    
Tingkat kecantikan dia sebesar *${percent}%*
\`\`\`${desc}\`\`\``
    
    await m.reply(txt, { mentions: [mentioned] })
}

export { pluginConfig as config, handler }