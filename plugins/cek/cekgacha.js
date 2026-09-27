/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'cekgacha',
    alias: ['gacha', 'luck'],
    category: 'cek',
    description: 'Cek hoki gacha kamu',
    usage: '.cekgacha <nama>',
    example: '.cekgacha Budi',
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
    if (percent >= 90) desc = 'HOKI PARAH! SSR GUARANTEED! ✨💎'
    else if (percent >= 70) desc = 'Lucky! Pasti dapet SR keatas! 🍀'
    else if (percent >= 50) desc = 'Hoki-hoki dikit 😊'
    else if (percent >= 30) desc = 'Hmm... pray harder! 🙏'
    else desc = 'SIAL! Nanti aja gachanya! 💔'
    
    let txt = mentioned === m.sender ? `Hai @${mentioned.split('@')[0]}
    
Tingkat kegachaan kamu *${percent}%*
\`\`\`${desc}\`\`\`` : `Kamu ingin ngecek tingkat kegachaan @${mentioned.split('@')[0]} yak? 
    
Tingkat kegachaan dia sebesar *${percent}%*
\`\`\`${desc}\`\`\``
    
    await m.reply(txt, { mentions: [mentioned] })
}

export { pluginConfig as config, handler }