/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import * as cheerio from 'cheerio'
import axios from 'axios'
async function wallpaperScraper(query) {
  try {
    const url = `https://www.wallpaperflare.com/search?wallpaper=${encodeURIComponent(query)}`

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    })

    const $ = cheerio.load(data)
    const results = []

    $('li[itemprop="associatedMedia"]').each((_, el) => {
      const title = $(el)
        .find('figcaption[itemprop="caption description"]')
        .text()
        .trim()

      const image = $(el).find("img").attr("data-src")
      const page = $(el).find('a[itemprop="url"]').attr("href")
      const resolution = $(el).find(".res").text().trim()

      if (image && page) {
        results.push({
          title,
          resolution,
          image,
          page: `https://www.wallpaperflare.com${page}`
        })
      }
    })

    if (!results.length) {
      return {
        success: false,
        message: "Tidak ditemukan wallpaper"
      }
    }

    return {
      success: true,
      total: results.length,
      results
    }

  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

export default wallpaperScraper