/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js';
import config from '../../config.js';

const pluginConfig = {
    name: ['autogreetvid', 'autovideo', 'greetvideo'],
    alias: ['autovidpagi', 'autovidmalam', 'greetvid'],
    category: 'owner',
    description: 'Auto kirim video ucapan selamat pagi & malam ke Channel',
    usage: '.autogreetvid on/off/status/test/setch <1/2/3>',
    example: '.autogreetvid setch 1',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
};

// Lokasi video
const VIDEO = {
    pagi: 'https://files.catbox.moe/xqrex2.mp4',
    malam: 'https://files.catbox.moe/roo141.mp4'
};

// Waktu default
const DEFAULT_PAGI = '05:00';
const DEFAULT_MALAM = '22:00';

// Ambil channel ID berdasarkan pilihan
function getChannelId(choice) {
    const channelMap = {
        '1': config.saluran?.id,
        '2': config.saluran?.id2,
        '3': config.saluran?.id3
    };
    return channelMap[choice] || config.saluran?.id;
}

// Ambil nama channel berdasarkan pilihan
function getChannelName(choice) {
    const nameMap = {
        '1': config.saluran?.name || 'Channel 1',
        '2': config.saluran?.name2 || 'Channel 2',
        '3': config.saluran?.name3 || 'Channel 3'
    };
    return nameMap[choice] || `Channel ${choice}`;
}

// Pesan caption
function getCaption(type) {
    if (type === 'pagi') {
        return `
╭━━━━━━━━━━━━━━━━━━━━━━━⬣
┃ 🦋✨ 𝐙𝐄𝐑𝐎 𝐓𝐖𝐎 ✨🦋
┃ ── 「 𝐃𝐀𝐑𝐋𝐈𝐍𝐆 𝐌𝐎𝐃𝐄 」 ──
╰━━━━━━━━━━━━━━━━━━━━━━━⬣

╭━━━〔 🌅 𝐒𝐄𝐋𝐀𝐌𝐀𝐓 𝐏𝐀𝐆𝐈 〕━━━⬣
┃ Ohayou, Darling~ ☀️
┃ Jangan lupa sarapan biar kuat
┃ nemenin aku hari ini 💕
╰━━━━━━━━━━━━━━━━━━━━━━━⬣

✨ Ayo semangat, jangan buat aku nunggu~`;
    }
    
    return `
╭━━━━━━━━━━━━━━━━━━━━━━━⬣
┃ 🦋✨ 𝐙𝐄𝐑𝐎 𝐓𝐖𝐎 ✨🦋
┃ ── 「 𝐃𝐀𝐑𝐋𝐈𝐍𝐆 𝐌𝐎𝐃𝐄 」 ──
╰━━━━━━━━━━━━━━━━━━━━━━━⬣

╭━━━〔 🌙 𝐒𝐄𝐋𝐀𝐌𝐀𝐓 𝐌𝐀𝐋𝐀𝐌 〕━━━⬣
┃ Oyasumi, Darling~ 🌌
┃ Mimpi indah ya... 
┃ tapi jangan mimpiin selain aku 😘
╰━━━━━━━━━━━━━━━━━━━━━━━⬣

💫 Tidurlah, besok kita main lagi~`;
}

