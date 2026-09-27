/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { createCanvas, loadImage } from '@napi-rs/canvas';
const pluginConfig = {
    name: 'logo-gold',
    alias: ['logogold', 'goldlogo', 'goldtext', 'emastulisan'],
    category: 'maker',
    description: 'Buat logo dengan efek emas mewah (gold premium)',
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
            return m.reply(`👑 *CARA PAKAI LOGO GOLD* 👑\n\n1. Dengan teks:\n\`.logo-gold Rimuru\`\n\n2. Dengan gambar + teks:\nReply gambar lalu ketik:\n\`.logo-gold Rimuru\`\n\n3. Hanya gambar:\nReply gambar tanpa teks\n\n*Efek:*\n👑 Premium gold gradient\n✨ Gold glitter effect\n💎 Luxury shine`)
        }
        
        // Set default text
        if (!text) text = 'RIMURU'
        
        // Settings
        const width = 800
        const height = 350
        const canvas = createCanvas(width, height)
        const ctx = canvas.getContext('2d')
        
        // 1. BACKGROUND (premium dark gradient)
        const bgGrad = ctx.createLinearGradient(0, 0, width, height)
        bgGrad.addColorStop(0, '#0a0a0a')
        bgGrad.addColorStop(0.3, '#1a0f0a')
        bgGrad.addColorStop(0.7, '#0a0505')
        bgGrad.addColorStop(1, '#000000')
        ctx.fillStyle = bgGrad
        ctx.fillRect(0, 0, width, height)
        
        // 2. BACKGROUND DECORATION (subtle sparkle)
        for (let i = 0; i < 200; i++) {
            const sparkle = Math.random()
            if (sparkle > 0.98) {
                ctx.fillStyle = `rgba(255, 215, 0, ${Math.random() * 0.5})`
                ctx.beginPath()
                ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2, 0, Math.PI * 2)
                ctx.fill()
            }
        }
        
        // 3. KALO ADA GAMBAR, JADIKAN BACKGROUND (dengan efek premium)
        if (hasImage && imageBuffer) {
            try {
                const img = await loadImage(imageBuffer)
                ctx.globalAlpha = 0.15
                ctx.drawImage(img, 0, 0, width, height)
                ctx.globalAlpha = 1
            } catch(e) {}
        }
        
        // 4. PREMIUM BORDER (double border emas)
        ctx.strokeStyle = '#FFD700'
        ctx.lineWidth = 2
        ctx.strokeRect(15, 15, width - 30, height - 30)
        
        ctx.strokeStyle = '#DAA520'
        ctx.lineWidth = 1
        ctx.strokeRect(20, 20, width - 40, height - 40)
        
        // 5. CORNER DECORATION (ornamen sudut)
        const ornamentPos = [
            { x: 20, y: 20 }, { x: width - 20, y: 20 },
            { x: 20, y: height - 20 }, { x: width - 20, y: height - 20 }
        ]
        ornamentPos.forEach(pos => {
            ctx.beginPath()
            ctx.moveTo(pos.x - 10, pos.y)
            ctx.lineTo(pos.x, pos.y)
            ctx.lineTo(pos.x, pos.y - 10)
            ctx.strokeStyle = '#FFD700'
            ctx.lineWidth = 2
            ctx.stroke()
            
            ctx.beginPath()
            ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2)
            ctx.fillStyle = '#FFD700'
            ctx.fill()
            ctx.beginPath()
            ctx.arc(pos.x, pos.y, 2, 0, Math.PI * 2)
            ctx.fillStyle = '#B8860B'
            ctx.fill()
        })
        
        // 6. EFEK GOLD EXTRUDE (layer gelap ke terang)
        const centerX = width / 2
        const centerY = height / 2
        const fontSize = 62
        ctx.font = `bold ${fontSize}px "Segoe UI", "Arial Black", sans-serif`
        ctx.textAlign = 'center'
        
        const textUpper = text.toUpperCase()
        const textWidth = ctx.measureText(textUpper).width
        
        // Layer shadow (efek tebal emas)
        for (let i = 8; i > 0; i--) {
            const offset = i * 1.5
            const goldDarkGrad = ctx.createLinearGradient(
                centerX - textWidth/2, centerY - fontSize/2,
                centerX + textWidth/2, centerY + fontSize/2
            )
            goldDarkGrad.addColorStop(0, `rgba(139, 69, 19, ${0.2 - i * 0.015})`)
            goldDarkGrad.addColorStop(1, `rgba(101, 67, 33, ${0.15 - i * 0.01})`)
            ctx.fillStyle = goldDarkGrad
            ctx.fillText(textUpper, centerX + offset, centerY + offset + 8)
        }
        
        // 7. LAPISAN EMAS UTAMA (gradasi gold premium)
        const goldGrad = ctx.createLinearGradient(
            centerX - textWidth/2 - 20, centerY - fontSize/2 - 10,
            centerX + textWidth/2 + 20, centerY + fontSize/2 + 10
        )
        // Warna emas mewah (7 layer gradient)
        goldGrad.addColorStop(0, '#FFF8DC')  // light gold (paling terang)
        goldGrad.addColorStop(0.15, '#FFD700') // gold
        goldGrad.addColorStop(0.3, '#FFC125')  // goldenrod
        goldGrad.addColorStop(0.45, '#DAA520') // darker gold
        goldGrad.addColorStop(0.6, '#B8860B')  // dark goldenrod
        goldGrad.addColorStop(0.75, '#DAA520')
        goldGrad.addColorStop(0.9, '#FFD700')
        goldGrad.addColorStop(1, '#FFC125')
        
        ctx.fillStyle = goldGrad
        ctx.fillText(textUpper, centerX, centerY + 8)
        
        // 8. GOLD GLITTER TEXTURE (efek berkilau)
        ctx.save()
        ctx.globalCompositeOperation = 'source-atop'
        for (let i = 0; i < 150; i++) {
            const glitterX = centerX - textWidth/2 - 10 + Math.random() * (textWidth + 20)
            const glitterY = centerY - fontSize/2 + Math.random() * fontSize
            ctx.fillStyle = `rgba(255, 255, 200, ${Math.random() * 0.6})`
            ctx.beginPath()
            ctx.arc(glitterX, glitterY, Math.random() * 2, 0, Math.PI * 2)
            ctx.fill()
        }
        ctx.restore()
        
        // 9. HIGHLIGHT EFEK SINAR
        ctx.fillStyle = 'rgba(255, 255, 200, 0.5)'
        ctx.fillText(textUpper, centerX - 2, centerY + 6)
        
        // 10. STROKE EMAS GELAP (biar tegas)
        ctx.strokeStyle = '#B8860B'
        ctx.lineWidth = 2
        ctx.strokeText(textUpper, centerX, centerY + 8)
        
        // 11. STROKE TERANG (edge highlight gold)
        ctx.strokeStyle = 'rgba(255, 250, 210, 0.6)'
        ctx.lineWidth = 1
        ctx.strokeText(textUpper, centerX - 0.5, centerY + 7.5)
        
        // 12. EFREK 3D EMBOSS (bayangan dalam)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
        ctx.fillText(textUpper, centerX + 1, centerY + 9)
        
        // 13. CROWN DECORATION (mahkota kecil di atas teks)
        const crownX = centerX
        const crownY = centerY - fontSize/2 - 15
        ctx.beginPath()
        ctx.moveTo(crownX - 20, crownY + 10)
        ctx.lineTo(crownX - 10, crownY)
        ctx.lineTo(crownX, crownY + 8)
        ctx.lineTo(crownX + 10, crownY)
        ctx.lineTo(crownX + 20, crownY + 10)
        ctx.fillStyle = '#FFD700'
        ctx.fill()
        ctx.beginPath()
        ctx.arc(crownX, crownY + 3, 3, 0, Math.PI * 2)
        ctx.fillStyle = '#FFC125'
        ctx.fill()
        
        // 14. DIAMOND DECORATION (intan di bawah teks)
        const diamondX = centerX
        const diamondY = centerY + fontSize/2 + 15
        ctx.beginPath()
        ctx.moveTo(diamondX, diamondY - 8)
        ctx.lineTo(diamondX + 6, diamondY)
        ctx.lineTo(diamondX, diamondY + 8)
        ctx.lineTo(diamondX - 6, diamondY)
        ctx.fillStyle = '#E0FFFF'
        ctx.fill()
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
        ctx.beginPath()
        ctx.moveTo(diamondX, diamondY - 4)
        ctx.lineTo(diamondX + 3, diamondY)
        ctx.lineTo(diamondX, diamondY + 4)
        ctx.lineTo(diamondX - 3, diamondY)
        ctx.fill()
        
        // 15. GOLD TEXTURE LINES (garis emas horizontal)
        ctx.beginPath()
        ctx.moveTo(width/2 - 150, height - 50)
        ctx.lineTo(width/2 + 150, height - 50)
        ctx.strokeStyle = '#DAA520'
        ctx.lineWidth = 1
        ctx.stroke()
        
        ctx.beginPath()
        ctx.moveTo(width/2 - 120, height - 48)
        ctx.lineTo(width/2 + 120, height - 48)
        ctx.strokeStyle = '#FFD700'
        ctx.lineWidth = 0.5
        ctx.stroke()
        
        // 16. TAGLINE PREMIUM
        ctx.font = 'bold 11px monospace'
        ctx.fillStyle = '#DAA520'
        ctx.fillText('✦ PREMIUM GOLD EDITION ✦', centerX, height - 35)
        
        ctx.font = '9px monospace'
        ctx.fillStyle = '#B8860B'
        ctx.fillText('rimuru maker • luxury gold logo generator', centerX, height - 20)
        
        // 17. WATERMARK PREMIUM
        ctx.font = '8px monospace'
        ctx.fillStyle = '#8B6914'
        ctx.fillText('GOLD SERIES • PREMIUM', width - 130, height - 12)
        
        // Kirim hasil
        const buffer = canvas.toBuffer('image/png')
        
        await sock.sendMessage(m.chat, {
            image: buffer,
            caption: `👑 *GOLD LOGO MAKER* 👑\n\n╭─❍「 DETAIL 」\n│ 📝 Teks: ${textUpper}\n│ 🎨 Efek: Premium Gold / Emas Mewah\n│ ✨ Texture: Gold Glitter + 7 Layer Gradient\n│ 👑 Decor: Crown + Diamond Ornament\n╰─────────────❍\n\n💗 *Rimuru*: Logo emas premium untuk sayang tersayang~`
        }, { quoted: m })
        
    } catch (error) {
        console.error(error)
        await m.reply(`💔 *Error sayang!*\n\n${error.message}`)
    }
}

export { pluginConfig as config, handler };
