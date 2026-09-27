/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { createCanvas, loadImage } from '@napi-rs/canvas';
const pluginConfig = {
    name: 'logo-3d',
    alias: ['logo3d', '3dlogo', '3dtext'],
    category: 'maker',
    description: 'Buat logo dengan efek 3D pop out',
    cooldown: 5,
    isEnabled: true
}

async function handler(m, { sock }) {
    try {
        // Ambil teks dari command
        let text = m.text.split(' ').slice(1).join(' ')
        
        // Cek apakah reply gambar
        const quoted = m.quoted || m
        let hasImage = false
        let imageBuffer = null
        
        if (quoted.message?.imageMessage) {
            hasImage = true
            imageBuffer = await quoted.download()
        }
        
        // Kalo gak ada gambar dan gak ada teks
        if (!hasImage && !text) {
            return m.reply(`✨ *CARA PAKAI LOGO 3D* ✨\n\n1. Dengan teks:\n\`.logo-3d Rimuru\`\n\n2. Dengan gambar + teks:\nReply gambar lalu ketik:\n\`.logo-3d Rimuru\`\n\n3. Hanya gambar:\nReply gambar tanpa teks\n\n*Efek:*\n🔥 3D Extrude\n💗 Shadow depth\n🎨 Gradient warna`)
        }
        
        // Set default text
        if (!text) text = 'RIMURU'
        
        // Settings
        const width = 800
        const height = 400
        const canvas = createCanvas(width, height)
        const ctx = canvas.getContext('2d')
        
        // Warna gradient untuk 3D effect
        const colors = {
            pink: { light: '#ff6b9d', dark: '#c41e3a', mid: '#ff2a6d' },
            blue: { light: '#4facfe', dark: '#00f2fe', mid: '#3b82f6' },
            purple: { light: '#c084fc', dark: '#7c3aed', mid: '#a855f7' },
            gold: { light: '#fbbf24', dark: '#d97706', mid: '#f59e0b' },
            red: { light: '#f87171', dark: '#dc2626', mid: '#ef4444' },
            green: { light: '#34d399', dark: '#059669', mid: '#10b981' }
        }
        
        // Pilih warna berdasarkan teks
        let selectedColor = colors.pink
        if (text.toLowerCase().includes('blue')) selectedColor = colors.blue
        else if (text.toLowerCase().includes('purple')) selectedColor = colors.purple
        else if (text.toLowerCase().includes('gold')) selectedColor = colors.gold
        else if (text.toLowerCase().includes('red')) selectedColor = colors.red
        else if (text.toLowerCase().includes('green')) selectedColor = colors.green
        
        // 1. BACKGROUND
        const bgGrad = ctx.createLinearGradient(0, 0, width, height)
        bgGrad.addColorStop(0, '#0f0c1a')
        bgGrad.addColorStop(0.5, '#1a1535')
        bgGrad.addColorStop(1, '#0f0c1a')
        ctx.fillStyle = bgGrad
        ctx.fillRect(0, 0, width, height)
        
        // 2. KALO ADA GAMBAR, JADIKAN BACKGROUND BLUR
        if (hasImage && imageBuffer) {
            try {
                const img = await loadImage(imageBuffer)
                ctx.globalAlpha = 0.25
                ctx.drawImage(img, 0, 0, width, height)
                ctx.globalAlpha = 1
            } catch(e) {}
        }
        
        // 3. GARIS GRID 3D (efek kedalaman)
        ctx.globalAlpha = 0.1
        ctx.strokeStyle = selectedColor.light
        ctx.lineWidth = 0.5
        for (let i = 0; i < width; i += 50) {
            ctx.beginPath()
            ctx.moveTo(i, 0)
            ctx.lineTo(i, height)
            ctx.stroke()
        }
        for (let i = 0; i < height; i += 50) {
            ctx.beginPath()
            ctx.moveTo(0, i)
            ctx.lineTo(width, i)
            ctx.stroke()
        }
        ctx.globalAlpha = 1
        
        // 4. EFEK 3D EXTRUDE (layer kedalaman)
        const centerX = width / 2
        const centerY = height / 2
        const fontSize = 68
        ctx.font = `bold ${fontSize}px "Segoe UI", "Arial Black", sans-serif`
        ctx.textAlign = 'center'
        
        // Hitung lebar teks untuk shadow yang pas
        const textWidth = ctx.measureText(text.toUpperCase()).width
        
        // LAPISAN SHADOW 3D (extrude)
        const depth = 12
        for (let i = depth; i > 0; i--) {
            ctx.shadowBlur = 0
            const offset = i * 2
            const alpha = 1 - (i / depth) * 0.7
            
            // Gradient untuk setiap layer
            const grad = ctx.createLinearGradient(
                centerX - textWidth/2 - 10, centerY - fontSize/2,
                centerX + textWidth/2 + 10, centerY + fontSize/2
            )
            grad.addColorStop(0, selectedColor.dark)
            grad.addColorStop(1, selectedColor.mid)
            
            ctx.fillStyle = grad
            ctx.globalAlpha = alpha * 0.5
            ctx.fillText(text.toUpperCase(), centerX + offset, centerY + offset + 10)
        }
        
        // 5. LAPISAN UTAMA (front face)
        ctx.globalAlpha = 1
        ctx.shadowBlur = 15
        ctx.shadowColor = selectedColor.light
        
        // Gradient untuk face depan
        const frontGrad = ctx.createLinearGradient(
            centerX - textWidth/2, centerY - fontSize/2,
            centerX + textWidth/2, centerY + fontSize/2
        )
        frontGrad.addColorStop(0, selectedColor.light)
        frontGrad.addColorStop(0.5, selectedColor.mid)
        frontGrad.addColorStop(1, selectedColor.dark)
        
        ctx.fillStyle = frontGrad
        ctx.fillText(text.toUpperCase(), centerX, centerY + 10)
        
        // 6. HIGHLIGHT (efek cahaya di atas)
        ctx.shadowBlur = 8
        ctx.shadowColor = '#ffffff'
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.fillText(text.toUpperCase(), centerX - 2, centerY + 8)
        
        // 7. OUTLINE / STROKE
        ctx.shadowBlur = 0
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 2
        ctx.strokeText(text.toUpperCase(), centerX, centerY + 10)
        
        // 8. EFEK PERSPEKTIF (bayangan bawah)
        ctx.shadowBlur = 0
        ctx.globalAlpha = 0.3
        ctx.fillStyle = '#000000'
        ctx.fillText(text.toUpperCase(), centerX + 5, centerY + fontSize - 5)
        ctx.globalAlpha = 1
        
        // 9. DEKORASI SUDUT 3D
        ctx.shadowBlur = 5
        ctx.shadowColor = selectedColor.light
        ctx.strokeStyle = selectedColor.mid
        ctx.lineWidth = 3
        
        // Sudut kiri atas
        ctx.beginPath()
        ctx.moveTo(30, 50)
        ctx.lineTo(70, 50)
        ctx.lineTo(70, 30)
        ctx.stroke()
        
        // Sudut kanan atas
        ctx.beginPath()
        ctx.moveTo(width - 30, 50)
        ctx.lineTo(width - 70, 50)
        ctx.lineTo(width - 70, 30)
        ctx.stroke()
        
        // Sudut kiri bawah
        ctx.beginPath()
        ctx.moveTo(30, height - 50)
        ctx.lineTo(70, height - 50)
        ctx.lineTo(70, height - 30)
        ctx.stroke()
        
        // Sudut kanan bawah
        ctx.beginPath()
        ctx.moveTo(width - 30, height - 50)
        ctx.lineTo(width - 70, height - 50)
        ctx.lineTo(width - 70, height - 30)
        ctx.stroke()
        
        // 10. SHADOW DROPS (efek particles)
        for (let i = 0; i < 30; i++) {
            ctx.fillStyle = selectedColor.mid + Math.floor(Math.random() * 40 + 20).toString(16)
            ctx.beginPath()
            ctx.arc(
                centerX - textWidth/2 + Math.random() * textWidth,
                centerY + fontSize/2 + Math.random() * 40,
                Math.random() * 3 + 1,
                0, Math.PI * 2
            )
            ctx.fill()
        }
        
        // 11. TAGLINE 3D
        ctx.shadowBlur = 3
        ctx.font = '12px monospace'
        ctx.fillStyle = selectedColor.light
        ctx.fillText('⚡ 3D EXTRUDE EFFECT ⚡', centerX, height - 25)
        
        ctx.font = '9px monospace'
        ctx.fillStyle = '#888888'
        ctx.fillText('rimuru maker • 3d logo generator', centerX, height - 12)
        
        // Reset shadow
        ctx.shadowBlur = 0
        
        // Kirim hasil
        const buffer = canvas.toBuffer('image/png')
        
        let colorName = 'pink'
        if (text.toLowerCase().includes('blue')) colorName = 'blue'
        else if (text.toLowerCase().includes('purple')) colorName = 'purple'
        else if (text.toLowerCase().includes('gold')) colorName = 'gold'
        else if (text.toLowerCase().includes('red')) colorName = 'red'
        else if (text.toLowerCase().includes('green')) colorName = 'green'
        
        await sock.sendMessage(m.chat, {
            image: buffer,
            caption: `✨ *3D LOGO MAKER* ✨\n\n╭─❍「 DETAIL 」\n│ 📝 Teks: ${text.toUpperCase()}\n│ 🎨 Warna: ${colorName}\n│ 🎭 Efek: 3D Extrude + Shadow Depth\n│ 📐 Depth: 12 layer\n╰─────────────❍\n\n💗 *Rimuru*: Logo 3D untuk sayang~`
        }, { quoted: m })
        
    } catch (error) {
        console.error(error)
        await m.reply(`💔 *Error sayang!*\n\n${error.message}`)
    }
}

export { pluginConfig as config, handler };
