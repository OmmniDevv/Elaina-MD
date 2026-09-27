/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios'

const pluginConfig = {
    name: 'sstablet',
    alias: ['sstablet', 'sstab', 'sweb'],
    category: 'tools',
    description: 'Mengambil screenshot website tampilan tablet',
    usage: '.sstablet <url>',
    example: '.sstablet https://google.com',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true
}

const NEXADEV_APIKEY = 'bebas_isi_apikey_kamu'

async function handler(m, { sock }) {
    let text = m.text?.trim()
    const prefix = m.prefix || '.'
    const command = m.command || 'sstablet'

    if (!text) {
        return m.reply(
            `⚠️ *FORMAT SALAH*\n\n` +
            `> Masukkan URL website yang ingin di-screenshot!\n` +
            `> Contoh: \`${prefix}${command} https://google.com\``
        )
    }

    if (!text.startsWith('http://') && !text.startsWith('https://')) {
        text = 'https://' + text
    }

    if (m.react) await m.react('🕐')

    try {
        const apiUrl = `https://api.nexadev.my.id/api/ss`
        
        // Panggil API NexaDev untuk ambil data/link screenshot
        const { data } = await axios.get(apiUrl, {
            params: {
                url: text,
                device: 'tablet',
                apikey: NEXADEV_APIKEY
            },
            timeout: 20000
        })

        // Ambil link/URL gambar dari respon JSON API
        let imgUrl = data.result || data.url || data.image || data.data || data

        if (typeof imgUrl === 'object') {
            imgUrl = imgUrl.url || imgUrl.result || imgUrl.image
        }

        if (!imgUrl || typeof imgUrl !== 'string' || !imgUrl.startsWith('http')) {
            throw new Error(data?.message || 'Gagal mendapatkan link gambar dari API.')
        }

        // Unduh gambar dari URL tersebut menjadi Buffer yang valid
        const imageResponse = await axios.get(imgUrl, {
            responseType: 'arraybuffer',
            timeout: 15000
        })

        const imageBuffer = Buffer.from(imageResponse.data)

        await sock.sendMessage(m.chat, {
            image: imageBuffer,
            caption: `🌐 *SCREENSHOT TABLET*\n\n🔗 *URL:* ${text}`
        }, { quoted: m })

        if (m.react) await m.react('✅')

    } catch (err) {
        console.error('[SS Tablet Error]', err)
        if (m.react) await m.react('❌')
        m.reply(`❌ Gagal mengambil screenshot website.\n\n*Pesan Error:* ${err.message}`)
    }
}

export { pluginConfig as config, handler }
