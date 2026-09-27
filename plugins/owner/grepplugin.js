/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import fs from 'fs'
import path from 'path'

const handler = async (m, { text }) => {
  if (!text) throw 'Masukin keyword\nContoh: .grepplugin conn.'

  const dir = './plugins'
  let results = []

  function scan(folder) {
    let files = fs.readdirSync(folder)
    for (let file of files) {
      let full = path.join(folder, file)
      let stat = fs.statSync(full)

      if (stat.isDirectory()) {
        scan(full)
      } else if (file.endsWith('.js')) {
        let data = fs.readFileSync(full, 'utf-8')
        let lines = data.split('\n')

        lines.forEach((line, i) => {
          if (line.includes(text)) {
            results.push(`${full} (baris ${i + 1})`)
          }
        })
      }
    }
  }

  scan(dir)

  if (!results.length) {
    return m.reply(`Tidak ditemukan keyword: ${text}`)
  }

  let res = `📦 Hasil grep plugin\nKeyword: ${text}\n\n`
  res += results.map((v, i) => `${i + 1}. ${v}`).join('\n')

  m.reply(res)
}

handler.help = ['grepplugin <keyword>']
handler.tags = ['tools']
handler.command = /^grepplugin$/i
handler.owner = true
handler.limit = false

export default handler
