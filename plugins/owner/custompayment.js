/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js'

const pluginConfig = {
  name: 'custompayment',
  alias: ['setpayment', 'setpaytext'],
  category: 'owner',
  description: 'Atur teks custom untuk .payment dengan placeholder',
  usage: '.custompayment <teks> / .custompayment reset',
  isOwner: true,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 0,
  isEnabled: true
}

async function handler(m) {
  const db = getDatabase()
  const input = m.text?.trim()
  const current = db.setting('customPaymentText') || ''

  if (!input) {
    return m.reply(
      `📝 *CUSTOM PAYMENT TEXT*\n\n` +
      `Teks saat ini:\n${current || '_(belum diatur, pakai default)_'}\n\n` +
      `*PLACEHOLDER YANG TERSEDIA:*\n` +
      `• \`{botname}\` — Nama bot\n` +
      `• \`{owner}\` — Nama owner\n` +
      `• \`{methods}\` — Daftar e-wallet\n` +
      `• \`{banks}\` — Daftar bank\n` +
      `• \`{qris}\` — Status QRIS\n\n` +
      `*CONTOH:*\n` +
      `> \`${m.prefix}custompayment Halo! Bayar ke {methods}\`\n\n` +
      `> \`${m.prefix}custompayment reset\` — Kembalikan ke default`
    )
  }

  if (input.toLowerCase() === 'reset') {
    db.setting('customPaymentText', '')
    return m.reply('✅ Teks custom payment direset ke default.')
  }

  db.setting('customPaymentText', input)
  return m.reply(`✅ Teks custom payment disimpan!\n\nPreview:\n${input}`)
}

export { pluginConfig as config, handler }
