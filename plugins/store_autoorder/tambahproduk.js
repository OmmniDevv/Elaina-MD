/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";

const pluginConfig = {
    name: "autotambahproduk",
    alias: ["autoaddproduk"],
    category: "store_autoorder",
    description: "🛍️ Menambah produk ke autoorder store",
    usage: ".autotambahproduk <nama> | <harga> | <deskripsi>",
    example: ".autotambahproduk Netflix 1 Bulan | 35000 | Akun sharing anti screen limit",
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 0,
    energi: 0,
    isEnabled: true,
};

function formatPrice(n) {
    return "Rp " + n.toLocaleString("id-ID");
}

async function handler(m, { sock }) {
    const db = getDatabase();
    const args = m.text?.trim().split("|").map(s => s.trim());
    
    if (!args || args.length < 3) {
        return m.reply(
            `⚠️ *Format Salah*\n\n` +
            `Gunakan format: \`${m.prefix}autotambahproduk <nama> | <harga> | <deskripsi>\`\n\n` +
            `*Penjelasan:*\n` +
            `- *<nama>*: Nama produk yang ingin ditambahkan\n` +
            `- *<harga>*: Harga produk dalam bentuk angka (tanpa titik)\n` +
            `- *<deskripsi>*: Keterangan singkat tentang produk\n\n` +
            `*Contoh Penggunaan:*\n` +
            `> \`${m.prefix}autotambahproduk Netflix 1 Bulan | 35000 | Akun sharing anti screen limit\``
        );
    }

    const name = args[0];
    const price = parseInt(args[1].replace(/[^0-9]/g, ''));
    const desc = args[2];

    if (isNaN(price) || price <= 0) {
        return m.reply(`❌ Harga tidak valid! Harus berupa angka lebih dari 0.`);
    }

    await m.react("🕕");
    
    const products = db.setting('storeAutoProducts') || [];
    const productId = `P-${Date.now()}`;
    
    products.push({
        id: productId,
        name,
        price,
        desc,
        type: "digital",
        stockItems: []
    });
    
    db.setting('storeAutoProducts', products);

    await m.reply(
        `✅ *PRODUK BERHASIL DITAMBAHKAN*\n\n` +
        `🆔 ID Produk: \`${productId}\`\n` +
        `📦 Nama: *${name}*\n` +
        `💰 Harga: *${formatPrice(price)}*\n` +
        `📝 Deskripsi: _${desc}_\n\n` +
        `> Selanjutnya, gunakan \`${m.prefix}autoaddstok ${productId} | <data_stok>\` untuk mengisi stok produk ini.`
    );
    await m.react("✅");
}

export { pluginConfig as config, handler };
