/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

async function newup(m, { conn }) {
  const text = `╭━━━〔 ✦ RIMURU UPDATE ✦ 〕━━━╮
┃
┃  📢 UPDATE TERBARU
┃
┃  ✦ Gojo Merge
┃  • Fitur Gojo yang benar-benar belum
┃    ada di Rimuru telah ditambahkan.
┃  • Command dibuat pendek dan disesuaikan
┃    dengan struktur RimuruMD.
┃  • Fitur yang sudah ada tidak diduplikasi.
┃
┃  ✦ NIVID
┃  • Command: .nivid
┃  • Mengirim direct video URL sebagai MP4.
┃  • Sumber URL:
┃    src/data/Nita/rimuru.json
┃  • Jika satu URL gagal, sistem mencoba
┃    URL berikutnya.
┃
┃  ✦ Kompatibilitas
┃  • Handler mengikuti struktur RimuruMD.
┃  • Error ditangani agar kegagalan command
┃    tidak membuat bot crash.
┃
┃  🔧 COMMAND BARU
┃  • .nivid
┃  • .newup
┃
┃  📌 Catatan
┃  • Isi rimuru.json dengan direct URL video
┃    milik kamu sendiri.
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`

  try {
    await conn.sendMessage(
      m.chat,
      { text },
      { quoted: m }
    )
  } catch (err) {
    console.error('[NEWUP]', err)
  }
}

newup.help = ['newup']
newup.tags = ['info']
newup.command = ['newup']

export default newup
