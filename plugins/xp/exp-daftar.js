// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import { createHash } from 'crypto'
import { readFileSync } from 'fs'
import { sendQuickMenu } from '../../lib/menuHelper.js'
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

        const ageList = [
            { title: '🎲 Random', id: `${usedPrefix}${command} ${namae}.${pickRandom(['30','29','28','27','26','25','24','23','22','21','20','19','18','17','16','15','14','13','12','11','10','9'])}` },
            ...['30','29','28','27','26','25','24','23','22','21','20','19','18','17','16','15','14','13','12','11','10','9'].map(a => ({ title: `${a} Years`, id: `${usedPrefix}${command} ${namae}.${a}` }))
        ]
        // single_select dibuang WA → pesan "tidak didukung". Pakai quick_reply
        // (maks 10). Sisanya tetap bisa diakses via teks (contoh di footer).
        const ageBtns = ageList.slice(0, 10)
        const more = ageList.length - ageBtns.length
        const footer = more > 0 ? `_Pilih dari tombol di bawah, atau ketik sendiri (tersisa ${more} umur di lain)_` : `_Pilih umur lewat tombol_`

        return await sendQuickMenu(conn, m, {
            title: `📅 Daftar — ${namae}`,
            text: `*ʏᴏᴜʀ ɴᴀᴍᴇ:* ${namae}\n❔ Custom name? ketik *${usedPrefix + command} yourname.age*`,
            footer,
            image: thumb,
            items: ageBtns.map(a => ({ label: a.title, id: a.id }))
        })
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
