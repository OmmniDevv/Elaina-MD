/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'cekjodoh',
    alias: ['jodoh', 'match'],
    category: 'cek',
    description: 'Cek kecocokan jodoh',
    usage: '.cekjodoh <nama1> & <nama2>',
    example: '.cekjodoh Budi & Ani',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m) {
    const input = m.text?.trim() || ''
    const parts = input.split(/[&,]/).map(s => s.trim()).filter(s => s)
    
    if (parts.length < 2) {
        return m.reply(`💕 *ᴄᴇᴋ ᴊᴏᴅᴏʜ*\n\n> Masukkan 2 nama!\n\n> Contoh: ${m.prefix}cekjodoh Budi & Ani`)
    }
    
    const percent = Math.floor(Math.random() * 101)
    const mentioned = m.mentionedJid[0] || m.sender
                    
    let desc = ''
    if (percent >= 90) {
        desc = 'Jodoh banget! Langsung nikah aja! 💍'
    } else if (percent >= 70) {
        desc = 'Cocok banget! 💕'
    } else if (percent >= 50) {
        desc = 'Lumayan cocok~ 😊'
    } else if (percent >= 30) {
        desc = 'Hmm, perlu usaha lebih 🤔'
    } else {
        desc = 'Mungkin cari yang lain? 😅'
    }
    
    let txt = mentioned === m.sender ? `Hai @${mentioned.split('@')[0]}
    
Tingkat kejodohan kamu *${percent}%*
\`\`\`${desc}\`\`\`` : `Kamu ingin ngecek tingkat kejodohan @${mentioned.split('@')[0]} yak? 
    
Tingkat kejodohan dia sebesar *${percent}%*
\`\`\`${desc}\`\`\``
    
    await m.reply(txt, { mentions: [mentioned] })
}

export { pluginConfig as config, handler }