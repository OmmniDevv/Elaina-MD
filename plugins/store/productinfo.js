/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js';
const pluginConfig = {
    name: 'productinfo',
    alias: ['infoproduk', 'detailproduk'],
    category: 'store',
    description: 'Lihat detail produk',
    usage: '.productinfo <nomor>',
    example: '.productinfo 1',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    const db = getDatabase()
    const groupData = db.getGroup(m.chat) || {}
    
    if (groupData.botMode !== 'store') {
        return m.reply(`❌ Fitur ini hanya tersedia di mode *STORE*!`)
    }
    
    const products = groupData.storeConfig?.products || []
    
    if (products.length === 0) {
        return m.reply(`❌ Belum ada produk!`)
    }
    
    const idx = parseInt(m.text?.trim()) - 1
    
    if (isNaN(idx) || idx < 0 || idx >= products.length) {
        return m.reply(`❌ Nomor produk tidak valid!\n\n> Lihat: \`${m.prefix}products\``)
    }
    
    const p = products[idx]
    const stock = p.stock === -1 ? '∞' : p.stock
    
    let txt = `📦 *ᴅᴇᴛᴀɪʟ ᴘʀᴏᴅᴜᴋ*\n\n`
    txt += `> *Nama:* ${p.name}\n`
    txt += `> *Harga:* Rp ${p.price.toLocaleString('id-ID')}\n`
    txt += `> *Stok:* ${stock}\n`
    if (p.description) txt += `\n📝 *Deskripsi:*\n${p.description}\n`
    txt += `\n━━━━━━━━━━━━━━━\n`
    txt += `> \`${m.prefix}order ${idx + 1}\` untuk pesan`
    
    if (p.image) {
        await sock.sendMessage(m.chat, {
            image: { url: p.image },
            caption: txt
        }, { quoted: m })
    } else if (p.video) {
        await sock.sendMessage(m.chat, {
            video: { url: p.video },
            caption: txt
        }, { quoted: m })
    } else {
        await m.reply(txt)
    }
}

export { pluginConfig as config, handler };