async function handler(m, { sock }) {
    const args = m.args || [];
    const cmd = args[0]?.toLowerCase();
    const database = getDatabase();
    
    // Inisialisasi setting default
    if (!database.setting('autoGreetVidChannel')) database.setting('autoGreetVidChannel', '1');
    
    const currentChannel = database.setting('autoGreetVidChannel') || '1';
    const saluranId = getChannelId(currentChannel);
    const saluranName = getChannelName(currentChannel);

    // ========== SET CHANNEL ==========
    if (cmd === 'setch') {
        const channelChoice = args[1];
        if (!channelChoice || !['1', '2', '3'].includes(channelChoice)) {
            return m.reply(
                `🎬 *A U T O  G R E E T  V I D  -  S E T  C H A N N E L*\n\n` +
                `> Pilih channel tujuan:\n` +
                `> 1️⃣ ${config.saluran?.name || 'Channel 1'} ${config.saluran?.id ? '✅' : '❌'}\n` +
                `> 2️⃣ ${config.saluran?.name2 || 'Channel 2'} ${config.saluran?.id2 ? '✅' : '❌'}\n` +
                `> 3️⃣ ${config.saluran?.name3 || 'Channel 3'} ${config.saluran?.id3 ? '✅' : '❌'}\n\n` +
                `> Contoh: .autogreetvid setch 2`
            );
        }
        
        const targetId = getChannelId(channelChoice);
        if (!targetId) {
            return m.reply(`❌ *Channel ${channelChoice} belum dikonfigurasi!*\n> Isi dulu di config.js bagian saluran.id${channelChoice}`);
        }
        
        database.setting('autoGreetVidChannel', channelChoice);
        m.react('✅');
        return m.reply(
            `✅ *C H A N N E L  D I U B A H*\n\n` +
            `📢 Sekarang auto greet video akan dikirim ke:\n` +
            `> ${getChannelName(channelChoice)} (${targetId})`
        );
    }

    // ========== TEST ==========
    if (cmd === 'test') {
        if (!saluranId) {
            return m.reply(`❌ *Channel ${currentChannel} belum diisi ID-nya!*\n> Cek config.saluran.id${currentChannel}`);
        }
        m.react('🔍');
        await m.reply(`🔍 *T E S T I N G...*\n> Mengirim preview video ke ${saluranName}...`);
        try {
            await sendGreet(sock, saluranId, 'pagi');
            await new Promise(res => setTimeout(res, 2000));
            await sendGreet(sock, saluranId, 'malam');
            return m.reply(`✅ *T E S T  S U C C E S S*\n> Cek Channel ${saluranName} Bos!`);
        } catch (err) {
            return m.reply(`❌ *G A G A L*\n> Alasan: ${err.message}`);
        }
    }

    // ========== SET JAM PAGI ==========
    if (cmd === 'setpagi') {
        const time = args[1];
        if (!time || !/^\d{2}:\d{2}$/.test(time)) {
            return m.reply(`❌ Format salah! Contoh: 05:00\n> Jam harus dalam format 24 jam (00:00 - 23:59)`);
        }
        database.setting('autoGreetVidPagi', time);
        return m.reply(`✅ Jam pagi diatur ke *${time}*`);
    }

    // ========== SET JAM MALAM ==========
    if (cmd === 'setmalam') {
        const time = args[1];
        if (!time || !/^\d{2}:\d{2}$/.test(time)) {
            return m.reply(`❌ Format salah! Contoh: 22:00\n> Jam harus dalam format 24 jam (00:00 - 23:59)`);
        }
        database.setting('autoGreetVidMalam', time);
        return m.reply(`✅ Jam malam diatur ke *${time}*`);
    }

    // ========== ON ==========
    if (cmd === 'on') {
        database.setting('autoGreetVid', true);
        m.react('✅');
        return m.reply(`✅ *A U T O  G R E E T  V I D E O  A K T I F*\n> Channel: ${saluranName}\n> Video pagi & malam akan dikirim otomatis`);
    }

    // ========== OFF ==========
    if (cmd === 'off') {
        database.setting('autoGreetVid', false);
        m.react('❌');
        return m.reply(`❌ *A U T O  G R E E T  V I D E O  D I N O N A K T I F K A N*`);
    }

    // ========== STATUS ==========
    const status = database.setting('autoGreetVid') ? '✅ Aktif' : '❌ Nonaktif';
    const pagi = database.setting('autoGreetVidPagi') || DEFAULT_PAGI;
    const malam = database.setting('autoGreetVidMalam') || DEFAULT_MALAM;
    
    // Cek channel mana yang sudah diisi
    const channelStatus = [
        `1️⃣ ${config.saluran?.name || 'Channel 1'}: ${config.saluran?.id ? '✅' : '❌'}`,
        `2️⃣ ${config.saluran?.name2 || 'Channel 2'}: ${config.saluran?.id2 ? '✅' : '❌'}`,
        `3️⃣ ${config.saluran?.name3 || 'Channel 3'}: ${config.saluran?.id3 ? '✅' : '❌'}`
    ].filter(c => c.includes('✅')).join('\n> ');

    return m.reply(
        `🎬 *A U T O  G R E E T  V I D E O*\n\n` +
        `╭┈┈⬡「 📋 *S T A T U S* 」\n` +
        `┃ 🔔 Status: ${status}\n` +
        `┃ 📢 Channel aktif: ${saluranName} (${saluranId || '❌'})\n` +
        `┃ 🌅 Pagi: ${pagi}\n` +
        `┃ 🌙 Malam: ${malam}\n` +
        `┃ 🎬 Tipe: Video\n` +
        `┃ 🕐 Zona: Asia/Makassar ✅\n` +
        `╰┈┈⬡\n\n` +
        `╭┈┈⬡「 📡 *C H A N N E L  T E R S E D I A* 」\n` +
        `> ${channelStatus}\n` +
        `╰┈┈⬡\n\n` +
        `> *Penggunaan:*\n` +
        `> \`${m.prefix}autogreetvid on/off\`\n` +
        `> \`${m.prefix}autogreetvid setch 1/2/3\`\n` +
        `> \`${m.prefix}autogreetvid setpagi 06:00\`\n` +
        `> \`${m.prefix}autogreetvid setmalam 23:00\`\n` +
        `> \`${m.prefix}autogreetvid test\``
    );
}

