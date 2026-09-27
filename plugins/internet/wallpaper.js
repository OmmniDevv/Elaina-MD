/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

/*
  @ Base: https://play.google.com/store/apps/details?id=com.wallpaperscraft.wallpaper
  @ Author: Shannz (Adapted for WA Bot)
  @ Note: Search and get wallpaper from Wallcraft application.
*/

import axios from 'axios';

const wallcraft = {
  search: async (query) => {
    const config = {
      method: 'GET',
      url: `https://api-uc.wallpaperscraft.com/images?screen%5Bwidth%5D=720&screen%5Bheight%5D=1280&lang=en&limit=60&types%5B%5D=free&types%5B%5D=private&offset=0&query=${encodeURIComponent(query)}&cost_variant=android_cost_1&sort=rating&uploader_types%5B%5D=wlc&uploader_types%5B%5D=user&uploader_types%5B%5D=wlc_ai_art`,
      headers: {
        'User-Agent': 'wallpaperscraft-android/3.56.0',
        'Connection': 'Keep-Alive',
        'Accept-Encoding': 'gzip',
        'X-APP-VERSION': 'Android-35600',
        'X-AppCheck-Token': ''
      }
    };
    try {
      const response = await axios.request(config);
      const items = response.data?.items || [];
      return items.map(item => ({
        id: item.id,
        author: item.author,
        description: item.description,
        rating: item.rating,
        downloads: item.downloads,
        favorites: item.favorites,
        tags: item.tags,
        uploaded_at: item.uploaded_at,
        uploader_type: item.uploader_type,
        urls: {
          adapted: item.variations?.adapted?.url || null,
          adapted_landscape: item.variations?.adapted_landscape?.url || null,
          original: item.variations?.original?.url || null,
          preview_small: item.variations?.preview_small?.url || null
        }
      }));
    } catch (e) {
      console.error('[Wallcraft Search Error]', e);
      return [];
    }
  },

  searchByRating: async (type) => {
    const typeAliases = {
      'new': 'new_users_x',
      'popular': 'popular_x',
      'top_rated': 'total_x'
    };

    const mappedType = typeAliases[type.toLowerCase()];
    if (!mappedType) return [];

    const config = {
      method: 'GET',
      url: `https://users-data-api.wallpaperscraft.com/rating?screen%5Bwidth%5D=720&screen%5Bheight%5D=1280&rating_type=${mappedType}`,
      headers: {
        'User-Agent': 'wallpaperscraft-android/3.56.0',
        'Connection': 'Keep-Alive',
        'Accept-Encoding': 'gzip',
        'Authorization': 'Bearer null',
        'X-APP-VERSION': 'Android-35600',
        'X-AppCheck-Token': ''
      }
    };

    try {
      const response = await axios.request(config);
      return response.data;
    } catch (e) {
      console.error('[Wallcraft Rating Error]', e);
      return [];
    }
  },

  searchByCategory: async (category) => {
    const categoryUrls = {
      'video': 'https://api-uc.wallpaperscraft.com/live-images?screen%5Bwidth%5D=720&screen%5Bheight%5D=1280&lang=en&sort=rating&offset=0&limit=10&age=21&content_type=android_video&cost_variant=android_cost_1',
      'parallax': 'https://api-uc.wallpaperscraft.com/parallax-images?resolution=hd&sort=rating&offset=0&limit=60&age=21&cost_variant=android_cost_1',
      'ai_art': 'https://api-uc.wallpaperscraft.com/images?screen%5Bwidth%5D=720&screen%5Bheight%5D=1280&lang=en&limit=60&types%5B%5D=private&offset=0&sort=rating&cost_variant=android_cost_1&age=21&uploader_types%5B%5D=wlc_ai_art',
      'exclusive': 'https://api-uc.wallpaperscraft.com/images?screen%5Bwidth%5D=720&screen%5Bheight%5D=1280&lang=en&limit=60&types%5B%5D=private&offset=0&sort=rating&cost_variant=android_cost_1&age=21&uploader_types%5B%5D=wlc'
    };

    const url = categoryUrls[category.toLowerCase()];
    if (!url) return [];

    const config = {
      method: 'GET',
      url: url,
      headers: {
        'User-Agent': 'wallpaperscraft-android/3.56.0',
        'Connection': 'Keep-Alive',
        'Accept-Encoding': 'gzip',
        'X-APP-VERSION': 'Android-35600',
        'X-AppCheck-Token': ''
      }
    };

    try {
      const response = await axios.request(config);
      if (category === 'video' || category === 'parallax') {
        return response.data;
      } else {
        const items = response.data?.items || [];
        return items.map(item => ({
          id: item.id,
          author: item.author,
          description: item.description,
          rating: item.rating,
          downloads: item.downloads,
          favorites: item.favorites,
          tags: item.tags,
          uploaded_at: item.uploaded_at,
          uploader_type: item.uploader_type,
          urls: {
            adapted: item.variations?.adapted?.url || null,
            adapted_landscape: item.variations?.adapted_landscape?.url || null,
            original: item.variations?.original?.url || null,
            preview_small: item.variations?.preview_small?.url || null
          }
        }));
      }
    } catch (e) {
      console.error('[Wallcraft Category Error]', e);
      return [];
    }
  }
};

const pluginConfig = {
  name: 'wallcraft',
  alias: ['wallcraftsearch', 'walcraft', 'wallpaperscraft'],
  category: 'internet',
  description: 'Mencari dan mengunduh wallpaper HD dari Wallcraft',
  usage: '.wallcraft <query>',
  example: '.wallcraft cyber city',
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true
};

async function handler(m, { sock, text, command, prefix }) {
  const pfx = prefix || m.prefix || '.';

  if (!text) {
    if (m.react) await m.react('❌');
    return m.reply(
      `*Format Salah!*\n\n` +
      `Gunakan perintah berikut:\n` +
      `\`${pfx}${command} <pencarian>\`\n\n` +
      `*Contoh:*\n` +
      `\`${pfx}${command} anime girl\``
    );
  }

  if (m.react) await m.react('⏳');

  try {
    const results = await wallcraft.search(text);

    if (!results || results.length === 0) {
      if (m.react) await m.react('❌');
      return m.reply(`❌ Wallpaper untuk kata kunci "*${text}*" tidak ditemukan.`);
    }

    // Ambil 1 gambar secara acak dari hasil pencarian
    const randomItem = results[Math.floor(Math.random() * results.length)];
    const imgUrl = randomItem.urls.original || randomItem.urls.adapted || randomItem.urls.preview_small;

    if (!imgUrl) {
      if (m.react) await m.react('❌');
      return m.reply('❌ URL gambar tidak valid atau tidak dapat dimuat.');
    }

    if (m.react) await m.react('✅');

    const caption = 
      `🖼️ *WALLCRAFT WALLPAPER*\n\n` +
      `📌 *Query:* ${text}\n` +
      `👤 *Author:* ${randomItem.author || 'Unknown'}\n` +
      `⭐ *Rating:* ${randomItem.rating || '-'}\n` +
      `📥 *Downloads:* ${randomItem.downloads || '-'}\n` +
      `🏷️ *Tags:* ${Array.isArray(randomItem.tags) ? randomItem.tags.join(', ') : '-'}`;

    await sock.sendMessage(m.chat, {
      image: { url: imgUrl },
      caption: caption
    }, { quoted: m });

  } catch (error) {
    console.error('Wallcraft Plugin Error:', error);
    if (m.react) await m.react('❌');
    await m.reply('❌ *GAGAL*\n\n> ' + error.message);
  }
}

export { pluginConfig as config, handler };
