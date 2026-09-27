/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";

const pluginConfig = {
    name: "autocekstok",
    alias: ["autoliststok", "autostok"],
    category: "store_autoorder",
    description: "📦 Melihat daftar stok digital suatu produk",
    usage: ".autocekstok <id_produk/nomor>",
    example: ".autocekstok 1",
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
            `Gunakan: \`${m.prefix}autocekstok <ID Produk/Nomor>\`\n\n` +
            `*Penjelasan:*\n` +
            `Perintah ini digunakan untuk melihat seluruh daftar stok yang tersisa/belum terjual pada suatu produk tertentu.\n\n` +
            `*Contoh Penggunaan:*\n` +
            `> \`${m.prefix}autocekstok 1\` (Mengecek sisa stok di produk urutan 1)\n` +
            `> \`${m.prefix}autocekstok P-123456789\``
        );
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

    if (stok.length === 0) {
        return m.reply(`📭 Stok untuk produk *${product.name}* saat ini kosong.`);
    }

    let txt = `📦 *DAFTAR STOK: ${product.name}*\n\n`;
    for (let i = 0; i < stok.length; i++) {
        txt += `*${i + 1}.* \`${stok[i]}\`\n`;
    }
    
    txt += `\n📊 Total Stok: *${stok.length}*\n`;
    txt += `> Hapus stok pakai \`${m.prefix}autohapusstok ${product.id} | <nomor_stok>\``;

    await m.reply(txt);
    await m.react("✅");
}

export { pluginConfig as config, handler };
