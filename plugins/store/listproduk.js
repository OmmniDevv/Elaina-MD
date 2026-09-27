/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";
import config from "../../config.js";

const pluginConfig = {
  name: "listproduk",
  alias: ["produk", "katalog", "catalog"],
  category: "store",
  description: "🛍️ Lihat daftar produk yang tersedia",
  usage: ".listproduk",
  example: ".listproduk",
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
  const products = db.setting("storeProducts") || [];

  if (products.length === 0) {
    return m.reply(
      `🏪 *Produk Belum Tersedia*\n\n` +
        `Saat ini belum ada produk yang ditambahkan oleh admin 😔\n\n` +
        `Silakan cek kembali nanti atau hubungi admin untuk informasi lebih lanjut.\n\n` +
        `_Terima kasih atas ketertarikan Anda_ 🙏`,
    );
  }

  let txt = `🛍️ *DAFTAR PRODUK*\n\n`;
  txt += `Berikut adalah produk yang tersedia saat ini 🎉\n`;
  txt += `Untuk pembelian, ketik \`${m.prefix}beli <nomor>\`\n\n`;

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const type = p.type || "digital";
    const typeIcon = type === "digital" ? "🔑" : "📦";
    const typeLabel = type === "digital" ? "Digital" : "Fisik";

    let stockDisplay;
    if (type === "digital") {
      const count = p.stockItems?.length || 0;
      stockDisplay = p.stock === -1 ? "♾️ Unlimited" : `${count} akun`;
    } else {
      stockDisplay = p.stock === -1 ? "♾️ Unlimited" : `${p.stock} pcs`;
    }

    const isAvailable =
      type === "digital"
        ? p.stockItems?.length > 0 || p.stock === -1
        : p.stock > 0 || p.stock === -1;
    const statusIcon = isAvailable ? "✅" : "❌";

    const priceStr = formatPrice(p.price);
    const originalPriceStr = p.originalPrice
      ? `~~${formatPrice(p.originalPrice)}~~ `
      : "";

    txt += `*${i + 1}.* ${typeIcon} ${p.name}\n`;
    txt += `   💰 ${originalPriceStr}${priceStr}\n`;
    txt += `   📊 Stok: ${stockDisplay} ${statusIcon}\n`;
    txt += `   🏷️ Tipe: ${typeLabel}\n`;
    if (p.description)
      txt += `   📝 _${p.description.substring(0, 60)}${p.description.length > 60 ? "..." : ""}_\n`;
    txt += `\n`;
  }

  txt += `💡 _Ketik \`${m.prefix}beli <nomor>\` untuk memesan produk_`;

  if (m.isGroup) {
    const saluranId = config.saluran?.id || "120363412350560864@newsletter";
    const saluranName = config.saluran?.name || config.bot?.name || "Rimuru-AI";
    await sock.sendMessage(
      m.chat,
      {
        text: txt,
        contextInfo: {
          forwardingScore: 9999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: saluranId,
            newsletterName: saluranName,
            serverMessageId: 127,
          },
        },
      },
      { quoted: m },
    );
  } else {
    await m.reply(txt);
  }
}

export { pluginConfig as config, handler };
