/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import config from '../../config.js';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const pluginConfig = {
    name: 'aisantai',
    alias: ['ceai', 'chateverywhere', 'ce', 'chatgpt'],
    category: 'ai',
    description: 'Chat dengan AI santai (ChatEverywhere)',
    usage: '.aisantai <pesan>',
    example: '.aisantai Halo bro',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 2,
    isEnabled: true
}

const SESSION_FILE = path.join(process.cwd(), 'database', 'chateverywhere-session.json')
const MAX_MESSAGES_PER_SESSION = 10
const TIMEOUT = 60000
const SYSTEM_PROMPT = `Kamu adalah AI santai berbahasa Indonesia. Jawab singkat, jelas, dan ramah.`

const MODEL = {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5',
    maxLength: 12000,
    tokenLimit: 4000,
    completionTokenLimit: 2500,
    deploymentName: 'gpt-35'
}

function now() {
    return Date.now()
}

function randomId() {
    return crypto.randomUUID()
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }
}

function readJson(filePath, fallback) {
    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'))
        }
        return fallback
    } catch {
        return fallback
    }
}

function writeJson(filePath, data) {
    ensureDir(path.dirname(filePath))
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

function createSession() {
    return {
        sessionId: randomId(),
        browserId: randomId(),
        createdAt: now(),
        updatedAt: now(),
        messages: []
    }
}

function getSession() {
    const data = readJson(SESSION_FILE, null)

    if (!data || !Array.isArray(data.messages) || !data.browserId) {
        const fresh = createSession()
        writeJson(SESSION_FILE, fresh)
        return fresh
    }

    const userCount = data.messages.filter(v => v.role === 'user').length

    if (userCount >= MAX_MESSAGES_PER_SESSION) {
        const fresh = createSession()
        writeJson(SESSION_FILE, fresh)
        return fresh
    }

    return data
}

function normalizeMessages(messages) {
    return messages.map(v => ({
        pluginId: null,
        content: String(v.content || ''),
        role: v.role
    }))
}

async function handler(m, { sock }) {
    const args = m.text?.trim().split(/\s+/)
    const input = args.slice(0).join(' ')

    if (!input) {
        return m.reply(
            `🤖 *AI CHAT - RIMURU* 🤖\n\n` +
            `💫 *"He~ mau ngobrol apa darling?"* 💫\n\n` +
            `📌 *Cara pakai:*\n` +
            `> ${m.prefix}aisantai <pesan>\n\n` +
            `📝 *Contoh:*\n` +
            `> ${m.prefix}aisantai Halo bro\n` +
            `> ${m.prefix}aisantai Apa kabar?\n` +
            `> ${m.prefix}aisantai Ceritakan tentang AI\n\n` +
            `📊 *Info:*\n` +
            `> 🧠 Model: GPT-3.5\n` +
            `> 🇮🇩 Bahasa: Indonesia\n` +
            `> 💬 Max per session: ${MAX_MESSAGES_PER_SESSION} pesan\n\n` +
            `🌸 *Yosh! Semangat!* 🌸`
        )
    }

    await m.reply(`⏳ *AI berpikir...*\n\n🤖 *"Tunggu sebentar darling~"* 🦋`)

    try {
        const session = getSession()

        const messages = [
            ...normalizeMessages(session.messages),
            {
                pluginId: null,
                content: input,
                fileList: [],
                role: 'user'
            }
        ]

        const body = {
            model: MODEL,
            messages,
            prompt: SYSTEM_PROMPT,
            temperature: 0.5,
            enableConversationPrompt: false
        }

        const headers = {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:151.0) Gecko/20100101 Firefox/151.0',
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'content-type': 'application/json',
            'output-language': '',
            'user-browser-id': session.browserId,
            'user-selected-plugin-id': '',
            'origin': 'https://chateverywhere.app',
            'referer': 'https://chateverywhere.app/id'
        }

        const res = await axios.post('https://chateverywhere.app/api/chat', body, {
            headers,
            timeout: TIMEOUT,
            responseType: 'text',
            validateStatus: () => true
        })

        const text = typeof res.data === 'string' ? res.data : JSON.stringify(res.data)

        if (res.status >= 200 && res.status < 300) {
            session.messages.push({
                role: 'user',
                content: input
            })

            session.messages.push({
                role: 'assistant',
                content: text
            })

            session.updatedAt = now()
            writeJson(SESSION_FILE, session)
        }

        if (res.status >= 200 && res.status < 300) {
            let replyText = text

            if (replyText.length > 2000) {
                replyText = replyText.slice(0, 2000) + '\n\n..._(pesan terlalu panjang, dipotong)_'
            }

            const userCount = session.messages.filter(v => v.role === 'user').length

            await m.reply(
                `🤖 *AI RESPONSE* 🤖\n\n` +
                `${replyText}\n\n` +
                `┌─〔 📊 *INFO* 〕─🤖\n` +
                `│ 💬 *Pesan ke-* ${userCount}/${MAX_MESSAGES_PER_SESSION}\n` +
                `│ 🧠 *Model:* GPT-3.5\n` +
                `└─────────────────────────\n\n` +
                `💬 *Rimuru:* "Gimana darling? Membantu kan? 🗿"\n` +
                `🌸 *Yosh! Semangat!* 🌸`
            )
        } else {
            await m.reply(
                `❌ *Gagal!*\n\n` +
                `> "He~ AI lagi error nih darling~ 🗿"\n\n` +
                `📊 *Status:* ${res.status}\n` +
                `📝 *Error:* ${text.slice(0, 200)}\n\n` +
                `💬 Coba lagi nanti ya~ 🌸`
            )
        }

    } catch (err) {
        console.error('[AIChat Error]', err)
        await m.reply(
            `❌ *Error!*\n\n` +
            `> "He~ ada yang salah nih darling~ 🗿"\n\n` +
            `📝 *Error:* ${err.message}\n\n` +
            `💬 Coba lagi nanti ya~ 🌸`
        )
    }
}
export { pluginConfig as config, handler };