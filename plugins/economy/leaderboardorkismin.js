/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { createCanvas } from '@napi-rs/canvas';
import { getDatabase } from '../../src/lib/elaina-database.js';
const pluginConfig = {
    name: 'leaderboard-orang-miskin',
    alias: ['topmiskin', 'orangmiskin', 'lbmiskin', 'poorest', 'toppoor'],
    category: 'economy',
    description: 'Ranking orang paling miskin versi Rimuru 🗿💸',
    usage: '.topmiskin',
    example: '.topmiskin',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true
}

// 🎨 THEME (mirip kayak ping & topkaya, tapi vibe miskin beda dikit)
const THEME = {
    bg: '#0a050f',
    bgCard: '#1a0b1a',
    primary: '#ff2a6d',
    secondary: '#ff0066',
    success: '#ff3b6f',
    warning: '#ff6b9d',
    danger: '#ff1a4f',
    gold: '#ffd700',
    silver: '#c0c0c0',
    bronze: '#cd7f32',
    pink: '#ff1479',
    orange: '#ff4d6d',
    textPrimary: '#ffffff',
    textSecondary: '#ff99bb',
    border: '#ff2a6d',
    glow: '#ff2a6d',
    poor: '#8B8000',
    broke: '#6b6b6b',
    dirt: '#4a3728'
}

// 🎨 FUNGSI BANTUAN
function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(angka).replace('IDR', 'Rp')
}

function truncateName(name, maxLen = 20) {
    if (!name) return 'Unknown'
    return name.length > maxLen ? name.substring(0, maxLen - 2) + '..' : name
}

// 🎨 DRAW GLOW CIRCLE PROGRESS
function drawGlowCircle(ctx, x, y, radius, percent, color, label) {
    ctx.save()
    
    ctx.beginPath()
    ctx.arc(x, y, radius + 8, 0, Math.PI * 2)
    ctx.fillStyle = `${color}15`
    ctx.fill()
    
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.strokeStyle = THEME.border
    ctx.lineWidth = 6
    ctx.stroke()
    
    const startAngle = -Math.PI / 2
    const endAngle = startAngle + (Math.PI * 2 * (percent / 100))
    
    ctx.beginPath()
    ctx.arc(x, y, radius, startAngle, endAngle)
    ctx.strokeStyle = color
    ctx.lineWidth = 6
    ctx.lineCap = 'round'
    ctx.shadowColor = color
    ctx.shadowBlur = 15
    ctx.stroke()
    
    ctx.shadowBlur = 0
    
    ctx.fillStyle = THEME.textPrimary
    ctx.font = 'bold 14px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${Math.round(percent)}%`, x, y)
    
    ctx.fillStyle = THEME.textSecondary
    ctx.font = '9px Arial'
    ctx.fillText(label, x, y + radius + 18)
    
    ctx.restore()
}

// 🎨 DRAW NEON CARD
function drawNeonCard(ctx, x, y, w, h, color) {
    ctx.save()
    
    const gradient = ctx.createLinearGradient(x, y, x + w, y + h)
    gradient.addColorStop(0, `${color}20`)
    gradient.addColorStop(1, `${color}05`)
    
    ctx.beginPath()
    ctx.roundRect(x, y, w, h, 12)
    ctx.fillStyle = gradient
    ctx.fill()
    
    ctx.strokeStyle = `${color}60`
    ctx.lineWidth = 1
    ctx.stroke()
    
    ctx.beginPath()
    ctx.moveTo(x, y + 3)
    ctx.lineTo(x, y + 12)
    ctx.quadraticCurveTo(x, y, x + 12, y)
    ctx.lineTo(x + 30, y)
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.shadowColor = color
    ctx.shadowBlur = 10
    ctx.stroke()
    
    ctx.restore()
}

