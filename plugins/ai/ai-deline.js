// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// AI via Deline API — gratis, no key.
// CATATAN (2026-09-26): endpoint AI Deline kadang error di sisi server
// (401/403/502) — plugin ini coba fallback berurutan gpt→copilot→deepseek
// dan kasih pesan jelas kalau semuanya lagi down.
import fetch from 'node-fetch'
import { elainaSay, elainaReact } from '../../lib/elainaVoice.js'

const DELINE = 'https://api.deline.web.id'

let handler = async (m, { conn, text, command }) => {
    if (!text) throw elainaSay('noargs', 'Masukkan pertanyaan!\nContoh: .ai apa itu javascript')

    conn.sendMessage(m.chat, { react: { text: elainaReact('mikir'), key: m.key } })

    const model = command.toLowerCase()
    // Urutan endpoint: mulai dari yang diminta, sisanya sebagai fallback
    let order = ['/ai/gpt', '/ai/copilot', '/ai/deepseek']
    if (model.includes('copilot')) order = ['/ai/copilot', '/ai/gpt', '/ai/deepseek']
    else if (model.includes('deepseek') || model.includes('think')) order = ['/ai/deepseek', '/ai/gpt', '/ai/copilot']

    let lastErr = null
    for (const endpoint of order) {
        try {
            const res = await fetch(`${Deline}${endpoint}?text=${encodeURIComponent(text)}`, { timeout: 30000 })
            const json = await res.json().catch(() => null)
            if (json?.status && json.result) {
                conn.sendMessage(m.chat, { react: { text: elainaReact('sukses'), key: m.key } })
                return await m.reply(json.result)
            }
            lastErr = json?.message || json?.error || `HTTP ${res.status}`
        } catch (e) {
            lastErr = e.message
        }
    }

    conn.sendMessage(m.chat, { react: { text: elainaReact('gagal'), key: m.key } })
    throw elainaSay('gagal', `Semua endpoint AI Deline sedang gangguan (${lastErr}). Coba lagi nanti, atau pakai AI lain ya~`)
}

handler.help = ['ai <pertanyaan>', 'aigpt <pertanyaan>', 'aicopilot <pertanyaan>', 'aideepseek <pertanyaan>']
handler.tags = ['ai']
handler.command = /^(ai|aigpt|aicopilot|aideepseek|aitink|gpt|copilot|deepseek)$/i

export default handler
