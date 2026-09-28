import fetch from 'node-fetch'
import { CATEGORY_ORDER, CATEGORY_EMOJIS, normalizeCategory, buildUnifiedCommandMap } from '../../lib/categoryHelper.js'

async function makeTroli(itemCount, title, token) {
    let thumbSmall = null
    try {
        const { readFileSync } = await import('fs')
        const buf = readFileSync(global.thumb)
        const sharp = (await import('sharp')).default
        thumbSmall = await sharp(buf).resize(300, 300, { fit: 'cover' }).jpeg({ quality: 80 }).toBuffer()
    } catch { }
    return {
        key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
        message: {
            orderMessage: {
                orderId: '1337',
                thumbnail: thumbSmall || null,
                itemCount,
                status: 'INQUIRY',
                surface: 'CATALOG',
                message: `${global.namebot}`,
                orderTitle: title,
                sellerJid: `${global.nomorbot}@s.whatsapp.net`,
                token,
                totalAmount1000: 0,
                totalCurrencyCode: 'IDR',
                contextInfo: {
                    isForwarded: true,
                    forwardingScore: 9999,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363420914057249@newsletter',
                        newsletterName: global.namebot,
                        serverMessageId: 127
                    }
                }
            }
        }
    }
}

let handler = async (m, { conn, usedPrefix, args, isOwner }) => {
    const cmdMap = buildUnifiedCommandMap()
    const allTags = [...new Set([...CATEGORY_ORDER, ...Object.keys(cmdMap)])]
    const categoryArg = args[0] ? normalizeCategory(args[0].toLowerCase()) : ''

    // No arg — show all categories
    if (!categoryArg) {
        let totalCmds = 0
        for (const cmds of Object.values(cmdMap)) totalCmds += cmds.length

        let text = `📂 *ᴅᴀꜰᴛᴀʀ ᴋᴀᴛᴇɢᴏʀɪ*\n\n`
        text += `> Ketik *${usedPrefix}menucat <kategori>*\n\n`
        text += `╭─〔 📋 \`ᴋᴀᴛᴇɢᴏʀɪ\` 〕─⬣\n`
        for (const tag of allTags) {
            const cmds = cmdMap[tag]
            if (!cmds || cmds.length === 0) continue
            if (tag === 'owner' && !isOwner) continue
            const emoji = CATEGORY_EMOJIS[tag] || '📁'
            text += ` │ ${emoji} *${tag.toUpperCase()}* │ \`${cmds.length}\` cmds\n`
        }
        text += `╰─⬣\n\n_Contoh: *${usedPrefix}menucat tools*_`

        const troli = await makeTroli(totalCmds, `📋 ${totalCmds} Commands`, 'elaina-menucat')
        return conn.sendMessage(m.chat, {
            text,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 9,
                isForwarded: true
            }
        }, { quoted: troli })
    }

    if (categoryArg === 'owner' && !isOwner)
        return m.reply(`❌ Kamu tidak punya akses ke kategori *owner*.`)

    if (!cmdMap[categoryArg] || cmdMap[categoryArg].length === 0)
        return m.reply(`❌ Kategori *${categoryArg}* tidak ditemukan.\nKetik *${usedPrefix}menucat* untuk melihat daftar kategori.`)

    const cmds = cmdMap[categoryArg]
    const emoji = CATEGORY_EMOJIS[categoryArg] || '📁'

    let text = `╭─〔 ${emoji} \`${categoryArg.toUpperCase()}\` 〕───⬣\n`
    for (const cmd of cmds) {
        const sym = [cmd.owner ? 'Ⓞ' : '', cmd.premium ? 'ⓟ' : '', cmd.limit ? 'Ⓛ' : ''].filter(Boolean).join(' ')
        text += ` │ \`${usedPrefix}${cmd.name}\`${sym ? ' ' + sym : ''}\n`
    }
    text += `╰───────⬣\n\nTotal: \`${cmds.length}\` commands\n\n_© ${global.namebot} | ${global.wmcredit}_`

    const troli = await makeTroli(cmds.length, `${emoji} ${categoryArg.toUpperCase()} — ${cmds.length} cmds`, `elaina-cat-${categoryArg}`)
    return conn.sendMessage(m.chat, {
        text,
        contextInfo: {
            mentionedJid: [m.sender],
            forwardingScore: 9,
            isForwarded: true
        }
    }, { quoted: troli })
}

handler.help = ['menucat']
handler.tags = ['main']
handler.command = /^(menucat|mc|category|cat|mcat)$/i
handler.owner = false
handler.premium = false

export default handler
