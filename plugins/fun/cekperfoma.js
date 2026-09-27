/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'cekperforma',
    alias: ['performa', 'cekperf'],
    category: 'fun',
    description: 'Cek performa secara random (bercanda)',
    usage: '.cekperforma <nama>',
    example: '.cekperforma Budi',
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

    const durasi = Math.floor(Math.random() * 30) + 1 // menit
    const stamina = Math.floor(Math.random() * 100) + 1
    const skill = Math.floor(Math.random() * 100) + 1

    const efekList = [
        'getar dikit 😭',
        'mode santai 😌',
        'agresif 🔥',
        'auto aim 🗿',
        'combo cepat ⚡',
        'delay dikit 😅',
        'full fokus 😎',
        'mode barbar 💀'
    ]

    const roastList = [
        'baru mulai udah selesai 🗿',
        'speedrun any% 😭',
        'kayak iklan doang bentar 😅',
        'loading lama, selesai cepet 🗿',
        'timing nya... ya gitu lah 😭'
    ]

    const pujianList = [
        'tahan lama boss 🔥',
        'pro player 😎',
        'gak ada lawan 💀',
        'legendary performa 😭',
        'full combo tanpa miss 🗿'
    ]

    const efek = efekList[Math.floor(Math.random() * efekList.length)]

    let komentar = ''
    if (durasi <= 5) {
        komentar = roastList[Math.floor(Math.random() * roastList.length)]
    } else if (durasi >= 20) {
        komentar = pujianList[Math.floor(Math.random() * pujianList.length)]
    } else {
        komentar = 'standar aman 👍'
    }

    // 🔥 BAR VISUAL
    const bar = '⚡' + '═'.repeat(Math.floor(durasi / 2)) + '🔥'

    let txt = `⚡ *CEK PERFORMA*\n\n`
    txt += `> 👤 Nama: *${nama}*\n`
    txt += `> ⏱️ Durasi: *${durasi} menit*\n`
    txt += `> 🔋 Stamina: *${stamina}%*\n`
    txt += `> 🎯 Skill: *${skill}%*\n`
    txt += `> 💫 Efek: *${efek}*\n`
    txt += `> ${bar}\n\n`
    txt += `> 💬 ${komentar}`

    await m.reply(txt)
}

export { pluginConfig as config, handler };
