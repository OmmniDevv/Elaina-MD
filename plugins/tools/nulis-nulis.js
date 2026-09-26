// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// FIX (2026-09-26): ImageMagick → sharp (npm package, no system dep needed)
import sharp from 'sharp'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const fontPath = join(__dirname, '../src/font/Zahraaa.ttf')
const inputPath = join(__dirname, '../src/kertas/magernulis1.jpg')

let handler = async (m, { conn, args }) => {
    let d = new Date()
    let tgl = d.toLocaleDateString('id-Id')
    let hari = d.toLocaleDateString('id-Id', { weekday: 'long' })
    let teks = args.join(' ')
    if (!teks) throw 'Masukkan teks!'

    try {
        conn.sendMessage(m.chat, { react: { text: '✍️', key: m.key } })

        // Build SVG text overlay
        const svgText = `<svg width="1024" height="784">
  <text x="806" y="78" font-family="serif" font-size="20" fill="black">${hari}</text>
  <text x="806" y="102" font-family="serif" font-size="18" fill="black">${tgl}</text>
  <text x="344" y="142" font-family="serif" font-size="20" fill="black">${teks}</text>
</svg>`

        const buffer = await sharp(inputPath)
            .composite([{
                input: Buffer.from(svgText),
                top: 0,
                left: 0
            }])
            .jpeg({ quality: 90 })
            .toBuffer()

        conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        await conn.sendFile(m.chat, buffer, 'nulis.jpg', 'Hati² ketahuan:v', m)
    } catch (e) {
        conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        throw `❌ Gagal: ${e.message}`
    }
}
handler.help = ['nulis <teks>']
handler.tags = ['tools']
handler.command = /^nulis$/i

export default handler
