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
    name: "fakeovo",
    alias: ["fake-ovo", "fakeovo"],
    category: "canvas",
    description: "Membuat canvas fake ovo",
    usage: ".fake-ovo <nama>",
    example: ".fake-ovo Jokowi",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 2,
    isEnabled: true,
};

async function handler(m, { sock, text }) {
    if (!text) return m.reply(`Format salah!\n\n> Contoh: .fake-ovo Budi`);
    
    await m.react("🕕");
    try {
        const url = `https://kyzznekoo.zone.id/api/canvas/fake-ovo?q=${encodeURIComponent(text)}`;
        const res = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36",
                "Content-Type": "application/json"
            }
        });
        await sock.sendMessage(m.chat, { image: Buffer.from(res.data), caption: "✅ Berhasil membuat fake ovo" }, { quoted: m });
        await m.react("✅");
    } catch (e) {
        console.error("[FakeOvo Error]", e);
        await m.react("❌");
        m.reply(te(m.prefix, m.command, m.pushName));
    }
}

export { pluginConfig as config, handler };
