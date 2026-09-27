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
    name: ['autogreet2', 'autosiangsore'],
    alias: ['autosiang', 'autosore', 'greetsiang', 'greetsore'],
    category: 'owner',
    description: 'Auto kirim ucapan selamat siang & sore ke Channel',
    usage: '.autogreet2 on/off/status/test/setch <1/2/3>',
    example: '.autogreet2 setch 1',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
};

// Gambar
const IMAGE = {
    siang: 'https://files.catbox.moe/tfkuf4.jpg',
    sore: 'https://files.catbox.moe/tfkuf4.jpg'
};

// Waktu default
const DEFAULT_SIANG = '12:00';
const DEFAULT_SORE = '17:00';

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

// Pesan
function getCaption(type) {
    if (type === 'siang') {
        return `
╭━━━━━━━━━━━━━━━━━━━━━━━⬣
┃ 🦋✨ 𝐙𝐄𝐑𝐎 𝐓𝐖𝐎 ✨🦋
┃ ── 「 𝐃𝐀𝐑𝐋𝐈𝐍𝐆 𝐌𝐎𝐃𝐄 」 ──
╰━━━━━━━━━━━━━━━━━━━━━━━⬣

╭━━━〔 ☀️ 𝐒𝐄𝐋𝐀𝐌𝐀𝐓 𝐒𝐈𝐀𝐍𝐆 〕━━━⬣
┃ Darling, udah siang nih! 🌞
┃ Udah makan siang belum? Jangan lupa ya~
┃ Aku gamau lihat Darling kelaparan 💕
╰━━━━━━━━━━━━━━━━━━━━━━━⬣

🔥 Tetap semangat setengah hari lagi, Darling!`;
    }
    
    return `
╭━━━━━━━━━━━━━━━━━━━━━━━⬣
┃ 🦋✨ 𝐙𝐄𝐑𝐎 𝐓𝐖𝐎 ✨🦋
┃ ── 「 𝐃𝐀𝐑𝐋𝐈𝐍𝐆 𝐌𝐎𝐃𝐄 」 ──
╰━━━━━━━━━━━━━━━━━━━━━━━⬣

╭━━━〔 🌇 𝐒𝐄𝐋𝐀𝐌𝐀𝐓 𝐒𝐎𝐑𝐄 〕━━━⬣
┃ Darling~ Matahari mulai pulang nih 🌤️
┃ Gimana harimu? Seru kan? Cerita dong 💕
┃ Sebentar lagi malem, kita lanjut lagi ya~
╰━━━━━━━━━━━━━━━━━━━━━━━⬣

💫 Istirahat dulu sebentar, Darling! Nanti malem kita lanjut~`;
}

async function handler(m, { sock }) {
    const args = m.args || [];
    const cmd = args[0]?.toLowerCase();
    const database = getDatabase();
    
    // Inisialisasi setting default
    if (!database.setting('autoGreet2Channel')) database.setting('autoGreet2Channel', '1');
    
    const currentChannel = database.setting('autoGreet2Channel') || '1';
    const saluranId = getChannelId(currentChannel);
    const saluranName = getChannelName(currentChannel);

    // ========== SET CHANNEL ==========
    if (cmd === 'setch') {
        const channelChoice = args[1];
        if (!channelChoice || !['1', '2', '3'].includes(channelChoice)) {
            return m.reply(
                `🌞 *A U T O  G R E E T  2  -  S E T  C H A N N E L*\n\n` +
                `> Pilih channel tujuan:\n` +
                `> 1️⃣ ${config.saluran?.name || 'Channel 1'} ${config.saluran?.id ? '✅' : '❌'}\n` +
                `> 2️⃣ ${config.saluran?.name2 || 'Channel 2'} ${config.saluran?.id2 ? '✅' : '❌'}\n` +
                `> 3️⃣ ${config.saluran?.name3 || 'Channel 3'} ${config.saluran?.id3 ? '✅' : '❌'}\n\n` +
                `> Contoh: .autogreet2 setch 2`
            );
        }
        
        const targetId = getChannelId(channelChoice);
        if (!targetId) {
            return m.reply(`❌ *Channel ${channelChoice} belum dikonfigurasi!*\n> Isi dulu di config.js bagian saluran.id${channelChoice}`);
        }
        
        database.setting('autoGreet2Channel', channelChoice);
        m.react('✅');
        return m.reply(
            `✅ *C H A N N E L  D I U B A H*\n\n` +
            `📢 Sekarang auto greet siang/sore akan dikirim ke:\n` +
            `> ${getChannelName(channelChoice)} (${targetId})`
        );
    }

    // ========== TEST ==========
    if (cmd === 'test') {
        if (!saluranId) {
            return m.reply(`❌ *Channel ${currentChannel} belum diisi ID-nya!*\n> Cek config.saluran.id${currentChannel}`);
        }
        m.react('🔍');
        await m.reply(`🔍 *T E S T I N G...*\n> Mengirim preview siang & sore ke ${saluranName}...`);
        try {
            await sendGreet(sock, saluranId, 'siang');
            await new Promise(res => setTimeout(res, 2000));
            await sendGreet(sock, saluranId, 'sore');
            return m.reply(`✅ *T E S T  S U C C E S S*\n> Cek Channel ${saluranName} Bos!`);
        } catch (err) {
            return m.reply(`❌ *G A G A L*\n> Alasan: ${err.message}`);
        }
    }

    // ========== SET JAM SIANG ==========
    if (cmd === 'setsiang') {
        const time = args[1];
        if (!time || !/^\d{2}:\d{2}$/.test(time)) {
            return m.reply(`❌ Format salah! Contoh: 12:00\n> Jam harus dalam format 24 jam (00:00 - 23:59)`);
        }
        database.setting('autoGreetSiang', time);
        return m.reply(`✅ Jam siang diatur ke *${time}*`);
    }

    // ========== SET JAM SORE ==========
    if (cmd === 'setsore') {
        const time = args[1];
        if (!time || !/^\d{2}:\d{2}$/.test(time)) {
            return m.reply(`❌ Format salah! Contoh: 17:00\n> Jam harus dalam format 24 jam (00:00 - 23:59)`);
        }
        database.setting('autoGreetSore', time);
        return m.reply(`✅ Jam sore diatur ke *${time}*`);
    }

    // ========== ON ==========
    if (cmd === 'on') {
        database.setting('autoGreet2', true);
        m.react('✅');
        return m.reply(`✅ *A U T O  G R E E T  2  A K T I F*\n> Channel: ${saluranName}\n> Siang & sore akan dikirim otomatis`);
    }

    // ========== OFF ==========
    if (cmd === 'off') {
        database.setting('autoGreet2', false);
        m.react('❌');
        return m.reply(`❌ *A U T O  G R E E T  2  D I N O N A K T I F K A N*`);
    }

    // ========== STATUS ==========
    const status = database.setting('autoGreet2') ? '✅ Aktif' : '❌ Nonaktif';
    const siang = database.setting('autoGreetSiang') || DEFAULT_SIANG;
    const sore = database.setting('autoGreetSore') || DEFAULT_SORE;
    
    // Cek channel mana yang sudah diisi
    const channelStatus = [
        `1️⃣ ${config.saluran?.name || 'Channel 1'}: ${config.saluran?.id ? '✅' : '❌'}`,
        `2️⃣ ${config.saluran?.name2 || 'Channel 2'}: ${config.saluran?.id2 ? '✅' : '❌'}`,
        `3️⃣ ${config.saluran?.name3 || 'Channel 3'}: ${config.saluran?.id3 ? '✅' : '❌'}`
    ].filter(c => c.includes('✅')).join('\n> ');

    return m.reply(
        `🌞 *A U T O  G R E E T  2*\n\n` +
        `╭┈┈⬡「 📋 *S T A T U S* 」\n` +
        `┃ 🔔 Status: ${status}\n` +
        `┃ 📢 Channel aktif: ${saluranName} (${saluranId || '❌'})\n` +
        `┃ ☀️ Siang: ${siang}\n` +
        `┃ 🌇 Sore: ${sore}\n` +
        `┃ 🕐 Zona: Asia/Makassar ✅\n` +
        `╰┈┈⬡\n\n` +
        `╭┈┈⬡「 📡 *C H A N N E L  T E R S E D I A* 」\n` +
        `> ${channelStatus}\n` +
        `╰┈┈⬡\n\n` +
        `> *Penggunaan:*\n` +
        `> \`${m.prefix}autogreet2 on/off\`\n` +
        `> \`${m.prefix}autogreet2 setch 1/2/3\`\n` +
        `> \`${m.prefix}autogreet2 setsiang 12:00\`\n` +
        `> \`${m.prefix}autogreet2 setsore 17:00\`\n` +
        `> \`${m.prefix}autogreet2 test\``
    );
}

