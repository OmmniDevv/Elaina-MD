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
    name: ['fakecall', 'fakecall-android', 'fakecall-ios'],
    alias: ['fakecallwa'],
    category: 'canvas',
    description: 'Membuat gambar fake call WhatsApp (Tersedia versi Android dan iOS)',
    usage: '.fakecall nama | durasi',
    example: '.fakecall Zann | 19:00',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true
}

async function handler(m, { sock }) {
    const cmd = m.command.toLowerCase()
    const text = m.text

    if (!text || !text.includes('|')) {
        let helpText = `Halo! Sepertinya format yang kamu masukkan kurang tepat.\n\n`
        helpText += `Fitur ini digunakan untuk membuat gambar panggilan palsu (Fake Call) seolah-olah seseorang sedang meneleponmu secara langsung.\n\n`
        helpText += `*Daftar Perintah yang Tersedia:*\n`
        helpText += `- *${m.prefix}fakecall* (Untuk tampilan panggilan Android)\n`
        helpText += `- *${m.prefix}fakecall-ios* (Untuk tampilan panggilan iPhone atau iOS)\n\n`
        helpText += `*Cara Penggunaan:*\n`
        helpText += `Ketik perintah diikuti dengan *Nama* dan *Durasi* yang dipisahkan oleh tanda pipa (|).\n\n`
        helpText += `*Contoh Penggunaan:*\n`
        helpText += `- *${m.prefix}fakecall Zann | 03:33:33*\n`
        helpText += `- *${m.prefix}fakecall-ios Sayangku | 12:00:00*\n\n`
        helpText += `*Tips Tambahan:*\n`
        helpText += `Kamu bisa me-reply (membalas) sebuah gambar jika ingin menggunakan foto tersebut sebagai avatar profil sang penelepon!`
        
        return m.reply(helpText)
    }

    const [nama, durasi] = text.split('|').map(s => s.trim())

    if (!nama) {
        return m.reply(`Maaf, nama penelepon tidak boleh dikosongkan. Silakan isi namanya terlebih dahulu!`)
    }

    if (!durasi) {
        return m.reply(`Maaf, durasi panggilan tidak boleh dikosongkan. Silakan isi durasinya terlebih dahulu!`)
    }

    await m.react('🕕')

    try {
        let bufferBase
        
        if (m.isImage) {
            try {
                bufferBase = await m.download()
            } catch (err) {}
        } else if (m.quoted?.isImage) {
            try {
                bufferBase = await m.quoted.download()
            } catch (err) {}
        }

        if (!bufferBase) {
            try {
                const ppUrl = await sock.profilePictureUrl(m.sender, 'image')
                const res = await axios.get(ppUrl, { responseType: 'arraybuffer' })
                bufferBase = Buffer.from(res.data)
            } catch (err) {
                const res = await axios.get('https://files.catbox.moe/nwvkbt.png', { responseType: 'arraybuffer' })
                bufferBase = Buffer.from(res.data)
            }
        }

        const form = new FormData()
        form.append('avatarUrl', bufferBase, { filename: 'avatar.jpg', contentType: 'image/jpeg' })
        form.append('name', nama)
        form.append('duration', durasi)

        let endpoint = 'fakecall-android'
        if (cmd === 'fakecall-ios') {
            endpoint = 'fakecall-ios'
        }

        const apiUrl = `https://my.izuka-api.xyz/api/canvas/${endpoint}`

        const response = await axios.post(apiUrl, form, {
            headers: form.getHeaders(),
            responseType: 'arraybuffer'
        })

        await sock.sendMessage(m.chat, { image: Buffer.from(response.data) }, { quoted: m })

        await m.react('📞')

    } catch (err) {
        await m.react('☢')
        return m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }