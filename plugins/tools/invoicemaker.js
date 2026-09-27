/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";
import config from "../../config.js";
import te from "../../src/lib/elaina-error.js";
const pluginConfig = {
  name: "invoicemaker",
  alias: ["invoice", "faktur", "nota"],
  category: "tools",
  description: "Membuat invoice/nota penjualan",
  usage: ".invoicemaker <toko>|<invoice>|<tanggal>|<status>|<items>|<total>",
  example:
    ".invoicemaker TokoKu|INV001|15/01/2026|paid|Nasi Goreng:1x:15000,Es Teh:2x:6000|21000",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 15,
  energi: 2,
  isEnabled: true,
};

const NEOXR_APIKEY = config.APIkey?.neoxr || "Milik-Bot-RimuruMD";

async function handler(m, { sock }) {
  const args = m.args || [];
  const text = args.join(" ");

  if (!text || !text.includes("|")) {
    return m.reply(
      `🧾 *ɪɴᴠᴏɪᴄᴇ ᴍᴀᴋᴇʀ*\n\n` +
        `╭┈┈⬡「 📋 *ꜰᴏʀᴍᴀᴛ* 」\n` +
        `┃ \`${m.prefix}invoicemaker <toko>|<invoice>|<tanggal>|<status>|<items>|<total>\`\n` +
        `╰┈┈⬡\n\n` +
        `╭┈┈⬡「 📝 *ᴘᴀʀᴀᴍᴇᴛᴇʀ* 」\n` +
        `┃ • toko: Nama toko\n` +
        `┃ • invoice: Nomor invoice\n` +
        `┃ • tanggal: Format DD/MM/YYYY\n` +
        `┃ • status: paid/unpaid\n` +
        `┃ • items: Nama:unit:harga (pisah koma)\n` +
        `┃ • total: Total harga\n` +
        `╰┈┈⬡\n\n` +
        `> Contoh:\n` +
        `\`${m.prefix}invoicemaker TokoKu|INV001|15/01/2026|paid|Nasi Goreng:1x:15000,Es Teh:2x:6000|21000\``,
    );
  }

  const parts = text.split("|").map((p) => p.trim());

  if (parts.length < 6) {
    return m.reply(
      `❌ Format tidak lengkap! Butuh 6 parameter (toko|invoice|tanggal|status|items|total)`,
    );
  }

  const [store, invoice, date, status, itemsRaw, totalRaw] = parts;

  if (!["paid", "unpaid"].includes(status.toLowerCase())) {
    return m.reply(`❌ Status harus 'paid' atau 'unpaid'!`);
  }

  const itemsArr = itemsRaw.split(",").map((item) => {
    const [name, unit, price] = item.split(":").map((i) => i.trim());
    return {
      name: name || "Item",
      unit: unit || "1x",
      price: parseInt(price) || 0,
    };
  });

  if (itemsArr.length === 0 || itemsArr.some((i) => !i.name)) {
    return m.reply(
      `❌ Format items salah! Gunakan: Nama:unit:harga (pisah koma untuk multiple)`,
    );
  }

  const total =
    parseInt(totalRaw) || itemsArr.reduce((sum, i) => sum + i.price, 0);

  m.react("🧾");

  try {
    const qrImage = "https://i.ibb.co.com/kt5fyrg/qr.jpg";

    const url =
      `https://api.neoxr.eu/api/invoice-maker?` +
      `store=${encodeURIComponent(store)}` +
      `&invoice=${encodeURIComponent(invoice)}` +
      `&date=${encodeURIComponent(date)}` +
      `&status=${status.toLowerCase()}` +
      `&image=${encodeURIComponent(qrImage)}` +
      `&items=${encodeURIComponent(JSON.stringify(itemsArr))}` +
      `&total=${total}` +
      `&apikey=${NEOXR_APIKEY}`;

    const response = await axios.get(url, { timeout: 60000 });

    if (!response.data?.status || !response.data?.data?.image?.url) {
      throw new Error("API tidak mengembalikan data yang valid");
    }

    const imageUrl = response.data.data.image.url;
    const data = response.data.data;

    const saluranId = config.saluran?.id || "120363412350560864@newsletter";
    const saluranName = config.saluran?.name || config.bot?.name || "Rimuru-AI";

    let caption = `🧾 *ɪɴᴠᴏɪᴄᴇ ɢᴇɴᴇʀᴀᴛᴇᴅ*\n\n`;
    caption += `╭┈┈⬡「 📋 *ᴅᴇᴛᴀɪʟ* 」\n`;
    caption += `┃ 🏪 Toko: *${data.store}*\n`;
    caption += `┃ 🔢 Invoice: *${data.invoice}*\n`;
    caption += `┃ 📅 Tanggal: *${data.date}*\n`;
    caption += `┃ 📌 Status: *${data.status === "paid" ? "✅ LUNAS" : "❌ BELUM LUNAS"}*\n`;
    caption += `╰┈┈⬡\n\n`;

    caption += `╭┈┈⬡「 🛒 *ɪᴛᴇᴍs* 」\n`;
    data.items.forEach((item, i) => {
      caption += `┃ ${i + 1}. ${item.name} (${item.unit}) - Rp${item.price.toLocaleString("id-ID")}\n`;
    });
    caption += `╰┈┈⬡\n\n`;

    caption += `> 💰 Total: *Rp${data.total.toLocaleString("id-ID")}*`;

    await sock.sendMessage(
      m.chat,
      {
        image: { url: imageUrl },
        caption,
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

    m.react("✅");
  } catch (err) {
    m.react("☢");
    return m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
