// © Elaina-MD — https://github.com/OmmniDevv/Elaina-MD
// AI Image Style Converter — 100% gratis, no API key.
// CATATAN: api-faa.my.id MATI (403, dites 2026-09-26).
// FAA endpoints (tohijab, tofigure, dll) DISABLED sementara.
// Prompt-based styles via nanobanana juga mati karena api-faa.
// TODO: cari alternatif img2img gratis yang hidup.

let handler = async (m, { conn, command, usedPrefix }) => {
  throw `😿 Gomen senpai... fitur ${command} sedang dalam perbaikan.
API image-to-image gratis yang dipakai (api-faa.my.id) sudah tidak aktif.

Kana sedang cari alternatif lain. Coba lagi nanti ya~`
}

handler.help = ['tohijab', 'tofigure', 'tofigurev2', 'tojapanese', 'tomekah', 'toemotebatu', 'toanime', 'toblack', 'tocermin', 'tomanga', 'tooilpainting', 'topixel', 'towatercolor'].map(v => v + ' (reply gambar)')
handler.tags = ['ai']
handler.command = /^(tohijab|tofigure|tofigurev2|tojapanese|tomekah|toemotebatu|toanime|toblack|tocermin|tomanga|tooilpainting|topixel|towatercolor)$/i
handler.disabled = true

export default handler
