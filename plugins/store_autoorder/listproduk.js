/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";

const pluginConfig = {
    name: "autolistproduk",
    alias: ["autoproduk", "autostore"],
    category: "store_autoorder",
    description: "🛍️ Menampilkan daftar produk autoorder",
    usage: ".autolistproduk",
    example: ".autolistproduk",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true,
};

function formatPrice(n) {
    return "Rp " + n.toLocaleString("id-ID");
}

async function handler(m, { sock }) {
    const db = getDatabase();
    
    const products = db.setting('storeAutoProducts') || [];
    if (products.length === 0) {
        return m.reply(`📭 *Belum ada produk tersedia saat ini.*`);
    }

    await m.react("🕕");
    
    let txt = `🛍️ *DAFTAR PRODUK AUTOORDER*\n\n`;
    
    for (let i = 0; i < products.length; i++) {
        const p = products[i];
        const stockCount = p.stockItems?.length || 0;
        const status = stockCount > 0 ? `✅ Tersedia (${stockCount})` : `❌ Habis`;
        
        txt += `*${i + 1}. ${p.name}*\n`;
        if (m.isOwner) txt += `> 🆔 ID: \`${p.id}\`\n`;
        txt += `> 💰 Harga: *${formatPrice(p.price)}*\n`;
        txt += `> 📦 Stok: *${status}*\n`;
        if (p.desc) txt += `> 📝 Detail: _${p.desc}_\n`;
        txt += `\n`;
    }

    txt += `🛒 *Cara Beli:*\n`;
    txt += `Ketik \`${m.prefix}autobeli <nomor/id>\`\n\n`;
    txt += `💰 *Saldo Anda:*\n`;
    const user = db.getUser(m.sender);
    txt += `*${formatPrice(user?.saldo || 0)}* (Ketik \`${m.prefix}topupsaldo\` untuk isi saldo)`;

    await m.reply(txt);
    await m.react("✅");
}

export { pluginConfig as config, handler };
