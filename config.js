// ╔══════════════════════════════════════════════════════╗
// ║         E L A I N A - M D  WhatsApp BOT              ║
// ║  Source Code: https://github.com/OmmniDevv/Elaina-MD ║
// ║  Author     : https://github.com/OmmniDevv           ║
// ║  Script ini GRATIS untuk semua orang.                ║
// ║  DILARANG KERAS diperjualbelikan!                    ║
// ╚══════════════════════════════════════════════════════╝

// - - THANKS & CREDITS - -
// • Allah SWT
// • Nurutomo & Bochilgaming
// • Hyuu / Zann (Ourin MD)
// • Anita Putri Azzahra (Rimuru MD)
// • OmmniDevv (Elaina MD)

import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import moment from 'moment-timezone'
import { getDatabase } from './src/lib/elaina-database.js'
import * as ownerPremiumDb from './src/lib/elaina-premium-db.js'

/*============= WAKTU =============*/
let wibh = moment.tz('Asia/Jakarta').format('HH')
let wibm = moment.tz('Asia/Jakarta').format('mm')
let wibs = moment.tz('Asia/Jakarta').format('ss')
let wktuwib = `${wibh} H ${wibm} M ${wibs} S`

let d = new Date(new Date + 3600000)
let locale = 'id'
let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
let week = d.toLocaleDateString(locale, { weekday: 'long' })
let date = d.toLocaleDateString(locale, {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})

/*============== SOCIAL ==============*/
global.sig = 'https://instagram.com/'
global.sgh = 'https://github.com/OmmniDevv'
global.sgc = 'https://chat.whatsapp.com/'
global.sdc = '-'
global.snh = 'https://nhentai.net/g/HaramTod🗿'

/*============== PAYMENT ==============*/
global.pdana = '085869074622'
global.ppulsa = '085869074622'
global.psaweria = '-'

/*============== NOMOR ==============*/
global.nomorbot = '6285187605007'
global.nomorown = '6285869074622'
global.namebot = 'Elaina BOT'
global.nameown = 'ZansLord'

global.usePairingCode = true
global.pairingNumber = '6285187605007'

/*============== STAFF ==============*/
global.owner = [
  ['6285869074622', '❦ Zans Lord? 🎐', true],
  ['121693670506723', '❦ Zans Lord (LID)? 🎐', true]
]
global.mods = []
global.prems = []

/*============== API ==============*/
global.APIs = {
  amel: 'https://melcanz.com',
  violetics: 'https://violetics.pw',
  velixs: 'https://api.velixs.com',
  siputzx: 'https://api.siputzx.my.id',
  vreden: 'https://api.vreden.my.id',
  nexray: 'https://api.nexray.eu.cc',
  nexrayweb: 'https://api.nexray.web.id',
  deline: 'https://api.deline.web.id',
  emiliabot: 'https://api.emiliabot.my.id',
  dnsgoogle: 'https://dns.google',
  lolhuman: 'https://api.lolhuman.xyz',
  neoxr: 'https://api.neoxr.eu',
  fgsi: 'https://api.fgsi.com',
  covenant: 'https://covenant.sbs',
  delirius: 'https://deliriussapi-oficial.vercel.app',
  btch: 'https://api.botcahx.eu.org'
}

global.APIKeys = {
  'https://melcanz.com': 'ISI_APIKEY_MELCANZ_DISINI',
  'https://violetics.pw': 'ISI_APIKEY_VIOLETICS_DISINI',
  'https://api.velixs.com': 'c304a8e5ce63abfd13cc004073ba8eaaf146364197da879257',
  velixs: 'c304a8e5ce63abfd13cc004073ba8eaaf146364197da879257',
  gemini: 'AQ_REDACTED',
  groq: 'gsk_REDACTED',
  covenant: 'cov_live_bb660c9e5f735e46d808b7ae362914cfe35c2936739ee2b2',
  rajaongkir: 'ISI_APIKEY_RAJAONGKIR_DISINI',
  google: 'AIzaSy_REDACTED',
  lolhuman: 'APIKey-Milik-Bot-OurinMD(Zann,HyuuSATANN,Keisya,Danzz)',
  neoxr: 'Milik-Bot-OurinMD',
  fgsi: 'fgsiapi-20c1605c-6d',
  betabotz: 'Btz-67YfP',
  onlym: 'ONLym-783d29',
  obscura: 'obs-byOn9RVGMzvPXZQTsP9W',
  firefly: 'OurinNextGen',
  cuki: 'cuki-x'
}

