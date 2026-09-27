/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import moment from 'moment-timezone';
import { generateWAMessageFromContent, proto, prepareWAMessageMedia } from '@rexxhayanasi/elaina-baileys';
import { RIMURU_CORE_CONFIG } from "../../config.js";
export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import config from '../../config.js';
import { getDatabase } from '../../src/lib/elaina-database.js';
import { addExpWithLevelCheck } from '../../src/lib/elaina-level.js';
const pluginConfig = {
    name: 'ramadhan',
    alias: ['bukapuasa', 'ngabuburit', 'tadarusan', 'teraweh', 'belitakjil', 'petasan', 'mokel', 'bangunin', 'bukber', 'kelilingsahur', 'patrol', 'sedekah', 'thr', 'wartakjil', 'bukawarung'],
    category: 'rpg',
    description: 'Fitur RPG Spesial Ramadhan',
    usage: '.sahur | .bukapuasa | .ngabuburit | ...',
    example: '.sahur',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

const TIMES = {
    SAHUR: { start: '02:00', end: '04:30' },
    BUKA: { start: '17:30', end: '18:30' },
    NGABUBURIT: { start: '15:00', end: '17:30' },
    TERAWEH: { start: '19:00', end: '22:00' }
}

const ITEMS = {
    takjil_gratis: { price: 0, effect: 'Energy +5' },
    es_buah: { price: 5000, effect: 'Energy +20, Mood ++' },
    gorengan: { price: 2000, effect: 'Energy +10' },
    sarung: { price: 25000, effect: 'Unlock Perang Sarung' },
    petasan: { price: 10000, effect: 'Prank Item' },
    susu_kurma: { price: 15000, effect: 'Stamina Full' }
}

function checkTime(start, end) {
    const now = moment().tz('Asia/Jakarta')
    const s = moment(start, 'HH:mm').tz('Asia/Jakarta')
    const e = moment(end, 'HH:mm').tz('Asia/Jakarta')
    return now.isBetween(s, e)
}

function getRamadhanStats(user) {
    if (!user.rpg.ramadhan) {
        user.rpg.ramadhan = {
            pahala: 0,
            dosa: 0,
            puasaStreak: 0,
            isFasting: false,
            lastSahur: 0,
            lastBuka: 0,
            lastTadarus: 0,
            lastTeraweh: 0,
            lastNgabuburit: 0,
            tadarusAyat: 0,
            tadarusJuz: 0,
            takjilCollected: 0
        }
    }
    // Migration for existing data
    if (typeof user.rpg.ramadhan.tadarusAyat === 'undefined') user.rpg.ramadhan.tadarusAyat = 0
    if (typeof user.rpg.ramadhan.tadarusJuz === 'undefined') user.rpg.ramadhan.tadarusJuz = 0
    return user.rpg.ramadhan
}

// Global Stock for War Takjil (Reset daily ideally, or check time)
let WAR_TAKJIL_STOCK = {
    date: '',
    items: {}
}

const NGABUBURIT_EVENTS = [
    { text: 'Jalan-jalan sore ketemu Pak Ustadz, dikasih nasehat.', reward: { pahala: 50 }, type: 'good' },
    { text: 'Nemu takjil gratis di masjid!', reward: { item: 'takjil_gratis', qty: 1 }, type: 'good' },
    { text: 'Liat orang pacaran, kamu istighfar.', reward: { pahala: 20 }, type: 'good' },
    { text: 'Bantu ibu-ibu nyebrang jalan.', reward: { pahala: 100, exp: 500 }, type: 'good' },
    { text: 'Kepleset kulit pisang depan orang rame.', reward: { energi: -5 }, type: 'bad' },
    { text: 'Ikut kultum sore di masjid kompleks.', reward: { pahala: 150, exp: 200 }, type: 'good' },
    { text: 'Dipalak preman pasar pas beli kolak.', reward: { money: -5000 }, type: 'bad' },
    { text: 'Nemu dompet jatuh, kamu balikin ke orangnya.', reward: { pahala: 500, money: 20000 }, type: 'good' },
    { text: 'Nemu dompet jatuh, kamu ambil isinya... Astagfirullah.', reward: { dosa: 500, money: 50000 }, type: 'bad' },
    { text: 'Ketiduran di masjid pas nunggu maghrib.', reward: { energi: 10 }, type: 'neutral' },
    { text: 'Bantuin panitia masjid nyiapin takjil.', reward: { pahala: 300, exp: 500 }, type: 'good' },
    { text: 'Main petasan malah kena sandal tetangga.', reward: { dosa: 50, money: -2000 }, type: 'bad' },
    { text: 'Motor mogok pas mau beli es buah.', reward: { energi: -20, money: -5000 }, type: 'bad' },
    { text: 'Mata keranjang liat aurat di jalan.', reward: { dosa: 100 }, type: 'bad' },
    { text: 'Dikasih es kelapa muda sama penjualnya karena kamu ganteng/cantik.', reward: { item: 'es_kelapa', qty: 1 }, type: 'good' },
    { text: 'Liat kecelakaan, bantu lapor polisi.', reward: { pahala: 200 }, type: 'good' },
    { text: 'Digigit kucing pas mau ngasih makan.', reward: { energi: -5 }, type: 'neutral' },
    { text: 'Ikut kuis dadakan di radio, menang pulsa!', reward: { money: 10000 }, type: 'good' },
    { text: 'Sendal ilang di masjid.', reward: { money: -10000, mood: -10 }, type: 'bad' },
    { text: 'Ketemu mantan pas beli gorengan.', reward: { energi: -50 }, type: 'bad' }
]

async function handler(m, { sock }) {
    const db = getDatabase()
    const user = db.getUser(m.sender)
    const cmd = m.command.toLowerCase()
    const stats = getRamadhanStats(user)
    if (!user.inventory) user.inventory = {}
    const reply = (text) => m.reply(text)
    const formatRp = (n) => n.toLocaleString('id-ID')
    
    if ((cmd === 'ramadhan' || cmd === 'ramadan') && !m.args[0]) {
        
        const headerTxt = `🌙 *RAMADHAN TIME*

Hai *${m.pushName}*, Selamat menunaikan ibadah puasa yak

👤 *PROFILE*
🏷️ Nama: ${m.pushName}
🕌 Pahala: *${formatRp(stats.pahala)}*
👹 Dosa: *${formatRp(stats.dosa)}*
🔥 Streak: *${stats.puasaStreak} Hari*

📊 *STATUS*
🥣 Sahur: ${stats.lastSahur === moment().tz('Asia/Jakarta').format('YYYY-MM-DD') ? '✅' : '❌'}
🤲 Buka: ${stats.lastBuka === moment().tz('Asia/Jakarta').format('YYYY-MM-DD') ? '✅' : '❌'}`

        const sections = [
            {
                title: "🕌 IBADAH HARIAN",
                rows: [
                     { header: "🤲 BUKA PUASA", title: "Berbuka", description: "Batalkan puasa saat maghrib (17:30 - 18:30)", id: `${m.prefix}bukapuasa` },
                     { header: "📖 TADARUSAN", title: "Baca Al-Quran", description: "Tambah pahala & exp (Input Juz/Ayat)", id: `${m.prefix}tadarusan` },
                     { header: "🕌 TERAWEH", title: "Sholat Teraweh", description: "Ibadah malam berjamaah (19:00 - 22:00)", id: `${m.prefix}teraweh` },
                ]
            },
            {
                title: "🎁 GIVEAWAY",
                rows: [
                     { header: "💸 THR KILAT", title: "Bagi-bagi THR", description: "Siapa cepat dia dapat! (Owner Only)", id: `${m.prefix}thr` },
                     { header: "🤲 SEDEKAH", title: "Sedekah", description: "Transfer koin ke user lain", id: `${m.prefix}sedekah` },
                ]

            },
            {
                title: "🏃 AKTIVITAS SERU",
                rows: [
                     { header: "🛒 BELI TAKJIL", title: "Ramadhan Shop", description: "Beli makanan, sarung, petasan", id: `${m.prefix}belitakjil` },
                ]
            },
            {
                title: "🎮 GAME & ACTIVITY",
                rows: [
                     { header: "🚶 NGABUBURIT", title: "Jalan-jalan Sore", description: "Cari takjil atau event random (15:00 - 17:30)", id: `${m.prefix}ngabuburit` },
                     { header: "⚔️ WAR TAKJIL", title: "Warung Takjil", description: "Rebutan Takjil Limited Stock! (16:00 - 18:00)", id: `${m.prefix}wartakjil` },
                     { header: "🎆 MAIN PETASAN", title: "Prank", description: "Lempar petasan ke grup", id: `${m.prefix}petasan` },
                     { header: "🌏 BANGUNIN SAHUR", title: "Keliling", description: "Bangunin se komplek buat sahur", id: `${m.prefix}kelilingsahur` },
                     { header: "🍕 BUKA BERSAMA", title: "Bukber", description: "Buka bersama pada waktunya", id: `${m.prefix}bukber` },
                ]
            },
            {
                title: "🏆 LEADERBOARD",
                rows: [
                     { header: "📖 TOP TADARUS", title: "Rajin Mengaji", description: "Peringkat pembaca Al-Quran terbanyak", id: `${m.prefix}ramadhan lbtadarus` },
                     { header: "🍷 RAJA TAKJIL", title: "Top Kolektor", description: "Peringkat kolektor takjil terbanyak", id: `${m.prefix}ramadhan lbtakjil` },
                     { header: "🕌 AHLI IBADAH", title: "Top Pahala", description: "Manusia paling suci di grup", id: `${m.prefix}ramadhan lbpahala` },
                ]
            },
            {
                title: "⚠️ DANGER ZONE",
                rows: [
                     { header: "🥤 MOKEL", title: "Batalin Puasa", description: "Dosa besar menantimu...", id: `${m.prefix}mokel` },
                ]
            }
        ]
        

        await sock.sendMessage(m.chat, {
            image: { url: 'https://cdn.gimita.id/download/f52ad_poster_1771083297809_f76737b9.webp' },
            caption: headerTxt,
            footer: `${RIMURU_CORE_CONFIG.bot.name} RAMADHAN SERIES`,
            interactiveButtons: [
                {
                    name: 'single_select',
                    buttonParamsJson: JSON.stringify({
                        title: 'PILIH KATEGORY',
                        sections
                    })
                }
            ]
        }, { quoted: m })
    }
    if (cmd === 'ramadhan' && m.args[0]?.toLowerCase() === 'sahur') {
        if (!checkTime(TIMES.SAHUR.start, TIMES.SAHUR.end)) {
            return reply(`⚠️ *Belum Waktunya Sahur!*\n\n> Sahur dimulai pukul ${TIMES.SAHUR.start} - ${TIMES.SAHUR.end} WIB`)
        }
        
        const today = moment().tz('Asia/Jakarta').format('YYYY-MM-DD')
        if (stats.lastSahur === today) {
            return reply(`⚠️ *Sudah Sahur*\n\n> Kamu sudah makan sahur hari ini. Jangan rakus ya!`)
        }
        
        stats.lastSahur = today
        stats.isFasting = true
        user.energi = (config.energi?.default || 25) + 50 
        
        const menuSahur = ['Nasi Goreng', 'Ayam Penyet', 'Soto Ayam', 'Mie Instan', 'Kurma & Air Putih', 'Rendang Sisa Kemarin']
        const randomMenu = menuSahur[Math.floor(Math.random() * menuSahur.length)]
        
        db.save()
        return reply(`🍽️ *Alhamdulillah Sahur*\n\n> Kamu makan *${randomMenu}*\n> Energi terisi penuh!\n> Status: *Berpuasa* 🛑\n\nSelamat berpuasa!`)
    }
    
    if (cmd === 'bukapuasa' || cmd === 'buka') {
        if (!checkTime(TIMES.BUKA.start, TIMES.BUKA.end)) {
            return reply(`⚠️ *Belum Waktunya Buka!*\n\n> Maghrib pukul ${TIMES.BUKA.start} WIB. Sabar ya!`)
        }
        
        const today = moment().tz('Asia/Jakarta').format('YYYY-MM-DD')
        if (stats.lastBuka === today) {
            return reply(`⚠️ *Sudah Buka*\n\n> Perutmu sudah kenyang!`)
        }
        
        if (!stats.isFasting) {
             return reply(`👀 *Lho?*\n\n> Kamu kan gak puasa (atau udah mokel), jadi gak dapet pahala puasa. Tapi tetep boleh makan kok.`)
        }
        
        stats.lastBuka = today
        stats.isFasting = false
        stats.puasaStreak += 1
        stats.pahala += 1000
        user.energi += 100
        
        db.save()
        return reply(`🕌 *Alhamdulillah Berbuka*\n\n> Selamat berbuka puasa!\n> Streak Puasa: *${stats.puasaStreak} hari*\n> Pahala: *+1000*\n> Energi: *+100*`)
    }
    
    if (cmd === 'ngabuburit') {
        if (!checkTime(TIMES.NGABUBURIT.start, TIMES.NGABUBURIT.end)) {
            return reply(`⚠️ *Waktu Ngabuburit*\n\n> Ngabuburit tersedia pukul ${TIMES.NGABUBURIT.start} - ${TIMES.NGABUBURIT.end} WIB`)
        }
        
        const cooldown = db.checkCooldown(m.sender, 'ngabuburit', 3600) // 1 hour cooldown
        if (cooldown) return reply(`⏳ Tunggu *${cooldown} detik* lagi buat ngabuburit.`)

        const events = [
            { text: 'Jalan-jalan sore ketemu Pak Ustadz, dikasih nasehat.', reward: { pahala: 50 } },
            { text: 'Nemu takjil gratis di masjid!', reward: { item: 'takjil_gratis', qty: 1 } },
            { text: 'Liat orang pacaran, kamu istighfar.', reward: { pahala: 20 } },
            { text: 'Bantu ibu-ibu nyebrang jalan.', reward: { pahala: 100, exp: 500 } },
            { text: 'Kepleset kulit pisang depan orang rame.', reward: { energi: -5 } },
            { text: 'Ikut kultum sore di masjid kompleks.', reward: { pahala: 150, exp: 200 } }
        ]
        
        const event = NGABUBURIT_EVENTS[Math.floor(Math.random() * NGABUBURIT_EVENTS.length)]
        db.setCooldown(m.sender, 'ngabuburit', 3600)
        
        let txt = `🚶 *Ngabuburit*\n\n> ${event.text}\n`
        
        if (event.reward) {
            if (event.reward.pahala) stats.pahala += event.reward.pahala
            if (event.reward.dosa) stats.dosa += event.reward.dosa
            if (event.reward.money) user.koin = (user.koin || 0) + event.reward.money
            if (event.reward.exp) await addExpWithLevelCheck(sock, m, db, user, event.reward.exp)
            if (event.reward.energi) user.energi = (user.energi || 0) + event.reward.energi
            if (event.reward.item) user.inventory[event.reward.item] = (user.inventory[event.reward.item] || 0) + event.reward.qty
            
            txt += `\n*Reward/Efek:*`
            if(event.reward.pahala) txt += `\n➕ Pahala: ${event.reward.pahala}`
            if(event.reward.dosa) txt += `\n➕ Dosa: ${event.reward.dosa}`
            if(event.reward.money) txt += `\n💰 Uang: Rp ${formatRp(event.reward.money)}`
            if(event.reward.item) txt += `\n🎁 Item: ${event.reward.item.replace('_',' ')} x${event.reward.qty}`
        }
        
        db.save()
        return reply(txt)
    }
    
    if (cmd === 'mokel') {
        if (!stats.isFasting) return reply(`⚠️ Kamu emang gak puasa kocak.`)
        
        stats.isFasting = false
        stats.dosa += 500
        stats.puasaStreak = 0
        user.energi += 20
        
        db.save()
        return reply(`😱 *ASTAGFIRULLAH*\n\n> Kamu tergoda setan dan membatalkan puasa!\n> Dosa: *+500*\n> Streak Puasa: *Reset ke 0*\n> Malu sama kucing! 🐈`)
    }
    
    if (cmd === 'tadarusan') {
        const cooldown = db.checkCooldown(m.sender, 'tadarusan', 1800)
        if (cooldown) return reply(config.messages.cooldown.replace('%time%', cooldown))
        const ayatRead = Math.floor(Math.random() * 20) + 10 
        
        stats.pahala += (ayatRead * 10)
        stats.tadarusAyat += ayatRead
        if (stats.tadarusAyat % 100 < ayatRead) {
            stats.tadarusJuz += 1
        }

        await addExpWithLevelCheck(sock, m, db, user, ayatRead * 50)
        db.setCooldown(m.sender, 'tadarusan', 1800)
        
        db.save()
        return reply(`📖 *Tadarusan*\n\n> Alhamdulillah, kamu telah membaca *${ayatRead} ayat*.\n> Total Bacaan: ${stats.tadarusAyat} ayat (${stats.tadarusJuz} Juz)\n\n➕ Pahala: *+${ayatRead * 10}*\n➕ Exp: *+${ayatRead * 50}*`)
    }
    
    if (cmd === 'ramadhan' && m.args[0] && m.args[0].startsWith('lb')) {
        const type = m.args[0].replace('lb', '')
        const users = db.getAllUsers()
        let sorted = []
        let title = ''
        let unit = ''
        
        if (type === 'tadarus') {
            title = 'TOP TADARUS 📖'
            unit = 'Ayat'
            sorted = Object.values(users).sort((a, b) => (b.rpg?.ramadhan?.tadarusAyat || 0) - (a.rpg?.ramadhan?.tadarusAyat || 0))
        } else if (type === 'takjil') {
            title = 'RAJA TAKJIL 🍷'
            unit = 'Item'
            sorted = Object.values(users).sort((a, b) => (b.rpg?.ramadhan?.takjilCollected || 0) - (a.rpg?.ramadhan?.takjilCollected || 0))
        } else if (type === 'pahala') {
            title = 'AHLI IBADAH 🕌'
            unit = 'Pahala'
            sorted = Object.values(users).sort((a, b) => (b.rpg?.ramadhan?.pahala || 0) - (a.rpg?.ramadhan?.pahala || 0))
        } else {
            return reply('⚠️ Leaderboard tidak ditemukan.')
        }
        
        let txt = `🏆 *${title}*\n\n`
        for (let i = 0; i < Math.min(10, sorted.length); i++) {
            const u = sorted[i]
            const val = type === 'tadarus' ? (u.rpg?.ramadhan?.tadarusAyat || 0) :
                        type === 'takjil' ? (u.rpg?.ramadhan?.takjilCollected || 0) :
                        (u.rpg?.ramadhan?.pahala || 0)
            
            if (val > 0) {
    
                txt += `${i+1}. ${u.pushName || u.id.split('@')[0]} - *${formatRp(val)} ${unit}*\n`
            }
        }
        return reply(txt)
    }
    if (cmd === 'teraweh') {
        if (!checkTime(TIMES.TERAWEH.start, TIMES.TERAWEH.end)) {
            return reply(`⚠️ *Belum Waktunya Teraweh*\n\n> Teraweh dimulai pukul ${TIMES.TERAWEH.start} - ${TIMES.TERAWEH.end} WIB`)
        }
        
        const today = moment().tz('Asia/Jakarta').format('YYYY-MM-DD')
        if (stats.lastTeraweh === today) {
            return reply(`⚠️ *Sudah Teraweh*\n\n> Kamu sudah sholat teraweh hari ini.`)
        }
        
        stats.lastTeraweh = today
        stats.pahala += 500
        await addExpWithLevelCheck(sock, m, db, user, 2000)
        
        db.save()
        return reply(`🕌 *Sholat Teraweh*\n\n> Kamu melaksanakan sholat teraweh berjamaah.\n> Pahala: *+500*\n> Exp: *+2000*`)
    }
    
    // 7. BELI TAKJIL / SHOP
    if (cmd === 'belitakjil') {
        const itemKeys = Object.keys(ITEMS)
        const selected = m.args[0]?.toLowerCase()
        
        if (!selected) {
            let list = `🏪 *RAMADHAN SHOP*\n\nUangmu: Rp ${formatRp(user.koin || 0)}\n\n`
            itemKeys.forEach((key, i) => {
                const item = ITEMS[key]
                list += `${i+1}. *${key.toUpperCase().replace('_',' ')}*\n`
                list += `   💰 Rp ${formatRp(item.price)}\n`
                list += `   ✨ Efek: ${item.effect}\n`
            })
            list += `\nCara beli: \`${m.prefix}belitakjil es_buah\``
            return reply(list)
        }
        
        if (!ITEMS[selected]) return reply(`⚠️ Item tidak valid. Cek list dengan \`${m.prefix}belitakjil\``)
        
        const item = ITEMS[selected]
        if ((user.koin || 0) < item.price) return reply(`⚠️ Uangmu kurang! Butuh Rp ${formatRp(item.price)}`)
        
        user.koin -= item.price
        user.inventory[selected] = (user.inventory[selected] || 0) + 1
        
        db.save()
        return reply(`✅ Berhasil membeli *${selected.replace('_',' ')}*\n💸 Harga: Rp ${formatRp(item.price)}`)
    }
    
    // 8. PETASAN
    if (cmd === 'petasan') {
        if ((user.inventory.petasan || 0) < 1) return reply(`⚠️ Kamu tidak punya petasan! Beli dulu di \`${m.prefix}belitakjil\``)
        
        user.inventory.petasan -= 1
        
        const sounds = ['DUAR! 💥', 'PRETEL... DUAR! 💣', 'Sssstt... BOOM! 🎇', 'Pletak... (Gagal meledak) 💨']
        const sound = sounds[Math.floor(Math.random() * sounds.length)]
        
        // Random effect on self or generic
        if (Math.random() < 0.2) {
            user.energi -= 10
            db.save()
            return reply(`💥 *MELEDAK DI TANGAN!* 💥\n\n> ${sound}\n> Apes banget!\n> 🤕 Energi -10`)
        }
        
        db.save()
        return reply(`🎇 *MAIN PETASAN*\n\n> ${sound}\n> Tetangga kaget! 🤣`)
    }
    
    // 10. BANGUNIN SAHUR
    if (cmd === 'bangunin') {
        if (!checkTime(TIMES.SAHUR.start, TIMES.SAHUR.end)) {
             return reply(`⚠️ Sekarang bukan waktu sahur! Jangan ganggu orang tidur.`)
        }
        
        const target = m.mentionedJid[0]
        if (!target) return reply(`⚠️ Tag orang yang mau dibangunin!`)
        
        stats.pahala += 50
        db.save()
        
        return sock.sendMessage(m.chat, {
            text: `🔊 *SAHUR! SAHUR!* 🔊\n\nOy @${target.split('@')[0]}, bangun woy! Keburu imsak!\n\n> (Pahala +50 untuk pembangun)`,
            mentions: [target]
        })
    }

    if (cmd === 'bukber') {
        if (!m.isGroup) return reply('❌ Bukber cuma bisa di grup!')
        
        if (!checkTime('16:00', '18:30')) return reply('⚠️ Bukber dibuka mulai jam 16:00 sampai Maghrib!')
        if (!global.bukberSessions) global.bukberSessions = {}
        
        const session = global.bukberSessions[m.chat]
        const subCmd = m.args[0]
        
        if (!session) {
            if (subCmd === 'start') {
                global.bukberSessions[m.chat] = {
                    host: m.sender,
                    participants: [m.sender],
                    created_at: Date.now()
                }
                return reply(`🍱 *BUKBER STARTED*\n\nHost: @${m.sender.split('@')[0]}\n\nKetik \`${m.prefix}bukber join\` untuk ikutan!\nMakin rame makin besar bonus pahalanya!`, { mentions: [m.sender] })
            }
            return reply(`⚠️ Belum ada sesi Bukber.\nKetik \`${m.prefix}bukber start\` untuk memulai!`)
        }
        
        if (subCmd === 'join') {
            if (session.participants.includes(m.sender)) return reply('⚠️ Kamu sudah join bukber ini!')
            session.participants.push(m.sender)
            return reply(`✅ @${m.sender.split('@')[0]} berhasil join Bukber!\nTotal: ${session.participants.length} orang.`, { mentions: [m.sender] })
        }
        
        if (subCmd === 'claim') {
            if (session.host !== m.sender) return reply('⚠️ Cuma Host yang bisa bagikan nasi kotak (claim reward).')
            if (!checkTime(TIMES.BUKA.start, TIMES.BUKA.end)) return reply(`⚠️ Tunggu adzan maghrib (${TIMES.BUKA.start}) buat makan!`)
            
            let txt = `🍱 *ALHAMDULILLAH BUKBER SELESAI*\n\n`
            const bonusPahala = session.participants.length * 500
            const bonusExp = session.participants.length * 200
            
            for (let participant of session.participants) {
                const pUser = db.getUser(participant)
                const pStats = getRamadhanStats(pUser)
                pStats.pahala += bonusPahala
                pUser.exp += bonusExp
                pUser.energi += 50
                txt += `- @${participant.split('@')[0]} (Pahala +${bonusPahala}, Exp +${bonusExp})\n`
            }
            
            delete global.bukberSessions[m.chat]
            db.save()
            
            return sock.sendMessage(m.chat, { text: txt, mentions: session.participants })
        }
        
        return reply(`🍱 *MENU BUKBER*\n\nParticipants: ${session.participants.length}\n\n- \`${m.prefix}bukber join\`\n- \`${m.prefix}bukber claim\` (Host Only, pas Maghrib)`)
    }
    if (cmd === 'kelilingsahur' || cmd === 'patrol') {
        if (!checkTime(TIMES.SAHUR.start, TIMES.SAHUR.end)) return reply(`⚠️ Keliling sahur cuma bisa pas jam sahur (${TIMES.SAHUR.start} - ${TIMES.SAHUR.end})!`)
        
        const patterns = ['dung tak dung', 'tak dung tak', 'dung dung tak', 'tak tak dung']
        const pattern = patterns[Math.floor(Math.random() * patterns.length)]
        if (!m.args[0]) {
             return reply(`🥁 *KELILING SAHUR*\n\nKetik pola kentongan ini untuk membangunkan warga:\n\n\`${m.prefix}kelilingsahur ${pattern}\`\n\n(Harus persis!)`)
        }
        
        const userPattern = m.args.join(' ').toLowerCase()
        if (patterns.includes(userPattern)) {
            const reward = 10000
            const pahala = 50
            user.koin += reward
            stats.pahala += pahala
            db.save()
            return reply(`🥁 *DUNG DUNG TAK!*\n\nWarga bangun dan berterima kasih!\n💰 +Rp ${formatRp(reward)}\n🕌 +${pahala} Pahala`)
        } else {
            return reply(`🔇 *Salah Pola!*\n\nKentonganmu sumbang, warga malah marah!\nCoba lagi!`)
        }
    }
    if (cmd === 'thr') {
        if (!m.isOwner && !m.isAdmin) return reply('❌ Hanya Owner/Admin yang bisa bagi THR!')
        const amount = parseInt(m.args[0])
        const count = parseInt(m.args[1]) || 1
        
        if (!amount || isNaN(amount)) return reply(`⚠️ Format: \`${m.prefix}thr [jumlah_per_orang] [jumlah_pemenang]\`\nContoh: \`${m.prefix}thr 10000 5\``)
        
        if (user.koin < (amount * count)) return reply(`⚠️ Uangmu kurang untuk bagi THR sebesar itu!`)
        user.koin -= (amount * count)
        db.save() 

        const sessionID = m.chat + '_thr_' + Date.now()
        global.thrSession = global.thrSession || {}
        global.thrSession[sessionID] = {
            amount: amount,
            quota: count,
            claimedBy: []
        }
        
        await sock.sendMessage(m.chat, {
            text: `💸 *THR KAGET!* 💸\n\n@${m.sender.split('@')[0]} membagikan THR!\n💰 Nominal: *Rp ${formatRp(amount)}*\n👥 Pemenang: *${count} Orang*\n\nSiapa cepat dia dapat! Klik tombol di bawah!`,
            mentions: [m.sender],
            buttons: [
                {
                    buttonId: `thr_claim ${sessionID}`,
                    buttonText: { displayText: '💰 AMBIL THR 💰' },
                    type: 1
                }
            ],
            headerType: 1,
            viewOnce: true
        })
    }
    
    if (cmd === 'thr_claim') {
        const sessionID = m.args[0]
        if (!global.thrSession || !global.thrSession[sessionID]) return reply('⚠️ Sesi THR sudah berakhir atau tidak valid.')
        
        const session = global.thrSession[sessionID]
        if (session.quota <= 0) {
            delete global.thrSession[sessionID]
            return reply('❌ Yah telat... THR sudah habis!')
        }
        
        if (session.claimedBy.includes(m.sender)) return reply('⚠️ Kamu sudah ambil THR ini! Jangan serakah.')
        
        session.quota -= 1
        session.claimedBy.push(m.sender)
        user.koin = (user.koin || 0) + session.amount
        
        db.save()
        return reply(`✅ *BERHASIL!*\n\nSelamat, kamu dapat THR Rp ${formatRp(session.amount)}! 🎉`)
    }
    
    if (cmd === 'wartakjil' || cmd === 'bukawarung') {
        if (!checkTime('16:00', '18:00') && !m.isOwner) return reply(`⚠️ War Takjil dibuka jam 16:00 - 18:00 WIB!`)
        const today = moment().tz('Asia/Jakarta').format('YYYY-MM-DD')
        if (WAR_TAKJIL_STOCK.date !== today) {
            WAR_TAKJIL_STOCK.date = today
            WAR_TAKJIL_STOCK.items = {
                'es_buah': { name: 'Es Buah Segar', stock: 50, price: 5000 },
                'gorengan': { name: 'Gorengan Anget', stock: 100, price: 2000 },
                'kolak': { name: 'Kolak Pisang', stock: 30, price: 7000 },
                'es_kelapa': { name: 'Es Kelapa Muda', stock: 20, price: 8000 },
                'kurma_premium': { name: 'Kurma Ajwa', stock: 10, price: 15000 }
            }
        }
        
        const subCmd = m.args[0]
        const targetItem = m.args[1]
        
        if (subCmd === 'beli') {
            if (!targetItem) return reply('⚠️ Mau beli apa?')
            const item = WAR_TAKJIL_STOCK.items[targetItem]
            if (!item) return reply('⚠️ Menu tidak ada!')
            if (item.stock <= 0) return reply(`❌ Yah... *${item.name}* sudah habis terjual!`)
            if (user.koin < item.price) return reply('⚠️ Uangmu kurang!')
            
            user.koin -= item.price
            item.stock -= 1
            stats.takjilCollected += 1
            
            db.save()
            return reply(`✅ Berhasil membeli *${item.name}*\n📦 Sisa Stok: ${item.stock}`)
        }
        
        let list = `⚔️ *WAR TAKJIL* ⚔️\n\nSiapa cepat dia dapat!\n\n`
        Object.keys(WAR_TAKJIL_STOCK.items).forEach((key, i) => {
            const item = WAR_TAKJIL_STOCK.items[key]
            list += `${i+1}. *${item.name}* (${key})\n`
            list += `   💰 Rp ${formatRp(item.price)} | 📦 Stok: ${item.stock}\n`
            if (item.stock === 0) list += `   ❌ SOLD OUT\n`
        })
        
        list += `\nKetik: \`${m.prefix}wartakjil beli [nama_item_key]\`\nContoh: \`${m.prefix}wartakjil beli es_buah\``
        return reply(list)
    }
    if (cmd === 'sedekah') {
         const target = m.mentionedJid[0]
         const amount = parseInt(m.args[1])
         
         if (!target) return reply(`⚠️ Tag orang yang mau dikasih! \`${m.prefix}sedekah @user 10000\``)
         if (!amount || isNaN(amount) || amount < 1000) return reply(`⚠️ Minimal sedekah Rp 1.000`)
         
         if (user.koin < amount) return reply(`⚠️ Uangmu kurang!`)
         if (target === m.sender) return reply('⚠️ Sedekah ke diri sendiri namanya mindahin dompet.')
         
         const targetUser = db.getUser(target)
         user.koin -= amount
         targetUser.koin = (targetUser.koin || 0) + amount
         
         const pahalaEarned = Math.floor(amount / 100)
         stats.pahala += pahalaEarned
         stats.dosa = Math.max(0, stats.dosa - Math.floor(pahalaEarned / 2))
         
         db.save() 
         
         return sock.sendMessage(m.chat, {
             text: `🤲 *ALHAMDULILLAH*\n\nKamu bersedekah Rp ${formatRp(amount)} kepada @${target.split('@')[0]}\n\n🕌 Pahala: +${pahalaEarned}\n👹 Dosa Terhapus: ${Math.floor(pahalaEarned/2)}`,
             mentions: [target]
         })
    }
}

export { pluginConfig as config, handler };
