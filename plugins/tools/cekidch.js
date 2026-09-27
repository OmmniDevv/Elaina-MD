/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import config from '../../config.js'
import te from '../../src/lib/elaina-error.js'

const pluginConfig = {
    name: 'cekidch',
    alias: ['idch', 'channelid', 'infoch', 'channelinfo'],
    category: 'tools',
    description: 'Cek ID dan info lengkap channel dari link',
    usage: '.cekidch <link channel>',
    example: '.cekidch https://whatsapp.com/channel/xxxxx',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

function formatDate(timestamp) {
    if (!timestamp) return '—'
    const d = new Date(typeof timestamp === 'number' && timestamp < 1e12 ? timestamp * 1000 : timestamp)
    const pad = n => String(n).padStart(2, '0')
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function formatSubs(count) {
    if (!count || count === 0) return '0'
    if (count >= 1_000_000) return (count / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
    if (count >= 1_000) return (count / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
    return String(count)
}

async function handler(m, { sock }) {
    const text = m.text?.trim()

    if (!text) {
        return m.reply(
            `ℹ️ *INFORMASI PENGGUNAAN*\n\n` +
            `Silakan masukkan link channel WhatsApp yang ingin Anda cek informasinya secara detail.\n\n` +
            `*CONTOH PENGGUNAAN:*\n` +
            `• \`${m.prefix}cekidch https://whatsapp.com/channel/xxxxx\``
        )
    }

    if (!text.includes('https://whatsapp.com/channel/')) {
        return m.reply(`❌ *LINK TIDAK VALID*\n\nPastikan link yang Anda masukkan adalah link channel WhatsApp yang sah dan benar.`)
    }

    m.react('🕕')

    try {
        const metadata = await sock.cekIDSaluran(text)

        if (!metadata?.id) {
            m.react('❌')
            return m.reply(`❌ *CHANNEL TIDAK DITEMUKAN*\n\nMaaf, sistem tidak dapat menemukan informasi dari channel tersebut. Mungkin link sudah kedaluwarsa atau channel telah dihapus.`)
        }

        const chName = metadata.name || 'Unknown'
        const chId = metadata.id
        const chSubs = metadata.subscribers ?? metadata.subscribers_count ?? 0
        const chDesc = metadata.description || '—'
        const chVerified = metadata.verification === 'VERIFIED' ? '✓ Verified' : 'Unverified'
        const chCreated = formatDate(metadata.creation_time)
        const chPicUrl = metadata.preview === "https://mmg.whatsapp.net" ? "https://files.catbox.moe/lp9tpd.jpg" : metadata.preview

        const descPreview = chDesc.length > 120 ? chDesc.slice(0, 120) + '...' : chDesc

        const infoText =
            `Berikut adalah detail informasi lengkap mengenai channel yang Anda cari:\n\n` +
            `*RINCIAN CHANNEL:*\n` +
            `• Nama: *${chName}*\n` +
            `• ID Channel: \`${chId}\`\n` +
            `• Subscriber: *${formatSubs(chSubs)}*\n` +
            `• Status: *${chVerified}*\n` +
            `• Dibuat Pada: *${chCreated}*\n\n` +
            `*DESKRIPSI:*\n` +
            `${descPreview}`

        const buttons = [
            {
                name: 'cta_copy',
                buttonParamsJson: JSON.stringify({
                    display_text: '📋 Ambil ID Saluran nya',
                    copy_code: chId
                })
            },
            {
                name: 'cta_url',
                buttonParamsJson: JSON.stringify({
                    display_text: '🔗 Buka Channel nya',
                    url: text
                })
            }
        ]

        await sock.sendButton(m.chat, chPicUrl, infoText, m, {
            buttons: buttons,
            footer: `© ${config.bot?.name || 'Rimuru-AI'}`,
        })

        m.react('✅')

    } catch (error) {
        console.error('[CekIdCh] Error:', error.message)
        m.react('❌')
        m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }