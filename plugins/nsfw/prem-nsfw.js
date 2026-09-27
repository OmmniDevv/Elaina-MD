// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// Credits: Letta - Sama 💗🐰
// Recode 2026: waifu.im NSFW API

import fetch from 'node-fetch'

function pickRandom(list) { return list[Math.floor(Math.random() * list.length)] }

// waifu.im NSFW tags (dites 2026-09-26: semua 200 OK)
// waifu.pics mati total → trap/blowjob dipetakan ke waifu.im juga
const WAIFUIM_NSFW = ['ero', 'ecchi', 'hentai', 'milf', 'oral', 'paizuri', 'ass', 'oppai', 'trap', 'blowjob']

async function getNsfwImg(tag) {
  const imTag = WAIFUIM_NSFW.includes(tag) ? tag : 'ecchi'
  const res = await fetch(`https://api.waifu.im/images?IncludedTags=${imTag}&IsNsfw=True`)
  const json = await res.json()
  return json.items?.[0]?.url
}

// Map command → waifu.im/waifu.pics tag
const tagMap = {
  ahegao: 'ecchi', anal: 'oral', ass: 'ass', blowjob: 'oral',
  cums: 'oral', ecchi: 'ecchi', ero: 'ero', erofeet: 'ecchi',
  erogirl: 'ero', holoero: 'ecchi', erokitsune: 'ecchi', eroneko: 'ecchi',
  eroyuri: 'ecchi', feet: 'ecchi', femdom: 'ecchi', futanari: 'ecchi',
  girlsolo: 'ero', hentai: 'hentai', holo: 'ecchi', kitsune: 'ecchi',
  kuni: 'oral', loli: 'ecchi', manga: 'hentai', milf: 'milf',
  mstrb: 'ero', neko: 'ecchi', panties: 'ecchi', pussy: 'ero',
  oppai: 'oppai', spank: 'ecchi', tentacles: 'hentai', thighs: 'ecchi',
  tits: 'oppai', trap: 'ecchi', uniform: 'ecchi', waifu: 'ecchi',
  yaoi: 'ecchi', yuri: 'ecchi'
}

let handler = async (m, { conn, command, args, usedPrefix }) => {
  if (global.db.data.chats[m.chat].nsfw == false && m.isGroup)
    return m.reply('❗ NSFW di chat ini belum diaktifkan oleh admin group')

  const type = (args[0] || '').toLowerCase()
  const ch = global.db.data.chats[m.chat].premnsfw

  const p = '🅟 | ', f = 'Ⓕ | '
  const teks = `┊ 📮 Silahkan Pilih Dibawah!\n┊› Atau ketik ${usedPrefix}nsfw <kategori>\n❏──···––`

  const sections = [{
    title: 'KATEGORI NSFW',
    rows: Object.keys(tagMap).map(k => ({ title: `${f}${k.charAt(0).toUpperCase() + k.slice(1)}`, rowId: `.nsfw ${k}` }))
  }]

  if (!type) return conn.sendMessage(m.chat, {
    interactiveMessage: {
      footer: 'Ⓕ = Free',
      contextInfo: { forwardingScore: 7, isForwarded: true },
      nativeFlowMessage: {
        messageParamsJson: JSON.stringify({ bottom_sheet: { button_title: '🔞 Pilih Kategori' } }),
        buttons: [{
          name: 'single_select',
          buttonParamsJson: JSON.stringify({
            title: '🔞 Pilih Kategori NSFW',
            sections: [{ title: 'KATEGORI NSFW', rows: Object.keys(tagMap).map(k => ({ title: `Ⓕ ${k.charAt(0).toUpperCase() + k.slice(1)}`, id: `.nsfw ${k}` })) }]
          })
        }]
      }
    }
  }, { quoted: m })

  const tag = tagMap[type] || 'ecchi'
  const url = await getNsfwImg(tag)
  if (!url) throw 'Gagal mengambil gambar NSFW'

  await conn.sendMessage(m.chat, {
    image: { url },
    caption: `\`\`\`➩ Random Image Nsfw ${type}\`\`\``
  }, { quoted: m })
}

handler.help = ['nsfw <kategori>']
handler.tags = ['nsfw']
handler.command = /^(nsfw)$/i
handler.nsfw = true
handler.premium = true
export default handler
