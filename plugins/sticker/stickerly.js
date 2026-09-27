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
import { getDatabase } from "../../src/lib/elaina-database.js";

const pluginConfig = {
    name: "stickerly",
    alias: ["stikerly", "stickerlysearch"],
    category: "sticker",
    description: "Cari dan download sticker pack dari Sticker.ly",
    usage: ".stickerly <query / url>",
    example: ".stickerly anime",
    cooldown: 10,
    energi: 2,
};

async function handler(m, { sock, text }) {
    if (!text) {
        return m.reply(`⚠️ Harap masukkan kata kunci pencarian atau URL Sticker.ly!\nContoh: \`${m.prefix}${m.command} anime\``);
    }

    await m.react("🕕");

    try {
        if (text.includes("sticker.ly/s/")) {
            return await downloadStickerlyPack(sock, m, text);
        }

        const searchUrl = `https://my.izuka-api.xyz/api/search/stickerly-search?query=${encodeURIComponent(text.trim())}`;
        const response = await axios.get(searchUrl, { timeout: 30000 });
        const data = response.data;

        if (!data || !data.status || !data.result || data.result.length === 0) {
            await m.react("❌");
            return m.reply(`Maaf, sticker pack untuk "${text}" tidak ditemukan. Coba kata kunci lain.`);
        }

        const maxResults = Math.min(data.result.length, 10);
        let listTxt = `🎨 *HASIL PENCARIAN STICKER.LY: ${text.toUpperCase()}*\n\n`;
        listTxt += `Ditemukan beberapa pack, pilih salah satu ya:\n\n`;

        const searchResults = [];

        for (let i = 0; i < maxResults; i++) {
            const item = data.result[i];
            searchResults.push({
                name: item.name,
                url: item.shareUrl,
                author: item.authorName
            });
            listTxt += `*${i + 1}.* ${item.name} by ${item.authorName}\n`;
        }

        listTxt += `\n> 💡 *Kirim angka (contoh: 1)* untuk mendownload pack, atau ketik \`batal\` untuk membatalkan pencarian.`;
        
        const db = getDatabase();
        const user = db.getUser(m.sender);

        user.stickerly_session = {
            results: searchResults,
            time: Date.now()
        };
        db.save();

        await m.react("✅");
        await m.reply(listTxt);
    } catch (error) {
        console.error("[Stickerly Search Error]", error);
        await m.react("☢");
        m.reply(te(m.prefix, m.command, m.pushName));
    }
}

async function stickerlyAnswerHandler(m, sock) {
    if (!m.body || m.isCommand) return false;
    
    const db = getDatabase();
    const user = db.getUser(m.sender);
    
    if (!user || !user.stickerly_session) return false;

    const session = user.stickerly_session;
    const SESSION_TIMEOUT = 5 * 60 * 1000;

    if (Date.now() - session.time > SESSION_TIMEOUT) {
        delete user.stickerly_session;
        db.save();
        await m.reply(`⏰ *SESI KEDALUWARSA*\n\nSesi pencarian stickerly sudah berakhir karena lebih dari 5 menit. Silakan ulangi perintah.`);
        return true;
    }

    const text = m.body.trim().toLowerCase();

    if (text === "batal" || text === "cancel") {
        delete user.stickerly_session;
        db.save();
        await m.reply(`🚪 Pencarian stickerly dibatalkan.`);
        return true;
    }

    const choice = parseInt(text);
    if (isNaN(choice) || choice < 1 || choice > session.results.length) {
        return false;
    }

    const selectedPack = session.results[choice - 1];
    delete user.stickerly_session;
    db.save();

    await downloadStickerlyPack(sock, m, selectedPack.url);
    return true;
}

async function downloadStickerlyPack(sock, m, packUrl) {
    await m.react("🕕");
    await m.reply(`> Sedang mendownload sticker pack... ⏳`);

    try {
        const url = `https://my.izuka-api.xyz/api/search/stickerly-pack?url=${encodeURIComponent(packUrl)}`;
        const response = await axios.get(url, { timeout: 30000 });
        const data = response.data;

        if (!data || !data.status || !data.result || !data.result.stickers || data.result.stickers.length === 0) {
            await m.react("❌");
            return m.reply(`❌ Gagal mengambil detail pack.`);
        }

        const stickersData = data.result.stickers;
        const packInfo = stickersData[0].stickerPack;
        const prefix = packInfo.trayResourceUrl.split('/').slice(0, -1).join('/') + '/';

        const stickerUrls = [];
        for (const sticker of stickersData) {
            stickerUrls.push(prefix + sticker.fileName);
        }

        if (stickerUrls.length === 0) {
            await m.react("❌");
            return m.reply(`❌ Tidak ada sticker dalam pack ini.`);
        }

        const packname = packInfo.name || "Sticker.ly Pack";
        const author = packInfo.authorName || config.sticker.author || "Bot";
        const urlsToProcess = stickerUrls.slice(0, 20);
        
        try {
            await sock.sendStickerPack(m.chat, urlsToProcess, m, {
                name: packname,
                packname: packname,
                publisher: author,
                author: author,
                description: `Sticker pack dari Sticker.ly`,
                emojis: ["✨"]
            });
            await m.react("✅");
        } catch (packErr) {
            console.error("[Stickerly Pack Send Error]", packErr.message);
            await m.reply(`❌ Gagal mengirim pack sekaligus, mencoba mengirim satu per satu...`);
            
            let sent = 0;
            for (const sUrl of urlsToProcess) {
                try {
                    await sock.sendImageAsSticker(m.chat, sUrl, m, {
                        packname: packname,
                        author: author
                    });
                    sent++;
                    await new Promise(r => setTimeout(r, 700));
                } catch {
                    continue;
                }
            }
            if (sent > 0) {
                await m.react("✅");
                await m.reply(`✅ Berhasil mengirim ${sent} sticker.`);
            } else {
                await m.react("❌");
                await m.reply(`❌ Gagal mengirim seluruh sticker.`);
            }
        }
    } catch (error) {
        console.error("[Stickerly Pack Fetch Error]", error);
        await m.react("☢");
        m.reply(te(m.prefix, "stickerly", m.pushName));
    }
}

export { pluginConfig as config, handler, stickerlyAnswerHandler };
