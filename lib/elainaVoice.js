// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// Elaina Persona Voice — bikin text bot jadi waifuable & moe
// Semua data persona dibaca dari global.elaina_persona (config.js)
// Usage:  import { elainaSay, elainaReact } from '../../lib/elainaVoice.js'
//         await m.reply(elainaSay('sukses', 'stikernya udah jadi lho~'))

// ─── Helper ─────────────────────────────────────────────────
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

function P() {
  // Fallback kalau global.elaina_persona belum di-set
  return global.elaina_persona || {
    reactions: {
      seneng: ['Ehehe~'], malu: ['E-Eh?!'], mikir: ['Hmm~'],
      marah: ['Mouu!'], ngantuk: ['Fuaa~'], gagal: ['Uwahh...'],
      sukses: ['Dekita~'], selamat: ['Omedetou~'], sayang: ['Daisuki~'],
      salam: ['Ohayou~'], pamit: ['Jaa ne~']
    },
    emoji: {},
    footer: '♡ Elaina-chan',
    sticker_packname: 'Elaina-chan ♡',
    sticker_author: 'OmmniDevv'
  }
}

function react(emotion) {
  const p = P()
  const r = p.reactions?.[emotion]
  const e = p.emoji?.[emotion]
  let txt = r?.length ? pick(r) : ''
  if (e?.length) txt += ' ' + pick(e)
  return txt.trim()
}

// ─── Template pesan moe per konteks ─────────────────────────
const TEMPLATES = {
  noargs:   (hint) => `${react('mikir')} ${hint}`,
  loading:  () => `${react('mikir')} tunggu sebentar ya~ aku proses dulu... ♡`,
  sukses:   (extra) => `${react('sukses')} ${extra || 'berhasil dibuat lho~'}`,
  gagal:    (why) => `${react('gagal')} ${why || 'ada sedikit masalah... coba lagi yuk~'}`,
  notfound: (what) => `${react('mikir')} hmm, ${what || 'hasilnya'} tidak ketemu... mungkin salah link?`,
  limit:    () => `${react('marah')} limit kamu habis... coba lagi besok ya~`,
  prem:     () => `${react('mikir')} fitur ini khusus premium...`,
  owner:    () => `${react('marah')} fitur ini khusus owner!`,
  grup:     () => `${react('mikir')} fitur ini cuma bisa di grup~`,
  daftar:   () => `${react('mikir')} kamu belum terdaftar... ketik .daftar dulu ya~`,
  cooldown: (s) => `${react('ngantuk')} sabar dong~ tunggu ${s} detik lagi ya...`,
  ban:      () => `${react('gagal')} kamu sudah di-ban...`,
}

// ─── API utama ──────────────────────────────────────────────

/**
 * elainaSay(kind, extra)
 * kind: key di TEMPLATES ('sukses','gagal','noargs','loading', dll)
 * extra: teks tambahan (opsional)
 */
export function elainaSay(kind, extra) {
  const fn = TEMPLATES[kind]
  if (!fn) return extra || react('mikir')
  return fn(extra)
}

/**
 * elainaGreeting(hour) — sapaan sesuai waktu WIB
 */
export function elainaGreeting(hour) {
  const h = hour ?? new Date(Date.now() + 7 * 3600000).getUTCHours()
  if (h >= 4 && h < 11) return `${react('salam')} Selamat pagi~ ☀️`
  if (h >= 11 && h < 15) return `${react('salam')} Selamat siang~ 🌤️`
  if (h >= 15 && h < 19) return `${react('salam')} Selamat sore~ 🌆`
  return `${react('salam')} Selamat malam~ 🌙`
}

/**
 * elainaReact(kind) — emoji pendek buat react message WA
 * kind: 'seneng','sukses','gagal','mikir','malu','sayang'
 */
export function elainaReact(kind) {
  const map = {
    seneng: ['💗', '🎀', '✨', '🌸'],
    sukses: ['✅', '🎀', '🌟', '💫'],
    gagal:  ['❌', '🥺', '💧', '💢'],
    mikir:  ['🤔', '💭', '☁️', '🌟'],
    marah:  ['😤', '💢'],
    malu:   ['😳', '🫣', '💞'],
    sayang: ['💗', '💓', '💕', '❤️']
  }
  return pick(map[kind] || map.sayang)
}

/**
 * elainaFooter() — footer text buat pesan panjang
 */
export function elainaFooter() {
  return P().footer || '♡ Elaina-chan'
}

/**
 * elainaStickerMeta() — { packname, author } buat sticker
 */
export function elainaStickerMeta() {
  const p = P()
  return {
    packname: p.sticker_packname || 'Elaina-chan ♡',
    author: p.sticker_author || 'OmmniDevv'
  }
}

export default { elainaSay, elainaGreeting, elainaReact, elainaFooter, elainaStickerMeta, TEMPLATES }
