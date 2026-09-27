/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'cekkontol',
    alias: ['kontolcheck'],
    category: 'fun',
    description: 'Cek ukuran random (bercanda doang)',
    usage: '.cekkontol <nama>',
    example: '.cekkontol Budi',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m) {
    const nama = m.text?.trim() || m.pushName || 'Kamu'
    const ukuran = Math.floor(Math.random() * 30) + 1

    const bentukList = [
        'lurus sempurna 😎',
        'belok ke kiri dikit 😏',
        'condong ke kanan tipis 🤏',
        'melengkung elegan 😅',
        'unik bentuknya 🤭',
        'kayak tanda tanya ❓',
        'zigzag dikit 🗿',
        'aerodinamis 🏎️'
    ]

    const roastList = [
        'kecil amat njir 🗿',
        'itu apaan? lidi? 😭',
        'ilang kah? gak keliatan 😭',
        'versi mini banget 🤏',
        'hemat tempat 👍',
        'travel size 😭',
        'kayak bonus doang 😅',
        'fitur tambahan aja ya? 🗿'
    ]

    const pujianList = [
        'waduh bahaya ini 🔥',
        'auto bikin pingsan 😳',
        'level dewa 😎',
        'gak masuk akal 🗿',
        'overpower banget 💀',
        'ini sih senjata 😭'
    ]

    const bentuk = bentukList[Math.floor(Math.random() * bentukList.length)]

    // 🔥 EMOJI BAR
    const panjangBar = Math.max(1, Math.floor(ukuran / 2))
    const bar = '🍆' + '═'.repeat(panjangBar) + '💦'

    let komentar = ''
    if (ukuran <= 7) {
        komentar = roastList[Math.floor(Math.random() * roastList.length)]
    } else if (ukuran >= 20) {
        komentar = pujianList[Math.floor(Math.random() * pujianList.length)]
    } else {
        komentar = 'standar manusia bumi 👍'
    }

    let txt = `📏 *CEK KONTOL*\n\n`
    txt += `> 👤 Nama: *${nama}*\n`
    txt += `> 📊 Ukuran: *${ukuran} cm*\n`
    txt += `> 📐 Bentuk: *${bentuk}*\n`
    txt += `> ${bar}\n\n`
    txt += `> 💬 ${komentar}`

    await m.reply(txt)
}
export { pluginConfig as config, handler };