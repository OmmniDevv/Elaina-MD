/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import config from '../../config.js'
import { getDatabase } from '../../src/lib/elaina-database.js'
const pluginConfig = {
    name: 'cekprem',
    alias: ['cekpremium', 'preminfo'],
    category: 'cek',
    description: 'Cek detail status premium user',
    usage: '.cekprem @user',
    example: '.cekprem',
    isOwner: false,
    isPremium: true,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

function formatDate(ts) {
    return new Date(ts).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

async function handler(m) {
    const db = getDatabase()
    let targetNumber = ''

    if (m.quoted) {
        targetNumber = m.quoted.sender?.replace(/[^0-9]/g, '') || ''
    } else if (m.mentionedJid?.length) {
        targetNumber = m.mentionedJid[0]?.replace(/[^0-9]/g, '') || ''
    } else if (m.args?.length) {
        targetNumber = m.args[0].replace(/[^0-9]/g, '')
    } else {
        targetNumber = m.sender?.replace(/[^0-9]/g, '') || ''
    }

    if (targetNumber.startsWith('0')) targetNumber = '62' + targetNumber.slice(1)
    if (!db.data.premium) db.data.premium = []

    const premData = db.data.premium.find(p =>
        typeof p === 'string' ? p === targetNumber : p.id === targetNumber
    )
    const jid = targetNumber + '@s.whatsapp.net'
    const isConfigPrem = config.isPremium(targetNumber)
    const isConfigOwner = config.isOwner(targetNumber)

    if (!premData && !isConfigPrem && !isConfigOwner) {
        return m.reply(`❌ @${targetNumber} bukan premium`, { mentions: [jid] })
    }

    const user = db.getUser(jid)
    const now = Date.now()

    let txt = `💎 *DETAIL PREMIUM*\n\n`
    txt += `👤 User: @${targetNumber}\n`

    if (isConfigOwner) {
        txt += `🏷️ Role: *👑 Owner (Permanent)*\n`
    } else if (typeof premData === 'string' || !premData?.expired) {
        txt += `🏷️ Role: *💎 Premium (Permanent)*\n`
    } else {
        const remaining = Math.ceil((premData.expired - now) / (1000 * 60 * 60 * 24))
        const totalDays = premData.addedAt ? Math.ceil((premData.expired - premData.addedAt) / (1000 * 60 * 60 * 24)) : '?'
        txt += `📛 Nama: *${premData.name || 'Unknown'}*\n`
        txt += `📅 Mulai: *${premData.addedAt ? formatDate(premData.addedAt) : 'Unknown'}*\n`
        txt += `⏳ Expired: *${formatDate(premData.expired)}*\n`
        txt += `🗓️ Durasi: *${totalDays} hari*\n`
        txt += `📊 Sisa: *${remaining > 0 ? remaining + ' hari' : '⚠️ Expired'}*\n`
    }

    if (user) {
        txt += `⚡ Energi: *${user.energi === -1 ? '∞' : (user.energi ?? 0)}*\n`
        txt += `💰 Koin: *${user.koin === -1 ? '∞' : (user.koin ?? 0).toLocaleString('id-ID')}*\n`
        txt += `⭐ Exp: *${(user.exp ?? 0).toLocaleString('id-ID')}*\n`
        txt += `📊 Level: *${user.level ?? 1}*\n`
    }

    await m.reply(txt, { mentions: [jid] })
}

export { pluginConfig as config, handler }