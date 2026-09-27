// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import fetch from 'node-fetch'

const CATEGORY_EMOJIS = {
    owner: '👑', main: '🏠', downloader: '📥', sticker: '🖼️',
    tools: '🔧', group: '👥', ai: '🤖', game: '🎮', rpg: '⚔️',
    fun: '🎉', xp: '📊', info: 'ℹ️', internet: '🌐', islamic: '☪️',
    quotes: '💬', random: '🎲', audio: '🎵', anime: '🌸', canvas: '🎨',
    nsfw: '🔞'
}

const CATEGORY_ORDER = [
    'owner', 'main', 'downloader', 'sticker', 'tools', 'group',
    'ai', 'game', 'rpg', 'fun', 'xp', 'info', 'internet',
    'islamic', 'quotes', 'random', 'audio', 'anime', 'canvas', 'nsfw'
]

function clockString(ms) {
    let h = Math.floor(ms / 3600000)
    let m = Math.floor((ms % 3600000) / 60000)
    let s = Math.floor((ms % 60000) / 1000)
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}

function getTimeGreeting() {
    const hour = new Date(Date.now() + 7 * 3600000).getUTCHours()
    if (hour >= 4 && hour < 11) return 'Selamat Pagi 🌅'
    if (hour >= 11 && hour < 15) return 'Selamat Siang ☀️'
    if (hour >= 15 && hour < 19) return 'Selamat Sore 🌆'
    return 'Selamat Malam 🌙'
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
                if (help) map[tag].push(help)
            }
        }
    }
    return map
}

function getSortedCats(cmdMap, isOwner) {
    const exclude = ['panel', 'pushkontak', 'store']
    return [...new Set([...CATEGORY_ORDER, ...Object.keys(cmdMap)])]
        .sort((a, b) => {
            const ia = CATEGORY_ORDER.indexOf(a), ib = CATEGORY_ORDER.indexOf(b)
            return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib)
        })
        .filter(cat => cmdMap[cat]?.length > 0 && !(cat === 'owner' && !isOwner) && !exclude.includes(cat))
}

