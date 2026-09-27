/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js'

const pluginConfig = {
    name: 'liststok',
    alias: ['liststock', 'stok', 'stock'],
    category: 'store',
    description: '📋 Lihat daftar stok item produk',
    usage: '.liststok <nomor_produk>',
    example: '.liststok 1',
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
    const products = db.setting('storeProducts') || []

    if (products.length === 0) {
        return m.reply(`📭 *Belum ada produk.*\n\nTambahkan produk terlebih dahulu: \`${m.prefix}addproduk\` ➕`)
    }

    const idx = parseInt(m.text?.trim()) - 1

    if (isNaN(idx) || idx < 0 || idx >= products.length) {
        let txt = `📋 *DAFTAR STOK PRODUK*\n\nPilih produk untuk melihat stok:\n\n`
        for (let i = 0; i < products.length; i++) {
            const p = products[i]
            const typeIcon = p.type === 'fisik' ? '📦' : '🔑'
            const stockDisplay = p.type === 'fisik'
                ? (p.stock === -1 ? '♾️' : `${p.stock} pcs`)
                : `${p.stockItems?.length || 0} akun`
            const icon = (p.type === 'fisik' ? (p.stock > 0 || p.stock === -1) : (p.stockItems?.length > 0 || p.stock === -1)) ? '✅' : '⚠️'
            txt += `${typeIcon} *${i + 1}.* ${p.name} — ${stockDisplay} ${icon}\n`
        }
        txt += `\nKetik \`${m.prefix}liststok <nomor>\` untuk melihat detail stok 📊`
        return m.reply(txt)
    }

    const product = products[idx]
    const typeIcon = product.type === 'fisik' ? '📦' : '🔑'

    if (product.type === 'fisik') {
        return m.reply(
            `📦 *STOK: ${product.name}*\n\n` +
            `📊 Tipe: *Fisik*\n` +
            `📦 Total: *${product.stock === -1 ? '♾️ Unlimited' : product.stock + ' pcs'}*\n\n` +
            `*Kelola stok:*\n` +
            `• Tambah: \`${m.prefix}addstok ${idx + 1} <jumlah>\`\n` +
            `• Edit: \`${m.prefix}editproduk ${idx + 1} stok <jumlah>\`\n\n` +
            `_Stok fisik diatur berdasarkan jumlah, bukan per-item_ 📦`
        )
    }

    const stockItems = product.stockItems || []

    if (stockItems.length === 0) {
        return m.reply(
            `🔑 *Stok: ${product.name}*\n\n` +
            `📭 Belum ada stok item yang ditambahkan.\n\n` +
            `*Tambah stok:*\n` +
            `• Manual: \`${m.prefix}addstok ${idx + 1}|<detail>\`\n` +
            `• Import: \`${m.prefix}addstok ${idx + 1}\` (reply file .txt 📄)\n\n` +
            `_Stok item bersifat rahasia 🔒 dan hanya dikirim ke pembeli setelah pembayaran dikonfirmasi_`
        )
    }

    let txt = `🔑 *STOK: ${product.name}*\n\n`
    txt += `📊 Total: *${stockItems.length}* akun\n\n`

    const showItems = stockItems.slice(0, 30)
    for (let i = 0; i < showItems.length; i++) {
        const preview = showItems[i].detail.replace(/\n/g, ' ').substring(0, 40)
        txt += `\`${i + 1}.\` ${preview}${showItems[i].detail.length > 40 ? '...' : ''}\n`
    }

    if (stockItems.length > 30) {
        txt += `\n_dan ${stockItems.length - 30} item lainnya..._ 📋`
    }

    txt += `\n\n🛠️ *Kelola stok:*\n`
    txt += `🗑️ Hapus: \`${m.prefix}hapusstok ${idx + 1} <nomor_item>\`\n`
    txt += `✏️ Edit: \`${m.prefix}editstok ${idx + 1} <nomor_item>|<detail_baru>\`\n`
    txt += `➕ Tambah: \`${m.prefix}addstok ${idx + 1}|<detail>\``

    return m.reply(txt)
}

export { pluginConfig as config, handler }
