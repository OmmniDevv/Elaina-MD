// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import { tmpdir } from 'os'
import path, { join } from 'path'
import {
  readdirSync,
  statSync,
  unlinkSync,
  existsSync,
  readFileSync,
  watch
} from 'fs'
let handler = async (m, { conn }) => {
  const tmpDir = join(process.cwd(), 'tmp')
  let deleted = 0
  if (existsSync(tmpDir)) {
    const files = readdirSync(tmpDir)
    for (const file of files) {
      try {
        const fullPath = join(tmpDir, file)
        const stats = statSync(fullPath)
        if (stats.isFile()) {
          unlinkSync(fullPath)
          deleted++
        }
      } catch {}
    }
  }
  conn.reply(m.chat, `✅ Berhasil membersihkan ${deleted} file sementara di folder tmp!`, m)
}
handler.help = ['cleartmp']
handler.tags = ['owner']
handler.command = /^(cleartmp)$/i

handler.rowner = true

export default handler