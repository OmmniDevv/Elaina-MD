/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios"
import * as cheerio from "cheerio"
import te from "../../src/lib/elaina-error.js"

const pluginConfig = {
    name: "movieku",
    alias: ["movie", "film", "carifilm", "carimovie"],
    category: "search",
    description: "Cari dan tampilkan informasi film lengkap dari Movieku beserta link download dalam berbagai kualitas",
    usage: ".movieku <judul film>",
    example: ".movieku avengers",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true
}

async function searchMovies(query) {
    const res = await axios.post(
        "https://movieku.rest/wp-admin/admin-ajax.php",
        `action=ts_ac_do_search&ts_ac_query=${encodeURIComponent(query)}`,
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-Requested-With": "XMLHttpRequest"
            },
            timeout: 30000
        }
    )
    return res.data?.post?.[0]?.all || []
}

async function getMovieDetail(movieUrl) {
    const res = await axios.get(movieUrl, { timeout: 30000 })
    const $ = cheerio.load(res.data)

    const title = $("h1").first().text().trim()
    const synopsis = $(".entry-content p").first().text().trim()
    const poster = $('img[src*="wp-content/uploads"]').first().attr("src")

    const detail = {}
    $("ul li").each((_, el) => {
        const text = $(el).text().trim()
        if (text.startsWith("Genre:")) detail.genre = $(el).find("a").map((_, a) => $(a).text()).get().join(", ")
        if (text.startsWith("Release:")) detail.release = text.replace("Release:", "").trim()
        if (text.startsWith("Duration:")) detail.duration = text.replace("Duration:", "").trim()
        if (text.startsWith("Director:")) detail.director = $(el).find("a").first().text().trim()
        if (text.startsWith("Country:")) detail.country = $(el).find("a").first().text().trim()
        if (text.startsWith("Quality:")) detail.quality = text.replace("Quality:", "").trim()
        if (text.startsWith("Score:")) detail.score = text.replace("Score:", "").trim()
        if (text.startsWith("Rating:")) detail.rating = text.replace("Rating:", "").trim()
        if (text.startsWith("Stars:")) detail.stars = $(el).find("a").map((_, a) => $(a).text()).get().join(", ")
    })

    const stream = $('a[href*="abyssplayer"]').first().attr("href") || null

    const downloads = {}
    $("strong").each((_, el) => {
        const label = $(el).text().trim()
        if (["1080p", "720p", "480p", "360p"].includes(label)) {
            downloads[label] = {}
            $(el).parent().find("a").each((_, a) => {
                downloads[label][$(a).text().trim()] = $(a).attr("href")
            })
        }
    })

    return { title, poster, synopsis, ...detail, stream, downloads }
}

function formatDownloads(downloads) {
    if (!downloads || Object.keys(downloads).length === 0) return ""
    let txt = `\n🔽 *LINK DOWNLOAD*\n\n`
    const qualities = ["1080p", "720p", "480p", "360p"]
    for (const q of qualities) {
        if (!downloads[q]) continue
        const links = Object.entries(downloads[q])
        if (links.length === 0) continue
        txt += `📀 *${q}*\n`
        for (const [server, url] of links) {
            txt += `- ${server}: ${url}\n`
        }
        txt += `\n`
    }
    return txt
}

async function handler(m, { sock }) {
    const query = m.text?.trim()

    if (!query) {
        return m.reply(
            `🎬 *MOVIEKU*\n\n` +
            `Fitur ini membantu kamu mencari informasi lengkap tentang film dari database Movieku, termasuk sinopsis, detail film, dan link download dalam berbagai kualitas resolusi\n\n` +
            `*Cara pakai:*\n` +
            `> \`${m.prefix}movieku <judul film>\`\n\n` +
            `*Contoh:*\n` +
            `> \`${m.prefix}movieku avengers\`\n` +
            `> \`${m.prefix}movieku one piece\`\n\n` +
            `_Hasil pencarian akan menampilkan film yang paling relevan dengan judul yang kamu cari_`
        )
    }

    m.react("🔍")

    try {
        const movies = await searchMovies(query)

        if (!movies || movies.length === 0) {
            m.react("❌")
            return m.reply(`❌ Film dengan kata kunci *${query}* tidak ditemukan, coba gunakan judul yang lebih spesifik ya`)
        }

        const movie = movies[0]
        const detail = await getMovieDetail(movie.post_link)

        let txt = `🎬 *${detail.title || movie.post_title || query.toUpperCase()}*\n\n`

        if (detail.synopsis) {
            const synopsisText = detail.synopsis.length > 500
                ? detail.synopsis.substring(0, 497) + "..."
                : detail.synopsis
            txt += `📝 *Sinopsis:*\n${synopsisText}\n\n`
        }

        txt += `📋 *DETAIL FILM*\n\n`
        if (detail.genre) txt += `🎭 Genre: *${detail.genre}*\n`
        if (detail.release) txt += `📅 Rilis: *${detail.release}*\n`
        if (detail.duration) txt += `⏱️ Durasi: *${detail.duration}*\n`
        if (detail.quality) txt += `📺 Kualitas: *${detail.quality}*\n`
        if (detail.country) txt += `🌍 Negara: *${detail.country}*\n`
        if (detail.director) txt += `🎬 Sutradara: *${detail.director}*\n`
        if (detail.rating) txt += `⭐ Rating: *${detail.rating}*\n`
        if (detail.score) txt += `📊 Score: *${detail.score}*\n`
        if (detail.stars) txt += `🌟 Pemeran: *${detail.stars}*\n`

        if (detail.stream) {
            txt += `\n▶️ *Streaming:* ${detail.stream}\n`
        }

        txt += formatDownloads(detail.downloads)

        txt += `🔗 ${movie.post_link}`

        m.react("✅")

        const poster = detail.poster || movie.post_image
        if (poster) {
            await sock.sendMessage(m.chat, {
                image: { url: poster },
                caption: txt
            }, { quoted: m })
        } else {
            await m.reply(txt)
        }

        if (movies.length > 1) {
            let listTxt = `🎬 *HASIL LAINNYA*\n\n`
            listTxt += `Ditemukan *${movies.length}* film yang cocok dengan pencarianmu, berikut daftar lengkapnya:\n\n`
            const maxShow = Math.min(movies.length, 10)
            for (let i = 1; i < maxShow; i++) {
                listTxt += `- *${movies[i].post_title}*\n  > ${movies[i].post_link}\n\n`
            }
            if (movies.length > 10) {
                listTxt += `_...dan ${movies.length - 10} film lainnya_`
            }
            await m.reply(listTxt.trim())
        }

    } catch (error) {
        m.react("☢")
        m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }
