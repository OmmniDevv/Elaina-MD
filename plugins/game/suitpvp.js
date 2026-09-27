/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js'
import config from '../../config.js'
const pluginConfig = {
    name: 'suitpvp',
    alias: ['suit', 'rps', 'janken'],
    category: 'game',
    description: 'Main suit (batu gunting kertas) dengan player lain',
    usage: '.suit @tag',
    example: '.suit @628xxx',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    cooldown: 10,
    energi: 0,
    isEnabled: true
}

if (!global.suitGames) global.suitGames = {}

const TIMEOUT = 90000
const WIN_REWARD = 1000

const EMOJI = {
    batu: '✊',
    gunting: '✌️',
    kertas: '✋'
}

async function handler(m, { sock }) {
    const db = getDatabase()
    
    const existingRoom = Object.values(global.suitGames).find(
        room => [room.p, room.p2].includes(m.sender)
    )
    
    if (existingRoom) {
        return m.reply(
            `❌ Kamu masih dalam game suit!\n\n` +
            `> Selesaikan game kamu dulu.`
        )
    }
    
    let target = null
    if (m.quoted) {
        target = m.quoted.sender
    } else if (m.mentionedJid?.[0]) {
        target = m.mentionedJid[0]
    }
    
    if (!target) {
        return m.reply(
            `✊✌️✋ *sᴜɪᴛ ᴘᴠᴘ*\n\n` +
            `> Tag orang yang mau kamu tantang!\n\n` +
            `*Contoh:*\n` +
            `> \`.suit @628xxx\``
        )
    }
    
    if (target === m.sender) {
        return m.reply('❌ Tidak bisa menantang diri sendiri!')
    }
    
    const targetInGame = Object.values(global.suitGames).find(
        room => [room.p, room.p2].includes(target)
    )
    
    if (targetInGame) {
        return m.reply('❌ Orang itu sedang bermain suit dengan orang lain!')
    }
    
    const roomId = 'suit_' + Date.now()
    
    global.suitGames[roomId] = {
        id: roomId,
        chat: m.chat,
        p: m.sender,
        p2: target,
        status: 'waiting',
        pilih: null,
        pilih2: null,
        createdAt: Date.now(),
        timeout: setTimeout(() => {
            if (global.suitGames[roomId]) {
                sock.sendMessage(m.chat, {
                    text: `⏱️ *TIMEOUT!*\n\n@${target.split('@')[0]} tidak merespon!\nSuit dibatalkan.`,
                    mentions: [target]
                })
                delete global.suitGames[roomId]
            }
        }, TIMEOUT)
    }
    
    await m.react('✊')
    await m.reply(`Kamu menantang @${target.split('@')[0]} untuk adu suit\n\n` +
            `╭┈┈⬡「 💬 *ʀᴇsᴘᴏɴ* 」\n` +
            `┃ ✅ Ketik *terima* / *gas* / *ok*\n` +
            `┃ ❌ Ketik *tolak* / *gabisa*\n` +
            `╰┈┈┈┈┈┈┈┈⬡\n\n` +
            `Waktu: 90 detik`, {  mentions: [target]})
}

