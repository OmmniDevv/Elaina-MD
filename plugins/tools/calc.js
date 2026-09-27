/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


// update by xnuvers007
const pluginConfig = {
  name: "calc",
  alias: ["ulat", "or", "kalk", "ulator"],
  category: "tools",
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

async function handler(m, { sock, text }) {
    const conn = sock;
  let id = m.chat
  conn.math = conn.math ? conn.math : {}
  if (id in conn.math) {
    clearTimeout(conn.math[id][3])
    delete conn.math[id]
    m.reply('Hmmm...ngecheat?')
    return
  }
  let val = text
    .replace(/[^0-9\-\/+*×÷πEe()#^√]/g, '')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/π|pi/gi, 'Math.PI')
    .replace(/e/gi, 'Math.E')
    .replace(/#/g, 'Math.sqrt')
    .replace(/√(\d+)/g, 'Math.sqrt($1)')
    .replace(/(\d+)\s*√\s*(\d+)/g, '$1*Math.sqrt($2)')
    .replace(/\^/g, '**')
    .replace(/\/+/g, '/')
    .replace(/\++/g, '+')
    .replace(/-+/g, '-')
  let format = text
    .replace(/Math\.PI/g, 'π')
    .replace(/Math\.E/g, 'e')
    .replace(/Math\.sqrt/g, '√')
    .replace(/\//g, '÷')
    .replace(/\*×/g, '×')
    .replace(/\\/g, '^')
  try {
    let result = eval(val)
    if (!isNaN(result)) {
      m.reply(`*${format}* = ${result}`)
    } else {
      throw result
    }
  } catch (e) {
    if (e === undefined) throw 'Isinya?'
    throw 'Format salah, hanya 0-9 dan Simbol -, +, *, /, ×, ÷, π, e, (, ), ^, √ yang disupport'
  }
}
handler.exp = 100

export { pluginConfig as config, handler };
