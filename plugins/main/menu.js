// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// Menu kartu + tombol kategori (dropdown) + tombol cepat.
// Transport: MB.Button bawaan paket (relayMessage + node biz/interactive/native_flow).
// TANPA externalAdReply — sudah tidak didukung WA dan bikin pesan gagal terkirim.
// Fallback berlapis supaya menu tetap sampai walau klien tidak dukung native flow.
import fetch from 'node-fetch'
import { MB } from '@rexxhayanasi/elaina-baileys'

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

const NEWSLETTER_JID = '120363208449943317@newsletter'

function clockString(ms) {
    const h = Math.floor(ms / 3600000)
    const m = Math.floor((ms % 3600000) / 60000)
    const s = Math.floor((ms % 60000) / 1000)
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
                if (help) map[tag].push({ name: help, owner: !!plugin.owner, premium: !!plugin.premium, limit: !!plugin.limit })
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

// Thumbnail: pakai gambar bawaan Elaina (global.thumb), bukan file baru.
async function loadThumb() {
    try {
        const { readFileSync } = await import('fs')
        const sharp = (await import('sharp')).default
        const raw = readFileSync(global.thumb)
        return await sharp(raw).resize(300, 300, { fit: 'cover' }).jpeg({ quality: 85 }).toBuffer()
    } catch {
        return null
    }
}

function orderQuoted(buffer, itemCount, title, token) {
    return {
        key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
        message: {
            orderMessage: {
                orderId: '1337',
                thumbnail: buffer || null,
                itemCount,
                status: 'INQUIRY',
                surface: 'CATALOG',
                message: `★ Terima kasih\n✦ Ada Error? Lapor owner`,
                orderTitle: title,
                sellerJid: `${global.nomorbot}@s.whatsapp.net`,
                token,
                totalAmount1000: 0,
                totalCurrencyCode: 'IDR',
                contextInfo: {
                    isForwarded: true,
                    forwardingScore: 9,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: NEWSLETTER_JID,
                        newsletterName: global.namebot,
                        serverMessageId: 127
                    }
                }
            }
        }
    }
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

    const thumb = await loadThumb()

    // Baris kategori → dropdown. Tap satu baris menjalankan .menucat <kategori>,
    // dan plugin menucat menampilkan seluruh command di kategori itu.
    const catRows = sortedCats.map(cat => ({
        header: '',
        title: `${CATEGORY_EMOJIS[cat] || '📁'} ${cat.toUpperCase()}`,
        description: `${cmdMap[cat].length} commands`,
        id: `${usedPrefix}menucat ${cat}`
    }))

    const bodyText =
`ʜᴀʟᴏ, ${pushName} 👋
${greeting}! ꜱᴇʟᴀᴍᴀᴛ ᴅᴀᴛᴀɴɢ ᴅɪ *${global.namebot}* ✨

┌─〔 🤖 \`ʙᴏᴛ ɪɴꜰᴏ\` 〕─⬣
│ ✦ *ɴᴀᴍᴀ :* ${global.namebot}
│ ✦ *ᴏᴡɴᴇʀ :* ${global.nameown}
│ ✦ *ᴘʀᴇꜰɪx :* [ ${usedPrefix} ]
│ ✦ *ᴜᴘᴛɪᴍᴇ :* ${uptime}
│ ✦ *ᴛᴏᴛᴀʟ ᴄᴍᴅ :* ${totalCmds} commands
╰─⬣

┌─〔 👤 \`ᴜsᴇʀ ɪɴꜰᴏ\` 〕─⬣
│ ✦ *ɴᴀᴍᴀ :* ${pushName}
│ ✦ *ʀᴏʟᴇ :* ${role}
│ ✦ *ʟᴇᴠᴇʟ :* ${user.level || 1}
│ ✦ *ᴇxᴘ :* ${user.exp || 0}
│ ✦ *ʟɪᴍɪᴛ :* ${user.limit || 0}
│ ✦ *ᴡᴀᴋᴛᴜ :* ${timeStr} WIB
╰─⬣

ᴛᴇᴋᴀɴ *ᴘɪʟɪʜ ᴋᴀᴛᴇɢᴏʀɪ* ᴜɴᴛᴜᴋ ᴍᴇʟɪʜᴀᴛ ꜱᴇᴍᴜᴀ ᴍᴇɴᴜ
ᴘᴇʀ ᴋᴀᴛᴇɢᴏʀɪ, ᴀᴛᴀᴜ ᴛᴇᴋᴀɴ ᴛᴏᴍʙᴏʟ ᴄᴇᴘᴀᴛ ᴅɪ ʙᴀᴡᴀʜ.`

    const footerText = `✦ ${global.namebot}  •  ${global.wmcredit}`

    const ctxInfo = {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: NEWSLETTER_JID,
            newsletterName: global.namebot,
            serverMessageId: 127
        }
    }

    const troli = orderQuoted(thumb, totalCmds, `📋 ${totalCmds} Commands`, 'elaina-menu')

    const githubUrl = 'https://github.com/OmmniDevv/Elaina-MD'
    const ownerWa = `https://wa.me/${global.nomorbot}`

    // ── Lapis 1: kartu + tombol via builder paket ──
    try {
        const b = new MB.Button(conn)
        b.setTitle(global.namebot)
        b.setSubtitle(`Owner: ${global.nameown}`)
        b.setBody(bodyText)
        b.setFooter(footerText)
        if (thumb) b.setImage(thumb)
        b.setContextInfo(ctxInfo)

        // Dropdown kategori (single_select + rows)
        b.addSelection('⌗ ᴅᴀꜰᴛᴀʀ ᴋᴀᴛᴇɢᴏʀɪ', { has_multiple_buttons: true })
        b.makeSection('𓍢ִ໋ ᴘɪʟɪʜ ᴋᴀᴛᴇɢᴏʀɪ ʏᴀɴɢ ᴋᴀᴍᴜ ɪɴɢɪɴᴋᴀɴ', global.namebot)
        for (const row of catRows) b.makeRow(row.header, row.title, row.description, row.id)

        // Tombol link & copy
        b.addUrl('🌐 ɢɪᴛʜᴜʙ ᴘʀᴏᴊᴇᴄᴛ', githubUrl, false, { merchant_url: githubUrl })
        b.addCopy('⎙ ᴄᴏᴘʏ ᴘʀᴇꜰɪx', usedPrefix)

        // Tombol cepat
        b.addReply('⟨⟩ ꜱᴇᴍᴜᴀ ᴄᴏᴍᴍᴀɴᴅ', `${usedPrefix}allmenu`)
        b.addReply('ⓘ ꜱᴛᴀᴛᴜꜱ ʙᴏᴛ', `${usedPrefix}ping`)
        b.addReply('👑 ᴏᴡɴᴇʀ', `${usedPrefix}owner`)

        return await b.send(m.chat, { quoted: troli })
    } catch (e1) {
        console.error('[menu] builder gagal:', e1.message)
    }

    // ── Lapis 2: interactiveMessage mentah → shim lib/simple.js ──
    try {
        await conn.sendMessage(m.chat, {
            interactiveMessage: {
                title: global.namebot,
                footer: footerText,
                document: thumb || Buffer.alloc(0),
                mimetype: 'image/jpeg',
                jpegThumbnail: thumb || null,
                contextInfo: ctxInfo,
                nativeFlowMessage: {
                    messageParamsJson: JSON.stringify({
                        bottom_sheet: {
                            in_thread_buttons_limit: 2,
                            divider_indices: [2, 3, 4, 5, 999],
                            list_title: 'ᴘɪʟɪʜ ᴋᴀᴛᴇɢᴏʀɪ ᴍᴇɴᴜ',
                            button_title: 'ᴊᴇʟᴀᴊᴀʜɪ ᴍᴇɴᴜ sᴇᴋᴀʀᴀɴɢ'
                        }
                    }),
                    buttons: [
                        {
                            name: 'single_select',
                            buttonParamsJson: JSON.stringify({
                                title: '⌗ ᴅᴀꜰᴛᴀʀ ᴋᴀᴛᴇɢᴏʀɪ',
                                sections: [{
                                    title: '𓍢ִ໋ ᴘɪʟɪʜ ᴋᴀᴛᴇɢᴏʀɪ ʏᴀɴɢ ᴋᴀᴍᴜ ɪɴɢɪɴᴋᴀɴ',
                                    highlight_label: global.namebot,
                                    rows: catRows
                                }],
                                has_multiple_buttons: true
                            })
                        },
                        {
                            name: 'cta_url',
                            buttonParamsJson: JSON.stringify({
                                display_text: '🌐 ɢɪᴛʜᴜʙ ᴘʀᴏᴊᴇᴄᴛ',
                                url: githubUrl,
                                merchant_url: githubUrl
                            })
                        },
                        {
                            name: 'cta_copy',
                            buttonParamsJson: JSON.stringify({
                                display_text: '⎙ ᴄᴏᴘʏ ᴘʀᴇꜰɪx',
                                copy_code: usedPrefix
                            })
                        },
                        {
                            name: 'quick_reply',
                            buttonParamsJson: JSON.stringify({ display_text: '⟨⟩ ꜱᴇᴍᴜᴀ ᴄᴏᴍᴍᴀɴᴅ', id: `${usedPrefix}allmenu` })
                        },
                        {
                            name: 'quick_reply',
                            buttonParamsJson: JSON.stringify({ display_text: 'ⓘ ꜱᴛᴀᴛᴜꜱ ʙᴏᴛ', id: `${usedPrefix}ping` })
                        },
                        {
                            name: 'quick_reply',
                            buttonParamsJson: JSON.stringify({ display_text: '👑 ᴏᴡɴᴇʀ', id: `${usedPrefix}owner` })
                        }
                    ]
                }
            }
        }, { quoted: troli })
        return
    } catch (e2) {
        console.error('[menu] shim gagal:', e2.message)
    }

    // ── Lapis 3: gambar bawaan + caption teks (dijamin tampil di klien apa pun) ──
    const textCats = sortedCats
        .map(cat => ` │ ${CATEGORY_EMOJIS[cat] || '📁'} *${cat.toUpperCase()}* — \`${cmdMap[cat].length}\` cmds · ${usedPrefix}menucat ${cat}`)
        .join('\n')

    const fallbackText =
`${bodyText}

┌─〔 📁 \`ᴋᴀᴛᴇɢᴏʀɪ\` 〕─⬣
${textCats}
╰─⬣

_© ${global.namebot} | ${global.wmcredit}_`

    if (thumb) {
        return conn.sendMessage(m.chat, {
            image: thumb,
            caption: fallbackText,
            mentions: [m.sender]
        }, { quoted: troli })
    }
    return conn.sendMessage(m.chat, {
        text: fallbackText,
        mentions: [m.sender]
    }, { quoted: troli })
}

handler.help = ['menu', 'help', 'm']
handler.tags = ['main']
handler.command = /^(menu|help|m|bantuan)$/i
handler.owner = false
handler.premium = false

export default handler
