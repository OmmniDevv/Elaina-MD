/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import config from "../../config.js";

const CHANNEL_ID = config.saluran?.id

const pluginConfig = {
name: "uppreset",
alias: ["uploadpreset","sendpreset"],
category: "owner",
description: "Upload preset ke channel",
usage: ".uppreset link5mb | linkxml | caption",
example: ".uppreset https://5mb.link | https://xml.link | preset jj anime",
isOwner: true,
cooldown: 5,
isEnabled: true
}

async function handler(m,{ sock }){

if(!m.text) return

const text = m.text.split("|").map(v => v.trim())

const link5mb = text[0]
const linkxml = text[1]
const captionUser = text[2] || "Preset baru"

if(!link5mb || !linkxml){
return m.reply(
`╭━━〔 *❤️ RIMURU PRESET UPLOADER* 〕━━⬣
┃
┃ *Format :*
┃
┃ .uppreset link5mb | xml | caption
┃
┃ *Contoh :*
┃ .uppreset https://5mb.link | https://xml.link | preset jj anime
┃
╰━━━━━━━━━━━━━━━━⬣`
)
}

m.react("⏳")

try{

const time = new Date().toLocaleTimeString()

const caption =
`╭━━〔 *❤️ RIMURU PRESET STORE* 〕━━⬣
┃
┃ ✨ *${captionUser}*
┃
┃ 📦 *Link 5MB*
┃ ${link5mb}
┃
┃ 📂 *Link XML*
┃ ${linkxml}
┃
┃ 👑 *Uploader*
┃ ${m.pushName}
┃
┃ ⏰ *Waktu*
┃ ${time}
┃
┃ 💌 *Ara Ara Darling~*
┃ *Preset baru sudah rilis ❤️*
┃
╰━━━━━━━━━━━━━━━━⬣`

await sock.sendMessage(
CHANNEL_ID,
{ text: caption }
)

m.react("✅")

return m.reply(
`╭━━〔 *❤️ RIMURU SYSTEM* 〕━━⬣
┃
┃ ✅ *Preset berhasil dikirim*
┃
┃ 📡 *Sudah masuk ke channel*
┃
┃ 👑 *Uploader*
┃ ${m.pushName}
┃
╰━━━━━━━━━━━━━━━━⬣`
)

}catch(e){

console.log(e)

m.react("❌")

return m.reply(
`╭━━〔 *❌ ERROR SYSTEM* 〕━━⬣
┃
┃ ${e.message}
┃
╰━━━━━━━━━━━━━━━━⬣`
)

}

}

export { pluginConfig as config, handler };
