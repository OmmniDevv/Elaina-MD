/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios'
import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas'
import { writeFile, mkdir } from 'node:fs/promises'
import { existsSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'

const IGIMG_BG_URL = 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Image/igimg.png'
const FONT_SEMIBOLD_URL = 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.woff2'
const FONT_REGULAR_URL = 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2'

let fontsLoaded = false;
let bgImgBuffer = null;

const BG_W = 898
const BG_H = 1600

const configLayout = {
  foto: { a: 136, b: 912, c: 38, d: 860, radius: 20 },
  edgeBlur: { width: 3, blur: 10 },
  pp: { x: 110, y: 82, size: 80 },
  namaTeks: { x: 170, y: 58, fontSize: 25, maxWidth: 500, minFontSize: 16, color: '#feffff' },
  usernameTeks: { x: 170, y: 90, fontSize: 17, color: '#8c8d91' }
}

const pluginConfig = {
    name: 'igstoryimg',
    alias: ['igstory', 'igstoryimage'],
    category: 'canvas',
    description: 'Membuat gambar layout Instagram Story dari gambarmu.',
    usage: '.igstoryimg [kirim/reply gambar]',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 2,
    isEnabled: true
}

async function downloadData(url) {
  const res = await axios.get(url, { responseType: 'arraybuffer', headers: { 'User-Agent': 'Mozilla/5.0' } })
  return Buffer.from(res.data)
}

async function setup() {
  if (!bgImgBuffer) bgImgBuffer = await downloadData(IGIMG_BG_URL);
  if (!fontsLoaded) {
      GlobalFonts.register(await downloadData(FONT_SEMIBOLD_URL), 'InterSemiBold')
      GlobalFonts.register(await downloadData(FONT_REGULAR_URL), 'InterRegular')
      fontsLoaded = true;
  }
}

function roundedBottomClipPath(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + w, y)
  ctx.lineTo(x + w, y + h - radius)
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h)
  ctx.lineTo(x + radius, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius)
  ctx.lineTo(x, y)
  ctx.closePath()
}

function roundedBottomOuterPath(ctx, x, y, w, h, r, bw) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.rect(x - bw, y, bw, h - radius)
  ctx.rect(x + w, y, bw, h - radius)
  ctx.moveTo(x - bw, y + h - radius)
  ctx.lineTo(x, y + h - radius)
  ctx.quadraticCurveTo(x, y + h, x + radius, y + h)
  ctx.lineTo(x + radius, y + h + bw)
  ctx.quadraticCurveTo(x - bw, y + h + bw, x - bw, y + h - radius)
  ctx.closePath()
  ctx.moveTo(x + w + bw, y + h - radius)
  ctx.lineTo(x + w, y + h - radius)
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h)
  ctx.lineTo(x + w - radius, y + h + bw)
  ctx.quadraticCurveTo(x + w + bw, y + h + bw, x + w + bw, y + h - radius)
  ctx.closePath()
  ctx.rect(x + radius, y + h, w - radius * 2, bw)
}

function getContainSize(img, w, h) {
  const imgRatio = img.width / img.height
  const boxRatio = w / h
  let fw, fh
  if (imgRatio > boxRatio) {
    fw = w
    fh = fw / imgRatio
  } else {
    fh = h
    fw = fh * imgRatio
  }
  return { fw, fh }
}

function getCoverSize(img, w, h) {
  const imgRatio = img.width / img.height
  const boxRatio = w / h
  let fw, fh
  if (imgRatio > boxRatio) {
    fh = h
    fw = fh * imgRatio
  } else {
    fw = w
    fh = fw / imgRatio
  }
  return { fw, fh }
}

async function drawFoto(ctx, img, zone) {
  const { a, b, c, d, radius } = zone
  const x = c
  const y = a
  const w = d - c
  const h = b - a
  ctx.save()
  roundedBottomClipPath(ctx, x, y, w, h, radius ?? 0)
  ctx.clip()
  ctx.filter = 'blur(28px)'
  ctx.drawImage(img, x - 40, y - 40, w + 80, h + 80)
  ctx.filter = 'none'
  const { fw, fh } = getContainSize(img, w, h)
  ctx.drawImage(img, x + (w - fw) / 2, y + (h - fh) / 2, fw, fh)
  ctx.restore()
}

async function drawEdgeBlur(ctx, img, zone, edgeBlur) {
  const { a, b, c, d, radius } = zone
  const x = c
  const y = a
  const w = d - c
  const h = b - a
  const { fw, fh } = getCoverSize(img, w, h)
  const imgX = x + (w - fw) / 2
  const imgY = y + (h - fh) / 2
  ctx.save()
  roundedBottomOuterPath(ctx, x, y, w, h, radius ?? 0, edgeBlur.width)
  ctx.clip()
  ctx.filter = `blur(${edgeBlur.blur}px)`
  ctx.drawImage(img, imgX, imgY, fw, fh)
  ctx.filter = 'none'
  ctx.restore()
}

