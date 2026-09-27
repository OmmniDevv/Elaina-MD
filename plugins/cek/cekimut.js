/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'cekimut',
    alias: ['imut', 'cute'],
    category: 'cek',
    description: 'Cek seberapa imut kamu',
    usage: '.cekimut <nama>',
    example: '.cekimut Ani',
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
        desc = 'IMUT BANGET! Kawaii~~ 🥺💕'
    } else if (percent >= 70) {
        desc = 'Imutnya kebangetan! 😍'
    } else if (percent >= 50) {
        desc = 'Lumayan imut~ 🌸'
    } else if (percent >= 30) {
        desc = 'Ada imutnya dikit 😊'
    } else {
        desc = 'Mungkin cool bukan imut? 😎'
    }
    
    let txt = mentioned === m.sender ? `Hai @${mentioned.split('@')[0]}
    
Tingkat keimutan kamu *${percent}%*
\`\`\`${desc}\`\`\`` : `Kamu ingin ngecek tingkat keimutan @${mentioned.split('@')[0]} yak? 
    
Tingkat keimutan dia sebesar *${percent}%*
\`\`\`${desc}\`\`\``
    
    await m.reply(txt, { mentions: [mentioned] })
}

export { pluginConfig as config, handler }