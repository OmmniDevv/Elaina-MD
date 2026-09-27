/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';

const pluginConfig = {
  name: "fakesw",
  alias: ["fsw", "swfake"],
  category: "tools",
  description: "Generate gambar Fake Status WhatsApp",
  usage: ".fakesw sw|views|caption (Reply Gambar)",
  example: ".fakesw My Contact|1250|Lagi santai nih (dengan reply gambar)",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

// Fungsi bantuan upload gambar tanpa butuh package tambahan (murni Axios + Buffer)
async function uploadImageBuffer(buffer) {
  // Opsi 1: Tmpfiles via Axios
  try {
    const FormData = (await import('form-data')).default;
    const form = new FormData();
    form.append('file', buffer, { filename: 'image.jpg' });

    const res = await axios.post('https://tmpfiles.org/api/v1/upload', form, {
      headers: form.getHeaders()
    });
    if (res.data?.data?.url) {
      return res.data.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
    }
  } catch (e) {}

  // Opsi 2: Catbox via Axios
  try {
    const FormData = (await import('form-data')).default;
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', buffer, { filename: 'image.jpg' });

    const res = await axios.post('https://catbox.moe/user/api.php', form, {
      headers: form.getHeaders()
    });
    if (res.data && typeof res.data === 'string' && res.data.startsWith('http')) {
      return res.data.trim();
    }
  } catch (e) {}

  throw new Error('Semua server uploader gagal merespon.');
}

async function handler(m, { sock, text, command, prefix }) {
  if (!text || !text.includes('|')) {
    return await sock.sendMessage(
      m.chat,
      {
        text: `⚠️ *Format Salah*\n\n📌 *Reply Gambar di WA:*\nReply gambar dengan caption:\n\`${prefix || '.'}${command} Nama|Views|Caption\`\n\n📌 *Pakai URL Gambar:*\n\`${prefix || '.'}${command} Nama|URL_Gambar|Views|Caption\``,
      },
      { quoted: m }
    );
  }

  const args = text.split('|').map(a => a.trim());
  let sw, img, views, caption;

  // Jika user reply/kirim gambar langsung di WA
  if (m.isMedia || m.hasQuotedMedia) {
    if (args.length < 3) {
      return await sock.sendMessage(
        m.chat,
        { text: `⚠️ *Parameter Kurang*\nFormat reply gambar: \`${prefix || '.'}${command} Nama|Views|Caption\`` },
        { quoted: m }
      );
    }
    
    await m.react('⏰');
    
    try {
      const buffer = m.isQuoted ? await m.quoted.download() : await m.download();
      if (!buffer) throw new Error('Gagal mendownload gambar dari WA.');

      // Upload gambar menggunakan fungsi axios fallback
      img = await uploadImageBuffer(buffer);

      sw = args[0];
      views = args[1];
      caption = args[2];
    } catch (e) {
      console.error('[FAKESW UPLOAD ERROR]', e);
      await m.react('❌');
      return await sock.sendMessage(
        m.chat, 
        { text: `❌ *Gagal Upload Gambar:* ${e.message}` }, 
        { quoted: m }
      );
    }
  } else {
    // Format manual dengan URL
    if (args.length < 4) {
      return await sock.sendMessage(
        m.chat,
        { text: `⚠️ *Parameter Kurang*\nFormat manual: \`${prefix || '.'}${command} Nama|URL_Gambar|Views|Caption\`` },
        { quoted: m }
      );
    }
    sw = args[0];
    img = args[1];
    views = args[2];
    caption = args[3];
    await m.react('⏰');
  }

  try {
    const apiUrl = `https://kyzznekoo.zone.id/api/canvas/fakesw?sw=${encodeURIComponent(sw)}&img=${encodeURIComponent(img)}&views=${encodeURIComponent(views)}&caption=${encodeURIComponent(caption)}`;

    const response = await axios.get(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36',
        'Content-Type': 'application/json'
      },
      responseType: 'arraybuffer'
    });

    const imageBuffer = Buffer.from(response.data, 'binary');

    await sock.sendMessage(
      m.chat,
      {
        image: imageBuffer,
        mimetype: 'image/png',
        caption: `✅ *Fake SW Canvas Result*\n\n👤 *Nama:* ${sw}\n👁️ *Views:* ${views}\n💬 *Caption:* ${caption}`,
      },
      { quoted: m }
    );

    await m.react('✅');
  } catch (err) {
    console.error('[FAKE SW ERROR]', err);
    await m.react('❌');
    
    await sock.sendMessage(
      m.chat,
      {
        text: `❌ *Gagal membuat gambar Fake SW*\n\n> ${err.message}`,
      },
      { quoted: m }
    );
  }
}

export { pluginConfig as config, handler };
