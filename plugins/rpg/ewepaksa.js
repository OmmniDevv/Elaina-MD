/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


const pluginConfig = {
  name: "ewepaksa",
  alias: ["perkosa"],
  category: "rpg",
  description: "Imported from Rimuru MD V4.6",
  usage: "",
  example: "",
  isOwner: false,
  isPremium: true,
  isGroup: true,
  isPrivate: false,
  cooldown: 3,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock, participants }) {
    const conn = sock;
    let targetUser = m.mentionedJid[0] || participants[Math.floor(Math.random() * participants.length)].id
    let targetName = conn.getName(targetUser)
    
    let user = global.db.data.users[m.sender]
    let __timers = (new Date() - user.lastmisi)
    let _timers = (1200000 - __timers)
    let timers = clockString(_timers)
    
    let name = conn.getName(m.sender)
    let id = m.sender
    let kerja = 'ewe-paksa'
    
    conn.misi = conn.misi ? conn.misi : {}

    if (id in conn.misi) {
        return m.reply(`Selesaikan Misi ${conn.misi[id][0]} Terlebih Dahulu, jangan buru-buru... 😋`)
    }

    if (new Date() - user.lastmisi > 1200000) {
        let randomMoney = Math.floor(Math.random() * 1000000)
        let randomExp = Math.floor(Math.random() * 10000)
        
        let teks1 = `👙 ${name} mulai maksa buka baju ${targetName} di pojokan... 😋`.trim()
        let teks2 = `🥵💦 ${targetName} cuma bisa pasrah... 'Ahhhh... pelan-pelan mas...'`.trim()
        let teks3 = `🥵 Ahhhh, Sakitttt!! >////<\n💦 Crotttt..... masuk dalem banget!\n💦 Crottt lagi sampe luber...`.trim()
        let teks4 = `🥵💦💦 Ahhhhhh... ${targetName} lemes total mandi cairan kamu...😫`.trim()
        
        let hsl = `
*—[ HASIL EWE PAKSA ]—*
➕ 💹 Money : [ ${randomMoney} ]
➕ ✨ Exp : [ ${randomExp} ]
➕ 😍 Total Ewe : [ ${user.ojek + 1} ]

Bener-bener jagoan kamu bikin ${targetName} nggak berdaya... 
`.trim()

        user.money += randomMoney
        user.exp += randomExp
        user.ojek += 1
        
        conn.misi[id] = [
            kerja,
            setTimeout(() => {
                delete conn.misi[id]
            }, 27000)
        ]

        let { key } = await conn.sendMessage(m.chat, { text: '😋 Mulai ewe paksa... target sudah terkunci!' }, { quoted: m })

        let messages = [teks1, teks2, teks3, teks4, hsl]
        for (let i = 0; i < messages.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 5000))
            await conn.sendMessage(m.chat, { text: messages[i], edit: key })
        }

        user.lastmisi = new Date() * 1
    } else {
        m.reply(`Tunggu ${timers} lagi ya Sayang... kumpulin tenaga biar nanti genjotannya makin mantap! 💋`)
    }
}

handler.register = true

function clockString(ms) {
    let h = Math.floor(ms / 3600000)
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

export { pluginConfig as config, handler };
