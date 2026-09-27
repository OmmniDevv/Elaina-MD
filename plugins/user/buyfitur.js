/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js'
import config from '../../config.js'
const pluginConfig = {
    name: 'buyfitur',
    alias: ['belifitur', 'purchasefeature', 'buyfeature'],
    category: 'user',
    description: 'Beli fitur premium (1 fitur = 3000 koin)',
    usage: '.buyfitur [nama_fitur]',
    example: '.buyfitur',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

const PRICE_PER_FEATURE = 3000

const PREMIUM_FEATURES = [
    { id: 'sticker', name: 'Sticker Unlimited', desc: 'Unlimited sticker commands' },
    { id: 'downloader', name: 'Downloader Pro', desc: 'Download tanpa limit' },
    { id: 'ai', name: 'AI Access', desc: 'Akses fitur AI premium' },
    { id: 'tools', name: 'Advanced Tools', desc: 'Tools eksklusif' },
    { id: 'game', name: 'Game Bonus', desc: '2x rewards game' }
]

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

async function handler(m, { sock }) {
    const db = getDatabase()
    const user = db.getUser(m.sender) || db.setUser(m.sender)
    const featureName = m.args[0]?.toLowerCase()
    
    if (user.isPremium || config.isPremium(m.sender)) {
        return m.reply(
            `✨ *ᴘʀᴇᴍɪᴜᴍ ᴜsᴇʀ*\n\n` +
            `> Kamu sudah premium!\n` +
            `> Semua fitur sudah ter-unlock!`
        )
    }
    
    if (!featureName) {
        const unlockedFeatures = user.unlockedFeatures || []
        
        let text = `╭━━━━━━━━━━━━━━━━━╮\n`
        text += `┃  🛒 *ʙᴜʏ ꜰɪᴛᴜʀ*\n`
        text += `╰━━━━━━━━━━━━━━━━━╯\n\n`
        
        text += `> Harga: *${formatNumber(PRICE_PER_FEATURE)}* bal/fitur\n`
        text += `> Koin: *${formatNumber(user.koin || 0)}*\n\n`
        
        text += `╭┈┈⬡「 📋 *ꜰɪᴛᴜʀ* 」\n`
        
        for (const feature of PREMIUM_FEATURES) {
            const isUnlocked = unlockedFeatures.includes(feature.id)
            const status = isUnlocked ? '✅' : '🔒'
            text += `┃ ${status} *${feature.name}*\n`
            text += `┃    _${feature.desc}_\n`
            text += `┃    ID: \`${feature.id}\`\n`
            text += `┃\n`
        }
        
        text += `╰┈┈┈┈┈┈┈┈⬡\n\n`
        text += `> Gunakan: \`.buyfitur <id>\`\n`
        text += `> Atau jadi *Premium* unlock semua!`
        
        await m.reply(text)
        return
    }
    
    const feature = PREMIUM_FEATURES.find(f => f.id === featureName)
    
    if (!feature) {
        return m.reply(
            `❌ *ɢᴀɢᴀʟ*\n\n` +
            `> Fitur \`${featureName}\` tidak ditemukan\n` +
            `> Ketik \`.buyfitur\` untuk lihat daftar`
        )
    }
    
    const unlockedFeatures = user.unlockedFeatures || []
    
    if (unlockedFeatures.includes(feature.id)) {
        return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Fitur \`${feature.name}\` sudah ter-unlock!`)
    }
    
    if ((user.koin || 0) < PRICE_PER_FEATURE) {
        return m.reply(
            `❌ *ɢᴀɢᴀʟ*\n\n` +
            `> Koin tidak cukup!\n` +
            `> Butuh: *${formatNumber(PRICE_PER_FEATURE)}*\n` +
            `> Kamu punya: *${formatNumber(user.koin || 0)}*`
        )
    }
    
    db.updateKoin(m.sender, -PRICE_PER_FEATURE)
    unlockedFeatures.push(feature.id)
    db.setUser(m.sender, { unlockedFeatures })
    
    const newKoin = db.getUser(m.sender).koin
    
    m.react('✅')
    
    await m.reply(
        `✅ *ꜰɪᴛᴜʀ ᴅɪ-ᴜɴʟᴏᴄᴋ*\n\n` +
        `╭┈┈⬡「 📋 *ᴅᴇᴛᴀɪʟ* 」\n` +
        `┃ 🎁 ꜰɪᴛᴜʀ: *${feature.name}*\n` +
        `┃ 💵 ʜᴀʀɢᴀ: *-${formatNumber(PRICE_PER_FEATURE)}* bal\n` +
        `┃ 💰 sɪsᴀ: *${formatNumber(newKoin)}*\n` +
        `╰┈┈⬡\n\n` +
        `> _${feature.desc}_\n\n` +
        `> 💡 Tip: Jadi *Premium* untuk unlock SEMUA!`
    )
}

export { pluginConfig as config, handler, PREMIUM_FEATURES }