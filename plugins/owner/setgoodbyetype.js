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
  name: "setgoodbyetype",
  alias: ["goodbyetype", "goodbyevariant", "goodbyestyle"],
  category: "owner",
  description: "Mengatur variant tampilan goodbye message",
  usage: ".setgoodbyetype",
  example: ".setgoodbyetype",
  isOwner: true,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 0,
  isEnabled: true,
};
const VARIANTS = {
  1: {
    name: "Canvas Image",
    desc: "Gambar canvas dengan foto profil",
    emoji: "🎨",
  },
  2: {
    name: "Carousel Cards",
    desc: "Kartu carousel interaktif dengan tombol",
    emoji: "🃏",
  },
  3: {
    name: "Text Only",
    desc: "Pesan teks minimalis tanpa gambar",
    emoji: "📝",
  },
  4: { name: "Group", desc: "ContextInfo group style", emoji: "👥" },
  5: { name: "Simple", desc: "Pesan teks simple + foto profile", emoji: "✨" },
  6: { name: "Video", desc: "Kirim video ucapan selamat tinggal", emoji: "🎥" },
  7: { name: "Interactive Quoted", desc: "Interactive message dengan fake quoted", emoji: "💬" },
  8: { name: "Super Simple", desc: "Pesan teks sangat singkat tanpa hiasan", emoji: "👋" },
};
async function handler(m, { sock, db }) {
  const args = m.args || [];
  const variant = args[0]?.toLowerCase();
  const current = db.setting("goodbyeType") || 1;
  if (variant && /^v?[1-8]$/.test(variant)) {
    const id = parseInt(variant.replace("v", ""));
    db.setting("goodbyeType", id);
    await db.save();
    await m.reply(
      `✅ *GOODBYE TYPE DIUBAH*\n\n` +
        `${VARIANTS[id].emoji} *V${id} — ${VARIANTS[id].name}*\n` +
        `_${VARIANTS[id].desc}_`,
    );
    return;
  }
  const rows = [];
  for (const [id, val] of Object.entries(VARIANTS)) {
    const mark = parseInt(id) === current ? " ✓" : "";
    rows.push({
      title: `${val.emoji} V${id}${mark} — ${val.name}`,
      description: val.desc,
      id: `${m.prefix}setgoodbyetype v${id}`,
    });
  }
  const buttons = [
    {
      name: "single_select",
      buttonParamsJson: JSON.stringify({
        title: "👋 Pilih Tipe Goodbye",
        sections: [{ title: "Daftar Tipe Goodbye", rows }],
      }),
    },
  ];
  const bodyText =
    `👋🚪 *GOODBYE TYPE*\n\n` +
    `Atur tampilan pesan goodbye saat member keluar dari grup 🚶💨\n` +
    `Tipe aktif saat ini: *V${current} — ${VARIANTS[current].name}* 🎯\n\n` +
    `*PENJELASAN TIPE:*\n\n` +
    `- *V1 Canvas Image* 🎨 — Bot membuat gambar canvas otomatis berisi foto profil dan nama member yang keluar, lalu dikirim sebagai gambar\n\n` +
    `- *V2 Carousel Cards* 🃏 — Menampilkan kartu carousel interaktif yang bisa di-swipe lengkap dengan tombol action, cocok untuk tampilan modern\n\n` +
    `- *V3 Text Only* 📝 — Pesan teks biasa tanpa gambar sama sekali, ringan dan minimalis\n\n` +
    `- *V4 Group* 👥 — Menggunakan contextInfo bergaya group forward, tampilan rapi dengan label newsletter\n\n` +
    `- *V5 Simple* ✨ — Pesan teks sederhana disertai foto profile member yang keluar, tidak terlalu mencolok namun informatif\n\n` +
    `- *V6 Video* 🎥 — Mengirimkan video perpisahan yang estetik dilengkapi caption otomatis untuk member\n\n` +
    `- *V7 Interactive Quoted* 💬 — Mengirimkan pesan interaktif dan fake quoted dari orang yang keluar\n\n` +
    `- *V8 Super Simple* 👋 — Pesan teks sangat singkat tanpa hiasan (Contoh: Goodbye @user, dari grup...)\n\n` +
    `> Pilih tipe goodbye dari tombol di bawah 👇`;
  await sock.sendButton(
    m.chat,
    getAssetBuffer("rimuru"),
    bodyText,
    m,
    { buttons },
  );
}
export { pluginConfig as config, handler };
