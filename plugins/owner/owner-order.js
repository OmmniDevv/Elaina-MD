// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Kalau kamu menemukan pesan eror atau mau order, lapor pakai perintah ini yaa~\n\nContoh:\n*${usedPrefix + command} Halo owner, mau tanya...*`
    if (text.length < 5) throw `Pesan terlalu pendek, minimal 5 karakter!`
    if (text.length > 1000) throw `Pesan terlalu panjang, maksimal 1000 karakter!`
    let teks = `*${global.htki || '──「'} ${command.toUpperCase()} ${global.htka || '」──'}*\n📮 *Pesan:* ${text}\n👤 *Pengirim:* @${m.sender.split('@')[0]}`
    let target = (global.nomorown || '6285869074622').replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    await conn.reply(target, m.quoted ? teks + '\n\n' + (m.quoted.text || '') : teks, null, {
        mentions: [m.sender]
    })
    m.reply('✅ Pesan telah terkirim ke Owner!\n_Mohon ditunggu responnya yaa~ (≧ω≦)ゞ_')
}
handler.command = /^(order)$/i
export default handler