async function sendGreet(sock, jid, type) {
    const imageUrl = IMAGE[type];
    const response = await fetch(imageUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(15000)
    });
    if (!response.ok) throw new Error(`Gagal memuat gambar (${response.status})`);

    const imageBuffer = Buffer.from(await response.arrayBuffer());
    await sock.sendMessage(jid, {
        image: imageBuffer,
        caption: getCaption(type)
    });
}

async function runAutoGreet2(sock) {
    const db = getDatabase();
    if (!db.setting('autoGreet2')) return;

    const now = new Date();
    const makassar = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Makassar" }));
    const currentHour = makassar.getHours();
    const currentMinute = makassar.getMinutes();

    // Ambil channel dari database
    const channelChoice = db.setting('autoGreet2Channel') || '1';
    const saluranId = getChannelId(channelChoice);
    
    if (!saluranId) return;

    if (!global.autoGreet2Lock) global.autoGreet2Lock = { siang: -1, sore: -1 };

    const siangTime = db.setting('autoGreetSiang') || DEFAULT_SIANG;
    const soreTime = db.setting('autoGreetSore') || DEFAULT_SORE;

    const [siangHour, siangMinute] = siangTime.split(':').map(Number);
    const [soreHour, soreMinute] = soreTime.split(':').map(Number);

    // CEK SIANG
    if (currentHour === siangHour && currentMinute === siangMinute) {
        if (global.autoGreet2Lock.siang !== currentHour) {
            global.autoGreet2Lock.siang = currentHour;
            try {
                await sendGreet(sock, saluranId, 'siang');
                console.log(`[AutoGreet2] ✅ Siang terkirim ke Channel ${channelChoice}`);
            } catch (e) {
                global.autoGreet2Lock.siang = -1;
                console.log('❌ Error AutoGreet2 Siang:', e.message);
            }
        }
    } else {
        if (global.autoGreet2Lock.siang !== -1) global.autoGreet2Lock.siang = -1;
    }

    // CEK SORE
    if (currentHour === soreHour && currentMinute === soreMinute) {
        if (global.autoGreet2Lock.sore !== currentHour) {
            global.autoGreet2Lock.sore = currentHour;
            try {
                await sendGreet(sock, saluranId, 'sore');
                console.log(`[AutoGreet2] ✅ Sore terkirim ke Channel ${channelChoice}`);
            } catch (e) {
                global.autoGreet2Lock.sore = -1;
                console.log('❌ Error AutoGreet2 Sore:', e.message);
            }
        }
    } else {
        if (global.autoGreet2Lock.sore !== -1) global.autoGreet2Lock.sore = -1;
    }
}
export { pluginConfig as config, handler, runAutoGreet2 };