let handler = async (m, { conn, usedPrefix, isOwner, isPrems }) => {
    const user = global.db?.data?.users?.[m.sender] || {}
    const pushName = m.pushName || m.name || 'Kamu'
    const uptime = clockString(process.uptime() * 1000)
    const greeting = getTimeGreeting()
    const now = new Date(Date.now() + 7 * 3600000)
    const timeStr = now.toLocaleTimeString('id', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    const role = isOwner ? '👑 Owner' : isPrems ? '💎 Premium' : '👤 User'

    const cmdMap = buildCommandMap()
    let totalCmds = 0
    for (const cmds of Object.values(cmdMap)) totalCmds += cmds.length
    const sortedCats = getSortedCats(cmdMap, isOwner)

    // Load thumbnails from local file
    let thumbBuffer = null, thumbSmall = null, thumb2Buffer = null
    try {
        const { readFileSync } = await import('fs')
        const sharp = (await import('sharp')).default
        const raw1 = readFileSync(global.thumb)
        const raw2 = readFileSync(global.thumb2)
        thumbBuffer = raw1
        thumb2Buffer = await sharp(raw2).resize(300, 300, { fit: 'cover' }).jpeg({ quality: 85 }).toBuffer()
        thumbSmall = await sharp(raw1).resize(300, 300, { fit: 'cover' }).jpeg({ quality: 80 }).toBuffer()
    } catch { }

    // Category rows untuk single_select dropdown (variant 15)
    const catRows = sortedCats.map(cat => ({
        title: `${CATEGORY_EMOJIS[cat] || '📁'} ${cat.toUpperCase()} MENU`,
        description: `${cmdMap[cat].length} commands`,
        id: `${usedPrefix}menucat ${cat}`
    }))

    // Buttons (variant 15 style — tanpa call_permission_request)
    const buttons = [
        {
            name: 'single_select',
            buttonParamsJson: JSON.stringify({ has_multiple_buttons: true })
        },
        {
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({ display_text: '🌺 Lihat Semua Menu', id: `${usedPrefix}allmenu` })
        },
        {
            name: 'single_select',
            buttonParamsJson: JSON.stringify({
                title: '📁 Pilih Kategori',
                sections: [{ title: '📋 PILIH CATEGORY', rows: catRows }],
                has_multiple_buttons: true
            })
        }
    ]

    // ftroliQuoted — orderMessage
    const ftroliQuoted = {
        key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
        message: {
            orderMessage: {
                orderId: '1337',
                thumbnail: thumb2Buffer || thumbSmall || null,
                itemCount: totalCmds,
                status: 'INQUIRY',
                surface: 'CATALOG',
                message: `★ Terima kasih\n✦ Ada Error? Lapor owner`,
                orderTitle: `📋 ${totalCmds} Commands`,
                sellerJid: `${global.nomorbot}@s.whatsapp.net`,
                token: 'elaina-menu',
                totalAmount1000: 0,
                totalCurrencyCode: 'IDR',
                contextInfo: {
                    isForwarded: true,
                    forwardingScore: 9,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363208449943317@newsletter',
                        newsletterName: global.namebot,
                        serverMessageId: 127
                    }
                }
            }
        }
    }

    const footerText = `Hai *${pushName}* 👋
Selamat datang di *${global.namebot}* ✨

╭─〔 🤖 \`ʙᴏᴛ ɪɴꜰᴏ\` 〕─⬣
│ ✦ *ɴᴀᴍᴀ : ${global.namebot}*
│ ✦ *ᴘʀᴇꜰɪx : [ ${usedPrefix} ]*
│ ✦ *ᴜᴘᴛɪᴍᴇ : ${uptime}*
│ ✦ *ᴛᴏᴛᴀʟ ᴄᴍᴅ : ${totalCmds} commands*
│ ✦ *ᴏᴡɴᴇʀ : ${global.nameown}*
│ ✦ *${greeting}*
╰─⬣

╭─〔 👤 \`ᴜsᴇʀ ɪɴꜰᴏ\` 〕─⬣
│ ✦ *ɴᴀᴍᴀ : ${pushName}*
│ ✦ *ʀᴏʟᴇ : ${role}*
│ ✦ *ʟᴇᴠᴇʟ : ${user.level || 1}*
│ ✦ *ᴇxᴘ : ${user.exp || 0}*
│ ✦ *ʟɪᴍɪᴛ : ${user.limit || 0}*
│ ✦ *ᴡᴀᴋᴛᴜ : ${timeStr} WIB*
╰─⬣

Silahkan tekan tombol di bawah untuk memilih kategori
_© ${global.namebot} | ${global.wmcredit}_`

    try {
        // variant 15: raw interactiveMessage via sendMessage (bukan generateWAMessageFromContent)
        await conn.sendMessage(m.chat, {
            interactiveMessage: {
                title: '',
                footer: footerText,
                document: Buffer.from(JSON.stringify({ bot: global.namebot })),
                mimetype: 'image/jpeg',
                jpegThumbnail: thumbSmall,
                contextInfo: {
                    mentionedJid: [],
                    forwardingScore: 7,
                    isForwarded: true
                },
                
                nativeFlowMessage: {
                    messageParamsJson: JSON.stringify({
                        bottom_sheet: {
                            in_thread_buttons_limit: 2,
                            divider_indices: [1, 2, 3, 999],
                            list_title: 'Silahkan pilih menu yang kamu inginkan',
                            button_title: '🍀 Pilih Kategori'
                        }
                    }),
                    buttons
                }
            }
        }, { quoted: ftroliQuoted })
    } catch (e) {
        console.error('[Menu]', e.message)
        throw e
    }
}

handler.help = ['menu', 'help', 'm']
handler.tags = ['main']
handler.command = /^(menu|help|m|bantuan)$/i
handler.owner = false
handler.premium = false

export default handler
