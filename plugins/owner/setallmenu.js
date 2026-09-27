/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import { getAssetBuffer } from "../../src/lib/elaina-asset-manager.js";
import config from "../../config.js";
const pluginConfig = {
  name: "setallmenu",
  alias: ["allmenuvariant", "allmenustyle"],
  category: "owner",
  description: "Mengatur variant tampilan allmenu",
  usage: ".setallmenu <v1-v9>",
  example: ".setallmenu v2",
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
    name: "ALLMENU BASIC",
    desc: "ini mengikuti dari setreply",
    emoji: "📝",
  },
  v2: {
    id: 2,
    name: "ALLMENU PREMIUM",
    desc: "",
    emoji: "🖼️",
  },
  v5: {
    id: 5,
    name: "ALLMENU NATIVEFLOW",
    desc: "Tampilan native flow premium dengan video & cuaca",
    emoji: "✨",
  },
  v6: {
    id: 6,
    name: "ALLMENU LOCATION",
    desc: "Tampilan location message tanpa tombol interaktif",
    emoji: "📍",
  },
  v9: {
    id: 9,
    name: "ALLMENU DEFAULT • SC VARIANT",
    desc: "Tampilan default AllMenu yang diambil dari varian SC yang diberikan",
    emoji: "🌸",
  },
};

async function handler(m, { sock, db }) {
  const args = m.args || [];
  const variant = args[0]?.toLowerCase();

  if (variant) {
    const selected = VARIANTS[variant];
    if (!selected) {
      await m.reply(`❌ *VARIANT TIDAK VALID*\n\nGunakan: *v1*, *v2*, *v5*, *v6*, atau *v9*`);
      return;
    }

    db.setting("allmenuVariant", selected.id);
    await db.save();

    await m.reply(
      `✅ *ALLMENU VARIANT DIUBAH*\n\n` +
      `${selected.emoji} *V${selected.id} — ${selected.name}*\n` +
      `_${selected.desc}_`,
    );
    return;
  }

  const current =
    db.setting("allmenuVariant") || config.ui?.allmenuVariant || 9;

  const rows = [];
  for (const [key, val] of Object.entries(VARIANTS)) {
    const mark = val.id === current ? " ✓" : "";
    rows.push({
      title: `${val.emoji} ${key.toUpperCase()}${mark} — ${val.name}`,
      description: val.desc,
      id: `${m.prefix}setallmenu ${key}`,
    });
  }
  const buttons = [
    {
      name: "single_select",
      buttonParamsJson: JSON.stringify({
        title: "📋 Pilih Variant Allmenu",
        sections: [{ title: "Daftar Variant Allmenu", rows }],
      }),
    },
  ];

  const bodyText =
    `📋📑 *ALLMENU VARIANT*\n\n` +
    `Atur tampilan allmenu yang menampilkan seluruh daftar perintah bot dalam satu halaman 📖✨\n` +
    `Variant aktif saat ini: *V${current} — ${VARIANTS[`v${current}`]?.name || "Unknown"}* 🎯\n\n` +
    `*PENJELASAN VARIANT:*\n\n` +
    `- *V1 Simple Text* 📝 — Daftar perintah ditampilkan sebagai text biasa tanpa gambar atau contextInfo, paling ringan dan cepat dimuat\n\n` +
    `- *V2 Image + Context* 🖼️ — Gambar header allmenu + full contextInfo dengan label forwarded newsletter, tampilan standar yang informatif\n\n` +
    `- *V3 Document* 📄 — Allmenu dikirim sebagai file document dengan thumbnail kecil dan verified quoted reply, terlihat seperti file resmi\n\n` +
    `- *V4 Interactive Button* 🔘 — Pesan interaktif dengan tombol single_select untuk memilih kategori dan quick_reply untuk navigasi, tampilan modern\n\n` +
    `- *V5 NativeFlow* ✨ — NativeFlow message dengan limited_time_offer badge dan interactive buttons, tampilan paling premium dan eye-catching\n\n` +
    `> Pilih variant allmenu dari tombol di bawah 👇

🌸 *V9* adalah tampilan AllMenu default saat ini.`;

  await sock.sendButton(
    m.chat,
    getAssetBuffer("rimuru"),
    bodyText,
    m,
    { buttons },
  );
}

export { pluginConfig as config, handler };
