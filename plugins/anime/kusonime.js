/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import config from '../../config.js';
const pluginConfig = {
    name: 'kusonime',
    alias: ['animeku', 'kusonime', 'nimeku', 'animebatch'],
    category: 'anime',
    description: 'Cari anime dari kusonime.com (batch download)',
    usage: '.kusonime <search|latest|genre>',
    example: '.kusonime search naruto\n.kusonime latest\n.kusonime genre action',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 8,
    energi: 1,
    isEnabled: true
};

const kusonime = {
    latest: async () => {
        try {
            const html = (await axios.get('https://kusonime.com/')).data;
            const $ = cheerio.load(html);
            const result = [];

            $(".venz > ul > .kover").each((i, el) => {
                const item = $(el);
                const title = item.find(".content h2 a").text().trim();
                const url = item.find(".content h2 a").attr("href");
                const thumb = item.find(".thumb img").attr("src") || item.find(".thumb img").attr("data-src");
                const released = item.find('.content p:has(i.fa-clock-o)').text().replace("Released on", "").trim();
                const genre = item.find('.content p:has(i.fa-tag) a').map((_, g) => $(g).text().trim()).get();

                result.push({ title, url, thumb, released, genre });
            });
            return result;
        } catch (e) {
            throw e;
        }
    },
    search: async (q, page = 1) => {
        try {
            const html = (await axios.get(`https://kusonime.com/page/${page}/?s=${encodeURIComponent(q)}`)).data;
            const $ = cheerio.load(html);
            const result = [];

            $(".venz > ul > .kover").each((i, el) => {
                const item = $(el);
                const title = item.find(".content h2 a").text().trim();
                const url = item.find(".content h2 a").attr("href");
                const thumb = item.find(".thumb img").attr("src") || item.find(".thumb img").attr("data-src");
                const released = item.find('.content p:has(i.fa-clock-o)').text().replace("Released on", "").trim();
                const genre = item.find('.content p:has(i.fa-tag) a').map((_, g) => $(g).text().trim()).get();

                result.push({ title, url, thumb, released, genre });
            });
            return result;
        } catch (e) {
            throw e;
        }
    },
    genre: async (genres, page = 1) => {
        try {
            const html = (await axios.get(`https://kusonime.com/genres/${encodeURIComponent(genres)}/page/${page}`)).data;
            const $ = cheerio.load(html);
            const result = [];

            $(".venz > ul > .kover").each((i, el) => {
                const item = $(el);
                const title = item.find(".content h2 a").text().trim();
                const url = item.find(".content h2 a").attr("href");
                const thumb = item.find(".thumb img").attr("src") || item.find(".thumb img").attr("data-src");
                const released = item.find('.content p:has(i.fa-clock-o)').text().replace("Released on", "").trim();
                const genre = item.find('.content p:has(i.fa-tag) a').map((_, g) => $(g).text().trim()).get();

                result.push({ title, url, thumb, released, genre });
            });
            return result;
        } catch (e) {
            throw e;
        }
    },
    detail: async (url) => {
        try {
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            const metadata = async (url) => {
                try {
                    const response = await axios.get(url);
                    const $ = cheerio.load(response.data);
                    const met = {};

                    met.title = $('h1.jdlz').text().trim();
                    const posterImg = $('.post-thumb img.wp-post-image');
                    met.poster_url = posterImg.attr('src') || '';

                    const info = {};
                    $('.info p').each((i, el) => {
                        const text = $(el).text().trim();
                        if (text.includes(':')) {
                            let [key, ...valueParts] = text.split(':');
                            key = key.trim().toLowerCase().replace(/\s+/g, '_');
                            let value = valueParts.join(':').trim();

                            if (key === 'genre') {
                                info.genres = $(el).find('a').map((j, a) => $(a).text().trim()).get();
                            } else if (key === 'seasons') {
                                const seasonLink = $(el).find('a');
                                info.season = seasonLink.text().trim() || value;
                            } else if (key === 'producers') {
                                info.producers = value;
                            } else {
                                info[key] = value;
                            }
                        }
                    });
                    met.info = info;

                    const sinopsisParts = [];
                    $('.venutama > p').each((i, el) => {
                        const text = $(el).text().trim();
                        const parentClass = $(el).parent().attr('class');
                        if (text && !text.toLowerCase().includes('download') && !text.toLowerCase().includes('credit') && parentClass !== 'info') {
                            sinopsisParts.push(text);
                        }
                    });
                    met.sinopsis = sinopsisParts.join('\n\n');
                    met.posted_info = $('.kategoz').text().trim();
                    return met;
                } catch (error) {
                    return error;
                }
            };

            const results = [];

            $('.smokeddlrh').each((i, batchEl) => {
                const $batch = $(batchEl);
                const title = $batch.find('.smokettlrh').text().trim();
                if (!title) return;

                const batch = { title, resolutions: {} };

                $batch.find('.smokeurlrh').each((j, resEl) => {
                    const $res = $(resEl);
                    const resolution = $res.find('strong').text().trim();
                    if (!resolution || !/\d{3,4}P/i.test(resolution)) return;

                    const links = [];
                    $res.find('a').each((k, a) => {
                        const $a = $(a);
                        const provider = $a.text().trim();
                        const url = $a.attr('href');
                        if (url && url.startsWith('http') && provider) {
                            links.push({ provider, url });
                        }
                    });

                    if (links.length > 0) {
                        batch.resolutions[resolution] = links;
                    }
                });

                if (Object.keys(batch.resolutions).length > 0) {
                    results.push(batch);
                }
            });

            const meta = await metadata(url);
            return { metadata: meta, download: results };
        } catch (e) {
            throw e;
        }
    },
};

