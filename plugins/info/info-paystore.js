// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
import { sendQuickMenu } from '../../lib/menuHelper.js'
let handler = async (m, { conn }) => {
  const sh = '5', sn = '15', ss = '30', sp = '35', sv = '65'
  const ph = '5', pn = '20', pp = '40', pv = '50', ppm = '70'

  const info = `╭━━━━「 *SEWA* 」
┊⫹⫺ *Hemat:* _${sh}k/grup (1 minggu)_
┊⫹⫺ *Normal:* _${sn}k/grup (1 bulan)_
┊⫹⫺ *Standar:* _${ss}k/grup (2 bulan)_
┊⫹⫺ *Pro:* _${sp}k/grup (4 bulan)_
┊⫹⫺ *Vip:* _${sv}k/grup (12 bulan)_
╰═┅═━––––––๑

╭━━━━「 *PREMIUM* 」
┊⫹⫺ *Hemat:* _${ph}k (1 minggu)_
┊⫹⫺ *Normal:* _${pn}k (1 bulan)_
┊⫹⫺ *Pro:* _${pp}k (4 bulan)_
┊⫹⫺ *Vip:* _${pv}k (8 bulan)_
┊⫹⫺ *Permanent:* _${ppm}k (Unlimited)_
╰═┅═━––––––๑

*⫹⫺ PAYMENT:*
• *Pulsa:* [${ppulsa}]
• *Dana:* [${pdana}]

–––––– *🐾 Kebijakan* ––––––
🗣️: Kak, Kok harganya mahal banget?
💬: Mau tawar menawar? boleh, silahkan chat owner aja

🗣️: Scam ga nih kak?
💬: Enggalah, Owner 100% Tepati janji #STAYHALAL`

  const sewaRows = [
    { title: '🔖 𝗛𝗘𝗠𝗔𝗧',     id: '.order *Paket:* HEMAT • Sewa',      description: `Price: ${sh}k (1 minggu)` },
    { title: '🔖 𝗡𝗢𝗥𝗠𝗔𝗟',    id: '.order *Paket:* NORMAL • Sewa',     description: `Price: ${sn}k (1 bulan)` },
    { title: '🔖 𝗦𝗧𝗔𝗡𝗗𝗔𝗥',   id: '.order *Paket:* STANDAR • Sewa',    description: `Price: ${ss}k (2 bulan)` },
    { title: '🔖 𝗣𝗥𝗢',        id: '.order *Paket:* PRO • Sewa',        description: `Price: ${sp}k (4 bulan)` },
    { title: '🔖 𝗩𝗜𝗣',        id: '.order *Paket:* VIP • Sewa',        description: `Price: ${sv}k (12 bulan)` },
  ]
  const premRows = [
    { title: '🌟 𝗛𝗘𝗠𝗔𝗧',     id: '.order *Paket:* HEMAT • Premium',   description: `Price: ${ph}k (1 minggu)` },
    { title: '🌟 𝗡𝗢𝗥𝗠𝗔𝗟',    id: '.order *Paket:* NORMAL • Premium',  description: `Price: ${pn}k (1 bulan)` },
    { title: '🌟 𝗣𝗥𝗢',        id: '.order *Paket:* PRO • Premium',     description: `Price: ${pp}k (4 bulan)` },
    { title: '🌟 𝗩𝗜𝗣',        id: '.order *Paket:* VIP • Premium',     description: `Price: ${pv}k (8 bulan)` },
    { title: '🌟 𝗣𝗘𝗥𝗠𝗔𝗡𝗘𝗡𝗧', id: '.order *Paket:* PERMANENT • Premium', description: `Price: ${ppm}k (UNLIMITED)` },
  ]

  const ftroliQuoted = {
    key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
    message: {
      orderMessage: {
        orderId: '1337',
        thumbnail: null,
        itemCount: sewaRows.length + premRows.length,
        status: 'INQUIRY',
        surface: 'CATALOG',
        message: `Pilih paket yang kamu inginkan`,
        orderTitle: `💎 Harga & Paket`,
        sellerJid: `${global.nomorbot}@s.whatsapp.net`,
        token: 'elaina-store',
        totalAmount1000: 0,
        totalCurrencyCode: 'IDR'
      }
    }
  }

  const items = [
    ...sewaRows.map(r => ({ label: `${r.title} — ${r.description}`, id: r.id })),
    ...premRows.map(r => ({ label: `${r.title} — ${r.description}`, id: r.id }))
  ]
  const listTxt = items.map(it => `  • ${it.label}`).join('\n')

  await sendQuickMenu(conn, m, {
    title: `💎 ${global.namebot}`,
    text: `${info}\n\n*📋 PILIH PAKET*\n${listTxt}`,
    footer: `_Klik tombol di bawah untuk memesan_`,
    items: items.slice(0, 10),
    quoted: ftroliQuoted
  })
}

handler.help = ['sewa', 'premium']
handler.tags = ['main']
handler.command = /^(sewa(bot)?|premium)$/i

export default handler
