/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { createCanvas, loadImage } from '@napi-rs/canvas';
const pluginConfig = {
    name: 'logo-metal',
    alias: ['logometal', 'metallogo', 'steellogo', 'metaltext'],
    category: 'maker',
    description: 'Buat logo dengan efek logam/steel',
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
            return m.reply(`🔩 *CARA PAKAI LOGO METAL* 🔩\n\n1. Dengan teks:\n\`.logo-metal Rimuru\`\n\n2. Dengan gambar + teks:\nReply gambar lalu ketik:\n\`.logo-metal Rimuru\`\n\n3. Hanya gambar:\nReply gambar tanpa teks\n\n*Efek:*\n🔩 Brushed metal\n⚙️ Steel texture\n✨ Chrome highlight`)
        }
        
        // Set default text
        if (!text) text = 'RIMURU'
        
        // Settings
        const width = 800
        const height = 350
        const canvas = createCanvas(width, height)
        const ctx = canvas.getContext('2d')
        
        // 1. BACKGROUND (dark industrial)
        const bgGrad = ctx.createLinearGradient(0, 0, width, height)
        bgGrad.addColorStop(0, '#1a1a1a')
        bgGrad.addColorStop(0.3, '#2d2d2d')
        bgGrad.addColorStop(0.7, '#1a1a1a')
        bgGrad.addColorStop(1, '#0d0d0d')
        ctx.fillStyle = bgGrad
        ctx.fillRect(0, 0, width, height)
        
        // 2. BACKGROUND TEXTURE (brushed metal effect)
        for (let i = 0; i < height; i += 4) {
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.05})`
            ctx.fillRect(0, i, width, 2)
        }
        
        // 3. KALO ADA GAMBAR, JADIKAN BACKGROUND
        if (hasImage && imageBuffer) {
            try {
                const img = await loadImage(imageBuffer)
                ctx.globalAlpha = 0.2
                ctx.drawImage(img, 0, 0, width, height)
                ctx.globalAlpha = 1
            } catch(e) {}
        }
        
        // 4. BORDER INDUSTRIAL
        ctx.strokeStyle = '#555555'
        ctx.lineWidth = 2
        ctx.strokeRect(20, 20, width - 40, height - 40)
        ctx.strokeStyle = '#333333'
        ctx.lineWidth = 1
        ctx.strokeRect(22, 22, width - 44, height - 44)
        
        // 5. RIVET / BULBUL (dekorasi industrial)
        const rivetPositions = [
            [30, 30], [width - 30, 30], [30, height - 30], [width - 30, height - 30],
            [width/2, 30], [width/2, height - 30], [30, height/2], [width - 30, height/2]
        ]
        rivetPositions.forEach(([x, y]) => {
            ctx.beginPath()
            ctx.arc(x, y, 5, 0, Math.PI * 2)
            ctx.fillStyle = '#666666'
            ctx.fill()
            ctx.beginPath()
            ctx.arc(x, y, 3, 0, Math.PI * 2)
            ctx.fillStyle = '#999999'
            ctx.fill()
            ctx.beginPath()
            ctx.arc(x, y, 1.5, 0, Math.PI * 2)
            ctx.fillStyle = '#cccccc'
            ctx.fill()
        })
        
        // 6. EFEK METAL EXTRUDE (layer gelap ke terang)
        const centerX = width / 2
        const centerY = height / 2
        const fontSize = 64
        ctx.font = `bold ${fontSize}px "Segoe UI", "Arial Black", sans-serif`
        ctx.textAlign = 'center'
        
        const textUpper = text.toUpperCase()
        const textWidth = ctx.measureText(textUpper).width
        
        // Layer shadow (efek tebal metal)
        for (let i = 6; i > 0; i--) {
            const offset = i
            const grad = ctx.createLinearGradient(
                centerX - textWidth/2, centerY - fontSize/2,
                centerX + textWidth/2, centerY + fontSize/2
            )
            grad.addColorStop(0, `rgba(0,0,0,${0.3 - i * 0.03})`)
            grad.addColorStop(1, `rgba(50,50,50,${0.2 - i * 0.02})`)
            ctx.fillStyle = grad
            ctx.fillText(textUpper, centerX + offset, centerY + offset + 8)
        }
        
        // 7. LAPISAN METAL UTAMA (gradasi abu-abu metal)
        const metalGrad = ctx.createLinearGradient(
            centerX - textWidth/2 - 20, centerY - fontSize/2 - 10,
            centerX + textWidth/2 + 20, centerY + fontSize/2 + 10
        )
        metalGrad.addColorStop(0, '#e0e0e0')  // highlight
        metalGrad.addColorStop(0.2, '#c0c0c0') // silver
        metalGrad.addColorStop(0.4, '#a0a0a0') // gray
        metalGrad.addColorStop(0.6, '#808080') // dark gray
        metalGrad.addColorStop(0.8, '#999999') // mid
        metalGrad.addColorStop(1, '#707070')   // shadow
        
        ctx.fillStyle = metalGrad
        ctx.fillText(textUpper, centerX, centerY + 8)
        
        // 8. BRUSHED METAL TEXTURE (garis-garis halus di teks)
        ctx.save()
        ctx.globalCompositeOperation = 'source-atop'
        for (let i = 0; i < 30; i++) {
            const y = centerY - fontSize/2 + (i * (fontSize / 30))
            ctx.beginPath()
            ctx.moveTo(centerX - textWidth/2 - 10, y)
            ctx.lineTo(centerX + textWidth/2 + 10, y)
            ctx.strokeStyle = `rgba(255,255,255,${Math.random() * 0.15})`
            ctx.lineWidth = 1
            ctx.stroke()
        }
        ctx.restore()
        
        // 9. HIGHLIGHT (efek cahaya metal)
        ctx.shadowBlur = 0
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
        ctx.fillText(textUpper, centerX - 1, centerY + 7)
        
        // 10. STROKE GELAP (biar tegas)
        ctx.strokeStyle = '#333333'
        ctx.lineWidth = 2
        ctx.strokeText(textUpper, centerX, centerY + 8)
        
        // 11. STROKE TERANG (edge highlight)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.lineWidth = 1
        ctx.strokeText(textUpper, centerX - 0.5, centerY + 7.5)
        
        // 12. SCREW TEXTURE (di sudut-sudut teks)
        const screwPos = [
            { x: centerX - textWidth/2 - 15, y: centerY - fontSize/2 - 5 },
            { x: centerX + textWidth/2 + 15, y: centerY - fontSize/2 - 5 },
            { x: centerX - textWidth/2 - 15, y: centerY + fontSize/2 + 5 },
            { x: centerX + textWidth/2 + 15, y: centerY + fontSize/2 + 5 }
        ]
        
        screwPos.forEach(pos => {
            ctx.beginPath()
            ctx.arc(pos.x, pos.y, 6, 0, Math.PI * 2)
            ctx.fillStyle = '#555555'
            ctx.fill()
            ctx.beginPath()
            ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2)
            ctx.fillStyle = '#888888'
            ctx.fill()
            ctx.beginPath()
            ctx.moveTo(pos.x - 3, pos.y)
            ctx.lineTo(pos.x + 3, pos.y)
            ctx.moveTo(pos.x, pos.y - 3)
            ctx.lineTo(pos.x, pos.y + 3)
            ctx.strokeStyle = '#333333'
            ctx.lineWidth = 1.5
            ctx.stroke()
        })
        
        // 13. TAGLINE
        ctx.font = '11px monospace'
        ctx.fillStyle = '#888888'
        ctx.fillText('⚙️ BRUSHED METAL EFFECT ⚙️', centerX, height - 35)
        
        ctx.font = '9px monospace'
        ctx.fillStyle = '#666666'
        ctx.fillText('rimuru maker • steel logo generator', centerX, height - 20)
        
        // 14. WATERMARK INDUSTRIAL
        ctx.font = '8px monospace'
        ctx.fillStyle = '#444444'
        ctx.fillText('METAL SERIES • v1.0', width - 120, height - 12)
        
        // Kirim hasil
        const buffer = canvas.toBuffer('image/png')
        
        await sock.sendMessage(m.chat, {
            image: buffer,
            caption: `🔩 *METAL LOGO MAKER* 🔩\n\n╭─❍「 DETAIL 」\n│ 📝 Teks: ${textUpper}\n│ 🎨 Efek: Brushed Metal / Steel\n│ ⚙️ Texture: Industrial Style\n│ 🔧 Layer: 6 depth layers\n╰─────────────❍\n\n💗 *Rimuru*: Logo metal untuk sayang yang kuat~`
        }, { quoted: m })
        
    } catch (error) {
        console.error(error)
        await m.reply(`💔 *Error sayang!*\n\n${error.message}`)
    }
}

export { pluginConfig as config, handler };
