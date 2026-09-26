/**
 * Elaina-MD — https://github.com/OmmniDevv/Elaina-MD
 * Script by OmmniDevv — Jangan Dijual!
 */
import axios from 'axios'

// ─── Cecan — DISABLED (2026-09-26) ─────────────────────────
// nexray.web.id mati total. Tidak ada API gratis no-key reliable
// untuk random foto cewek real. TODO: tambah lagi kalau nemu sumber hidup.

// ─── Meme (meme-api.com — gratis, no key, tested ✅) ────────
let handler = async (m, { conn }) => {
    conn.sendMessage(m.chat, { react: { text: '😂', key: m.key } })
    try {
        const res = await axios.get('https://meme-api.com/gimme/memes', { timeout: 15000 })
        const { url, title, subreddit, author } = res.data
        if (!url) throw 'No meme found'
        await conn.sendMessage(m.chat, {
            image: { url },
            caption: `😂 *${title}*\n\nr/${subreddit} by u/${author}`
        }, { quoted: m })
        conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    } catch (e) {
        throw `❌ Gagal ambil meme: ${e.message}`
    }
}
handler.help = ['meme']
handler.tags = ['random']
handler.command = /^meme$/i
export default handler

// ─── Cat (thecatapi.com — gratis, no key, tested ✅) ────────
export const catHandler = async (m, { conn }) => {
    conn.sendMessage(m.chat, { react: { text: '🐱', key: m.key } })
    try {
        const res = await axios.get('https://api.thecatapi.com/v1/images/search', { timeout: 15000 })
        const url = res.data?.[0]?.url
        if (!url) throw 'No cat found'
        await conn.sendMessage(m.chat, { image: { url }, caption: '🐱 Nyaa~' }, { quoted: m })
        conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    } catch (e) {
        throw `❌ Gagal ambil kucing: ${e.message}`
    }
}
catHandler.help = ['cat']
catHandler.tags = ['random']
catHandler.command = /^(cat|kucing)$/i

// ─── Dog (dog.ceo — gratis, no key, tested ✅) ──────────────
export const dogHandler = async (m, { conn }) => {
    conn.sendMessage(m.chat, { react: { text: '🐶', key: m.key } })
    try {
        const res = await axios.get('https://dog.ceo/api/breeds/image/random', { timeout: 15000 })
        const url = res.data?.message
        if (!url) throw 'No dog found'
        await conn.sendMessage(m.chat, { image: { url }, caption: '🐶 Woof!' }, { quoted: m })
        conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    } catch (e) {
        throw `❌ Gagal ambil anjing: ${e.message}`
    }
}
dogHandler.help = ['dog']
dogHandler.tags = ['random']
dogHandler.command = /^(dog|anjing)$/i

// ─── Advice (adviceslip.com — gratis, no key, tested ✅) ────
export const adviceHandler = async (m, { conn }) => {
    try {
        const res = await axios.get('https://api.adviceslip.com/advice', { timeout: 15000 })
        const advice = res.data?.slip?.advice
        if (!advice) throw 'No advice'
        await m.reply(`💡 *Random Advice:*\n\n"${advice}"`)
    } catch (e) {
        throw `❌ Gagal ambil advice: ${e.message}`
    }
}
adviceHandler.help = ['advice']
adviceHandler.tags = ['random']
adviceHandler.command = /^advice$/i

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
