/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import cron from 'node-cron';
import { RIMURU_CORE_CONFIG } from "../../config.js";
import config from '../../config.js';
import { getDatabase } from '../../src/lib/elaina-database.js';
const pluginConfig = {
    name: 'autosahur',
    alias: ['sahur'],
    category: 'religi',
    description: 'Pengingat sahur otomatis (Setiap jam 03:00)',
    usage: '.autosahur on/off',
    example: '.autosahur on',
    isGroup: true,
    isBotAdmin: false,
    isAdmin: true,
    cooldown: 5,
    energi: 0,
    isEnabled: true
};

const AUDIO_SAHUR = 'https://raw.githubusercontent.com/AhmadAkbarID/media/refs/heads/main/sahur.mp3';
let sahurTask = null;
function initSahurCron(sock) {
    if (sahurTask) sahurTask.stop();
    sahurTask = cron.schedule('00 03 * * *', async () => {
        const db = getDatabase();
        if (!db) return;

        try {
            const groupsObj = await sock.groupFetchAllParticipating();
            const groupList = Object.keys(groupsObj);
            
            for (const jid of groupList) {
                const groupData = db.getGroup(jid) || {};
                
                if (groupData.autoSahur === true) {
                    try {
                        await sock.sendMessage(jid, {
                            audio: { url: AUDIO_SAHUR },
                            mimetype: 'audio/mpeg',
                            ptt: true,
                            contextInfo: {
                                isForwarded: true,
                                forwardingScore: 777,
                                externalAdReply: {
                                    title: '🌙 WAKTU SAHUR!',
                                    body: 'Sahur dulu kawan-kawan! 🥘',
                                    thumbnailUrl: 'https://cdn.gimita.id/download/sahur-ilustrasi-qazwa_1771141170617_2377330d.jpg',
                                    sourceUrl: RIMURU_CORE_CONFIG.saluran?.link || '',
                                    mediaType: 1,
                                    renderLargerThumbnail: true
                                }
                            }
                        });
                        await new Promise(res => setTimeout(res, 2000));
                    } catch (e) {
                         console.log(`[AutoSahur] Gagal kirim ke ${jid}:`, e.message);
                    }
                }
            }
        } catch (e) {
            console.error('[AutoSahur] Cron Job Error:', e);
        }
    }, {
        scheduled: true,
        timezone: "Asia/Jakarta"
    });
    
    console.log('[AutoSahur] Cron job initialized (03:00 WIB)');
}

async function handler(m, { sock, db }) {
    if (!m.isGroup) return m.reply(config.messages.groupOnly);
    if (!m.isAdmin && !m.isOwner) return m.reply(config.messages.adminOnly);

    const args = m.args[0]?.toLowerCase();

    if (args === 'on') {
        db.setGroup(m.chat, { autoSahur: true });
        m.reply('✅ *Auto Sahur Diaktifkan!*\n\n> Bot akan mengirim pengingat di grup ini setiap jam 03:00 WIB.');
    } else if (args === 'off') {
        db.setGroup(m.chat, { autoSahur: false });
        m.reply('❌ *Auto Sahur Dinonaktifkan di grup ini!*');
    } else {
        m.reply(`*AUTO SAHUR*
            
⚠️ Gunakan: \`${m.prefix}autosahur on/off\``);
    }
}

export { pluginConfig as config, handler, initSahurCron };
