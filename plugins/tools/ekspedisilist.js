/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


const pluginConfig = {
  name: "ekspedisilist",
  alias: [],
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

async function handler(m, { sock }) {
    const conn = sock;
  const ekspedisi = [
    'shopee-express', 'ninja', 'lion-parcel', 'pos-indonesia', 'tiki',
    'acommerce', 'gtl-goto-logistics', 'paxel', 'sap-express', 'indah-logistik-cargo',
    'lazada-express-lex', 'lazada-logistics', 'janio-asia', 'jet-express', 'pcp-express',
    'pt-ncs', 'nss-express', 'grab-express', 'rcl-red-carpet-logistics', 'qrim-express',
    'ark-xpress', 'standard-express-lwe', 'luar-negeri-bea-cukai'
  ]

  let teks = `📦 *Daftar Ekspedisi yang Tersedia:*\n\n${ekspedisi.map(v => `• ${v}`).join('\n')}`

  await conn.reply(m.chat, teks, m)
}

export { pluginConfig as config, handler };
