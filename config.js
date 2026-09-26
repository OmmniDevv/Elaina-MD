// ╔══════════════════════════════════════════════════════╗
// ║         E L A I N A - M D  WhatsApp BOT              ║
// ║  Source Code: https://github.com/OmmniDevv/Elaina-MD ║
// ║  Author     : https://github.com/OmmniDevv           ║
// ║  Script ini GRATIS untuk semua orang.                ║
// ║  DILARANG KERAS diperjualbelikan!                    ║
// ╚══════════════════════════════════════════════════════╝

// - - THANKS TO - -
// • Allah SWT
// • Nurutomo
// • Bochilgaming
// • Rominaru
// • Kannachann
// • The.Sad.Boy01
// • Rasel comel
// • ImYanXiao
// • OmmniDevv
// • Xtreshe
// • Dll

//[!] Jangan Dihapus, mending ditambahin

import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import moment from 'moment-timezone'

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
// kalo ga punya ketik "-" atau biarin aja biar ada creditsnya
global.sig = 'https://instagram.com/' //Link Instagrammu
global.sgh = 'https://github.com/OmmniDevv' //Link Github OmmniDevv
global.sgc = 'https://chat.whatsapp.com/'
global.sdc = '-' //Isi Pake Link Discordmu Kalo Gada Biarin aja
global.snh = 'https://nhentai.net/g/HaramTod🗿'

/*============== PAYMENT ==============*/
global.pdana = '08xxxxxx' //Nomor Danamu
global.ppulsa = '08xxxxxxxxx' //Nomor SimCard Yang Kamu Pake
global.psaweria = '-' //Link Saweriamu Kalo Nggada Ketik - aja

/*============== NOMOR ==============*/
global.nomorbot = '6285187605007' //Nomor Bot
global.nomorown = '6285869074622' //Nomor Owner
global.namebot = 'Elaina BOT' //Nama Bot
global.nameown = 'ZansLord' // Nama Owner

/*============== PERSONA / VOICE (waifuable moe) ==============*/
// Semua text reply bot pake ini. Edit sesukamu~
global.elaina_persona = {
  // Reaksi emosi — array, dipilih random tiap reply
  reactions: {
    seneng:  ['Ehehe~', 'Yay~', 'Hihi~', 'Yatta~', 'Ufufu~'],
    malu:    ['E-Eh?!', 'H-Hentee...', 'Mouu~', 'I-Iya...', 'Hngg...'],
    mikir:   ['Hmm~', 'Chotto~', 'Eto...', 'Nee~'],
    marah:   ['Mouu!', 'Hmph!', 'Jangan gitu dong~', 'Yada~'],
    ngantuk: ['Fuaa~', 'Nemui...', 'Yawn~', 'Suyaa~'],
    gagal:   ['Ehh?!', 'Uwahh...', 'Hics...', 'Kuso~'],
    sukses:  ['Dekita~', 'Sippu~', 'Yoshi~', 'Hehe~', 'Kantan~'],
    selamat: ['Omedetou~', 'Yatta ne~', 'Sugoi~'],
    sayang:  ['Daisuki~', 'Suki~', 'Kawaii~', 'Fuee~'],
    salam:   ['Ohayou~', 'Konnichiwa~', 'Konbanwa~', 'Hisashiburi~'],
    pamit:   ['Jaa ne~', 'Oyasumi~', 'Mata ne~', 'See you~']
  },
  // Emoji per emosi (dipilih random, boleh kosong [])
  emoji: {
    seneng:  ['(⁠≧⁠▽⁠≦⁠)', '(⁠≧⁠◡⁠≦⁠) ♡', '🎀'],
    malu:    ['(⁠⁄⁠ ⁠⁄⁠•⁠⁄⁠ω⁠⁄⁠•⁠⁄⁠ ⁠⁄⁠)', '>///<', '🫣'],
    gagal:   ['(⁠╥⁠﹏⁠╥⁠)', '(⁠｡⁠•́⁠︿⁠•̀⁠｡⁠)', '💧'],
    sukses:  ['✨', '🌟', '💫'],
    sayang:  ['♡', '💗', '💕']
  },
  // Footer di bawah tiap pesan panjang
  footer: '♡ Elaina-chan',
  // Sticker metadata
  sticker_packname: 'Elaina-chan ♡',
  sticker_author: 'OmmniDevv'
}
// ↓ TAMBAHKAN INI ↓
global.usePairingCode = false            // false = QR (scan), true = pairing code
global.pairingNumber = '6285187605007'   // Nomor WA bot kamu (kosongkan untuk input manual)

