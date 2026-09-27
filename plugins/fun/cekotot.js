/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'cekotot',
    alias: ['ototcheck', 'cekmuscle'],
    category: 'fun',
    description: 'Cek seberapa berotot kamu (random)',
    usage: '.cekotot <nama>',
    example: '.cekotot Budi',
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
    const power = Math.floor(Math.random() * 100) + 1

    const bentukList = [
        'sixpack samar 😎',
        'berisi dan padat 💪',
        'atlet vibes 🏋️',
        'bodybuilder mode 🔥',
        'lean tapi kuat ⚡',
        'dad bod santai 😌',
        'tipis tapi effort 😅',
        'kenceng kayak batu 🗿'
    ]

    const roastList = [
        'ini otot apa bayangan? 😭',
        'tipis banget njir 🗿',
        'angin lewat langsung goyang 😅',
        'push up 1x udah capek 😭',
        'kayak belum unlock fitur 💀'
    ]

    const pujianList = [
        'gila ini sih tank 🔥',
        'sekali pukul KO 😎',
        'body idaman 😭',
        'auto jadi sigma 💪',
        'monster gym 🗿'
    ]

    const bentuk = bentukList[Math.floor(Math.random() * bentukList.length)]

    let komentar = ''
    if (power <= 30) {
        komentar = roastList[Math.floor(Math.random() * roastList.length)]
    } else if (power >= 80) {
        komentar = pujianList[Math.floor(Math.random() * pujianList.length)]
    } else {
        komentar = 'lumayan lah masih progress 👍'
    }

    // 🔥 BAR OTOT
    const bar = '💪' + '═'.repeat(Math.floor(power / 5)) + '🔥'

    let txt = `💪 *CEK OTOT*\n\n`
    txt += `> 👤 Nama: *${nama}*\n`
    txt += `> 📊 Power: *${power}%*\n`
    txt += `> 🏋️ Bentuk: *${bentuk}*\n`
    txt += `> ${bar}\n\n`
    txt += `> 💬 ${komentar}`

    await m.reply(txt)
}
export { pluginConfig as config, handler };