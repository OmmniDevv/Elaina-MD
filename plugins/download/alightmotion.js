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
    name: "alightmotiondl",
    alias: ["alightmotion", "amdl"],
    category: "downloader",
    description: "Download project/preset Alight Motion",
    usage: ".amdl <link>",
    example: ".amdl https://alight.link/...",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 2,
    isEnabled: true,
};

async function handler(m, { sock, text }) {
    if (!text) {
        let help = `📥 *ALIGHT MOTION DOWNLOADER*\n\n`
        help += `Fitur ini membantumu mengunduh project atau preset dari Alight Motion dengan mudah!\n\n`
        help += `*Cara Penggunaan:*\n`
        help += `- Ketik *${m.prefix}amdl <link_alight_motion>*\n\n`
        help += `*Contoh:* ${m.prefix}amdl https://alight.link/xxxxx`
        return m.reply(help);
    }

    await m.react("🕕");

    try {
        const targetUrl = text.trim();

        const apiUrl = `https://kyzznekoo.zone.id/api/alightmotion/download?url=${encodeURIComponent(targetUrl)}`;

        const response = await axios.get(apiUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36",
                "Content-Type": "application/json"
            },
            data: {},
            timeout: 60000
        });

        const data = response.data;

        if (!data || !data.status || !data.data || !data.data.url) {
            await m.react("❌");
            return m.reply(`Maaf, link Alight Motion tersebut tidak valid atau project sudah dihapus.`);
        }

        const downloadUrl = data.data.url;

        await sock.sendMessage(m.chat, {
            document: { url: downloadUrl },
            mimetype: "application/zip",
            fileName: `AlightMotion_${config.bot.name}.zip`,
            caption: `✅ Berhasil mengunduh preset Alight Motion!`
        }, { quoted: m });

        await m.react("✅");

    } catch (error) {
        console.error("[AMDL Plugin Error]", error);
        await m.react("☢");
        m.reply(te(m.prefix, m.command, m.pushName));
    }
}

export { pluginConfig as config, handler };
