/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

/*
  Fitur tambahan hasil audit FURINA V17 → Rimuru MD.
*/

import axios from 'axios'

const pluginConfig = {
    name: 'imdb',
    alias: ['imdbinfo'],
    category: 'search',
    description: 'Cari detail film atau serial dari IMDb/OMDb',
    usage: '.imdb <judul>',
    example: '.imdb Interstellar',
    cooldown: 10,
    energi: 1,
    isEnabled: true
}

const OMDB_ENDPOINT = 'https://www.omdbapi.com/'
const OMDB_KEY = process.env.OMDB_API_KEY || globalThis.OMDB_API_KEY || ''

async function handler(m) {
    const title = m.text?.trim()
    if (!title) return m.reply(`Contoh: ${m.prefix}imdb Interstellar`)
    if (!OMDB_KEY) return m.reply('❌ OMDb API key belum dikonfigurasi. Set `OMDB_API_KEY` terlebih dahulu.')

    try {
        m.react('🎬')
        const { data } = await axios.get(OMDB_ENDPOINT, {
            params: { apikey: OMDB_KEY, t: title, plot: 'full' },
            timeout: 15000
        })
        if (!data || data.Response === 'False') return m.reply(`❌ Film/serial *${title}* tidak ditemukan.`)

        const caption = [
            '🎬 *IMDb SEARCH*',
            '',
            `🎬 Title      : ${data.Title || '-'}`,
            `📅 Year       : ${data.Year || '-'}`,
            `⭐ Rated      : ${data.Rated || '-'}`,
            `📆 Released   : ${data.Released || '-'}`,
            `⏳ Runtime     : ${data.Runtime || '-'}`,
            `🌀 Genre      : ${data.Genre || '-'}`,
            `🎥 Director   : ${data.Director || '-'}`,
            `✍️ Writer     : ${data.Writer || '-'}`,
            `👥 Actors     : ${data.Actors || '-'}`,
            `🌐 Language   : ${data.Language || '-'}`,
            `🌍 Country    : ${data.Country || '-'}`,
            `🎖️ Awards      : ${data.Awards || '-'}`,
            `💵 BoxOffice  : ${data.BoxOffice || '-'}`,
            `⭐ IMDb       : ${data.imdbRating || '-'} (${data.imdbVotes || '0'} votes)`,
            '',
            `📃 *Plot:* ${data.Plot || '-'}`
        ].join('\n')

        if (data.Poster && data.Poster !== 'N/A') {
            await m.reply({ image: { url: data.Poster }, caption })
        } else {
            await m.reply(caption)
        }
        m.react('✅')
    } catch (error) {
        console.error('[imdb]', error)
        m.react('❌')
        return m.reply('❌ Gagal mengambil data OMDb.')
    }
}

export { pluginConfig as config, handler }
