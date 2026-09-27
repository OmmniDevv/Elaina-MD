/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import config from '../../config.js';
const pluginConfig = {
    name: 'seleksif02',
    alias: ['f02', 'joinf02'],
    category: 'main',
    description: 'Seleksi masuk F02',
    usage: '.seleksif02',
    example: '.seleksif02',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

async function handler(m, { sock }) {

    const name = m.pushName || "Darling"

    const text1 = `
╭━━〔 💖 RIMURU SELECTION 💖 〕━━⬣
┃
┃ Wahh *${name}*~
┃ Darling mau seleksi *F02* yaa? 😋
┃
┃ Tapi baca syarat nya dulu ya!
┃
┃ 📜 *SYARAT MASUK F02*
┃
┃ • wajib bisa ngedit minimal
┃   *soft spoken style*
┃
┃ • umur *14+* wajib minimal 14
┃
┃ • *no drama basi*
┃
┃ • *good attitude*
┃
┃ • minimal punya pengalaman
┃   soal dunia editor
┃
┃ • *wajib CNTIKTOK*
┃
┃ Tunggu sebentar ya darling...
┃ Rimuru sedang menyiapkan
┃ akses masuk F02 💕
╰━━━━━━━━⬣
`

    await m.reply(text1)

    // delay 20 detik
    await sleep(20000)

    const text2 = `
╭━━〔 🚪 MASUK F02 〕━━⬣
┃
┃ Kalau darling sudah
┃ memenuhi semua syarat
┃
┃ Yuk langsung masuk
┃ ke grup F02 😋
┃
┃ Tekan tombol di bawah ya~
╰━━━━━━━━⬣
`

    await sock.sendMessage(m.chat, {
        text: text2,
        footer: "FAMOUS RIMURU",
        interactiveButtons: [
            {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                    display_text: "🚀 Masuk Grup F02",
                    url: "https://chat.whatsapp.com/I9wzkvn0Fyr9Lz0i8dlHOJ?mode=gi_t"
                })
            }
        ]
    }, { quoted: m })

}

export { pluginConfig as config, handler };
