/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import te from "../../src/lib/elaina-error.js";
import gsmarena from "gsmarena-api";

const pluginConfig = {
  name: "gsmarena",
  alias: ["gsm", "phonespec", "spesifikasi"],
  category: "search",
  description: "Cari spesifikasi HP di GSMArena",
  usage: ".gsmarena <nama hp>",
  example: ".gsmarena infinix hot 50",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 1,
  isEnabled: true,
};

async function handler(m) {
  const text = m.args.join(" ");
  if (!text) {
    return m.reply(
      `📱 *ɢsᴍᴀʀᴇɴᴀ*\n\n` +
        `> Cari spesifikasi HP lengkap\n\n` +
        `\`Contoh: ${m.prefix}gsmarena samsung galaxy s25\``,
    );
  }

  m.react("🕕");

  try {
    const results = await gsmarena.search.search(text);

    if (!results || results.length === 0) {
      m.react("❌");
      return m.reply(`📱 HP tidak ditemukan untuk *${text}*`);
    }

    if (results.length === 1) {
      const device = await gsmarena.catalog.getDevice(results[0].id);
      m.react("✅");
      return m.reply(formatDetail(device));
    }

    m.react("✅");
    return m.reply(formatList(results, text, m.prefix));
  } catch (error) {
    console.log(error);
    m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

function formatList(results, query, prefix) {
  let txt = `📱 *ʜᴀsɪʟ ᴘᴇɴᴄᴀʀɪᴀɴ*\n`;
  txt += `> *${query}*\n\n`;

  results.slice(0, 10).forEach((d, i) => {
    txt += `${i + 1}. 📱 *${d.name}*\n`;
    if (d.description) {
      const desc =
        d.description.length > 80
          ? d.description.slice(0, 80) + "..."
          : d.description;
      txt += `> ${desc}\n`;
    }
  });

  txt += `\n> Ketik \`${prefix}gsmarena <nama lengkap>\` untuk detail`;
  return txt;
}

function formatDetail(device) {
  let txt = `📱 *${device.name}*\n\n`;

  if (device.quickSpec && device.quickSpec.length > 0) {
    txt += `📋 *ʀɪɴɢᴋᴀsᴀɴ:*\n`;
    for (const s of device.quickSpec) {
      txt += `> 🔹 *${s.name}:* ${s.value}\n`;
    }
    txt += "\n";
  }

  if (device.detailSpec && device.detailSpec.length > 0) {
    for (const cat of device.detailSpec.slice(0, 8)) {
      txt += `📌 *${cat.category}:*\n`;
      for (const s of cat.specifications.slice(0, 5)) {
        txt += `> • *${s.name}:* ${s.value}\n`;
      }
      txt += "\n";
    }
  }
  return txt;
}

export { pluginConfig as config, handler };
