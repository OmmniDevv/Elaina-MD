/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js'

const pluginConfig = {
    name: 'hapusstok',
    alias: ['delstok', 'delstock', 'deletestok'],
    category: 'store',
    description: '🗑️ Hapus stok item dari produk',
    usage: '.hapusstok <nomor_produk> <nomor_item>',
    example: '.hapusstok 1 3',
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

    const args = m.text?.trim().split(/\s+/) || []
    const productNo = parseInt(args[0]) - 1
    const itemNo = parseInt(args[1]) - 1

    if (args.length < 2 || isNaN(productNo) || isNaN(itemNo)) {
        return m.reply(
            `🗑️ *HAPUS STOK*\n\n` +
            `Format: \`${m.prefix}hapusstok <nomor_produk> <nomor_item>\`\n\n` +
            `📝 *Contoh:*\n` +
            `\`${m.prefix}hapusstok 1 3\` — Hapus item ke-3 dari produk ke-1\n\n` +
            `📋 Lihat nomor item: \`${m.prefix}liststok <nomor_produk>\``
        )
    }

    if (productNo < 0 || productNo >= products.length) {
        return m.reply(`❌ *Nomor produk tidak valid.*\n\nRentang: 1-${products.length} 📋`)
    }

    const product = products[productNo]

    if (product.type === 'fisik') {
        const reduceCount = parseInt(args[1])
        if (isNaN(reduceCount) || reduceCount <= 0) {
            return m.reply(
                `📦 *Produk Fisik*\n\n` +
                `Untuk mengurangi stok fisik, gunakan:\n` +
                `\`${m.prefix}editproduk ${productNo + 1} stok <jumlah_baru>\`\n\n` +
                `Stok saat ini: *${product.stock === -1 ? '♾️ Unlimited' : product.stock + ' pcs'}*`
            )
        }
        if (product.stock !== -1) {
            product.stock = Math.max(0, product.stock - reduceCount)
            db.setting('storeProducts', products)
            await m.react('✅')
            return m.reply(
                `📦 *STOK FISIK DIKURANGI*\n\n` +
                `🏷️ Produk: *${product.name}*\n` +
                `➖ Dikurangi: *${reduceCount} pcs*\n` +
                `📊 Sisa stok: *${product.stock} pcs*`
            )
        }
        return m.reply(`♾️ *Stok unlimited tidak bisa dikurangi.*\n\nUbah tipe stok terlebih dahulu: \`${m.prefix}editproduk ${productNo + 1} stok <jumlah>\``)
    }

    const stockItems = product.stockItems || []

    if (itemNo < 0 || itemNo >= stockItems.length) {
        return m.reply(`❌ *Nomor item tidak valid.*\n\nRentang: 1-${stockItems.length}\n\n📋 Lihat daftar: \`${m.prefix}liststok ${productNo + 1}\``)
    }

    const deleted = stockItems.splice(itemNo, 1)[0]
    product.stock = stockItems.length
    db.setting('storeProducts', products)

    await m.react('✅')
    return m.reply(
        `🗑️ *STOK DIHAPUS*\n\n` +
        `🏷️ Produk: *${product.name}*\n` +
        `🔑 Item: \`${deleted.detail.replace(/\n/g, ' ').substring(0, 50)}\`\n` +
        `📊 Sisa stok: *${stockItems.length}* akun`
    )
}

export { pluginConfig as config, handler }
