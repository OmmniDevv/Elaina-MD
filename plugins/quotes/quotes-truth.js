// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import { elainaFooter } from '../../lib/elainaVoice.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataPath = path.join(__dirname, '../../data/truth.json')

let handler = async (m, { conn, usedPrefix }) => {
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
  const truth = data[Math.floor(Math.random() * data.length)]

  conn.sendButton(m.chat, `*${global.htki} ᴛʀᴜᴛʜ ${global.htka}*

${truth}`, elainaFooter(), null, [
    ['💗 Truth', `${usedPrefix}truth`],
    ['🔥 Dare', `${usedPrefix}dare`]
  ], m)
}

handler.help = ['truth']
handler.tags = ['quotes']
handler.command = /^(truth)$/i

export default handler