/*============== STAFF ==============*/
global.owner = [
  ['6285869074622', '❦ Zans Lord? 🎐', true] //Ganti jd nomormu sama Namamu
  // [number, nama, dia owner?]
] // Put your number here
global.mods = [] // Want some help?
global.prems = [] // Premium user bukan disini nambahinnya, ketik .addprem @user 10


/*============== API ==============*/
global.APIs = {
  // API dengan Key:
  amel: 'https://melcanz.com',
  violetics: 'https://violetics.pw',
  velixs: 'https://api.velixs.com',
  // neoxr dibuang — semua plugin pindah ke sumber no-key
  // API Gratis (No Key Required):
  siputzx: 'https://api.siputzx.my.id',
  vreden: 'https://api.vreden.my.id',
  nexray: 'https://api.nexray.eu.cc',
  nexrayweb: 'https://api.nexray.web.id',
  deline: 'https://api.deline.web.id',
  emiliabot: 'https://api.emiliabot.my.id',
  dnsgoogle: 'https://dns.google',
}

global.APIKeys = {
  // ⚠️ Ganti dengan API key milikmu sendiri!
  'https://melcanz.com': 'ISI_APIKEY_MELCANZ_DISINI',
  'https://violetics.pw': 'ISI_APIKEY_VIOLETICS_DISINI',

  // Velixs API (1000 req/hari) - https://api.velixs.com
  'https://api.velixs.com': 'c304a8e5ce63abfd13cc004073ba8eaaf146364197da879257',
  velixs: 'c304a8e5ce63abfd13cc004073ba8eaaf146364197da879257',

  // Gemini AI - Daftar gratis: https://aistudio.google.com/app/apikey
  gemini: 'ISI_APIKEY_GEMINI_DISINI',

  // Groq AI - Daftar gratis: https://console.groq.com
  groq: 'ISI_APIKEY_GROQ_DISINI',

  // Covenant (GPT-4o) - Daftar: https://covenant.sbs
  covenant: 'ISI_APIKEY_COVENANT_DISINI',

  // neoxr key dihapus — tidak dipakai lagi

  // RajaOngkir (Cek Ongkir) - https://rajaongkir.com/dokumentasi/starter
  rajaongkir: 'ISI_APIKEY_RAJAONGKIR_DISINI',

  // Google (Tenor GIF) - https://developers.google.com/tenor
  google: 'ISI_APIKEY_GOOGLE_DISINI',
}

/*============== WATERMARK ==============*/
// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD
global.wm = '                「 ᴇʟᴀɪɴᴀ 𝙱𝙾𝚃 汉  」' //Main Watermark
global.wm2 = '꒷︶꒷꒥꒷ ‧₊˚ ꒰ฅ˘ᴇʟᴀɪɴᴀ - ᴄʜᴀɴ˘ฅ ꒱ ‧₊˚꒷︶꒷꒥꒷'
global.wm3 = '⫹⫺ ᴇʟᴀɪɴᴀ 𝙱𝙾𝚃'
global.wmcredit = '⫹⫺ github.com/OmmniDevv/Elaina-MD' // Credit - JANGAN DIHAPUS
global.botdate = `⫹⫺ 𝗛𝗮𝗿𝗶: ${week} ${date}`
global.bottime = `𝗪𝗮𝗸𝘁𝘂 : ${wktuwib}`
global.titlebot = '🎋 ┊ 𝗥𝗣𝗚 ʙᴏᴛ ᴡʜᴀᴛsᴀᴘᴘ'
global.author = global.wm

