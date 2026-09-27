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
    name: 'antipm',
    alias: ['apm', 'nopm'],
    category: 'owner',
    description: 'Anti PM - cuma nomor tertentu yang bisa chat ke bot (BLOKIR ASLI)',
    usage: '.antipm <on/off/status>',
    example: '.antipm on',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    isAdmin: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

// Buat nyimpen pelanggar dan counter
let pmViolations = new Map()

// Ambil nomor yang boleh chat dari config
function getAllowedNumbers() {
    const allowed = []
    
    // Nomor bot sendiri
    if (config.bot?.number) {
        const botNum = config.bot.number.replace(/[^0-9]/g, '')
        if (botNum) allowed.push(botNum)
    }
    
    // Nomor owner (bisa array atau string)
    if (config.owner?.number) {
        if (Array.isArray(config.owner.number)) {
            for (const num of config.owner.number) {
                const cleanNum = num.toString().replace(/[^0-9]/g, '')
                if (cleanNum) allowed.push(cleanNum)
            }
        } else {
            const cleanNum = config.owner.number.toString().replace(/[^0-9]/g, '')
            if (cleanNum) allowed.push(cleanNum)
        }
    }
    
    // Hapus duplikat
    return [...new Set(allowed)]
}

async function handler(m, { sock }) {
    const db = getDatabase()
    const args = m.args || []
    const sub = args[0]?.toLowerCase()
    
    if (!db.data.antipm) {
        db.data.antipm = {
            enabled: false,
            blockedUsers: []
        }
    }
    
    const allowedNumbers = getAllowedNumbers()
    
    if (sub === 'on') {
        db.data.antipm.enabled = true
        db.save()
        
        let daftarAllowed = ''
        for (const num of allowedNumbers) {
            daftarAllowed += `> • wa.me/${num}\n`
        }
        
        return m.reply(
            `🦋 *ANTI PM AKTIF* 🦋\n\n` +
            `> Rimuru: "Siap darling~ Sekarang cuma ${allowedNumbers.length} orang yang bisa chat ke aku!\n\n` +
            `📋 *Daftar yang boleh chat:*\n${daftarAllowed}\n` +
            `💀 *Siapapun selain itu bakal diblokir ASLI di WhatsApp!*\n` +
            `⚠️ *Peringatan 3x chat → BLOKIR PERMANEN!*\n\n` +
            `💫 *Yosh!* Awas ya darling~ 🎐`
        )
    }
    
    if (sub === 'off') {
        db.data.antipm.enabled = false
        db.save()
        
        return m.reply(
            `❌ *ANTI PM NONAKTIF* ❌\n\n` +
            `> Rimuru: "Hmph~ Yaudah, sekarang semua orang bisa chat ke aku. Tapi jangan aneh-aneh ya darling~ 🦋"`
        )
    }
    
    if (sub === 'status') {
        const blockedCount = db.data.antipm.blockedUsers?.length || 0
        
        let daftarAllowed = ''
        for (const num of allowedNumbers) {
            daftarAllowed += `> wa.me/${num}\n`
        }
        
        return m.reply(
            `🛡️ *STATUS ANTI PM* 🛡️\n\n` +
            `📊 Status: ${db.data.antipm.enabled ? '✅ AKTIF' : '❌ NONAKTIF'}\n` +
            `👑 Yang boleh chat: ${allowedNumbers.length} orang\n` +
            `🚫 User diblokir (ASLI): ${blockedCount} orang\n\n` +
            `📋 *Daftar yang boleh chat:*\n${daftarAllowed}\n` +
            `> ${m.prefix}antipm on → aktifkan\n` +
            `> ${m.prefix}antipm off → nonaktifkan\n` +
            `> ${m.prefix}antipm unblock @user → buka blokir\n` +
            `> ${m.prefix}antipm blocklist → lihat daftar blokir`
        )
    }
    
    if (sub === 'blocklist') {
        const blockedList = db.data.antipm.blockedUsers || []
        
        if (blockedList.length === 0) {
            return m.reply(`📋 *DAFTAR BLOKIR*\n\n> Belum ada nomor yang diblokir darling~ 🦋`)
        }
        
        let text = `🚫 *DAFTAR NOMOR DIBLOKIR* 🚫\n\n`
        for (let i = 0; i < blockedList.length; i++) {
            const num = blockedList[i].split('@')[0]
            text += `${i+1}. wa.me/${num}\n`
        }
        text += `\n> Total: ${blockedList.length} nomor diblokir ASLI!\n`
        text += `> ${m.prefix}antipm unblock @user → buka blokir`
        
        return m.reply(text)
    }
    
    if (sub === 'unblock') {
        const mention = m.mentionedJid?.[0]
        const targetNumber = m.args[1]?.replace(/[^0-9]/g, '')
        let target = mention || (targetNumber ? `${targetNumber}@s.whatsapp.net` : null)
        
        if (!target) {
            return m.reply(`⚠️ Tag user yang mau diunblock: ${m.prefix}antipm unblock @user\nAtau: ${m.prefix}antipm unblock 628xxxxxx`)
        }
        
        const blockedList = db.data.antipm.blockedUsers || []
        const index = blockedList.indexOf(target)
        
        if (index === -1) {
            return m.reply(`❌ User @${target.split('@')[0]} gak ada di daftar blokiran~`, { mentions: [target] })
        }
        
        blockedList.splice(index, 1)
        db.data.antipm.blockedUsers = blockedList
        db.save()
        
        try {
            await sock.updateBlockStatus(target, 'unblock')
            console.log(`✅ AntiPM: ${target} berhasil diunblock`)
            
            return m.reply(`✅ *UNBLOCK BERHASIL*\n\n> @${target.split('@')[0]} sekarang bisa chat lagi~\n> Blokir WhatsApp telah dibuka! 🦋`, { mentions: [target] })
        } catch (err) {
            console.error('Unblock error:', err)
            return m.reply(`⚠️ *UNBLOCK GAGAL*\n\n> Error: ${err.message}\n> Coba manual di WhatsApp darling~ 🦋`)
        }
    }
    
    let daftarAllowed = ''
    for (const num of allowedNumbers.slice(0, 3)) {
        daftarAllowed += `> wa.me/${num}\n`
    }
    if (allowedNumbers.length > 3) daftarAllowed += `> _dan ${allowedNumbers.length - 3} lainnya_\n`
    
    return m.reply(
        `🦋 *ANTI PM BOT* 🦋\n\n` +
        `> ${m.prefix}antipm on → aktifkan\n` +
        `> ${m.prefix}antipm off → nonaktifkan\n` +
        `> ${m.prefix}antipm status → lihat status\n` +
        `> ${m.prefix}antipm blocklist → lihat daftar blokir\n` +
        `> ${m.prefix}antipm unblock @user → buka blokir\n\n` +
        `📌 *Yang boleh chat:*\n${daftarAllowed}\n` +
        `🚫 *Sanksi:* Peringatan 3x → BLOKIR ASLI WhatsApp!\n\n` +
        `💫 *Rimuru:* "Yang lain jangan coba-coba ya darling~ 🎐"`
    )
}

