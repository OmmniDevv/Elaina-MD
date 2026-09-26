// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import axios from 'axios'

let handler = async (m, { conn, text }) => {
    if (!text) throw 'Masukkan teks!'
    let teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : m.text
    // ponytail: neoxr dibuang → deline maker/attp no-key (return webp langsung). Upgrade when butuh warna acak.
    const url = `https://api.deline.web.id/maker/attp?text=${encodeURIComponent(teks)}`
    conn.sendFile(m.chat, url, 'attp.webp', '', m, false, { asSticker: true })
}
handler.help = ['attp <teks>']
handler.tags = ['sticker']
handler.command = /^attp$/i

export default handler
