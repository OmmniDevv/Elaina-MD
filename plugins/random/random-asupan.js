// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import axios from 'axios'
import fs from 'fs'
import path from 'path'

const TIKTOK_DIR = path.join(process.cwd(), 'lib', 'tiktok')

function loadTiktok(...files) {
    let urls = []
    for (const file of files) {
        try {
            const fp = path.join(TIKTOK_DIR, file)
            if (fs.existsSync(fp)) {
                const data = JSON.parse(fs.readFileSync(fp, 'utf-8'))
                urls = urls.concat(data.map(d => d.url).filter(Boolean))
            }
        } catch {}
    }
    return urls
}

function randItem(arr) { return arr[Math.floor(Math.random() * arr.length)] }

// ─── Asupan Random ───────────────────────────────────────────
let handlerAsupan = async (m, { conn }) => {
    conn.sendMessage(m.chat, { react: { text: '🕕', key: m.key } })
    const urls = loadTiktok('bocil.json', 'gheayubi.json', 'kayes.json', 'notnot.json', 'panrika.json', 'santuy.json', 'tiktokgirl.json', 'ukhty.json')
    if (!urls.length) throw '❌ Data asupan tidak tersedia'
    const url = randItem(urls)
    const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 30000 }).catch(() => null)
    if (!res) throw '❌ Gagal mengambil video'
    await conn.sendFile(m.chat, Buffer.from(res.data), 'asupan.mp4', '', m)
    conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
handlerAsupan.help = ['asupan']
handlerAsupan.tags = ['asupan']
handlerAsupan.command = /^(asupan|asupanrandom)$/i
export { handlerAsupan }

// ─── Bocil ───────────────────────────────────────────────────
let handlerBocil = async (m, { conn }) => {
    conn.sendMessage(m.chat, { react: { text: '🕕', key: m.key } })
    const urls = loadTiktok('bocil.json')
    if (!urls.length) throw '❌ Data tidak tersedia'
    const res = await axios.get(randItem(urls), { responseType: 'arraybuffer', timeout: 30000 }).catch(() => null)
    if (!res) throw '❌ Gagal mengambil video'
    await conn.sendFile(m.chat, Buffer.from(res.data), 'bocil.mp4', '', m)
    conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
handlerBocil.help = ['bocil']
handlerBocil.tags = ['asupan']
handlerBocil.command = /^(bocil|bocilvid)$/i
export { handlerBocil }

// ─── Ukhty ───────────────────────────────────────────────────
let handlerUkhty = async (m, { conn }) => {
    conn.sendMessage(m.chat, { react: { text: '🕕', key: m.key } })
    const urls = loadTiktok('ukhty.json')
    if (!urls.length) throw '❌ Data tidak tersedia'
    const res = await axios.get(randItem(urls), { responseType: 'arraybuffer', timeout: 30000 }).catch(() => null)
    if (!res) throw '❌ Gagal mengambil video'
    await conn.sendFile(m.chat, Buffer.from(res.data), 'ukhty.mp4', '', m)
    conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
handlerUkhty.help = ['ukhty']
handlerUkhty.tags = ['asupan']
handlerUkhty.command = /^(ukhty|ukht)$/i
export { handlerUkhty }

// ─── Asupan TikTok (by username) ─────────────────────────────
const USERNAMES = [
    'natajadeh', 'aletaanovianda', 'faisafch', '0rbby', 'cindyanastt',
    'awaa.an', 'nadineabgail', 'ciloqciliq', 'carluskiey', 'wuxiaturuxia',
    'joomblo', 'hxszys', 'indomeysleramu', 'anindthrc', 'm1cel',
    'chrislin.chrislin', 'brocolee__', 'dxzdaa', 'toodlesprunky', 'wasawho'
]

// ponytail: neoxr asupan-by-username dibuang. TikTok user-feed scraping butuh signature/token, ga stabil no-key. Handler dihapus; fallback 'asupan' random masih jalan lewat lib/tiktok/*.json.

export default handlerAsupan
