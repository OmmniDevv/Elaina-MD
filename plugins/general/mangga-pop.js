/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

// Ini Scrape Nya
async function fetchMangaList() {
    try {
        const url = "https://natsu.id";
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Gagal mengambil data dari ${url}, status: ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        const mangaList = [];

        $(".listupd.popularslider .bs").each((_, element) => {
            const title = $(element).find(".bigor .tt").text().trim();
            const chapter = $(element).find(".bigor .epxs").text().trim();
            const rating = $(element).find(".bigor .numscore").text().trim();
            const link = $(element).find("a").attr("href");
            const image = $(element).find("img").attr("src");

            if (title && link) { 
                mangaList.push({
                    title,
                    chapter,
                    rating,
                    link,
                    image,
                });
            }
        });

        return mangaList;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return [];
    }
}
//Batas Scrape 

const pluginConfig = {
  name: "mangalist",
  alias: [],
  category: "general",
  description: "Imported from Rimuru MD V4.6",
  usage: "",
  example: "",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 0,
  isEnabled: true,
};

const handler = async (m, { conn }) => {
    m.reply('Please Wait....');
    const mangaList = await fetchMangaList();

    if (mangaList.length === 0) {
        return m.reply('❌ Gagal mengambil daftar manga. Silakan coba lagi nanti.');
    }

    for (const manga of mangaList.slice(0, 5)) { //Max Mengirim 5 (Ubah Sendiri Juga Bisa)
        const caption = `
📖 *${manga.title}*
📄 Chapter: ${manga.chapter}
⭐ Rating: ${manga.rating || 'N/A'}
🔗 Link: ${manga.link}
        `.trim();

        
        await conn.sendMessage(
            m.chat,
            {
                image: { url: manga.image }, 
                caption: caption, 
            },
            { quoted: m }
        );
    }

    m.reply('');
};

export { pluginConfig as config, handler };
