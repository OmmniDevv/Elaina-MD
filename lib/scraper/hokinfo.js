/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import * as cheerio from 'cheerio'
async function scrapeHokCharacter(name) {
    if (!name) throw new Error("Nama karakter kosong");

    const url = `https://honor-of-kings.fandom.com/wiki/${encodeURIComponent(name)}`;

    const res = await fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0"
        }
    });

    if (!res.ok) {
        throw new Error("Gagal mengambil halaman karakter");
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    const clean = (str) => str?.replace(/\s+/g, " ").trim();

    const title = clean($("#firstHeading").text());
    if (!title) {
        throw new Error("Karakter tidak ditemukan");
    }

    let image =
        $(".pi-image img").attr("src") ||
        $('meta[property="og:image"]').attr("content") ||
        null;

    if (image && image.startsWith("//")) {
        image = "https:" + image;
    }

    const profile = {};
    $(".pi-item.pi-data").each((_, el) => {
        const label = clean($(el).find(".pi-data-label").text());
        const value = clean($(el).find(".pi-data-value").text());
        if (label && value) profile[label] = value;
    });

    const bio = clean($(".mw-parser-output > p").first().text());

    let skills = [];
    if (profile.Skills) {
        skills = profile.Skills
            .split(/[,•]/)
            .map(v => clean(v))
            .filter(Boolean);
    }

    const loreParts = [];
    $("h2, h3").each((_, el) => {
        const heading = clean($(el).text());
        if (/Background|Lore/i.test(heading)) {
            let next = $(el).next();
            while (next.length && !/^h[2-3]$/i.test(next[0].name)) {
                if (next[0].name === "p") {
                    const txt = clean(next.text());
                    if (txt) loreParts.push(txt);
                }
                next = next.next();
            }
        }
    });

    return {
        title,
        image,
        profile,
        bio,
        skills,
        lore: loreParts.length ? loreParts.join(" ") : null,
        url
    };
}

export default scrapeHokCharacter