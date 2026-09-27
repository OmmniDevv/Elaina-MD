/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

/***
  @ Base: https://chat.mistral.ai
  @ Author: Shannz (Adapted for WA Bot)
  @ Note: Mistral AI plugin with session handling and reaction status.
***/

import axios from 'axios';
import crypto from 'crypto';

const CONFIG = {
    BASE_URL: 'https://chat.mistral.ai',
    HEADERS: {
        'User-Agent': 'le-chat-mobile/2.7.0 (build:20700421; os_name:ios; device_category:smartphone; device_model:iPhone 17 Pro; device_manufacturer:Apple)',
        'Accept-Language': 'en-US',
        'Accept': '*/*',
        'Content-Type': 'application/json'
    }
};

const Helpers = {
    uid: () => crypto.randomUUID(),

    jar: (headers) => {
        if (!headers || !headers['set-cookie']) return {};
        const cookies = Array.isArray(headers['set-cookie'])
            ? headers['set-cookie']
            : [headers['set-cookie']];
        return Object.fromEntries(
            cookies.map(c => {
                const a = c.indexOf('=');
                return a < 0 ? [] : [c.slice(0, a).trim(), c.slice(a + 1).split(';')[0].trim()];
            }).filter(e => e.length)
        );
    },

    jarStr: (jar) => Object.entries(jar).map(([k, v]) => `${k}=${v}`).join('; '),

    getToken: (buffer) => {
        const idx = buffer.indexOf('\n');
        if (idx === -1) return { token: '', rest: buffer };
        return { token: buffer.slice(0, idx), rest: buffer.slice(idx + 1) };
    },

    peel: (raw) => {
        const sep = raw.indexOf(':');
        if (sep < 1 || isNaN(parseInt(raw[0]))) return null;
        try { return JSON.parse(raw.slice(sep + 1)); } catch { return null; }
    },

    extract: (patch) => {
        if (patch.op === 'append' && patch.path && patch.path.includes('/text')) {
            return patch.value;
        }
        if (patch.op === 'replace' && patch.path === '/contentChunks') {
            if (Array.isArray(patch.value) && patch.value[0]?.text) {
                return patch.value[0].text;
            }
        }
        return '';
    },

    dateCtx: () => {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    }
};

