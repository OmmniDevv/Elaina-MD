import { resolvePnToLid, resolveAnyLidToJid, isLid, isLidConverted } from '../../lib/lidHelper.js'

let handler = async (m, { conn, text, usedPrefix, command, participants }) => {
    let target = text ? text.trim() : (m.quoted ? (m.quoted.sender || m.quoted.participant) : m.sender)
    if (!target) return m.reply(`*Contoh Penggunaan:*\n• ${usedPrefix + command} 6285869074622\n• ${usedPrefix + command} 121693670506723@lid\n• Atau reply pesan orang lain dengan ketik *${usedPrefix + command}*`)

    let clean = target.replace(/[^0-9@.a-z]/gi, '')
    let isTargetLid = isLid(clean) || isLidConverted(clean)

    let lid = null
    let pn = null

    if (isTargetLid) {
        lid = clean.endsWith('@lid') ? clean : clean.replace(/@.+/, '') + '@lid'
        pn = resolveAnyLidToJid(clean, participants || [], conn)
    } else {
        pn = clean.includes('@') ? clean : `${clean}@s.whatsapp.net`
        lid = resolvePnToLid(clean, conn, participants || [])
    }

    let caption = `乂  *L I D  R E S O L V E R*\n\n`
    caption += `┌  ◦ *Target Input* : ${target}\n`
    caption += `│  ◦ *Nomor JID*    : ${pn || '-'}\n`
    caption += `│  ◦ *Nomor Polos*  : ${pn ? pn.replace(/@.+/, '') : '-'}\n`
    caption += `└  ◦ *LID WhatsApp* : ${lid || '_(Belum terdeteksi di cache/sesi)_'}\n\n`
    caption += `> ✨ *Status*: ${lid && pn ? 'Tersinkronisasi Dua Arah (Bidirectional)' : 'Sebagian'}`

    await m.reply(caption)
}

handler.help = ['lid', 'ceklid']
handler.tags = ['tools']
handler.command = /^(lid|ceklid|pn2lid|lid2pn)$/i

export default handler
