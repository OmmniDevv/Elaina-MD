/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import config from '../../config.js';
const pluginConfig = {
    name: 'tesautopostch',
    alias: ['testch', 'testautopost'],
    category: 'tools',
    description: 'Test autopost ke channel sekarang',
    usage: '.tesautopostch [pagi/siang/sore/malam]',
    example: '.tesautopostch pagi',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    try {
        const input = (m.args[0] || '').toLowerCase()
        const valid = ['pagi', 'siang', 'sore', 'malam']

        let type = valid.includes(input)
            ? input
            : valid[Math.floor(Math.random() * valid.length)]

        // 🔥 CEK GLOBAL FUNCTION
        if (typeof global.sendPost !== 'function') {
            return m.reply('❌ sendPost belum terdeteksi di global')
        }

        await global.sendPost(type)

        await sock.sendMessage(m.chat, {
            text: `╭━━━〔 💗 TEST AUTOPOST 〕━━━⬣
┃ Status: ✅ Berhasil
┃ Tipe: ${type}
┃
┃ Rimuru udah kirim duluan 😈
╰━━━━━━━━━━━━━━━━⬣`
        }, { quoted: m })

    } catch (e) {
        console.log('TEST AUTOPOST ERROR:', e)

        m.reply(`❌ Error test autopost\n${e.message}`)
    }
}

export { pluginConfig as config, handler };
