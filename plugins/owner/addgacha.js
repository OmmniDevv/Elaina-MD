/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fs from 'fs';
import path from 'path';
// plugins/owner/add-gacha.js

const pluginConfig = {
    name: 'addgacha',
    alias: ['add-gacha', 'tambahgacha', 'adddarling'],
    category: 'owner',
    description: 'Tambah karakter ke database gacha darling',
    usage: '.add-gacha Nama Karakter | https://url.mp4',
    example: '.add-gacha Rimuru | https://example.com/video.mp4',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true
};

// Path file JSON
const DARLING_JSON_PATH = path.join(process.cwd(), 'database', 'darling.json');

// Pastikan folder database ada
function ensureDatabase() {
    const dbDir = path.join(process.cwd(), 'database');
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }
    if (!fs.existsSync(DARLING_JSON_PATH)) {
        fs.writeFileSync(DARLING_JSON_PATH, JSON.stringify({ characters: [] }, null, 2));
    }
}
ensureDatabase();

// Fungsi baca JSON
function getDarlingList() {
    try {
        const data = fs.readFileSync(DARLING_JSON_PATH, 'utf-8');
        const json = JSON.parse(data);
        return json.characters || [];
    } catch (err) {
        console.error('[AddGacha] Error baca JSON:', err);
        return [];
    }
}

// Fungsi simpan JSON
function saveDarlingList(characters) {
    try {
        const data = JSON.stringify({ characters }, null, 2);
        fs.writeFileSync(DARLING_JSON_PATH, data, 'utf-8');
        return true;
    } catch (err) {
        console.error('[AddGacha] Error simpan JSON:', err);
        return false;
    }
}

async function handler(m, { sock, args, prefix, command }) {
    // 🔥 FIX: Ambil args dari m.text atau m.args
    let commandArgs = [];
    
    // Coba ambil dari m.args dulu
    if (m.args && Array.isArray(m.args)) {
        commandArgs = m.args;
    } 
    // Kalo gak ada, ambil dari m.text
    else if (m.text) {
        // Hapus prefix dan command dari text
        const textWithoutCommand = m.text.replace(new RegExp(`^${prefix}${command}`), '').trim();
        // Pisahin berdasarkan spasi tapi perhatikan kutipan
        commandArgs = textWithoutCommand.match(/(?:[^\s"']+|"[^"]*"|'[^']*')/g) || [];
        // Bersihin kutipan
        commandArgs = commandArgs.map(arg => arg.replace(/^["']|["']$/g, ''));
    }
    
    const fullText = commandArgs.join(' ');
    
    console.log('[AddGacha] Command args:', commandArgs);
    console.log('[AddGacha] Full text:', fullText);
    
    // Cek format: NAMA | URL
    if (!fullText || !fullText.includes('|')) {
        return m.reply(
            `❌ *Format salah!*\n\n` +
            `> Gunakan format:\n` +
            `> \`${prefix}add-gacha Nama Karakter | https://url-video.mp4\`\n\n` +
            `> Contoh:\n` +
            `> \`${prefix}add-gacha Rimuru | https://example.com/zerotwo.mp4\`\n` +
            `> \`${prefix}add-gacha Ichigo | https://cdn.com/ichigo.mp4\`\n\n` +
            `> Contoh multi URL:\n` +
            `> \`${prefix}add-gacha Rimuru | https://url1.mp4,https://url2.mp4\``
        );
    }

    // Pisahkan nama dan URL
    const separatorIndex = fullText.indexOf('|');
    let name = fullText.substring(0, separatorIndex).trim();
    let urlPart = fullText.substring(separatorIndex + 1).trim();

    if (!name || !urlPart) {
        return m.reply(
            `❌ *Nama atau URL tidak boleh kosong!*\n\n` +
            `> Format: \`Nama | URL\`\n` +
            `> Contoh: \`Rimuru | https://example.com/video.mp4\``
        );
    }

    // Handle multiple URLs (pisah pake koma)
    let urls = [];
    if (urlPart.includes(',')) {
        urls = urlPart.split(',').map(u => u.trim());
    } else {
        urls = [urlPart];
    }

    // Filter URL yang valid
    urls = urls.filter(u => u.startsWith('http://') || u.startsWith('https://'));
    
    if (urls.length === 0) {
        return m.reply(
            `❌ *URL tidak valid!*\n\n` +
            `> Pastikan URL dimulai dengan http:// atau https://\n` +
            `> URL: \`${urlPart}\``
        );
    }

    // Baca data yang sudah ada
    let characters = getDarlingList();
    
    // Cek apakah nama sudah ada
    const existingIndex = characters.findIndex(
        c => c.name.toLowerCase() === name.toLowerCase()
    );

    let action = '';
    let newList = [...characters];

    if (existingIndex !== -1) {
        // Update karakter yang sudah ada
        const existingUrls = characters[existingIndex].urls || [characters[existingIndex].url];
        const allUrls = [...new Set([...existingUrls, ...urls])];
        
        newList[existingIndex] = {
            name: name,
            urls: allUrls,
            updated_at: new Date().toISOString(),
            updated_by: m.pushName || m.sender.split('@')[0]
        };
        action = `🔄 *UPDATE* (+${urls.length} video baru)`;
    } else {
        // Tambah karakter baru
        newList.push({
            name: name,
            urls: urls,
            added_at: new Date().toISOString(),
            added_by: m.pushName || m.sender.split('@')[0]
        });
        action = `✨ *TAMBAH BARU* (${urls.length} video)`;
    }

    // Simpan ke file
    if (saveDarlingList(newList)) {
        m.react('✅');
        
        const totalChars = newList.length;
        const totalVideos = newList.reduce((sum, c) => sum + (c.urls || [c.url]).length, 0);
        
        let urlPreview = urls[0].substring(0, 50);
        if (urls.length > 1) {
            urlPreview += `... (+${urls.length - 1} video lain)`;
        } else if (urls[0].length > 50) {
            urlPreview += '...';
        }
        
        return m.reply(
            `╭━━〔 🎀 *GACHA DARLING* 〕━━⬣\n` +
            `│\n` +
            `│ ${action}\n` +
            `│\n` +
            `│ 💗 *Nama:* ${name}\n` +
            `│ 🎬 *Total Video:* ${urls.length}\n` +
            `│ 📹 *Preview:* ${urlPreview}\n` +
            `│\n` +
            `│ 📊 *Total karakter:* ${totalChars}\n` +
            `│ 🎥 *Total video:* ${totalVideos}\n` +
            `│\n` +
            `│ 💕 *Sekarang bisa di-gacha dengan:*\n` +
            `│    \`${prefix}gacha-zero\`\n` +
            `│\n` +
            `╰━━━━━━━━━━━━━━━━━⬣`
        );
    } else {
        m.react('❌');
        return m.reply(`❌ *Gagal menyimpan!* Coba lagi nanti.\n\n> Cek permission folder database.`);
    }
}

export { pluginConfig as config, handler };
