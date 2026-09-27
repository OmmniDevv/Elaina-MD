// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// Makasih kode nya RTXZY
import { sendQuickMenu } from '../../lib/menuHelper.js'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const pilihan = ['atas', 'bawah']
  const input = (args[0] || '').toLowerCase()
  
  if (!pilihan.includes(input)) {
    return sendQuickMenu(conn, m, {
      title: '🪙 Coin Flip',
      text: `Pilih *atas* atau *bawah*, lalu putar koinnya.\n\nAtau ketik: *${usedPrefix}${command} atas*`,
      items: [
        { label: '⬆️ Atas', id: `${usedPrefix}${command} atas` },
        { label: '⬇️ Bawah', id: `${usedPrefix}${command} bawah` }
      ]
    })
  }

  const hasil = pilihan[Math.floor(Math.random() * pilihan.length)]
  const menang = hasil === input

  let coins = Math.floor(Math.random() * 100000)
  let exp = Math.floor(Math.random() * 10000)
  let player = global.db.data.users[m.sender]

  if (!player.tiketcoin) player.tiketcoin = 0

  const coinImg = menang 
    ? 'https://cdn-icons-png.flaticon.com/512/1490/1490832.png'
    : 'https://cdn-icons-png.flaticon.com/512/4315/4315581.png'

  await conn.sendMessage(m.chat, { 
    image: { url: coinImg }, 
    caption: `🪙 *Koin jatuh di: ${hasil}*` 
  }, { quoted: m })

  if (menang) {
    player.money = (player.money || 0) + coins
    player.exp = (player.exp || 0) + exp
    player.tiketcoin += 1

    setTimeout(() => {
      conn.reply(m.chat, `✅ *MENANG!*\n\n💰 +${coins.toLocaleString('id')} Money\n⬆️ +${exp.toLocaleString('id')} XP\n🎟️ +1 Tiket Coin`, m)
    }, 2000)
  } else {
    player.money = Math.max(0, (player.money || 0) - coins)
    player.exp = Math.max(0, (player.exp || 0) - exp)
    player.tiketcoin = Math.max(0, player.tiketcoin - 1)

    setTimeout(() => {
      conn.reply(m.chat, `❌ *KALAH!*\n\n💸 -${coins.toLocaleString('id')} Money\n⬇️ -${exp.toLocaleString('id')} XP\n🎟️ -1 Tiket Coin`, m)
    }, 2000)
  }
}

handler.help = ['coinflip <atas/bawah>']
handler.tags = ['rpg']
handler.command = /^(coinflip|putarkoin)$/i
handler.rpg = true
handler.register = true

export default handler
