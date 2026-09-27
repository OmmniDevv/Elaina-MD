/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js';
import config from '../../config.js';
import fs from 'fs';
import path from 'path';
import { getAssetBuffer } from '../../src/lib/elaina-asset-manager.js';

const pluginConfig = {
    name: ['autopromo', 'promosi'],
    alias: ['iklan'],
    category: 'owner',
    description: 'Auto promosi saluran ke grup',
    usage: '.autopromo on/off/test',
    isOwner: true
};

const CHANNEL_URL = config.saluran?.link || 'https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P';
const IMAGE_PATH = config.assets?.rimuru2;

const blacklist = []; // Bisa ditambah ID grup yang gak mau dipromosi

// Delay 4 jam (bisa disesuaikan)
const DELAY = 4 * 60 * 60 * 1000; // 4 jam

// =====================
// 🔥 COMMAND HANDLER
// =====================
async function handler(m, { sock }) {
    const db = getDatabase();
    const args = m.args[0]?.toLowerCase();

    if (args === 'on') {
        db.setting('autoPromo', true);
        return m.reply('✅ *Auto promo aktif*\n\n> Promosi akan dikirim setiap 4 jam ke 2 grup random (min 20 member)');
    }

    if (args === 'off') {
        db.setting('autoPromo', false);
        return m.reply('❌ Auto promo dimatikan');
    }

    if (args === 'test') {
        await m.reply('⏳ Mengirim test promo...');
        const result = await sendPromo(sock, true); // true = test mode (kirim ke 1 grup aja)
        if (result) {
            return m.reply('✅ Test promo berhasil dikirim!');
        } else {
            return m.reply('❌ Test promo gagal!\n\n> Cek:\n- Apakah bot admin di grup?\n- Apakah gambar `ourin2.jpg` ada?\n- Apakah ada grup dengan >20 member?');
        }
    }

    if (args === 'blacklist') {
        const targetGroup = m.args[1];
        if (targetGroup && targetGroup.includes('@g.us')) {
            if (!blacklist.includes(targetGroup)) {
                blacklist.push(targetGroup);
                return m.reply(`✅ Grup ${targetGroup} diblacklist dari auto promo`);
            } else {
                return m.reply(`⚠️ Grup sudah ada di blacklist`);
            }
        }
        return m.reply(`📋 *Blacklist Group:*\n${blacklist.length ? blacklist.join('\n') : '(kosong)'}`);
    }

    const status = db.setting('autoPromo') ? '✅ Aktif' : '❌ Off';

    return m.reply(
`📢 *AUTO PROMO RIMURU*

Status : ${status}
Delay : 4 jam
Target : 2 grup random (min 20 member)

*Perintah:*
> ${m.prefix}autopromo on
> ${m.prefix}autopromo off
> ${m.prefix}autopromo test
> ${m.prefix}autopromo blacklist (lihat blacklist)`
    );
}

