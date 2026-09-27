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
    name: 'listsewa',
    alias: ['sewalist', 'daftarsewa'],
    category: 'owner',
    description: 'Lihat daftar grup yang terdaftar sewa',
    usage: '.listsewa',
    example: '.listsewa',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

function formatCountdown(data) {
    if (data.status === 'expired') return '🚫 EXPIRED (left)'
    if (data.isLifetime) return '♾️ Permanent'
    const diff = data.expiredAt - Date.now()
    if (diff <= 0) return '❌ EXPIRED'
    const days = Math.floor(diff / 86400000)
    const hours = Math.floor((diff % 86400000) / 3600000)
    const minutes = Math.floor((diff % 3600000) / 60000)
    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
}

function getStatusEmoji(data) {
    if (data.status === 'expired') return '🚫'
    if (data.isLifetime) return '♾️'
    const diff = data.expiredAt - Date.now()
    if (diff <= 0) return '❌'
    if (diff <= 259200000) return '⚠️'
    return '✅'
}

function handler(m) {
    const db = getDatabase()
    if (!db.db.data.sewa) {
        db.db.data.sewa = { enabled: false, groups: {} }
        db.db.write()
    }

    const sewaGroups = db.db.data.sewa.groups || {}
    const groupIds = Object.keys(sewaGroups)

    if (groupIds.length === 0) {
        return m.reply(
            `📋 *DAFTAR SEWA*\n\n` +
            `Status: *${db.db.data.sewa.enabled ? '✅ AKTIF' : '❌ NONAKTIF'}*\n` +
            `Belum ada grup terdaftar\n\n` +
            `Tambah dengan: *${m.prefix}addsewa <link> <durasi>*`
        )
    }

    const sorted = groupIds.sort((a, b) => {
        const aData = sewaGroups[a]
        const bData = sewaGroups[b]
        if (aData.isLifetime && !bData.isLifetime) return 1
        if (!aData.isLifetime && bData.isLifetime) return -1
        return (aData.expiredAt || 0) - (bData.expiredAt || 0)
    })

    const active = sorted.filter(id => sewaGroups[id].isLifetime || sewaGroups[id].expiredAt > Date.now())
    const expired = sorted.filter(id => !sewaGroups[id].isLifetime && sewaGroups[id].expiredAt <= Date.now())

    let text = `📋 *DAFTAR SEWA*\n\n`
    text += `Status sistem: *${db.db.data.sewa.enabled ? '✅ AKTIF' : '❌ NONAKTIF'}*\n`
    text += `Total: *${groupIds.length}* grup (${active.length} aktif, ${expired.length} expired)\n\n`

    for (let i = 0; i < sorted.length; i++) {
        const gid = sorted[i]
        const data = sewaGroups[gid]
        const status = getStatusEmoji(data)
        const countdown = formatCountdown(data)
        const addedDate = data.addedAt ? timeHelper.fromTimestamp(data.addedAt, 'DD/MM/YYYY') : '-'

        text += `${status} *${i + 1}. ${data.name || 'Unknown'}*\n`
        text += `   ID: ${gid.split('@')[0]}\n`
        text += `   Sisa: ${countdown}\n`
        text += `   Ditambah: ${addedDate}\n\n`
    }

    text += `*AKSI:*\n`
    text += `• *${m.prefix}renewsewa <id> <durasi>* — Perpanjang\n`
    text += `• *${m.prefix}delsewa <id>* — Hapus dari whitelist`

    return m.reply(text)
}

export { pluginConfig as config, handler }