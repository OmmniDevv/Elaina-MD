/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";

const pluginConfig = {
    name: "autobeli",
    alias: ["autoorder", "autobuy"],
    category: "store_autoorder",
    description: "🛒 Membeli produk autoorder secara otomatis pakai saldo",
    usage: ".autobeli <nomor/id_produk>",
    example: ".autobeli 1",
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
    
    if (m.isGroup && m.groupMetadata) {
        const groupData = db.getGroup(m.chat) || {};
        if (groupData.botMode !== "autoorder" || !groupData.storeConfig?.autoorder) {
            return m.reply(`❌ *Autoorder Tidak Aktif*\n\nFitur pembelian otomatis hanya tersedia di grup dengan mode autoorder aktif.`);
        }
    }
    
    const target = m.text?.trim();
    if (!target) {
        return m.reply(
            `🛒 *Pilih Produk*\n\n` +
            `Ketik \`${m.prefix}autobeli <nomor_produk>\` untuk memesan.\n\n` +
            `*Penjelasan:*\n` +
            `Perintah ini digunakan untuk membeli produk autoorder secara otomatis menggunakan Saldo.\n` +
            `Saldo kamu akan terpotong, dan bot akan langsung mengirimkan produk pesanan (beserta data stoknya) melalui *Pesan Pribadi (PM)* agar aman.\n\n` +
            `*Langkah Pembelian:*\n` +
            `1. Ketik \`${m.prefix}autolistproduk\` untuk melihat daftar produk yang tersedia.\n` +
            `2. Jika saldo kurang, silakan \`${m.prefix}topupsaldo\`.\n` +
            `3. Beli dengan format \`${m.prefix}autobeli <nomor>\`. Contoh: \`${m.prefix}autobeli 1\``
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
        return m.reply(`❌ *Produk tidak ditemukan.*\nPastikan nomor urut valid (Cek \`${m.prefix}autolistproduk\`).`);
    }

    const product = products[index];
    const stok = product.stockItems || [];

    if (stok.length === 0) {
        return m.reply(`❌ *Stok Habis*\n\nMohon maaf, stok untuk produk *${product.name}* saat ini kosong.`);
    }

    const user = db.getUser(m.sender) || db.setUser(m.sender);
    const saldo = user.saldo || 0;

    if (saldo < product.price) {
        return m.reply(
            `💸 *Saldo Tidak Cukup*\n\n` +
            `Harga: *${formatPrice(product.price)}*\n` +
            `Saldo Anda: *${formatPrice(saldo)}*\n` +
            `Kurang: *${formatPrice(product.price - saldo)}*\n\n` +
            `> Ketik \`${m.prefix}topupsaldo\` untuk isi saldo.`
        );
    }
    const newSaldo = db.updateSaldo(m.sender, -product.price);
    const itemToGive = stok.shift();
    const itemFormatted = itemToGive.replace(/;;/g, '\n');
    product.stockItems = stok;
    db.setting('storeAutoProducts', products);
    try {
        let msgToUser = `🎉 *PEMBELIAN BERHASIL*\n\n`;
        msgToUser += `📦 Produk: *${product.name}*\n`;
        msgToUser += `💰 Harga: *${formatPrice(product.price)}*\n`;
        msgToUser += `📄 Deskripsi: _${product.desc}_\n\n`;
        msgToUser += `⬇️ *BERIKUT ADALAH PESANAN ANDA* ⬇️\n\n`;
        msgToUser += `\`\`\`${itemFormatted}\`\`\`\n\n`;
        msgToUser += `_Terima kasih telah berbelanja!_ 💖\n`;
        msgToUser += `Sisa saldo Anda: *${formatPrice(newSaldo)}*`;

        await sock.sendMessage(m.sender, { text: msgToUser });
        if (m.isGroup) {
            await m.reply(`✅ *Pembelian Berhasil!*\n\nDetail pesanan dan data akun telah dikirimkan melalui *Chat Pribadi* (Japri) ya kak! 💌\nCek PM bot sekarang.`);
        } else {
            await m.react("✅");
        }
        
    } catch (e) {
        await m.reply(`⚠️ *PENGIRIMAN GAGAL*\n\nPembayaran berhasil tetapi bot gagal mengirimkan pesan ke nomor Anda.\nSilakan chat bot terlebih dahulu (kirim pesan 'P' ke bot), lalu hubungi Admin untuk claim pesanan.`);
    }
}

export { pluginConfig as config, handler };
