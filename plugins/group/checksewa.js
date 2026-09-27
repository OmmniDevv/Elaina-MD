/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js'
import * as timeHelper from '../../src/lib/elaina-time.js'
const pluginConfig = {
    name: 'checksewa',
    alias: ['ceksewa', 'sisasewa'],
    category: 'group',
    description: 'Cek sisa waktu sewa bot di grup ini',
    usage: '.checksewa',
    example: '.checksewa',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    isAdmin: false,
    cooldown: 10,
    energi: 0,
    isEnabled: true
}

function formatCountdown(expiredAt) {
    const diff = expiredAt - Date.now()
    if (diff <= 0) return { text: 'EXPIRED', expired: true }
    const days = Math.floor(diff / 86400000)
    const hours = Math.floor((diff % 86400000) / 3600000)
    const minutes = Math.floor((diff % 3600000) / 60000)
    let text = ''
    if (days > 0) text += `${days} hari `
    if (hours > 0) text += `${hours} jam `
    if (minutes > 0 && days === 0) text += `${minutes} menit`
    return { text: text.trim(), expired: false }
}

function handler(m) {
    const db = getDatabase()
    if (!db.db.data.sewa) {
        db.db.data.sewa = { enabled: false, groups: {} }
        db.db.write()
    }

    if (!db.db.data.sewa.enabled) {
        return m.reply(`ℹ️ Sistem sewa tidak aktif\n\nBot ini bisa digunakan di semua grup.`)
    }

    const sewaData = db.db.data.sewa.groups[m.chat]

    if (!sewaData) {
        return m.reply(`❌ Grup ini tidak terdaftar dalam sistem sewa\n\nHubungi owner bot untuk info sewa.`)
    }

    const groupName = sewaData.name || m.chat.split('@')[0]
    const addedDate = sewaData.addedAt ? timeHelper.fromTimestamp(sewaData.addedAt, 'D MMMM YYYY') : '-'

    if (sewaData.isLifetime) {
        m.react('♾️')
        return m.reply(
            `♾️ *STATUS SEWA*\n\n` +
            `Grup: *${groupName}*\n` +
            `Status: *Permanent* ♾️\n` +
            `Terdaftar sejak: *${addedDate}*\n\n` +
            `Bot akan aktif selamanya di grup ini.`
        )
    }

    const countdown = formatCountdown(sewaData.expiredAt)
    const expiredStr = timeHelper.fromTimestamp(sewaData.expiredAt, 'D MMMM YYYY HH:mm')

    if (countdown.expired) {
        return m.reply(
            `❌ *SEWA EXPIRED*\n\n` +
            `Grup: *${groupName}*\n` +
            `Berakhir: *${expiredStr}*\n\n` +
            `Hubungi owner bot untuk perpanjang sewa.`
        )
    }

    const diff = sewaData.expiredAt - Date.now()
    const isAlmostExpired = diff <= 259200000

    m.react(isAlmostExpired ? '⚠️' : '⏱️')
    let text = `⏱️ *STATUS SEWA*\n\n`
    text += `Grup: *${groupName}*\n`
    text += `Sisa waktu: *${countdown.text}*\n`
    text += `Berakhir: *${expiredStr}*\n`
    text += `Terdaftar sejak: *${addedDate}*`

    if (isAlmostExpired) {
        text += `\n\n⚠️ Sewa hampir habis! Hubungi owner bot untuk perpanjang.`
    }

    return m.reply(text)
}

export { pluginConfig as config, handler }