// 🎨 DRAW MINI BAR
function drawMiniBar(ctx, x, y, w, h, percent, color) {
    ctx.beginPath()
    ctx.roundRect(x, y, w, h, h / 2)
    ctx.fillStyle = THEME.border
    ctx.fill()
    
    if (percent > 0) {
        const fillW = Math.max(h, w * (percent / 100))
        ctx.save()
        ctx.beginPath()
        ctx.roundRect(x, y, fillW, h, h / 2)
        ctx.fillStyle = color
        ctx.shadowColor = color
        ctx.shadowBlur = 8
        ctx.fill()
        ctx.restore()
    }
}

// 🎨 GET MEDAL FOR POOR (kebalikan dari yang kaya)
function getPoorMedalIcon(rank, totalData) {
    if (rank === 0) return '👑'  // The Poorest of All
    if (rank === 1) return '🥈'
    if (rank === 2) return '🥉'
    if (rank >= totalData - 1 && totalData > 5) return '💀'
    return '🪙'
}

function getPoorMedalColor(rank, totalData) {
    if (rank === 0) return THEME.gold
    if (rank === 1) return THEME.silver
    if (rank === 2) return THEME.bronze
    if (rank >= totalData - 1 && totalData > 5) return THEME.danger
    return THEME.poor
}

// 🎨 GET STATUS POOR
function getPoorStatus(koin, maxKoin, rank) {
    if (koin === 0) return 'BANGKRUT 💀'
    if (rank === 0) return 'TERMISKIN 👑'
    if (rank <= 2) return 'SEDIH 🥲'
    if (koin < maxKoin * 0.05) return 'MELARAT 😿'
    if (koin < maxKoin * 0.1) return 'KEPEPET 🥴'
    return 'NGETEM 🏕️'
}

function getPoorStatusColor(koin, maxKoin, rank) {
    if (koin === 0) return THEME.danger
    if (rank === 0) return THEME.gold
    if (rank <= 2) return THEME.warning
    if (koin < maxKoin * 0.05) return THEME.danger
    if (koin < maxKoin * 0.1) return THEME.orange
    return THEME.poor
}

