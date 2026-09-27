/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import config from '../../config.js';
import { createCanvas, GlobalFonts, loadImage } from '@napi-rs/canvas';
import * as https from 'node:https';
import * as path from 'node:path';
import * as fs from 'node:fs';

const pluginConfig = {
    name: 'iqcv3',
    alias: ['buatgambar', 'iqc-v3'],
    category: 'image',
    description: 'Generate gambar IQC dengan nama custom',
    usage: '.iqc <nama> <waktu>',
    example: '.iqc "mie ayam" 13.56',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 2,
    isEnabled: true
}

// Konfigurasi dan utility functions dari kode asli
const ROOT_DIR = process.cwd()
const OUTPUT_DIR = path.resolve(ROOT_DIR, 'temp', 'iqc')
const ASSETS_DIR = path.join(ROOT_DIR, 'assets')
const FONTS_DIR = path.join(ASSETS_DIR, 'fonts')
const BG_DIR = path.join(ASSETS_DIR, 'backgrounds')
const IMG_DIR = path.join(ASSETS_DIR, 'images')

const REMOTE_ASSETS = [
    {
        url: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Font/SFPRODISPLAYREGULAR.OTF',
        dest: path.join(FONTS_DIR, 'SFPRODISPLAYREGULAR.OTF'),
    },
    {
        url: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Font/SFPRODISPLAYSEMIBOLD.ttf',
        dest: path.join(FONTS_DIR, 'SFPRODISPLAYSEMIBOLD.ttf'),
    },
    {
        url: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Image/bg.jpg',
        dest: path.join(BG_DIR, 'bg.jpg'),
    },
    {
        url: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Image/artworks-gWLRE6HyPH3DgVMG-ZFFxtg-t500x500.jpg',
        dest: path.join(IMG_DIR, 'photo.jpg'),
    },
]

const WA_COLORS = [
    '#E53935', '#D81B60', '#8E24AA', '#5E35B1',
    '#1E88E5', '#039BE5', '#00897B', '#43A047',
    '#F4511E', '#FB8C00',
]

const COLOR_FILE = path.join(ROOT_DIR, 'temp', '.iqc_color_index')

function getNextColor() {
    let idx = 0
    if (fs.existsSync(COLOR_FILE)) {
        idx = parseInt(fs.readFileSync(COLOR_FILE, 'utf8')) || 0
    }
    const color = WA_COLORS[idx % WA_COLORS.length]
    fs.writeFileSync(COLOR_FILE, String((idx + 1) % WA_COLORS.length))
    return color
}

const canvasConfig = {
    canvas: { width: 1920, height: 3413 },
    safeZones: {
        namaAtas: {
            a: 980, b: 1080, c: 250, d: 630,
            label: 'nama atas', color: 'rgba(255, 80, 80, 0.9)',
            fontSize: 55, maxChars: 25,
            font: 'SFProSemiBold', align: 'left',
        },
        foto: {
            a: 1125, b: 1713, c: 240, d: 830,
            label: 'foto', color: 'rgba(80, 200, 120, 0.9)',
            radius: 28,
        },
        waktu: {
            a: 1750, b: 1860, c: 233, d: 424,
            label: 'waktu', color: 'rgba(80, 160, 255, 0.9)',
            fontSize: 45, maxChars: 10,
            font: 'SFProRegular', textColor: '#555555', align: 'center',
        },
        namaBawah: {
            a: 2701, b: 2880, c: 700, d: 1160,
            centerY: 2787,
            label: 'nama bawah', color: 'rgba(255, 200, 0, 0.9)',
            fontSize: 67, maxChars: 25,
            font: 'SFProSemiBold', textColor: '#100e0e', align: 'left',
        },
    },
    debug: false,
}

function download(url, dest) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
            return resolve()
        }
        fs.mkdirSync(path.dirname(dest), { recursive: true })
        const file = fs.createWriteStream(dest)
        https.get(url, res => {
            if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
                file.close(() => {
                    if (fs.existsSync(dest)) fs.unlinkSync(dest)
                    download(res.headers.location, dest).then(resolve).catch(reject)
                })
                return
            }
            if (res.statusCode !== 200) {
                file.close(() => {
                    if (fs.existsSync(dest)) fs.unlinkSync(dest)
                    reject(new Error(`HTTP ${res.statusCode} untuk ${url}`))
                })
                return
            }
            res.pipe(file)
            file.on('finish', () => {
                file.close(() => {
                    if (!fs.existsSync(dest) || fs.statSync(dest).size <= 0) {
                        return reject(new Error(`Asset gagal disimpan: ${dest}`))
                    }
                    resolve()
                })
            })
        }).on('error', err => {
            file.close(() => {
                if (fs.existsSync(dest)) fs.unlinkSync(dest)
                reject(err)
            })
        })
    })
}

async function downloadAll() {
    for (const asset of REMOTE_ASSETS) {
        await download(asset.url, asset.dest)
    }
}

function findFontFile(dir, basenames) {
    if (!fs.existsSync(dir)) return null
    const files = fs.readdirSync(dir)
    for (const base of basenames) {
        const match = files.find(f => f.toLowerCase() === base.toLowerCase())
        if (match) return path.join(dir, match)
    }
    return null
}

function registerFont(family, ...basenames) {
    const file = findFontFile(FONTS_DIR, basenames)
    if (!file) {
        throw new Error(`Font tidak ditemukan: "${family}" di folder ${FONTS_DIR}`)
    }
    GlobalFonts.registerFromPath(file, family)
}

