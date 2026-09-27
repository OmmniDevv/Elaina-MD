/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { f } from '../../src/lib/elaina-http.js'
import te from '../../src/lib/elaina-error.js'
const pluginConfig = {
    name: 'muslimai',
    alias: ['islamai', 'quranai'],
    category: 'ai',
    description: 'AI untuk bertanya tentang Islam dan Al-Quran',
    usage: '.muslimai <pertanyaan>',
    example: '.muslimai Apa itu sholat?',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true
}

class MuslimAI {
    constructor() {
        this.url = "https://www.muslimai.io/api/chat";
        this.headers = { "Content-Type": "application/json" };
    }

    _id() {
        return "019e7d1d-e8a4-702d-96b8-defd87522114";
    }

    _body(q) {
        return JSON.stringify({
            query: q,
            distinctId: this._id()
        });
    }

    _opts(q) {
        return {
            method: "POST",
            headers: this.headers,
            body: this._body(q)
        };
    }

    _parse(res) {
        let txt = "";
        for (const l of res.split("\n")) {
            try {
                const p = JSON.parse(l);
                if (p.type === "text") txt += p.data;
            } catch {}
        }
        return txt || res;
    }

    async chat(q) {
        const req = await fetch(this.url, this._opts(q));
        const res = await req.text();
        return this._parse(res);
    }
}

async function handler(m, { sock }) {
    const text = m.args.join(' ')
    if (!text) {
        return m.reply(`☪️ *ᴍᴜsʟɪᴍ ᴀɪ*\n\n> Masukkan pertanyaan tentang Islam\n\n\`Contoh: ${m.prefix}muslimai Apa itu sholat?\``)
    }

    m.react('🕕')

    try {
        const data = await new MuslimAI().chat(`${text}`)
        let response = `${data}`

        m.react('✅')
        await m.reply(response)

    } catch (error) {
        m.react('☢')
        m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }