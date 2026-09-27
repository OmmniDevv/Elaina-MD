/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import config from '../../config.js';
import { getDatabase } from '../../src/lib/elaina-database.js';
const pluginConfig = {
    name: 'sider',
    alias: ['silentreader', 'deteksisider', 'srdetector'],
    category: 'group',
    description: 'Mendeteksi member yang tidak pernah chat dalam periode tertentu',
    usage: '.sider <on/off/cek/set>',
    example: '.sider cek',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    isAdmin: true,
    cooldown: 10,
    energi: 0,
    isEnabled: true
}

// Default periode (7 hari dalam milidetik)
const DEFAULT_PERIOD = 7 * 24 * 60 * 60 * 1000 // 7 hari

async function handler(m, { sock }) {
    const db = getDatabase()
    const args = m.args || []
    const sub = args[0]?.toLowerCase()
    
    // Initialize sider data di database
    if (!db.data.sider) {
        db.data.sider = {
            enabled: {},           // Status per grup
            lastActivity: {},     // Last chat per user per grup
            settings: {}          // Pengaturan per grup (periode, dll)
        }
    }
    
    const groupId = m.chat
    const isEnabled = db.data.sider.enabled[groupId] === true
    
    // ON - Aktifkan deteksi sider
    if (sub === 'on') {
        if (!m.isAdmin && !m.isOwner) {
            return m.reply(`❌ *SIDER*: "Hanya admin yang bisa ngaktifin fitur ini darling~ 🦋"`)
        }
        
        db.data.sider.enabled[groupId] = true
        
        // Set default settings kalo belum ada
        if (!db.data.sider.settings[groupId]) {
            db.data.sider.settings[groupId] = {
                period: 7, // hari
                autoKick: false,
                warningMsg: true
            }
        }
        
        db.save()
        
        return m.reply(
            `✅ *SIDER DETECTOR AKTIF* 🦋\n\n` +
            `> Fitur deteksi silent reader aktif di grup ini!\n` +
            `> Periode: *${db.data.sider.settings[groupId].period} hari*\n` +
            `> Auto kick: *${db.data.sider.settings[groupId].autoKick ? 'ON' : 'OFF'}*\n\n` +
            `📌 *Cara pakai:*\n` +
            `> \`${m.prefix}sider cek\` → Lihat sider sekarang\n` +
            `> \`${m.prefix}sider set period 5\` → Ubah periode\n` +
            `> \`${m.prefix}sider set autokick on\` → Auto kick on`
        )
    }
    
    // OFF - Nonaktifkan
    if (sub === 'off') {
        if (!m.isAdmin && !m.isOwner) {
            return m.reply(`❌ *SIDER*: "Hanya admin yang bisa matiin darling~ 🦋"`)
        }
        
        db.data.sider.enabled[groupId] = false
        db.save()
        
        return m.reply(`❌ *SIDER DETECTOR NONAKTIF* darling~ Fitur deteksi sider dimatikan. 🦋`)
    }
    
    // CEK - Lihat siapa aja yang jadi sider (DENGAN TAG RAPI)
    if (sub === 'cek' || sub === 'lihat' || sub === 'check') {
        if (!isEnabled) {
            return m.reply(`⚠️ *SIDER DETECTOR OFF*\n\n> Fitur belum aktif. Ketik \`${m.prefix}sider on\` dulu darling~ 🦋`)
        }
        
        await m.reply(`🕵️ *MENDETEKSI SIDER...*\n> Sedang memindai member grup... 🦋`)
        
        try {
            // Ambil metadata grup
            const groupMeta = await sock.groupMetadata(groupId)
            const participants = groupMeta.participants || []
            
            const periodMs = (db.data.sider.settings[groupId]?.period || 7) * 24 * 60 * 60 * 1000
            const now = Date.now()
            
            const siderList = []
            const activeList = []
            
            for (const participant of participants) {
                const jid = participant.id
                const lastActive = db.data.sider.lastActivity[groupId]?.[jid] || 0
                const isAdmin = participant.admin === 'admin' || participant.admin === 'superadmin'
                
                // Skip admin dan bot sendiri
                if (isAdmin || jid === sock.user.id) continue
                
                const daysInactive = Math.floor((now - lastActive) / (24 * 60 * 60 * 1000))
                
                if (lastActive === 0 || (now - lastActive) > periodMs) {
                    // Belum pernah chat atau sudah lewat periode
                    siderList.push({
                        jid,
                        name: participant.name || jid.split('@')[0],
                        days: lastActive === 0 ? 'Belum pernah' : daysInactive,
                        lastActive: lastActive
                    })
                } else {
                    activeList.push({
                        jid,
                        name: participant.name || jid.split('@')[0],
                        lastActive: lastActive
                    })
                }
            }
            
            if (siderList.length === 0) {
                return m.reply(
                    `🦋 *HASIL DETEKSI SIDER* 🦋\n\n` +
                    `✨ *HORE!* ✨\n` +
                    `> Tidak ada sider di grup ini darling~\n` +
                    `> Semua member aktif ngobrol! 🎐`
                )
            }
            
            // Buat pesan hasil dengan format rapi
            let siderText = `🦋 *LIST SIDER DETECTED* 🦋\n\n`
            siderText += `📊 *Info Deteksi:*\n`
            siderText += `┣ ➥ Periode: *${db.data.sider.settings[groupId]?.period || 7} hari*\n`
            siderText += `┣ ➥ Total member: *${participants.length} orang*\n`
            siderText += `┣ ➥ Sider: *${siderList.length} orang*\n`
            siderText += `┗ ➥ Aktif: *${activeList.length} orang*\n\n`
            
            siderText += `╭──〔 *DAFTAR SIDER* 〕──🦋\n`
            
            // Buat array mention untuk SEMUA sider
            const mentionJids = []
            
            for (let i = 0; i < siderList.length; i++) {
                const s = siderList[i]
                const displayName = s.name.length > 25 ? s.name.slice(0, 25) + '...' : s.name
                mentionJids.push(s.jid)
                
                // Format hari dengan emoji yang beda2
                let hariText = ''
                if (s.days === 'Belum pernah') {
                    hariText = '⚰️ *Belum pernah chat*'
                } else if (s.days >= 30) {
                    hariText = `💀 *${s.days} hari* (parah nih)`
                } else if (s.days >= 14) {
                    hariText = `😴 *${s.days} hari*`
                } else if (s.days >= 7) {
                    hariText = `😪 *${s.days} hari*`
                } else {
                    hariText = `😶 *${s.days} hari*`
                }
                
                // Tambahkan last seen date jika ada
                let lastSeenText = ''
                if (s.lastActive > 0) {
                    const lastDate = new Date(s.lastActive)
                    lastSeenText = `\n┃    📅 Terakhir: ${lastDate.toLocaleDateString('id-ID')}`
                }
                
                siderText += `┃\n`
                siderText += `┃ ${i+1}. 👤 @${s.jid.split('@')[0]}\n`
                siderText += `┃    📛 ${displayName}\n`
                siderText += `┃    ⏰ ${hariText}${lastSeenText}\n`
            }
            
            siderText += `┃\n`
            siderText += `╰────────────────────────🦋\n\n`
            
            // Tambahan pesan berdasarkan jumlah sider
            siderText += `💡 *Pesan untuk para sider:*\n`
            if (siderList.length >= 10) {
                siderText += `> Wah banyak banget sidernya! Yuk pada ngobrol biar rame~ 🗣️\n`
            } else if (siderList.length >= 5) {
                siderText += `> Lumayan banyak nih yang jadi sider. Ayo lebih aktif lagi! 🗿\n`
            } else {
                siderText += `> Ayolah ngobrol dikit biar gak jadi sider terus~ 🥺\n`
            }
            siderText += `\n`
            
            if (db.data.sider.settings[groupId]?.autoKick) {
                siderText += `⚠️ *PERINGATAN!*\n`
                siderText += `> Auto kick *AKTIF*, lu bakal dikick otomatis kalo gak aktif!\n`
                siderText += `> Segera chat sebelum kena kick! 🗿\n\n`
            } else {
                siderText += `🛡️ *Catatan:* Auto kick *OFF* (aman, cuma diumumin doang)\n`
                siderText += `> Mau aktifin auto kick? Ketik: \`${m.prefix}sider set autokick on\`\n\n`
            }
            
            siderText += `🎐 *Scan time:* ${new Date().toLocaleString('id-ID')}`
            
            // Kirim dengan mention SEMUA sider
            await sock.sendMessage(groupId, {
                text: siderText,
                mentions: mentionJids
            })
            
        } catch (err) {
            console.error('Sider cek error:', err)
            m.reply(`❌ *ERROR*: Gagal mendeteksi sider: ${err.message}`)
        }
        
        return
    }
    
    // SET - Pengaturan
    if (sub === 'set') {
        if (!m.isAdmin && !m.isOwner) {
            return m.reply(`❌ *SIDER*: "Hanya admin yang bisa setting darling~ 🦋"`)
        }
        
        const setting = args[1]?.toLowerCase()
        const value = args[2]?.toLowerCase()
        
        if (!db.data.sider.settings[groupId]) {
            db.data.sider.settings[groupId] = {
                period: 7,
                autoKick: false,
                warningMsg: true
            }
        }
        
        // Set periode
        if (setting === 'period') {
            const periodDays = parseInt(value)
            if (isNaN(periodDays) || periodDays < 1 || periodDays > 60) {
                return m.reply(`❌ *SALAH!*\n> Periode harus angka 1-60 hari darling~ 🦋`)
            }
            
            db.data.sider.settings[groupId].period = periodDays
            db.save()
            
            return m.reply(`✅ *PERIODE DIUBAH*\n> Menjadi *${periodDays} hari* darling~ 🦋`)
        }
        
        // Set auto kick
        if (setting === 'autokick') {
            if (value === 'on' || value === 'true') {
                db.data.sider.settings[groupId].autoKick = true
                db.save()
                return m.reply(`⚠️ *AUTO KICK AKTIF*\n\n> Sider akan otomatis dikick dari grup!\n> *HATI-HATI* fitur ini berbahaya darling~ 🦋`)
            } else if (value === 'off' || value === 'false') {
                db.data.sider.settings[groupId].autoKick = false
                db.save()
                return m.reply(`✅ *AUTO KICK NONAKTIF*\n> Sider hanya akan diumumkan, tidak dikick otomatis. 🦋`)
            } else {
                return m.reply(`❌ *SALAH!*\n> Gunakan \`on\` atau \`off\` darling~ 🦋`)
            }
        }
        
        return m.reply(
            `⚙️ *PENGATURAN SIDER*\n\n` +
            `> \`${m.prefix}sider set period <hari>\` → Ubah periode (1-60)\n` +
            `> \`${m.prefix}sider set autokick on/off\` → Auto kick sider\n\n` +
            `📊 *Setting saat ini:*\n` +
            `> Periode: *${db.data.sider.settings[groupId].period} hari*\n` +
            `> Auto kick: *${db.data.sider.settings[groupId].autoKick ? 'ON' : 'OFF'}*`
        )
    }
    
    // KICK - Kick sider manual
    if (sub === 'kick') {
        if (!m.isAdmin && !m.isOwner) {
            return m.reply(`❌ *SIDER*: "Hanya admin yang bisa kick darling~ 🦋"`)
        }
        
        if (!isEnabled) {
            return m.reply(`⚠️ *SIDER DETECTOR OFF*\n\n> Fitur belum aktif. Ketik \`${m.prefix}sider on\` dulu darling~ 🦋`)
        }
        
        try {
            const groupMeta = await sock.groupMetadata(groupId)
            const participants = groupMeta.participants || []
            
            const periodMs = (db.data.sider.settings[groupId]?.period || 7) * 24 * 60 * 60 * 1000
            const now = Date.now()
            
            const kickList = []
            
            for (const participant of participants) {
                const jid = participant.id
                const lastActive = db.data.sider.lastActivity[groupId]?.[jid] || 0
                const isAdmin = participant.admin === 'admin' || participant.admin === 'superadmin'
                
                if (isAdmin || jid === sock.user.id) continue
                
                if (lastActive === 0 || (now - lastActive) > periodMs) {
                    kickList.push(jid)
                }
            }
            
            if (kickList.length === 0) {
                return m.reply(`✨ *TIDAK ADA SIDER*\n> Ga ada sider yang bisa dikick darling~ 🦋`)
            }
            
            let kickText = `🗿 *MENGKICK SIDER...* 🗿\n\n`
            kickText += `> Total sider: ${kickList.length} orang\n`
            kickText += `> Periode: ${db.data.sider.settings[groupId]?.period || 7} hari\n\n`
            kickText += `Mengkick:\n`
            
            for (let i = 0; i < Math.min(kickList.length, 10); i++) {
                kickText += `┃ ${i+1}. @${kickList[i].split('@')[0]}\n`
            }
            
            if (kickList.length > 10) {
                kickText += `┃ ...dan ${kickList.length - 10} lainnya\n`
            }
            
            kickText += `\n> Proses kick... 🦋`
            
            await m.reply(kickText)
            
            // Eksekusi kick
            let kicked = 0
            let failed = 0
            
            for (const jid of kickList) {
                try {
                    await sock.groupParticipantsUpdate(groupId, [jid], 'remove')
                    kicked++
                    await new Promise(resolve => setTimeout(resolve, 1000)) // Delay 1 detik biar gak kena limit
                } catch (err) {
                    failed++
                    console.error(`Gagal kick ${jid}:`, err)
                }
            }
            
            return m.reply(
                `✅ *HASIL KICK SIDER*\n\n` +
                `> Berhasil dikick: *${kicked} orang*\n` +
                `> Gagal: *${failed} orang*\n` +
                `> Total sider: *${kickList.length} orang*\n\n` +
                `> Sekarang grup lebih sehat! 🦋`
            )
            
        } catch (err) {
            console.error('Sider kick error:', err)
            m.reply(`❌ *ERROR*: Gagal kick sider: ${err.message}`)
        }
        
        return
    }
    
    // RESET - Reset data aktivitas grup
    if (sub === 'reset') {
        if (!m.isAdmin && !m.isOwner) {
            return m.reply(`❌ *SIDER*: "Hanya admin yang bisa reset darling~ 🦋"`)
        }
        
        if (db.data.sider.lastActivity[groupId]) {
            delete db.data.sider.lastActivity[groupId]
            db.save()
            return m.reply(`✅ *DATA SIDER DIRESET*\n> Semua data aktivitas member di grup ini direset. Deteksi akan dimulai dari sekarang! 🦋`)
        } else {
            return m.reply(`⚠️ *TIDAK ADA DATA*\n> Belum ada data sider untuk grup ini. 🦋`)
        }
    }
    
    // STATUS - Lihat status
    if (sub === 'status') {
        const settings = db.data.sider.settings[groupId] || { period: 7, autoKick: false }
        
        // Hitung jumlah data aktivitas yang tercatat
        const activityCount = db.data.sider.lastActivity[groupId] ? Object.keys(db.data.sider.lastActivity[groupId]).length : 0
        
        return m.reply(
            `🦋 *STATUS SIDER DETECTOR* 🦋\n\n` +
            `📊 *Status:* ${isEnabled ? '✅ AKTIF' : '❌ NONAKTIF'}\n` +
            `⏰ *Periode:* ${settings.period} hari\n` +
            `🚪 *Auto kick:* ${settings.autoKick ? '✅ ON' : '❌ OFF'}\n` +
            `📝 *Data tercatat:* ${activityCount} member\n\n` +
            `╭─〔 *PERINTAH* 〕─🦋\n` +
            `│ • \`${m.prefix}sider on\` → Aktifkan\n` +
            `│ • \`${m.prefix}sider off\` → Nonaktifkan\n` +
            `│ • \`${m.prefix}sider cek\` → Lihat sider\n` +
            `│ • \`${m.prefix}sider kick\` → Kick semua sider\n` +
            `│ • \`${m.prefix}sider reset\` → Reset data grup\n` +
            `│ • \`${m.prefix}sider set period 5\` → Ubah periode\n` +
            `│ • \`${m.prefix}sider set autokick on\` → Auto kick\n` +
            `╰─────────────────🦋`
        )
    }
    
    // Tampilkan menu utama
    return m.reply(
        `🕵️ *SILENT READER DETECTOR* 🦋\n\n` +
        `📊 *Status di grup ini:* ${isEnabled ? '✅ AKTIF' : '❌ NONAKTIF'}\n\n` +
        `╭─〔 *📋 PERINTAH* 〕─🦋\n` +
        `│ • \`${m.prefix}sider on\` → Aktifkan detector\n` +
        `│ • \`${m.prefix}sider off\` → Nonaktifkan detector\n` +
        `│ • \`${m.prefix}sider cek\` → Lihat daftar sider\n` +
        `│ • \`${m.prefix}sider kick\` → Kick semua sider\n` +
        `│ • \`${m.prefix}sider reset\` → Reset data aktivitas\n` +
        `│ • \`${m.prefix}sider status\` → Lihat pengaturan\n` +
        `│ • \`${m.prefix}sider set period <hari>\` → Ubah periode\n` +
        `│ • \`${m.prefix}sider set autokick on/off\` → Auto kick\n` +
        `╰─────────────────🦋\n\n` +
        `> *Fungsi:* Mendeteksi member yang gak pernah chat selama X hari\n` +
        `> *Listing sider akan di-tag semua!* 🏷️`
    )
}

