/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js'

const pluginConfig = {
    name: 'hapuslist',
    alias: ['dellist', 'deletelist'],
    category: 'store',
    description: '🗑️ Hapus informasi toko',
    usage: '.hapuslist <nomor>',
    example: '.hapuslist 1',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    const db = getDatabase()
    const lists = db.setting('storeLists') || []

    if (lists.length === 0) {
        return m.reply(`📭 *Belum ada informasi.*\n\nTambahkan informasi terlebih dahulu: \`${m.prefix}addlist\` ➕`)
    }

    const idx = parseInt(m.text?.trim()) - 1

    if (isNaN(idx) || idx < 0 || idx >= lists.length) {
        let txt = `🗑️ *Pilih Informasi yang Dihapus*\n\nKetik \`${m.prefix}hapuslist <nomor>\`\n\n`
        for (let i = 0; i < lists.length; i++) {
            const l = lists[i]
            const mediaIcon = l.image ? '🖼️' : l.video ? '🎬' : '📝'
            txt += `${mediaIcon} *${i + 1}.* ${l.name}\n`
        }
        return m.reply(txt)
    }

    const deleted = lists.splice(idx, 1)[0]
    db.setting('storeLists', lists)

    await m.react('✅')
    return m.reply(
        `🗑️ *INFORMASI DIHAPUS*\n\n` +
        `🏷️ Nama: *${deleted.name}*\n\n` +
        `⚠️ _Informasi telah dihapus secara permanen dan tidak dapat dikembalikan._`
    )
}

export { pluginConfig as config, handler }
