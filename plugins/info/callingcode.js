/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import fetch from 'node-fetch'

const pluginConfig = {
  name: "callingcode",
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

async function handler(m, { text, prefix, command }) {
    const usedPrefix = prefix || m.prefix || ".";
  if (!text) return m.reply(`Example: ${usedPrefix}${command} 62`)

  try {
    let url = API('lol', '/api/callingcode/' + text)
    let res = await fetch(url)
    let json = await res.json()

    if (json.status !== 200) throw 'API Error'

    let d = json.result

    let msg = `
📞 *Calling Code Information*

🌍 Negara      : ${d.name}
📱 Kode Telp   : +${d.callingCodes.join(', ')}
🏙️ Ibu Kota    : ${d.capital}
🗺️ Region      : ${d.region}
🔖 ISO2        : ${d.alpha2Code}
🔖 ISO3        : ${d.alpha3Code}
🌐 Domain      : ${d.topLevelDomain.join(', ')}
`.trim()

    m.reply(msg)

  } catch (e) {
    m.reply('Kode tidak ditemukan atau API sedang error')
  }
}

export { pluginConfig as config, handler };
