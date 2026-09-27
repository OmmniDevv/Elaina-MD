/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
import config from '../../config.js';
const pluginConfig = {
    name: 'ceknamadana',
    alias: ['cekdana'],
    category: 'tools',
    description: 'Cek Nama Pengguna Dana',
    usage: '.cekdana',
    example: '.cekdana',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 1,
    isEnabled: true
}

function isNumeric(str) {
  return !isNaN(str) && !isNaN(parseFloat(str));
}

async function handler(m, { sock }) {
    const text = m.text
    if(!text) return m.reply(`🌲 *NOTE*\n\n\`\`\`Parameter wajib diisi\`\`\`\n\n> Contoh: *${m.prefix}ceknamadana 08xxxx*`)
    if(!isNumeric(text)) return m.reply("🌿 *Hei Sobat, Hanya nomor yang di perbolehkan*")
    const Zann = text?.replace?.("62", "08")
    try {
        let { data } = await axios.get('https://api.pitucode.com/cek-name-e-wallet-id-v2?bank=DANA&accountNumber='+Zann, {
      headers: {
  "x-api-key": "7C0dEefbfc1"
}
  })
        await m.reply(`🌿 *BERHASIL*\n\n- Nama dana dari nomor \`${Zann}\` adalah *${data.data.customer_name}*`)
    } catch (error) {
        console.error('Example Plugin Error:', error)
        await m.reply(`❌ *GAGAL*\n\n> ${error.message}`)
    }
}

export { pluginConfig as config, handler };
