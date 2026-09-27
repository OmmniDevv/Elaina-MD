/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import config from '../../config.js';
const pluginConfig = {
    name: 'faketag',
    alias: ['ftag', 'fake'],
    category: 'tools',
    description: 'Fake tag ala Rimuru',
    usage: '.faketag @user|pesan tag|pesan',
    example: '.faketag 628xxx|Darling...|Kamu dimana? 💕',
    cooldown: 5,
    isGroup: true
}

async function handler(m, { sock }) {

    try {

        const body =
            m.body ||
            m.text ||
            ''

        if (!body.includes('|')) {

            return m.reply(
`💗 *RIMURU FAKETAG*

❌ Format salah darling~

📌 Format:
.faketag @user|pesan tag|pesan`
            )
        }

        const parts =
            body.split('|')

        if (parts.length < 3) {

            return m.reply(
`💗 *RIMURU FAKETAG*

❌ Parameter kurang~

📌 Format:
target|pesan tag|pesan`
            )
        }

        const targetInput = parts[0]
        const pesanTag = parts[1].trim()
        const pesan = parts[2].trim()

        let target

        if (m.mentionedJid?.length > 0) {
            target = m.mentionedJid[0]
        } else {

            const nomor =
                targetInput.replace(/[^0-9]/g, '')

            if (!nomor) {

                return m.reply(
`❌ Target tidak valid darling~`
                )
            }

            target = nomor + '@s.whatsapp.net'
        }

        // FAKE QUOTE (EXTENDED TEXT VERSION)
        const fakeQuoted = {
            key: {
                fromMe: false,
                participant: target,
                remoteJid: m.chat
            },
            message: {
                extendedTextMessage: {
                    text: pesanTag
                }
            }
        }

        // SEND (EXTENDED TEXT MESSAGE)
        await sock.sendMessage(
            m.chat,
            {
                text: pesan,
                contextInfo: {
                    mentionedJid: [target]
                }
            },
            {
                quoted: fakeQuoted
            }
        )

    } catch (err) {

        console.error('[FAKETAG ERROR]', err)

        m.reply(
`❌ *RIMURU ERROR*

> ${err.message}`
        )
    }
}

export { pluginConfig as config, handler };
