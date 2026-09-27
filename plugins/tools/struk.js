/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'struk',
    alias: ['printstruk', 'buatstruk', 'pdfstruk'],
    category: 'tools',
    description: 'Membuat struk belanja simpel (Nama Store, No Telp, Produk, Jumlah, Harga, Tanggal)',
    usage: '.struk <Nama Store> | <No Telp> | <Produk> | <Jumlah> | <Harga>',
    example: '.struk Toko Berkah | 08123456789 | Kopi Susu | 2 | 5000',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true
};

function rupiah(value) {
  return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
}

function waktuSekarang() {
  const parts = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(new Date());

  const get = (type) => parts.find((part) => part.type === type)?.value;
  return `${get("day")}-${get("month")}-${get("year")} ${get("hour")}:${get("minute")}`;
}

async function handler(m, { usedPrefix, prefix, command, text, sock, conn }) {
  const clientBot = sock || conn;

  // Validasi jika perintah diketik kosong
  if (!text || text.trim().length === 0) {
    if (typeof m.react === 'function') await m.react('❌');
    let warning = `❌ *Format Perintah Salah!*\n\n`;
    warning += `Gunakan format di bawah ini:\n\n`;
    warning += `📌 *Tanpa Custom Toko:*\n`;
    warning += `> \`${prefix}${command} Nama Produk | Jumlah | Harga\`\n\n`;
    warning += `📌 *Dengan Custom Toko:*\n`;
    warning += `> \`${prefix}${command} Nama Store | No Telp | Nama Produk | Jumlah | Harga\``;
    return await m.reply(warning);
  }

  if (typeof m.react === 'function') await m.react('⏳');

  try {
    let storeInfo = {
      nama: "KARIS JAYA SHOP",
      telp: "0812345678"
    };

    let items = [];
    const parts = text.split('|').map(p => p.trim());

    // Cek apakah user menginput custom store (minimal 5 bagian: Store, Telp, Produk, Jumlah, Harga)
    if (parts.length >= 5) {
      storeInfo.nama = parts[0];
      storeInfo.telp = parts[1];
      items.push({
        nama: parts[2],
        qty: Number(parts[3]) || 1,
        harga: Number(parts[4]) || 0,
        subtotal: (Number(parts[3]) || 1) * (Number(parts[4]) || 0)
      });
    } else if (parts.length >= 3) {
      // Format simple (hanya Produk, Jumlah, Harga)
      items.push({
        nama: parts[0],
        qty: Number(parts[1]) || 1,
        harga: Number(parts[2]) || 0,
        subtotal: (Number(parts[1]) || 1) * (Number(parts[2]) || 0)
      });
    } else {
      throw new Error("Format kurang lengkap! Gunakan: Nama Produk | Jumlah | Harga");
    }

    const tanggalStr = waktuSekarang();
    const totalQty = items.reduce((a, b) => a + b.qty, 0);
    const subTotal = items.reduce((a, b) => a + b.subtotal, 0);

    let struk = "```\n";
    struk += "================================\n";
    struk += `         ${storeInfo.nama.substring(0, 22).padEnd(22, ' ')}        \n`;
    struk += `      Telp: ${storeInfo.telp.substring(0, 16).padEnd(16, ' ')}          \n`;
    struk += "================================\n";
    struk += `Tanggal : ${tanggalStr}\n`;
    struk += "================================\n";

    items.forEach((item, i) => {
      struk += `${i + 1}. ${item.nama}\n`;
      struk += `   Jumlah : ${item.qty}\n`;
      struk += `   Harga  : ${rupiah(item.harga)}\n`;
      struk += `   Subtotal: ${rupiah(item.subtotal)}\n`;
    });

    struk += "================================\n";
    struk += `TOTAL     : ${rupiah(subTotal)}\n`;
    struk += "================================\n";
    struk += "     Terimakasih & Selamat      \n";
    struk += "          Berbelanja            \n";
    struk += "================================\n";
    struk += "```";

    await clientBot.sendMessage(
      m.chat,
      { text: struk },
      { quoted: m }
    );

    if (typeof m.react === 'function') await m.react('✅');

  } catch (error) {
    console.error('Struk Error:', error);
    if (typeof m.react === 'function') await m.react('❌');
    await m.reply('❌ *GAGAL*\n\n> ' + (error.message || String(error)));
  }
}

export { pluginConfig as config, handler };
