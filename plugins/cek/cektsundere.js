/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'cektsundere',
    alias: ['tsundere'],
    category: 'cek',
    description: 'Cek tingkat tsundere kamu',
    usage: '.cektsundere <nama>',
    example: '.cektsundere Budi',
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
    if (percent >= 90) desc = 'BAKA! B-BUKAN BERARTI AKU SUKA! 😤💢'
    else if (percent >= 70) desc = 'Hmph! Jangan salah paham ya! 😳'
    else if (percent >= 50) desc = 'Y-yah terserah kamu deh... 👉👈'
    else if (percent >= 30) desc = 'Agak tsundere dikit~ 😊'
    else desc = 'Bukan tsundere, jujur aja kok 💕'
    
    let txt = mentioned === m.sender ? `Hai @${mentioned.split('@')[0]}
    
Tingkat ketsunderean kamu *${percent}%*
\`\`\`${desc}\`\`\`` : `Kamu ingin ngecek tingkat ketsunderean @${mentioned.split('@')[0]} yak? 
    
Tingkat ketsunderean dia sebesar *${percent}%*
\`\`\`${desc}\`\`\``
    
    await m.reply(txt, { mentions: [mentioned] })
}

export { pluginConfig as config, handler }