async function sendGreet(sock, jid, type) {
    const isPagi = type === 'pagi';
    const videoPath = isPagi ? VIDEO.pagi : VIDEO.malam;
    
    if (!videoPath) {
        throw new Error(`URL video ${type} tidak tersedia!`);
    }

    await sock.sendMessage(jid, {
        video: { url: videoPath },
        caption: getCaption(type),
        mimetype: 'video/mp4'
    });
}

async function runAutoGreetVideo(sock) {
    const db = getDatabase();
    if (!db.setting('autoGreetVid')) return;

    const now = new Date();
    const makassar = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Makassar" }));
    const currentHour = makassar.getHours();
    const currentMinute = makassar.getMinutes();

    // Ambil channel dari database
    const channelChoice = db.setting('autoGreetVidChannel') || '1';
    const saluranId = getChannelId(channelChoice);
    
    if (!saluranId) return;

    if (!global.autoGreetVidLock) global.autoGreetVidLock = { pagi: -1, malam: -1 };

    const pagiTime = db.setting('autoGreetVidPagi') || DEFAULT_PAGI;
    const malamTime = db.setting('autoGreetVidMalam') || DEFAULT_MALAM;

    const [pagiHour, pagiMinute] = pagiTime.split(':').map(Number);
    const [malamHour, malamMinute] = malamTime.split(':').map(Number);

    // CEK PAGI
    if (currentHour === pagiHour && currentMinute === pagiMinute) {
        if (global.autoGreetVidLock.pagi !== currentHour) {
            global.autoGreetVidLock.pagi = currentHour;
            try {
                await sendGreet(sock, saluranId, 'pagi');
                console.log(`[AutoGreetVideo] ✅ Video Pagi terkirim ke Channel ${channelChoice}`);
            } catch (e) {
                global.autoGreetVidLock.pagi = -1;
                console.log('❌ Error AutoGreetVideo Pagi:', e.message);
            }
        }
    } else {
        if (global.autoGreetVidLock.pagi !== -1) global.autoGreetVidLock.pagi = -1;
    }

    // CEK MALAM
    if (currentHour === malamHour && currentMinute === malamMinute) {
        if (global.autoGreetVidLock.malam !== currentHour) {
            global.autoGreetVidLock.malam = currentHour;
            try {
                await sendGreet(sock, saluranId, 'malam');
                console.log(`[AutoGreetVideo] ✅ Video Malam terkirim ke Channel ${channelChoice}`);
            } catch (e) {
                global.autoGreetVidLock.malam = -1;
                console.log('❌ Error AutoGreetVideo Malam:', e.message);
            }
        }
    } else {
        if (global.autoGreetVidLock.malam !== -1) global.autoGreetVidLock.malam = -1;
    }
}
export { pluginConfig as config, handler, runAutoGreetVideo };