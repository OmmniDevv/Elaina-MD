/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from './elaina-database.js'
import { logger } from './elaina-logger.js'
import { CronJob } from 'cron'

const TZ = 'Asia/Jakarta'

let sock = null
const notifCronJobs = new Map()
let refreshJob = null

const MAKAN_MESSAGES = [
    '🍽️ *Waktunya makan {label}!*\n\n⏰ *{jam} WIB*\n\nJangan skip makan ya, tubuh butuh asupan energi biar tetap produktif 💪\n{menu}\n\n📌 _Diatur oleh @{sender}_',
    '🥗 *Heyy @{sender}, udah jam {jam} nih!*\n\nSaatnya isi perut dulu 🍛\nMakan yang bergizi biar badan tetap fit!\n{menu}',
    '🍜 *Reminder makan {label}*\n\n⏰ *{jam} WIB*\n\nPerut kosong bikin mood jelek lho 😤\nYuk makan dulu sebelum lanjut aktivitas\n{menu}\n\n📌 _Diatur oleh @{sender}_',
    '🍜 *MAKAN DULU WOYY @{sender}*\n\nPakai ? {menu}',
]

const TIDUR_MESSAGES = [
    '🌙 *Waktunya istirahat!*\n\n⏰ *{jam} WIB*\n\nTaruh HP-nya, pejamkan mata 😴\nTidur cukup bikin otak fresh buat besok!\n_Selamat malam_ 🌟\n\n📌 _Diatur oleh @{sender}_',
    '💤 *Udah jam {jam} nih @{sender}!*\n\nYuk istirahat, jangan begadang terus 🛏️\nKesehatan itu investasi paling berharga\n_Mimpi indah ya_ ✨',
    '😴 *Reminder tidur malam*\n\n⏰ *{jam} WIB*\n\nLayar HP itu musuh tidur nyenyak 📵\nMatikan notifikasi dan rebahan sekarang!\n_Good night_ 🌜\n\n📌 _Diatur oleh @{sender}_',
    '*TURU WOYY @{sender}*\n\n⏰ Udah jam *{jam}*',
]

function getRandomMessage(templates, jam, menu, label, senderJid) {
    const idx = Math.floor(Math.random() * templates.length)
    const senderMention = senderJid ? senderJid.split('@')[0] : ''
    let msg = templates[idx]
        .replace(/\{jam\}/g, jam)
        .replace(/\{label\}/g, label || '')
        .replace(/\{menu\}/g, menu ? `🍴 _${menu}_` : '')
        .replace(/\{sender\}/g, senderMention)
    return msg.trim()
}

function getMealLabel(jam) {
    const hour = parseInt(jam.split(':')[0], 10)
    if (hour >= 4 && hour < 10) return 'pagi'
    if (hour >= 10 && hour < 15) return 'siang'
    if (hour >= 15 && hour < 18) return 'sore'
    return 'malam'
}

function clearNotifCronJobs() {
    for (const [, job] of notifCronJobs) job.stop()
    notifCronJobs.clear()
}

function buildCronJobs() {
    clearNotifCronJobs()
    if (!sock) return

    const db = getDatabase()
    const makanData = db.setting('notifMakan') || {}
    const tidurData = db.setting('notifTidur') || {}
    const todayStr = new Date(new Date().toLocaleString('en-US', { timeZone: TZ })).toISOString().slice(0, 10)

    for (const [key, entry] of Object.entries(makanData)) {
        if (!entry.enabled || !entry.jadwal) continue
        for (const jam of entry.jadwal) {
            const [h, m] = jam.split(':').map(Number)
            const cronKey = `makan_${key}_${jam}`
            if (notifCronJobs.has(cronKey)) continue

            const job = new CronJob(`${m} ${h} * * *`, async () => {
                await processEntry(entry, jam, 'makan', key, db, todayStr)
            }, null, true, TZ)

            notifCronJobs.set(cronKey, job)
        }
    }

    for (const [key, entry] of Object.entries(tidurData)) {
        if (!entry.enabled || !entry.jadwal) continue
        for (const jam of entry.jadwal) {
            const [h, m] = jam.split(':').map(Number)
            const cronKey = `tidur_${key}_${jam}`
            if (notifCronJobs.has(cronKey)) continue

            const job = new CronJob(`${m} ${h} * * *`, async () => {
                await processEntry(entry, jam, 'tidur', key, db, todayStr)
            }, null, true, TZ)

            notifCronJobs.set(cronKey, job)
        }
    }

    logger.info('NotifScheduler', `Ada ${notifCronJobs.size} alarm notifikasi yang lagi jalan nih (${TZ})`)
}

