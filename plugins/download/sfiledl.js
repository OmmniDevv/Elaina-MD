/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import config from '../../config.js'
import { f } from '../../src/lib/elaina-http.js'
import te from '../../src/lib/elaina-error.js'
const pluginConfig = {
    name: 'sfiledl',
    alias: ['sfile', 'sfiledownload'],
    category: 'download',
    description: 'Download file dari Sfile.mobi',
    usage: '.sfiledl <url>',
    example: '.sfiledl https://sfile.mobi/xxx',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 15,
    energi: 1,
    isEnabled: true
}

async function handler(m, { sock }) {
    const url = m.text?.trim()

    if (!url) {
        return m.reply(
            `⚠️ *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ*\n\n` +
            `> \`${m.prefix}sfiledl <url_sfile>\`\n\n` +
            `> Contoh: \`${m.prefix}sfiledl https://sfile.mobi/xxxxx\``
        )
    }

    if (!url.includes('sfile.mobi') && !url.includes('sfile.co')) {
        return m.reply(`❌ URL harus dari sfile.mobi atau sfile.co!`)
    }

    m.react('🕕')

    try {
        const { data } = await f(`https://api.neoxr.eu/api/sfile?url=${encodeURIComponent(url)}&apikey=${config.APIkey.neoxr}`)

        if (!data.url) {
            m.react('❌')
            return m.reply(`❌ Gagal mendapatkan link download. File mungkin tidak tersedia.`)
        }

        await sock.sendMedia(m.chat, data.url, null, m, {
            type: 'document',
            fileName: data.filename,
            mimetype: data.mime,
            contextInfo: {
                forwardingScore: 99,
                isForwarded: true
            }
        })

        m.react('✅')

    } catch (error) {
        m.react('☢')
        m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }