// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import { createHash } from 'crypto'
import { readFileSync } from 'fs'
let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}

let handler = async function (m, { text, usedPrefix, command }) {
    let user = global.db.data.users[m.sender]
    if (user.registered === true) throw `[💬] Kamu sudah terdaftar\nMau daftar ulang? *${usedPrefix}unreg <SERIAL NUMBER>*`

    let namae = m.pushName || m.name || conn.getName(m.sender) || m.sender.split('@')[0]

    if (!Reg.test(text)) {
        let thumb = null
        try { thumb = readFileSync('./assets/images/elaina-daftar.jpg') } catch { }

        const ageRows = [
            { title: '🎲 Random', id: `${usedPrefix}${command} ${namae}.${pickRandom(['30','29','28','27','26','25','24','23','22','21','20','19','18','17','16','15','14','13','12','11','10','9'])}` },
            ...['30','29','28','27','26','25','24','23','22','21'].map(a => ({ title: `${a} Years`, id: `${usedPrefix}${command} ${namae}.${a}` })),
            ...['20','19','18','17','16','15','14','13','12','11','10','9'].map(a => ({ title: `${a} Years`, id: `${usedPrefix}${command} ${namae}.${a}` }))
        ]

        // orderMessage sebagai quoted (seperti menu.js)
        const ftroliQuoted = {
            key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
            message: {
                orderMessage: {
                    orderId: '1337',
                    thumbnail: thumb,
                    itemCount: ageRows.length,
                    status: 'INQUIRY',
                    surface: 'CATALOG',
                    message: `Pilih umurmu di bawah`,
                    orderTitle: `📋 Register`,
                    sellerJid: `${global.nomorbot}@s.whatsapp.net`,
                    token: 'elaina-daftar',
                    totalAmount1000: 0,
                    totalCurrencyCode: 'IDR'
                }
            }
        }

        return await conn.sendMessage(m.chat, {
            interactiveMessage: {
                footer: `*ʏᴏᴜʀ ɴᴀᴍᴇ:* ${namae}\n❔ Custom name? ketik *${usedPrefix + command} yourname.age*`,
                jpegThumbnail: thumb,
                contextInfo: { forwardingScore: 7, isForwarded: true },
                nativeFlowMessage: {
                    messageParamsJson: JSON.stringify({ bottom_sheet: { button_title: '📅 Pilih Umur' } }),
                    buttons: [{
                        name: 'single_select',
                        buttonParamsJson: JSON.stringify({
                            title: '📅 Pilih Umur',
                            sections: [
                                { title: 'Select Your Age Here !', rows: ageRows.slice(0, 1) },
                                { title: 'O L D  (21-30)', rows: ageRows.slice(1, 11) },
                                { title: 'Y O U N G  (9-20)', rows: ageRows.slice(11) }
                            ]
                        })
                    }]
                }
            }
        }, { quoted: ftroliQuoted })
    }

    let [_, name, splitter, age] = text.match(Reg)
    if (!name) throw 'Nama tidak boleh kosong (Alphanumeric)'
    if (!age) throw 'Umur tidak boleh kosong (Angka)'
    age = parseInt(age)
    if (age > 30) throw 'WOI TUA (。-`ω´-)'
    if (age < 5) throw 'Halah dasar bocil'
    user.name = name.trim()
    user.age = age
    user.regTime = +new Date
    user.registered = true

    let sn = createHash('md5').update(m.sender).digest('hex')
    let cap = `┏─• *ᴜsᴇʀs*
│▸ *sᴛᴀᴛᴜs:* ☑️ sᴜᴄᴄᴇssғᴜʟ
│▸ *ɴᴀᴍᴇ:* ${name}
│▸ *ᴀɢᴇ:* ${age} ʏᴇᴀʀs
│▸ *sɴ:* ${sn}
┗────···

ᴅᴀᴛᴀ ᴜsᴇʀ ʏᴀɴɢ ᴛᴇʀsɪᴍᴘᴀɴ ᴅɪᴅᴀᴛᴀʙᴀsᴇ ʙᴏᴛ, ᴅɪᴊᴀᴍɪɴ ᴀᴍᴀɴ ᴛᴀɴᴘᴀ ᴛᴇʀsʜᴀʀᴇ (. ❛ ᴗ ❛.)`

    let thumb = null
    try { thumb = readFileSync('./assets/images/elaina-daftar.jpg') } catch { }

    if (thumb) {
        await conn.sendMessage(m.chat, { image: { url: thumb }, caption: cap }, { quoted: m })
    } else {
        await conn.sendMessage(m.chat, { text: cap }, { quoted: m })
    }
}

handler.help = ['daftar', 'register'].map(v => v + ' <nama>.<umur>')
handler.tags = ['xp']
handler.command = /^(daftar|verify|reg(ister)?)$/i

export default handler
