/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { createCanvas } from '@napi-rs/canvas';

const pluginConfig = {
    name: 'checkers',
    alias: ['dam', 'caturdam', 'zerocheckers'],
    category: 'game',
    description: 'Game catur dam / checkers Rimuru! Makan semua pion lawan untuk menang.',
    usage: '.checkers [@lawan]',
    example: '.checkers @user',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    cooldown: 10,
    energi: 2,
    isEnabled: true
}

const THEME = {
    bg: '#0a050f',
    primary: '#ff2a6d',
    secondary: '#ff69b4',
    textPrimary: '#ffffff',
    textSecondary: '#ff99bb',
    glow: '#ff2a6d',
    boardDark: '#2a1a2a',
    boardLight: '#1a0b1a',
    highlight: '#ff66b5'
}

// ============ PEMETAAN PION ============
// P1 (bawah - merah) pakai 🔴 dan 👑
// P2 (atas - pink) pakai 💕 dan 👑
const PIECES = {
    p1: '🔴',
    p1_king: '👑',
    p2: '💕',
    p2_king: '👑'
}

// Inisialisasi board
function initBoard() {
    // Board 8x8
    const board = Array(8).fill().map(() => Array(8).fill(null))
    
    // Pion P2 (atas) di baris 0-2
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 8; col++) {
            if ((row + col) % 2 === 1) {
                board[row][col] = 'p2'
            }
        }
    }
    
    // Pion P1 (bawah) di baris 5-7
    for (let row = 5; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if ((row + col) % 2 === 1) {
                board[row][col] = 'p1'
            }
        }
    }
    
    return board
}

// Cek apakah posisi valid
function isValidPos(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8
}

// Cek apakah bisa makan
function canCapture(board, fromRow, fromCol, toRow, toCol, player) {
    const piece = board[fromRow][fromCol]
    if (!piece || piece !== player) return false
    
    const dr = toRow - fromRow
    const dc = toCol - fromCol
    
    // Harus lompat 2 langkah diagonal
    if (Math.abs(dr) !== 2 || Math.abs(dc) !== 2) return false
    
    const midRow = (fromRow + toRow) / 2
    const midCol = (fromCol + toCol) / 2
    const midPiece = board[midRow][midCol]
    
    // Harus ada pion lawan di tengah
    if (!midPiece) return false
    if (player === 'p1' && midPiece === 'p1') return false
    if (player === 'p2' && midPiece === 'p2') return false
    
    // Pion biasa hanya bisa maju
    if (!piece.includes('king')) {
        if (player === 'p1' && dr > 0) return false // P1 maju ke atas (dr negatif)
        if (player === 'p2' && dr < 0) return false // P2 maju ke bawah (dr positif)
    }
    
    return true
}

// Cek apakah bisa jalan biasa
function canMove(board, fromRow, fromCol, toRow, toCol, player) {
    const piece = board[fromRow][fromCol]
    if (!piece || piece !== player) return false
    
    const dr = toRow - fromRow
    const dc = toCol - fromCol
    
    // Harus diagonal 1 langkah
    if (Math.abs(dr) !== 1 || Math.abs(dc) !== 1) return false
    
    // Tujuan harus kosong
    if (board[toRow][toCol]) return false
    
    // Pion biasa hanya bisa maju
    if (!piece.includes('king')) {
        if (player === 'p1' && dr > 0) return false // P1 maju ke atas (dr negatif)
        if (player === 'p2' && dr < 0) return false // P2 maju ke bawah (dr positif)
    }
    
    return true
}

// Cek apakah player punya capture yang tersedia
function hasAnyCapture(board, player) {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (board[row][col] === player) {
                for (let dr of [-2, 2]) {
                    for (let dc of [-2, 2]) {
                        const toRow = row + dr
                        const toCol = col + dc
                        if (isValidPos(toRow, toCol)) {
                            if (canCapture(board, row, col, toRow, toCol, player)) {
                                return true
                            }
                        }
                    }
                }
            }
        }
    }
    return false
}

