/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";

const pluginConfig = {
    name: "notiflimit",
    alias: ["notifenergi"],
    category: "owner",
    description: "Mengaktifkan atau mematikan notifikasi potong limit secara global.",
    usage: ".notiflimit",
    example: ".notiflimit",
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 0,
    energi: 0,
    isEnabled: true,
};

async function handler(m, { sock }) {
    const db = getDatabase();

    const currentStatus = db.setting("notiflimit") ?? false;
    db.setting("notiflimit", !currentStatus);

    const newStatus = db.setting("notiflimit") ? "AKTIF ✅" : "MATI ❌";

    await m.reply(`*NOTIFIKASI LIMIT (GLOBAL)*\n\nStatus saat ini: *${newStatus}*\n\n> Ketika aktif, bot akan selalu memberitahu sisa limit SEMUA PENGGUNA setiap kali ada pemotongan saat menggunakan fitur bot.`);
}

export { pluginConfig as config, handler };
