/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'ceksisaumur',
    alias: ['sisaumur', 'umur'],
    category: 'cek',
    description: 'Cek sisa umur kamu',
    usage: '.ceksisaumur <nama>',
    example: '.ceksisaumur Budi',
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

        
    const tahun = Math.floor(Math.random() * 80) + 20
    const bulan = Math.floor(Math.random() * 12)
    const hari = Math.floor(Math.random() * 30)
    
    let desc = ''
    if (tahun > 80) {
        desc = 'Panjang umur banget! 🎉'
    } else if (tahun > 60) {
        desc = 'Lumayan panjang~ ✨'
    } else if (tahun > 40) {
        desc = 'Cukup lah ya 😊'
    } else {
        desc = 'Jaga kesehatan ya! 🙏'
    }
    
    let txt = mentioned === m.sender ? `Hai @${mentioned.split('@')[0]}
    
Sisa umur kamu *${tahun} Tahun ${bulan} Bulan ${hari} Hari*
\`\`\`${desc}\`\`\`` : `Kamu ingin ngecek tingkat kesisaumuran @${mentioned.split('@')[0]} yak? 
    
Sisa umur dia sebesar *${tahun} Tahun ${bulan} Bulan ${hari} Hari*
\`\`\`${desc}\`\`\``
    
    await m.reply(txt, { mentions: [mentioned] })
}

export { pluginConfig as config, handler }