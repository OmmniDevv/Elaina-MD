/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getAssetBuffer } from "../../src/lib/elaina-asset-manager.js";
import fs from "fs";
import config from "../../config.js";
import { getDatabase } from "../../src/lib/elaina-database.js";
const pluginConfig = {
  name: "setmenu",
  alias: ["menuvariant", "menustyle"],
  category: "owner",
  description: "Mengatur variant tampilan menu",
  usage: ".setmenu <v1-v9>",
  example: ".setmenu v8",
  isOwner: true,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 0,
  isEnabled: true,
};

const VARIANTS = {
  v1: {
    id: 1,
    name: "BASIC",
    desc: "",
    emoji: "🖼️",
  },
  v2: {
    id: 2,
    name: "PREMIUM",
    desc: "",
    emoji: "✅",
  },
  v3: {
    id: 3,
    name: "PREMIUM",
    desc: "",
    emoji: "✅",
  },
  v4: {
    id: 4,
    name: "LV",
    desc: "",
    emoji: "✅",
  },
  v5: {
    id: 5,
    name: "LV 2",
    desc: "",
    emoji: "✅",
  },
  v6: {
    id: 6,
    name: "LOCATION",
    desc: "Location Message dengan Buttons",
    emoji: "📍",
  },
  v7: {
    id: 7,
    name: "RA NGERTI",
    desc: "Location Message dengan Buttons",
    emoji: "📍",
  },
  v8: {
    id: 8,
    name: "THUMBNAIL",
    desc: "Thumbnail Image",
    emoji: "📍",
  },
  v9: {
    id: 9,
    name: "V5 — LV2 (DEFAULT)",
    desc: "Tampilan default yang sekarang digunakan Rimuru MD",
    emoji: "🌸",
  },
};

async function handler(m, { sock, db }) {
  const args = m.args || [];
  const variant = args[0]?.toLowerCase();
  if (variant) {
    const selected = VARIANTS[variant];
    if (!selected) {
      await m.reply(`❌ *VARIANT TIDAK VALID*\n\nGunakan: *v1* s/d *v9*`);
      return;
    }
    db.setting("menuVariant", selected.id);
    await db.save();
    await m.reply(
      `✅ *MENU VARIANT DIUBAH*\n\n` +
      `${selected.emoji} *V${selected.id} — ${selected.name}*\n` +
      `_${selected.desc}_`,
    );
    return;
  }

  const current = db.setting("menuVariant") || config.ui?.menuVariant || 9;

  const rows = [];
  for (const [key, val] of Object.entries(VARIANTS)) {
    const mark = val.id === current ? " ✓" : "";
    rows.push({
      title: `${val.emoji} ${key.toUpperCase()}${mark} — ${val.name}`,
      description: val.desc,
      id: `${m.prefix}setmenu ${key}`,
    });
  }
  const buttons = [
    {
      name: "single_select",
      buttonParamsJson: JSON.stringify({
        title: "🎨 Pilih Variant Menu",
        sections: [{ title: "Daftar Variant Menu", rows }],
      }),
    },
  ];

  const bodyText =
    `🎨🖼️ *MENU VARIANT*\n\n` +
    `Atur tampilan menu utama bot ketika user mengetik perintah menu 📋✨\n` +
    `Variant aktif saat ini: *V${current} — ${VARIANTS[`v${current}`]?.name || "Unknown"}* 🎯\n\n` +
    `> Pilih variant menu dari tombol di bawah 👇`;

  await sock.sendButton(
    m.chat,
    getAssetBuffer("rimuru"),
    bodyText,
    m,
    { buttons },
  );
}

export { pluginConfig as config, handler };