// 🎨 MAIN DRAW FUNCTION (versi miskin)
async function drawLeaderboard(users, totalKoin) {
    const W = 950
    const H = 650
    const canvas = createCanvas(W, H)
    const ctx = canvas.getContext('2d')
    
    // Background gradient (sama kayak ping)
    const bgGrad = ctx.createLinearGradient(0, 0, W, H)
    bgGrad.addColorStop(0, '#0a050f')
    bgGrad.addColorStop(0.5, '#120a18')
    bgGrad.addColorStop(1, '#0a050f')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, W, H)
    
    // Grid lines
    ctx.globalAlpha = 0.05
    for (let i = 0; i < W; i += 50) {
        ctx.strokeStyle = THEME.primary
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, H)
        ctx.stroke()
    }
    for (let i = 0; i < H; i += 50) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(W, i)
        ctx.stroke()
    }
    ctx.globalAlpha = 1
    
    // Glow effect
    const glowGrad = ctx.createRadialGradient(W * 0.8, H * 0.2, 0, W * 0.8, H * 0.2, 400)
    glowGrad.addColorStop(0, `${THEME.danger}15`)
    glowGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = glowGrad
    ctx.fillRect(0, 0, W, H)
    
    // Header title
    ctx.save()
    ctx.fillStyle = THEME.danger
    ctx.font = 'bold 32px Arial'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = THEME.danger
    ctx.shadowBlur = 30
    ctx.fillText('💸', 35, 50)
    ctx.shadowBlur = 0
    ctx.restore()
    
    ctx.fillStyle = THEME.textPrimary
    ctx.font = 'bold 28px Arial'
    ctx.fillText('MISKIN LIST', 85, 50)
    
    ctx.fillStyle = THEME.textSecondary
    ctx.font = '12px Arial'
    ctx.fillText(`🗿 Para Pejuang Kere • Rimuru Edition`, 85, 78)
    
    // Badge total peserta
    ctx.save()
    ctx.fillStyle = `${THEME.danger}30`
    ctx.beginPath()
    ctx.roundRect(W - 180, 28, 150, 40, 12)
    ctx.fill()
    ctx.strokeStyle = THEME.danger
    ctx.lineWidth = 1
    ctx.stroke()
    
    ctx.fillStyle = THEME.danger
    ctx.font = 'bold 20px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = THEME.danger
    ctx.shadowBlur = 10
    ctx.fillText(`${users.length}`, W - 105, 48)
    ctx.shadowBlur = 0
    ctx.font = '9px Arial'
    ctx.fillStyle = THEME.textSecondary
    ctx.fillText('Total Peserta', W - 105, 62)
    ctx.restore()
    
    // Garis pemisah
    const grad = ctx.createLinearGradient(30, 95, W - 30, 95)
    grad.addColorStop(0, THEME.danger)
    grad.addColorStop(0.5, THEME.orange)
    grad.addColorStop(1, THEME.poor)
    ctx.strokeStyle = grad
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(30, 95)
    ctx.lineTo(W - 30, 95)
    ctx.stroke()
    
    // Header kolom
    ctx.fillStyle = THEME.textSecondary
    ctx.font = 'bold 11px Arial'
    ctx.textAlign = 'left'
    ctx.fillText('#', 55, 125)
    ctx.fillText('NAME', 100, 125)
    ctx.fillText('POVERTY', 420, 125)
    ctx.fillText('PERCENT', 620, 125)
    ctx.fillText('STATUS', 780, 125)
    
    let y = 155
    const rowHeight = 50
    
    users.slice(0, 10).forEach((u, i) => {
        // Hitung persen kebalikan (semakin miskin, persen ke total makin kecil)
        const percent = totalKoin > 0 ? (u.koin / totalKoin) * 100 : 0
        const medalColor = getPoorMedalColor(i, users.length)
        const medalIcon = getPoorMedalIcon(i, users.length)
        const status = getPoorStatus(u.koin, users[0]?.koin || 1, i)
        const statusColor = getPoorStatusColor(u.koin, users[0]?.koin || 1, i)
        
        // Card per row
        ctx.save()
        const gradient = ctx.createLinearGradient(40, y - 20, W - 40, y + rowHeight - 20)
        gradient.addColorStop(0, `${THEME.danger}10`)
        gradient.addColorStop(1, `${THEME.poor}05`)
        
        ctx.beginPath()
        ctx.roundRect(40, y - 20, W - 80, rowHeight, 10)
        ctx.fillStyle = gradient
        ctx.fill()
        ctx.strokeStyle = `${medalColor}40`
        ctx.lineWidth = 1
        ctx.stroke()
        
        // Rank dengan medal
        ctx.fillStyle = medalColor
        ctx.font = 'bold 18px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.shadowColor = medalColor
        ctx.shadowBlur = i < 3 ? 10 : 0
        ctx.fillText(medalIcon, 75, y)
        ctx.shadowBlur = 0
        
        ctx.fillStyle = THEME.textPrimary
        ctx.font = 'bold 14px Arial'
        ctx.fillText(`#${i + 1}`, 75, y + 18)
        
        // Name
        ctx.font = i < 3 ? 'bold 14px Arial' : '13px Arial'
        ctx.textAlign = 'left'
        ctx.fillStyle = THEME.textPrimary
        ctx.fillText(truncateName(u.name, 18), 105, y)
        
        // Subtitle (JID)
        ctx.fillStyle = THEME.textSecondary
        ctx.font = '9px Arial'
        ctx.fillText(u.shortJid || u.jid.split('@')[0].substring(0, 12), 105, y + 18)
        
        // Wealth (pakai warna merah/pucat karena miskin)
        ctx.fillStyle = u.koin === 0 ? THEME.danger : THEME.poor
        ctx.font = 'bold 13px Arial'
        ctx.textAlign = 'left'
        ctx.fillText(formatRupiah(u.koin), 420, y)
        
        // Wealth compare bar kecil
        const barW = 120
        drawMiniBar(ctx, 420, y + 15, barW, 5, Math.min(100, percent), THEME.poor)
        
        // Percent circle
        drawGlowCircle(ctx, 680, y - 4, 20, percent, medalColor, 'of total')
        
        // Status badge
        ctx.fillStyle = `${statusColor}30`
        ctx.beginPath()
        ctx.roundRect(770, y - 12, 100, 22, 20)
        ctx.fill()
        ctx.fillStyle = statusColor
        ctx.font = 'bold 9px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(status, 820, y + 1)
        
        ctx.restore()
        y += rowHeight + 5
    })
    
    // Footer dengan total kekayaan (sedih)
    const footerY = H - 55
    drawNeonCard(ctx, 40, footerY - 15, W - 80, 45, THEME.danger)
    
    ctx.fillStyle = THEME.textSecondary
    ctx.font = '10px Arial'
    ctx.textAlign = 'left'
    ctx.fillText('💀 Total Kekayaan Rakyat', 65, footerY + 2)
    
    ctx.fillStyle = THEME.poor
    ctx.font = 'bold 20px Arial'
    ctx.textAlign = 'left'
    ctx.fillText(formatRupiah(totalKoin), 65, footerY + 24)
    
    ctx.fillStyle = THEME.danger
    ctx.font = 'bold 10px Arial'
    ctx.textAlign = 'right'
    ctx.fillText('❥ bot by zeroz', W - 55, footerY + 20)
    
    ctx.fillStyle = THEME.textSecondary
    ctx.font = '9px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(`${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB`, W / 2, H - 12)
    
    return canvas.toBuffer('image/png')
}

