/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'cekpintar',
    alias: ['pintar', 'iq', 'smart'],
    category: 'cek',
    description: 'Cek seberapa pintar kamu',
    usage: '.cekpintar <nama>',
    example: '.cekpintar Budi',
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

        const iq = Math.floor(Math.random() * 100) + 70
    
    let desc = ''
    if (iq >= 150) {
        desc = 'JENIUS! Einstein level! 🧠✨'
    } else if (iq >= 130) {
        desc = 'Sangat cerdas! 🎓'
    } else if (iq >= 110) {
        desc = 'Di atas rata-rata! 👍'
    } else if (iq >= 90) {
        desc = 'Normal, rata-rata 😊'
    } else {
        desc = 'Tetap semangat belajar! 📚'
    }
    
    let txt = mentioned === m.sender ? `Hai @${mentioned.split('@')[0]}
    
Kepintaran (IQ) kamu *${iq}*
\`\`\`${desc}\`\`\`` : `Kamu ingin ngecek kepintaran @${mentioned.split('@')[0]} yak? 
    
Kepintaran (IQ) dia sebesar *${iq}*
\`\`\`${desc}\`\`\``
    
    await m.reply(txt, { mentions: [mentioned] })
}

export { pluginConfig as config, handler }