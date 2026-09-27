/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";
import te from "../../src/lib/elaina-error.js";

const pluginConfig = {
  name: "ffstalk",
  alias: ["freefireid", "stalkff", "ff"],
  category: "stalker",
  description: "Melihat informasi lengkap akun Free Fire berdasarkan ID.",
  usage: ".ffstalk <id>",
  example: ".ffstalk 470699855",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const uid = m.text?.trim() || m.args[0];

  if (!uid) {
    return m.reply("❌ *Waduh, ID Free Fire-nya belum dimasukkan!*\n\nKamu harus mengetikkan UID pemain Free Fire yang ingin di-stalk. \n\nContoh: `.ffstalk 470699855`");
  }

  await m.react("🕕");

  try {
    const res = await axios.get(`https://api.nexray.eu.cc/stalker/freefire?uid=${uid}`, {
      timeout: 30000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    });
    
    const data = res.data;

    if (!data.status || !data.result) {
      await m.react("❌");
      return m.reply(`⚠️ *Pencarian Gagal!*\n\nID *${uid}* tidak ditemukan atau API sedang bermasalah. Pastikan ID yang kamu masukkan sudah benar ya.`);
    }

    const r = data.result;
    
    let caption = `🔥 *FREE FIRE STALK - PROFILE INFO* 🔥\n\n`;
    caption += `Halo! Ini dia hasil pencarian profil untuk UID *${r.uid}*:\n\n`;
    
    caption += `👤 *INFO DASAR*\n`;
    caption += `  - Nama: *${r.name || "-"}*\n`;
    caption += `  - Level: ${r.level || "-"} (EXP: ${r.exp || "-"})\n`;
    caption += `  - Region: ${r.region || "-"}\n`;
    caption += `  - Likes: ${r.likes || "-"} ❤️\n`;
    caption += `  - Credit Score: ${r.credit_score || "-"}\n`;
    caption += `  - Bio: ${r.signature || "-"}\n\n`;
    
    caption += `🏆 *RANKING & AKTIVITAS*\n`;
    caption += `  - BR Rank Point: ${r.br_rank_point || "-"} (Max: ${r.br_max_rank || "-"})\n`;
    caption += `  - CS Rank Point: ${r.cs_rank_point || "-"} (Max: ${r.cs_max_rank || "-"})\n`;
    caption += `  - Season ID: ${r.season_id || "-"}\n`;
    caption += `  - Akun Dibuat: ${r.created_at || "-"}\n`;
    caption += `  - Terakhir Login: ${r.last_login || "-"}\n\n`;
    
    caption += `🛡️ *GUILD INFO*\n`;
    caption += `  - Nama Guild: ${r.guild_name && r.guild_name !== "None" ? r.guild_name : "Tidak ada guild"}\n`;
    if (r.guild_name && r.guild_name !== "None") {
      caption += `  - Level Guild: ${r.guild_level || "-"}\n`;
      caption += `  - Anggota: ${r.guild_member || "-"}/${r.guild_capacity || "-"}\n`;
      caption += `  - Ketua Guild: ${r.guild_leader_name || "-"} (UID: ${r.guild_leader_uid || "-"})\n`;
    }
    caption += `\n`;
    
    caption += `🐾 *PET INFO*\n`;
    caption += `  - Pet Level: ${r.pet_level || "-"}\n`;
    caption += `  - Pet EXP: ${r.pet_exp || "-"}\n\n`;
    
    caption += `🔧 *LAINNYA*\n`;
    caption += `  - Bahasa: ${r.language ? r.language.replace("Language_", "") : "-"}\n`;
    caption += `  - Mode Favorit: ${r.mode_prefer ? r.mode_prefer.replace("ModePrefer_", "") : "-"}\n\n`;

    caption += `Keren banget kan profilnya? Bagikan ke temanmu yuk! 🚀`;

    const isValidUrl = r.banner_image && (r.banner_image.startsWith("http://") || r.banner_image.startsWith("https://"));

    if (isValidUrl) {
      await sock.sendMessage(m.chat, {
        image: { url: r.banner_image },
        caption: caption
      }, { quoted: m });
    } else {
      await m.reply(caption);
    }

    await m.react("✅");

  } catch (error) {
    console.error("[FFStalk]", error.message);
    await m.react("☢");
    m.reply("😔 *Terjadi masalah di sistem kami.* \n\nSistem gagal menarik data dari server Free Fire. Silakan coba beberapa saat lagi ya.");
  }
}

export { pluginConfig as config, handler };