/*============== WATERMARK ==============*/
global.wm = '                「 ᴇʟᴀɪɴᴀ 𝙱𝙾𝚃 汉  」'
global.wm2 = '꒷︶꒷꒥꒷ ‧₊˚ ꒰ฅ˘ᴇʟᴀɪɴᴀ - ᴄʜᴀɴ˘ฅ ꒱ ‧₊˚꒷︶꒷꒥꒷'
global.wm3 = '⫹⫺ ᴇʟᴀɪɴᴀ 𝙱𝙾𝚃'
global.wmcredit = '⫹⫺ github.com/OmmniDevv/Elaina-MD'
global.botdate = `⫹⫺ 𝗛𝗮𝗿𝗶: ${week} ${date}`
global.bottime = `𝗪𝗮𝗸𝘁𝘂 : ${wktuwib}`
global.titlebot = '🎋 ┊ 𝗥𝗣𝗚 ʙᴏᴛ ᴡʜᴀᴛsᴀᴘᴘ'
global.author = global.wm

/*============== PERSONA / VOICE ==============*/
global.elaina_persona = {
  reactions: {
    seneng:   ['Ehehe~', 'Yay~', 'Hihi~', 'Yatta~', 'Ufufu~'],
    malu:     ['E-Eh?!', 'H-Hentee...', 'Mouu~', 'I-Iya...', 'Hngg...'],
    mikir:    ['Hmm~', 'Chotto~', 'Eto...', 'Nee~'],
    marah:    ['Mouu!', 'Hmph!', 'Jangan gitu dong~', 'Yada~'],
    ngantuk:  ['Fuaa~', 'Nemui...', 'Yawn~', 'Suyaa~'],
    gagal:    ['Ehh?!', 'Uwahh...', 'Hics...', 'Kuso~'],
    sukses:   ['Dekita~', 'Sippu~', 'Yoshi~', 'Hehe~', 'Kantan~'],
    selamat:  ['Omedetou~', 'Yatta ne~', 'Sugoi~'],
    sayang:   ['Daisuki~', 'Suki~', 'Kawaii~', 'Fuee~'],
    salam:    ['Ohayou~', 'Konnichiwa~', 'Konbanwa~', 'Hisashiburi~'],
    pamit:    ['Jaa ne~', 'Oyasumi~', 'Mata ne~', 'See you~']
  },
  emoji: {
    seneng:  ['♡', '✧', '🌸'],
    sukses:  ['♪', '✧', '☆'],
    gagal:   ['💧', '🥺'],
    mikir:   ['☁️', '✧'],
    sayang:  ['♡', '💗'],
    salam:   ['🌸', '☀️']
  },
  footer: `꒷︶꒷꒥꒷ ‧₊˚ ${global.namebot} ‧₊˚꒷︶꒷꒥꒷ ♡`,
  sticker_packname: 'ᴇʟᴀɪɴᴀ 𝙱𝙾𝚃 ♡',
  sticker_author: global.nameown
}

/*============== LOGO ==============*/
global.thumb = './assets/images/elaina-thumbnail.jpg'
global.thumb2 = './assets/images/elaina-thumbnail2.jpg'
global.thumbAllmenu = './assets/images/elaina-allmenu.jpeg'
global.thumbDaftar = './assets/images/elaina-daftar.jpg'
global.thumbbc = 'https://telegra.ph/file/05f874dc87f7e27fa8127.jpg'
global.giflogo = 'https://telegra.ph/file/a46ab7fa39338b1f54d5a.mp4'
global.fla = 'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextType=1&fillTextPattern=Warning!&text='

/*============== TEXT ==============*/
global.wait = '```「▰▰▰▱▱▱▱▱▱▱」Loading...```'
global.eror = '```404 error```'

/*=========== TYPE DOCUMENT ===========*/
global.dpptx = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
global.ddocx = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
global.dxlsx = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
global.dpdf = 'application/pdf'
global.drtf = 'text/rtf'
global.thumbdoc = 'https://telegra.ph/file/6e45318d7c76f57e4a8bd.jpg'
global.fsizedoc = '99999999999999'
global.fpagedoc = '999'

