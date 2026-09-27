/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fs from 'fs';
import path from 'path';
import { RIMURU_CORE_CONFIG } from "../../config.js";
import config from '../../config.js';
const pluginConfig = {
    name: 'setversi',
    alias: ['setversion', 'gantiversi', 'updateversion'],
    category: 'owner',
    description: 'Update versi bot di config.js',
    usage: '.setversi <versi_baru>',
    example: '.setversi 2.5.1',
    isOwner: true,
    cooldown: 5,
    isEnabled: true
}

async function handler(m) {
    const args = m.args || []
    const newVersion = args[0]
    
    // Validasi format versi (semver: x.x.x atau x.x)
    const versionRegex = /^\d+(\.\d+){1,2}$/
    
    if (!newVersion || !versionRegex.test(newVersion)) {
        return m.reply(
`╭───〔 𝗦𝗘𝗧𝗩𝗘𝗥𝗦𝗜 〕───⬣
│
│ ✦ *Cara Pakai*
│
│  𖦹 .setversi <versi_baru>
│
│ ✦ *Contoh*
│
│  𖦹 .setversi 2.5.1
│  𖦹 .setversi 3.0.0
│
│ ✦ *Format*
│
│  𖦹 x.x.x atau x.x
│
╰──────────────────⬣`
        )
    }
    
    m.react('⏳')
    
    try {
        const configPath = path.join(process.cwd(), 'config.js')
        
        if (!fs.existsSync(configPath)) {
            throw new Error('File config.js tidak ditemukan!')
        }
        
        // Baca file config.js
        let configContent = fs.readFileSync(configPath, 'utf8')
        
        // Cari versi lama
        const oldVersionMatch = configContent.match(/version:\s*['"`]([^'"`]+)['"`]/)
        const oldVersion = oldVersionMatch ? oldVersionMatch[1] : 'tidak diketahui'
        
        // Ganti versi dengan regex
        const newConfigContent = configContent.replace(
            /(version:\s*['"`])[^'"`]+(['"`])/,
            `$1${newVersion}$2`
        )
        
        // Tulis kembali ke config.js
        fs.writeFileSync(configPath, newConfigContent, 'utf8')
        
        // Update config yang sudah di-require
        if (config.bot) {
            RIMURU_CORE_CONFIG.bot.version = newVersion
        }
        
        m.react('✅')
        
        return m.reply(
`╭───〔 𝗦𝗘𝗧𝗩𝗘𝗥𝗦𝗜 〕───⬣
│
│ ✦ *ᴠᴇʀꜱɪ ʙᴇʀʜᴀꜱɪʟ ᴅɪᴜʙᴀʜ*
│
│  🗑️ ᴠᴇʀꜱɪ ʟᴀᴍᴀ: \`${oldVersion}\`
│  ✨ ᴠᴇʀꜱɪ ʙᴀʀᴜ: \`${newVersion}\`
│
│ ✦ *ᴄᴀᴛᴀᴛᴀɴ*
│
│  💾 ʀᴇꜱᴛᴀʀᴛ ʙᴏᴛ ᴊɪᴋᴀ ᴘᴇʀʟᴜ
│
╰──────────────────⬣`
        )
        
    } catch (error) {
        console.error('[SetVersi] Error:', error)
        m.react('❌')
        return m.reply(
`╭───〔 𝗘𝗥𝗥𝗢𝗥 〕───⬣
│
│ ❌ *ɢᴀɢᴀʟ ᴍᴇɴɢᴜʙᴀʜ ᴠᴇʀꜱɪ*
│
│ > ${error.message}
│
╰──────────────────⬣`
        )
    }
}

export { pluginConfig as config, handler };
