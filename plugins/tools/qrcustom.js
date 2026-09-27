/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios'
import FormData from 'form-data'
import te from '../../src/lib/elaina-error.js'
const pluginConfig = {
    name: ['qrcustom', 'qrcode', 'qr'],
    alias: [],
    category: 'tools',
    description: 'Generate QR code custom dengan logo',
    usage: '.qrcustom <url>',
    example: '.qrcustom https://wa.me/628xxx',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true
}

const BASE_URL = 'https://api.denayrestapi.xyz'

async function uploadTo0x0(buffer) {
    try {
        const form = new FormData()
        form.append('file', buffer, { filename: 'logo.png', contentType: 'image/png' })
        
        const response = await axios.post('https://c.termai.cc/api/upload?key=AIzaBj7z2z3xBjsk', form, {
            headers: form.getHeaders(),
            timeout: 30000
        })
        
        if (response.data?.status === 'success' && response.data?.files?.[0]?.url) {
            return response.data
        }
        return null
    } catch {
        return null
    }
}

async function handler(m, { sock }) {
    const data = m.text?.trim()
    
    if (!data) {
        return m.reply(
            `⚠️ *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ*\n\n` +
            `> \`${m.prefix}qrcustom <url/text>\`\n\n` +
            `*Contoh:*\n` +
            `> \`${m.prefix}qrcustom https://wa.me/628xxx\`\n\n` +
            `💡 Reply gambar untuk custom logo di tengah QR`
        )
    }
    
    await m.reply(`🕕 *Generating QR code...*`)
    
    try {
        let imageUrl = ''
        
        if (m.isImage) {
            const buffer = await m.download()
            imageUrl = await uploadTo0x0(buffer) || ''
        } else if (m.quoted?.isImage) {
            const buffer = await m.quoted.download()
            imageUrl = await uploadTo0x0(buffer) || ''
        }
        
        const params = new URLSearchParams({
            data: data,
            type: 'png',
            size: '300'
        })
        
        if (imageUrl) {
            params.append('image', imageUrl)
        }
        
        const apiUrl = `${BASE_URL}/api/v1/tools/qrcustom?${params.toString()}`
        
        await sock.sendMessage(m.chat, {
            image: { url: apiUrl },
            caption: `📱 *QR Code*\n> ${data.substring(0, 50)}${data.length > 50 ? '...' : ''}`
        }, { quoted: m })
        
        m.react('📱')
        
    } catch (err) {
        m.react('☢')
        return m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }