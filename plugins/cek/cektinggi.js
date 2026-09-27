/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'cektinggi',
    alias: ['tinggi', 'tall'],
    category: 'cek',
    description: 'Cek tinggi badan random',
    usage: '.cektinggi <nama>',
    example: '.cektinggi Budi',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m) {
        const mentioned = m.mentionedJid[0] || m.sender

        const tinggi = Math.floor(Math.random() * 50) + 150
    
    let desc = ''
    if (tinggi >= 190) {
        desc = 'TINGGI BANGET! Model basketball! 🏀'
    } else if (tinggi >= 175) {
        desc = 'Tinggi ideal! 😎'
    } else if (tinggi >= 165) {
        desc = 'Lumayan tinggi 👍'
    } else if (tinggi >= 155) {
        desc = 'Standard kok 🙂'
    } else {
        desc = 'Imut dan mungil! 🥺'
    }
    
    let txt = mentioned === m.sender ? `Hai @${mentioned.split('@')[0]}
    
Tinggi badan kamu *${tinggi} cm*
\`\`\`${desc}\`\`\`` : `Kamu ingin ngecek tingkat ketinggian @${mentioned.split('@')[0]} yak? 
    
Tinggi badan dia sebesar *${tinggi} cm*
\`\`\`${desc}\`\`\``
    
    await m.reply(txt, { mentions: [mentioned] })
}

export { pluginConfig as config, handler }