/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getAssetBuffer } from "../../src/lib/elaina-asset-manager.js";
import config from "../../config.js"

const pluginConfig = {
    name: "sc",
    alias: ["script"],
    category: "main",
    description: "Link script bot wa terbaru",
    usage: ".sc",
    example: ".sc",
    isPremium: false,
    isOwner: false,
    isBanned: false,
    isAdmin: false,
    cooldown: 10,
    energi: 0,
    isBotAdmin: false,
    isEnabled: true
}

async function handler(m, { sock }) {
    return await sock.sendMessage(m.chat, {
        image: getAssetBuffer("rimuru"),
        caption: `🌾 Halo kak *${m.pushName}*
        
Untuk asli dari bot ini, kamu bisa dapatkan melalui link, nanti kamu tinggal cari kata kunci *Rimuru MD*`,
        footer: "💬 Link ini nanti akan mengarahkan kamu ke Youtube *FebxyZ YT*",
        interactiveButtons: [
            {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                    display_text: "🥐 Kunjungi Youtube FebxyZ YT",
                    url: "https://youtube.com/@brianzrimex",
                    merchant_url: "https://youtube.com/@brianzrimex"
                })
            }
        ]

    }, { quoted: m })
}

export { pluginConfig as config, handler }