// Eksekusi gerakan
function makeMove(board, fromRow, fromCol, toRow, toCol, player) {
    const piece = board[fromRow][fromCol]
    const isCapture = Math.abs(toRow - fromRow) === 2
    
    // Pindah pion
    board[toRow][toCol] = piece
    board[fromRow][fromCol] = null
    
    // Hapus pion yang dimakan
    if (isCapture) {
        const midRow = (fromRow + toRow) / 2
        const midCol = (fromCol + toCol) / 2
        board[midRow][midCol] = null
    }
    
    // Upgrade jadi raja
    if (!piece.includes('king')) {
        if (player === 'p1' && toRow === 0) {
            board[toRow][toCol] = 'p1_king'
        } else if (player === 'p2' && toRow === 7) {
            board[toRow][toCol] = 'p2_king'
        }
    }
    
    return isCapture
}

// Hitung pion player
function countPieces(board, player) {
    let count = 0
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (board[row][col] === player || board[row][col] === `${player}_king`) {
                count++
            }
        }
    }
    return count
}

// Render board ke canvas
async function renderBoard(game, selectedPos = null, validMoves = [], lastMove = null) {
    const W = 600
    const H = 650
    const canvas = createCanvas(W, H)
    const ctx = canvas.getContext('2d')
    const cellSize = 65
    const offsetX = 20
    const offsetY = 80

    // Background
    const grad = ctx.createLinearGradient(0, 0, W, H)
    grad.addColorStop(0, '#0a050f')
    grad.addColorStop(1, '#1a0b1a')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)

    // Header
    ctx.fillStyle = THEME.primary
    ctx.font = 'bold 22px "Segoe UI"'
    ctx.textAlign = 'center'
    ctx.shadowColor = THEME.glow
    ctx.shadowBlur = 10
    ctx.fillText('🦋 RIMURU CHECKERS 🦋', W/2, 45)
    ctx.shadowBlur = 0

    ctx.fillStyle = THEME.textSecondary
    ctx.font = '12px "Segoe UI"'
    ctx.fillText('"Catur Dam - Makan semua pion lawan!"', W/2, 70)

    // Gambar board
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const x = offsetX + col * cellSize
            const y = offsetY + row * cellSize
            const isDark = (row + col) % 2 === 1
            
            // Warna cell
            ctx.fillStyle = isDark ? THEME.boardDark : THEME.boardLight
            ctx.fillRect(x, y, cellSize, cellSize)
            
            // Highlight selected
            if (selectedPos && selectedPos.row === row && selectedPos.col === col) {
                ctx.strokeStyle = THEME.highlight
                ctx.lineWidth = 4
                ctx.shadowBlur = 0
                ctx.strokeRect(x + 2, y + 2, cellSize - 4, cellSize - 4)
            }
            
            // Highlight valid moves
            if (validMoves.some(m => m.row === row && m.col === col)) {
                ctx.fillStyle = `${THEME.highlight}40`
                ctx.fillRect(x, y, cellSize, cellSize)
            }
            
            // Gambar pion
            const piece = game.board[row][col]
            if (piece) {
                let emoji = ''
                if (piece === 'p1') emoji = '🔴'
                else if (piece === 'p1_king') emoji = '👑'
                else if (piece === 'p2') emoji = '💕'
                else if (piece === 'p2_king') emoji = '👑'
                
                ctx.font = 'bold 36px "Segoe UI"'
                ctx.fillStyle = piece === 'p1' || piece === 'p1_king' ? THEME.primary : THEME.secondary
                ctx.fillText(emoji, x + cellSize/2, y + cellSize/2 + 10)
            }
        }
    }

    // Label koordinat
    ctx.fillStyle = THEME.textSecondary
    ctx.font = 'bold 12px "Segoe UI"'
    ctx.textAlign = 'center'
    for (let i = 0; i < 8; i++) {
        ctx.fillText(String.fromCharCode(65 + i), offsetX + i * cellSize + cellSize/2, offsetY - 10)
        ctx.fillText((8 - i).toString(), offsetX - 15, offsetY + i * cellSize + cellSize/2 + 5)
    }

    // Skor
    const p1Count = countPieces(game.board, 'p1')
    const p2Count = countPieces(game.board, 'p2')
    
    ctx.fillStyle = THEME.primary
    ctx.font = 'bold 16px "Segoe UI"'
    ctx.fillText(`🔴 P1: ${p1Count} pion`, 150, H - 25)
    ctx.fillStyle = THEME.secondary
    ctx.fillText(`💕 P2: ${p2Count} pion`, W - 200, H - 25)

    // Giliran
    const turnName = game.turn === 'p1' ? game.p1.split('@')[0] : game.p2.split('@')[0]
    ctx.fillStyle = game.turn === 'p1' ? THEME.primary : THEME.secondary
    ctx.font = 'bold 14px "Segoe UI"'
    ctx.fillText(`🎮 Giliran: @${turnName}`, W/2, H - 25)

    // Footer
    ctx.fillStyle = `${THEME.primary}80`
    ctx.font = '10px "Segoe UI"'
    ctx.fillText('❥ Rimuru AI', W - 70, H - 8)

    return canvas.toBuffer('image/png')
}

