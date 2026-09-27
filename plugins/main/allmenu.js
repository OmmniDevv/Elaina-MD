// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import fetch from 'node-fetch'

const CATEGORY_ORDER = [
    'owner', 'main', 'downloader', 'sticker', 'tools', 'group',
    'ai', 'game', 'rpg', 'fun', 'xp', 'info', 'internet',
    'islamic', 'quotes', 'random', 'audio', 'anime', 'canvas', 'nsfw'
]
const CATEGORY_EMOJIS = {
    owner: '👑', main: '🏠', downloader: '📥', sticker: '🖼️',
    tools: '🔧', group: '👥', ai: '🤖', game: '🎮', rpg: '⚔️',
    fun: '🎉', xp: '📊', info: 'ℹ️', internet: '🌐', islamic: '☪️',
    quotes: '💬', random: '🎲', audio: '🎵', anime: '🌸', canvas: '🎨',
    nsfw: '🔞'
}

function buildCommandMap() {
    const map = {}
    for (const [, plugin] of Object.entries(global.plugins || {})) {
        if (!plugin || plugin.disabled) continue
        const tags = Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags || 'main']
        const helps = Array.isArray(plugin.help) ? plugin.help : (plugin.help ? [plugin.help] : null)
        if (!helps) continue
        for (const tag of tags) {
            if (!map[tag]) map[tag] = []
            for (const help of helps) {
                if (help) map[tag].push({ name: help, owner: !!plugin.owner, premium: !!plugin.premium, limit: !!plugin.limit })
            }
        }
    }
    return map
}

let handler = async (m, { conn, usedPrefix, isOwner }) => {
    const cmdMap = buildCommandMap()
    let totalCmds = 0
    for (const cmds of Object.values(cmdMap)) totalCmds += cmds.length

    const extraTags = Object.keys(cmdMap).filter(t => !CATEGORY_ORDER.includes(t))
    const allTags = [...CATEGORY_ORDER, ...extraTags]

    let body = `Hai *@${m.sender.split('@')[0]}* 🪸\n\n`
    body += `╭─〔 📖 \`ᴋᴇᴛᴇʀᴀɴɢᴀɴ\` 〕─⬣\n│ ✦ *Ⓞ = Owner Only*\n│ ✦ *ⓟ = Premium Only*\n│ ✦ *Ⓛ = Limit Required*\n╰─⬣\n\n`

    for (const tag of allTags) {
        const cmds = cmdMap[tag]
        if (!cmds || cmds.length === 0) continue
        if (tag === 'owner' && !isOwner) continue
        const emoji = CATEGORY_EMOJIS[tag] || '📁'
        body += `╭─〔 ${emoji} \`${tag.toUpperCase()}\` 〕─⬣\n`
        for (const cmd of cmds) {
            const sym = [cmd.owner ? 'Ⓞ' : '', cmd.premium ? 'ⓟ' : '', cmd.limit ? 'Ⓛ' : ''].filter(Boolean).join(' ')
            body += `│ ✦ *${usedPrefix}${cmd.name}*${sym ? ' ' + sym : ''}\n`
        }
        body += `╰─⬣\n\n`
    }
    body += `_© ${global.namebot} | ${global.wmcredit}_`

    let thumbBuffer = null
    try {
        const { readFileSync } = await import('fs')
        thumbBuffer = readFileSync(global.thumbAllmenu || global.thumb2 || global.thumb)
    } catch { }

    let thumbSmall = thumbBuffer
    if (thumbBuffer) {
        try {
            const sharp = (await import('sharp')).default
            thumbSmall = await sharp(thumbBuffer).resize(300, 300, { fit: 'cover' }).jpeg({ quality: 80 }).toBuffer()
        } catch { thumbSmall = thumbBuffer }
    }

    const ftroliQuoted = {
        key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
        message: {
            orderMessage: {
                orderId: '1337',
                thumbnail: thumbSmall || null,
                itemCount: totalCmds,
                status: 'INQUIRY',
                surface: 'CATALOG',
                message: `${global.namebot} — ${totalCmds} Commands`,
                orderTitle: `📋 ${totalCmds} Commands`,
                sellerJid: `${global.nomorbot}@s.whatsapp.net`,
                token: 'elaina-allmenu',
                totalAmount1000: 0,
                totalCurrencyCode: 'IDR',
                contextInfo: {
                    isForwarded: true,
                    forwardingScore: 9999,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363208449943317@newsletter',
                        newsletterName: global.namebot,
                        serverMessageId: 127
                    }
                }
            }
        }
    }

    const contextInfo = {
        mentionedJid: [m.sender],
        forwardingScore: 9,
        isForwarded: true
    }

    await conn.sendMessage(m.chat, { text: body, contextInfo }, { quoted: ftroliQuoted })
}

handler.help = ['allmenu', 'fullmenu', 'am']
handler.tags = ['main']
handler.command = /^(allmenu|fullmenu|am|semua)$/i
handler.owner = false
handler.premium = false

export default handler