// =====================
// 🔥 SEND PROMO (FIXED)
// =====================
async function sendPromo(sock, isTest = false) {
    // Validasi koneksi
    if (!sock || !sock.user) {
        console.log('[AUTO PROMO] ❌ Sock tidak ready');
        return false;
    }

    // Validasi gambar
    const imageBuffer = getAssetBuffer("rimuru2");
    if (!imageBuffer) {
        console.log('[AUTO PROMO] ❌ Gambar tidak ditemukan:', IMAGE_PATH);
        return false;
    }

    // Ambil daftar grup
    let groups;
    try {
        groups = await sock.groupFetchAllParticipating();
        if (!groups || Object.keys(groups).length === 0) {
            console.log('[AUTO PROMO] ❌ Tidak ada grup');
            return false;
        }
    } catch (err) {
        console.log('[AUTO PROMO] ❌ Gagal fetch grup:', err.message);
        return false;
    }

    // Filter grup valid
    const validGroups = Object.entries(groups)
        .filter(([id, g]) => {
            // Cek jumlah member (pastikan properti participants ada)
            const memberCount = g.participants ? g.participants.length : 0;
            return memberCount > 20 && !blacklist.includes(id);
        })
        .map(([id]) => id);

    if (!validGroups.length) {
        console.log('[AUTO PROMO] ❌ Tidak ada grup valid (min 20 member)');
        return false;
    }

    // Tentukan target
    let targets;
    if (isTest) {
        targets = [validGroups[0]]; // Test: kirim ke 1 grup aja
        if (!targets[0]) {
            console.log('[AUTO PROMO] ❌ Tidak ada grup untuk test');
            return false;
        }
    } else {
        // Random 2 grup (atau kurang kalau gak cukup)
        const shuffled = [...validGroups];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        targets = shuffled.slice(0, Math.min(2, shuffled.length));
    }

    // PROMO TEXTS
    const PROMO_TEXTS = [
`╭━━━〔 😈 SERIUS NIH? 〕━━━⬣
┃ Lu pake bot ini…
┃ tapi gak join saluran? 🗿
┃
┃ Itu kayak:
┃ makan mie tanpa bumbu 😭
┃
┃ 🔥 Di saluran:
┃ ✦ Update fitur duluan
┃ ✦ Bocoran rahasia 👀
┃ ✦ Info penting bot
┃
┃ 👇 Klik tombol di bawah
╰━━━━━━━━━━━━━━━━⬣`,

`╭━━━〔 💌 HEY DARLING 〕━━━⬣
┃ Hai kamu yang lagi scroll 👀
┃
┃ Join saluran Rimuru yuk 💕
┃ biar selalu dapet update terbaru
┃
┃ ✦ Info bot tiap hari
┃ ✦ Fitur makin OP 😈
┃
┃ 👇 Klik tombol di bawah ya
╰━━━━━━━━━━━━━━━━⬣`,

`╭━━━〔 🧠 FOMO ALERT 〕━━━⬣
┃ Banyak user lain udah join…
┃
┃ Lu masih belum? 🤨
┃
┃ ✦ Update paling cepat ⚡
┃ ✦ Info penting 🔥
┃ ✦ Bocoran fitur 👀
┃
┃ Jangan sampe ketinggalan
┃ 👇 Join sekarang
╰━━━━━━━━━━━━━━━━⬣`,

`╭━━━〔 🗿 REAL TALK 〕━━━⬣
┃ Jujur aja ya…
┃
┃ Lu pake bot tiap hari
┃ tapi gak join saluran 😏
┃
┃ Itu dosa kecil 🗿
┃
┃ 👇 Udah klik aja
┃ gratis ini 😈
╰━━━━━━━━━━━━━━━━⬣`
    ];

    const caption = PROMO_TEXTS[Math.floor(Math.random() * PROMO_TEXTS.length)];
    
    let successCount = 0;

    for (let groupId of targets) {
        try {
            // Opsi 1: Pakai sendMessage biasa dengan buttons (lebih universal)
            await sock.sendMessage(groupId, {
                image: imageBuffer,
                caption: caption + '\n\n© RIMURU AI',
                buttons: [
                    { buttonId: '.menu', buttonText: { displayText: '📋 Menu Bot' }, type: 1 },
                    { buttonId: '.owner', buttonText: { displayText: '👑 Owner Bot' }, type: 1 },
                    { buttonId: CHANNEL_URL, buttonText: { displayText: '📢 Join Saluran' }, type: 1 }
                ],
                headerType: 4
            });
            
            console.log(`[AUTO PROMO] ✅ terkirim ke ${groupId}`);
            successCount++;
            
        } catch (err) {
            // Kalau buttons error, coba kirim tanpa buttons (hanya gambar + caption)
            console.log(`[AUTO PROMO] ⚠️ Gagal kirim dengan buttons ke ${groupId}: ${err.message}`);
            
            try {
                await sock.sendMessage(groupId, {
                    image: imageBuffer,
                    caption: caption + '\n\n© RIMURU AI\n\n📢 Join: ' + CHANNEL_URL
                });
                console.log(`[AUTO PROMO] ✅ terkirim (no buttons) ke ${groupId}`);
                successCount++;
            } catch (err2) {
                console.log(`[AUTO PROMO] ❌ Gagal total ke ${groupId}: ${err2.message}`);
            }
        }
        
        // Jeda antar kirim biar gak kena rate limit
        await sleep(2000);
    }

    return successCount > 0;
}

// =====================
// 🔥 AUTO RUNNER (FIXED)
// =====================
let lastPromoTime = 0;

async function runAutoPromo(sock) {
    const db = getDatabase();
    
    // Cek setting auto promo
    if (!db.setting('autoPromo')) return;
    
    // Cek koneksi
    if (!sock || !sock.user) return;
    
    const now = Date.now();
    
    // Cek delay
    if (now - lastPromoTime < DELAY) return;
    
    // Update waktu terakhir SEBELUM kirim biar gak double
    lastPromoTime = now;
    
    console.log('[AUTO PROMO] 🔄 Menjalankan auto promo...');
    
    try {
        const result = await sendPromo(sock, false);
        if (result) {
            console.log('[AUTO PROMO] ✅ Auto promo selesai');
        } else {
            console.log('[AUTO PROMO] ❌ Auto promo gagal');
            // Kalau gagal, reset timer biar coba lagi nanti
            lastPromoTime = 0;
        }
    } catch (err) {
        console.log('[AUTO PROMO] ❌ Error:', err.message);
        lastPromoTime = 0;
    }
}

// Helper function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// =====================
// 🔥 EXPORT
// =====================
export { pluginConfig as config, handler, runAutoPromo };