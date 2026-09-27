/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";

const pluginConfig = {
    name: "autohapusproduk",
    alias: ["autodelproduk"],
    category: "store_autoorder",
    description: "🛍️ Menghapus produk dari autoorder store",
    usage: ".autohapusproduk <id_produk/nomor>",
    example: ".autohapusproduk 1",
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 0,
    energi: 0,
    isEnabled: true,
};

async function handler(m, { sock }) {
    const db = getDatabase();
    const target = m.text?.trim();
    
    if (!target) {
        return m.reply(
            `⚠️ *Format Salah*\n\n` +
            `Ketik: \`${m.prefix}autohapusproduk <ID Produk atau Nomor>\`\n\n` +
            `*Penjelasan:*\n` +
            `Perintah ini akan menghapus sebuah produk berserta seluruh sisa stok di dalamnya secara PERMANEN dari daftar Store Autoorder.\n\n` +
            `*Contoh Penggunaan:*\n` +
            `> \`${m.prefix}autohapusproduk 1\` (Menghapus produk urutan ke-1)\n` +
            `> \`${m.prefix}autohapusproduk P-123456789\``
        );
    }

    await m.react("🕕");
    
    let products = db.setting('storeAutoProducts') || [];
    if (products.length === 0) {
        return m.reply(`📭 *Belum ada produk untuk dihapus.*`);
    }

    let index = -1;
    let deletedProduct = null;

    if (target.startsWith("P-")) {
        index = products.findIndex(p => p.id === target);
    } else {
        const num = parseInt(target);
        if (!isNaN(num) && num > 0 && num <= products.length) {
            index = num - 1;
        }
    }

    if (index === -1) {
        return m.reply(`❌ *Produk tidak ditemukan.*\nPastikan nomor urut atau ID produk valid.`);
    }

    deletedProduct = products[index];
    products.splice(index, 1);
    db.setting('storeAutoProducts', products);

    await m.reply(
        `✅ *PRODUK BERHASIL DIHAPUS*\n\n` +
        `📦 Nama: *${deletedProduct.name}*\n` +
        `🆔 ID: \`${deletedProduct.id}\`\n` +
        `🗑️ Semua sisa stok (${deletedProduct.stockItems?.length || 0}) juga ikut terhapus.`
    );
    await m.react("✅");
}

export { pluginConfig as config, handler };
