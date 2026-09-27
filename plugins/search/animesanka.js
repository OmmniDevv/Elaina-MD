/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
const config = {
    name: 'animesanka',
    alias: ['sanka', 'animeid', 'animeindo'],
    category: 'search',
    description: 'Cari info anime, streaming, download dari SankaVollerei',
    usage: '.animesanka <subcommand>',
    example: '.animesanka search naruto',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true
}

const baseURL = 'https://www.sankavollerei.com/anime'

async function fetchJson(url) {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 15000,
            validateStatus: () => true
        })
        return data
    } catch (error) {
        return { status: 'error', message: error.message }
    }
}

async function animeHome() {
    return await fetchJson(`${baseURL}/home`)
}

async function animeSchedule() {
    return await fetchJson(`${baseURL}/schedule`)
}

async function animeDetail(slug) {
    if (!slug) return { status: 'error', message: 'Slug tidak boleh kosong' }
    return await fetchJson(`${baseURL}/anime/${slug}`)
}

async function animeCompleted(page = 1) {
    return await fetchJson(`${baseURL}/complete-anime?page=${page}`)
}

async function animeOngoing(page = 1) {
    return await fetchJson(`${baseURL}/ongoing-anime?page=${page}`)
}

async function animeGenreList() {
    return await fetchJson(`${baseURL}/genre`)
}

async function animeByGenre(slug, page = 1) {
    if (!slug) return { status: 'error', message: 'Slug genre tidak boleh kosong' }
    return await fetchJson(`${baseURL}/genre/${slug}?page=${page}`)
}

async function animeSearch(keyword) {
    if (!keyword) return { status: 'error', message: 'Keyword tidak boleh kosong' }
    return await fetchJson(`${baseURL}/search/${keyword}`)
}

async function animeEpisode(slug) {
    if (!slug) return { status: 'error', message: 'Slug episode tidak boleh kosong' }
    return await fetchJson(`${baseURL}/episode/${slug}`)
}

async function animeBatch(slug) {
    if (!slug) return { status: 'error', message: 'Slug batch tidak boleh kosong' }
    return await fetchJson(`${baseURL}/batch/${slug}`)
}

