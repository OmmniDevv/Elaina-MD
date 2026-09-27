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

const NEOXR_APIKEY = config.APIkey?.neoxr || "Milik-Bot-RimuruMD";

const pluginConfig = {
    name: "character-ai",
    alias: ["cai", "charai"],
    category: "ai",
    description: "Cari karakter AI dan jadikan sebagai Auto AI di chat ini",
    usage: ".character-ai search <nama> | .character-ai off | .character-ai reset",
    example: ".character-ai search yuji",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true,
};

async function handler(m, { sock, args, text }) {
    if (!args || args.length === 0) {
        return m.reply(`🤖 *CHARACTER AI*\n\n` +
            `Gunakan perintah berikut:\n` +
            `> *.character-ai search <nama>* (Cari karakter)\n` +
            `> *.character-ai off* (Matikan Auto AI)\n` +
            `> *.character-ai reset* (Hapus memori obrolan)\n\n` +
            `*Contoh:* .character-ai search gojo`);
    }

    const cmd = args[0].toLowerCase();

    if (cmd === "search") {
        const query = args.slice(1).join(" ");
        if (!query) return m.reply(`Ketik nama karakter yang mau dicari!\nContoh: .character-ai search yuji`);

        await m.react("🕕");
        try {
            const searchUrl = `https://api.neoxr.eu/api/cai-search?q=${encodeURIComponent(query)}&apikey=${NEOXR_APIKEY}`;
            const response = await axios.get(searchUrl, { timeout: 30000 });
            const resData = response.data;

            if (!resData || !resData.status || !resData.data || resData.data.length === 0) {
                await m.react("❌");
                return m.reply(`Karakter "${query}" tidak ditemukan.`);
            }

            const maxResults = Math.min(resData.data.length, 10);
            let listTxt = `🤖 *HASIL PENCARIAN KARAKTER: ${query.toUpperCase()}*\n\n`;
            listTxt += `Pilih salah satu karakter di bawah ini:\n\n`;

            const searchResults = [];

            for (let i = 0; i < maxResults; i++) {
                const item = resData.data[i].document;
                searchResults.push({
                    character_id: item.character_id,
                    name: item.name,
                    title: item.title,
                    creator: item.creator_username,
                    is_nsfw: item.is_nsfw
                });
                const nsfwTag = item.is_nsfw ? " 🔞" : "";
                listTxt += `*${i + 1}.* ${item.name}${nsfwTag}\n`;
                listTxt += `> ${item.title}\n`;
                listTxt += `> 👤 by ${item.creator_username}\n\n`;
            }

            listTxt += `> 💡 *Kirim angka (contoh: 1)* untuk memilih dan mengaktifkan AI, atau ketik \`batal\` untuk membatalkan.`;

            const db = getDatabase();
            const user = db.getUser(m.sender);
            
            user.cai_search_session = {
                results: searchResults,
                time: Date.now()
            };
            db.save();

            await m.react("✅");
            await m.reply(listTxt);

        } catch (error) {
            console.error("[CAI Search Error]", error);
            await m.react("☢");
            m.reply(te(m.prefix, m.command, m.pushName));
        }
    } else if (cmd === "off") {
        const db = getDatabase();
        if (!db.db.data.characterai) db.db.data.characterai = {};
        
        if (db.db.data.characterai[m.chat]?.enabled) {
            delete db.db.data.characterai[m.chat];
            db.save();
            m.reply(`✅ *Auto Character AI dinonaktifkan di chat ini.*`);
        } else {
            m.reply(`❌ Tidak ada Auto Character AI yang aktif di chat ini.`);
        }
    } else if (cmd === "reset") {
        const db = getDatabase();
        if (!db.db.data.characterai) db.db.data.characterai = {};
        
        const chatAi = db.db.data.characterai[m.chat];
        if (chatAi?.enabled) {
            chatAi.conversation_id = null;
            db.save();
            m.reply(`✅ *Memori obrolan berhasil direset.*\n\nKarakter "${chatAi.name}" sekarang tidak mengingat percakapan sebelumnya.`);
        } else {
            m.reply(`❌ Tidak ada Auto Character AI yang aktif di chat ini.`);
        }
    } else {
        m.reply(`Perintah tidak valid. Gunakan search, off, atau reset.`);
    }
}

async function caiAnswerHandler(m, sock) {
    if (!m.body || m.isCommand) return false;

    const db = getDatabase();
    const user = db.getUser(m.sender);

    if (!user || !user.cai_search_session) return false;

    const session = user.cai_search_session;
    const SESSION_TIMEOUT = 5 * 60 * 1000;
    
    if (Date.now() - session.time > SESSION_TIMEOUT) {
        delete user.cai_search_session;
        db.save();
        await m.reply(`⏰ *SESI KEDALUWARSA*\n\nSesi pencarian karakter AI sudah berakhir.`);
        return true;
    }

    const text = m.body.trim().toLowerCase();

    if (text === "batal" || text === "cancel") {
        delete user.cai_search_session;
        db.save();
        await m.reply(`🚪 Pencarian karakter dibatalkan.`);
        return true;
    }

    const choice = parseInt(text);
    if (isNaN(choice) || choice < 1 || choice > session.results.length) {
        return false;
    }

    const selected = session.results[choice - 1];
    delete user.cai_search_session;
    
    if (!db.db.data.characterai) db.db.data.characterai = {};
    
    db.db.data.characterai[m.chat] = {
        enabled: true,
        character_id: selected.character_id,
        name: selected.name,
        is_nsfw: selected.is_nsfw,
        conversation_id: null,
        activatedAt: Date.now(),
        activatedBy: m.sender
    };
    db.save();

    await m.react("✅");
    const nsfwWarning = selected.is_nsfw ? "\n⚠️ *WARNING: Karakter ini berlabel NSFW.*" : "";
    await m.reply(`🤖 *CHARACTER AI DIAKTIFKAN*\n\nKarakter *${selected.name}* telah terpilih! Mulai sekarang, AI akan merespons semua pesan biasa di chat ini.\n\n> Ketik \`.character-ai off\` untuk mematikan.${nsfwWarning}`);

    return true;
}

async function caiChatHandler(m, sock) {
    if (!m.body || m.isCommand) return false;

    const db = getDatabase();
    if (!db.db.data.characterai) return false;

    const chatAi = db.db.data.characterai[m.chat];
    if (!chatAi || !chatAi.enabled) return false;

    if (m.fromMe) return false;

    if (chatAi.isProcessing) return false;

    chatAi.isProcessing = true;
    
    try {
        let apiUrl = `https://api.neoxr.eu/api/cai?character_id=${chatAi.character_id}&message=${encodeURIComponent(m.body)}&apikey=${NEOXR_APIKEY}`;
        
        if (chatAi.conversation_id) {
            apiUrl += `&conversation_id=${encodeURIComponent(chatAi.conversation_id)}`;
        }

        const response = await axios.get(apiUrl, { timeout: 45000 });
        const resData = response.data;

        if (resData && resData.status && resData.data) {
            if (resData.data.conversation_id) {
                chatAi.conversation_id = resData.data.conversation_id;
                db.save();
            }

            let replyText = resData.data.content || "";
            if (resData.data.is_nsfw) {
                replyText = `🔞 [NSFW]\n` + replyText;
            }

            await m.reply(replyText);
        }
    } catch (error) {
        console.error("[CAI Chat Error]", error.message);
    } finally {
        chatAi.isProcessing = false;
    }

    return true;
}

export { pluginConfig as config, handler, caiAnswerHandler, caiChatHandler };
