/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
import FormData from 'form-data';
import config from '../../config.js';
const pluginConfig = {
    name: 'wasted',
    alias: ['gta', 'gtawasted'],
    category: 'maker',
    description: 'Efek wasted GTA pada foto',
    usage: '.wasted (reply foto)',
    example: '.wasted',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true
}

async function uploadToTmpFiles(buffer) {

    try {

        const form = new FormData()

        form.append('file', buffer, {
            filename: 'image.jpg',
            contentType: 'image/jpeg'
        })

        const response = await axios.post(
            'https://tmpfiles.org/api/v1/upload',
            form,
            {
                headers: form.getHeaders()
            }
        )

        return response.data.data.url
            .replace('tmpfiles.org/', 'tmpfiles.org/dl/')

    } catch (e) {

        console.log('Upload Error:', e)

        return null
    }
}

async function handler(m, { sock }) {

    try {

        let buffer = null

        // reply image
        if (
            m.quoted &&
            (
                m.quoted.mimetype?.includes('image') ||
                m.quoted.type === 'imageMessage'
            )
        ) {

            buffer = await m.quoted.download()

        }

        // direct image
        else if (
            m.mimetype?.includes('image')
        ) {

            buffer = await m.download()
        }

        if (!buffer) {

            return await m.reply(
                `❌ Reply / kirim gambar\n\nContoh:\n${pluginConfig.example}`
            )
        }

        const uploaded =
            await uploadToTmpFiles(buffer)

        if (!uploaded) {

            return await m.reply(
                '❌ Upload gambar gagal'
            )
        }

        // FIX API
        const api =
            `https://some-random-api.com/canvas/wasted?avatar=${encodeURIComponent(uploaded)}`

        const response = await axios.get(api, {
            responseType: 'arraybuffer'
        })

        const image = Buffer.from(response.data)

        await sock.sendMessage(
            m.chat,
            {
                image,
                caption: '💀 *WASTED EFFECT*'
            },
            { quoted: m }
        )

    } catch (error) {

        console.error('Wasted Error:', error)

        await m.reply(
            `❌ *GAGAL*\n\n> ${error.message}`
        )
    }
}

export { pluginConfig as config, handler };
