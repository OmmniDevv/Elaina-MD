/**
 * Elaina-MD — https://github.com/OmmniDevv/Elaina-MD
 * Script by OmmniDevv — Jangan Dijual!
 */
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
const execAsync = promisify(exec)

const EFFECTS = {
  bass:       { emoji: '🔊', filter: 'bass=g=20:f=110:w=0.6', desc: 'Bass boost' },
  blown:      { emoji: '💥', filter: 'acrusher=level_in=4:level_out=5:bits=8:mode=log:aa=1', desc: 'Distortion' },
  deep:       { emoji: '🎤', filter: 'asetrate=44100*0.7,atempo=1.3', desc: 'Suara berat' },
  earrape:    { emoji: '📢', filter: 'volume=10,bass=g=30:f=80:w=0.6', desc: 'Earrape' },
  echo:       { emoji: '🔁', filter: 'aecho=0.8:0.88:60:0.4', desc: 'Echo/gema' },
  fast:       { emoji: '⚡', filter: 'atempo=1.5', desc: 'Percepat 1.5x' },
  nightcore:  { emoji: '🌙', filter: 'asetrate=44100*1.25,atempo=0.9', desc: 'Nightcore' },
  reverse:    { emoji: '🔄', filter: 'areverse', desc: 'Putar mundur' },
  robot:      { emoji: '🤖', filter: "afftfilt=real='hypot(re,im)*sin(0)':imag='hypot(re,im)*cos(0)':win_size=512:overlap=0.75", desc: 'Suara robot' },
  slow:       { emoji: '🐢', filter: 'atempo=0.8,asetrate=44100*0.9', desc: 'Slowed' },
  tupai:      { emoji: '🐿️', filter: 'asetrate=44100*1.5,atempo=0.8', desc: 'Chipmunk' },
  superfast:  { emoji: '💨', filter: 'atempo=2.0', desc: 'Percepat 2x' },
  superslow:  { emoji: '🦥', filter: 'atempo=0.5', desc: 'Perlambat 2x' },
  tremolo:    { emoji: '〰️', filter: 'tremolo=f=8:d=0.7', desc: 'Tremolo' },
  vibrato:    { emoji: '🎸', filter: 'vibrato=f=7:d=0.5', desc: 'Vibrato' },
  phone:      { emoji: '📞', filter: 'highpass=f=300,lowpass=f=3400,volume=1.5', desc: 'Suara telepon' },
  cave:       { emoji: '🕳️', filter: 'aecho=0.8:0.9:500:0.3,aecho=0.8:0.9:1000:0.2', desc: 'Gema gua' },
  demon:      { emoji: '👹', filter: 'asetrate=44100*0.5,atempo=1.5,aecho=0.8:0.88:200:0.5', desc: 'Suara iblis' },
  helium:     { emoji: '🎈', filter: 'asetrate=44100*2.0,atempo=0.6', desc: 'Suara helium' },
}

const EFFECT_NAMES = Object.keys(EFFECTS)

let handler = async (m, { conn, command, usedPrefix }) => {
  const effectName = command === 'audiofx' ? (m.text?.split(' ')[0]?.toLowerCase()) : command.toLowerCase()
  if (!effectName || effectName === 'list' || !EFFECTS[effectName]) {
    let txt = `🎧 *AUDIO FX* — ${EFFECT_NAMES.length} effects\n\nReply audio/video lalu ketik efeknya:\n\n`
    for (const [n, fx] of Object.entries(EFFECTS)) txt += `${fx.emoji} *.${n}* — ${fx.desc}\n`
    return m.reply(txt)
  }
  const fx = EFFECTS[effectName]
  const q = m.quoted || m
  const isAudio = /audio|video/.test((q.msg || q)?.mimetype || '')
  if (!isAudio) return m.reply(`${fx.emoji} *${effectName.toUpperCase()}*\n\nReply audio/video dengan command ini`)
  conn.sendMessage(m.chat, { react: { text: '🕕', key: m.key } })
  const tempDir = path.join(process.cwd(), 'tmp')
  fs.mkdirSync(tempDir, { recursive: true })
  const ts = Date.now()
  const inputPath = path.join(tempDir, `fx_in_${ts}.ogg`)
  const outputPath = path.join(tempDir, `fx_out_${ts}.mp3`)
  try {
    const buf = await q.download()
    if (!buf?.length) throw '❌ Gagal download media'
    fs.writeFileSync(inputPath, buf)
    await execAsync(`ffmpeg -y -i "${inputPath}" -af "${fx.filter}" -vn "${outputPath}"`)
    if (!fs.existsSync(outputPath)) throw '❌ Gagal memproses audio'
    const audioBuf = fs.readFileSync(outputPath)
    await conn.sendMessage(m.chat, { audio: audioBuf, mimetype: 'audio/mpeg', ptt: false }, { quoted: m })
    conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  } finally {
    [inputPath, outputPath].forEach(f => { try { fs.unlinkSync(f) } catch {} })
  }
}
handler.help = ['audiofx list', ...EFFECT_NAMES.map(n => n)]
handler.tags = ['tools']
handler.command = new RegExp(`^(audiofx|${EFFECT_NAMES.join('|')})$`, 'i')
export default handler