async function drawPP(ctx, img, pp) {
  const { x, y, size } = pp
  const r = size / 2
  const dim = Math.min(img.width, img.height)
  const sx = (img.width - dim) / 2
  const sy = (img.height - dim) / 2
  ctx.save()
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.closePath()
  ctx.clip()
  ctx.drawImage(img, sx, sy, dim, dim, x - r, y - r, size, size)
  ctx.restore()
}

function resolveFontSize(ctx, cfg, text, fontFamily) {
  const { maxWidth, fontSize, minFontSize = 10 } = cfg
  if (!maxWidth) return fontSize
  const words = text.split(' ')
  let size = fontSize
  while (size > minFontSize) {
    ctx.font = `${size}px ${fontFamily}`
    const totalWidth = ctx.measureText(text).width
    if (totalWidth <= maxWidth) break
    const slotPerWord = maxWidth / words.length
    const overflow = words.some(w => ctx.measureText(w).width > slotPerWord * 1.5)
    if (!overflow && totalWidth <= maxWidth) break
    size -= 1
  }
  return Math.max(size, minFontSize)
}

function drawTeksNama(ctx, cfg, text, fontFamily) {
  ctx.save()
  const size = resolveFontSize(ctx, cfg, text, fontFamily)
  ctx.font = `${size}px ${fontFamily}`
  ctx.fillStyle = cfg.color
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText(text, cfg.x, cfg.y)
  ctx.restore()
}

function drawTeks(ctx, cfg, text, fontFamily) {
  ctx.save()
  ctx.font = `${cfg.fontSize}px ${fontFamily}`
  ctx.fillStyle = cfg.color
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText(text, cfg.x, cfg.y)
  ctx.restore()
}

async function generateIgimg(photoBuffer, ppBuffer, nama, username, outPath) {
  await setup()
  const canvas = createCanvas(BG_W, BG_H)
  const ctx = canvas.getContext('2d')
  const bgImg = await loadImage(bgImgBuffer)
  ctx.drawImage(bgImg, 0, 0, BG_W, BG_H)
  const photoImg = await loadImage(photoBuffer)
  const ppImg = await loadImage(ppBuffer)
  await drawFoto(ctx, photoImg, configLayout.foto)
  await drawEdgeBlur(ctx, photoImg, configLayout.foto, configLayout.edgeBlur)
  await drawPP(ctx, ppImg, configLayout.pp)
  drawTeksNama(ctx, configLayout.namaTeks, nama, 'InterSemiBold')
  drawTeks(ctx, configLayout.usernameTeks, username, 'InterRegular')
  await writeFile(outPath, await canvas.encode('png'))
  return outPath
}

async function handler(m, { sock }) {
    try {
        let targetImgBuffer = null;
        try {
            if (m.quoted && typeof m.quoted.download === 'function') {
                targetImgBuffer = await m.quoted.download();
            } else if (typeof m.download === 'function' && (m.isMedia || m.mtype === 'imageMessage' || m.type === 'imageMessage')) {
                targetImgBuffer = await m.download();
            }
        } catch (e) {}

        if (!targetImgBuffer) {
            return m.reply(
                `📸 *FITUR IG STORY IMAGE*\n\n` +
                `Fitur ini memungkinkan kamu untuk menyulap foto biasamu menjadi tampilan ala Instagram Story yang estetik dan kekinian.\n\n` +
                `*CARA PENGGUNAAN:*\n` +
                `- Kirimkan gambar langsung dengan caption \`${m.prefix}igstoryimg\`\n` +
                `- Atau balas (*reply*) pesan gambar yang sudah ada dengan perintah \`${m.prefix}igstoryimg\`\n\n` +
                `_Bot akan otomatis memasang foto profil dan namamu di dalam gambarnya!_`
            );
        }

        await m.react('🕕');

        let ppUrl;
        try {
            ppUrl = await sock.profilePictureUrl(m.sender, 'image');
        } catch (e) {
            ppUrl = 'https://i.ibb.co/3Fh9Q6M/empty-profile.png';
        }

        let ppBuffer;
        try {
            ppBuffer = await downloadData(ppUrl);
        } catch (e) {
            ppBuffer = targetImgBuffer;
        }

        const nama = m.pushName || 'Someone';
        const username = '@' + m.sender.split('@')[0];

        const tempDir = join(process.cwd(), 'temp');
        if (!existsSync(tempDir)) await mkdir(tempDir, { recursive: true });
        
        const outPath = join(tempDir, `igstory_${Date.now()}.png`);
        
        await generateIgimg(targetImgBuffer, ppBuffer, nama, username, outPath);

        await sock.sendMessage(m.chat, { image: { url: outPath } }, { quoted: m });

        if (existsSync(outPath)) unlinkSync(outPath);
        await m.react('✅');

    } catch (e) {
        bgImgBuffer = null;
        fontsLoaded = false;
        await m.react('❌');
        m.reply(`❌ *GAGAL MEMPROSES GAMBAR*\n\nMaaf, terjadi kesalahan saat mencoba membuat gambar IG Story. Pastikan gambar yang dikirim valid dan coba lagi beberapa saat.`);
    }
}

export { pluginConfig as config, handler }
