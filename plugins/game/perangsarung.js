/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


const pluginConfig = {
  name: "perangsarung",
  alias: [],
  category: "game",
  description: "Imported from Rimuru MD V4.6",
  usage: "",
  example: "",
  isOwner: false,
  isPremium: false,
  isGroup: true,
  isPrivate: false,
  cooldown: 3,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock, text }) {
    const conn = sock;
  if (!m.mentionedJid[0]) return conn.reply(m.chat, `Tag 1 orang untuk menantangnya bermain perang sarung!`, m)

  let target = m.mentionedJid[0]
  let player1 = { jid: m.sender, name: conn.getName(m.sender) }
  let player2 = { jid: target, name: conn.getName(target) }

  let players = [player1, player2]

  let intro = `⚔️ *PERANG SARUNG DIMULAI!!*\n\n${player1.name} vs ${player2.name}\n\nSiapakah yang akan menang?\n\n*Loading...*`
  await conn.reply(m.chat, intro, m, { mentions: [player1.jid, player2.jid] })

 
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  await conn.sendPresenceUpdate('composing', m.chat)
  await delay(3000)
  await conn.reply(m.chat, `💥 Keduanya mulai memutar sarung dengan gaya ninja!`, m)

  await conn.sendPresenceUpdate('composing', m.chat)
  await delay(3000)
  await conn.reply(m.chat, `⚡ Terdengar suara *"Plakkk!"* di udara...`, m)

  await conn.sendPresenceUpdate('composing', m.chat)
  await delay(2500)

  let winner = players[Math.floor(Math.random() * players.length)]
  let loser = players.find(p => p.jid !== winner.jid)

  await conn.reply(m.chat, `☠️ ${loser.name} tumbang terkena sarung karpet masjid`, m)
  await delay(2000)
  await conn.reply(m.chat, `🏆 *Pemenangnya adalah:* ${winner.name.toUpperCase()}!`, m)
}

handler.register = true

/*
SCRIPT BY © VYNAA VALERIE 
Modifikasi: By ZenzXD
*/

export { pluginConfig as config, handler };
