/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { pixa } from '../../src/scraper/removebackground.js'
import fs from 'fs'
import path from 'path'
import te from '../../src/lib/elaina-error.js'
const pluginConfig = {
    name: 'removebg',
    alias: ['rmbg', 'nobg', 'hapusbg'],
    category: 'tools',
    description: 'Menghapus background gambar',
    usage: '.removebg (reply gambar)',
    example: '.removebg',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true
};

async function handler(m, { sock }) {
    try {
        const isImage = m.isImage || (m.quoted && m.quoted.isImage);
        if (!isImage) {
            return await m.reply('❌ *ɢᴀᴍʙᴀʀ ᴅɪʙᴜᴛᴜʜᴋᴀɴ*\n\n> Reply atau kirim gambar dengan caption .removebg');
        }
        
        await m.react('🕕')
        
        let mediaBuffer;
        if (m.isImage && m.download) {
            mediaBuffer = await m.download();
        } else if (m.quoted && m.quoted.isImage && m.quoted.download) {
            mediaBuffer = await m.quoted.download();
        } else {
            return await m.reply('❌ Gagal mengunduh gambar');
        }
        
        if (!mediaBuffer || !Buffer.isBuffer(mediaBuffer)) {
            return await m.reply('❌ Buffer gambar tidak valid');
        }
        const pathnya = path.join(process.cwd(), 'temp', `rmbg_${Date.now()}.jpg`);
        fs.writeFileSync(pathnya, mediaBuffer);
        const result = await pixa(pathnya);
        
        await sock.sendMessage(m.chat, {
            image: result,
            caption: `✅ *ʙᴀᴄᴋɢʀᴏᴜɴᴅ ᴅɪʜᴀᴘᴜs*\n\n> Background gambar berhasil dihapus`
        }, { quoted: m });
        try {
            fs.unlinkSync(pathnya);
        } catch (e) {}
    } catch (error) {
        console.error('[RemoveBG Error]', error);
        m.reply(te(m.prefix, m.command, m.pushName));
    }
}

export { pluginConfig as config, handler }