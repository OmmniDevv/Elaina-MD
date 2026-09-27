/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
import FormData from 'form-data';
// Fake Instagram Story - Zero Bot Style
// API: https://api.zenzxz.my.id

const pluginConfig = {
    name: 'fakeigstory',
    alias: ['igstoryfake', 'fakeigs'],
    category: 'maker',
    description: 'Membuat fake Instagram Story',
    usage: '.fakeigstory <username>|<caption>|<time>',
    example: '.fakeigstory zerobot|lagi gabut bjir|5 menit lalu',
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
            `📸 *FAKE INSTAGRAM STORY*\n\n` +
            `📌 Format:\n` +
            `> ${m.prefix}fakeigstory username|caption|time\n\n` +
            `📌 Reply gambar lalu ketik:\n` +
            `> ${m.prefix}fakeigstory zerobot|hello world|5 menit lalu`
        )
    }

    if (!mime.startsWith('image/')) {
        return m.reply(
            `⚠️ Reply gambar untuk dijadikan story Instagram.`
        )
    }

    await sock.sendMessage(m.chat, {
        react: {
            text: '📸',
            key: m.key
        }
    })

    try {

        const args = text.split('|').map(v => v?.trim())

        if (args.length < 3) {
            throw new Error('Format salah.')
        }

        const [username, caption, time] = args

        const media = await q.download()

        const imageUrl = await uploadUguu(media)

        if (!imageUrl) {
            throw new Error('Gagal upload gambar.')
        }

        // endpoint fake ig story
        const api =
            `https://api.zenzxz.my.id/maker/fakeigstory?` +
            `username=${encodeURIComponent(username)}` +
            `&caption=${encodeURIComponent(caption)}` +
            `&time=${encodeURIComponent(time)}` +
            `&url=${encodeURIComponent(imageUrl)}`

        const { data } = await axios.get(api, {
            responseType: 'arraybuffer'
        })

        const buffer = Buffer.from(data)

        await sock.sendMessage(m.chat, {
            image: buffer,
            caption:
                `📸 *FAKE INSTAGRAM STORY*\n\n` +
                `> 👤 Username: ${username}\n` +
                `> 🕒 Time: ${time}\n\n` +
                `✅ Story berhasil dibuat`
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

        console.error('FakeIGStory Error:', err)

        await sock.sendMessage(m.chat, {
            react: {
                text: '❌',
                key: m.key
            }
        })

        return m.reply(
            `❌ *Gagal membuat fake Instagram Story!*\n\n` +
            `> ${err.message || 'API sedang bermasalah.'}`
        )
    }
}

export { pluginConfig as config, handler };
