// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// FIX (2026-09-26): ImageMagick → sharp (npm package, no system dep needed)
import sharp from 'sharp'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Levelup image
 * @param {String} teks 
 * @param {Number} level 
 * @returns {Promise<Buffer>}
 */
export function levelup(teks, level) {
    return new Promise(async (resolve, reject) => {
        const fontDir = join(__dirname, '../src/font')
        const xtsx = join(__dirname, '../src/lvlup_template.png')

        let anotations = '+1385+260'
        if (level > 2) anotations = '+1370+260'
        if (level > 10) anotations = '+1330+260'
        if (level > 50) anotations = '+1310+260'
        if (level > 100) anotations = '+1260+260'

        const [annoX, annoY] = anotations.replace('+', '').split('+').map(Number)

        try {
            const svgText = `<svg width="1024" height="784">
  <text x="153" y="200" font-family="serif" font-size="68" fill="#0F3E6A">${teks}</text>
  <text x="${annoX}" y="${annoY}" font-family="serif" font-size="140" fill="#0A2A48">${level}</text>
</svg>`

            const buffer = await sharp(xtsx)
                .composite([{
                    input: Buffer.from(svgText),
                    top: 0,
                    left: 0
                }])
                .jpeg({ quality: 90 })
                .toBuffer()

            resolve(buffer)
        } catch (e) {
            reject(e)
        }
    })
}
