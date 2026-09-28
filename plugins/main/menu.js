// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// Button Menu ala CANTARELLA MD (Native Flow Multi-Button: single_select dropdown + CTA + quick reply + GIF/Image header)
import fs from 'fs'
import axios from 'axios'
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@rexxhayanasi/elaina-baileys'
import { CATEGORY_ORDER, CATEGORY_EMOJIS, buildUnifiedCommandMap } from '../../lib/categoryHelper.js'

const NEWSLETTER_JID = '120363420914057249@newsletter'

const CATEGORY_META = {
    main: { bold: '𝗠𝗔𝗜𝗡', title: 'Command Utama & Sistem', desc: 'menu, help, ping, info bot' },
    downloader: { bold: '𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗', title: 'Downloader Media Sosial', desc: 'tiktok, youtube, ig, fb, terabox dll' },
    ai: { bold: '𝗔𝗜 𝗖𝗛𝗔𝗧', title: 'Kecerdasan Buatan & LLM', desc: 'chatgpt, gemini, groq, deepseek dll' },
    game: { bold: '𝗚𝗔𝗠𝗘', title: 'Game Interaktif & Tebakan', desc: 'tebakkata, susunkata, tebakgambar dll' },
    rpg: { bold: '⚔️ 𝗥𝗣𝗚', title: 'RPG Adventure & Inventory', desc: 'dungeon, berburu, craft, inventory dll' },
    group: { bold: '𝗚𝗥𝗨𝗣', title: 'Panel Moderasi & Admin Grup', desc: 'promote, kick, tagall, slowmode dll' },
    sticker: { bold: '𝗦𝗧𝗜𝗖𝗞𝗘𝗥', title: 'Pembuat & Editor Stiker', desc: 'brat, attp, sticker, emojimix dll' },
    tools: { bold: '𝗧𝗢𝗢𝗟𝗦', title: 'Tools Praktis & Utilitas', desc: 'ocr, translate, convert, shorten dll' },
    audio: { bold: '𝗔𝗨𝗗𝗜𝗢', title: 'Audio FX, TTS & Musik', desc: 'tts, vn, sound effect, musik dll' },
    anime: { bold: '𝗔𝗡𝗜𝗠𝗘', title: 'Pusat Wibu & Info Anime', desc: 'waifu, animeinfo, manga, wallpaper dll' },
    canvas: { bold: '𝗖𝗔𝗡𝗩𝗔𝗦', title: 'Efek Gambar & Fake Card', desc: 'wanted, card, meme, ektp dll' },
    maker: { bold: '𝗘𝗣𝗛𝗢𝗧𝗢', title: 'Logo & Efek Teks Estetik', desc: 'glitch, neon, text effect, banner dll' },
    internet: { bold: '𝗜𝗡𝗧𝗘𝗥𝗡𝗘𝗧', title: 'Pencarian & Stalker Web', desc: 'google, wikipedia, igstalk, ttstalk dll' },
    islamic: { bold: '𝗥𝗘𝗟𝗜𝗚𝗜', title: 'Jadwal Sholat & Doa Islami', desc: 'jadwalsholat, quran, asmaulhusna dll' },
    fun: { bold: '𝗛𝗜𝗕𝗨𝗥𝗔𝗡', title: 'Hiburan Seru & Candaan', desc: 'jokes, tebak, rate, ship, dare dll' },
    cek: { bold: '𝗖𝗘𝗞', title: 'Cek Sifat & Karakter', desc: 'cekcantik, cekganteng, cekbucin dll' },
    quotes: { bold: '𝗣𝗥𝗜𝗠𝗕𝗢𝗡', title: 'Zodiak, Mimpi & Kata Bijak', desc: 'quotes, zodiak, mimpi, primbon dll' },
    random: { bold: '𝗥𝗔𝗡𝗗𝗢𝗠', title: 'Konten Acak & Asupan', desc: 'random image, cecan, cogan dll' },
    xp: { bold: '𝗨𝗦𝗘𝗥', title: 'Profil, Level & Ekonomi', desc: 'profile, daily, exp, koin, top dll' },
    store: { bold: '𝗦𝗧𝗢𝗥𝗘', title: 'Manajemen Toko & Produk', desc: 'list, order, buy, tambahstok dll' },
    info: { bold: '𝗜𝗡𝗙𝗢', title: 'Informasi Server & Bot', desc: 'speed, runtime, health, dashboard dll' },
    owner: { bold: '𝗢𝗪𝗡𝗘𝗥', title: 'Panel Kontrol Developer', desc: 'eval, restart, backup, ban dll' },
    nsfw: { bold: '𝗡𝗦𝗙𝗪', title: 'Konten Dewasa Khusus 18+', desc: 'hentai, nsfw art dll' }
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
    try { await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }) } catch {}

    const _mBot = global.namebot || 'Elaina MD'
    const _mOwner = global.nameown || 'OmniDevv'
    const _mPrefix = usedPrefix || '.'
    const _mSaluran = global.saluran?.link || 'https://whatsapp.com/channel/0029VbBVsX60lwgz8fPNha18'
    const _mNewsJid = NEWSLETTER_JID
    const _mNewsName = _mBot

    // ── Runtime & memory ──
    const _mUp = Math.floor(process.uptime())
    const _mUpD = Math.floor(_mUp / 86400)
    const _mUpH = Math.floor((_mUp % 86400) / 3600)
    const _mUpM = Math.floor((_mUp % 3600) / 60)
    const _mRam = (process.memoryUsage().rss / 1048576).toFixed(1)
    const _mUpStr = `${_mUpD}h ${_mUpH}j ${_mUpM}m`

    // ── Commands ──
    const cmdMap = buildUnifiedCommandMap()
    let _mTotalCmd = 0
    for (const cmds of Object.values(cmdMap)) _mTotalCmd += cmds.length
    const sortedCats = getSortedCats(cmdMap, isOwner)

    // ── Jam & tanggal (Asia/Jakarta) ──
    const _mNow = new Date()
    const _mJam = _mNow.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })
    const _mTgl = _mNow.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' })

    // ── Thumbnail / GIF Buffer ──
    let _mThumbBuf = null
    let _mIsGif = false
    if (global.menuGif) {
        try {
            const res = await axios.get(global.menuGif, { responseType: 'arraybuffer', timeout: 10000 })
            _mThumbBuf = Buffer.from(res.data)
            _mIsGif = true
        } catch {}
    }
    if (!_mThumbBuf && global.thumb && fs.existsSync(global.thumb)) {
        try {
            _mThumbBuf = fs.readFileSync(global.thumb)
            _mIsGif = false
        } catch {}
    }

    const _mText =