// Sessions
const sessions = new Map()

function createGame(p1, p2) {
    return {
        p1, p2,
        board: initBoard(),
        turn: Math.random() < 0.5 ? 'p1' : 'p2',
        lastBoardKey: null,
        mustCapture: false,
        captureFrom: null
    }
}

// Parse notasi (contoh: A3, B4)
function parseNotation(notation) {
    if (!notation || notation.length < 2) return null
    const col = notation.charCodeAt(0) - 65
    const row = 8 - parseInt(notation[1])
    if (col >= 0 && col < 8 && row >= 0 && row < 8) {
        return { row, col }
    }
    return null
}

async function handler(m, { sock, config: botConfig }) {
    try {
        const chatId = m.chat
        const senderId = m.sender
        const prefix = botConfig.command?.prefix || '.'
        const text = m.text?.trim() || ''
        const args = text.split(/\s+/).slice(1)
        const sub = args[0]?.toLowerCase()

        // Resign
        if (sub === 'resign' || sub === 'nyerah') {
            const game = sessions.get(chatId)
            if (!game) return m.reply('❌ Gak ada game checkers yang jalan, darling~')
            if (game.p1 !== senderId && game.p2 !== senderId)
                return m.reply('❌ Darling, kamu gak main di sini~')
            
            const winner = game.p1 === senderId ? game.p2 : game.p1
            sessions.delete(chatId)
            return m.reply(
                `🏳️ @${senderId.split('@')[0]} menyerah!\n\n` +
                `🏆 @${winner.split('@')[0]} *MENANG!*\n\n` +
                `🦋 *Rimuru:* Aduh darling~ lain kali jangan nyerah dong! 💕`
            )
        }

        // Gerakan (contoh: .checkers A3 B4)
        if (args.length >= 2 && sessions.has(chatId)) {
            const game = sessions.get(chatId)
            const currentPlayer = game.turn === 'p1' ? game.p1 : game.p2
            
            if (senderId !== currentPlayer) {
                return m.reply(`⏳ Bukan giliran kamu, darling!\nTunggu @${currentPlayer.split('@')[0]} gerak dulu~ 🦋`)
            }
            
            const fromPos = parseNotation(args[0].toUpperCase())
            const toPos = parseNotation(args[1].toUpperCase())
            
            if (!fromPos || !toPos) {
                return m.reply(`❌ Format salah!\nContoh: *${prefix}checkers A3 B4*\n\nKolom: A-H | Baris: 1-8`)
            }
            
            const piece = game.board[fromPos.row][fromPos.col]
            const playerPiece = game.turn === 'p1' ? 'p1' : 'p2'
            
            if (!piece || (piece !== playerPiece && piece !== `${playerPiece}_king`)) {
                return m.reply(`❌ Kamu gak punya pion di ${args[0].toUpperCase()}!`)
            }
            
            // Cek apakah wajib capture
            const hasCapture = hasAnyCapture(game.board, playerPiece)
            
            if (hasCapture) {
                // Wajib capture
                if (Math.abs(toPos.row - fromPos.row) !== 2 || Math.abs(toPos.col - fromPos.col) !== 2) {
                    return m.reply(`❌ Kamu *WAJIB* makan pion lawan! Gerak lompat 2 langkah diagonal untuk capture.`)
                }
                
                if (!canCapture(game.board, fromPos.row, fromPos.col, toPos.row, toPos.col, playerPiece)) {
                    return m.reply(`❌ Capture tidak valid! Pastikan ada pion lawan di tengah.`)
                }
            } else {
                // Gerak biasa
                if (!canMove(game.board, fromPos.row, fromPos.col, toPos.row, toPos.col, playerPiece)) {
                    return m.reply(`❌ Gerakan tidak valid! Pion hanya bisa jalan 1 langkah diagonal.`)
                }
            }
            
            // Eksekusi gerakan
            const isCapture = makeMove(game.board, fromPos.row, fromPos.col, toPos.row, toPos.col, playerPiece)
            
            // Cek apakah masih ada capture lagi dari posisi baru
            let mustCaptureAgain = false
            let captureFrom = null
            
            if (isCapture) {
                const newPiece = game.board[toPos.row][toPos.col]
                if (newPiece === playerPiece || newPiece === `${playerPiece}_king`) {
                    // Cek apakah dari posisi baru bisa capture lagi
                    for (let dr of [-2, 2]) {
                        for (let dc of [-2, 2]) {
                            const newRow = toPos.row + dr
                            const newCol = toPos.col + dc
                            if (isValidPos(newRow, newCol)) {
                                if (canCapture(game.board, toPos.row, toPos.col, newRow, newCol, playerPiece)) {
                                    mustCaptureAgain = true
                                    captureFrom = { row: toPos.row, col: toPos.col }
                                    break
                                }
                            }
                        }
                        if (mustCaptureAgain) break
                    }
                }
            }
            
            // Cek kemenangan
            const p1Count = countPieces(game.board, 'p1')
            const p2Count = countPieces(game.board, 'p2')
            
            if (p1Count === 0 || p2Count === 0 || !hasAnyCapture(game.board, 'p1') || !hasAnyCapture(game.board, 'p2')) {
                let winner = null
                if (p1Count === 0) winner = game.p2
                else if (p2Count === 0) winner = game.p1
                else if (!hasAnyCapture(game.board, game.turn === 'p1' ? 'p1' : 'p2')) {
                    // Player kena stalemate (gak bisa gerak)
                    winner = game.turn === 'p1' ? game.p2 : game.p1
                }
                
                if (winner) {
                    const img = await renderBoard(game)
                    sessions.delete(chatId)
                    return sock.sendMessage(chatId, {
                        image: img,
                        caption: `🎉 *GAME OVER!* 🎉\n\n🏆 @${winner.split('@')[0]} *MENANG!*\n\n📊 Skor akhir: ${p1Count} vs ${p2Count}\n\n🦋 *Rimuru:* Selamat darling~ ${winner.split('@')[0]} pinter banget! 💕`,
                        mentions: [winner]
                    }, { quoted: m })
                }
            }
            
            // Ganti giliran atau lanjut capture
            if (mustCaptureAgain) {
                game.mustCapture = true
                game.captureFrom = captureFrom
                // Tetap giliran sama karena masih bisa capture
            } else {
                game.turn = game.turn === 'p1' ? 'p2' : 'p1'
                game.mustCapture = false
                game.captureFrom = null
            }
            
            const nextPlayer = game.turn === 'p1' ? game.p1 : game.p2
            const img = await renderBoard(game)
            
            if (game.lastBoardKey) {
                try { await sock.sendMessage(chatId, { delete: game.lastBoardKey }) } catch(e) {}
            }
            
            let caption = `♟ *Gerakan:* ${args[0].toUpperCase()} → ${args[1].toUpperCase()}\n`
            if (isCapture) caption += `🍽️ *Capture!* Pion lawan dimakan!\n`
            if (mustCaptureAgain) caption += `✨ *LANJUTAN!* Kamu masih bisa capture lagi! Gerakkan pion yang sama.\n`
            caption += `\n🎮 Giliran @${nextPlayer.split('@')[0]}`
            
            const sentMsg = await sock.sendMessage(chatId, {
                image: img,
                caption: caption,
                mentions: [nextPlayer]
            }, { quoted: m })
            game.lastBoardKey = sentMsg?.key || null
            return
        }

        // Start new game
        if (!sessions.has(chatId)) {
            const mentioned = m.mentionedJid?.[0] || m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
            let opponent = mentioned
            if (!opponent && args[0]) {
                const num = args[0].replace(/[^0-9]/g, '')
                if (num) opponent = num + '@s.whatsapp.net'
            }

            if (!opponent || opponent === senderId) {
                return m.reply(
                    `🎲 *RIMURU CHECKERS* 🎲\n\n` +
                    `🦋 *Cara main:*\n` +
                    `• Pion jalan diagonal ke depan 1 langkah\n` +
                    `• Bisa "makan" pion lawan dengan melompat 2 langkah\n` +
                    `• Kalo sampai ujung seberang, jadi RAJA (👑) bisa gerak mundur\n` +
                    `• Target: Habiskan semua pion lawan!\n\n` +
                    `📌 *Format gerak:*\n` +
                    `• Kolom: A-H | Baris: 1-8\n` +
                    `• Contoh: ${prefix}checkers A3 B4\n\n` +
                    `💕 *Mulai:* ${prefix}checkers @lawan\n` +
                    `🏳️ *Nyerah:* ${prefix}checkers resign`
                )
            }

            const game = createGame(senderId, opponent)
            sessions.set(chatId, game)

            const firstPlayer = game.turn === 'p1' ? senderId : opponent
            const img = await renderBoard(game)
            
            const sentMsg = await sock.sendMessage(chatId, {
                image: img,
                caption: `🎲 *RIMURU CHECKERS DIMULAI!* 🎲\n\n` +
                    `🔴 *Player 1:* @${senderId.split('@')[0]}\n` +
                    `💕 *Player 2:* @${opponent.split('@')[0]}\n\n` +
                    `🎮 *Giliran pertama:* @${firstPlayer.split('@')[0]}\n\n` +
                    `🦋 *Rimuru:* ${['Ayo main dam, darling~', 'Siapa yang jago strategi nih?', 'Jangan lupa promosi jadi raja ya~'][Math.floor(Math.random() * 3)]} 💕\n\n` +
                    `📌 *Cara gerak:* ${prefix}checkers A3 B4`,
                mentions: [senderId, opponent, firstPlayer]
            }, { quoted: m })
            game.lastBoardKey = sentMsg?.key || null
            return
        }

        // Status game
        const game = sessions.get(chatId)
        const img = await renderBoard(game)
        const currentPlayer = game.turn === 'p1' ? game.p1 : game.p2
        return sock.sendMessage(m.chat, {
            image: img,
            caption: `🎲 *CHECKERS ACTIVE*\n\n` +
                `🔴 ${game.p1.split('@')[0]}: ${countPieces(game.board, 'p1')} pion\n` +
                `💕 ${game.p2.split('@')[0]}: ${countPieces(game.board, 'p2')} pion\n\n` +
                `🎮 Giliran @${currentPlayer.split('@')[0]}\n\n` +
                `📌 ${prefix}checkers A3 B4 - untuk gerak\n` +
                `🏳️ ${prefix}checkers resign - nyerah`,
            mentions: [currentPlayer]
        }, { quoted: m })
        
    } catch (err) {
        console.error('[CHECKERS] ERROR:', err)
        await m.reply(`❌ Terjadi kesalahan: ${err.message}\n\nCoba lagi ya darling~ 🦋`)
    }
}
export { pluginConfig as config, handler };