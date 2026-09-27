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

const NEOXR_APIKEY = config.APIkey?.neoxr || "Milik-Bot-RimuruMD";

const pluginConfig = {
    name: "countrystalk",
    alias: ["stalknegara", "infonegara"],
    category: "stalker  ",
    description: "Mencari informasi detail tentang suatu negara",
    usage: ".country <nama negara>",
    example: ".country indonesia",
    cooldown: 5,
    energi: 1,
    isEnabled: true,
};

async function handler(m, { sock, text }) {
    if (!text) {
        return m.reply(`🌍 Harap masukkan nama negara!\nContoh: \`${m.prefix}${m.command} indonesia\``);
    }

    await m.react("🕕");

    try {
        const query = encodeURIComponent(text.trim());
        const url = `https://api.neoxr.eu/api/country?q=${query}&apikey=${NEOXR_APIKEY}`;
        const response = await axios.get(url, { timeout: 30000 });
        const data = response.data;

        if (!data || !data.status || !data.data) {
            await m.react("❌");
            return m.reply(`Maaf, data negara untuk "${text}" tidak ditemukan.`);
        }

        const c = data.data;
        const name = c.names?.common || text;
        const officialName = c.names?.official || "-";

        const population = c.population ? c.population.toLocaleString('id-ID') : "-";
        const capitals = c.capitals && c.capitals.length > 0 ? c.capitals.map(cap => cap.name).join(", ") : "-";
        const currencies = c.currencies && c.currencies.length > 0 ? c.currencies.map(cur => `${cur.name} (${cur.symbol})`).join(", ") : "-";
        const languages = c.languages && c.languages.length > 0 ? c.languages.map(l => l.name).join(", ") : "-";
        const timezones = c.timezones && c.timezones.length > 0 ? c.timezones.join(", ") : "-";

        let txt = `🌍 *INFORMASI NEGARA: ${name.toUpperCase()}* 🌍\n\n`;
        txt += `🏢 *Ibukota:* ${capitals}\n`;
        txt += `📜 *Nama Resmi:* ${officialName}\n`;
        txt += `🗺️ *Wilayah:* ${c.region || "-"} (${c.subregion || "-"})\n`;
        txt += `🗣️ *Bahasa Resmi:* ${languages}\n`;
        txt += `👥 *Populasi:* ${population} jiwa\n`;
        txt += `💰 *Mata Uang:* ${currencies}\n`;
        txt += `🕰️ *Zona Waktu:* ${timezones}\n`;
        txt += `🚗 *Posisi Mengemudi:* ${c.cars?.driving_side || "-"}\n`;

        if (c.flag?.emoji) {
            txt += `\n*Bendera:* ${c.flag.emoji}`;
        }

        await m.react("✅");

        if (c.flag?.url_png) {
            await sock.sendMessage(m.chat, {
                image: { url: c.flag.url_png },
                caption: txt
            }, { quoted: m });
        } else {
            await m.reply(txt);
        }

    } catch (error) {
        console.error("[Country Plugin Error]", error);
        await m.react("☢");
        m.reply(te(m.prefix, m.command, m.pushName));
    }
}

export { pluginConfig as config, handler };