async function processEntry(entry, jam, type, key, db, dateStr) {
    const lastSent = entry.lastSent || {}
    const sentKey = `${jam}_${dateStr}`
    if (lastSent[sentKey]) return

    try {
        const templates = type === 'makan' ? MAKAN_MESSAGES : TIDUR_MESSAGES
        const label = type === 'makan' ? getMealLabel(jam) : ''
        const menu = entry.menu || ''
        const text = getRandomMessage(templates, jam, menu, label, entry.sender)

        const isGroup = entry.chatJid.endsWith('@g.us')
        let mentions = [entry.sender]

        if (isGroup) {
            try {
                const meta = await sock.groupMetadata(entry.chatJid)
                const participants = (meta.participants || []).map(p => p.id)
                mentions = [...new Set([entry.sender, ...participants])]
            } catch {}
        }

        await sock.sendMessage(entry.chatJid, { text, mentions })

        lastSent[sentKey] = true
        entry.lastSent = lastSent

        const settingKey = type === 'makan' ? 'notifMakan' : 'notifTidur'
        const allData = db.setting(settingKey) || {}
        allData[key] = entry
        db.setting(settingKey, allData)

        cleanOldSentKeys(lastSent)
        logger.info('NotifScheduler', `Sukses ngirim alarm ${type} ke ${entry.chatJid} (${jam})`)

        await new Promise(r => setTimeout(r, 300))
    } catch (err) {
        logger.error('NotifScheduler', `Gagal ngirim alarm ${type} ke ${entry.chatJid}: ${err.message}`)
    }
}

function cleanOldSentKeys(lastSent) {
    const keys = Object.keys(lastSent)
    if (keys.length <= 20) return
    const sorted = keys.sort()
    const toRemove = sorted.slice(0, sorted.length - 10)
    for (const k of toRemove) delete lastSent[k]
}

function getNotifKey(sender, chatJid) {
    return `${sender}_${chatJid}`
}

function setNotifMakan(sender, chatJid, jadwal, menu) {
    const db = getDatabase()
    const data = db.setting('notifMakan') || {}
    const key = getNotifKey(sender, chatJid)
    data[key] = {
        sender, chatJid, jadwal,
        menu: menu || '',
        enabled: true,
        lastSent: data[key]?.lastSent || {},
        createdAt: data[key]?.createdAt || Date.now()
    }
    db.setting('notifMakan', data)
    buildCronJobs()
    return data[key]
}

function setNotifTidur(sender, chatJid, jadwal) {
    const db = getDatabase()
    const data = db.setting('notifTidur') || {}
    const key = getNotifKey(sender, chatJid)
    data[key] = {
        sender, chatJid, jadwal,
        enabled: true,
        lastSent: data[key]?.lastSent || {},
        createdAt: data[key]?.createdAt || Date.now()
    }
    db.setting('notifTidur', data)
    buildCronJobs()
    return data[key]
}

function toggleNotif(type, sender, chatJid, enabled) {
    const db = getDatabase()
    const settingKey = type === 'makan' ? 'notifMakan' : 'notifTidur'
    const data = db.setting(settingKey) || {}
    const key = getNotifKey(sender, chatJid)
    if (!data[key]) return null
    data[key].enabled = enabled
    db.setting(settingKey, data)
    buildCronJobs()
    return data[key]
}

function getNotif(type, sender, chatJid) {
    const db = getDatabase()
    const settingKey = type === 'makan' ? 'notifMakan' : 'notifTidur'
    const data = db.setting(settingKey) || {}
    return data[getNotifKey(sender, chatJid)] || null
}

function deleteNotif(type, sender, chatJid) {
    const db = getDatabase()
    const settingKey = type === 'makan' ? 'notifMakan' : 'notifTidur'
    const data = db.setting(settingKey) || {}
    const key = getNotifKey(sender, chatJid)
    if (!data[key]) return false
    delete data[key]
    db.setting(settingKey, data)
    buildCronJobs()
    return true
}

function parseJadwal(input) {
    const times = input.split(',').map(t => t.trim()).filter(Boolean)
    const valid = []
    for (const t of times) {
        const match = t.match(/^(\d{1,2})[.:](\d{2})$/)
        if (!match) continue
        const h = parseInt(match[1], 10)
        const m = parseInt(match[2], 10)
        if (h < 0 || h > 23 || m < 0 || m > 59) continue
        valid.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    }
    return [...new Set(valid)].sort()
}

function initNotifScheduler(socketInstance) {
    sock = socketInstance

    if (refreshJob) refreshJob.stop()
    refreshJob = new CronJob('1 0 * * *', () => {
        buildCronJobs()
    }, null, true, TZ)

    buildCronJobs()
    logger.info('NotifScheduler', 'Sistem alarm makan & tidur otomatis udah jalan mantap')
}

function stopNotifScheduler() {
    clearNotifCronJobs()
    if (refreshJob) {
        refreshJob.stop()
        refreshJob = null
    }
    logger.info('NotifScheduler', 'Sistem alarm udah dimatiin')
}

export {
    initNotifScheduler, stopNotifScheduler,
    setNotifMakan, setNotifTidur,
    toggleNotif, getNotif, deleteNotif, parseJadwal
}