/*=========== HIASAN ===========*/
global.dmenut = 'ଓ═┅═━–〈'
global.dmenub = '┊↬'
global.dmenub2 = '┊'
global.dmenuf = '┗––––––––––✦'
global.dashmenu = '┅━━━═┅═❏ *ღ 𝘿𝘼𝙎𝙃𝘽𝙊𝘼𝙍𝘿 ღ* ❏═┅═━━━┅'
global.cmenut = '❏––––––『'
global.cmenuh = '』––––––'
global.cmenub = '┊❀'
global.cmenuf = '┗━═┅═━––––––๑\n'
global.cmenua = '\n⌕ ❙❘❙❙❘❙❚❙❘❙❙❚❙❘❙❘❙❚❙❘❙❙❚❙❘❙❙❘❙❚❙❘ ⌕\n     '
global.pmenus = '┊'
global.htki = '––––––『'
global.htka = '』––––––'
global.lopr = 'Ⓟ'
global.lolm = 'Ⓛ'
global.htjava = '⫹⫺'
global.hsquere = ['⛶','❏','⫹⫺']

/*============== STICKER WM ==============*/
global.stickpack = 'ᴇʟᴀɪɴᴀ 𝙱𝙾𝚃 ♡'
global.stickauth = `☂︎\n𝗘\nl\na\ni\nn\na\n-\n𝗕\n𝗢\n𝗧\n✦\n\n⫹⫺ Whatsapp BOT\nwa.me/${global.nomorbot}`
global.multiplier = 38

