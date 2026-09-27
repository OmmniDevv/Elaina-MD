/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import canvas from '@napi-rs/canvas';
const { createCanvas, loadImage } = canvas;
import path from 'path';
const pluginConfig = {
    name: 'logo-glow',
    alias: ['logoglow', 'neonlogo', 'glowlogo'],
    category: 'maker',
    description: 'Buat logo dengan efek neon glow',
    cooldown: 5,
    isEnabled: true
}

async function handler(m, { sock }) {
    try {
        // Ambil teks dari command
        let text = m.text.split(' ').slice(1).join(' ')
        
        // Cek apakah reply gambar atau teks biasa
        const quoted = m.quoted || m
        let hasImage = false
        let imageBuffer = null
        
        if (quoted.message?.imageMessage) {
            hasImage = true
            imageBuffer = await quoted.download()
        }
        
        // Kalo gak ada gambar dan gak ada teks
        if (!hasImage && !text) {
            return m.reply(`✨ *CARA PAKAI LOGO GLOW* ✨\n\n1. Dengan teks:\n\`.logo-glow Rimuru\`\n\n2. Dengan gambar + teks:\nReply gambar lalu ketik:\n\`.logo-glow Rimuru\`\n\n3. Hanya gambar:\nReply gambar tanpa teks\n\n*Contoh efek:*\n🔥 Neon glow\n💗 Pink neon\n💙 Blue neon`)
        }
        
        // Set default text kalo gak ada
        if (!text) text = 'RIMURU'
        
        // Settings
        const width = 800
        const height = 300
        const canvas = createCanvas(width, height)
        const ctx = canvas.getContext('2d')
        
        // GLOW COLORS
        const glowColors = {
            pink: '#ff2a6d',
            blue: '#00d4ff',
            purple: '#a855f7',
            green: '#10b981',
            yellow: '#fbbf24',
            red: '#ef4444',
            cyan: '#06b6d4'
        }
        
        // Pilih warna random atau berdasarkan teks
        let glowColor = glowColors.pink
        if (text.toLowerCase().includes('blue')) glowColor = glowColors.blue
        else if (text.toLowerCase().includes('purple')) glowColor = glowColors.purple
        else if (text.toLowerCase().includes('green')) glowColor = glowColors.green
        else if (text.toLowerCase().includes('yellow')) glowColor = glowColors.yellow
        else if (text.toLowerCase().includes('red')) glowColor = glowColors.red
        else if (text.toLowerCase().includes('cyan')) glowColor = glowColors.cyan
        
        // 1. BACKGROUND (gradient gelap)
        const gradient = ctx.createLinearGradient(0, 0, width, height)
        gradient.addColorStop(0, '#0a0a1a')
        gradient.addColorStop(0.5, '#1a1a2e')
        gradient.addColorStop(1, '#0a0a1a')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)
        
        // 2. KALO ADA GAMBAR, JADIKAN BACKGROUND
        if (hasImage && imageBuffer) {
            try {
                const img = await loadImage(imageBuffer)
                ctx.globalAlpha = 0.3
                ctx.drawImage(img, 0, 0, width, height)
                ctx.globalAlpha = 1
            } catch(e) {}
        }
        
        // 3. DECORATIVE DOTS (efek bintang neon)
        for (let i = 0; i < 150; i++) {
            ctx.fillStyle = glowColor + Math.floor(Math.random() * 50 + 30).toString(16)
            ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2)
        }
        
        // 4. GARIS NEON ATAS & BAWAH
        ctx.shadowBlur = 15
        ctx.shadowColor = glowColor
        ctx.strokeStyle = glowColor
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(50, 40)
        ctx.lineTo(width - 50, 40)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(50, height - 40)
        ctx.lineTo(width - 50, height - 40)
        ctx.stroke()
        
        // 5. TEXT GLOW - LAPISAN 1 (blur tebal)
        ctx.shadowBlur = 30
        ctx.shadowColor = glowColor
        ctx.font = `bold 72px "Segoe UI", "Arial Black", sans-serif`
        ctx.textAlign = 'center'
        ctx.fillStyle = glowColor
        ctx.fillText(text.toUpperCase(), width/2 + 2, height/2 + 2)
        
        // 6. TEXT GLOW - LAPISAN 2 (blur sedang)
        ctx.shadowBlur = 15
        ctx.fillStyle = glowColor
        ctx.fillText(text.toUpperCase(), width/2 + 1, height/2 + 1)
        
        // 7. TEXT GLOW - LAPISAN 3 (core, putih bersih)
        ctx.shadowBlur = 8
        ctx.fillStyle = '#ffffff'
        ctx.fillText(text.toUpperCase(), width/2, height/2)
        
        // 8. SUBTITLE / TAGLINE
        ctx.shadowBlur = 5
        ctx.font = '14px monospace'
        ctx.fillStyle = glowColor
        ctx.fillText('⚡ RIMURU MAKER ⚡', width/2, height - 20)
        
        ctx.font = '10px monospace'
        ctx.fillStyle = '#888'
        ctx.fillText('glow effect • neon style', width/2, height - 8)
        
        // 9. RESET SHADOW
        ctx.shadowBlur = 0
        
        // 10. CORNER DECORATION
        const cornerSize = 20
        ctx.strokeStyle = glowColor
        ctx.lineWidth = 3
        // Top-left
        ctx.beginPath()
        ctx.moveTo(20, 40)
        ctx.lineTo(40, 40)
        ctx.lineTo(40, 20)
        ctx.stroke()
        // Top-right
        ctx.beginPath()
        ctx.moveTo(width - 20, 40)
        ctx.lineTo(width - 40, 40)
        ctx.lineTo(width - 40, 20)
        ctx.stroke()
        // Bottom-left
        ctx.beginPath()
        ctx.moveTo(20, height - 40)
        ctx.lineTo(40, height - 40)
        ctx.lineTo(40, height - 20)
        ctx.stroke()
        // Bottom-right
        ctx.beginPath()
        ctx.moveTo(width - 20, height - 40)
        ctx.lineTo(width - 40, height - 40)
        ctx.lineTo(width - 40, height - 20)
        ctx.stroke()
        
        // Kirim hasil
        const buffer = canvas.toBuffer('image/png')
        
        await sock.sendMessage(m.chat, {
            image: buffer,
            caption: `✨ *NEON LOGO MAKER* ✨\n\n╭─❍「 DETAIL 」\n│ 📝 Teks: ${text.toUpperCase()}\n│ 🎨 Warna: ${Object.entries(glowColors).find(([k,v]) => v === glowColor)?.[0] || 'pink'}\n│ ⚡ Efek: Neon Glow\n╰─────────────❍\n\n💗 *Rimuru*: Ini untuk sayang~`
        }, { quoted: m })
        
    } catch (error) {
        console.error(error)
        await m.reply(`💔 *Error sayang!*\n\n${error.message}`)
    }
}

export { pluginConfig as config, handler };
