/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { Canvas, loadImage, FontLibrary } from 'skia-canvas'
import te from '../../src/lib/elaina-error.js'
FontLibrary.use('CartoonVibes', process.cwd() + '/assets/fonts/Epep.ttf')

async function generate(angka) {
  const bg = await loadImage('https://raw.githubusercontent.com/uploader762/dat3/main/uploads/9c18e0-1772932032348.jpg')
  const logo = await loadImage('https://raw.githubusercontent.com/uploader762/dat3/main/uploads/d0f081-1772929197100.png')

  const canvas = new Canvas(bg.width, bg.height)
  const ctx = canvas.getContext('2d')

  ctx.drawImage(bg, 0, 0)

  ctx.font = '205px CartoonVibes'
  ctx.fillStyle = 'white'
  ctx.textBaseline = 'top'

  const x = 664
  const y = 293

  ctx.fillText(angka, x, y)

  const textWidth = ctx.measureText(angka).width
  const jarak = 11
  const logoSize = 370
  const offsetY = -31

  const logoX = x + textWidth + jarak
  const logoY = y + offsetY

  ctx.drawImage(logo, logoX, logoY, logoSize, logoSize)

  return await canvas.png
}
const pluginConfig = {
    name: 'fakedana',
    alias: ['danafake'],
    category: 'canvas',
    description: 'Membuat gambar fake dana',
    usage: '.fakedana <text>',
    example: '.fakedana Hai cantik',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true
}

async function handler(m, { sock }) {
    const nominal = m.text
    if (!nominal) {
        return m.reply(`*FAKE DANA*\n\n\`Contoh: ${m.prefix}fakedana 10000\``)
    }
    if(isNaN(nominal)) return m.reply(`*HARAP MASUKKAN ANGKA*`)
    m.react('🕕')
    
    try {
        const saldo = Number(nominal.replace(/[^0-9]/g, '')).toLocaleString('id-ID')
        const fake = await generate(saldo)
        await sock.sendMedia(m.chat, fake, null, m, {
            type: 'image',
        })
        m.react('✅')
        
    } catch (error) {
        m.react('☢')
        m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }