/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getParticipantJids } from '../../src/lib/elaina-lid.js'
import te from '../../src/lib/elaina-error.js'
const pluginConfig = {
    name: ['htpremium', 'hidetagpremium', 'htprem'],
    category: 'group',
    description: 'Hidetag dengan support reply pesan (teks/media)',
    usage: '.htprem [pesan] atau reply pesan',
    example: '.htprem atau reply pesan lalu .htprem',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    cooldown: 30,
    energi: 0,
    isEnabled: true,
    isAdmin: true,
    isBotAdmin: false
}

async function handler(m, { sock }) {
    try {
        const groupMeta = m.groupMetadata
        const participants = groupMeta.participants || []
        const mentions = getParticipantJids(participants)
        const quoted = m.quoted
        const [cmd, text] = m.text?.split('|')
        if (quoted) {
            const qMsg = quoted.message || {}
            const type = Object.keys(qMsg)[0]
            if (type === 'imageMessage') {
                const media = await quoted.download()
                const caption = qMsg.imageMessage?.caption || text || ''
                return sock.sendMessage(m.chat, {
                    image: media,
                    caption,
                    mentions
                })
            }
            if (type === 'videoMessage') {
                const media = await quoted.download()
                const caption = qMsg.videoMessage?.caption || text || ''
                return sock.sendMessage(m.chat, {
                    video: media,
                    caption,
                    mentions
                })
            }
            if (type === 'stickerMessage') {
                const media = await quoted.download()
                await sock.sendMessage(m.chat, {
                    sticker: media,
                    mentions
                })
                if (text) {
                    await sock.sendMessage(m.chat, {
                        text,
                        mentions
                    })
                }
                return
            }
            if (type === 'audioMessage') {
                const media = await quoted.download()
                const audioMsg = qMsg.audioMessage || {}

                await sock.sendMessage(m.chat, {
                    audio: media,
                    mimetype: audioMsg.mimetype,
                    ptt: audioMsg.ptt || false,
                    mentions
                })

                if (text) {
                    await sock.sendMessage(m.chat, {
                        text,
                        mentions
                    })
                }
                return
            }
            if (type === 'documentMessage') {
                const media = await quoted.download()
                const docMsg = qMsg.documentMessage || {}

                await sock.sendMessage(m.chat, {
                    document: media,
                    mimetype: docMsg.mimetype,
                    fileName: docMsg.fileName || 'file',
                    mentions
                })

                if (text) {
                    await sock.sendMessage(m.chat, {
                        text,
                        mentions
                    })
                }
                return
            }
            const quotedText =
                quoted.text ||
                qMsg.conversation ||
                qMsg.extendedTextMessage?.text ||
                ''

            const finalText = text || quotedText

            if (!finalText) {
                return m.reply('❌ *Pesan kosong*')
            }

            return sock.sendMessage(m.chat, {
                text: finalText,
                mentions
            })
        }
        if (!text) {
            return m.reply(
                `📢 *HIDETAG PREMIUM*\n\n` +
                `• Reply pesan lalu ketik \`${m.prefix}ht\`\n` +
                `• Atau ketik \`${m.prefix}ht <custom tag> | <pesan>\`\n\n` +
                `• Contoh: \`${m.prefix}ht everyone | hai semua\`\n\n` +
                `Support: teks, gambar, video, sticker, audio, dokumen`
            )
        }

        await sock.sendMessage(m.chat, {
            text: `@${m.chat} ${text} `,
            contextInfo: {
                groupMentions: [{
                    groupJid: m.chat,
                    groupSubject: cmd
                }],
                mentionedJid: mentions
            }
        }, { quoted: m })

    } catch (err) {
        m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }