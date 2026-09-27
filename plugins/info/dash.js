/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


const pluginConfig = {
  name: "dashboard",
  alias: [],
  category: "info",
  description: "Imported from Rimuru MD V4.6",
  usage: "",
  example: "",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock }) {
    const conn = sock;
  let stats = Object.entries(db.data.stats).map(([key, val]) => {
    let help = plugins[key]?.help
    let name = Array.isArray(help) ? help.join(', ') : help || key
    if (/exec/.test(name)) return null // kasih null biar bisa di filter
    return { name, ...val }
  }).filter(v => v) // buang null hasil exec

  stats = stats.sort((a, b) => b.total - a.total)

  let handlers = stats.slice(0, 100).map(({ name, total }) => {
    return `乂 *Command* : *${name}*\n• *Global HIT* : ${total}`
  }).join`\n\n` || 'Belum ada statistik penggunaan.'

  await conn.relayMessage(m.chat, {
    extendedTextMessage: {
      text: handlers,
      contextInfo: {
        externalAdReplyOffOffOff: {
          title: '',
          mediaType: 1,
          previewType: 0,
          renderLargerThumbnail: true,
          thumbnailUrl: 'https://telegra.ph/file/c43ee155efc11b774bee3.jpg',
          sourceUrl: ''
        }
      },
      mentions: [m.sender]
    }
  }, {})
}

handler.register = true;

export { pluginConfig as config, handler };
