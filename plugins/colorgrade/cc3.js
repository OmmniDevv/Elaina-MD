/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import sharp from 'sharp';

const pluginConfig = {
  name: 'cc3',
  alias: ['cc3', 'cyberpunk', 'neoncity'],
  category: 'colorgrade',
  description: 'Color Grading CC3 - Cyberpunk Neon Blue Pink',
  usage: '.cc3 (Kirim/Reply Foto)',
  example: '.cc3',
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
      .modulate({ brightness: 0.9, saturation: 1.5 })
      .linear(1.2, -10)
      .composite([{
        input: Buffer.from(`
          <svg width="${width}" height="${height}">
            <rect width="${width}" height="${height}" fill="#6600ff" opacity="0.15"/>
          </svg>
        `),
        blend: 'screen'
      }])
      .jpeg({ quality: 95 })
      .toBuffer();

    await sock.sendMessage(
      m.chat,
      { image: processedBuffer, caption: '✨ *Color Grade: CC3 (Cyberpunk Neon)*' },
      { quoted: m }
    );

    await m.react('✅');

  } catch (err) {
    console.error('[CC3 ERROR]', err);
    await m.react('❌');
    await sock.sendMessage(
      m.chat,
      { text: `❌ *Gagal memproses gambar:* ${err.message}` },
      { quoted: m }
    );
  }
}

export default { config: pluginConfig, handler };
