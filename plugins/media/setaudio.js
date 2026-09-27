/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import fs from 'fs'
import path from 'path'

const pluginConfig = {
  name: "setaudio",
  alias: [],
  category: "media",
  description: "Imported from Rimuru MD V4.6",
  usage: "",
  example: "",
  isOwner: true,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock, prefix, command }) {
    const conn = sock;
    const usedPrefix = prefix || m.prefix || ".";
  try {
    const quoted = m.quoted || m
    const mime = quoted?.mimetype || ''

    if (!mime.startsWith('audio/')) return m.reply(`Kirim/reply audio dulu!\nContoh: reply audio lalu ketik *${usedPrefix}${command}*`)

    const filePath = '../../media/tes.mp3'
    const buffer = await quoted.download()

    fs.writeFileSync(filePath, buffer)
    m.reply('✅ Audio menu berhasil diupdate!')

  } catch (e) {
    console.error(e)
    m.reply('Error: ' + e.message)
  }
}

export { pluginConfig as config, handler };