async function handler(m) {
    const args = m.text?.trim().split(/\s+/)
    const command = args[0]?.toLowerCase()
    const query = args.slice(1).join(' ')
    
    if (!command) {
        return m.reply(`🎀 *ᴀɴɪᴍᴇ ꜱᴀɴᴋᴀ ᴄᴏᴍᴍᴀɴᴅꜱ*\n\n> .animesanka home\n> .animesanka schedule\n> .animesanka search <judul>\n> .animesanka ongoing <page>\n> .animesanka completed <page>\n> .animesanka genre\n> .animesanka genre <genre>\n> .animesanka detail <slug>\n> .animesanka episode <slug>\n> .animesanka batch <slug>\n\n🌸 *Contoh:* .animesanka search naruto`)
    }
    
    if (command === 'home') {
        await m.reply('⏳ *Mengambil data home...*')
        const result = await animeHome()
        
        if (result.status === 'error') {
            return m.reply(`❌ *ERROR*\n\n${result.message}`)
        }
        
        let txt = `🏠 *ᴀɴɪᴍᴇ ʜᴏᴍᴇ*\n\n`
        
        if (result.data?.ongoing?.length) {
            txt += `╭──〔 🔥 *ᴏɴɢᴏɪɴɢ* 〕───⬣\n`
            for (let i = 0; i < Math.min(5, result.data.ongoing.length); i++) {
                const anime = result.data.ongoing[i]
                txt += `│  ✦ *${anime.title}*\n`
                if (anime.episode) txt += `│    └ 🎬 Episode: ${anime.episode}\n`
            }
            txt += `╰────────────────⬣\n\n`
        }
        
        if (result.data?.completed?.length) {
            txt += `╭──〔 ✅ *ᴄᴏᴍᴘʟᴇᴛᴇᴅ* 〕───⬣\n`
            for (let i = 0; i < Math.min(5, result.data.completed.length); i++) {
                const anime = result.data.completed[i]
                txt += `│  ✦ *${anime.title}*\n`
            }
            txt += `╰────────────────⬣\n\n`
        }
        
        txt += `> 💡 Ketik .animesanka search <judul> untuk mencari`
        await m.reply(txt)
        
    } else if (command === 'schedule') {
        await m.reply('⏳ *Mengambil jadwal anime...*')
        const result = await animeSchedule()
        
        if (result.status === 'error') {
            return m.reply(`❌ *ERROR*\n\n${result.message}`)
        }
        
        let txt = `📅 *ᴊᴀᴅᴡᴀʟ ᴀɴɪᴍᴇ*\n\n`
        
        for (const [day, animeList] of Object.entries(result.data || {})) {
            if (animeList?.length) {
                txt += `╭──〔 *${day.toUpperCase()}* 〕───⬣\n`
                for (const anime of animeList.slice(0, 5)) {
                    txt += `│  ✦ ${anime.title}\n`
                    if (anime.time) txt += `│    └ ⏰ ${anime.time}\n`
                }
                txt += `╰────────────────⬣\n\n`
            }
        }
        
        await m.reply(txt)
        
    } else if (command === 'search') {
        if (!query) {
            return m.reply(`🔍 *ᴄᴀʀɪ ᴀɴɪᴍᴇ*\n\n> Masukkan judul anime yang dicari!\n\n> Contoh: .animesanka search naruto`)
        }
        
        await m.reply(`⏳ *Mencari "${query}"...*`)
        const result = await animeSearch(query)
        
        if (result.status === 'error' || result.data?.length === 0) {
            return m.reply(`❌ *TIDAK DITEMUKAN*\n\n> Anime dengan judul "${query}" tidak ditemukan.`)
        }
        
        let txt = `🔍 *ʜᴀꜱɪʟ ᴘᴇɴᴄᴀʀɪᴀɴ:* ${query}\n\n`
        
        for (let i = 0; i < Math.min(10, result.data.length); i++) {
            const anime = result.data[i]
            txt += `╭──〔 ${i+1} 〕───⬣\n`
            txt += `│  ✨ *${anime.title}*\n`
            if (anime.slug) txt += `│  📝 Slug: ${anime.slug}\n`
            if (anime.status) txt += `│  📌 Status: ${anime.status}\n`
            txt += `│  💡 .animesanka detail ${anime.slug}\n`
            txt += `╰────────────────⬣\n\n`
        }
        
        await m.reply(txt)
        
    } else if (command === 'ongoing') {
        const page = parseInt(query) || 1
        await m.reply(`⏳ *Mengambil anime ongoing halaman ${page}...*`)
        const result = await animeOngoing(page)
        
        if (result.status === 'error' || !result.data?.length) {
            return m.reply(`❌ *TIDAK DITEMUKAN*\n\n> Halaman ${page} tidak ditemukan.`)
        }
        
        let txt = `🔥 *ᴀɴɪᴍᴇ ᴏɴɢᴏɪɴɢ* (Halaman ${page})\n\n`
        
        for (let i = 0; i < result.data.length; i++) {
            const anime = result.data[i]
            txt += `${i+1}. *${anime.title}*\n`
            if (anime.episode) txt += `   └ 🎬 Episode: ${anime.episode}\n`
        }
        
        txt += `\n> 📝 Ketik .animesanka ongoing ${page + 1} untuk halaman berikutnya`
        await m.reply(txt)
        
    } else if (command === 'completed') {
        const page = parseInt(query) || 1
        await m.reply(`⏳ *Mengambil anime completed halaman ${page}...*`)
        const result = await animeCompleted(page)
        
        if (result.status === 'error' || !result.data?.length) {
            return m.reply(`❌ *TIDAK DITEMUKAN*\n\n> Halaman ${page} tidak ditemukan.`)
        }
        
        let txt = `✅ *ᴀɴɪᴍᴇ ᴄᴏᴍᴘʟᴇᴛᴇᴅ* (Halaman ${page})\n\n`
        
        for (let i = 0; i < result.data.length; i++) {
            const anime = result.data[i]
            txt += `${i+1}. *${anime.title}*\n`
        }
        
        txt += `\n> 📝 Ketik .animesanka completed ${page + 1} untuk halaman berikutnya`
        await m.reply(txt)
        
    } else if (command === 'genre') {
        if (!query) {
            await m.reply('⏳ *Mengambil daftar genre...*')
            const result = await animeGenreList()
            
            if (result.status === 'error' || !result.data?.length) {
                return m.reply(`❌ *ERROR*\n\n${result.message || 'Genre tidak ditemukan'}`)
            }
            
            let txt = `🎭 *ᴅᴀꜰᴛᴀʀ ɢᴇɴʀᴇ*\n\n`
            
            for (const genre of result.data) {
                txt += `✦ *${genre.name}* - .animesanka genre ${genre.slug}\n`
            }
            
            await m.reply(txt)
        } else {
            const page = parseInt(args[2]) || 1
            await m.reply(`⏳ *Mengambil anime genre ${query}...*`)
            const result = await animeByGenre(query, page)
            
            if (result.status === 'error' || !result.data?.length) {
                return m.reply(`❌ *TIDAK DITEMUKAN*\n\n> Genre "${query}" tidak ditemukan.`)
            }
            
            let txt = `🎭 *ᴀɴɪᴍᴇ ɢᴇɴʀᴇ: ${query}*\n\n`
            
            for (let i = 0; i < Math.min(10, result.data.length); i++) {
                const anime = result.data[i]
                txt += `${i+1}. *${anime.title}*\n`
            }
            
            await m.reply(txt)
        }
        
    } else if (command === 'detail') {
        if (!query) {
            return m.reply(`📖 *ᴅᴇᴛᴀɪʟ ᴀɴɪᴍᴇ*\n\n> Masukkan slug anime!\n\n> Contoh: .animesanka detail naruto-shipuden\n> Dapatkan slug dari hasil pencarian`)
        }
        
        await m.reply(`⏳ *Mengambil detail anime...*`)
        const result = await animeDetail(query)
        
        if (result.status === 'error') {
            return m.reply(`❌ *ERROR*\n\n${result.message}`)
        }
        
        const d = result.data || result
        
        let txt = `📖 *${d.title || 'Detail Anime'}*\n\n`
        if (d.cover) txt += `🖼️ Cover: ${d.cover}\n`
        if (d.synopsis) txt += `📝 *Sinopsis:*\n${d.synopsis.slice(0, 500)}${d.synopsis.length > 500 ? '...' : ''}\n\n`
        if (d.episodes) txt += `🎬 *Total Episode:* ${d.episodes}\n`
        if (d.status) txt += `📌 *Status:* ${d.status}\n`
        if (d.genres?.length) txt += `🎭 *Genre:* ${d.genres.join(', ')}\n`
        
        await m.reply(txt)
        
    } else if (command === 'episode') {
        if (!query) {
            return m.reply(`🎬 *ᴇᴘɪꜱᴏᴅᴇ ᴀɴɪᴍᴇ*\n\n> Masukkan slug episode!\n\n> Contoh: .animesanka episode naruto-episode-1`)
        }
        
        await m.reply(`⏳ *Mengambil link episode...*`)
        const result = await animeEpisode(query)
        
        if (result.status === 'error') {
            return m.reply(`❌ *ERROR*\n\n${result.message}`)
        }
        
        const d = result.data || result
        
        let txt = `🎬 *${d.title || 'Episode'}*\n\n`
        
        if (d.download_urls) {
            for (const [quality, url] of Object.entries(d.download_urls)) {
                txt += `📥 *${quality}*: ${url}\n`
            }
        }
        
        if (d.stream_url) {
            txt += `🎥 *Stream:* ${d.stream_url}\n`
        }
        
        await m.reply(txt)
        
    } else if (command === 'batch') {
        if (!query) {
            return m.reply(`📦 *ʙᴀᴛᴄʜ ᴀɴɪᴍᴇ*\n\n> Masukkan slug batch!\n\n> Contoh: .animesanka batch naruto-batch`)
        }
        
        await m.reply(`⏳ *Mengambil link batch...*`)
        const result = await animeBatch(query)
        
        if (result.status === 'error') {
            return m.reply(`❌ *ERROR*\n\n${result.message}`)
        }
        
        const d = result.data || result
        
        let txt = `📦 *${d.title || 'Batch Anime'}*\n\n`
        
        if (d.download_urls) {
            for (const [quality, url] of Object.entries(d.download_urls)) {
                txt += `📥 *${quality}*: ${url}\n`
            }
        }
        
        await m.reply(txt)
        
    } else {
        return m.reply(`❌ *Subcommand tidak dikenal!*\n\n> .animesanka home\n> .animesanka schedule\n> .animesanka search <judul>\n> .animesanka ongoing <page>\n> .animesanka completed <page>\n> .animesanka genre\n> .animesanka genre <genre>\n> .animesanka detail <slug>\n> .animesanka episode <slug>\n> .animesanka batch <slug>`)
    }
}
export { config, handler };