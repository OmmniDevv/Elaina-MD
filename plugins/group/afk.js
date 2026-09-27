/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const afkStorage = global.afkStorage || (global.afkStorage = new Map())

const pluginConfig = {
    name: 'afk',
    alias: ['away', 'brb'],
    category: 'group',
    description: 'Set status AFK dengan alasan',
    usage: '.afk <alasan>',
    example: '.afk lagi makan',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

function getAfkUser(jid) {
    return afkStorage.get(jid) || null
}

function setAfkUser(jid, reason) {
    afkStorage.set(jid, {
        reason: reason || 'Tidak ada alasan',
        time: Date.now()
    })
}

function removeAfkUser(jid) {
    afkStorage.delete(jid)
}

function isUserAfk(jid) {
    return afkStorage.has(jid)
}

function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    if (hours > 0) {
        return `${hours} jam ${minutes % 60} menit`
    } else if (minutes > 0) {
        return `${minutes} menit ${seconds % 60} detik`
    } else {
        return `${seconds} detik`
    }
}

async function handler(m, { sock }) {
    const reason = m.text || 'Tidak ada alasan'
    setAfkUser(m.sender, reason)
    await m.reply(
        `💤 *ᴀꜰᴋ ᴀᴋᴛɪꜰ*\n\n` +
        `\`\`\`@${m.sender.split('@')[0]} sekarang AFK\`\`\`\n` +
        `🍀 \`Alasan:\` *${reason}*\n\n` +
        `_Ketik apapun untuk menonaktifkan AFK._`,
        { mentions: [m.sender] }
    )
}

async function checkAfk(m, sock) {
    const afkData = getAfkUser(m.sender)
    if (afkData) {
        if (m.isCommand && m.command?.toLowerCase() === 'afk') return
        removeAfkUser(m.sender)
        const duration = formatDuration(Date.now() - afkData.time)
        await m.reply(`👋 *ᴀꜰᴋ ʙᴇʀᴀᴋʜɪʀ*\n\n` +
                `\`\`\`@${m.sender.split('@')[0]} sudah kembali!\`\`\`\n` +
                `🍀 \`Durasi AFK:\` *${duration}*`, { mentions: [m.sender] })
    }
    if (m.isGroup && m.mentionedJid && m.mentionedJid.length > 0) {
        for (const mentioned of m.mentionedJid) {
            const mentionedAfk = getAfkUser(mentioned)
            if (mentionedAfk) {
                const duration = formatDuration(Date.now() - mentionedAfk.time)
                await m.reply(`💤 *ᴜsᴇʀ ᴀꜰᴋ*\n\n` +
                        `\`\`\`Hustt, jangan di ganggu!\`\`\` \`@${mentioned.split('@')[0]}\` lagi AFK\n` +
                        `🍀 \`Alasan:\` *${mentionedAfk.reason}*\n` +
                        `🍀 \`Sejak:\` *${duration} yang lalu*`, { mentions: [mentioned] })
            }
        }
    }
}

export { pluginConfig as config, handler, checkAfk, getAfkUser, setAfkUser, removeAfkUser, isUserAfk }