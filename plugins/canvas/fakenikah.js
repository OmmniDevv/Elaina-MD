/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { createCanvas, loadImage } from '@napi-rs/canvas';

const pluginConfig = {
    name: 'fakenikah',
    alias: ['nikahfake', 'fakemarriage'],
    category: 'canvas',
    description: 'Bikin fake sertifikat nikah (buat konten/gaguan doang)',
    usage: '.fakenikah <nama1> | <nama2>',
    example: '.fakenikah Rimuru | Darling',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 8,
    energi: 1,
    isEnabled: true
}

const CANVAS_WIDTH = 1100
const CANVAS_HEIGHT = 760

function escapeXml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
}

async function generateFakeNikah(nama1, nama2) {
    const now = new Date()
    const tanggal = now.toLocaleDateString('id-ID')
    const tempat = ['Masjid Al-Aqsa', 'Gedung Serbaguna', 'Hotel Bintang 5', 'Balai Desa'][Math.floor(Math.random() * 4)]
    const aktaNo = '474/KUA/' + Math.floor(Math.random() * 1000) + '/' + now.getFullYear()
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" viewBox="0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}">
      <rect width="1100" height="760" fill="#fbf7ec"/>
      <rect x="30" y="30" width="1040" height="700" rx="10" fill="none" stroke="#333" stroke-width="4"/>
      <rect x="45" y="45" width="1010" height="670" rx="8" fill="none" stroke="#888" stroke-width="2"/>
      <text x="550" y="110" text-anchor="middle" font-family="Times New Roman, serif" font-size="34" font-weight="700">SERTIFIKAT NIKAH</text>
      <text x="550" y="150" text-anchor="middle" font-family="Times New Roman, serif" font-size="17">CONTOH / UNTUK HIBURAN</text>
      <line x1="220" y1="180" x2="880" y2="180" stroke="#333" stroke-width="2"/>
      <text x="550" y="245" text-anchor="middle" font-family="Times New Roman, serif" font-size="16">Menerangkan pasangan</text>
      <text x="550" y="305" text-anchor="middle" font-family="Times New Roman, serif" font-size="28" font-weight="700">${escapeXml(nama1).toUpperCase()}</text>
      <text x="550" y="355" text-anchor="middle" font-family="Times New Roman, serif" font-size="20">dan</text>
      <text x="550" y="405" text-anchor="middle" font-family="Times New Roman, serif" font-size="28" font-weight="700">${escapeXml(nama2).toUpperCase()}</text>
      <text x="550" y="460" text-anchor="middle" font-family="Times New Roman, serif" font-size="16">Tanggal: ${escapeXml(tanggal)}</text>
      <text x="550" y="495" text-anchor="middle" font-family="Times New Roman, serif" font-size="16">Tempat: ${escapeXml(tempat)}</text>
      <text x="550" y="535" text-anchor="middle" font-family="Times New Roman, serif" font-size="13">No. Akta: ${escapeXml(aktaNo)}</text>
      <text x="550" y="650" text-anchor="middle" font-family="Times New Roman, serif" font-size="14" fill="#666">DOKUMEN CONTOH — TIDAK BERLAKU SEBAGAI DOKUMEN RESMI</text>
    </svg>`

    const template = await loadImage(Buffer.from(svg))
    const canvas = createCanvas(template.width, template.height)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(template, 0, 0)
    return canvas.toBuffer('image/png')
}

async function handler(m, { sock }) {
    const text = m.args.join(' ') || m.text?.trim() || ''
    
    if (!text) {
        return m.reply(
            `💕 *ғᴀᴋᴇ ꜱᴇʀᴛɪꜰɪᴋᴀᴛ ɴɪᴋᴀʜ* 💕\n\n` +
            `╭━━━━━━━━━━━━━━━━━━━━━⬣\n` +
            `┃ ✦ *Cara Pakai*\n` +
            `┃\n` +
            `┃   ${m.prefix}fakenikah <nama1> | <nama2>\n` +
            `┃\n` +
            `┃ ✦ *Contoh*\n` +
            `┃\n` +
            `┃   ${m.prefix}fakenikah Rimuru | Darling\n` +
            `┃\n` +
            `┃ 💗 *Rimuru:* Mau nikah sama siapa darling~?\n` +
            `╰━━━━━━━━━━━━━━━━━━━━━⬣`
        )
    }
    
    const parts = text.split('|').map(p => p.trim())
    const nama1 = parts[0] || 'Rimuru'
    const nama2 = parts[1] || 'Darling'
    
    m.react('💕')
    await m.reply(`⏳ *ᴘʀᴏᴄᴇꜱꜱɪɴɢ...*\n\n💗 *Rimuru:* Lagi bikin sertifikat nikah darling~`)
    
    try {
        const imageBuffer = await generateFakeNikah(nama1, nama2)
        
        await sock.sendMessage(m.chat, {
            image: imageBuffer,
            caption: `💕 *ғᴀᴋᴇ ꜱᴇʀᴛɪꜰɪᴋᴀᴛ ɴɪᴋᴀʜ* 💕\n\n` +
                    `╭━━━━━━━━━━━━━━━━━━━━━⬣\n` +
                    `┃ ✅ *ʙᴇʀʜᴀꜱɪʟ*\n` +
                    `┃ 💑 *ᴘᴀꜱᴀɴɢᴀɴ*: ${nama1} & ${nama2}\n` +
                    `┃\n` +
                    `┃ 💗 *Rimuru:* Selamat ya darling! Semoga langgeng~ 🗿\n` +
                    `╰━━━━━━━━━━━━━━━━━━━━━⬣`
        }, { quoted: m })
        
        m.react('✅')
        
    } catch (err) {
        console.error('[FakeNikah] Error:', err)
        m.react('💔')
        return m.reply(`💔 *ᴇʀʀᴏʀ*\n\n> ${err.message}`)
    }
}
export { pluginConfig as config, handler };