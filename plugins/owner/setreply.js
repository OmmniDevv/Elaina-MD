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
  name: "setreply",
  alias: ["replyvariant", "replystyle"],
  category: "owner",
  description: "Mengatur variant tampilan reply",
  usage: ".setreply <v1-v11>",
  example: ".setreply v5",
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
    emoji: "✨",
  },
  v2: {
    id: 2,
    name: "PREMIUM",
    desc: "",
    emoji: "🖼️",
  },
  v3: {
    id: 3,
    name: "TITANIUM",
    desc: "",
    emoji: "📨",
  },
  v4: {
    id: 4,
    name: "LV",
    desc: "",
    emoji: "💼",
  },
  v5: {
    id: 5,
    name: "FAKE ORDER",
    desc: "Teks dengan fake quoted order message",
    emoji: "🛒",
  },
  v6: {
    id: 6,
    name: "SIMPLE DOCUMENT",
    desc: "Seperti V2 tapi tanpa fake contact quote (quoted ori)",
    emoji: "📄",
  },
  v7: {
    id: 7,
    name: "FAKE LOCATION",
    desc: "Teks dengan fake quoted location message",
    emoji: "📍",
  },
  v8: {
    id: 8,
    name: "FAKE SIGNUP",
    desc: "Teks dengan fake quoted signup message",
    emoji: "🥠",
  },
  v9: {
    id: 9,
    name: "FAKE ORDER",
    desc: "Teks dengan fake quoted order message ( gak direkomendasikan )",
    emoji: "🍙",
  },
  v10: {
    id: 10,
    name: "TAGIHAN / PAYMENT",
    desc: "Tampilan struk tagihan (Payment Request)",
    emoji: "💳",
  },
  v11: {
    id: 11,
    name: "PREVIEW",
    desc: "Link preview",
    emoji: "🌀",
  },
};

async function handler(m, { sock, db }) {
  const variant = m.text

  if (variant) {
    const selected = VARIANTS[variant];
    if (!selected) {
      await m.reply(`❌ *VARIANT TIDAK VALID*\n\nGunakan: *v1* s/d *v11*`);
      return;
    }

    db.setting("replyVariant", selected.id);
    await db.save();
    await m.reply(
      `✅ *REPLY VARIANT DIUBAH*\n\n` +
      `${selected.emoji} *V${selected.id} — ${selected.name}*\n` +
      `_${selected.desc}_`,
    );
    return;
  }

  const current = db.setting("replyVariant") || config.ui?.replyVariant || 1;

  const rows = [];
  for (const [key, val] of Object.entries(VARIANTS)) {
    const mark = val.id === current ? " ✓" : "";
    rows.push({
      title: `${val.emoji} ${key.toUpperCase()}${mark} — ${val.name}`,
      description: val.desc,
      id: `${m.prefix}setreply ${key}`,
    });
  }
  const buttons = [
    {
      name: "single_select",
      buttonParamsJson: JSON.stringify({
        title: "💬 Pilih Variant Reply",
        sections: [{ title: "Daftar Variant Reply", rows }],
      }),
    },
  ];

  const bodys =
    `💬📨 *REPLY VARIANT*\n\n` +
    `Atur tampilan balasan bot ketika membalas pesan user 💬✨\n` +
    `Variant aktif saat ini: *V${current} — ${VARIANTS[`v${current}`]?.name || "Unknown"}* 🎯\n\n`

  await sock.sendButton(
    m.chat,
    getAssetBuffer("rimuru"),
    bodys,
    m,
    { buttons },
  );
}

export { pluginConfig as config, handler };
