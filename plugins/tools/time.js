/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'time',
    alias: ['waktu'],
    category: 'tools',
    description: 'Menampilkan waktu berdasarkan negara',
    usage: '.time <negara>',
    example: '.time Indonesia',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

const COUNTRIES = {
    indonesia: {
        name: 'Indonesia',
        flag: '🇮🇩',
        zones: [
            { name: 'WIB', offset: 7 },
            { name: 'WITA', offset: 8 },
            { name: 'WIT', offset: 9 }
        ]
    },
    malaysia: {
        name: 'Malaysia',
        flag: '🇲🇾',
        zones: [
            { name: 'MYT', offset: 8 }
        ]
    },
    singapore: {
        name: 'Singapore',
        flag: '🇸🇬',
        zones: [
            { name: 'SGT', offset: 8 }
        ]
    },
    jepang: {
        name: 'Jepang',
        flag: '🇯🇵',
        zones: [
            { name: 'JST', offset: 9 }
        ]
    },
    japan: {
        name: 'Jepang',
        flag: '🇯🇵',
        zones: [
            { name: 'JST', offset: 9 }
        ]
    },
    korea: {
        name: 'Korea Selatan',
        flag: '🇰🇷',
        zones: [
            { name: 'KST', offset: 9 }
        ]
    },
    'korea selatan': {
        name: 'Korea Selatan',
        flag: '🇰🇷',
        zones: [
            { name: 'KST', offset: 9 }
        ]
    },
    china: {
        name: 'China',
        flag: '🇨🇳',
        zones: [
            { name: 'CST', offset: 8 }
        ]
    },
    india: {
        name: 'India',
        flag: '🇮🇳',
        zones: [
            { name: 'IST', offset: 5.5 }
        ]
    },
    australia: {
        name: 'Australia',
        flag: '🇦🇺',
        zones: [
            { name: 'AWST', offset: 8 },
            { name: 'ACST', offset: 9.5 },
            { name: 'AEST', offset: 10 }
        ]
    },
    inggris: {
        name: 'Inggris',
        flag: '🇬🇧',
        zones: [
            { name: 'GMT', offset: 0 }
        ]
    },
    uk: {
        name: 'Inggris',
        flag: '🇬🇧',
        zones: [
            { name: 'GMT', offset: 0 }
        ]
    },
    amerika: {
        name: 'Amerika Serikat',
        flag: '🇺🇸',
        zones: [
            { name: 'EST', offset: -5 },
            { name: 'CST', offset: -6 },
            { name: 'MST', offset: -7 },
            { name: 'PST', offset: -8 }
        ]
    },
    usa: {
        name: 'Amerika Serikat',
        flag: '🇺🇸',
        zones: [
            { name: 'EST', offset: -5 },
            { name: 'CST', offset: -6 },
            { name: 'MST', offset: -7 },
            { name: 'PST', offset: -8 }
        ]
    }
}

function getTime(offset) {
    const now = new Date()

    // UTC timestamp + offset jam
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000)
    const date = new Date(utc + (offset * 60 * 60 * 1000))

    return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    })
}

function getDate(offset) {
    const now = new Date()

    const utc = now.getTime() + (now.getTimezoneOffset() * 60000)
    const date = new Date(utc + (offset * 60 * 60 * 1000))

    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

async function handler(m, { sock }) {
    const input = (m.args || []).join(' ').trim().toLowerCase()

    if (!input) {
        return m.reply(
            `🕐 *TIME COUNTRY*\n\n` +
            `Gunakan:\n` +
            `> ${m.prefix}time <negara>\n\n` +
            `Contoh:\n` +
            `> ${m.prefix}time Indonesia\n` +
            `> ${m.prefix}time Jepang\n` +
            `> ${m.prefix}time Malaysia\n` +
            `> ${m.prefix}time Amerika\n\n` +
            `🌍 Negara tersedia: Indonesia, Malaysia, Singapore, Jepang, Korea, China, India, Australia, Inggris, Amerika`
        )
    }

    const country = COUNTRIES[input]

    if (!country) {
        return m.reply(
            `❌ *NEGARA TIDAK DITEMUKAN*\n\n` +
            `Negara "${input}" belum tersedia.\n\n` +
            `Contoh:\n` +
            `> ${m.prefix}time Indonesia\n` +
            `> ${m.prefix}time Jepang\n` +
            `> ${m.prefix}time Malaysia\n` +
            `> ${m.prefix}time Amerika`
        )
    }

    m.react('🕐')

    try {
        let result =
            `╭━━━〔 🕐 *TIME ${country.name.toUpperCase()}* 〕━━━╮\n` +
            `┃\n` +
            `┃ ${country.flag} *${country.name}*\n` +
            `┃\n`

        for (const zone of country.zones) {
            const sign = zone.offset >= 0 ? '+' : ''
            result +=
                `┃ 🕐 *${zone.name}* (UTC${sign}${zone.offset})\n` +
                `┃    ${getTime(zone.offset)}\n` +
                `┃\n`
        }

        result +=
            `╰━━━━━━━━━━━━━━━━━━━━╯\n\n` +
            `📅 ${getDate(country.zones[0].offset)}\n` +
            `🌐 ${country.name}`

        await m.reply(result)
        m.react('✅')

    } catch (err) {
        console.error('[TIME] Error:', err)
        m.react('❌')
        return m.reply(`❌ Gagal mengambil waktu: ${err.message}`)
    }
}

export { pluginConfig as config, handler };
