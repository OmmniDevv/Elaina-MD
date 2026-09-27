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
    name: 'riyal',
    alias: ['sar', 'kursriyal', 'arab', 'konversiriyal', 'saudi'],
    category: 'economy',
    description: 'Konversi mata uang Rupiah ke Riyal Arab Saudi / sebaliknya',
    usage: '.riyal <nominal> <idr/sar>',
    example: '.riyal 100000 idr\n.riyal 500 sar',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true
}

const API_URL = 'https://api.exchangerate-api.com/v4/latest/IDR'

async function getExchangeRate() {
    try {
        const response = await axios.get(API_URL, { timeout: 10000 })
        return response.data.rates.SAR
    } catch (err) {
        console.error('[Riyal] Error get rate:', err.message)
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

function formatRiyal(angka) {
    return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(angka)
}

async function handler(m, { sock }) {
    const args = m.args || []
    let nominal = parseFloat(args[0])
    const jenis = args[1]?.toLowerCase()
    
    if (!nominal || isNaN(nominal) || nominal <= 0) {
        return m.reply(
            `﷼ *ᴋᴏɴᴠᴇʀꜱɪ ᴍᴀᴛᴀ ᴜᴀɴɢ ᴀʀᴀʙ* ﷼\n\n` +
            `╭━━━━━━━━━━━━━━━━━━━━━⬣\n` +
            `┃ ✦ *Cara Pakai*\n` +
            `┃\n` +
            `┃   ${m.prefix}riyal <nominal> <idr/sar>\n` +
            `┃\n` +
            `┃ ✦ *Contoh*\n` +
            `┃\n` +
            `┃   ${m.prefix}riyal 100000 idr\n` +
            `┃   ${m.prefix}riyal 500 sar\n` +
            `┃\n` +
            `┃ ✦ *Keterangan*\n` +
            `┃   idr / rp → Rupiah ke Riyal\n` +
            `┃   sar / riyal → Riyal ke Rupiah\n` +
            `┃\n` +
            `┃ 💗 *Rimuru:* Mau konversi uang Arab darling~?\n` +
            `╰━━━━━━━━━━━━━━━━━━━━━⬣`
        )
    }
    
    const isRupiah = jenis === 'rp' || jenis === 'idr'
    const isRiyal = jenis === 'sar' || jenis === 'riyal'
    
    if (!isRupiah && !isRiyal) {
        return m.reply(
            `❌ *ᴇʀʀᴏʀ*\n\n` +
            `> Jenis mata uang tidak valid darling~\n` +
            `> Gunakan *idr* atau *sar*\n\n` +
            `> Contoh: ${m.prefix}riyal 100000 idr`
        )
    }
    
    m.react('﷼')
    await m.reply(`⏳ *ᴍᴇɴɢʜɪᴛᴜɴɢ ᴋᴜʀꜱ...*\n\n💗 *Rimuru:* Tunggu sebentar darling~ 🧮`)
    
    try {
        const kurs = await getExchangeRate()
        
        if (!kurs) {
            m.react('💔')
            return m.reply(
                `💔 *ᴇʀʀᴏʀ*\n\n` +
                `> Gagal mengambil kurs Riyal saat ini.\n` +
                `> Coba lagi nanti darling~ 🥺`
            )
        }
        
        let hasil
        let hasilFormatted
        let asal
        let tujuan
        
        if (isRupiah) {
            // Rupiah ke Riyal
            hasil = nominal / kurs
            hasilFormatted = formatRiyal(hasil)
            asal = formatRupiah(nominal)
            tujuan = hasilFormatted
        } else {
            // Riyal ke Rupiah
            hasil = nominal * kurs
            hasilFormatted = formatRupiah(hasil)
            asal = formatRiyal(nominal)
            tujuan = hasilFormatted
        }
        
        const tanggal = new Date().toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
        
        await m.reply(
            `﷼ *ᴋᴏɴᴠᴇʀꜱɪ ᴍᴀᴛᴀ ᴜᴀɴɢ ᴀʀᴀʙ* ﷼\n\n` +
            `╭━━━━━━━━━━━━━━━━━━━━━⬣\n` +
            `┃ 💰 *ɴᴏᴍɪɴᴀʟ*:\n` +
            `┃    ${asal}\n` +
            `┃\n` +
            `┃ 💱 *ʜᴀꜱɪʟ ᴋᴏɴᴠᴇʀꜱɪ*:\n` +
            `┃    ${tujuan}\n` +
            `┃\n` +
            `┃ 📊 *ᴋᴜʀꜱ ꜱᴀᴀᴛ ɪɴɪ*:\n` +
            `┃    1 SAR = Rp ${kurs.toLocaleString('id-ID')}\n` +
            `┃\n` +
            `┃ 📅 *ᴛᴀɴɢɢᴀʟ*: ${tanggal}\n` +
            `┃\n` +
            `┃ 🕋 *Fakta Arab Saudi:*\n` +
            `┃    Riyal adalah mata uang resmi Arab Saudi\n` +
            `┃    Uang kertas Riyal bergambar Masjid Nabawi\n` +
            `┃\n` +
            `┃ 💗 *Rimuru:* Ini hasilnya darling~ 🕌\n` +
            `╰━━━━━━━━━━━━━━━━━━━━━⬣`
        )
        
        m.react('✅')
        
    } catch (err) {
        console.error('[Riyal] Error:', err)
        m.react('💔')
        return m.reply(
            `💔 *ᴇʀʀᴏʀ*\n\n` +
            `> ${err.message}\n\n` +
            `> Coba lagi ya darling~ 🥺`
        )
    }
}

export { pluginConfig as config, handler };