`ʜᴀʟᴏ, @${m.sender.split('@')[0]} 👋
sᴇɴᴀɴɢ ʙᴇʀᴛᴇᴍᴜ ᴅᴇɴɢᴀɴᴍᴜ.

┌ ʙᴏᴛ ɪɴғᴏ
│ ɴᴀᴍᴇ     : ${_mBot}
│ ᴏᴡɴᴇʀ    : ${_mOwner}
│ ᴜᴘᴛɪᴍᴇ   : ${_mUpStr}
│ ᴍᴇᴍᴏʀʏ   : ${_mRam} ᴍʙ
│ ᴄᴏᴍᴍᴀɴᴅ : ${_mTotalCmd} commands
│ ᴊᴇɴɪs sᴄ  : ɢʀᴀᴛɪsᴀɴ
└
┌
│ᴛɪᴍᴇ       ${_mJam} ᴡɪʙ
│ᴅᴀᴛᴇ       ${_mTgl}
└

ɴᴇᴇᴅ ʙᴏᴛ ᴏʀ ɪɴғᴏ?
${_mSaluran}
ɢᴜɴᴀᴋᴀɴ ᴅᴇɴɢᴀɴ ʙɪᴊᴀᴋ`

    // ── Category rows untuk single_select popup ──
    const _mCategories = sortedCats.map(cat => {
        const meta = CATEGORY_META[cat] || { bold: cat.toUpperCase(), title: `Kategori ${cat}`, desc: `${cmdMap[cat].length} commands` }
        const emoji = CATEGORY_EMOJIS[cat] || '📁'
        return {
            header: `${emoji} ${meta.bold}`,
            title: meta.title,
            description: `${cmdMap[cat].length} cmds • ${meta.desc}`,
            id: `${_mPrefix}menucat ${cat}`
        }
    })

    // ── fakeQuoted Cantarella style ──
    const _mQuoted = {
        key: {
            participant: `0@s.whatsapp.net`,
            remoteJid: `status@broadcast`
        },
        message: {
            contactMessage: {
                displayName: `🪸 ${_mBot}`,
                vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${_mBot}\nitem1.TEL;waid=0:+0\nEND:VCARD`,
                sendEphemeral: true
            }
        }
    }

    // ── contextInfo ──
    const _mCtx = {
        mentionedJid: [m.sender],
        forwardingScore: 9999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: _mNewsJid,
            newsletterName: _mNewsName,
            serverMessageId: 127
        },
        externalAdReply: {
            title: _mBot,
            body: `v6.3.0 • ${(conn.public ? 'Public' : 'Self').toUpperCase()}`,
            mediaType: 1,
            showAdAttribution: false,
            renderLargerThumbnail: true,
            ...((_mThumbBuf && !_mIsGif) ? { thumbnail: _mThumbBuf } : {}),
            sourceUrl: _mSaluran
        },
        limited_time_offer: {
            text: `Gunakan bot ini dengan bijak yak`,
            url: _mSaluran,
            copy_code: _mBot,
            expiration_time: Date.now() * 999
        }
    }

    const _mButtons = [
        {
            name: 'single_select',
            buttonParamsJson: JSON.stringify({ has_multiple_buttons: true })
        },
        {
            name: 'call_permission_request',
            buttonParamsJson: JSON.stringify({ has_multiple_buttons: true })
        },
        {
            name: 'single_select',
            buttonParamsJson: JSON.stringify({
                title: '⌗ ᴅᴀꜰᴛᴀʀ ᴋᴀᴛᴇɢᴏʀɪ ᴍᴇɴᴜ',
                sections: [{
                    title: '𓍢ִ໋ ᴘɪʟɪʜ ᴋᴀᴛᴇɢᴏʀɪ ʏᴀɴɢ ᴋᴀᴍᴜ ɪɴɢɪɴᴋᴀɴ',
                    highlight_label: _mBot,
                    rows: _mCategories
                }],
                has_multiple_buttons: true
            })
        },
        {
            name: 'cta_url',
            buttonParamsJson: JSON.stringify({
                display_text: 'ꜱᴀʟᴜʀᴀɴ ᴏꜰꜰɪᴄɪᴀʟ',
                url: _mSaluran,
                merchant_url: _mSaluran
            })
        },
        {
            name: 'cta_copy',
            buttonParamsJson: JSON.stringify({
                display_text: `⎙ ᴅᴇᴠ: ${_mOwner}`,
                copy_code: `${_mBot} ✨`
            })
        },
        {
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({ display_text: '</> ꜱᴇᴍᴜᴀ ᴄᴏᴍᴍᴀɴᴅ', id: `${_mPrefix}allmenu` })
        },
        {
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({ display_text: '⛁ ɪɴꜰᴏ ꜱᴇᴡᴀ ʙᴏᴛ', id: `${_mPrefix}sewa` })
        },
        {
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({ display_text: 'ⓘ ꜱᴛᴀᴛᴜꜱ ʙᴏᴛ', id: `${_mPrefix}ping` })
        },
        ...(isOwner ? [{
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({ display_text: '♔ ᴘᴀɴᴇʟ ᴏᴡɴᴇʀ', id: `${_mPrefix}menucat owner` })
        }] : [])
    ]

    const _mFlowParams = JSON.stringify({
        limited_time_offer: {
            text: `ꜱᴇʟᴀᴍᴀᴛ ᴅᴀᴛᴀɴɢ ᴅɪ ${_mBot} !`,
            url: _mSaluran,
            copy_code: `${_mBot} ✨`,
            expiration_time: Date.now() * 999
        },
        bottom_sheet: {
            in_thread_buttons_limit: 2,
            divider_indices: [2, 3, 4, 5, 6, 999],
            list_title: 'ᴘɪʟɪʜ ᴋᴀᴛᴇɢᴏʀɪ ᴍᴇɴᴜ',
            button_title: 'ᴊᴇʟᴀᴊᴀʜɪ ᴍᴇɴᴜ ꜱᴇᴋᴀʀᴀɴɢ'
        }
    })

    try {
        let _mHeader = { hasMediaAttachment: false }
        if (_mThumbBuf && conn.waUploadToServer) {
            try {
                const _mMediaPrep = await prepareWAMessageMedia(
                    _mIsGif ? { video: _mThumbBuf, gifPlayback: true } : { image: _mThumbBuf },
                    { upload: conn.waUploadToServer }
                )
                _mHeader = _mIsGif
                    ? { hasMediaAttachment: true, videoMessage: _mMediaPrep.videoMessage }
                    : { hasMediaAttachment: true, imageMessage: _mMediaPrep.imageMessage }
            } catch (upErr) {
                console.error('[menu] prepareWAMessageMedia error:', upErr.message)
            }
        }

        const _mProto = {
            viewOnceMessage: {
                message: {
                    messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                    interactiveMessage: {
                        header: _mHeader,
                        body: { text: _mText },
                        footer: { text: global.Foah || `✦ ${_mBot}  •  ${global.wmcredit || _mOwner}` },
                        contextInfo: _mCtx,
                        nativeFlowMessage: {
                            messageParamsJson: _mFlowParams,
                            buttons: _mButtons
                        }
                    }
                }
            }
        }

        const _mGenMsg = generateWAMessageFromContent(m.chat, _mProto, { quoted: _mQuoted })
        return await conn.relayMessage(m.chat, _mGenMsg.message, { messageId: _mGenMsg.key.id })
    } catch (_mErr) {
        console.error('[menu] relayMessage error, mencoba fallback 1:', _mErr.message)
        // Fallback 1: interactiveMessage biasa
        try {
            return await conn.sendMessage(m.chat, {
                interactiveMessage: {
                    title: _mText,
                    footer: global.Foah || `✦ ${_mBot}  •  ${global.wmcredit || _mOwner}`,
                    contextInfo: _mCtx,
                    nativeFlowMessage: {
                        messageParamsJson: _mFlowParams,
                        buttons: _mButtons
                    }
                }
            }, { quoted: _mQuoted })
        } catch (_mErr2) {
            console.error('[menu] fallback 1 error, mencoba fallback 2:', _mErr2.message)
            // Fallback 2: gambar / teks biasa
            if (_mThumbBuf) {
                return conn.sendMessage(m.chat, {
                    image: _mThumbBuf,
                    caption: _mText,
                    mentions: [m.sender]
                }, { quoted: _mQuoted })
            }
            return conn.sendMessage(m.chat, {
                text: _mText,
                mentions: [m.sender]
            }, { quoted: _mQuoted })
        }
    }
}

handler.help = ['menu', 'help', 'allmenu']
handler.tags = ['main']
handler.command = /^(menu|help|m|bantuan|menunya)$/i

export default handler
