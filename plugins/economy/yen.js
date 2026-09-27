/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
import config from '../../config.js';
const pluginConfig = {
    name: 'yen',
    alias: ['jpy', 'kursyen', 'jepang', 'konversiyen'],
    category: 'economy',
    description: 'Konversi mata uang Rupiah ke Yen Jepang / sebaliknya',
    usage: '.yen <nominal> <idr/jpy>',
    example: '.yen 100000 idr\n.yen 5000 jpy',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true
}

// API kurs (gratis, no API key)
const API_URL = 'https://api.exchangerate-api.com/v4/latest/IDR'

async function getExchangeRate() {
    try {
        const response = await axios.get(API_URL, { timeout: 10000 })
        return response.data.rates.JPY
    } catch (err) {
        console.error('[Yen] Error get rate:', err.message)
        return null
    }
}

function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(angka)
}

function formatYen(angka) {
    return new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(angka)
}

async function handler(m, { sock }) {
    const args = m.args || []
    let nominal = parseFloat(args[0])
    const jenis = args[1]?.toLowerCase()
    
    if (!nominal || isNaN(nominal) || nominal <= 0) {
        return m.reply(
            `💴 *ᴋᴏɴᴠᴇʀꜱɪ ᴍᴀᴛᴀ ᴜᴀɴɢ ᴊᴇᴘᴀɴɢ* 💴\n\n` +
            `╭━━━━━━━━━━━━━━━━━━━━━⬣\n` +
            `┃ ✦ *Cara Pakai*\n` +
            `┃\n` +
            `┃   ${m.prefix}yen <nominal> <idr/jpy>\n` +
            `┃\n` +
            `┃ ✦ *Contoh*\n` +
            `┃\n` +
            `┃   ${m.prefix}yen 100000 idr\n` +
            `┃   ${m.prefix}yen 5000 jpy\n` +
            `┃\n` +
            `┃ ✦ *Keterangan*\n` +
            `┃   idr / rp → Rupiah ke Yen\n` +
            `┃   jpy / yen → Yen ke Rupiah\n` +
            `┃\n` +
            `┃ 💗 *Rimuru:* Mau konversi uang Jepang darling~?\n` +
            `╰━━━━━━━━━━━━━━━━━━━━━⬣`
        )
    }
    
    const isRupiah = jenis === 'rp' || jenis === 'idr'
    const isYen = jenis === 'jpy' || jenis === 'yen'
    
    if (!isRupiah && !isYen) {
        return m.reply(
            `❌ *ᴇʀʀᴏʀ*\n\n` +
            `> Jenis mata uang tidak valid darling~\n` +
            `> Gunakan *idr* atau *jpy*\n\n` +
            `> Contoh: ${m.prefix}yen 100000 idr`
        )
    }
    
    m.react('💴')
    await m.reply(`⏳ *ᴍᴇɴɢʜɪᴛᴜɴɢ ᴋᴜʀꜱ...*\n\n💗 *Rimuru:* Tunggu sebentar darling~ 🧮`)
    
    try {
        const kurs = await getExchangeRate()
        
        if (!kurs) {
            m.react('💔')
            return m.reply(
                `💔 *ᴇʀʀᴏʀ*\n\n` +
                `> Gagal mengambil kurs Yen saat ini.\n` +
                `> Coba lagi nanti darling~ 🥺`
            )
        }
        
        let hasil
        let hasilFormatted
        let asal
        let tujuan
        
        if (isRupiah) {
            // Rupiah ke Yen
            hasil = nominal / kurs
            hasilFormatted = formatYen(hasil)
            asal = formatRupiah(nominal)
            tujuan = hasilFormatted
        } else {
            // Yen ke Rupiah
            hasil = nominal * kurs
            hasilFormatted = formatRupiah(hasil)
            asal = formatYen(nominal)
            tujuan = hasilFormatted
        }
        
        const tanggal = new Date().toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
        
        await m.reply(
            `💴 *ᴋᴏɴᴠᴇʀꜱɪ ᴍᴀᴛᴀ ᴜᴀɴɢ ᴊᴇᴘᴀɴɢ* 💴\n\n` +
            `╭━━━━━━━━━━━━━━━━━━━━━⬣\n` +
            `┃ 💰 *ɴᴏᴍɪɴᴀʟ*:\n` +
            `┃    ${asal}\n` +
            `┃\n` +
            `┃ 💱 *ʜᴀꜱɪʟ ᴋᴏɴᴠᴇʀꜱɪ*:\n` +
            `┃    ${tujuan}\n` +
            `┃\n` +
            `┃ 📊 *ᴋᴜʀꜱ ꜱᴀᴀᴛ ɪɴɪ*:\n` +
            `┃    1 JPY = Rp ${kurs.toLocaleString('id-ID')}\n` +
            `┃\n` +
            `┃ 📅 *ᴛᴀɴɢɢᴀʟ*: ${tanggal}\n` +
            `┃\n` +
            `┃ 🗾 *Fakta Jepang:*\n` +
            `┃    Uang koin Yen ada yang berlubang! (¥5 & ¥50)\n` +
            `┃\n` +
            `┃ 💗 *Rimuru:* Ini hasilnya darling~ 🇯🇵\n` +
            `╰━━━━━━━━━━━━━━━━━━━━━⬣`
        )
        
        m.react('✅')
        
    } catch (err) {
        console.error('[Yen] Error:', err)
        m.react('💔')
        return m.reply(
            `💔 *ᴇʀʀᴏʀ*\n\n` +
            `> ${err.message}\n\n` +
            `> Coba lagi ya darling~ 🥺`
        )
    }
}

export { pluginConfig as config, handler };
