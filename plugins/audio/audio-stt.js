// © Elaina-MD — Speech-to-Text (STT) lokal via Whisper ONNX, no API key
// Reply audio/VN dengan .stt [lang] untuk transkripsi
import { exec } from 'child_process'
import { promisify } from 'util'
import { tmpdir } from 'os'
import { join } from 'path'
import { writeFileSync, unlinkSync, existsSync } from 'fs'
import { convertToWav, getAudioDuration, getMaxDuration, transcribeWav } from '../../lib/localStt.js'

const execAsync = promisify(exec)

const LANGS = new Set(['id', 'en', 'es', 'pt', 'fr', 'de', 'it', 'ar', 'ja', 'ko', 'zh'])

function isAudio(mime = '', mtype = '') {
  return /audio|ogg|opus|mpeg|mp4|m4a|wav|webm/i.test(mime) ||
    /audioMessage|ptt|voice/i.test(mtype)
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
  // Determine language from args
  let lang = 'id'
  if (args[0] && LANGS.has(args[0].toLowerCase())) lang = args[0].toLowerCase()

  // Get quoted audio
  const q = m.quoted ? m.quoted : m
  const mime = (q.msg || q).mimetype || ''
  const mtype = q.mtype || ''

  if (!isAudio(mime, mtype)) {
    throw `🎙️ *STT (Speech-to-Text)*\n\nReply audio/VN dengan:\n\`${usedPrefix}${command} [lang]\`\n\nBahasa: id, en, es, pt, fr, de, it, ar, ja, ko, zh\nDefault: id (Indonesia)\n\n> Contoh: reply VN lalu ketik \`${usedPrefix}${command}\`\n> Contoh English: \`${usedPrefix}${command} en\``
  }

  conn.sendMessage(m.chat, { react: { text: '🎙️', key: m.key } })

  const tmpIn = join(tmpdir(), `stt_in_${Date.now()}.ogg`)
  const tmpWav = join(tmpdir(), `stt_wav_${Date.now()}.wav`)

  try {
    // Download audio
    let media
    try { media = await q.download() } catch {}
    if (!media || !media.length) throw 'Gagal mengunduh audio'

    writeFileSync(tmpIn, media)

    // Check duration
    const duration = await getAudioDuration(tmpIn)
    if (duration > getMaxDuration()) {
      conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
      throw `😿 Audio terlalu panjang, senpai~ Maksimal ${getMaxDuration()} detik (audio ini ~${Math.ceil(duration)}s)`
    }
    if (duration < 0.3) {
      conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
      throw '😿 Audio terlalu pendek untuk ditranskripsi~'
    }

    // Convert to WAV 16kHz mono
    await convertToWav(tmpIn, tmpWav)
    if (!existsSync(tmpWav)) throw 'Gagal mengkonversi audio'

    // Transcribe
    const text = await transcribeWav(tmpWav, lang, duration)
    if (!text) {
      conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
      throw '😿 Tidak ada teks yang terdeteksi dari audio ini~\nCoba VN yang lebih jelas ya senpai~'
    }

    conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    const langLabel = lang === 'id' ? 'Indonesia' : lang.toUpperCase()
    await conn.sendMessage(m.chat, {
      text: `🎙️ *Transkripsi* (~${Math.ceil(duration)}s | ${langLabel})\n\n${text}`
    }, { quoted: m })
  } catch (e) {
    conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    if (e.message?.includes('terlalu') || e.message?.includes('Gagal') || e.message?.includes('Tidak ada')) throw e
    const hint = /ffmpeg|ffprobe/i.test(String(e.message || e))
      ? '\n\nPastikan FFmpeg terinstall.'
      : /whisper|model|onnx/i.test(String(e.message || e))
        ? '\n\nPertama kali akan download model (~40-150 MB, tanpa API).'
        : ''
    throw `😿 Error transkripsi: ${e.message || e}${hint}`
  } finally {
    for (const f of [tmpIn, tmpWav]) {
      try { if (f && existsSync(f)) unlinkSync(f) } catch {}
    }
  }
}
handler.help = ['stt [lang]', 'transcribe [lang]']
handler.tags = ['audio']
handler.command = /^(stt|transcribe|transkrip)$/i
handler.limit = true
export default handler
