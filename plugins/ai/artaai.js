/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

/*
  @ Base: https://play.google.com/store/apps/details?id=ai.generated.art.maker.image.picture.photo.generator.painting
  @ Author: Shannz (Adapted for WA Bot)
  @ Note: Anime generator with many models.
*/

import axios from 'axios';
import FormData from 'form-data';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const arta = {
  signUp: async () => {
    const data = JSON.stringify({
      "clientType": "CLIENT_TYPE_ANDROID"
    });

    const config = {
      method: 'POST',
      url: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyB3-71wG0fIt0shj0ee4fvx1shcjJHGrrQ',
      headers: {
        'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; SM-G9650 Build/QD4A.200805.003)',
        'Connection': 'Keep-Alive',
        'Accept-Encoding': 'gzip',
        'Content-Type': 'application/json',
        'X-Android-Package': 'ai.generated.art.maker.image.picture.photo.generator.painting',
        'X-Android-Cert': 'ADC09FCA89A2CE4D0D139031A2A587FA87EE4155',
        'Accept-Language': 'en-, en-US',
        'X-Client-Version': 'Android/Fallback/X-1/FirebaseCore-Android',
        'X-Firebase-GMPID': '1:713239656559:android:f9e37753e9ee7324cb759a',
        'X-Firebase-Client': 'H4sIAAAAAAAAAKtWykhNLCpJSk0sKVayio7VUSpLLSrOzM9TslIyUqoFAFyivEQfAAAA'
      },
      data: data
    };

    try {
      const api = await axios.request(config);
      return {
        token: api.data.idToken,
        refresh_token: api.data.refreshToken
      };
    } catch (e) {
      console.error('[Arta SignUp Error]', e);
      throw new Error('Gagal mendaftar akun anonim Arta.');
    }
  },

  getStyles: async () => {
    try {
      const { data } = await axios.get('https://contentcdnhub.com/cms/content/apps/AIArtaAndroid/release/8/default/styles.json', { timeout: 5000 });
      if (!data || !Array.isArray(data.content)) {
        throw new Error('Struktur styles.json tidak sesuai ekspektasi');
      }

      const ttiStylesBlock = data.content.find(
        (block) => block.name === 'textToImage_styles_v4'
      );
      if (!ttiStylesBlock) {
        throw new Error('"textToImage_styles_v4" tidak ditemukan');
      }

      return ttiStylesBlock.items.map((item) => item.unique_id);
    } catch (err) {
      console.error(`Gagal memuat styles: ${err.message}`);
      return null;
    }
  },

  text2image: async (prompt, negativePrompt = '', style, token) => {
    const styles = await arta.getStyles();
    if (styles && !styles.includes(style)) {
      throw new Error(`Style "${style}" tidak tersedia. Sebagian style yang tersedia:\n• ${styles.slice(0, 10).join('\n• ')}`);
    }

    const data = new FormData();
    data.append('prompt', prompt);
    data.append('negative_prompt', negativePrompt);
    data.append('style', style);
    data.append('images_num', '1');
    data.append('cfg_scale', '7');
    data.append('steps', '30');
    data.append('aspect_ratio', '1:1');

    const config = {
      method: 'POST',
      url: 'https://img-gen-prod.ai-arta.com/api/v1/text2image',
      headers: {
        'User-Agent': 'AiArt/3.23.12 okHttp/4.12.0 Android Q',
        'Accept-Encoding': 'gzip',
        'authorization': token,
        ...data.getHeaders()
      },
      data: data
    };

    try {
      const api = await axios.request(config);
      return api.data;
    } catch (e) {
      console.error('[Arta Text2Image Error]', e);
      throw new Error('Gagal mengirimkan permintaan generate gambar ke Arta.');
    }
  },

  cekText2image: async (record_id, token, maxRetries = 20, interval = 3000) => {
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const config = {
          method: 'GET',
          url: `https://img-gen-prod.ai-arta.com/api/v1/text2image/${record_id}/status`,
          headers: {
            'User-Agent': 'AiArt/3.23.12 okHttp/4.12.0 Android Q',
            'Accept-Encoding': 'gzip',
            'authorization': token
          }
        };

        const api = await axios.request(config);
        const data = api.data;

        if (data.status === 'DONE') {
          return data.response;
        }

        await delay(interval);
        attempt++;
      } catch (e) {
        console.error(`Gagal cek status attempt ${attempt}: ${e.message}`);
        await delay(interval);
        attempt++;
      }
    }

    throw new Error(`Proses generate memakan waktu terlalu lama (Timeout).`);
  }
};

const pluginConfig = {
  name: 'arta',
  alias: ['artagen', 'artai', 'aiarta'],
  category: 'ai',
  description: 'Membuat gambar AI menggunakan Arta AI Generator',
  usage: '.arta Prompt | Style | Negative Prompt',
  example: '.arta beautiful anime girl with katana | Katayama-mix-xl | low quality, blurry',
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 15,
  energi: 2,
  isEnabled: true
};

async function handler(m, { sock, text, command, prefix }) {
  const pfx = prefix || m.prefix || '.';

  if (!text) {
    if (m.react) await m.react('❌');
    return m.reply(
      `*Format Salah!*\n\n` +
      `Gunakan format berikut:\n` +
      `\`${pfx}${command} Prompt | Style (Opsional) | Negative Prompt (Opsional)\`\n\n` +
      `*Contoh:*\n` +
      `\`${pfx}${command} cyber city in rain | Katayama-mix-xl | blurry, distorted\``
    );
  }

  const [prompt, styleInput, negPrompt] = text.split('|').map(s => s?.trim());

  if (!prompt) {
    if (m.react) await m.react('❌');
    return m.reply('❌ Prompt tidak boleh kosong!');
  }

  const selectedStyle = styleInput || 'Katayama-mix-xl';
  const negativePrompt = negPrompt || '';

  if (m.react) await m.react('⏳');

  try {
    const auth = await arta.signUp();
    const token = auth.token;

    const task = await arta.text2image(prompt, negativePrompt, selectedStyle, token);

    if (!task || !task.record_id) {
      if (m.react) await m.react('❌');
      return m.reply('❌ Gagal menginisialisasi pembuatan gambar.');
    }

    const result = await arta.cekText2image(task.record_id, token);

    if (!result || !Array.isArray(result) || result.length === 0) {
      if (m.react) await m.react('❌');
      return m.reply('❌ Gambar tidak ditemukan dari hasil pemrosesan.');
    }

    const imageUrl = result[0];

    if (m.react) await m.react('✅');

    const caption = 
      `🎨 *ARTA AI GENERATOR*\n\n` +
      `📝 *Prompt:* ${prompt}\n` +
      `🎨 *Style:* ${selectedStyle}\n` +
      (negativePrompt ? `🚫 *Negative:* ${negativePrompt}\n` : '');

    await sock.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: caption
    }, { quoted: m });

  } catch (error) {
    console.error('Arta Plugin Error:', error);
    if (m.react) await m.react('❌');
    await m.reply('❌ *GAGAL*\n\n> ' + error.message);
  }
}

export { pluginConfig as config, handler };
