// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import axios from 'axios'
import { f } from '../../src/lib/http.js'

// ─── Blue Archive Logo ────────────────────────────────────────
let handlerBaLogo = async (m, { conn, text }) => {
    if (!text || !text.includes('&') && !text.includes(',')) throw `🎮 *ʙʟᴜᴇ ᴀʀᴄʜɪᴠᴇ ʟᴏɢᴏ*\n\n> Contoh: \`${m.prefix}balogo Blue & Archive\``
    const parts = text.split(/[&,]/).map(s => s.trim()).filter(s => s)
    if (parts.length < 2) throw `🎮 Masukkan 2 teks! Contoh: \`${m.prefix}balogo Blue & Archive\``
    conn.sendMessage(m.chat, { react: { text: '🕕', key: m.key } })
    const res = await f(`https://api.nexray.web.id/maker/balogo?text=${encodeURIComponent(parts[0])} ${encodeURIComponent(parts[1])}`, 'arrayBuffer')
    if (!res) throw '❌ Gagal generate logo'
    await conn.sendFile(m.chat, Buffer.from(res), 'balogo.jpg', '', m)
    conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
handlerBaLogo.help = ['balogo teks1 & teks2']
handlerBaLogo.tags = ['canvas']
handlerBaLogo.command = /^(balogo|bluearchivelogo|ba)$/i
export { handlerBaLogo }

// ─── Pak Ustad ────────────────────────────────────────────────
let handlerPakUstad = async (m, { conn, text }) => {
    const q = text || m.quoted?.text
    if (!q) throw `⚠️ *ᴘᴀᴋ ᴜsᴛᴀᴅ*\n\n> Contoh: \`${m.prefix}pakustad kenapa aku ganteng\``
    conn.sendMessage(m.chat, { react: { text: '🕕', key: m.key } })
    // ponytail: cuki ustadz (401) dibuang. Gaada maker/ustadz no-key hidup (deline/siputzx 404). Handler dihapus; tambah lagi kalau nemu sumber hidup atau bikin scraper sendiri.
    throw '❌ Fitur pakustad sementara mati — gaada sumber no-key yang hidup.'
    conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
handlerPakUstad.help = ['pakustad <pertanyaan>']
handlerPakUstad.tags = ['canvas']
handlerPakUstad.command = /^(pakustad|pak-ustad|tanyaustad)$/i
export { handlerPakUstad }

// ─── Fake FF Lobby ────────────────────────────────────────────
let handlerFakeFf = async (m, { conn, text }) => {
    if (!text) throw `🔫 *ꜰᴀᴋᴇ ꜰꜰ*\n\n> Contoh: \`${m.prefix}fakeff NamaMu\``
    conn.sendMessage(m.chat, { react: { text: '🕕', key: m.key } })
    const res = await f(`https://api.nexray.web.id/maker/fakelobyff?nickname=${encodeURIComponent(text)}`, 'arrayBuffer')
    if (!res) throw '❌ Gagal generate gambar'
    await conn.sendFile(m.chat, Buffer.from(res), 'fakeff.jpg', '', m)
    conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
handlerFakeFf.help = ['fakeff <nama>']
handlerFakeFf.tags = ['canvas']
handlerFakeFf.command = /^(fakeff|fakefreefire)$/i
export { handlerFakeFf }

// ─── Fake ML Lobby ────────────────────────────────────────────
let handlerFakeMl = async (m, { conn, text, args }) => {
    if (!text) throw `⚔️ *ꜰᴀᴋᴇ ᴍʟ*\n\n> Contoh: \`${m.prefix}fakeml NamaMu\``
    // Get profile picture for avatar
    const q = m.quoted || m
    let avatarUrl = 'https://i.ibb.co/ZZx3z8F/elaina-thumbnail.jpg'
    try {
        const ppUrl = await conn.profilePictureUrl(m.sender, 'image')
        if (ppUrl) avatarUrl = ppUrl
    } catch {}
    conn.sendMessage(m.chat, { react: { text: '🕕', key: m.key } })
    const res = await f(`https://api.nexray.web.id/maker/fakelobyml?avatar=${encodeURIComponent(avatarUrl)}&nickname=${encodeURIComponent(text)}`, 'arrayBuffer')
    if (!res) throw '❌ Gagal generate gambar'
    await conn.sendFile(m.chat, Buffer.from(res), 'fakeml.jpg', '', m)
    conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
handlerFakeMl.help = ['fakeml <nama>']
handlerFakeMl.tags = ['canvas']
handlerFakeMl.command = /^(fakeml|mlbbfake|mlcard|mlfake)$/i
export { handlerFakeMl }

// ─── Fake Bank Jago ───────────────────────────────────────────
import { Canvas, loadImage, FontLibrary } from 'skia-canvas'
import fs from 'fs'
import path from 'path'

async function ensureFile(url, file) {
    const dir = path.dirname(file)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    if (!fs.existsSync(file)) {
        const res = await fetch(url)
        fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()))
    }
}

async function generateBankJago(saldo, greet) {
    const bgUrl = 'https://raw.githubusercontent.com/uploader762/dat2/main/uploads/52e39f-1773064858080.jpg'
    const fontUrl = 'https://raw.githubusercontent.com/uploader762/dat2/main/uploads/49bbd8-1773045557233.otf'
    const font2Url = 'https://raw.githubusercontent.com/uploader762/dat1/main/uploads/203827-1773063086445.ttf'
    const font1Path = path.join(process.cwd(), 'tmp', 'bankjago_font1.otf')
    const font2Path = path.join(process.cwd(), 'tmp', 'bankjago_font2.ttf')
    await ensureFile(fontUrl, font1Path)
    await ensureFile(font2Url, font2Path)
    FontLibrary.use('BankFont1', font1Path)
    FontLibrary.use('BankFont2', font2Path)
    const bgRes = await fetch(bgUrl)
    const bg = await loadImage(Buffer.from(await bgRes.arrayBuffer()))
    const canvas = new Canvas(bg.width, bg.height)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(bg, 0, 0, bg.width, bg.height)
    ctx.font = '125px BankFont1'
    ctx.fillStyle = 'black'
    const numW = ctx.measureText(saldo).width
    const numX = 2470 - numW
    ctx.fillText(saldo, numX, 894)
    ctx.fillText('Rp', numX - ctx.measureText('Rp').width - 4, 894)
    ctx.font = '93px BankFont2'
    ctx.fillStyle = 'gray'
    ctx.fillText(greet, 98, 86)
    return await canvas.png
}

let handlerFakeBankJago = async (m, { conn, text }) => {
    if (!text || !text.includes(',')) throw `🏦 *ꜰᴀᴋᴇ ʙᴀɴᴋ ᴊᴀɢᴏ*\n\n> Contoh: \`${m.prefix}fakebankjago Zann,10000\``
    const [nama, nominal] = text.split(',')
    if (!nama || !nominal || isNaN(nominal.trim())) throw '❌ Format salah! Contoh: `fakebankjago Zann,10000`'
    conn.sendMessage(m.chat, { react: { text: '🕕', key: m.key } })
    const saldo = Number(nominal.replace(/[^0-9]/g, '')).toLocaleString('id-ID')
    const h = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta', hour: '2-digit', hour12: false })
    const hour = Number(h)
    const waktu = hour >= 4 && hour < 11 ? 'Pagi' : hour >= 11 && hour < 15 ? 'Siang' : hour >= 15 && hour < 18 ? 'Sore' : 'Malam'
    const img = await generateBankJago(saldo, `Selamat ${waktu}, ${nama.trim()}`)
    await conn.sendFile(m.chat, img, 'bankjago.jpg', '', m)
    conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
handlerFakeBankJago.help = ['fakebankjago nama,nominal']
handlerFakeBankJago.tags = ['canvas']
handlerFakeBankJago.command = /^(fakebankjago)$/i
export { handlerFakeBankJago }

// ─── Fake Dana ────────────────────────────────────────────────
FontLibrary.use('CartoonVibes', process.cwd() + '/assets/fonts/Epep.ttf')

async function generateDana(angka) {
    const bg = await loadImage('https://raw.githubusercontent.com/uploader762/dat3/main/uploads/9c18e0-1772932032348.jpg')
    const logo = await loadImage('https://raw.githubusercontent.com/uploader762/dat3/main/uploads/d0f081-1772929197100.png')
    const canvas = new Canvas(bg.width, bg.height)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(bg, 0, 0)
    ctx.font = '205px CartoonVibes'
    ctx.fillStyle = 'white'
    ctx.textBaseline = 'top'
    ctx.fillText(angka, 664, 293)
    const tw = ctx.measureText(angka).width
    ctx.drawImage(logo, 664 + tw + 11, 293 - 31, 370, 370)
    return await canvas.png
}

let handlerFakeDana = async (m, { conn, text }) => {
    if (!text || isNaN(text.trim())) throw `💙 *ꜰᴀᴋᴇ ᴅᴀɴᴀ*\n\n> Contoh: \`${m.prefix}fakedana 10000\``
    conn.sendMessage(m.chat, { react: { text: '🕕', key: m.key } })
    const saldo = Number(text.replace(/[^0-9]/g, '')).toLocaleString('id-ID')
    const img = await generateDana(saldo)
    await conn.sendFile(m.chat, img, 'fakedana.jpg', '', m)
    conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
handlerFakeDana.help = ['fakedana <nominal>']
handlerFakeDana.tags = ['canvas']
handlerFakeDana.command = /^(fakedana|danafake)$/i
export { handlerFakeDana }

export default handlerBaLogo
