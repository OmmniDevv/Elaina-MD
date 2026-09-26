/**
 * Elaina-MD — https://github.com/OmmniDevv/Elaina-MD
 * Script by OmmniDevv — Jangan Dijual!
 */
import axios from 'axios'

// ─── Cecan (random cewek cantik by region) ─────────────────
async function sendCecan(m, conn, apiUrl, label) {
  conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } })
  const res = await axios.get(apiUrl, { timeout: 15000, responseType: 'arraybuffer' })
  const ct = res.headers['content-type'] || ''
  let imageBuffer
  if (ct.includes('image/')) {
    imageBuffer = Buffer.from(res.data)
  } else {
    // try parse as JSON
    const json = JSON.parse(Buffer.from(res.data).toString())
    const url = json?.result?.url || json?.url || json?.data?.url || (typeof json === 'string' ? json : null)
    if (!url) throw `❌ Gagal ambil foto ${label}`
    const imgRes = await axios.get(url, { responseType: 'arraybuffer', timeout: 15000 })
    imageBuffer = Buffer.from(imgRes.data)
  }
  await conn.sendMessage(m.chat, { image: { url: imageBuffer }, caption: `📸 *${label}*` }, { quoted: m })
  conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}

let handler = async (m, { conn }) => sendCecan(m, conn, 'https://api.nexray.web.id/random/cecan/indonesia', 'Cecan Indo')
handler.help = ['cecanindo']
handler.tags = ['random']
handler.command = /^cecanindo$/i
export default handler

export const cecanKoreaHandler = async (m, { conn }) => sendCecan(m, conn, 'https://api.nexray.web.id/random/cecan/korea', 'Cecan Korea')
cecanKoreaHandler.help = ['cecankorea']
cecanKoreaHandler.tags = ['random']
cecanKoreaHandler.command = /^cecankorea$/i

export const cecanJepangHandler = async (m, { conn }) => sendCecan(m, conn, 'https://api.nexray.web.id/random/cecan/jepang', 'Cecan Jepang')
cecanJepangHandler.help = ['cecanjepang']
cecanJepangHandler.tags = ['random']
cecanJepangHandler.command = /^cecanjepang$/i

export const cecanChinaHandler = async (m, { conn }) => sendCecan(m, conn, 'https://api.nexray.web.id/random/cecan/china', 'Cecan China')
cecanChinaHandler.help = ['cecanchina']
cecanChinaHandler.tags = ['random']
cecanChinaHandler.command = /^cecanchina$/i

export const cecanThaiHandler = async (m, { conn }) => sendCecan(m, conn, 'https://api.nexray.web.id/random/cecan/thai', 'Cecan Thailand')
cecanThaiHandler.help = ['cecanthai']
cecanThaiHandler.tags = ['random']
cecanThaiHandler.command = /^cecanthai$/i

export const cecanVietnamHandler = async (m, { conn }) => sendCecan(m, conn, 'https://api.nexray.web.id/random/cecan/vietnam', 'Cecan Vietnam')
cecanVietnamHandler.help = ['cecanvietnam']
cecanVietnamHandler.tags = ['random']
cecanVietnamHandler.command = /^cecanvietnam$/i

