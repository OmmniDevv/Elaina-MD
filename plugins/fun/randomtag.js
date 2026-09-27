/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'randomtag',
    alias: ['rtag'],
    category: 'group',
    description: 'Tag member random di group',
    usage: '.randomtag',
    example: '.randomtag',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    cooldown: 10,
    energi: 5,
    isEnabled: true
}

async function handler(m, { sock }) {

    const group = await sock.groupMetadata(m.chat)
    const members = group.participants
        .map(v => v.id)
        .filter(v => v !== sock.user.id)

    if (members.length === 0) {
        return m.reply(`Hmm... sepertinya tidak ada member yang bisa aku pilih darling.`)
    }

    const random = members[Math.floor(Math.random() * members.length)]

    const teks = `🎲 *RIMURU RANDOM SELECT*

Ara ara~

Hari ini aku memilih seseorang secara acak di group ini...

✨ Target terpilih adalah...

💗 @${random.split('@')[0]}

Jangan kaget ya darling~
Sepertinya kamu sedang diperhatikan olehku 👀`

    await sock.sendMessage(m.chat, {
        text: teks,
        mentions: [random]
    }, { quoted: m.raw })
}

export { pluginConfig as config, handler };
