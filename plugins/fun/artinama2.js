/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

let handler = async (m, { text }) => {
  if (!text) throw 'Namanya siapa?'
  let nama = text
  try {
    const res = await fetch('http://www.primbon.com/arti_nama.php?nama1=' + encodeURIComponent(nama) + '&proses=+Submit%21+', {
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    })
    const body = await res.text()
    let $ = cheerio.load(body)
    var y = $.html().split('arti:')[1]
    if (!y) throw 'Arti nama tidak ditemukan.'
    var t = y.split('method="get">')[1]
    var f = y.replace(t, " ")
    var x = f.replace(/<br\s*[\/]?>/gi, "\n")
    var h = x.replace(/<[^>]*>?/gm, '').trim()
    m.reply(`Arti Dari Nama ${nama} Adalah:\n\n${h}`)
  } catch (e) {
    throw e.message || 'Gagal mengambil arti nama.'
  }
}
const pluginConfig = {
  name: 'artinama2',
  alias: [],
  category: 'fun',
  description: 'Mencari arti sebuah nama (implementasi Tensura).',
  usage: '.artinama2 <nama>',
  example: '.artinama2 <nama>',
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

export { pluginConfig as config, handler };
