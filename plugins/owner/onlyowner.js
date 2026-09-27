/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fs from 'fs';
import path from 'path';
import config from '../../config.js';
const pluginConfig = {
    name: 'onlyowner',
    alias: ['onlyownerbot', 'modeowner', 'owneronly'],
    category: 'owner',
    description: 'Atur mode hanya owner yang bisa pakai bot (owner utama + owner tambahan + creator)',
    usage: '.onlyowner on/off',
    example: '.onlyowner on',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock, db }) {
    const args = m.args || []
    const mode = args[0]?.toLowerCase()
    
    if (!mode || (mode !== 'on' && mode !== 'off')) {
        return m.reply(
`╭───〔 𝗭𝗘𝗥𝗢 𝗧𝗪𝗢 𝗢𝗡𝗟𝗬𝗢𝗪𝗡𝗘𝗥 〕───⬣
│
│ ✦ *Cara Pakai*
│
│  𖦹 .onlyowner on  = Aktifkan mode owner only
│  𖦹 .onlyowner off = Matikan mode owner only
│
│ ✦ *Fungsi*
│
│  𖦹 Saat aktif, HANYA owner utama,
│  𖦹 owner tambahan, dan creator
│  𖦹 yang bisa menggunakan bot
│
│ ✦ *Contoh*
│
│  𖦹 .onlyowner on
│
╰──────────────────⬣`
        )
    }
    
    const isEnabled = mode === 'on'
    
    // Simpan ke database (global setting)
    db.setting('onlyOwnerMode', isEnabled)
    await db.save()
    
    const status = isEnabled ? '🟢 *AKTIF*' : '🔴 *NONAKTIF*'
    const pesan = isEnabled 
        ? `> Hanya *OWNER UTAMA, OWNER TAMBAHAN & CREATOR* yang bisa menggunakan bot sekarang!`
        : `> Semua *USER* bisa menggunakan bot sekarang!`
    
    m.reply(
`╭───〔 𝗭𝗘𝗥𝗢 𝗧𝗪𝗢 𝗢𝗡𝗟𝗬𝗢𝗪𝗡𝗘𝗥 〕───⬣
│
│ ✦ *Status Mode*
│
│  ${status}
│
│ ${pesan}
│
│ ✦ *Diubah oleh*
│  @${m.sender.split('@')[0]}
│
╰──────────────────⬣`,
        { mentions: [m.sender] }
    )
}

export { pluginConfig as config, handler };
