/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import * as cheerio from 'cheerio'
async function scrapeWutheringWavesCharacter(name) {
    if (!name) throw new Error("Nama karakter kosong");

    const slug = name.trim().replace(/\s+/g, "_");
    const url = `https://wutheringwaves.fandom.com/wiki/${encodeURIComponent(slug)}`;

    const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0" }
    });

    if (!res.ok) {
        throw new Error("Data tidak ditemukan");
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    const clean = (v) => v?.replace(/\s+/g, " ").trim() || null;

    const title = clean($("#firstHeading").text());
    if (!title) {
        throw new Error("Halaman tidak valid");
    }

    const bio = clean($(".mw-parser-output > p").first().text());

    const profile = {};
    $(".pi-item.pi-data").each((_, el) => {
        const label = clean($(el).find(".pi-data-label").text());
        const value = clean($(el).find(".pi-data-value").text());
        if (!label || !value) return;

        const key = label
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "_")
            .replace(/^_+|_+$/g, "");

        profile[key] = value;
    });

    const pageSlug = slug.toLowerCase();
    const imageSet = new Set();

    $("img, noscript img").each((_, img) => {
        let src =
            $(img).attr("data-src") ||
            $(img).attr("src");

        const srcset =
            $(img).attr("data-srcset") ||
            $(img).attr("srcset");

        if (!src && srcset) {
            src = srcset.split(",")[0].split(" ")[0];
        }

        if (!src) return;
        if (!src.includes("static.wikia.nocookie.net")) return;
        if (!src.toLowerCase().includes(pageSlug)) return;

        imageSet.add(
            src.split("/revision/")[0] + "/revision/latest"
        );
    });

    return {
        title,
        slug,
        url,
        bio,
        profile,
        images: [...imageSet]
    };
}

export default scrapeWutheringWavesCharacter