const mistral = {
    _send: async (endpoint, data, cookie = '') => {
        const headers = { ...CONFIG.HEADERS };
        if (cookie) headers.Cookie = cookie;
        const res = await axios.post(`${CONFIG.BASE_URL}${endpoint}`, data, { headers });
        return { data: res.data, cookies: Helpers.jar(res.headers) };
    },

    _handshake: async () => {
        const { cookies } = await mistral._send(
            '/api/trpc/event.sendEventToDatalake,event.sendEventToDatalake?batch=1',
            {
                "0": { "json": { "name": "app_downloaded", "properties": {} } },
                "1": {
                    "json": {
                        "name": "app_started",
                        "properties": {
                            "os": "iOS", "osVersion": "18.3.2",
                            "deviceManufacturer": "Apple",
                            "screenWidth": 430, "screenHeight": 932,
                            "windowWidth": 430, "windowHeight": 932,
                            "pixelRatio": 3, "fontScale": 1,
                            "deviceColorScheme": "dark",
                            "preferredLocale": "en-US",
                            "permissions": {
                                "notifications": "undetermined",
                                "camera": "undetermined",
                                "mediaLibrary": "denied"
                            }
                        }
                    }
                }
            }
        );

        const cookie = Helpers.jarStr(cookies);
        await mistral._send('/api/trpc/user.acceptToS?batch=1', { "0": { "json": {} } }, cookie);
        return { cookie, identifier: Helpers.uid() };
    },

    _createRoom: async (text, session) => {
        const { data } = await axios.post(
            `${CONFIG.BASE_URL}/api/trpc/message.newChat?batch=1`,
            {
                "0": {
                    "json": {
                        "files": [],
                        "content": [{ "type": "text", "text": text }],
                        "transcriptionsMetadata": null, "agentId": null,
                        "agentsApiAgentId": null, "features": ["beta-websearch"],
                        "integrations": [], "libraries": [],
                        "productType": "chat", "projectId": null,
                        "incognito": null, "chatId": null,
                        "parentId": null, "parentVersion": null
                    },
                    "meta": {
                        "values": {
                            "transcriptionsMetadata": ["undefined"],
                            "agentId": ["undefined"],
                            "agentsApiAgentId": ["undefined"],
                            "projectId": ["undefined"],
                            "incognito": ["undefined"],
                            "chatId": ["undefined"],
                            "parentId": ["undefined"],
                            "parentVersion": ["undefined"]
                        },
                        "v": 1
                    }
                }
            },
            { headers: { ...CONFIG.HEADERS, Cookie: session.cookie } }
        );

        return data[0].result.data.json.chatId;
    },

    _compose: (message, roomId, session, fresh) => ({
        chatId: roomId,
        stableAnonymousIdentifier: session.identifier,
        platform: "mobile",
        clientPromptData: {
            currentDate: Helpers.dateCtx(),
            userTimezone: "T+07:00 (Asia/Jakarta)"
        },
        shouldAwaitStreamBackgroundTasks: true,
        shouldUseMessagePatch: true,
        supportedTaskCallbacks: [
            "ask_user_question", "ask_user_confirmation",
            "collect_workflow_input", "delegate_workflow_execution",
            "enable_connector"
        ],
        features: ["beta-websearch"],
        integrations: [],
        libraries: [],
        mode: fresh ? "start" : "append",
        messageId: fresh ? undefined : Helpers.uid(),
        messageInput: fresh ? undefined : [{ "type": "text", "text": message }],
        disabledFeatures: fresh ? ["memory-inference"] : undefined,
        messageFiles: fresh ? undefined : []
    }),

    _stream: async function* (payload, session) {
        const res = await axios.post(`${CONFIG.BASE_URL}/api/chat`, payload, {
            headers: { ...CONFIG.HEADERS, Cookie: session.cookie, Accept: 'text/event-stream' },
            responseType: 'stream'
        });

        let buf = '';

        for await (const chunk of res.data) {
            buf += chunk.toString();
            while (buf.includes('\n')) {
                const { token, rest } = Helpers.getToken(buf);
                buf = rest;
                if (!token.trim()) continue;

                const ev = Helpers.peel(token);
                if (!ev || !ev.json?.patches) continue;

                for (const p of ev.json.patches) {
                    const v = Helpers.extract(p);
                    if (v) yield v;
                }
            }
        }
    },

    createSession: async () => {
        const session = await mistral._handshake();
        return session;
    },

    send: async (message, session = null, roomId = null) => {
        const fresh = !session || !roomId;

        if (!session) session = await mistral.createSession();
        if (!roomId) {
            roomId = await mistral._createRoom(message, session);
        }

        const payload = mistral._compose(message, roomId, session, fresh);
        let output = '';

        for await (const token of mistral._stream(payload, session)) {
            output += token;
        }

        return {
            response: output.trim(),
            room: roomId,
            session
        };
    }
};

const pluginConfig = {
    name: 'mistral',
    alias: ['mistralai', 'chatmistral'],
    category: 'ai',
    description: 'AI Chat using Mistral AI',
    usage: '.mistral <pesan>',
    example: '.mistral Halo, apa kabar?',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 1,
    isEnabled: true
};

async function handler(m, { text, prefix, command }) {
    if (!text) {
        if (m.react) await m.react('❌');
        return m.reply(`*Format Salah!*\n\nContoh penggunaan:\n\`${prefix || '.'}${command} Halo, jelaskan tentang planet Mars!\``);
    }

    if (m.react) await m.react('⏳');

    try {
        const res = await mistral.send(text);
        if (m.react) await m.react('✅');
        await m.reply(res.response);
    } catch (error) {
        console.error('Mistral Plugin Error:', error);
        if (m.react) await m.react('❌');
        await m.reply('❌ *GAGAL*\n\n> ' + error.message);
    }
}

export { pluginConfig as config, handler };
