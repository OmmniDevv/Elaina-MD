/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fs from 'fs/promises';
import path from 'path';
import https from 'https';
import te from '../../src/lib/elaina-error.js';

const SESSION_FILE = path.join(process.cwd(), 'database', 'ai_chat', 'dpsteaai.json');
const BASE_HOST = 'dipastebin.web.id';

const pluginConfig = {
    name: 'dpsteai',
    alias: ['dpste', 'dipasteai'],
    category: 'ai',
    description: 'Chat dengan AI dari dipastebin.web.id (mendukung session per-user)',
    usage: '.dpsteai <pertanyaan> atau .dpsteai reset (untuk hapus sesi)',
    example: '.dpsteai halo',
    isOwner: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true
};

const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
];

function generateRandomIP() {
    const ranges = [
        [1, 1], [2, 2], [5, 5], [23, 23], [27, 27], [31, 31], [36, 36], [37, 37], [39, 39], [42, 42],
        [46, 46], [49, 49], [50, 50], [60, 60], [114, 114], [117, 117], [118, 118], [119, 119], [120, 120],
        [121, 121], [122, 122], [123, 123], [124, 124], [125, 125], [126, 126], [180, 180], [182, 182], [183, 183]
    ];
    const range = ranges[Math.floor(Math.random() * ranges.length)];
    return [
        range[0],
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256)
    ].join('.');
}

function generateSessionId() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let id = 'dpste_ai_';
    for (let i = 0; i < 22; i++) {
        id += chars[Math.floor(Math.random() * chars.length)];
    }
    return id;
}

function spoofHeaders() {
    const ip = generateRandomIP();
    const ua = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
    return {
        'User-Agent': ua,
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
        'Origin': `https://${BASE_HOST}`,
        'Referer': `https://${BASE_HOST}/`,
        'X-Forwarded-For': ip,
        'X-Real-IP': ip,
        'Client-IP': ip,
        'True-Client-IP': ip,
        'X-Originating-IP': ip,
        'X-Cluster-Client-IP': ip,
        'Forwarded': `for=${ip}`
    };
}

async function loadSessions() {
    try {
        const raw = await fs.readFile(SESSION_FILE, 'utf8');
        return JSON.parse(raw);
    } catch {
        return {};
    }
}

async function saveSessions(data) {
    try {
        await fs.mkdir(path.dirname(SESSION_FILE), { recursive: true });
        await fs.writeFile(SESSION_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
        console.error('[DPSTE AI] Gagal menyimpan sesi:', e);
    }
}

function httpsPost(pathname, body) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify(body);
        const headers = spoofHeaders();
        headers['Content-Length'] = Buffer.byteLength(payload);

        const req = https.request({
            hostname: BASE_HOST,
            port: 443,
            path: pathname,
            method: 'POST',
            headers
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch {
                    resolve({ raw: data });
                }
            });
        });

        req.on('error', reject);
        req.write(payload);
        req.end();
    });
}

async function handler(m, { sock }) {
    const text = m.text?.trim();

    if (!text) {
        return m.reply(
            `🤖 *DPSTE AI*\n\n` +
            `> Halo! Aku asisten cerdas dari dipastebin.\n\n` +
            `*Cara pakai:*\n` +
            `> \`${m.prefix}dpsteai halo\`\n` +
            `> \`${m.prefix}dpsteai reset\` (hapus memori chat)`
        );
    }

    await m.react('🕕');
    
    let sessions = await loadSessions();
    const userJid = m.sender;

    if (text.toLowerCase() === 'reset') {
        if (sessions[userJid]) {
            try {
                await httpsPost('/api/ai/clear', { sessionId: sessions[userJid] });
            } catch (e) { }
            delete sessions[userJid];
            await saveSessions(sessions);
            await m.react('✅');
            return m.reply('✅ *Sesi chat berhasil direset!* Ingatan AI tentang obrolan kita sudah dihapus sepenuhnya.');
        } else {
            await m.react('❌');
            return m.reply('❌ Kamu belum memiliki sesi chat dengan AI ini. Mulailah ngobrol terlebih dahulu!');
        }
    }

    try {
        let sessionId = sessions[userJid] || generateSessionId();

        const result = await httpsPost('/api/ai/chat', {
            message: text,
            sessionId: sessionId,
            clientUser: null
        });

        if (!result.success && !result.reply) {
            await m.react('❌');
            return m.reply(`❌ Error dari server AI: ${result.error || result.raw || 'Tidak ada balasan'}`);
        }

        const activeSessionId = result.sessionId || sessionId;

        if (sessions[userJid] !== activeSessionId) {
            sessions[userJid] = activeSessionId;
            await saveSessions(sessions);
        }

        await m.react('✅');
        return m.reply(result.reply);

    } catch (err) {
        await m.react('❌');
        return m.reply(te(m.prefix, m.command, m.pushName));
    }
}

export { pluginConfig as config, handler };
