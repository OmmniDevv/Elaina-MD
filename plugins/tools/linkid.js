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
    name: 'linkid',
    alias: ['idlink', 'getidlink'],
    category: 'tools',
    description: 'Ambil ID WhatsApp dari link channel atau grup',
    usage: '.linkid <link channel/grup>',
    example: '.linkid https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

function extractInviteCode(text, type) {
    const pattern = type === 'channel'
        ? /(?:https?:\/\/)?(?:www\.)?whatsapp\.com\/channel\/([^\s?/#]+)/i
        : /(?:https?:\/\/)?(?:www\.)?chat\.whatsapp\.com\/([^\s?/#]+)/i

    return text.match(pattern)?.[1] || null
}

async function getChannelMetadata(sock, inviteCode, link) {
    // Gunakan helper bawaan jika tersedia, lalu fallback ke API Baileys langsung.
    if (typeof sock.cekIDSaluran === 'function') {
        try {
            const metadata = await sock.cekIDSaluran(link)
            if (metadata?.id) return metadata
        } catch {}
    }

    if (typeof sock.newsletterMetadata !== 'function') {
        throw new Error('API newsletterMetadata tidak tersedia')
    }

    return await sock.newsletterMetadata('invite', inviteCode)
}

async function handler(m, { sock }) {
    const text = m.text?.trim()

    if (!text) {
        return m.reply(
            `🔗 *LINK ID*

` +
            `Ambil ID dari link WhatsApp secara otomatis.

` +
            `*Contoh:*
` +
            `• ${m.prefix}linkid https://whatsapp.com/channel/CHANNEL_ID
` +
            `• ${m.prefix}linkid https://chat.whatsapp.com/xxxxxxxxxxxxxxxxxxxx`
        )
    }

    // JID langsung juga diterima agar command tetap praktis.
    if (/^\d+@(?:newsletter|g\.us)$/i.test(text)) {
        const type = text.endsWith('@newsletter') ? 'Saluran' : 'Grup'
        return m.reply(`🆔 *${type} ID:*
\`${text}\``)
    }

    const isChannel = /(?:https?:\/\/)?(?:www\.)?whatsapp\.com\/channel\//i.test(text)
    const isGroup = /(?:https?:\/\/)?(?:www\.)?chat\.whatsapp\.com\//i.test(text)

    if (!isChannel && !isGroup) {
        return m.reply(
            `❌ *LINK TIDAK VALID*

` +
            `Link yang didukung:
` +
            `• Link Channel: https://whatsapp.com/channel/CHANNEL_ID
` +
            `• Link Grup: https://chat.whatsapp.com/xxxxxxxxxxxxxxxxxxxx`
        )
    }

    await m.react('🔎')

    try {
        if (isChannel) {
            const inviteCode = extractInviteCode(text, 'channel')
            if (!inviteCode) throw new Error('Kode invite channel tidak ditemukan')

            const metadata = await getChannelMetadata(sock, inviteCode, text)
            const channelId = metadata?.id

            if (!channelId || !channelId.endsWith('@newsletter')) {
                throw new Error('ID channel tidak ditemukan')
            }

            const name = metadata.name || 'Tidak diketahui'
            const subscribers = metadata.subscribers ?? metadata.subscribers_count

            await m.reply(
                `📢 *CHANNEL DITEMUKAN*

` +
                `• Nama: *${name}*
` +
                `• ID: \`${channelId}\`
` +
                (subscribers != null ? `• Pengikut: *${subscribers}*\n` : '') +
                `• Tipe: *WhatsApp Channel*

` +
                `> ID berhasil diambil dari link channel.`
            )
        } else {
            const inviteCode = extractInviteCode(text, 'group')
            if (!inviteCode) throw new Error('Kode invite grup tidak ditemukan')
            if (typeof sock.groupGetInviteInfo !== 'function') {
                throw new Error('API groupGetInviteInfo tidak tersedia')
            }

            const metadata = await sock.groupGetInviteInfo(inviteCode)
            const groupId = metadata?.id

            if (!groupId || !groupId.endsWith('@g.us')) {
                throw new Error('ID grup tidak ditemukan')
            }

            await m.reply(
                `👥 *GRUP DITEMUKAN*

` +
                `• Nama: *${metadata.subject || 'Tidak diketahui'}*
` +
                `• ID: \`${groupId}\`
` +
                `• Tipe: *WhatsApp Group*
` +
                (metadata.participants?.length != null
                    ? `• Anggota: *${metadata.participants.length}*\n`
                    : '') +
                `
> ID berhasil diambil dari link grup.`
            )
        }

        await m.react('✅')
    } catch (error) {
        console.error('[LinkID] Error:', error.message)
        await m.react('❌')
        return m.reply(
            `❌ *GAGAL MENGAMBIL ID*

` +
            `Link mungkin tidak valid, sudah kedaluwarsa, atau API WhatsApp tidak tersedia.

` +
            `> ${te(m.prefix, m.command, m.pushName)}`
        )
    }
}

export { pluginConfig as config, handler }
