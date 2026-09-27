/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import axios from "axios";

const pluginConfig = {
  name: "hotline",
  alias: [],
  category: "maker",
  description: "Imported from Rimuru MD V4.6",
  usage: "",
  example: "",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 1,
  isEnabled: true,
};

const handler = async (m, { conn, usedPrefix, command }) => {
    await m.react("🕐");

    const raw = (m.text || '').slice((usedPrefix + command).length).trim();

    if (!raw)
        return m.reply(
            `Format:\n${usedPrefix + command} teks atas|teks bawah\n\nContoh:\n${usedPrefix + command} p|salam`
        );

    if (!raw.includes("|"))
        return m.reply(
            `Gunakan pemisah |\n\nContoh:\n${usedPrefix + command} hello|world`
        );

    const [text1Raw, text2Raw] = raw.split("|");

    const imgUrl =
        `https://api.cuki.biz.id/api/canvas/meme/hotline` +
        `?apikey=cuki-x&text1=${encodeURIComponent(text1Raw.trim())}` +
        `&text2=${encodeURIComponent(text2Raw.trim())}`;

    try {
        const res = await axios.get(imgUrl, { responseType: "arraybuffer" });

        await conn.sendFile(
            m.chat,
            res.data,
            "hotline.png",
            "🖼️ Hotline Meme",
            m
        );

        await m.react("✅");
    } catch (e) {
        console.error("❌ hotline error:", e);
        await m.react("❌");
        m.reply(`*ERROR:* ${e.message}`);
    }
};

export { pluginConfig as config, handler };