// ─── Meme (meme-api primary, candaan-api fallback) ─────────────
export const memeHandler = async (m, { conn }) => {
  conn.sendMessage(m.chat, { react: { text: '😂', key: m.key } })
  try {
    const res = await axios.get('https://meme-api.com/gimme/indonesia', { timeout: 15000 })
    const url = res.data?.url
    if (!url) throw 0
    return await conn.sendMessage(m.chat, { image: { url }, caption: `😂 *Meme*\n> ${res.data?.title || ''}` }, { quoted: m })
  } catch {}
  const fb = await axios.get('https://candaan-api.vercel.app/api/image/random', { timeout: 15000 }).catch(() => null)
  const url = fb?.data?.data?.url
  if (!url) throw '❌ Gagal ambil meme'
  await conn.sendMessage(m.chat, { image: { url }, caption: `😂 *Meme Receh*\n> ${fb.data?.data?.source || ''}` }, { quoted: m })
  conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
memeHandler.help = ['meme']
memeHandler.tags = ['random']
memeHandler.command = /^meme$/i

// ─── Couple (random couple pic) ────────────────────────────
export const coupleHandler = async (m, { conn }) => {
  conn.sendMessage(m.chat, { react: { text: '💕', key: m.key } })
  const res = await axios.get('https://api.deline.web.id/random/ppcouple', { timeout: 15000 })
  const cowo = res.data?.result?.cowo || res.data?.cowo
  const cewe = res.data?.result?.cewe || res.data?.cewe
  if (cowo) await conn.sendMessage(m.chat, { image: { url: cowo }, caption: '💕 *Couple Goals (Cowo)*' }, { quoted: m })
  if (cewe) await conn.sendMessage(m.chat, { image: { url: cewe }, caption: '💕 *Couple Goals (Cewe)*' }, { quoted: m })
  if (!cowo && !cewe) throw '❌ Gagal ambil foto couple'
  conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
coupleHandler.help = ['couple']
coupleHandler.tags = ['random']
coupleHandler.command = /^couple$/i

// ─── Lahelu (meme Indonesia) ───────────────────────────────
export const laheluHandler = async (m, { conn }) => {
  conn.sendMessage(m.chat, { react: { text: '😂', key: m.key } })
  // ponytail: cuki (401) dibuang → siputzx lahelu butuh URL param, ga random. Fallback candaan-api/image/random (Indo). Upgrade when nemu lahelu no-key random.
  const res = await axios.get('https://candaan-api.vercel.app/api/image/random', { timeout: 15000 }).catch(() => null)
  const url = res?.data?.data?.url
  if (!url) throw '❌ Gagal ambil meme'
  await conn.sendMessage(m.chat, { image: { url }, caption: '😂 *Meme Receh*' }, { quoted: m })
  conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
laheluHandler.help = ['lahelu']
laheluHandler.tags = ['random']
laheluHandler.command = /^lahelu$/i

// ─── Quotes Image ──────────────────────────────────────────
// ponytail: neoxr quotesimage dibuang → zenquotes.io random (no-key, teks). Render gambar pakai quickchart.io card. Upgrade when butuh quote Indo.
export const quotesimageHandler = async (m, { conn }) => {
  conn.sendMessage(m.chat, { react: { text: '💭', key: m.key } })
  const r = await axios.get('https://zenquotes.io/api/random', { timeout: 10000 }).catch(() => null)
  const q = r?.data?.[0]
  if (!q?.q) throw '❌ Gagal ambil quotes'
  const img = `https://quickchart.io/qr?text=${encodeURIComponent(`${q.q}\n— ${q.a}`)}&size=400`
  // ponytail: quickchart qr bukan quote-card aesthetic. Ganti ke api.quickchart.io/chart kalau mau cantik.
  await m.reply(`💭 *QUOTE*\n\n"${q.q}"\n— ${q.a}`)
  conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
quotesimageHandler.help = ['quotesimage']
quotesimageHandler.tags = ['random']
quotesimageHandler.command = /^quotesimage$/i

// ─── Bar Random (Blue Archive) ────────────────────────────
export const barandomHandler = async (m, { conn }) => {
  conn.sendMessage(m.chat, { react: { text: '🎮', key: m.key } })
  const res = await axios.get('https://api.nexray.web.id/random/ba', { timeout: 15000 })
  const url = res.data?.result?.url || res.data?.url || (typeof res.data === 'string' ? res.data : null)
  if (!url) throw '❌ Gagal ambil gambar Blue Archive'
  await conn.sendMessage(m.chat, { image: { url } }, { quoted: m })
  conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
barandomHandler.help = ['barandom']
barandomHandler.tags = ['random']
barandomHandler.command = /^barandom$/i