async function answerHandler(m, sock) {
    if (!m.body) return false
    
    const text = m.body.trim().toLowerCase()
    const db = getDatabase()
    
    let room = null
    let roomId = null
    
    for (const [id, r] of Object.entries(global.suitGames)) {
        if (r.chat === m.chat && [r.p, r.p2].includes(m.sender)) {
            room = r
            roomId = id
            break
        }
        if (!m.isGroup && [r.p, r.p2].includes(m.sender)) {
            room = r
            roomId = id
            break
        }
    }
    
    if (!room) return false
    
    if (room.status === 'waiting' && m.sender === room.p2 && m.chat === room.chat) {
        if (/^(acc(ept)?|terima|gas|oke?|ok|iya|yoi)$/i.test(text)) {
            clearTimeout(room.timeout)
            room.status = 'playing'
            
            await m.react('🎮')
            
            await m.reply(`✊✌️✋ *sᴜɪᴛ ᴅɪᴍᴜʟᴀɪ!*\n\n` +
                    `@${room.p.split('@')[0]} vs @${room.p2.split('@')[0]}\n\n` +
                    `> 📩 Cek *Private Chat* untuk memilih!\n` +
                    `> ⏱️ Timeout: 90 detik`, {  mentions: [room.p, room.p2]})
            
            const pmMessage = `✊✌️✋ *sᴜɪᴛ - ᴘɪʟɪʜ ᴊᴀᴡᴀʙᴀɴ*\n\n` +
                `Ketik salah satu:\n\n` +
                `┃ ✊ *batu*\n` +
                `┃ ✌️ *gunting*\n` +
                `┃ ✋ *kertas*\n\n` +
                `*TIP: Reply pesan ini dengan pilihanmu!*\n` +
                `Contoh: *batu*`
            
            try {
                await sock.sendMessage(room.p, { text: pmMessage })
            } catch (e) {
                console.log('[Suit] Failed to PM player 1:', e.message)
            }
            
            try {
                await sock.sendMessage(room.p2, { text: pmMessage })
            } catch (e) {
                console.log('[Suit] Failed to PM player 2:', e.message)
            }
            
            room.timeout = setTimeout(async () => {
                if (global.suitGames[roomId]) {
                    if (!room.pilih && !room.pilih2) {
                        await sock.sendMessage(room.chat, { 
                            text: '⏱️ Kedua pemain tidak memilih, suit dibatalkan!' 
                        })
                    } else if (!room.pilih || !room.pilih2) {
                        const afk = !room.pilih ? room.p : room.p2
                        const winner = !room.pilih ? room.p2 : room.p
                        
                        db.updateKoin(winner, WIN_REWARD)
                        
                        await sock.sendMessage(room.chat, {
                            text: `⏱️ *TIMEOUT!*\n\n` +
                                `@${afk.split('@')[0]} tidak memilih!\n` +
                                `@${winner.split('@')[0]} menang! +Rp ${WIN_REWARD.toLocaleString()}`,
                            mentions: [afk, winner]
                        })
                    }
                    delete global.suitGames[roomId]
                }
            }, TIMEOUT)
            
            return true
        }
        
        if (/^(tolak|gamau|nanti|ga(k.)?bisa|no|tidak)$/i.test(text)) {
            clearTimeout(room.timeout)
            
            await sock.sendMessage(room.chat, {
                text: `❌ @${room.p2.split('@')[0]} menolak tantangan!\nSuit dibatalkan.`,
                mentions: [room.p2]
            })
            
            delete global.suitGames[roomId]
            return true
        }
    }
    
    if (room.status === 'playing' && !m.isGroup) {
        const choices = /^(batu|gunting|kertas)$/i
        
        if (!choices.test(text)) return false
        
        const choice = text.toLowerCase()
        
        if (m.sender === room.p && !room.pilih) {
            room.pilih = choice
            await m.reply(`✅ Kamu memilih *${choice}* ${EMOJI[choice]}\n\n> Menunggu lawan...`)
            
            if (!room.pilih2) {
                await sock.sendMessage(room.chat, {
                    text: `🕕 @${room.p.split('@')[0]} sudah memilih!\n> Menunggu @${room.p2.split('@')[0]}...`,
                    mentions: [room.p, room.p2]
                })
            }
        }
        
        if (m.sender === room.p2 && !room.pilih2) {
            room.pilih2 = choice
            await m.reply(`✅ Kamu memilih *${choice}* ${EMOJI[choice]}\n\n> Menunggu lawan...`)
            
            if (!room.pilih) {
                await sock.sendMessage(room.chat, {
                    text: `🕕 @${room.p2.split('@')[0]} sudah memilih!\n> Menunggu @${room.p.split('@')[0]}...`,
                    mentions: [room.p, room.p2]
                })
            }
        }
        
        if (room.pilih && room.pilih2) {
            clearTimeout(room.timeout)
            
            let winner = null
            let tie = false
            
            if (room.pilih === room.pilih2) {
                tie = true
            } else if (
                (room.pilih === 'batu' && room.pilih2 === 'gunting') ||
                (room.pilih === 'gunting' && room.pilih2 === 'kertas') ||
                (room.pilih === 'kertas' && room.pilih2 === 'batu')
            ) {
                winner = room.p
            } else {
                winner = room.p2
            }
            
            let resultTxt = `✊✌️✋ *ʜᴀsɪʟ sᴜɪᴛ*\n\n`
            resultTxt += `@${room.p.split('@')[0]} ${EMOJI[room.pilih]} ${room.pilih}\n`
            resultTxt += `@${room.p2.split('@')[0]} ${EMOJI[room.pilih2]} ${room.pilih2}\n\n`
            
            if (tie) {
                resultTxt += `🤝 *SERI!*`
            } else {
                db.updateKoin(winner, WIN_REWARD)
                
                resultTxt += `🏆 @${winner.split('@')[0]} menang!\n`
                resultTxt += `> +Rp ${WIN_REWARD.toLocaleString()}`
            }
            
            await sock.sendMessage(room.chat, {
                text: resultTxt,
                mentions: [room.p, room.p2]
            }, { quoted: m })
            
            delete global.suitGames[roomId]
        }
        
        return true
    }
    
    return false
}

export { pluginConfig as config, handler, answerHandler }