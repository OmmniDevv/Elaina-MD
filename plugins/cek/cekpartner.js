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
    name: 'cekpartner',
    alias: ['partnerinfo'],
    category: 'cek',
    description: 'Cek detail status partner user',
    usage: '.cekpartner @user',
    example: '.cekpartner',
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
    if (!db.data.partner) db.data.partner = []

    const info = db.data.partner.find(p => p.id === targetNumber)
    const jid = targetNumber + '@s.whatsapp.net'

    if (!info) {
        return m.reply(`❌ @${targetNumber} bukan partner`, { mentions: [jid] })
    }

    const now = Date.now()
    const remaining = Math.ceil((info.expired - now) / (1000 * 60 * 60 * 24))
    const totalDays = info.addedAt ? Math.ceil((info.expired - info.addedAt) / (1000 * 60 * 60 * 24)) : '?'
    const user = db.getUser(jid)

    let txt = `🤝 *DETAIL PARTNER*\n\n`
    txt += `👤 User: @${targetNumber}\n`
    txt += `📛 Nama: *${info.name || 'Unknown'}*\n`
    txt += `📅 Mulai: *${info.addedAt ? formatDate(info.addedAt) : 'Unknown'}*\n`
    txt += `⏳ Expired: *${formatDate(info.expired)}*\n`
    txt += `🗓️ Durasi: *${totalDays} hari*\n`
    txt += `📊 Sisa: *${remaining > 0 ? remaining + ' hari' : '⚠️ Expired'}*\n`
    if (user) {
        txt += `⚡ Energi: *${user.energi === -1 ? '∞' : (user.energi ?? 0)}*\n`
        txt += `💰 Koin: *${user.koin === -1 ? '∞' : (user.koin ?? 0).toLocaleString('id-ID')}*\n`
    }

    await m.reply(txt, { mentions: [jid] })
}

export { pluginConfig as config, handler }