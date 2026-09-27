// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
let handler = async (m, { conn, usedPrefix, command, text }) => {
	function no(number){
    return number.replace(/\s/g,'').replace(/([@+-])/g,'')
  }

	text = no(text)

  if(isNaN(text)) {
		var number = text.split`@`[1]
  } else if(!isNaN(text)) {
		var number = text
  }

  if(!text && !m.quoted) return conn.reply(m.chat, `nomornya mana?\ncontoh: *${usedPrefix}${command} ${global.owner[0]}*\n@tag/reply user`, m)
  //let exists = await conn.isOnWhatsApp(number)
  // if (exists) return conn.reply(m.chat, `*Nomor target tidak terdaftar di WhatsApp*`, m)
  if(isNaN(number)) return conn.reply(m.chat, `Nomor yang kamu masukkan tidak valid!`, m)
  if(number.length > 15) return conn.reply(m.chat, `Nomor yang kamu masukkan tidak valid!`, m)
  try {
		if(text) {
			var user = number + '@s.whatsapp.net'
		} else if(m.quoted && m.quoted.sender) {
			var user = m.quoted.sender
		} else if(m.mentionedJid && m.mentionedJid[0]) {
  		  var user = m.mentionedJid[0]
		}  
  } catch (e) {
  } finally {
		if (!user) return conn.reply(m.chat, `Gagal menentukan target user!`, m)
		let targetNum = user.split('@')[0]
		delete global.db.data.users[user]
		await global.db.write().catch(() => {})
		let anu = `✅ Berhasil menghapus *${conn.getName(user)}* (@${targetNum}) dari *DATABASE*`
		conn.reply(m.chat, anu, m, { mentions: [user] })
  }
}
handler.help = ['deleteuser']
handler.tags = ['owner']
handler.command = /^(d(el)?(ete)?u(ser)?|ha?pu?su(ser)?)$/i

handler.rowner = true

export default handler