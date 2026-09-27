/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js'
import axios from 'axios'
import FormData from 'form-data'

const pluginConfig = {
    name: 'editproduk',
    alias: ['editproduct'],
    category: 'store',
    description: '✏️ Edit produk toko (hanya di private chat)',
    usage: '.editproduk <nomor> <field> <nilai>',
    example: '.editproduk 1 harga 30000',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: true,
    cooldown: 3,
    energi: 0,
    isEnabled: true
}

async function uploadToCatbox(buffer, filename = 'file.jpg') {
    try {
        const form = new FormData()
        form.append('fileToUpload', buffer, { filename })
        form.append('reqtype', 'fileupload')
        const res = await axios.post('https://catbox.moe/user/api.php', form, {
            headers: form.getHeaders(),
            timeout: 30000
        })
        return res.data?.startsWith('http') ? res.data : null
    } catch {
        return null
    }
}

async function handler(m, { sock }) {
    if (m.isGroup) {
        return m.reply(
            `🚫 *Akses Ditolak*\n\n` +
            `Untuk menjaga privasi 🛡️, pengeditan produk hanya dapat dilakukan di *private chat*.\n\n` +
            `Silakan chat bot secara langsung 📱`
        )
    }

    const db = getDatabase()
    const products = db.setting('storeProducts') || []

    if (products.length === 0) {
        return m.reply(`📭 *Belum ada produk.*\n\nTambahkan produk terlebih dahulu: \`${m.prefix}addproduk\` ➕`)
    }

    const text = m.text?.trim() || ''
    const match = text.match(/^(\d+)\s+(nama|harga|diskon|stok|deskripsi|detail|gambar|video|tipe)\s*(.*)/i)

    if (!match) {
        return m.reply(
            `✏️ *EDIT PRODUK*\n\n` +
            `📋 Format: \`${m.prefix}editproduk <nomor> <field> <nilai>\`\n\n` +
            `📌 *Field yang bisa diedit:*\n` +
            `• *nama* 🏷️ — Nama produk\n` +
            `• *harga* 💰 — Harga jual (angka)\n` +
            `• *diskon* 🏷️ — Harga asli/coret (angka, 0 untuk hapus)\n` +
            `• *stok* 📊 — Jumlah stok atau \`unlimited\`\n` +
            `• *tipe* 🔑📦 — \`digital\` atau \`fisik\`\n` +
            `• *deskripsi* 📝 — Deskripsi produk\n` +
            `• *detail* 🔒 — Info rahasia (dikirim setelah beli)\n` +
            `• *gambar* 🖼️ — Upload gambar baru (reply gambar)\n` +
            `• *video* 🎬 — Upload video baru (reply video)\n\n` +
            `📝 *Contoh:*\n` +
            `\`${m.prefix}editproduk 1 harga 30000\`\n` +
            `\`${m.prefix}editproduk 1 diskon 40000\`\n` +
            `\`${m.prefix}editproduk 1 tipe fisik\`\n` +
            `\`${m.prefix}editproduk 1 nama Netflix Premium\`\n` +
            `\`${m.prefix}editproduk 1 deskripsi Akun sharing 1 bulan\`\n` +
            `\`${m.prefix}editproduk 1 gambar\` (reply gambar 🖼️)\n\n` +
            `🏷️ _Harga diskon akan ditampilkan sebagai ~~harga asli~~ di katalog_`
        )
    }

    const idx = parseInt(match[1]) - 1
    const field = match[2].toLowerCase()
    let value = match[3]?.trim() || ''

    if (idx < 0 || idx >= products.length) {
        return m.reply(`❌ *Nomor produk tidak valid.*\n\nRentang: 1-${products.length} 📋`)
    }

    const product = products[idx]

    switch (field) {
        case 'nama': {
            if (!value || value.length < 2) return m.reply(`❌ *Nama terlalu pendek.* Minimal 2 karakter 🏷️`)
            product.name = value
            break
        }
        case 'harga': {
            const price = parseInt(value)
            if (isNaN(price) || price < 1000) return m.reply(`❌ *Harga tidak valid.* Minimal Rp 1.000 💰`)
            product.price = price
            break
        }
        case 'diskon': {
            const origPrice = parseInt(value)
            if (isNaN(origPrice) || origPrice === 0) {
                product.originalPrice = null
            } else {
                if (origPrice <= product.price) return m.reply(`❌ *Harga diskon harus lebih besar dari harga jual.*\n\nHarga jual saat ini: Rp ${product.price.toLocaleString('id-ID')} 💰`)
                product.originalPrice = origPrice
            }
            break
        }
        case 'stok': {
            product.stock = value.toLowerCase() === 'unlimited' ? -1 : parseInt(value)
            if (isNaN(product.stock)) return m.reply(`❌ *Stok tidak valid.* Gunakan angka atau \`unlimited\` 📊`)
            break
        }
        case 'tipe': {
            const newType = value.toLowerCase()
            if (newType !== 'digital' && newType !== 'fisik') {
                return m.reply(`❌ *Tipe tidak valid.* Gunakan \`digital\` 🔑 atau \`fisik\` 📦`)
            }
            if (newType === 'fisik' && product.type === 'digital' && product.stockItems?.length > 0) {
                return m.reply(
                    `⚠️ *Tidak bisa mengubah ke Fisik*\n\n` +
                    `Produk ini memiliki *${product.stockItems.length}* data akun 🔑\n` +
                    `Hapus semua stock items terlebih dahulu sebelum mengubah tipe ke Fisik.\n\n` +
                    `🗑️ Hapus semua: \`${m.prefix}editproduk ${idx + 1} stok 0\``
                )
            }
            product.type = newType
            if (newType === 'fisik' && !product.stock) product.stock = 0
            break
        }
        case 'deskripsi': {
            product.description = value.replace(/;;/g, '\n')
            break
        }
        case 'detail': {
            product.detail = value.replace(/;;/g, '\n')
            break
        }
        case 'gambar': {
            const hasMedia = m.quoted?.isMedia && (m.quoted?.isImage || m.quoted?.type === 'imageMessage')
            const isDirectImage = m.isImage
            if (!hasMedia && !isDirectImage) return m.reply(`🖼️ *Reply atau kirim gambar baru.*\n\nKirim gambar lalu reply dengan command ini.`)
            await m.reply(`⏳ _Mengunggah gambar..._`)
            try {
                const buffer = hasMedia ? await m.quoted.download() : await m.download()
                if (buffer) {
                    const url = await uploadToCatbox(buffer, 'image.jpg')
                    if (url) product.image = url
                    else return m.reply(`❌ *Gagal mengunggah gambar.* Coba lagi nanti 🖼️`)
                }
            } catch {
                return m.reply(`❌ *Gagal mengunggah gambar.* Coba lagi nanti 🖼️`)
            }
            break
        }
        case 'video': {
            const hasMedia = m.quoted?.isMedia && (m.quoted?.isVideo || m.quoted?.type === 'videoMessage')
            const isDirectVideo = m.isVideo
            if (!hasMedia && !isDirectVideo) return m.reply(`🎬 *Reply atau kirim video baru.*\n\nKirim video lalu reply dengan command ini.`)
            await m.reply(`⏳ _Mengunggah video..._`)
            try {
                const buffer = hasMedia ? await m.quoted.download() : await m.download()
                if (buffer) {
                    const url = await uploadToCatbox(buffer, 'video.mp4')
                    if (url) product.video = url
                    else return m.reply(`❌ *Gagal mengunggah video.* Coba lagi nanti 🎬`)
                }
            } catch {
                return m.reply(`❌ *Gagal mengunggah video.* Coba lagi nanti 🎬`)
            }
            break
        }
        default:
            return m.reply(`❌ *Field tidak dikenali.*\n\nGunakan: nama, harga, diskon, stok, tipe, deskripsi, detail, gambar, video 📋`)
    }

    db.setting('storeProducts', products)
    await m.react('✅')

    const typeIcon = product.type === 'fisik' ? '📦' : '🔑'
    const typeLabel = product.type === 'fisik' ? 'Fisik' : 'Digital'

    let reply = `✅ *PRODUK DIPERBARUI*\n\n`
    reply += `🏷️ Nama: *${product.name}*\n`
    reply += `💰 Harga: *Rp ${product.price.toLocaleString('id-ID')}*`
    if (product.originalPrice) reply += ` ~~Rp ${product.originalPrice.toLocaleString('id-ID')}~~`
    reply += `\n`
    reply += `${typeIcon} Tipe: *${typeLabel}*\n`
    reply += `📊 Stok: *${product.stock === -1 ? '♾️ Unlimited' : product.stock}*\n`
    if (field === 'gambar') reply += `🖼️ Gambar: ✅\n`
    if (field === 'video') reply += `🎬 Video: ✅\n`
    reply += `\n👀 _Lihat perubahan: \`${m.prefix}listproduk\`_`

    return m.reply(reply)
}

export { pluginConfig as config, handler }
