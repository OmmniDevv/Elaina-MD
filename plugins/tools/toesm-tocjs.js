/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


/*
fitur : to esm to cjs 
creator : hilman
follow my channel https://whatsapp.com/channel/0029VbAYjQgKrWQulDTYcg2K
*/

const pluginConfig = {
  name: "toesm",
  alias: ["tocjs"],
  category: "tools",
  description: "Imported from Rimuru MD V4.6",
  usage: "",
  example: "",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 0,
  isEnabled: true,
};

async function handler(m, { command }) {
  if (!m.quoted) return m.reply('✨ reply code nya')

  let q = m.quoted
  let text =
    q.text ||
    q.caption ||
    q.msg?.text ||
    q.msg?.caption ||
    q.msg?.conversation ||
    q.msg?.extendedTextMessage?.text ||
    q.message?.conversation ||
    q.message?.extendedTextMessage?.text ||
    ''

  let input = text.trim()
  let output = ''

  if (command === 'toesm') {
    output = input
      .replace(/const (.*?) = require\(['"](.*?)['"]\)/g, 'import $1 from "$2"')
      .replace(/let (.*?) = require\(['"](.*?)['"]\)/g, 'import $1 from "$2"')
      .replace(/var (.*?) = require\(['"](.*?)['"]\)/g, 'import $1 from "$2"')
      .replace(/module\.exports\s*=\s*/g, 'export default ')
      .replace(/exports\.(\w+)\s*=\s*/g, 'export const $1 = ')
  }

  if (command === 'tocjs') {
    output = input
      .replace(/import\s+(.*?)\s+from\s+['"](.*?)['"]/g, 'const $1 = require("$2")')
      .replace(/export default /g, 'module.exports = ')
      .replace(/export const (\w+)/g, 'exports.$1')
      .replace(/export function (\w+)/g, 'exports.$1 = function')
  }

  m.reply(output)
}

export { pluginConfig as config, handler };
