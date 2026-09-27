// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// Helper menu tombol lintas-klien.
//
// Kenapa ada: WhatsApp membuang pesan yang memakai `single_select` (daftar
// dropdown) di banyak versi klien — gejalanya "anda telah menerima pesan
// tetapi whatsapp tidak mendukungnya" / centang satu tanpa isi. `quick_reply`
// didukung di semua klien. Jadi menu di sini SELALU memakai quick_reply
// (maks 10), dan daftar yang lebih panjang ditaruh di badan teks.
//
// Tiga lapis supaya pesan tidak pernah hilang:
//   1. MB.Button bawaan paket (kartu + tombol quick_reply)
//   2. teks polos (badan sudah memuat semua item)
import { MB } from '@rexxhayanasi/elaina-baileys'

/**
 * Kirim menu tombol cepat.
 * @param {object} conn  socket
 * @param {object} m     pesan masuk (untuk chat + quoted)
 * @param {object} o
 * @param {string} o.text    badan pesan (sebaiknya sudah memuat daftar item)
 * @param {string} o.footer  footer kecil
 * @param {Array<{label:string,id:string}>} o.items tombol quick_reply (maks 10)
 * @param {string} [o.title] judul kartu
 * @param {Buffer} [o.image] gambar header (opsional)
 * @param {object} [o.quoted] pesan yang dikutip
 * @param {object} [o.contextInfo] contextInfo tambahan
 */
export async function sendQuickMenu(conn, m, { text = '', footer = '', items = [], title = '', image = null, quoted, contextInfo } = {}) {
    const list = (Array.isArray(items) ? items : [])
        .filter(it => it && it.label && it.id)
        .slice(0, 10)

    const fullText = [text, footer].filter(Boolean).join('\n\n').trim()
    const q = quoted || m

    // Normalisasi gambar: terima Buffer, URL string, atau { url }.
    const img = image && typeof image === 'object' && !Buffer.isBuffer(image) && image.url
        ? image.url
        : image

    // Lapis 1: kartu + tombol quick_reply lewat builder paket.
    if (list.length) {
        try {
            const b = new MB.Button(conn)
            if (title) b.setTitle(String(title))
            if (text) b.setBody(String(text))
            if (footer) b.setFooter(String(footer))
            if (img) b.setImage(img)
            if (contextInfo && Object.keys(contextInfo).length) b.setContextInfo(contextInfo)
            for (const it of list) b.addReply(String(it.label), String(it.id))
            return await b.send(m.chat, { quoted: q })
        } catch (e) {
            // lanjut ke lapis 2
        }
    }

    // Lapis 2: teks polos — badan pesan sudah memuat daftar lengkap.
    if (img) {
        return conn.sendMessage(m.chat, { image: typeof img === 'string' ? { url: img } : img, caption: fullText }, { quoted: q })
    }
    return conn.sendMessage(m.chat, { text: fullText }, { quoted: q })
}

/** Bangun daftar baris teks dari items. */
export function renderList(items, { prefix = '  • ', suffix = '' } = {}) {
    return (Array.isArray(items) ? items : [])
        .filter(it => it && it.label)
        .map(it => `${prefix}${it.label}${suffix}`)
        .join('\n')
}
