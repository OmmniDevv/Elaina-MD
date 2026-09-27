/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { generateWAMessageContent, generateWAMessageFromContent } from '@rexxhayanasi/elaina-baileys';
import crypto from 'crypto';
const pluginConfig = {
    name: 'upsw',
    alias: ['upstory','storygc'],
    category: 'group',
    description: 'Upload story untuk grup (border hijau)',
    usage: '.upsw <teks> / reply media',
    example: '.upsw Halo semua',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    cooldown: 10,
    energi: 0,
    isEnabled: true
}

async function sendGroupStatus(sock, jid, content) {

    const inside = await generateWAMessageContent(content, {
        upload: sock.waUploadToServer
    })

    const messageSecret = crypto.randomBytes(32)

    const msg = generateWAMessageFromContent(jid, {
        messageContextInfo: {
            messageSecret
        },
        groupStatusMessageV2: {
            message: {
                ...inside,
                messageContextInfo: {
                    messageSecret
                }
            }
        }
    }, {})

    await sock.relayMessage(jid, msg.message, {
        messageId: msg.key.id
    })
}

async function handler(m, { sock }) {

    if (!m.isGroup) {
        return m.reply("❌ Fitur ini hanya bisa dipakai di grup.")
    }

    const text = m.text || ''
    let content = {}

    try {

        if (m.quoted && (m.quoted.isImage || m.quoted.isVideo)) {

            const buffer = await m.quoted.download()

            if (m.quoted.isImage) {
                content = {
                    image: buffer,
                    caption: text || ''
                }
            }

            if (m.quoted.isVideo) {
                content = {
                    video: buffer,
                    caption: text || ''
                }
            }

        }

        else if (m.isImage || m.isVideo) {

            const buffer = await m.download()

            if (m.isImage) {
                content = {
                    image: buffer,
                    caption: text || ''
                }
            }

            if (m.isVideo) {
                content = {
                    video: buffer,
                    caption: text || ''
                }
            }

        }

        else if (text) {

            content = {
                text: text,
                font: 0,
                backgroundColor: "#FF2E63"
            }

        }

        else {

            return m.reply(
`╭━━━〔 💗 RIMURU GROUP STORY 💗 〕━━⬣
┃
┃ Darling kirim sesuatu dong~
┃
┃ Cara pakai :
┃
┃ .upsw teks
┃ reply gambar .upsw
┃ reply video .upsw
┃
╰━━━━━━━━━━━━━━━━⬣`)
        }

        await sendGroupStatus(sock, m.chat, content)

        await m.reply(
`╭━━━〔 💗 RIMURU STORY 💗 〕━━⬣
┃
┃ 📡 Story grup berhasil dipost~
┃
┃ Sekarang icon grup
┃ punya border hijau 😳
┃
╰━━━━━━━━━━━━━━━━⬣`)

    } catch (err) {

        console.log(err)

        m.reply(
`╭━━━〔 ❌ ERROR 〕━━⬣
┃
┃ Gagal upload story
┃ coba lagi ya darling
┃
╰━━━━━━━━━━━━━━━━⬣`)
    }

}

export { pluginConfig as config, handler };
