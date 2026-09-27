/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
import FormData from 'form-data';
// Fake Group - Zero Bot Style
// API: https://api.zenzxz.my.id

const pluginConfig = {
    name: 'fakegroup',
    alias: ['fgc'],
    category: 'maker',
    description: 'Membuat fake tampilan grup WhatsApp',
    usage: '.fakegroup <url|title|member|time>',
    example: '.fakegroup https://img.jpg|Zero Squad|256 members|12:30',
    cooldown: 5,
    energi: 3,
    isEnabled: true
}

async function uploadUguu(buffer) {
    try {

        const form = new FormData()

        form.append('files[]', buffer, 'image.jpg')

        const { data } = await axios.post(
            'https://uguu.se/upload',
            form,
            {
                headers: form.getHeaders()
            }
        )

        return data?.files?.[0]?.url || null

    } catch {
        return null
    }
}

async function handler(m, { sock }) {

    const text = m.args?.join(' ')
    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || ''

    if (!text) {
        return m.reply(
            `👥 *FAKE GROUP GENERATOR*\n\n` +
            `📌 Format:\n` +
            `> ${m.prefix}fakegroup url|title|member|time\n\n` +
            `📌 Reply gambar:\n` +
            `> ${m.prefix}fakegroup title|member|time`
        )
    }

    await sock.sendMessage(m.chat, {
        react: {
            text: '🕒',
            key: m.key
        }
    })

    try {

        let url, title, member, time

        const args = text.split('|').map(v => v?.trim())

        // pakai url langsung
        if (args.length === 4) {

            ;[url, title, member, time] = args

        // reply gambar
        } else if (args.length === 3) {

            if (!mime.startsWith('image/')) {
                throw new Error('Reply gambar untuk dijadikan foto grup.')
            }

            ;[title, member, time] = args

            const media = await q.download()

            url = await uploadUguu(media)

            if (!url) {
                throw new Error('Gagal upload gambar.')
            }

        } else {

            throw new Error(
                `Format salah!\n\n` +
                `Contoh:\n` +
                `> ${m.prefix}fakegroup Zero Squad|256 members|12:30`
            )
        }

        const api =
            `https://api.zenzxz.my.id/maker/fakegroup?` +
            `url=${encodeURIComponent(url)}` +
            `&title=${encodeURIComponent(title)}` +
            `&number=${encodeURIComponent(member)}` +
            `&time=${encodeURIComponent(time)}`

        const { data } = await axios.get(api, {
            responseType: 'arraybuffer'
        })

        const buffer = Buffer.from(data)

        await sock.sendMessage(m.chat, {
            image: buffer,
            caption:
                `👥 *FAKE GROUP BERHASIL DIBUAT*\n\n` +
                `> 🏷️ Nama: ${title}\n` +
                `> 👤 Member: ${member}\n` +
                `> 🕒 Time: ${time}`
        }, {
            quoted: m
        })

        await sock.sendMessage(m.chat, {
            react: {
                text: '✅',
                key: m.key
            }
        })

    } catch (err) {

        console.error('FakeGroup Error:', err)

        await sock.sendMessage(m.chat, {
            react: {
                text: '❌',
                key: m.key
            }
        })

        return m.reply(
            `❌ *Gagal membuat fake group!*\n\n` +
            `> ${err.message || 'API sedang bermasalah.'}`
        )
    }
}

export { pluginConfig as config, handler };
