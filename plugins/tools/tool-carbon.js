/**
 * Elaina-MD — https://github.com/OmmniDevv/Elaina-MD
 * Script by OmmniDevv — Jangan Dijual!
 */

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) throw `💻 *ᴄᴀʀʙᴏɴ*\n\nContoh: ${usedPrefix}${command} console.log('Hello World')`
  conn.sendMessage(m.chat, { react: { text: '🕕', key: m.key } })
  try {
    const { createCanvas } = await import('@napi-rs/canvas')
    const buf = await generateCarbon(createCanvas, text)
    conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    await conn.sendMessage(m.chat, { image: { url: buf }, caption: '💻 *ᴄᴀʀʙᴏɴ*' }, { quoted: m })
  } catch {
    throw '❌ Gagal generate carbon image!'
  }
}

async function generateCarbon(createCanvas, code) {
  const padding = 50, lineHeight = 24, fontSize = 16, fontFamily = 'monospace'
  const lines = code.split('\n')
  const tmp = createCanvas(100, 100)
  const tmpCtx = tmp.getContext('2d')
  tmpCtx.font = `${fontSize}px ${fontFamily}`
  let maxW = 0
  for (const l of lines) { const w = tmpCtx.measureText(l).width; if (w > maxW) maxW = w }
  const width = Math.max(800, maxW + padding * 2)
  const height = lines.length * lineHeight + padding * 2 + 20
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#1E1E1E'
  ctx.fillRect(0, 0, width, height)
  for (const [i, [color, x]] of [['#FF5F56', 20], ['#FFBD2E', 40], ['#27C93F', 60]].entries()) {
    ctx.beginPath(); ctx.arc(x, 20, 6, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill()
  }
  ctx.font = `${fontSize}px ${fontFamily}`; ctx.textBaseline = 'top'
  const keywords = ['const','let','var','function','return','if','else','for','while','async','await','new','class','import','from','export','try','catch']
  let y = padding + 20
  for (const line of lines) {
    let x = padding
    const tokens = tokenize(line, keywords)
    for (const { text, color } of tokens) {
      ctx.fillStyle = color; ctx.fillText(text, x, y); x += ctx.measureText(text).width
    }
    y += lineHeight
  }
  return canvas.toBuffer('image/png')
}

function tokenize(code, keywords) {
  const tokens = []
  const re = /(\/\/.*|".*?"|'.*?'|`.*?`|\b\d+\b|[{}[\](),.;:+\-*/%=<>!&|^~?]|\b[a-zA-Z_$][a-zA-Z0-9_$]*\b|\s+)/g
  let m
  while ((m = re.exec(code)) !== null) {
    const t = m[0]
    let color = '#D4D4D4'
    if (t.startsWith('//')) color = '#6A9955'
    else if (/^["'`]/.test(t)) color = '#CE9178'
    else if (/^\d+$/.test(t)) color = '#B5CEA8'
    else if (keywords.includes(t)) color = '#569CD6'
    else if (/^[a-zA-Z_$]/.test(t)) color = '#9CDCFE'
    tokens.push({ text: t, color })
  }
  return tokens
}

handler.help = ['carbon <kode>']
handler.tags = ['tools']
handler.command = /^(carbon)$/i
export default handler
