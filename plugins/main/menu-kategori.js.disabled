// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
const EMOJI_MAP = {
  game: '🎮', rpg: '⚔️', tools: '🔧', downloader: '📥',
  sticker: '🖼️', anime: '🌸', fun: '🎉', quotes: '💬',
  internet: '🌐', group: '👥', admin: '🛡️', owner: '👑',
  info: 'ℹ️', ai: '🤖', audio: '🎵', xp: '📊',
  islamic: '☪️', quran: '📖', nulis: '✏️', nsfw: '🔞',
  main: '🏠'
}

function getEmoji(tag) {
  return EMOJI_MAP[tag?.toLowerCase()] || '📁'
}

function getCategories() {
  const cats = {}
  for (const [name, plugin] of Object.entries(global.plugins || {})) {
    if (!plugin || plugin.disabled) continue
    const tags = Array.isArray(plugin.tags) ? plugin.tags : (plugin.tags ? [plugin.tags] : [])
    for (const rawTag of tags) {
      // tags can be 'quotes|anime' style
      for (const tag of rawTag.split('|')) {
        const t = tag.trim().toLowerCase()
        if (!t) continue
        if (!cats[t]) cats[t] = []
        // collect command names
        const cmd = plugin.command
        if (cmd instanceof RegExp) {
          const src = cmd.source.replace(/^\^?\(?|\)?\$?$/g, '').replace(/\?/g, '').split('|')[0]
          cats[t].push(src)
        } else if (Array.isArray(cmd)) {
          cats[t].push(...cmd.map(c => c instanceof RegExp ? c.source.split('|')[0] : c))
        } else if (typeof cmd === 'string') {
          cats[t].push(cmd)
        }
      }
    }
  }
  return cats
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const cats = getCategories()
  const arg = text?.trim().toLowerCase()

  if (!arg) {
    // Show category list
    const sorted = Object.entries(cats).sort((a, b) => a[0].localeCompare(b[0]))
    let txt = `╭──────────────────\n`
    txt += `│ 📂 *DAFTAR KATEGORI*\n`
    txt += `│ ${global.namebot || 'Elaina BOT'}\n`
    txt += `╰──────────────────\n\n`
    for (const [cat, cmds] of sorted) {
      txt += `│ ${getEmoji(cat)} *${cat.toUpperCase()}* — ${cmds.length} cmd\n`
    }
    txt += `\n╰──────────────────\n`
    txt += `\n💡 Ketik *${usedPrefix}${command} <kategori>*\nContoh: *${usedPrefix}${command} tools*`
    return conn.sendMessage(m.chat, { text: txt, ...global.adReply }, { quoted: m })
  }

  // Show commands in category
  const cmds = cats[arg]
  if (!cmds || !cmds.length) throw `Kategori *${arg}* tidak ditemukan.\n\nKetik *${usedPrefix}${command}* untuk melihat daftar kategori.`

  const unique = [...new Set(cmds)].sort()
  let txt = `╭──────────────────\n`
  txt += `│ ${getEmoji(arg)} *${arg.toUpperCase()}*\n`
  txt += `│ ${unique.length} command tersedia\n`
  txt += `╰──────────────────\n\n`
  for (const cmd of unique) {
    txt += `│ ❀ ${usedPrefix}${cmd}\n`
  }
  txt += `\n╰──────────────────`
  conn.sendMessage(m.chat, { text: txt, ...global.adReply }, { quoted: m })
}

handler.help = ['menucat [kategori]']
handler.tags = ['main']

handler.command = /^(menucat|mc|kategori)$/i
export default handler
