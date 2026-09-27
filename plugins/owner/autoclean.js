/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fs from 'fs';
import path from 'path';
import config from '../../config.js';
// plugins/autoclean.js
const pluginConfig = {
    name: 'autoclean',
    alias: ['autoclear', 'cleanstore', 'hapusstore'],
    category: 'owner',
    description: 'Auto hapus file baileys_store.json jika ukuran > 50MB (bisa on/off)',
    usage: '.autoclean [on/off/status]',
    example: '.autoclean on\n.autoclean off\n.autoclean status',
    isOwner: true,      // Hanya owner
    isPremium: false,
    isGroup: false,
    isPrivate: true,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

// Path file baileys_store.json
const storePath = path.join(process.cwd(), 'store', 'baileys_store.json')
const storeDir = path.join(process.cwd(), 'store')

// Setting auto clean (disimpan di memory, bisa pindah ke database kalo mau)
let autoCleanEnabled = true  // Default ON
const MAX_SIZE_MB = 50
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

// Fungsi cek ukuran file
function getFileSizeMB(filePath) {
    try {
        if (!fs.existsSync(filePath)) return 0
        const stats = fs.statSync(filePath)
        return stats.size / (1024 * 1024)
    } catch (e) {
        console.error('[AutoClean] Gagal baca ukuran file:', e)
        return 0
    }
}

// Fungsi hapus file
function deleteStoreFile() {
    try {
        if (!fs.existsSync(storePath)) {
            return { success: false, message: 'File tidak ditemukan' }
        }
        
        const oldSize = getFileSizeMB(storePath)
        fs.unlinkSync(storePath)
        
        // Buat file baru kosong
        fs.writeFileSync(storePath, JSON.stringify({ credentials: {}, state: {} }, null, 2))
        
        return { 
            success: true, 
            message: `✅ File berhasil dihapus!\n📦 Ukuran lama: ${oldSize.toFixed(2)} MB\n📄 File baru telah dibuat.`,
            oldSize: oldSize
        }
    } catch (e) {
        return { success: false, message: `❌ Gagal hapus file: ${e.message}` }
    }
}

// Fungsi auto clean (bisa dipanggil berkala)
function autoClean() {
    if (!autoCleanEnabled) return false
    
    const sizeMB = getFileSizeMB(storePath)
    
    if (sizeMB > MAX_SIZE_MB) {
        console.log(`[AutoClean] Ukuran file ${sizeMB.toFixed(2)}MB melebihi batas ${MAX_SIZE_MB}MB, menghapus...`)
        const result = deleteStoreFile()
        if (result.success) {
            console.log(`[AutoClean] ${result.message}`)
        }
        return result.success
    }
    
    return false
}

// Fungsi cek status
function getStatus() {
    const sizeMB = getFileSizeMB(storePath)
    const exists = fs.existsSync(storePath)
    const isOverlimit = sizeMB > MAX_SIZE_MB
    
    return {
        enabled: autoCleanEnabled,
        fileExists: exists,
        sizeMB: sizeMB.toFixed(2),
        maxSizeMB: MAX_SIZE_MB,
        isOverlimit: isOverlimit,
        filePath: storePath
    }
}

// Handler utama
async function handler(m, { sock }) {
    const args = m.text?.trim().toLowerCase() || ''
    
    // Buat folder store kalo belum ada
    if (!fs.existsSync(storeDir)) {
        fs.mkdirSync(storeDir, { recursive: true })
    }
    
    // Auto clean manual via command
    if (args === 'clean' || args === 'hapus' || args === 'delete') {
        await m.react('⏳')
        
        const sizeBefore = getFileSizeMB(storePath)
        
        if (sizeBefore === 0) {
            return m.reply(`📂 *File tidak ditemukan atau kosong*\n\nPath: ${storePath}\n\nTidak ada yang perlu dihapus darling~ 🗿`)
        }
        
        const result = deleteStoreFile()
        
        if (result.success) {
            await m.react('✅')
        } else {
            await m.react('❌')
        }
        
        return m.reply(result.message)
    }
    
    // ON / OFF
    if (args === 'on') {
        autoCleanEnabled = true
        await m.react('✅')
        return m.reply(`✅ *AUTO CLEAN AKTIF*\n\n📂 File: baileys_store.json\n📍 Lokasi: ${storePath}\n📦 Batas ukuran: ${MAX_SIZE_MB} MB\n\nFile akan otomatis dihapus jika melebihi ${MAX_SIZE_MB} MB.\n\n🦋 *Rimuru:* Udah aktif ya darling~`)
    }
    
    if (args === 'off') {
        autoCleanEnabled = false
        await m.react('✅')
        return m.reply(`❌ *AUTO CLEAN NONAKTIF*\n\nFitur auto hapus sudah dimatikan.\n\nGunakan \`.autoclean on\` untuk mengaktifkan lagi.\n\n🦋 *Rimuru:* Siap darling~`)
    }
    
    // Tampilkan status (default)
    const status = getStatus()
    
    let statusText = `📂 *AUTO CLEAN STATUS*\n\n`
    statusText += `🔘 *Status:* ${status.enabled ? '✅ AKTIF' : '❌ NONAKTIF'}\n`
    statusText += `📦 *Ukuran file:* ${status.sizeMB} MB / ${status.maxSizeMB} MB\n`
    statusText += `⚠️ *Melebihi batas:* ${status.isOverlimit ? 'YA 🚨' : 'Tidak ✅'}\n`
    statusText += `📁 *Lokasi:* ${status.filePath}\n`
    statusText += `📄 *File exists:* ${status.fileExists ? '✅ Ada' : '❌ Tidak ada'}\n\n`
    
    if (status.isOverlimit && status.enabled) {
        statusText += `🚨 *PERINGATAN!* File melebihi batas! Bot akan segera menghapusnya.\n\n`
    }
    
    statusText += `📌 *Perintah:*\n`
    statusText += `• \`.autoclean on\` - Aktifkan auto hapus\n`
    statusText += `• \`.autoclean off\` - Nonaktifkan\n`
    statusText += `• \`.autoclean clean\` - Hapus manual sekarang\n`
    statusText += `• \`.autoclean status\` - Lihat status ini\n\n`
    statusText += `🦋 *Rimuru:* Mau diatur gimana darling~?`
    
    await m.reply(statusText)
}

// Auto check setiap 30 menit
setInterval(() => {
    if (autoCleanEnabled) {
        const result = autoClean()
        if (result) {
            console.log('[AutoClean] Auto cleanup executed')
        }
    }
}, 30 * 60 * 1000) // 30 menit

export { pluginConfig as config, handler };
