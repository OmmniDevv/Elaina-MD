/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import te from "../../src/lib/elaina-error.js";

const config = {
  name: "remini",
  alias: ["hd", "enhance", "upscale"],
  category: "tools",
  description: "Enhance gambar jadi HD",
  usage: ".remini (reply gambar)",
  example: ".remini",
  cooldown: 15,
  energi: 1,
  isEnabled: true,
};

/**
 * @credit: ren-offc
 * @noted: don't delete the credit
 */
async function photoihancer(imageBuffer, method = 1) {
  const blob = new Blob([imageBuffer], { type: 'image/jpeg' });

  const form = new FormData();
  form.set('method', String(method));
  form.set('is_pro_version', 'true');
  form.set('is_enhancing_more', 'false');
  form.set('max_image_size', 'high');
  form.set('file', blob, 'file.jpg');

  const res = await fetch('https://ihancer.com/api/enhance', {
    method: 'POST',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36',
      'Referer': 'https://ihancer.com/app/',
    },
    body: form,
  });

  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return Buffer.from(await res.arrayBuffer());
}

async function handler(m, { sock }) {
  const img = m.isImage || (m.quoted && m.quoted.type === "imageMessage");

  if (!img) {
    return m.reply(
      `*🪁 HD IMAGE*\n> Reply gambar yang mau dijernihkan\n\n\`\`\`${m.prefix}remini\`\`\``
    );
  }

  m.react("🕕");

  try {
    let b = m.quoted?.isMedia ? await m.quoted.download() : await m.download();

    const enhancedBuffer = await photoihancer(b);

    await sock.sendMessage(
      m.chat,
      {
        image: enhancedBuffer,
        caption: `✅ *BERHASIL*\n\n> Gambar telah berhasil di-upscale dan dijernihkan.`,
      },
      { quoted: m }
    );

    m.react("✅");
  } catch (err) {
    console.error("[HD Error]", err);
    m.react("❌");
    m.reply("Maaf, terjadi kesalahan saat memproses gambar dari scraper. Coba lagi nanti ya.");
  }
}

export { config, handler };
