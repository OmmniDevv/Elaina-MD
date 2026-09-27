/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import fs from 'fs'
import similarity from 'similarity'

let timeout = 120000
let poin = 4999
const threshold = 0.72

const pluginConfig = {
  name: "lengkapikalimat",
  alias: [],
  category: "game",
  description: "Imported from Rimuru MD V4.6",
  usage: "",
  example: "",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock, prefix }) {
    const conn = sock;
    const usedPrefix = prefix || m.prefix || ".";
  conn.lengkapikalimat = conn.lengkapikalimat ? conn.lengkapikalimat : {}

  let id = m.chat
  if (id in conn.lengkapikalimat)
    return m.reply('Masih ada soal yang belum terjawab di chat ini!')

  let src = JSON.parse(fs.readFileSync('../../json/lengkapikalimat.json'))
  let json = src[Math.floor(Math.random() * src.length)]

  let soal = json.soal || '-'
  let jawaban = (json.jawaban || '').toLowerCase().trim()

  let caption = `
*LENGKAPI KALIMAT*

${soal}

⏱️ Timeout ${(timeout / 1000)} detik
💎 Bonus ${poin} XP

Ketik *nyerah* untuk menyerah
`.trim()

  let msg = await m.reply(caption)

  conn.lengkapikalimat[id] = [
    msg,
    { soal, jawaban },
    poin,
    setTimeout(() => {
      if (conn.lengkapikalimat[id]) {
        m.reply(`⏰ Waktu habis!\nJawaban: *${jawaban}*`)
        delete conn.lengkapikalimat[id]
      }
    }, timeout)
  ]
}


handler.before = async function (m, { conn }) {
  conn.lengkapikalimat = conn.lengkapikalimat ? conn.lengkapikalimat : {}

  let id = m.chat
  if (!(id in conn.lengkapikalimat)) return

  let [msg, data, poin, time] = conn.lengkapikalimat[id]
  if (!m.text) return

  let teks = m.text.toLowerCase().replace(/\s+/g, ' ').trim()
  let jawaban = data.jawaban

  if (/^((me)?nyerah|surr?ender)$/i.test(teks)) {
    clearTimeout(time)
    delete conn.lengkapikalimat[id]
    m.reply(`🏳️ *Menyerah!*\nJawaban: *${jawaban}*`)
    return true
  }

  if (teks === jawaban) {
    clearTimeout(time)
    delete conn.lengkapikalimat[id]
    global.db.data.users[m.sender].exp += poin
    m.reply(`✅ *Benar!*\nJawaban: *${jawaban}*\n+${poin} XP`)
    return true
  }

  if (similarity(teks, jawaban) >= threshold) {
    m.reply('🤏 Dikit lagi!')
    return true
  }

  return true
}

export { pluginConfig as config, handler };
