/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import te from '../../src/lib/elaina-error.js'
import axios from 'axios'
import config from '../../config.js'

const pluginConfig = {
    name: 'matematika',
    alias: ['mathgpt', 'math', 'mathsolver'],
    category: 'ai',
    description: 'AI untuk menyelesaikan soal matematika',
    usage: '.matematika <soal>',
    example: '.matematika 2+2 berapa?',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true
}

async function handler(m, { sock }) {
    const text = m.args.join(' ')

    if (!text) {
        return m.reply(`📐 *ᴍᴀᴛʜ ɢᴘᴛ*\n\n> Masukkan soal matematika\n\n\`Contoh: ${m.prefix}matematika 2+2 berapa?\``)
    }

    m.react('🕕')

    try {
        const url = `https://api.nexray.eu.cc/ai/mathgpt?text=${encodeURIComponent(text)}`
        
        const { data } = await axios.get(url, {
            timeout: 30000,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            }
        })

        if (!data.status || !data.result) {
            await m.react('❌')
            return m.reply("⚠️ Gagal memproses soal matematika.")
        }

        const answer = data.result

        m.react('✅')
        await m.reply(`${answer}`)

    } catch (error) {
        m.react('☢')
        m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }