// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// Auto Gempa BMKG — port dari SxcWAMdV3, API BMKG gratis no key
// Kirim notif gempa ke chat yang aktifkan .updategempa on
import fetch from 'node-fetch'

const API_GEMPA = 'https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json'

async function cekGempa(conn) {
  try {
    let db = global.db.data
    if (!db.others) db.others = {}
    if (!db.others.notifGempa) db.others.notifGempa = {}

    let setting = db.others.notifGempa
    let lastGempa = setting.lastDateTime || null

    const res = await fetch(API_GEMPA, { timeout: 15000 })
    const data = await res.json()

    const g = data?.Infogempa?.gempa
    if (!g) return

    // skip kalau sama dengan yang terakhir
    if (lastGempa === g.DateTime) return

    setting.lastDateTime = g.DateTime

    const text = `
🌍 *UPDATE GEMPA BMKG*

◦ *Tanggal:* ${g.Tanggal}
◦ *Jam:* ${g.Jam}
◦ *Wilayah:* ${g.Wilayah}
◦ *Magnitudo:* ${g.Magnitude}
◦ *Kedalaman:* ${g.Kedalaman}
◦ *Potensi:* ${g.Potensi}
◦ *Dirasakan:* ${g.Dirasakan}

🔍 Sumber: https://bmkg.go.id
`.trim()

    const chats = db.chats || {}

    for (const jid in chats) {
      let chat = chats[jid]

      // skip kalau ga aktif
      if (!chat.updategempa) continue

      // mode grup only
      if (setting.groupOnly && !jid.endsWith('@g.us')) continue

      // filter wilayah
      if (setting.filterWilayah) {
        let wilayah = g.Wilayah.toLowerCase()
        let filter = setting.filterWilayah.toLowerCase()
        if (!wilayah.includes(filter)) continue
      }

      await conn.sendMessage(jid, {
        image: { url: `https://data.bmkg.go.id/DataMKG/TEWS/${g.Shakemap}` },
        caption: text
      }).catch(() => {})
    }
  } catch (e) {
    console.error('Error cek gempa:', e)
  }
}

// Interval cek gempa setiap 5 menit
if (global.conn) {
  setInterval(() => {
    if (global.conn) cekGempa(global.conn)
  }, 300000)
}

let handler = async (m, { args, usedPrefix, command }) => {
  let db = global.db.data
  if (!db.others) db.others = {}
  if (!db.others.notifGempa) {
    db.others.notifGempa = { groupOnly: false, filterWilayah: '' }
  }
  let setting = db.others.notifGempa

  if (!args[0]) {
    return m.reply(`Gunakan:
${usedPrefix + command} on/off — aktifkan notif gempa di chat ini
${usedPrefix + command} grup on/off — mode grup-only
${usedPrefix + command} filter <wilayah> — filter wilayah (misal: "Jawa")`)
  }

  if (args[0] === 'on') {
    db.chats[m.chat] = db.chats[m.chat] || {}
    db.chats[m.chat].updategempa = true
    return m.reply('✅ Notif gempa aktif di chat ini.')
  }

  if (args[0] === 'off') {
    if (db.chats[m.chat]) db.chats[m.chat].updategempa = false
    return m.reply('❌ Notif gempa nonaktif di chat ini.')
  }

  if (args[0] === 'grup') {
    if (args[1] === 'on') {
      setting.groupOnly = true
      return m.reply('✅ Mode grup-only aktif.')
    }
    if (args[1] === 'off') {
      setting.groupOnly = false
      return m.reply('❌ Mode grup-only nonaktif.')
    }
  }

  if (args[0] === 'filter') {
    let wilayah = args.slice(1).join(' ')
    if (!wilayah) {
      setting.filterWilayah = ''
      return m.reply('❌ Filter wilayah dihapus.')
    }
    setting.filterWilayah = wilayah
    return m.reply(`✅ Filter wilayah: "${wilayah}"`)
  }

  return m.reply(`Opsi tidak valid. Gunakan:
${usedPrefix + command} on/off
${usedPrefix + command} grup on/off
${usedPrefix + command} filter <wilayah>`)
}

handler.help = ['gempa on/off', 'gempa grup on/off', 'gempa filter <wilayah>']
handler.tags = ['info']
handler.command = /^gempa$/i

export default handler
