// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// Anti Media — port dari pain-bot (anti-img, anti-video, anti-sticker, anti-audio, anti-document, anti-contact, anti-mention, anti-bot)
// Semua dalam 1 middleware biar ringan. Aktif per-grup via db.data.chats[chat].antiMedia
export async function before(m, { isAdmin, isBotAdmin }) {
    if (m.isBaileys && m.fromMe) return false
    if (!m.isGroup) return false
    if (!global.db?.data) return false

    let chat = global.db.data.chats[m.chat]
    if (!chat) return false

    const antiMedia = chat.antiMedia || {}
    const sender = m.sender
    const mtype = m.mtype || ''

    // Skip admin & owner
    if (isAdmin) return false
    if (global.owner?.some(([num]) => sender.startsWith(num.replace(/[^0-9]/g, '')))) return false

    // Anti Image
    if (antiMedia.image && /image/i.test(mtype)) {
        if (isBotAdmin) {
            await this.sendMessage(m.chat, { delete: m.key })
            await this.sendMessage(m.chat, { text: `⚠️ *@${sender.split('@')[0]}* mengirim gambar!\nAnti-image aktif.`, mentions: [sender] })
        }
        return true
    }

    // Anti Video
    if (antiMedia.video && /video/i.test(mtype)) {
        if (isBotAdmin) {
            await this.sendMessage(m.chat, { delete: m.key })
            await this.sendMessage(m.chat, { text: `⚠️ *@${sender.split('@')[0]}* mengirim video!\nAnti-video aktif.`, mentions: [sender] })
        }
        return true
    }

    // Anti Sticker
    if (antiMedia.sticker && /sticker/i.test(mtype)) {
        if (isBotAdmin) {
            await this.sendMessage(m.chat, { delete: m.key })
            await this.sendMessage(m.chat, { text: `⚠️ *@${sender.split('@')[0]}* mengirim sticker!\nAnti-sticker aktif.`, mentions: [sender] })
        }
        return true
    }

    // Anti Audio/Voice
    if (antiMedia.audio && /audio|voice|vn/i.test(mtype)) {
        if (isBotAdmin) {
            await this.sendMessage(m.chat, { delete: m.key })
            await this.sendMessage(m.chat, { text: `⚠️ *@${sender.split('@')[0]}* mengirim audio!\nAnti-audio aktif.`, mentions: [sender] })
        }
        return true
    }

    // Anti Document
    if (antiMedia.document && /document/i.test(mtype)) {
        if (isBotAdmin) {
            await this.sendMessage(m.chat, { delete: m.key })
            await this.sendMessage(m.chat, { text: `⚠️ *@${sender.split('@')[0]}* mengirim dokumen!\nAnti-document aktif.`, mentions: [sender] })
        }
        return true
    }

    // Anti Contact
    if (antiMedia.contact && /contact/i.test(mtype)) {
        if (isBotAdmin) {
            await this.sendMessage(m.chat, { delete: m.key })
            await this.sendMessage(m.chat, { text: `⚠️ *@${sender.split('@')[0]}* mengirim kontak!\nAnti-contact aktif.`, mentions: [sender] })
        }
        return true
    }

    // Anti Mention (tag semua member)
    if (antiMedia.mention && m.mentionedJid?.length > 5) {
        if (isBotAdmin) {
            await this.sendMessage(m.chat, { delete: m.key })
            await this.sendMessage(m.chat, { text: `⚠️ *@${sender.split('@')[0]}* mention terlalu banyak!\nAnti-mention aktif.`, mentions: [sender] })
        }
        return true
    }

    // Anti Bot (detect bot lain via pattern)
    if (antiMedia.bot && !m.fromMe) {
        const botPatterns = [/.menu/i, /.help/i, /.prefix/i, /.owner/i, /.bot/i]
        const isOtherBot = botPatterns.some(p => p.test(m.text)) && m.text.length < 20
        if (isOtherBot) {
            // Only warn, don't kick (false positive risk)
            await this.sendMessage(m.chat, { text: `🤖 Terdeteksi kemungkinan bot lain.`, mentions: [sender] })
        }
    }

    return false
}