// LISTENER buat nangkep PM
async function setupAntiPMListener(sock) {
    console.log('🦋 Starting Anti-PM Listener (BLOKIR ASLI)...')
    
    sock.ev.on('messages.upsert', async ({ messages }) => {
        try {
            const msg = messages[0]
            if (!msg.message) return
            
            const chatId = msg.key.remoteJid
            if (!chatId || chatId.includes('@g.us')) return
            
            if (msg.key.fromMe) return
            
            const db = getDatabase()
            
            if (!db.data.antipm?.enabled) return
            
            const sender = msg.key.remoteJid
            const senderNumber = sender.split('@')[0]
            
            let text = msg.message?.conversation || 
                      msg.message?.extendedTextMessage?.text || 
                      msg.message?.imageMessage?.caption ||
                      '[Media]'
            
            const allowedNumbers = getAllowedNumbers()
            const isAllowed = allowedNumbers.includes(senderNumber)
            
            const botNumber = sock.user.id?.split(':')[0] || sock.user.id?.split('@')[0] || ''
            const isBotSelf = senderNumber === botNumber
            
            if (isAllowed || isBotSelf) {
                console.log(`✅ AntiPM skip: ${senderNumber} (${isAllowed ? 'allowed' : 'bot sendiri'})`)
                return
            }
            
            const isAlreadyBlocked = db.data.antipm.blockedUsers?.includes(sender)
            
            if (isAlreadyBlocked) {
                await sock.sendMessage(sender, {
                    text: `🦋 *RIMURU*: "Heh! ${senderNumber} kamu udah aku *BLOKIR ASLI* di WhatsApp! 🗿\n\nGak usah coba-coba chat lagi, pesanmu gak bakal sampe ke aku~\n\n💀 *KALO MAU DIBUKA, CHAT NOMOR YANG BOLEH AJA!* 🎐"`
                })
                return
            }
            
            let violation = pmViolations.get(sender)
            if (!violation) {
                violation = {
                    count: 0,
                    firstTime: Date.now(),
                    messages: []
                }
            }
            
            const hoursSinceFirst = (Date.now() - violation.firstTime) / (1000 * 60 * 60)
            if (hoursSinceFirst > 24) {
                violation.count = 0
                violation.firstTime = Date.now()
                violation.messages = []
            }
            
            violation.messages.push(text)
            const currentCount = violation.count
            
            if (currentCount === 0) {
                let daftarAllowed = ''
                for (const num of allowedNumbers.slice(0, 2)) {
                    daftarAllowed += `wa.me/${num} `
                }
                
                await sock.sendMessage(sender, {
                    text: `🦋 *RIMURU SAYS* 🦋\n\n` +
                          `"Heh! ${senderNumber} jangan chat aku dong~ 🗿\n\n` +
                          `Aku lagi *ANTI PM MODE* nih!\n` +
                          `Cuma ${allowedNumbers.length} orang yang bisa chat ke aku!\n` +
                          `Yaitu: ${daftarAllowed}\n\n` +
                          `⚠️ *PERINGATAN 1/3*\n` +
                          `Kalau masih chat 2 kali lagi, nomormu bakal aku *BLOKIR ASLI* di WhatsApp!\n\n` +
                          `💀 *INI PERINGATAN TERAKHIR!* 🎐`
                })
                
                violation.count++
                pmViolations.set(sender, violation)
                console.log(`⚠️ AntiPM: ${senderNumber} peringatan 1/3`)
                
            } else if (currentCount === 1) {
                violation.count++
                pmViolations.set(sender, violation)
                
                await sock.sendMessage(sender, {
                    text: `🚨 *RIMURU - PERINGATAN TERAKHIR* 🚨\n\n` +
                          `"${senderNumber}! GW BILANG JANGAN CHAT!! 🗿\n\n` +
                          `Ini udah *PERINGATAN KE-2*!\n` +
                          `SEKALI LAGI lo chat, nomormu bakal gw *BLOKIR ASLI*!\n\n` +
                          `⚠️ *SISA KESEMPATAN: 1 KALI SAJA!*\n` +
                          `💀 *JANGAN COBA-COBA ATAU KAMU BLOKIR PERMANEN!*`
                })
                
                console.log(`⚠️ AntiPM: ${senderNumber} peringatan 2/3`)
                
            } else if (currentCount >= 2) {
                violation.count++
                pmViolations.set(sender, violation)
                
                await sock.sendMessage(sender, {
                    text: `💀 *RIMURU - KAMU DIBLOKIR ASLI!* 💀\n\n` +
                          `"SUDAH GW BILANG JANGAN CHAT!! 🗿\n\n` +
                          `Kamu udah chat *${violation.count} kali* padahal udah aku peringatin 2x!\n` +
                          `Cuma ${allowedNumbers.length} nomor yang boleh chat ke aku, dan kamu BUKAN salah satunya!\n\n` +
                          `🚫 *NOMORMU SEKARANG DIBLOKIR ASLI DI WHATSAPP!*\n` +
                          `💀 *KAMU GAK BISA CHAT KE BOT LAGI SELAMANYA!*\n\n` +
                          `Bye bye~ Jangan balik lagi ya darling~ 🦋`
                })
                
                if (!db.data.antipm.blockedUsers) db.data.antipm.blockedUsers = []
                if (!db.data.antipm.blockedUsers.includes(sender)) {
                    db.data.antipm.blockedUsers.push(sender)
                    db.save()
                }
                
                try {
                    await sock.updateBlockStatus(sender, 'block')
                    console.log(`🚫 AntiPM: ${senderNumber} BERHASIL DIBLOKIR ASLI di WhatsApp!`)
                    
                    for (const allowedNum of allowedNumbers) {
                        try {
                            const allowedJid = `${allowedNum}@s.whatsapp.net`
                            await sock.sendMessage(allowedJid, {
                                text: `💀 *ANTI PM - BLOKIR ASLI* 💀\n\n` +
                                      `✅ *User diblokir:* ${senderNumber}\n` +
                                      `📊 *Total chat:* ${violation.count} kali\n` +
                                      `📝 *Pesan terakhir:* ${text.slice(0, 100)}\n` +
                                      `⏰ *Waktu:* ${new Date().toLocaleString()}\n\n` +
                                      `🔒 *Status:* BLOKIR ASLI WhatsApp!\n` +
                                      `💀 *User tidak bisa chat ke bot lagi!*\n\n` +
                                      `🦋 *Rimuru:* "Beres darling! Gak bakal ganggu lagi~ 🗿🔥"`
                            })
                        } catch (err) {}
                    }
                    
                } catch (err) {
                    console.error(`Gagal blokir asli ${senderNumber}:`, err)
                    
                    for (const allowedNum of allowedNumbers) {
                        try {
                            const allowedJid = `${allowedNum}@s.whatsapp.net`
                            await sock.sendMessage(allowedJid, {
                                text: `⚠️ *GAGAL BLOKIR ASLI* ⚠️\n\n` +
                                      `> User: ${senderNumber}\n` +
                                      `> Error: ${err.message}\n\n` +
                                      `> Mungkin perlu blokir manual darling~ 🦋`
                            })
                        } catch (err) {}
                    }
                }
            }
            
        } catch (err) {
            console.error('AntiPM listener error:', err)
        }
    })
    
    const allowedNumbers = getAllowedNumbers()
    console.log('✅ Anti-PM Listener READY! 🦋')
    console.log(`   👑 Allowed users: ${allowedNumbers.join(', ')}`)
    console.log(`   🔒 Block mode: BLOKIR ASLI WHATSAPP!`)
}

export { pluginConfig as config, handler, setupAntiPMListener };
