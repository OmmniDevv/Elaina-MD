/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios'

const pluginConfig = {
    name: 'ssdesktop',
    alias: ['ssdesktop', 'sspc', 'sspcweb', 'ssd'],
    category: 'tools',
    description: 'Mengambil screenshot website tampilan PC/Desktop',
    usage: '.ssdesktop <url>',
    example: '.ssdesktop https://google.com',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true
}

const NEXADEV_APIKEY = 'bebas_isi_apikey_kamu' // Ganti jika API kamu butuh API Key khusus

async function handler(m, { sock }) {
    let text = m.text?.trim()
    const prefix = m.prefix || '.'
    const command = m.command || 'ssdesktop'

    if (!text) {
        return m.reply(
            `⚠️ *FORMAT SALAH*\n\n` +
            `> Masukkan URL website yang ingin di-screenshot!\n` +
            `> Contoh: \`${prefix}${command} https://google.com\``
        )
    }

    // Otomatis tambahkan https:// jika user lupa mengetik protocol
    if (!text.startsWith('http://') && !text.startsWith('https://')) {
        text = 'https://' + text
    }

    if (m.react) await m.react('🕐')

    try {
        const apiUrl = `https://api.nexadev.my.id/api/ss`
        
        // Panggil API NexaDev dengan parameter device=desktop
        const { data } = await axios.get(apiUrl, {
            params: {
                url: text,
                device: 'desktop',
                apikey: NEXADEV_APIKEY
            },
            timeout: 20000
        })

        // Ambil URL gambar dari respon JSON API
        let imgUrl = data.result || data.url || data.image || data.data || data

        if (typeof imgUrl === 'object') {
            imgUrl = imgUrl.url || imgUrl.result || imgUrl.image
        }

        if (!imgUrl || typeof imgUrl !== 'string' || !imgUrl.startsWith('http')) {
            throw new Error(data?.message || 'Gagal mendapatkan link gambar dari API.')
        }

        // Unduh gambar dari URL tersebut menjadi Buffer
        const imageResponse = await axios.get(imgUrl, {
            responseType: 'arraybuffer',
            timeout: 15000
        })

        const imageBuffer = Buffer.from(imageResponse.data)

        await sock.sendMessage(m.chat, {
            image: imageBuffer,
            caption: `💻 *SCREENSHOT DESKTOP*\n\n🔗 *URL:* ${text}`
        }, { quoted: m })

        if (m.react) await m.react('✅')

    } catch (err) {
        console.error('[SS Desktop Error]', err)
        if (m.react) await m.react('❌')
        m.reply(`❌ Gagal mengambil screenshot website.\n\n*Pesan Error:* ${err.message}`)
    }
}

export { pluginConfig as config, handler }
