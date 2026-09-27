// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
//By Papah-Chan

import fs from 'fs'
import fetch from 'node-fetch'
import moment from 'moment-timezone'

let handler = m => m
handler.all = async function (m) {
    let name = await conn.getName(m.sender) 
	let pp = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
	try {
		pp = await this.profilePictureUrl(m.sender, 'image')
	} catch (e) {
	} finally {
		
        //global.bg = await (await fetch(img)).buffer()
		global.doc = pickRandom(["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/msword", "application/pdf", "application/vnd.android.package-archive", "application/zip"])
		
		// Module 
		
		const _uptime = process.uptime() * 1000
        
		// Ini untuk command crator/owner
		global.kontak2 = await Promise.all(
          owner.filter(([num]) => num).map(async ([num, name]) => [num, await conn.getName(num + '@s.whatsapp.net') || name || num, ' ', 'yanxiao021@gmail.com', true])
		)
        
		// ucapan ini mah
		global.ucapan = ucapan()
		
		// pesan sementara
		global.ephemeral = '86400' // 86400 = 24jam, kalo ingin di hilangkan ganti '86400' jadi 'null' atau ''
		let urls = pickRandom(['https://tinyurl.com/248tem3e', 'https://tinyurl.com/2ygkf7cn', 'https://tinyurl.com/29rt6ynv', 'https://tinyurl.com/25ampr4y', 'https://tinyurl.com/2yq9srmd', 'https://tinyurl.com/2bahkesq', 'https://tinyurl.com/2xnzw74a', 'https://tinyurl.com/2b9hocps', 'https://tinyurl.com/265ekuvk', 
'https://tinyurl.com/2c82ajhq', 'https://tinyurl.com/265y8p3e', 'https://tinyurl.com/286yslxu'])
		// Kartu preview: pakai thumbnail biasa saja. Jangan pakai kartu iklan
		// (sudah tidak didukung WA dan bikin pesan gagal terkirim).
		let _thumb
		try { _thumb = fs.readFileSync(global.thumb) } catch { _thumb = Buffer.alloc(0) }
		global.thumbBuffer = _thumb
		global.adReply = {
			contextInfo: {
				forwardingScore: 9999
			}
		}
		global.fakeig = {}
global.fakefb = {}
		// Fake ðŸ¤¥
		global.ftroli = { key: { remoteJid: 'status@broadcast', participant: '0@s.whatsapp.net' }, message: { orderMessage: { itemCount: 9999999999999999999999999999999999999999999999999999999, status: 1, surface: 1, message: wm, orderTitle: wm, sellerJid: '0@s.whatsapp.net' } } }
		global.fkontak = { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: `status@broadcast` } : {}) }, message: { 'contactMessage': { 'displayName': wm, 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;${wm},;;;\nFN:${wm},\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabell:Ponsel\nEND:VCARD`, 'jpegThumbnail': (() => { try { return fs.readFileSync('./thumbnail.jpg') } catch { return Buffer.alloc(0) } })(), thumbnail: (() => { try { return fs.readFileSync('./thumbnail.jpg') } catch { return Buffer.alloc(0) } })(),sendEphemeral: true}}}
        global.fvn = {
            key: { 
                 fromMe: false,
                 participant: `0@s.whatsapp.net`, ...(m.chat ? 
            { remoteJid: "6285736178354-1625305606@g.us" } : {}) 
                       },
            message: { 
               "audioMessage": {
                        "mimetype":"audio/ogg; codecs=opus",
                        "seconds": "999999999999",
                        "ptt": "true"
                               }
                             } 
                            }
               
                global.ftextt = {
            key: { 
                 fromMe: false,
                 participant: `0@s.whatsapp.net`, ...(m.chat ? 
            { remoteJid: "6285736178354-1625305606@g.us" } : {}) 
                       },
            message: { 
               "extendedTextMessage": {
                        "text":wm,
                        "title": wm,
                        'jpegThumbnail': (() => { try { return fs.readFileSync('./thumbnail.jpg') } catch { return Buffer.alloc(0) } })()
                               }
                             } 
                            }
               
                  global.fliveLoc = {
            key:
            { fromMe: false,
            participant: `0@s.whatsapp.net`, ...(m.chat  ? 
            { remoteJid: "status@broadcast" } : {}) },
            message: { "liveLocationMessage": { "caption":"by : ImYanXiao","h": `${wm}`, 'jpegThumbnail': (() => { try { return fs.readFileSync('./thumbnail.jpg') } catch { return Buffer.alloc(0) } })()}}
           }
               
                  global.fliveLoc2 = {
            key:
            { fromMe: false,
            participant: `0@s.whatsapp.net`, ...(m.chat ? 
            { remoteJid: "status@broadcast" } : {}) },
            message: { "liveLocationMessage": { "title": "ImYanXiao","h": wm, 'jpegThumbnail': (() => { try { return fs.readFileSync('./thumbnail.jpg') } catch { return Buffer.alloc(0) } })()}}
           }
               
                   global.ftoko = {
       key: {
                   fromMe: false,
                   participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: "6285736178354@s.whatsapp.net" } : {})
               },
               message: {
                   "productMessage": {
                       "product": {
                           "productImage":{
                               "mimetype": "image/jpeg",
                               "jpegThumbnail": (() => { try { return fs.readFileSync('./thumbnail.jpg') } catch { return Buffer.alloc(0) } })() //Gambarnye
                           },
                           "title": wm, //Kasih namalu 
                           "description": "Elaina-MultiDevice", 
                           "currencyCode": "USD",
                           "priceAmount1000": "20000000",
                           "retailerId": "Ghost",
                           "productImageCount": 1
                       },
                           "businessOwnerJid": `0@s.whatsapp.net`
               }
           }
       }
               
                     global.fdocs = {
           key : {
                  participant : '0@s.whatsapp.net'
                               },
              message: {
                           documentMessage: {
                           title: wm, 
                           jpegThumbnail: (() => { try { return fs.readFileSync('./thumbnail.jpg') } catch { return Buffer.alloc(0) } })()
                                 }
                               }
                             }
               
                    global.fgclink = {
           "key": {
               "fromMe": false,
               "participant": "0@s.whatsapp.net",
               "remoteJid": "0@s.whatsapp.net"
           },
           "message": {
               "groupInviteMessage": {
                   "groupJid": "6285736178354-1625305606@g.us",
                   "inviteCode": "null",
                   "groupName": "Kawan Elaina", 
                   "caption": wm, 
                   'jpegThumbnail': (() => { try { return fs.readFileSync('./thumbnail.jpg') } catch { return Buffer.alloc(0) } })()
               }
           }
       }
       
                    global.fgif = {
            key: { 
                 fromMe: false,
                 participant: `0@s.whatsapp.net`, ...(m.chat ? 
            { remoteJid: "6285736178354-1625305606@g.us" } : {}) 
                       },
            message: { 
                        "videoMessage": { 
                        "title": wm,
                        "h": `Hmm`,
                        'seconds': '999999999', 
                        'gifPlayback': 'true', 
                        'caption': wm,
                        'jpegThumbnail': (() => { try { return fs.readFileSync('./thumbnail.jpg') } catch { return Buffer.alloc(0) } })()
                               }
                              }
                             }
	}
}

export default handler 

function ucapan() {
    const time = moment.tz('Asia/Jakarta').format('HH')
    let res = "Selamat malam 🌙"
    if (time >= 4) {
        res = "Selamat pagi 🌄"
    }
    if (time > 10) {
        res = "Selamat siang ☀️"
    }
    if (time >= 15) {
        res = "Selamat sore 🌅"
    }
    if (time >= 18) {
        res = "Selamat malam 🌙"
    }
    return res
}

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}
