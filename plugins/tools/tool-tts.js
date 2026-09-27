// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import gtts from 'node-gtts'
import { readFileSync, unlinkSync, mkdirSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'

const defaultLang = 'id'
let handler = async (m, { conn, args, usedPrefix, command }) => {

  let lang = args[0]
  let text = args.slice(1).join(' ')
  if ((args[0] || '').length !== 2) {
    lang = defaultLang
    text = args.join(' ')
  }
  if (!text && m.quoted?.text) text = m.quoted.text

  let res
  try { res = await tts(text, lang) }
  catch (e) {
    m.reply(e + '')
    text = args.join(' ')
    if (!text) throw `Use example ${usedPrefix}${command} en hello world`
    res = await tts(text, defaultLang)
  } finally {
    if (res) conn.sendFile(m.chat, res, 'tts.opus', null, m, true)
  }
}
handler.help = ['tts <lang> <teks>']
handler.tags = ['tools']
handler.command = /^g?tts$/i

export default handler

function tts(text, lang = 'id') {
  console.log(lang, text)
  return new Promise((resolve, reject) => {
    try {
      let tts = gtts(lang)
      const dir = join(tmpdir(), 'elaina-tts')
      mkdirSync(dir, { recursive: true })
      let filePath = join(dir, (1 * new Date) + '.wav')
      tts.save(filePath, text, () => {
        try {
          resolve(readFileSync(filePath))
        } finally {
          try { unlinkSync(filePath) } catch {}
        }
      })
    } catch (e) { reject(e) }
  })
}