// 📊 DATA (diurutkan dari paling miskin)
function getUsersSorted(db) {
    const users = Object.entries(db.data.users || {})
        .map(([jid, u]) => ({
            jid,
            shortJid: jid.split('@')[0],
            name: u.name || u.pushName || jid.split('@')[0],
            koin: u.koin || u.money || u.balance || 0
        }))
    
    // Urutkan dari yang paling SEDIKIT koinnya (paling miskin di atas)
    return users.sort((a, b) => a.koin - b.koin)
}

// 🚀 HANDLER
async function handler(m, { sock }) {
    await m.react('⏳')
    
    try {
        const db = getDatabase()
        const users = getUsersSorted(db)
        
        if (!users.length) {
            await m.react('❌')
            return m.reply('❌ *Data kosong!* Belum ada yang terdaftar nih, darling~ Ayo daftar dulu! 🗿')
        }
        
        const totalKoin = users.reduce((sum, u) => sum + u.koin, 0)
        const poorestUsers = users.slice(0, 10)
        
        // Buat image canvas
        const imageBuffer = await drawLeaderboard(users, totalKoin)
        
        // Caption text untuk yang ga bisa liat gambar
        let caption = `╭━━━〔 💸 *TOP 10 TERMISKIN* 〕━━━⬣\n`
        caption += `┃ *Total Kekayaan:* ${formatRupiah(totalKoin)}\n`
        caption += `┃ *Total Peserta:* ${users.length} orang\n`
        caption += `╰━━━━━━━━━━━━━━━━━━━━━⬣\n\n`
        
        poorestUsers.forEach((u, i) => {
            const medal = i === 0 ? '👑' : i === 1 ? '🥈' : i === 2 ? '🥉' : '💀'
            caption += `${medal} *${i + 1}.* @${u.shortJid}\n`
            caption += `   └ 🪙 ${formatRupiah(u.koin)}\n`
        })
        
        caption += `\n🗿 *Rimuru:* Darling, kasian banget liat mereka~ Jangan sampe kamu masuk list ini ya!\n`
        caption += `💡 *Tips dari Rimuru:* Kerja dikit, nabung, jangan beli skin ML mulu~ 😈`
        
        const mentions = poorestUsers.map(u => u.jid)
        
        await sock.sendMessage(m.chat, {
            image: imageBuffer,
            caption: caption,
            contextInfo: {
                mentionedJid: mentions
            }
        }, { quoted: m })
        
        await m.react('✅')
        
    } catch (error) {
        console.error('[TopMiskin] Error:', error)
        await m.react('❌')
        await m.reply(`❌ *Rimuru:* Error nih darling, coba lagi ya~ ${error.message}`)
    }
}

export { pluginConfig as config, handler };
