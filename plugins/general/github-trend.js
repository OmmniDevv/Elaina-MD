/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";
import * as cheerio from 'cheerio';

async function ghTrending() {
    try {
        const url = "https://github.com/trending";
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const repositories = [];

        $(".Box-row").each((index, element) => {
            const title = $(element).find("h2 a").text().trim().replace(/\s+/g, " ");
            const repoLink = "https://github.com" + $(element).find("h2 a").attr("href");
            const description = $(element).find("p").text().trim() || "Tidak ada deskripsi.";
            const stars = $(element).find("a[href$='/stargazers']").text().trim() || "0";
            
            const numbers = $(element).find("a.Link--muted").map((i, el) => $(el).text().trim()).get();
            const forks = numbers.length > 1 ? numbers[1] : "0";

            const language = $(element).find("[itemprop='programmingLanguage']").text().trim() || "Unknown";

            repositories.push({ title, repoLink, description, stars, forks, language });
        });

        return repositories;
    } catch (error) {
        console.error("Error fetching GitHub Trending:", error.message);
        return [];
    }
}

async function handler(m, { conn, args }) {
    const repositories = await ghTrending();
    if (repositories.length === 0) {
        return m.reply("❌ Gagal mengambil data dari GitHub Trending.");
    }

    let jumlah = parseInt(args[0]) || 10;
    jumlah = Math.min(Math.max(jumlah, 1), repositories.length);

    let message = "*Top GitHub Trending* 🔥\n\n";
    repositories.slice(0, jumlah).forEach((repo, index) => {
        message += `🔹 *${index + 1}.*\n`;
        message += `📌 *Repository Name* : ${repo.title}\n`;
        message += `🔗 *Repository Link* : ${repo.repoLink}\n\n`;
        message += `📝 *Description* : ${repo.description}\n\n`;
        message += `⭐ *Total Star* : ${repo.stars}\n`;
        message += `🍴 *Total Forks* : ${repo.forks}\n\n`;
        message += `💻 \`\`\`Programming language\`\`\` : ${repo.language}\n\n`;
    });

    m.reply(message);
}

handler.help = ["githubtrend"];
handler.tags = ['internet']
handler.command = ["githubtrend"];
handler.limit = false;

export default handler;
