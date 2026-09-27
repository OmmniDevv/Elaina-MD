/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'hijriyah',
    alias: ['hijri', 'tahunislam'],
    category: 'islamic',
    description: 'Menampilkan tahun hijriah saat ini',
    usage: '.hijriyah',
    example: '.hijriyah',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true
}

async function handler(m) {

    try {

        await m.react('🕌')

        const now = new Date()

        const hijri = new Intl.DateTimeFormat(
            'id-TN-u-ca-islamic',
            {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }
        ).format(now)

        const caption =
`╭━━━〔 ☪ TAHUN HIJRIAH ☪ 〕━━━⬣

🕌 Tahun Islam Saat Ini

☪ ${hijri}

📅 Masehi
${now.toLocaleDateString('id-ID')}

📖 QS. At-Taubah : 36

"Sesungguhnya jumlah bulan di sisi Allah adalah dua belas bulan."

╰━━━━━━━━━━━━━━━━⬣`

        await m.reply(caption)

        await m.react('☪️')

    } catch (err) {

        console.error(err)

        await m.react('❌')

        await m.reply('❌ Gagal mengambil tanggal Hijriah')
    }
}

export { pluginConfig as config, handler };