// LISTENER untuk mencatat aktivitas chat
async function setupSiderListener(sock) {
    console.log('🕵️ Starting Sider (Silent Reader) Listener...')
    
    sock.ev.on('messages.upsert', async ({ messages }) => {
        try {
            const msg = messages[0]
            
            // Skip pesan dari bot sendiri
            if (msg.key.fromMe) return
            
            // Ambil chat ID (grup)
            const chatId = msg.key.remoteJid
            if (!chatId || !chatId.endsWith('@g.us')) return
            
            // Ambil pengirim
            const sender = msg.key.participant || msg.key.remoteJid
            if (!sender) return
            
            const db = getDatabase()
            
            // Initialize sider data
            if (!db.data.sider) {
                db.data.sider = {
                    enabled: {},
                    lastActivity: {},
                    settings: {}
                }
            }
            
            if (!db.data.sider.lastActivity[chatId]) {
                db.data.sider.lastActivity[chatId] = {}
            }
            
            // Update last activity (minimal 1 jam sekali biar gak terlalu sering nulis DB)
            const now = Date.now()
            const lastActive = db.data.sider.lastActivity[chatId][sender] || 0
            
            if (now - lastActive > 60 * 60 * 1000) {
                db.data.sider.lastActivity[chatId][sender] = now
                db.save()
                console.log(`🕵️ Sider update: ${sender} aktif di ${chatId}`)
            }
            
            // CEK AUTO KICK (opsional)
            const isEnabled = db.data.sider.enabled[chatId] === true
            if (isEnabled) {
                const settings = db.data.sider.settings[chatId] || { period: 7, autoKick: false }
                
                if (settings.autoKick === true) {
                    // Ambil metadata grup
                    const groupMeta = await sock.groupMetadata(chatId)
                    const participants = groupMeta.participants || []
                    
                    const periodMs = (settings.period || 7) * 24 * 60 * 60 * 1000
                    const nowAuto = Date.now()
                    
                    for (const participant of participants) {
                        const jid = participant.id
                        const isAdmin = participant.admin === 'admin' || participant.admin === 'superadmin'
                        const lastAct = db.data.sider.lastActivity[chatId]?.[jid] || 0
                        
                        // Skip admin, bot, dan yang baru join (lastAct == 0)
                        if (isAdmin || jid === sock.user.id || lastAct === 0) continue
                        
                        // Jika sudah lewat periode
                        if ((nowAuto - lastAct) > periodMs) {
                            try {
                                await sock.groupParticipantsUpdate(chatId, [jid], 'remove')
                                console.log(`🕵️ Auto kick: ${jid} dari ${chatId} (sider ${Math.floor((nowAuto - lastAct)/(24*60*60*1000))} hari)`)
                                
                                // Kirim notifikasi dengan mention
                                await sock.sendMessage(chatId, {
                                    text: `🦋 *SIDER DETECTED & KICKED*\n\n> @${jid.split('@')[0]} di kick karena tidak aktif selama ${settings.period} hari~\n> Bye bye~ 🗿👋`,
                                    mentions: [jid]
                                })
                                
                                // Delay biar gak kena limit
                                await new Promise(resolve => setTimeout(resolve, 2000))
                            } catch (err) {
                                console.error(`Gagal auto kick ${jid}:`, err)
                            }
                        }
                    }
                }
            }
            
        } catch (err) {
            console.error('Sider listener error:', err)
        }
    })
    
    console.log('✅ Sider (Silent Reader) Listener READY! 🕵️')
}

export { pluginConfig as config, handler, setupSiderListener };
