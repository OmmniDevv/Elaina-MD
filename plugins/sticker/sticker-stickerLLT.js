// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// Sticker search via delirius tenor/giphy (no key)
// Catatan: Line/Telegram sticker API mati. Diganti dengan tenor GIF search sebagai alternatif.
import axios from 'axios'

const DELIRIUS = () => (global.APIs?.delirius || 'https://api.delirius.online').replace(/\/$/, '')

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const text = args.join(' ')
  if (!text) throw `🖼️ *Senpai~* mau cari sticker/GIF apa?\n\n> Contoh: \`${usedPrefix}${command} lucu\``
  
  conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } })
  
  try {
    // Coba delirius tenor
    const { data } = await axios.get(`${DELIRIUS()}/search/tenor?q=${encodeURIComponent(text)}`, { timeout: 15000 })
    
    if (data?.status && Array.isArray(data.results) && data.results.length) {
      const url = data.results[Math.floor(Math.random() * data.results.length)]
      const isGif = /\.gif/i.test(url) || url.includes('tenor')
      conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
      await conn.sendMessage(m.chat, { 
        video: { url }, 
        caption: `✨ *Sticker: ${text}*`,
        gifPlayback: true
      }, { quoted: m })
      return
    }
    throw 'no results'
  } catch {
    // Fallback: kirim pesan bahwa fitur terbatas
    conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    throw `😿 Gomen senpai... tidak bisa menemukan sticker untuk "${text}". Coba kata kunci lain~`
  }
}
handler.help = ['stikerline <query>', 'stickertele <query>']
handler.tags = ['sticker']
handler.command = /^(stic?ker(line|tele(gram)?))$/i
handler.limit = true

export default handler