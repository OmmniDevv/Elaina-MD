/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://www.tokusatsuindo.com';
const AJAX_URL = `${BASE_URL}/wp-admin/admin-ajax.php`;
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Referer': `${BASE_URL}/`
};

const pluginConfig = {
  name: 'tokusatsu',
  alias: ['toku'],
  category: 'anime',
  description: 'Cari dan lihat data serial/episode tokusatsu dari TokusatsuIndo',
  usage: '.tokusatsu <judul atau link>',
  example: '.tokusatsu kamen rider\n.tokusatsu https://www.tokusatsuindo.com/...',
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true
};

async function fetchHtml(url) {
  const { data } = await axios.get(url, { headers: HEADERS, timeout: 20000 });
  return data;
}

async function searchSeries(query) {
  const html = await fetchHtml(`${BASE_URL}/?s=${encodeURIComponent(query)}`);
  const $ = cheerio.load(html);
  const results = [];
  $('article.item-infinite').each((_, el) => {
    const title = $(el).find('h2.entry-title a').text().trim();
    const url = $(el).find('h2.entry-title a').attr('href');
    const categories = $(el).find('.gmr-movie-on a').map((__, cat) => $(cat).text().trim()).get();
    if (title && url) results.push({ title, url, categories });
  });
  return results.slice(0, 20);
}

async function fetchStreamLink(postId, tabName, refererUrl) {
  const body = `action=muvipro_player_content&tab=${encodeURIComponent(tabName)}&post_id=${encodeURIComponent(postId)}`;
  const { data } = await axios.post(AJAX_URL, body, {
    timeout: 20000,
    headers: {
      ...HEADERS,
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Referer': refererUrl || BASE_URL
    }
  });
  const $ = cheerio.load(data);
  return $('iframe').first().attr('src') || null;
}

async function scrapeDetail(targetUrl) {
  const html = await fetchHtml(targetUrl);
  const $ = cheerio.load(html);
  const title = $('h1.entry-title').text().trim() || $('h1').first().text().trim() || $('title').text().trim();
  const playerContainer = $('#muvipro_player_content_id');

  if (playerContainer.length) {
    const postId = playerContainer.attr('data-id');
    const servers = [];
    $('ul.muvipro-player-tabs > li > a').each((i, el) => {
      const name = $(el).text().trim();
      const href = $(el).attr('href') || `#p${i + 1}`;
      servers.push({ name, tab: href.replace(/^#/, '') });
    });
    const stream = servers.length && postId ? await fetchStreamLink(postId, servers[0].tab, targetUrl).catch(() => null) : null;
    const info = $('.entry-content p').map((_, el) => $(el).text().trim()).get().filter(Boolean).join('\n\n');
    return { type: 'episode', title, info, stream, targetUrl };
  }

  const cover = $('.content-thumbnail img, .entry-content img').first().attr('src') || $('.content-thumbnail img, .entry-content img').first().attr('data-src') || '';
  const synopsis = $('.entry-content p').map((_, el) => $(el).text().trim()).get()
    .filter(text => text.length > 40 && !/var |CDATA/i.test(text)).join('\n\n');
  const episodes = [];
  const pushEpisode = (titleText, url) => {
    if (!url || !titleText) return;
    if (!episodes.some(ep => ep.url === url)) episodes.push({ title: titleText, url });
  };
  $('.entry-content ul.lcp_catlist li a').each((_, el) => pushEpisode($(el).text().trim(), $(el).attr('href')));
  if (!episodes.length) {
    $('.entry-content a').each((_, el) => {
      const text = $(el).text().trim();
      const href = $(el).attr('href') || '';
      if (href && !/\.(?:jpg|jpeg|png|webp)$/i.test(href) && !href.includes('/category/') && !href.includes('/tag/') && /(episode|eps|\d+)/i.test(text)) {
        pushEpisode(text, href);
      }
    });
  }
  return { type: 'series', title, cover, synopsis, episodes: episodes.slice(-90) };
}

async function handler(m, { sock, text }) {
  if (!text?.trim()) return m.reply('❌ Masukkan judul tokusatsu atau link TokusatsuIndo.\n\nContoh:\n.tokusatsu kamen rider\n.tokusatsu https://www.tokusatsuindo.com/...');
  try {
    const input = text.trim();
    let target = input;
    if (!/tokusatsuindo\.com/i.test(input)) {
      const results = await searchSeries(input);
      if (!results.length) return m.reply(`❌ Judul tidak ditemukan untuk: ${input}`);
      const lines = results.map((r, i) => `${i + 1}. ${r.title}${r.categories.length ? ` — ${r.categories.join(', ')}` : ''}\n${r.url}`).join('\n\n');
      return m.reply(`🔍 *Hasil TokusatsuIndo*\n\n${lines}\n\nBalas/kirim lagi dengan salah satu URL di atas untuk membuka detail.`);
    }

    const detail = await scrapeDetail(target);
    if (detail.type === 'episode') {
      return m.reply(`🎬 *${detail.title || 'Tokusatsu Episode'}*\n\n${detail.info || 'Tidak ada deskripsi.'}\n\n🔗 Player: ${detail.stream || 'Tidak ditemukan'}\n🌐 Sumber: ${detail.targetUrl}`);
    }

    let caption = `📺 *${detail.title || 'Tokusatsu'}*\n\n${detail.synopsis || 'Sinopsis tidak ditemukan.'}\n\n`;
    caption += detail.episodes.length
      ? detail.episodes.map((ep, i) => `${i + 1}. ${ep.title}\n${ep.url}`).join('\n\n')
      : '❌ Episode tidak ditemukan.';
    caption += `\n\n🌐 Sumber: ${target}`;
    if (detail.cover) {
      try {
        return await sock.sendMessage(m.chat, { image: { url: detail.cover }, caption }, { quoted: m });
      } catch {}
    }
    return m.reply(caption);
  } catch (err) {
    console.error('[tokusatsu]', err);
    return m.reply(`❌ Gagal mengambil data TokusatsuIndo: ${err.message}`);
  }
}

export { pluginConfig as config, handler };
