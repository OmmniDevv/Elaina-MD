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
import te from "../../src/lib/elaina-error.js";
import rimuruApi from "../../src/lib/elaina-apimanager.js";
const pluginConfig = {
  name: "brat",
  alias: ["bratmenu", "bratimg", "brattext"],
  category: "sticker",
  description: "Menu variant brat dan generator sticker brat",
  usage: ".brat | .bratimg <text>",
  example: ".bratimg Hai semua",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 1,
  isEnabled: true,
};

const BRAT_VARIANTS = [
  {
    title: "Brat Default",
    description: "Sticker brat versi biasa",
    command: "bratimg",
  },
  {
    title: "Brat Green",
    description: "Variant brat warna hijau",
    command: "bratgreen",
  },
  {
    title: "Brat Cewek",
    description: "Variant brat cewek",
    command: "bratcewek",
  },
  {
    title: "Brat Vermeil",
    description: "Variant brat Vermeil",
    command: "bratvermeil",
  },
  { title: "Brat HD", description: "Variant brat HD", command: "brathd" },
  {
    title: "Brat Video",
    description: "Sticker brat animated",
    command: "bratvid",
  },
  {
    title: "Brat Video V2",
    description: "Sticker brat video v2",
    command: "bratvid2",
  },
  {
    title: "Brat Vermeil Video",
    description: "Variant brat Vermeil video",
    command: "bratvermeilvid",
  },
  {
    title: "Brat Gojo",
    description: "Variant brat Gojo",
    command: "bratgojo",
  },
  {
    title: "Brat Gojo Video",
    description: "Variant brat Gojo video",
    command: "bratgojovid",
  },
];

function buildVariantRows(prefix, text) {
  return BRAT_VARIANTS.map((item) => ({
    title: item.title,
    description: `${item.description} • .${item.command} <text>`,
    id: `${prefix}${item.command} ${text}`,
  }));
}

async function sendBratMenu(m, sock, text) {
  const caption =
    "🌿 *kamu mau buat brat yak, silahkan pilih variant brat tombol dibawah*";
  const buttons = [
    {
      name: "single_select",
      buttonParamsJson: JSON.stringify({
        title: "🌾 Pilih Variant Brat",
        sections: [
          {
            title: "Variant Brat",
            rows: buildVariantRows(m.prefix, text),
          },
        ],
      }),
    },
  ];

  await sock.sendButton(
    m.chat,
    getAssetBuffer("rimuru"),
    caption,
    m,
    {
      buttons,
      footer: "Pilih variant brat favorit kamu",
    },
  );
}

async function handler(m, { sock }) {
  const text = m.text;
  const command = String(m.command || "").toLowerCase();

  if (command === "brat") {
    await sendBratMenu(m, sock, text);
    return;
  }

  if (!text) {
    return m.reply(
      `🖼️ *ʙʀᴀᴛ ɪᴍᴀɢᴇ*\n\n> Masukkan teks\n\n\`Contoh: ${m.prefix}bratimg Hai semua\``,
    );
  }

  m.react("🕕");

  try {
    await sock.sendImageAsSticker(m.chat, `https://api.nexray.eu.cc/maker/brat?text=${encodeURIComponent(text)}`, m, {
      packname: config.sticker.packname,
      author: config.sticker.author,
    });

    m.react("✅");
  } catch (error) {
    m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
