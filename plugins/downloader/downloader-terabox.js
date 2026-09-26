// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// Terabox Downloader via Deline API — gratis, no key
import fetch from 'node-fetch'
import { elainaSay, elainaReact } from '../../lib/elainaVoice.js'

const DELINE = 'https://api.deline.web.id'

let handler = async (m, { conn, text }) => {
    if (!text) throw elainaSay('noargs', 'Masukkan URL Terabox!\nContoh: .terabox https://www.terabox.com/s/xxxxx')

    if (!text.includes('terabox') && !text.includes('1024tera') && !text.includes('freeterabox')) {
        throw elainaSay('gagal', 'Itu bukan link Terabox~')
    }

    conn.sendMessage(m.chat, { react: { text: elainaReact('mikir'), key: m.key } })

    try {
        const res = await fetch(`${DLINE}/downloader/terabox?url=${encodeURIComponent(text)}`, { timeout: 60000 })
        const json = await res.json()

        if (!json.status) throw elainaSay('gagal', json.error || json.message || 'Gagal download dari Terabox')

        const r = json.result || json.data
        const list = Array.isArray(r) ? r : [r]

        if (!list.length) throw elainaSay('notfound', 'file Terabox-nya')

        let txt = `📦 *TERABOX DOWNLOADER*\n\n`
        txt += `📊 *Jumlah file:* ${list.length}\n\n`

        list.slice(0, 10).forEach((f, i) => {
            txt += `*${i + 1}.* ${f.filename || f.name || 'file'}\n`
            txt += `   📐 ${f.filesize || f.size || '?'}\n`
        })

        if (list.length > 10) txt += `\n... dan ${list.length - 10} file lagi\n`

        txt += `\n${elainaSay('loading')}`
        await m.reply(txt)

        // Kirim file pertama (atau satu-satunya)
        const first = list[0]
        const dlUrl = first.link || first.url || first.download
        if (dlUrl) {
            await conn.sendMessage(m.chat, {
                document: { url: dlUrl },
                fileName: first.filename || first.name || 'terabox_file',
                caption: `✨ ${first.filename || first.name || 'file'}`
            }, { quoted: m })
        }

        conn.sendMessage(m.chat, { react: { text: elainaReact('sukses'), key: m.key } })
    } catch (e) {
        conn.sendMessage(m.chat, { react: { text: elainaReact('gagal'), key: m.key } })
        throw elainaSay('gagal', e.message)
    }
}

handler.help = ['terabox <url>', 'tbox <url>']
handler.tags = ['downloader']
handler.command = /^(terabox|tbox|teraboxdl)$/i

export default handler