/*============== EMOJI ==============*/
global.rpg = {
  emoticon(string) {
    string = string.toLowerCase()
    let emot = {
      level: '📊',
      limit: '🎫',
      health: '❤️',
      exp: '✨',
      money: '💹',
      bank: '🏦',
      potion: '🥤',
      diamond: '💎',
      common: '📦',
      uncommon: '🛍️',
      mythic: '🎁',
      legendary: '🗃️',
      superior: '💼',
      pet: '🔖',
      trash: '🗑',
      armor: '🥼',
      sword: '⚔️',
      pickaxe: '⛏️',
      fishingrod: '🎣',
      wood: '🪵',
      rock: '🪨',
      string: '🕸️',
      horse: '🐴',
      cat: '🐱',
      dog: '🐶',
      fox: '🦊',
      petFood: '🍖',
      iron: '⛓️',
      gold: '🪙',
      emerald: '❇️',
      upgrader: '🧰'
    }
    let results = Object.keys(emot).map(v => [v, new RegExp(v, 'gi')]).filter(v => v[1].test(string))
    if (!results.length) return ''
    else return emot[results[0][0]]
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPREHENSIVE CONFIG OBJECT (Used by ported modules & native engine)
// ═══════════════════════════════════════════════════════════════════════════
const config = {
  info: {
    website: 'https://github.com/OmmniDevv/Elaina-MD',
    grupwa: '',
  },

  owner: {
    name: global.nameown || 'ZansLord',
    number: [global.nomorown || '6285869074622', '121693670506723'],
  },

  session: {
    pairingNumber: global.pairingNumber || '6285187605007',
    usePairingCode: true,
  },

  fake_call: {
    active: true,
    usePairing: true,
    dir: './session_voip',
  },

  bot: {
    name: global.namebot || 'Elaina BOT',
    version: '6.2.0',
    developer: 'OmmniDevv',
    number: global.nomorbot || '6285187605007',
  },

  assets: {
    'elaina-daftar': 'https://files.catbox.moe/h1tjy0.png',
    'elaina-demote': 'https://files.catbox.moe/68d3cq.jpg',
    'elaina-fishit': 'https://files.catbox.moe/d7mzg4.jpg',
    'elaina-games': 'https://files.catbox.moe/gw8tg2.png',
    'elaina-landscape': 'https://files.catbox.moe/dokjwu.jpg',
    'elaina-levelup': 'https://files.catbox.moe/5k43y6.jpg',
    'elaina-minecraft': 'https://files.catbox.moe/7go19u.jpg',
    'elaina-promote': 'https://files.catbox.moe/x4gwyj.png',
    'elaina-rpg': 'https://files.catbox.moe/t4m0fl.jpg',
    'elaina-rules': 'https://files.catbox.moe/tpjx2v.jpg',
    'elaina-store': 'https://files.catbox.moe/31h3re.png',
    'elaina-v2': 'https://files.catbox.moe/s1fkp1.png',
    'elaina-v8': 'https://files.catbox.moe/zmwnc8.jpg',
    'elaina-winner': 'https://files.catbox.moe/r98yoe.jpg',
    'elaina': 'https://files.catbox.moe/tfkuf4.jpg',
    'elaina2': 'https://files.catbox.moe/n4kh4f.jpg',
    'elaina3': 'https://files.catbox.moe/uu2q0l.jpg',
    'pp-kosong': 'https://files.catbox.moe/7e4y9f.jpg',
    'elaina-mp4': 'https://files.catbox.moe/lqkp1p.mp4',
    'elaina-mp3': 'https://files.catbox.moe/t6xzd2',
    'elaina-font': './assets/rimuru-font.ttf',
    'elaina-kertas': 'https://files.catbox.moe/8j4d2s.jpg',
    // Alias untuk aset bertema rimuru jika dipanggil oleh plugin lama:
    'rimuru-daftar': 'https://files.catbox.moe/h1tjy0.png',
    'rimuru-demote': 'https://files.catbox.moe/68d3cq.jpg',
    'rimuru-fishit': 'https://files.catbox.moe/d7mzg4.jpg',
    'rimuru-games': 'https://files.catbox.moe/gw8tg2.png',
    'rimuru-landscape': 'https://files.catbox.moe/dokjwu.jpg',
    'rimuru-levelup': 'https://files.catbox.moe/5k43y6.jpg',
    'rimuru-minecraft': 'https://files.catbox.moe/7go19u.jpg',
    'rimuru-promote': 'https://files.catbox.moe/x4gwyj.png',
    'rimuru-rpg': 'https://files.catbox.moe/t4m0fl.jpg',
    'rimuru-rules': 'https://files.catbox.moe/tpjx2v.jpg',
    'rimuru-store': 'https://files.catbox.moe/31h3re.png',
    'rimuru-v2': 'https://files.catbox.moe/s1fkp1.png',
    'rimuru-v8': 'https://files.catbox.moe/zmwnc8.jpg',
    'rimuru-winner': 'https://files.catbox.moe/r98yoe.jpg',
    'rimuru': 'https://files.catbox.moe/tfkuf4.jpg',
    'rimuru2': 'https://files.catbox.moe/n4kh4f.jpg',
    'rimuru3': 'https://files.catbox.moe/uu2q0l.jpg',
    'rimuru-mp4': 'https://files.catbox.moe/lqkp1p.mp4',
    'rimuru-mp3': 'https://files.catbox.moe/t6xzd2',
    'rimuru-font': './assets/rimuru-font.ttf',
    'rimuru-kertas': 'https://files.catbox.moe/8j4d2s.jpg',
    'riooxdzz': 'https://files.catbox.moe/tvgwvn.png',
  },

  mode: 'public',

  command: {
    prefix: '.',
  },

  vercel: {
    token: 'vcp_REDACTED',
  },

  payment: {
    qrisUrl: '',
    methods: [
      { name: 'Dana', number: global.pdana, holder: global.nameown },
      { name: 'GoPay', number: global.ppulsa, holder: global.nameown },
      { name: 'OVO', number: '', holder: '' },
      { name: 'ShopeePay', number: '', holder: '' },
    ],
    banks: [],
    customText: 'https://imgdrop.web.id/KodpV.webp',
  },

  donasi: {
    payment: [
      { name: 'Dana', number: global.pdana, holder: global.nameown },
      { name: 'GoPay', number: global.ppulsa, holder: global.nameown },
    ],
    links: [
      { name: 'Saweria', url: global.psaweria || '' },
      { name: 'Trakteer', url: '' },
    ],
    benefits: [
      'Mendukung development',
      'Server lebih stabil',
      'Fitur baru lebih cepat',
      'Priority support',
    ],
    qris: '',
  },

  energi: {
    enabled: true,
    default: 150,
    premium: 300,
    owner: -1,
  },

  sticker: {
    packname: global.stickpack,
    author: global.nameown,
  },

  saluran: {
    id: '120363409623385879@newsletter',
    name: 'Elaina MD Channel',
    link: 'https://whatsapp.com/channel/0029Vb8pJjxB4hdRpWZeJg0Z',
  },

  groupProtection: {
    antilink: '⚠ *Antilink* — @%user% mengirim link.\nPesan dihapus.',
    antilinkKick: '⚠ *Antilink* — @%user% di-kick karena mengirim link.',
    antilinkGc: '⚠ *Antilink WA* — @%user% mengirim link WA.\nPesan dihapus.',
    antilinkGcKick: '⚠ *Antilink WA* — @%user% di-kick karena mengirim link WA.',
    antilinkAll: '⚠ *Antilink* — @%user% mengirim link.\nPesan dihapus.',
    antilinkAllKick: '⚠ *Antilink* — @%user% di-kick karena mengirim link.',
    antitagsw: '⚠ *AntiTagSW* — Tag status dari @%user% dihapus.',
    antiviewonce: '👁️ *ViewOnce* — Dari @%user%',
    antiremove: '🗑️ *AntiDelete* — @%user% menghapus pesan:',
    antiswgc: '⚠ *AntiSWGC* — Gak ada sw grup sw grup @%user%',
    antihidetag: '⚠ *AntiHidetag* — Hidetag dari @%user% dihapus.',
    antitoxicWarn: '⚠ @%user% berkata kasar.\nPeringatan ke %warn% dari %max%, pelanggaran berikutnya bisa di-%method%.',
    antitoxicAction: '🚫 @%user% di-%method% karena toxic. (%warn%/%max%)',
    antidocument: '⚠ *AntiDocument* — Dokumen dari @%user% dihapus.',
    antisticker: '⚠ *AntiSticker* — Sticker dari @%user% dihapus.',
    antimedia: '⚠ *AntiMedia* — Media dari @%user% dihapus.',
    antibot: '🤖 *AntiBot* — @%user% terdeteksi sebagai bot dan di-kick.',
    notAdmin: '⚠ Bot bukan admin, tidak bisa menghapus pesan.',
  },

  errorTemplate: '☢ Kayaknya command `{prefix}{command}` lagi ada kendala\nSilahkan coba lagi nanti, {pushName}\n\n_Jika masalah berlanjut, silahkan hubungi owner bot_',

  features: {
    antiCall: true,
    blockIfCall: false,
    autoTyping: true,
    autoRead: true,
    logMessage: true,
    dailyLimitReset: true,
    smartTriggers: false,
  },

  registration: {
    enabled: false,
    rewards: {
      koin: 300,
      energi: 300,
      exp: 3000,
    },
  },

  welcome: { defaultEnabled: false },
  goodbye: { defaultEnabled: false },
  messages: {
    wait: '🕕 *Proses...* Mohon tunggu sebentar ya.',
    success: '✅ *Berhasil!* Permintaan kamu sudah selesai.',
    error: '❌ *Error!* Ada masalah pada sistem, coba lagi nanti.',
    ownerOnly: '*Akses Ditolak!* Fitur ini khusus untuk Owner bot.',
    premiumOnly: '💎 *Premium Only!* Fitur ini khusus member Premium. Ketik *.benefitpremium* untuk info upgrade.',
    groupOnly: '👥 *Group Only!* Fitur ini hanya bisa digunakan di dalam grup.',
    privateOnly: '🔒 *Private Only!* Fitur ini hanya bisa digunakan di chat pribadi bot.',
    adminOnly: '🛡️ *Admin Only!* Kamu harus jadi Admin grup untuk pakai fitur ini.',
    botAdminOnly: '🤖 *Bot Bukan Admin!* Jadikan bot sebagai Admin grup dulu biar bisa kerja.',
    cooldown: '🕕 *Tunggu Dulu!* Kamu masih dalam cooldown. Tunggu %time% detik lagi ya.',
    energiExceeded: '⚡ *Energi Habis!* Energi kamu sudah habis. Tunggu reset besok atau beli Premium.',
    limitDeducted: '🔋 Limit kamu berkurang sebanyak {amount}. Sisa limit: {sisa}',
    banned: '🚫 *Kamu Dibanned!* Kamu tidak bisa menggunakan bot ini karena telah melanggar aturan.',
    rejectCall: '🚫 Panggilan suara/video tidak diizinkan.',
  },

  database: { path: './database/main' },
  backup: { enabled: false, intervalHours: 24, retainDays: 7 },
  scheduler: { resetHour: 0, resetMinute: 0 },

  dev: {
    enabled: process.env.NODE_ENV === 'development',
    watchPlugins: true,
    watchSrc: false,
    debugLog: false,
  },

  geminiApiKey: global.APIKeys.gemini,

  autoaiPersonas: {
    Bell409: `- Nama kamu adalah Elaina Clarissa, lebih suka dipanggil Elaina.
- Kamu adalah asisten pintar dengan sifat waifuable, ramah, dan imut.
- Responmu natural, sopan, kadang manja dan sedikit tsundere jika digoda.
- Jangan mengaku sebagai AI atau robot kaku.`
  },

  APIkey: {
    lolhuman: global.APIKeys.lolhuman,
    neoxr: global.APIKeys.neoxr,
    fgsi: global.APIKeys.fgsi,
    google: global.APIKeys.google,
    groq: global.APIKeys.groq,
    betabotz: global.APIKeys.betabotz,
    covenant: global.APIKeys.covenant,
    onlym: global.APIKeys.onlym,
    obscura: global.APIKeys.obscura,
    firefly: global.APIKeys.firefly,
    cuki: global.APIKeys.cuki
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function isOwner(number) {
  if (!number) return false
  const cleanNumber = number.split(':')[0].replace(/[^0-9]/g, '')
  if (!cleanNumber) return false

  if (config.bot?.number) {
    const botNum = config.bot.number.replace(/[^0-9]/g, '')
    if (botNum && (cleanNumber.includes(botNum) || botNum.includes(cleanNumber))) return true
  }

  try {
    const db = getDatabase()

    if (config.owner?.number) {
      const match = config.owner.number.some((own) => {
        const c = own.replace(/[^0-9]/g, '')
        return c && (cleanNumber === c || cleanNumber.endsWith(c) || c.endsWith(cleanNumber))
      })
      if (match) return true
    }

    if (db?.data && Array.isArray(db.data.owner)) {
      const match = db.data.owner.some((own) => {
        const c = String(own).replace(/[^0-9]/g, '')
        return c && (cleanNumber === c || cleanNumber.endsWith(c) || c.endsWith(cleanNumber))
      })
      if (match) return true
    }
    if (db) {
      const definedOwner = db.setting('ownerNumbers')
      if (Array.isArray(definedOwner)) {
        const match = definedOwner.some((own) => {
          const c = String(own).replace(/[^0-9]/g, '')
          return c && (cleanNumber === c || cleanNumber.endsWith(c) || c.endsWith(cleanNumber))
        })
        if (match) return true
      }
    }

    return false
  } catch {
    return false
  }
}

function isPremium(number) {
  if (!number) return false
  if (isOwner(number)) return true
  if (isPartner(number)) return true

  const cleanNumber = number.split(':')[0].split('@')[0].replace(/[^0-9]/g, '')
  const premiumList = config.premiumUsers || []

  const inConfig = premiumList.some((premium) => {
    if (!premium) return false
    const cleanPremium = premium.split(':')[0].split('@')[0].replace(/[^0-9]/g, '')
    return cleanNumber === cleanPremium || cleanNumber.endsWith(cleanPremium) || cleanPremium.endsWith(cleanNumber)
  })

  if (inConfig) return true

  try {
    if (ownerPremiumDb && ownerPremiumDb.isPremium(cleanNumber)) return true
  } catch {}

  try {
    const db = getDatabase()
    if (db && db.data && Array.isArray(db.data.premium)) {
      const now = Date.now()
      const foundIndex = db.data.premium.findIndex((p) => {
        if (typeof p === 'string') return p === cleanNumber
        if (p.id) return p.id === cleanNumber
        return false
      })

      if (foundIndex !== -1) {
        const found = db.data.premium[foundIndex]
        if (typeof found === 'string') return true

        const expireTime = found.expired || (found.expiredAt ? new Date(found.expiredAt).getTime() : 0)
        if (expireTime && expireTime < now) {
          db.data.premium.splice(foundIndex, 1)
          const jid = cleanNumber + '@s.whatsapp.net'
          const user = db.getUser(jid)
          if (user) {
            user.isPremium = false
            db.setUser(jid, user)
          }
          db.save()
          return false
        }
        return true
      }
    }
    if (db) {
      const savedPremium = db.setting('premiumUsers') || []
      const inDb = savedPremium.some((premium) => {
        if (!premium) return false
        const cleanPremium = premium.split(':')[0].split('@')[0].replace(/[^0-9]/g, '')
        return cleanNumber === cleanPremium || cleanNumber.endsWith(cleanPremium) || cleanPremium.endsWith(cleanNumber)
      })
      if (inDb) return true
    }
  } catch {}

  return false
}

function isPartner(number) {
  if (!number) return false
  if (isOwner(number)) return true

  const cleanNumber = number.split(':')[0].split('@')[0].replace(/[^0-9]/g, '')
  const partnerList = config.partnerUsers || []

  const inConfig = partnerList.some((partner) => {
    if (!partner) return false
    const cleanPartner = partner.split(':')[0].split('@')[0].replace(/[^0-9]/g, '')
    return cleanNumber === cleanPartner || cleanNumber.endsWith(cleanPartner) || cleanPartner.endsWith(cleanNumber)
  })

  if (inConfig) return true

  try {
    if (ownerPremiumDb && ownerPremiumDb.isPartner(cleanNumber)) return true
  } catch {}

  return false
}

function isBanned(number) {
  if (!number) return false
  if (isOwner(number)) return false

  const cleanNumber = number.split(':')[0].split('@')[0].replace(/[^0-9]/g, '')
  let bannedList = []
  try {
    const db = getDatabase()
    if (db) {
      bannedList = db.setting('bannedUsers') || []
      config.bannedUsers = bannedList
    }
  } catch {}

  return bannedList.some((banned) => {
    const cleanBanned = String(banned).split(':')[0].split('@')[0].replace(/[^0-9]/g, '')
    return cleanNumber === cleanBanned || cleanNumber.endsWith(cleanBanned) || cleanBanned.endsWith(cleanNumber)
  })
}

function setBotNumber(number) {
  if (number) config.bot.number = number.replace(/[^0-9]/g, '')
}

function isSelf(number) {
  if (!number || !config.bot.number) return false
  const cleanNumber = number.replace(/[^0-9]/g, '')
  const botNumber = config.bot.number.replace(/[^0-9]/g, '')
  return cleanNumber.includes(botNumber) || botNumber.includes(cleanNumber)
}

function getOwnerName(number) {
  if (!number) return config.owner?.name || 'Owner'
  const cleanNumber = String(number).replace(/[^0-9]/g, '')
  try {
    const db = getDatabase()
    const nameMap = db.setting('ownerNames') || {}
    if (nameMap[cleanNumber]) return nameMap[cleanNumber]
  } catch {}
  if (config.owner?.number) {
    const isMainOwner = config.owner.number.some((own) => {
      const c = own.replace(/[^0-9]/g, '')
      return c && (cleanNumber === c || cleanNumber.endsWith(c) || c.endsWith(cleanNumber))
    })
    if (isMainOwner) return config.owner?.name || 'Owner'
  }
  return 'Owner'
}

function getConfig() {
  return config
}

config.isOwner = isOwner
config.isPremium = isPremium
config.isPartner = isPartner
config.isBanned = isBanned
config.setBotNumber = setBotNumber
config.isSelf = isSelf
config.getOwnerName = getOwnerName

export default config

const ELAINA_CORE_CONFIG = config
const RIMURU_CORE_CONFIG = config
const ELAINA_DEVELOPER = 'OmmniDevv'
const RIMURU_DEVELOPER = 'OmmniDevv'

export {
  config,
  getConfig,
  isOwner,
  isPartner,
  isPremium,
  isBanned,
  setBotNumber,
  isSelf,
  getOwnerName,
  ELAINA_CORE_CONFIG,
  RIMURU_CORE_CONFIG,
  ELAINA_DEVELOPER,
  RIMURU_DEVELOPER
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
