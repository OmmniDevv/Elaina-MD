/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";

const pluginConfig = {
    name: "autohapusstok",
    alias: ["autodelstok"],
    category: "store_autoorder",
    description: "📦 Menghapus stok digital tertentu dari produk",
    usage: ".autohapusstok <id_produk/nomor> | <nomor_stok>",
    example: ".autohapusstok 1 | 1",
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
    const args = m.text?.trim().split("|").map(s => s.trim());
    
    if (!args || args.length < 2) {
        return m.reply(
            `⚠️ *Format Salah*\n\n` +
            `Gunakan: \`${m.prefix}autohapusstok <ID Produk/Nomor> | <Nomor Stok>\`\n\n` +
            `*Penjelasan:*\n` +
            `Perintah ini digunakan untuk menghapus stok tertentu secara manual (misalnya jika stok invalid/hangus).\n` +
            `- Gunakan \`${m.prefix}autocekstok\` terlebih dahulu untuk mengetahui Nomor/Urutan stok.\n\n` +
            `*Contoh Penggunaan:*\n` +
            `> \`${m.prefix}autohapusstok 1 | 2\` (Menghapus stok urutan ke-2 pada produk nomor 1)`
        );
    }

    const target = args[0];
    const targetStok = parseInt(args[1]);

    if (isNaN(targetStok) || targetStok <= 0) {
        return m.reply(`❌ *Nomor stok tidak valid!*`);
    }

    await m.react("🕕");
    
    let products = db.setting('storeAutoProducts') || [];
    let index = -1;

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

    const product = products[index];
    const stok = product.stockItems || [];

    if (targetStok > stok.length) {
        return m.reply(`❌ *Stok nomor ${targetStok} tidak ditemukan.*\nTotal stok saat ini hanya ${stok.length}.`);
    }

    const stokIndex = targetStok - 1;
    const deletedStok = stok[stokIndex];
    
    stok.splice(stokIndex, 1);
    product.stockItems = stok;
    db.setting('storeAutoProducts', products);

    await m.reply(
        `✅ *STOK BERHASIL DIHAPUS*\n\n` +
        `📦 Produk: *${product.name}*\n` +
        `➖ Data Dihapus: \n\`${deletedStok}\`\n\n` +
        `📊 Sisa Stok Sekarang: *${stok.length}*`
    );
    await m.react("✅");
}

export { pluginConfig as config, handler };
