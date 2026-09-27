/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js'
const pluginConfig = {
    name: 'onlyadmin',
    alias: ['selfadmin', 'publicadmin', 'adminonly'],
    category: 'owner',
    description: 'Hanya admin grup yang bisa akses command bot',
    usage: '.onlyadmin on/off',
    example: '.onlyadmin on',
    isOwner: true,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m) {
    const db = getDatabase()
    const args = m.args[0]?.toLowerCase()
    const cmd = m.command.toLowerCase()
    const current = db.setting('onlyAdmin') || false

    if (cmd === 'selfadmin') {
        if (current) {
            db.setting('onlyAdmin', false)
            await m.react('❌')
            return m.reply('❌ *ᴏɴʟʏᴀᴅᴍɪɴ ɴᴏɴᴀᴋᴛɪꜰ*\n\n> Bot bisa diakses semua orang')
        }
        db.setting('onlyAdmin', true)
        db.setting('selfAdmin', false)
        db.setting('publicAdmin', false)
        await m.react('✅')
        return m.reply(
            '✅ *ᴏɴʟʏᴀᴅᴍɪɴ ᴀᴋᴛɪꜰ*\n\n' +
            '╭┈┈⬡「 🔒 *ᴀᴋsᴇs* 」\n' +
            '┃ ✅ Admin grup\n' +
            '┃ ✅ Owner bot\n' +
            '┃ ❌ Member biasa\n' +
            '╰┈┈⬡\n\n' +
            '> Gunakan `.onlyadmin off` untuk menonaktifkan'
        )
    }

    if (cmd === 'publicadmin') {
        if (current) {
            db.setting('onlyAdmin', false)
            await m.react('❌')
            return m.reply('❌ *ᴏɴʟʏᴀᴅᴍɪɴ ɴᴏɴᴀᴋᴛɪꜰ*\n\n> Bot bisa diakses semua orang')
        }
        db.setting('onlyAdmin', true)
        db.setting('selfAdmin', false)
        db.setting('publicAdmin', false)
        await m.react('✅')
        return m.reply(
            '✅ *ᴏɴʟʏᴀᴅᴍɪɴ ᴀᴋᴛɪꜰ*\n\n' +
            '╭┈┈⬡「 🔒 *ᴀᴋsᴇs* 」\n' +
            '┃ ✅ Admin grup\n' +
            '┃ ✅ Owner bot\n' +
            '┃ ✅ Private chat (semua)\n' +
            '┃ ❌ Member biasa di grup\n' +
            '╰┈┈⬡\n\n' +
            '> Gunakan `.onlyadmin off` untuk menonaktifkan'
        )
    }

    if (!args || args === 'status') {
        return m.reply(
            `🔒 *ᴏɴʟʏᴀᴅᴍɪɴ*\n\n` +
            `> Status: ${current ? '✅ Aktif' : '❌ Nonaktif'}\n\n` +
            `*Penggunaan:*\n` +
            `> \`.onlyadmin on\` — Aktifkan\n` +
            `> \`.onlyadmin off\` — Nonaktifkan\n\n` +
            `_Hanya admin grup, owner, dan private chat yang bisa akses bot_`
        )
    }

    if (args === 'on') {
        if (current) return m.reply('⚠️ OnlyAdmin sudah aktif.')
        db.setting('onlyAdmin', true)
        db.setting('selfAdmin', false)
        db.setting('publicAdmin', false)
        await m.react('✅')
        return m.reply(
            '✅ *ᴏɴʟʏᴀᴅᴍɪɴ ᴀᴋᴛɪꜰ*\n\n' +
            '╭┈┈⬡「 🔒 *ᴀᴋsᴇs* 」\n' +
            '┃ ✅ Admin grup\n' +
            '┃ ✅ Owner bot\n' +
            '┃ ✅ Private chat (semua)\n' +
            '┃ ❌ Member biasa di grup\n' +
            '╰┈┈⬡'
        )
    }

    if (args === 'off') {
        if (!current) return m.reply('⚠️ OnlyAdmin sudah nonaktif.')
        db.setting('onlyAdmin', false)
        await m.react('❌')
        return m.reply('❌ *ᴏɴʟʏᴀᴅᴍɪɴ ɴᴏɴᴀᴋᴛɪꜰ*\n\n> Bot bisa diakses semua orang')
    }

    return m.reply('❌ Argumen tidak valid. Gunakan: `on` atau `off`')
}

export { pluginConfig as config, handler }