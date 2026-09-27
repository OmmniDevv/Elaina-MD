/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js'
import { getParticipantJid } from '../../src/lib/elaina-lid.js'
import te from '../../src/lib/elaina-error.js'
const pluginConfig = {
    name: 'warn',
    alias: ['warning', 'peringatan'],
    category: 'group',
    description: 'Memberi peringatan kepada member',
    usage: '.warn @user <alasan>',
    example: '.warn @user spam',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    isAdmin: true,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    const db = getDatabase()
    
    let groupData = db.getGroup(m.chat) || {}
    let warnings = groupData.warnings || {}
    const maxWarns = groupData.maxWarnings || 3

    const args = m.args
    if (!args[0] && !m.quoted && (!m.mentionedJid || m.mentionedJid.length === 0)) {
        return m.reply(
            `⚠️ *SISTEM WARNING GRUP*\n\n` +
            `Sistem manajemen pelanggaran untuk member grup.\n` +
            `Batas Warning: *${maxWarns} kali* (Otomatis Kick)\n\n` +
            `*PENGGUNAAN:*\n` +
            `• *${m.prefix}warn @user <alasan>* — Memberi warning\n` +
            `• *${m.prefix}warn max <angka>* — Mengubah batas maksimal warning\n` +
            `• *${m.prefix}listwarn* — Melihat daftar member bermasalah\n` +
            `• *${m.prefix}resetwarn @user* — Menghapus semua warning member\n\n` +
            `*PENJELASAN ALUR PENGGUNAAN:*\n` +
            `1. Saat member melakukan pelanggaran pertama, beri mereka SP1: *${m.prefix}warn @user Spam pesan*\n` +
            `2. Bot akan mencatat "Spam pesan" sebagai warning ke-1 mereka.\n` +
            `3. Jika melanggar lagi, beri peringatan kedua dengan alasan baru: *${m.prefix}warn @user Berkata kasar*\n` +
            `4. Jika total peringatan member mencapai batas maksimal (saat ini *${maxWarns}*), bot akan otomatis MENGELUARKAN (Kick) member tersebut.\n` +
            `5. Riwayat pelanggaran bisa dilihat lengkap dengan mengetik *${m.prefix}listwarn @user*.`
        )
    }
    if (args[0]?.toLowerCase() === 'max') {
        const newMax = parseInt(args[1])
        if (isNaN(newMax) || newMax < 1 || newMax > 20) {
            return m.reply(`❌ *GAGAL*\n\nBatas referensi warning harus berupa angka 1-20.\nContoh: *${m.prefix}warn max 5*`)
        }
        groupData.maxWarnings = newMax
        db.setGroup(m.chat, groupData)
        return m.reply(`✅ *BATAS WARNING DIUBAH*\n\nMaksimal warning grup ini telah diupdate menjadi *${newMax} kali*.`)
    }

    let targetUser = null
    if (m.quoted) {
        targetUser = m.quoted.sender
    } else if (m.mentionedJid && m.mentionedJid.length > 0) {
        targetUser = m.mentionedJid[0]
    }
    
    if (!targetUser) {
        await m.reply(
            `⚠️ *CARA PAKAI*\n\n` +
            `> Reply pesan user + \`${m.prefix}warn alasan\`\n` +
            `> Atau: \`${m.prefix}warn @user alasan\``
        )
        return
    }
    try {
        const groupMeta = m.groupMetadata
        const participant = groupMeta.participants.find(p => getParticipantJid(p) === targetUser)
        if (participant?.admin) {
            await m.reply(`❌ Tidak bisa memberikan warning kepada admin grup.`)
            return
        }
    } catch (e) {}
    
    const botJid = sock.user?.id?.split(':')[0] + '@s.whatsapp.net'
    if (targetUser === botJid) {
        await m.reply(`❌ Gak usah warn aku, aku cuma bot.`)
        return
    }
    
    const reasonArg = m.quoted ? m.text?.trim() : m.text?.replace(/@\d+/g, '').replace(/^\s*warn\s*/i, '').trim()
    const reason = reasonArg || 'Tidak ada alasan'
    
    let userWarnings = warnings[targetUser] || []
    userWarnings.push({
        reason: reason,
        by: m.sender,
        time: Date.now()
    })
    
    warnings[targetUser] = userWarnings
    db.setGroup(m.chat, { ...groupData, warnings: warnings })
    
    const warnCount = userWarnings.length
    const targetName = targetUser.split('@')[0]
    
    if (warnCount >= maxWarns) {
        try {
            await sock.groupParticipantsUpdate(m.chat, [targetUser], 'remove')
            await m.reply(
                `🚨 *MAX WARNING TERCAPAI*\n\n` +
                `@${targetName} telah dikeluarkan dari grup karena mencapai batas pelanggaran!\n\n` +
                `*Rincian:*\n` +
                `> Warning: *${warnCount}/${maxWarns}*\n` +
                `> Alasan Terakhir: *${reason}*`,
                { mentions: [targetUser] }
            )
            delete warnings[targetUser]
            db.setGroup(m.chat, { ...groupData, warnings: warnings })
        } catch (e) {
            m.reply(te(m.prefix, m.command, m.pushName))
        }
    } else {
        await m.reply(
            `⚠️ *PERINGATAN DIBERIKAN*\n\n` +
            `@${targetName} telah menerima Surat Peringatan (SP${warnCount})!\n\n` +
            `*Rincian:*\n` +
            `> Warning ke: *${warnCount}/${maxWarns}*\n` +
            `> Alasan: *${reason}*\n\n` +
            `_${maxWarns - warnCount} warning lagi = KICK OTOMATIS_`,
            { mentions: [targetUser] }
        )
    }
}

export { pluginConfig as config, handler }