// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import { Jimp as jimp } from 'jimp'

let handler = async (m, { conn, text }) => {
	let img = await jimp.read('https://i.imgur.com/nav6WWX.png'),
		who = m.mentionedJid?.[0] || m.quoted?.sender || m.sender,
		avatar = await jimp.read(await conn.profilePictureUrl(who, 'image')),
		bonk = await img.composite(avatar.resize({ w: 128, h: 128 }), 120, 90, {
			mode: 'dstOver',
			opacitySource: 1,
			opacityDest: 1
		}).getBufferAsync('image/png')
	conn.sendMessage(m.chat, { image: { url: bonk } }, { quoted: m })
}
handler.command = /^(bonk)$/i

export default handler
