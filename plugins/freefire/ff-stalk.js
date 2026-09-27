// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// Free Fire Stalk — CATATAN: jerexd FF endpoint PREMIUM ONLY (tested 2026-09-26, 403)
// Alternatif: tidak ada API gratis no-key untuk FF stalk saat ini.
// TODO: tambah lagi kalau nemu sumber gratis atau user punya API key premium.

let handler = async (m, { conn, text, usedPrefix }) => {
    const uid = (text || '').replace(/[^0-9]/g, '').trim()
    if (!uid) return m.reply(`🎮 *FREE FIRE STALKER*\n\nFormat: ${usedPrefix}ffstalk <UID>\nContoh: ${usedPrefix}ffstalk 12345678`)

    throw `❌ Fitur FF Stalk sedang tidak tersedia.\n\nEndpoint API memerlukan akses premium.\nAkan ditambahkan kembali jika ada alternatif gratis.`
}

handler.help = ['ffstalk <uid>']
handler.tags = ['stalker']
handler.command = /^(ffstalk|freefirestalk|ffid)$/i

export default handler
