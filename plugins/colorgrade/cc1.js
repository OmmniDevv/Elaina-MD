/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import sharp from 'sharp';

const pluginConfig = {
  name: 'cc1',
  alias: ['cc1', 'moody1', 'darkcinematic'],
  category: 'colorgrade',
  description: 'Color Grading CC1 - Dark Cinematic Moody',
  usage: '.cc1 (Kirim/Reply Foto)',
  example: '.cc1',
  isEnabled: true,
};

function getMediaMessageAndMime(m) {
  const target = m.isQuoted ? m.quoted : m;
  const msg = target?.message || target;

  const viewOnceMsg = msg?.viewOnceMessage?.message || msg?.viewOnceMessageV2?.message || msg?.viewOnceMessageV2Extension?.message;
  const actualMsg = viewOnceMsg || msg;

  const imageMsg = actualMsg?.imageMessage;
  const docMsg = actualMsg?.documentMessage || actualMsg?.documentWithCaptionMessage?.message?.documentMessage;

  let mimeType = imageMsg?.mimetype || docMsg?.mimetype || target?.mimetype;

  return {
    isImage: Boolean(mimeType && mimeType.startsWith('image/')),
    targetToDownload: target
  };
}

async function handler(m, { sock, prefix, command }) {
  const { isImage, targetToDownload } = getMediaMessageAndMime(m);

  if (!((m.isMedia || m.hasQuotedMedia) && isImage)) {
    return await sock.sendMessage(
      m.chat,
      { text: `⚠️ *Format Salah!*\n\n> Balas/Kirim foto dengan ketik *${prefix || '.'}${command}*` },
      { quoted: m }
    );
  }

  try {
    await m.react('🎨');

    const inputBuffer = await targetToDownload.download();
    if (!inputBuffer) throw new Error('Gagal mengunduh foto.');

    const metadata = await sharp(inputBuffer).metadata();
    const width = metadata.width || 800;
    const height = metadata.height || 1200;

    const processedBuffer = await sharp(inputBuffer)
      .modulate({ brightness: 0.85, saturation: 1.15 })
      .linear(1.25, -18)
      .composite([{
        input: Buffer.from(`
          <svg width="${width}" height="${height}">
            <rect width="${width}" height="${height}" fill="#001122" opacity="0.12"/>
            <defs>
              <radialGradient id="v" cx="50%" cy="50%" r="65%">
                <stop offset="40%" stop-color="#000000" stop-opacity="0" />
                <stop offset="100%" stop-color="#000000" stop-opacity="0.6" />
              </radialGradient>
            </defs>
            <rect width="${width}" height="${height}" fill="url(#v)" />
          </svg>
        `),
        blend: 'over'
      }])
      .jpeg({ quality: 95 })
      .toBuffer();

    await sock.sendMessage(
      m.chat,
      { image: processedBuffer, caption: '✨ *Color Grade: CC1 (Dark Cinematic)*' },
      { quoted: m }
    );

    await m.react('✅');

  } catch (err) {
    console.error('[CC1 ERROR]', err);
    await m.react('❌');
    await sock.sendMessage(
      m.chat,
      { text: `❌ *Gagal memproses gambar:* ${err.message}` },
      { quoted: m }
    );
  }
}

export default { config: pluginConfig, handler };