/*============== PERSONA / VOICE ==============*/
// Persona bot — biar text-nya waifuable & moe~
// Dibaca oleh lib/elainaVoice.js — edit di sini aja, semua plugin otomatis ikut
global.elaina_persona = {
  // Reaksi moe per emosi
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
  // Emoji per emosi (otomatis nempel di belakang reaksi)
  emoji: {
    seneng:  ['♡', '✧', '🌸'],
    sukses:  ['♪', '✧', '☆'],
    gagal:   ['💧', '🥺'],
    mikir:   ['☁️', '✧'],
    sayang:  ['♡', '💗'],
    salam:   ['🌸', '☀️']
  },
  // Footer buat pesan panjang
  footer: `꒷︶꒷꒥꒷ ‧₊˚ ${global.namebot} ‧₊˚꒷︶꒷꒥꒷ ♡`,
  // Metadata sticker
  sticker_packname: 'ᴇʟᴀɪɴᴀ 𝙱𝙾𝚃 ♡',
  sticker_author: global.nameown
}


/*============== LOGO ==============*/
global.thumb = './assets/images/elaina-thumbnail.jpg' //Main Thumbnail
global.thumb2 = './assets/images/elaina-thumbnail2.jpg'
global.thumbAllmenu = './assets/images/elaina-allmenu.jpeg'
global.thumbDaftar = './assets/images/elaina-daftar.jpg'
global.thumbbc = 'https://telegra.ph/file/05f874dc87f7e27fa8127.jpg' //For broadcast
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

/*=========== FAKE SIZE ===========*/
global.fsizedoc = '99999999999999' // default 10TB
global.fpagedoc = '999'

/*=========== HIASAN ===========*/
// DEFAULT MENU
global.dmenut = 'ଓ═┅═━–〈' //top
global.dmenub = '┊↬' //body
global.dmenub2 = '┊' //body for info cmd on Default menu
global.dmenuf = '┗––––––––––✦' //footer

// COMMAND MENU
global.dashmenu = '┅━━━═┅═❏ *ღ 𝘿𝘼𝙎𝙃𝘽𝙊𝘼𝙍𝘿 ღ* ❏═┅═━━━┅'
global.cmenut = '❏––––––『'                       //top
global.cmenuh = '』––––––'                        //header
global.cmenub = '┊❀'                            //body
global.cmenuf = '┗━═┅═━––––––๑\n'                //footer
global.cmenua = '\n⌕ ❙❘❙❙❘❙❚❙❘❙❙❚❙❘❙❘❙❚❙❘❙❙❚❙❘❙❙❘❙❚❙❘ ⌕\n     ' //after
global.pmenus = '┊'                              //pembatas menu selector

global.htki = '––––––『' // Hiasan Titile (KIRI)
global.htka = '』––––––' // Hiasan Title  (KANAN)
global.lopr = 'Ⓟ' //LOGO PREMIUM ON MENU.JS
global.lolm = 'Ⓛ' //LOGO LIMIT/FREE ON MENU.JS
global.htjava = '⫹⫺'    //hiasan Doang :v
global.hsquere = ['⛶','❏','⫹⫺']

/*============== STICKER WM ==============*/
// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD
global.stickpack = '.'
global.stickauth = `☂︎\n𝗘\nl\na\ni\nn\na\n-\n𝗕\n𝗢\n𝗧\n✦\n\n⫹⫺ Whatsapp BOT\nwa.me/${global.nomorbot}`

global.multiplier = 38 // The higher, The harder levelup

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

//------ JANGAN DIUBAH -----
export const config = {
  bot: { name: global.namebot }
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
