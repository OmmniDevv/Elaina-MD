// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
let handler = async (m, { conn, command, args, usedPrefix }) => {
  let type = (args[0] || '').toLowerCase()
  let nowner = `${nomorown.split`@`[0]}@s.whatsapp.net`

  const teksnomor = `${htki} *OWNER* ${htka}
✦ @${nomorown.split`@`[0]} ✦
------- ${nameown} -------

📮 *Note:*
• Owner tidak menerima save contact
• Owner berhak blockir tanpa alasan
• Berbicaralah yang sopan & tidak spam
• Owner Hanya merespon yang berkaitan dengan BOT
• No Telp`

  const teksbio = `${htki} *BIODATA* ${htka}
${htjava} *💌 Nama* : ZansLord
${htjava} *✉️ Nama RL* : Abdul Malik R.N
${htjava} *♂️ Gender* : Boys
${htjava} *🕋 Agama* : Islam
${htjava} *⏰ Tanggal lahir* : 04 July 2007
${htjava} *🎨 Umur* : 15
${htjava} *🧮 Kelas* : 9
${htjava} *🧩 Hobby* : Nonton Donghua, Chatting, Musik, Recode script bot
${htjava} *💬 Sifat* : Idiot, Tidak Ramah, Bilek, Prik, Nolep
${htjava} *🗺️ Tinggal* : Indo, Jawa Barat, Kab.bandung
${htjava} *❤️ Suka* : Cintod🐦
${htjava} *💔 Benci* : autis, seleb

${htjava} *📷 ɪɴsᴛᴀɢʀᴀᴍ* : ${sig}
${htjava} *🇫  ғᴀᴄᴇʙᴏᴏᴋ* : Abdul Malik Rizky
${htjava} *🐈 ɢɪᴛʜᴜʙ:* ${sgh}
•·––––––––––––––––––––––––––·•`

  const optRows = [
    { title: '📱 • Nomor',   id: `${usedPrefix}owner nomor` },
    { title: '🎨 • Biodata', id: `${usedPrefix}owner bio` },
    { title: '🌎 • Script',  id: `${usedPrefix}sc` },
    { title: '💹 • Donasi',  id: `${usedPrefix}donasi` },
    { title: '🔖 • Sewa',    id: `${usedPrefix}sewa` },
    { title: '🌟 • Premium', id: `${usedPrefix}premium` },
  ]

  const ftroliQuoted = {
    key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
    message: {
      orderMessage: {
        orderId: '1337',
        thumbnail: null,
        itemCount: optRows.length,
        status: 'INQUIRY',
        surface: 'CATALOG',
        message: `Info owner & support`,
        orderTitle: `👑 Owner`,
        sellerJid: `${global.nomorbot}@s.whatsapp.net`,
        token: 'elaina-owner',
        totalAmount1000: 0,
        totalCurrencyCode: 'IDR'
      }
    }
  }

  try {
    if (/(creator|owner)/i.test(command)) {
      switch (type) {
        case 'nomor':
          conn.reply(m.chat, teksnomor, m, { contextInfo: { mentionedJid: [nowner] } })
          break
        case 'bio':
          await conn.sendMessage(m.chat, {
            interactiveMessage: {
              footer: teksbio,
              contextInfo: {
                forwardingScore: 7, isForwarded: true
              },
              nativeFlowMessage: {
                messageParamsJson: '',
                buttons: [
                  { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '📷 Instagram', id: sig }) },
                  { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '📱 Nomor', id: `${usedPrefix}owner nomor` }) }
                ]
              }
            }
          }, { quoted: m })
          break
        default:
          return await conn.sendMessage(m.chat, {
            interactiveMessage: {
              footer: `Pilih dibawah kak ! o(〃＾▽＾〃)o`,
              contextInfo: { forwardingScore: 7, isForwarded: true },
              nativeFlowMessage: {
                messageParamsJson: JSON.stringify({ bottom_sheet: { button_title: '👑 Pilih Info' } }),
                buttons: [{
                  name: 'single_select',
                  buttonParamsJson: JSON.stringify({
                    title: '👑 Pilih Info',
                    sections: [
                      { title: `${htjava} OWNER –––––––––·•`, rows: optRows.slice(0, 3) },
                      { title: `${htjava} SUPPORT ME –––––––·•`, rows: optRows.slice(3) }
                    ]
                  })
                }]
              }
            }
          }, { quoted: ftroliQuoted })
      }
    }
  } catch (err) {
    m.reply('Error\n\n\n' + err.stack)
  }
}

handler.help = ['owner', 'creator']
handler.tags = ['info']
handler.command = /^(owner|creator)/i

export default handler
