/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'getppgc',
    alias: ['ppgc'],
    category: 'group',
    description: 'Mengambil foto profile group',
    usage: '.getppgc',
    example: '.getppgc',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    cooldown: 10,
    energi: 3,
    isEnabled: true
}

async function handler(m, { sock, config }) {

    const group = await sock.groupMetadata(m.chat)
    const sender = m.sender

    const admins = group.participants
        .filter(v => v.admin)
        .map(v => v.id)

    const ownerNumbers = config.owner?.number || []

    const isAdmin = admins.includes(sender)
    const isCreator = ownerNumbers.some(num => sender.includes(num))

    if (!isAdmin && !isCreator) {
        return m.reply(`👿 *Ara ara~*

Fitur ini hanya bisa digunakan oleh *Admin Group* atau *Creator Bot* ya darling 💗`)
    }

    await m.reply(`💗 *Siap darling~*
Tunggu sebentar ya...
Aku ambil dulu foto group ini 👀`)

    let pp

    try {
        pp = await sock.profilePictureUrl(m.chat, 'image')
    } catch {
        pp = 'https://cdn.gimita.id/download/pp%20kosong%20wa%20default%20(1)_1769506608569_52b57f5b.jpg'
    }

    const caption = `👿 *GROUP PROFILE DETECTED*

Ara ara~ ini dia foto group kalian darling 📸

Jaga baik-baik group ini ya~
Rimuru selalu mengawasi group ini 👀💗`

    await sock.sendMessage(m.chat, {
        image: { url: pp },
        caption
    }, { quoted: m.raw })
}

export { pluginConfig as config, handler };