async function handler(m, { sock }) {
    const args = m.args || [];
    const action = args[0]?.toLowerCase();
    const query = args.slice(1).join(' ') || m.text?.slice(m.command.length + 1).trim();

    if (!action) {
        return m.reply(
            `💕 *ᴋᴜꜱᴏɴɪᴍᴇ* 💕\n\n` +
            `╭━━━━━━━━━━━━━━━━━━━━━⬣\n` +
            `┃ ✦ *Cara Pakai*\n` +
            `┃\n` +
            `┃   ${m.prefix}kusonime latest\n` +
            `┃   ${m.prefix}kusonime search <judul>\n` +
            `┃   ${m.prefix}kusonime genre <genre>\n` +
            `┃   ${m.prefix}kusonime detail <url>\n` +
            `┃\n` +
            `┃ ✦ *Contoh*\n` +
            `┃\n` +
            `┃   ${m.prefix}kusonime search naruto\n` +
            `┃   ${m.prefix}kusonime genre action\n` +
            `┃   ${m.prefix}kusonime detail https://kusonime.com/xxx\n` +
            `┃\n` +
            `┃ 💗 *Rimuru:* Mau cari anime apa darling~?\n` +
            `╰━━━━━━━━━━━━━━━━━━━━━⬣`
        );
    }

    m.react('💕');
    await m.reply(`⏳ *ᴘʀᴏᴄᴇꜱꜱɪɴɢ...*\n\n💗 *Rimuru:* Lagi mencari anime darling~ tunggu sebentar yaa 🦋`);

    try {
        let result;
        
        if (action === 'latest') {
            result = await kusonime.latest();
            
            if (!result || result.length === 0) {
                return m.reply(`💔 *ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ*\n\n> Tidak ada anime terbaru darling~`);
            }
            
            let txt = `💕 *ᴀɴɪᴍᴇ ᴛᴇʀʙᴀʀᴜ* 💕\n\n`;
            for (let i = 0; i < Math.min(result.length, 10); i++) {
                const anime = result[i];
                txt += `╭━━━━━━━━━━━━━━━━━━━━━⬣\n`;
                txt += `┃ 📺 *${anime.title}*\n`;
                txt += `┃ 📅 Rilis: ${anime.released}\n`;
                txt += `┃ 🏷️ Genre: ${anime.genre.join(', ')}\n`;
                txt += `┃ 🔗 ${anime.url}\n`;
                txt += `╰━━━━━━━━━━━━━━━━━━━━━⬣\n\n`;
            }
            await m.reply(txt);
            
        } else if (action === 'search') {
            if (!query) return m.reply(`❌ Masukkan judul anime yang mau dicari darling~`);
            
            result = await kusonime.search(query);
            
            if (!result || result.length === 0) {
                return m.reply(`💔 *ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ*\n\n> Anime *${query}* tidak ditemukan darling~`);
            }
            
            let txt = `💕 *ʜᴀꜱɪʟ ᴘᴇɴᴄᴀʀɪᴀɴ* 💕\n\n> *${query}*\n\n`;
            for (let i = 0; i < Math.min(result.length, 10); i++) {
                const anime = result[i];
                txt += `╭━━━━━━━━━━━━━━━━━━━━━⬣\n`;
                txt += `┃ 📺 *${anime.title}*\n`;
                txt += `┃ 📅 Rilis: ${anime.released}\n`;
                txt += `┃ 🏷️ Genre: ${anime.genre.join(', ')}\n`;
                txt += `┃ 🔗 ${anime.url}\n`;
                txt += `╰━━━━━━━━━━━━━━━━━━━━━⬣\n\n`;
            }
            await m.reply(txt);
            
        } else if (action === 'genre') {
            if (!query) return m.reply(`❌ Masukkan genre yang mau dicari darling~`);
            
            result = await kusonime.genre(query);
            
            if (!result || result.length === 0) {
                return m.reply(`💔 *ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ*\n\n> Genre *${query}* tidak ditemukan darling~`);
            }
            
            let txt = `💕 *ᴀɴɪᴍᴇ ɢᴇɴʀᴇ ${query.toUpperCase()}* 💕\n\n`;
            for (let i = 0; i < Math.min(result.length, 10); i++) {
                const anime = result[i];
                txt += `╭━━━━━━━━━━━━━━━━━━━━━⬣\n`;
                txt += `┃ 📺 *${anime.title}*\n`;
                txt += `┃ 📅 Rilis: ${anime.released}\n`;
                txt += `┃ 🏷️ Genre: ${anime.genre.join(', ')}\n`;
                txt += `┃ 🔗 ${anime.url}\n`;
                txt += `╰━━━━━━━━━━━━━━━━━━━━━⬣\n\n`;
            }
            await m.reply(txt);
            
        } else if (action === 'detail') {
            if (!query) return m.reply(`❌ Masukkan URL detail anime darling~`);
            
            result = await kusonime.detail(query);
            
            const meta = result.metadata;
            let txt = `💕 *ᴅᴇᴛᴀɪʟ ᴀɴɪᴍᴇ* 💕\n\n`;
            txt += `╭━━━━━━━━━━━━━━━━━━━━━⬣\n`;
            txt += `┃ 📺 *${meta.title}*\n`;
            txt += `┃\n`;
            
            if (meta.info) {
                if (meta.info.japanese) txt += `┃ 🇯🇵 Jepang: ${meta.info.japanese}\n`;
                if (meta.info.season) txt += `┃ 📅 Season: ${meta.info.season}\n`;
                if (meta.info.episode) txt += `┃ 📀 Episode: ${meta.info.episode}\n`;
                if (meta.info.status) txt += `┃ 📌 Status: ${meta.info.status}\n`;
                if (meta.info.duration) txt += `┃ ⏱️ Durasi: ${meta.info.duration}\n`;
                if (meta.info.genres && meta.info.genres.length) txt += `┃ 🏷️ Genre: ${meta.info.genres.join(', ')}\n`;
                if (meta.info.producers) txt += `┃ 🎬 Produser: ${meta.info.producers}\n`;
            }
            
            txt += `┃\n┃ 📖 *Sinopsis:*\n┃ ${meta.sinopsis?.substring(0, 300)}${meta.sinopsis?.length > 300 ? '...' : ''}\n`;
            txt += `╰━━━━━━━━━━━━━━━━━━━━━⬣\n\n`;
            
            if (result.download && result.download.length > 0) {
                txt += `💕 *ʟɪɴᴋ ᴅᴏᴡɴʟᴏᴀᴅ* 💕\n\n`;
                for (const batch of result.download) {
                    txt += `╭━━━〔 📦 ${batch.title} 〕━━━⬣\n`;
                    for (const [res, links] of Object.entries(batch.resolutions)) {
                        txt += `┃ 🎬 *${res}*\n`;
                        for (const link of links) {
                            txt += `┃    ◦ ${link.provider}: ${link.url}\n`;
                        }
                    }
                    txt += `╰━━━━━━━━━━━━━━━━━━━━━⬣\n\n`;
                }
            }
            
            await m.reply(txt);
        } else {
            return m.reply(`❌ Perintah tidak dikenal! Gunakan: latest, search, genre, atau detail`);
        }
        
        m.react('✅');
        
    } catch (err) {
        console.error('[Kusonime] Error:', err);
        m.react('💔');
        return m.reply(
            `💔 *ᴇʀʀᴏʀ*\n\n` +
            `> ${err.message}\n\n` +
            `> Coba lagi ya darling~ 🥺`
        );
    }
}

export { pluginConfig as config, handler };