let fontsLoaded = false

function loadFonts() {
    if (fontsLoaded) return
    registerFont('SFProSemiBold', 'SFPRODISPLAYSEMIBOLD.TTF', 'SFPRODISPLAYSEMIBOLD.OTF')
    registerFont('SFProRegular', 'SFPRODISPLAYREGULAR.OTF', 'SFPRODISPLAYREGULAR.TTF')
    fontsLoaded = true
}

function roundedClipPath(ctx, x, y, w, h, r) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
}

function drawText(ctx, text, zone, textColor) {
    const { a, b, c, d, fontSize, maxChars, font, align, fontWeight, centerY } = zone
    const str = String(text).slice(0, maxChars)
    const boxW = d - c
    const cy = centerY !== undefined ? centerY : a + (b - a) / 2
    const weight = fontWeight || (font === 'SFProSemiBold' ? 'bold' : 'normal')
    let size = fontSize
    ctx.textBaseline = 'middle'
    while (size > 12) {
        ctx.font = `${weight} ${size}px ${font}`
        if (ctx.measureText(str).width <= boxW) break
        size -= 1
    }
    ctx.font = `${weight} ${size}px ${font}`
    ctx.fillStyle = textColor
    if (align === 'center') {
        ctx.textAlign = 'center'
        ctx.fillText(str, c + boxW / 2, cy)
    } else {
        ctx.textAlign = 'left'
        ctx.fillText(str, c, cy)
    }
}

async function drawFoto(ctx, imagePath, zone) {
    const { a, b, c, d, radius } = zone
    const x = c
    const y = a
    const w = d - c
    const h = b - a
    const r = radius || 28
    const img = await loadImage(imagePath)
    const imgRatio = img.width / img.height
    const boxRatio = w / h
    ctx.save()
    roundedClipPath(ctx, x, y, w, h, r)
    ctx.clip()
    ctx.filter = 'blur(28px)'
    ctx.drawImage(img, x - 40, y - 40, w + 80, h + 80)
    ctx.filter = 'none'
    let fw, fh
    if (imgRatio > boxRatio) {
        fw = w
        fh = fw / imgRatio
    } else {
        fh = h
        fw = fh * imgRatio
    }
    ctx.drawImage(img, x + (w - fw) / 2, y + (h - fh) / 2, fw, fh)
    ctx.restore()
}

async function generateImage(nama, waktu) {
    loadFonts()
    const namaColor = getNextColor()
    const { width, height } = canvasConfig.canvas
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')
    const bgPath = path.join(BG_DIR, 'bg.jpg')
    if (fs.existsSync(bgPath) && fs.statSync(bgPath).size > 0) {
        const bgImg = await loadImage(bgPath)
        ctx.drawImage(bgImg, 0, 0, width, height)
    } else {
        ctx.fillStyle = '#f0ece4'
        ctx.fillRect(0, 0, width, height)
    }
    const photoPath = path.join(IMG_DIR, 'photo.jpg')
    if (fs.existsSync(photoPath) && fs.statSync(photoPath).size > 0) {
        await drawFoto(ctx, photoPath, canvasConfig.safeZones.foto)
    }
    drawText(ctx, nama, canvasConfig.safeZones.namaAtas, namaColor)
    drawText(ctx, waktu, canvasConfig.safeZones.waktu, canvasConfig.safeZones.waktu.textColor)
    drawText(ctx, nama, canvasConfig.safeZones.namaBawah, canvasConfig.safeZones.namaBawah.textColor)
    return canvas.toBuffer('image/png')
}

async function handler(m, { sock }) {
    try {
        const args = m.text.split(' ')
        args.shift()
        
        let nama = args.join(' ') 
        let waktu = null
        
        // Cek apakah ada format waktu (HH.MM)
        const timeMatch = nama.match(/(\d{1,2}\.\d{2})/)
        if (timeMatch) {
            waktu = timeMatch[1]
            nama = nama.replace(timeMatch[0], '').trim()
        }
        
        if (!nama || nama.length < 1) {
            return m.reply('❌ *Gunakan format:*\n.iqc <nama> <waktu>\n\n📌 *Contoh:*\n.iqc mie ayam 13.56\n.iqc Bakso 20.30')
        }
        
        if (!waktu) {
            const now = new Date()
            waktu = `${now.getHours()}.${String(now.getMinutes()).padStart(2, '0')}`
        }
        
        await m.reply('⏳ *Sedang membuat gambar IQC...*')
        
        // Download assets jika belum ada
        await downloadAll()
        
        // Generate gambar
        const buffer = await generateImage(nama, waktu)
        
        // Simpan sementara
        const outputPath = path.join(OUTPUT_DIR, `iqc-${Date.now()}.png`)
        const dir = path.dirname(outputPath)
        fs.mkdirSync(dir, { recursive: true })
        fs.writeFileSync(outputPath, buffer)
        
        // Kirim gambar
        await sock.sendMessage(m.chat, {
            image: fs.readFileSync(outputPath),
            caption: `✨ *IQC Generated!*\n\n📝 *Nama:* ${nama}\n⏰ *Waktu:* ${waktu}\n💾 *Ukuran:* ${(buffer.length / 1024).toFixed(2)} KB`
        }, { quoted: m })
        
        // Hapus file temporary
        fs.unlinkSync(outputPath)
        
    } catch (error) {
        console.error('IQC Plugin Error:', error)
        await m.reply(`❌ *GAGAL MEMBUAT IQC*\n> ${error.message}`)
    }
}

export { pluginConfig as config, handler };
