// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// AI via Deline API — gratis, no key (tested 2026-09-26)
// Endpoints: /ai/gpt, /ai/copilot, /ai/deepseek
import fetch from 'node-fetch'

const DELINE = 'https://api.deline.web.id'

let handler = async (m, { conn, text, command }) => {
    if (!text) throw `Masukkan pertanyaan!\n\nContoh: .ai apa itu javascript`

    conn.sendMessage(m.chat, { react: { text: '🤔', key: m.key } })

    const model = command.toLowerCase()
    let endpoint = '/ai/gpt'
    if (model.includes('copilot')) endpoint = '/ai/copilot'
    else if (model.includes('deepseek') || model.includes('think')) endpoint = '/ai/deepseek'

    try {
        const res = await fetch(`${DILINE}${endpoint}?text=${encodeURIComponent(text)}`, { timeout: 30000 })
        const json = await res.json()

        if (!json.status || !json.result) throw 'AI tidak merespon'

        conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        await m.reply(json.result)
    } catch (e) {
        conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        throw `❌ Gagal: ${e.message}`
    }
}

handler.help = ['ai <pertanyaan>', 'aigpt <pertanyaan>', 'aicopilot <pertanyaan>', 'aideepseek <pertanyaan>']
handler.tags = ['ai']
handler.command = /^(ai|aigpt|aicopilot|aideepseek|aitink|gpt|copilot|deepseek)$/i

export default handler
