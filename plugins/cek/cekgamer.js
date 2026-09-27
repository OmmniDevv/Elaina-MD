/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'cekgamer',
    alias: ['gamer', 'pro'],
    category: 'cek',
    description: 'Cek seberapa pro gamer kamu',
    usage: '.cekgamer <nama>',
    example: '.cekgamer Budi',
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
        desc = 'PRO PLAYER! Esports level! 🏆'
    } else if (percent >= 70) {
        desc = 'Jago banget! 🎮'
    } else if (percent >= 50) {
        desc = 'Lumayan pro 👍'
    } else if (percent >= 30) {
        desc = 'Masih noob nih 😅'
    } else {
        desc = 'Mending main masak-masakan 🍳'
    }
    
    let txt = mentioned === m.sender ? `Hai @${mentioned.split('@')[0]}
    
Tingkat kegameran kamu *${percent}%*
\`\`\`${desc}\`\`\`` : `Kamu ingin ngecek tingkat kegameran @${mentioned.split('@')[0]} yak? 
    
Tingkat kegameran dia sebesar *${percent}%*
\`\`\`${desc}\`\`\``
    
    await m.reply(txt, { mentions: [mentioned] })
}

export { pluginConfig as config, handler }