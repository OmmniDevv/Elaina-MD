/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'cekkece',
    alias: ['kece', 'cool'],
    category: 'cek',
    description: 'Cek seberapa kece kamu',
    usage: '.cekkece <nama>',
    example: '.cekkece Budi',
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
        desc = 'KECE BADAI! 😎🔥'
    } else if (percent >= 70) {
        desc = 'Kece banget! ✨'
    } else if (percent >= 50) {
        desc = 'Lumayan kece~ 👍'
    } else if (percent >= 30) {
        desc = 'Sedikit kece 😊'
    } else {
        desc = 'Biasa aja, tapi tetep keren! 🙂'
    }
    
    let txt = mentioned === m.sender ? `Hai @${mentioned.split('@')[0]}
    
Tingkat kekecean kamu *${percent}%*
\`\`\`${desc}\`\`\`` : `Kamu ingin ngecek tingkat kekecean @${mentioned.split('@')[0]} yak? 
    
Tingkat kekecean dia sebesar *${percent}%*
\`\`\`${desc}\`\`\``
    
    await m.reply(txt, { mentions: [mentioned] })
}

export { pluginConfig as config, handler }