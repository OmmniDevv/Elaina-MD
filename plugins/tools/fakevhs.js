/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import sharp from 'sharp';

const pluginConfig = {
  name: 'fakevhs',
  alias: ['vhscam', 'retrovhs', 'handycam'],
  category: 'tools',
  description: 'Mengubah Foto menjadi Efek Kamera Retro VHS 90-an (Ultra Real)',
  usage: '.fakevhs [reply/kirim foto/dokumen foto/view once]',
  example: 'reply foto dengan .fakevhs',
  isEnabled: true,
};

function getRetroDateAndTimeString() {
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const now = new Date();
  const month = months[now.getMonth()];
  const day = String(now.getDate()).padStart(2, '0');
  
  let hours = now.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return {
    dateStr: `${month}. ${day} 1998`,
    timeStr: `${ampm} ${String(hours).padStart(2, '0')}:${minutes}`
  };
}

// SVG Overlay Camcorder VHS 90s (Detailing Tingkat Tinggi)
function generateVHSOverlay(width, height) {
  const baseScale = Math.min(width, height) / 1000;
  const { dateStr, timeStr } = getRetroDateAndTimeString();

  const fontMain = Math.round(32 * baseScale);
  const fontSub = Math.round(24 * baseScale);

  const topY = Math.round(60 * baseScale);
  const bottomY = Math.round(height - (60 * baseScale));

  // Scanlines kaset pita
  let scanlines = '';
  const step = Math.max(3, Math.round(5 * baseScale));
  for (let y = 0; y < height; y += step) {
    scanlines += `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="#000000" stroke-width="1" opacity="0.15"/>`;
  }

  // Noise static kaset (Glitch pita bawah)
  let staticGlitch = '';
  const glitchY = height - Math.round(45 * baseScale);
  for (let i = 0; i < 45; i++) {
    const rx = Math.floor(Math.random() * width);
    const rw = Math.floor(Math.random() * (width * 0.25)) + 10;
    const rh = Math.floor(Math.random() * (8 * baseScale)) + 1;
    const ry = glitchY + Math.floor(Math.random() * (35 * baseScale));
    const op = (Math.random() * 0.35 + 0.1).toFixed(2);
    staticGlitch += `<rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" fill="#FFFFFF" opacity="${op}" />`;
  }

  return Buffer.from(`
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <style>
      .vhs-text {
        font-family: 'Courier New', Courier, monospace, sans-serif;
        font-weight: bold;
        fill: #00FF66;
        letter-spacing: 2px;
        filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.8));
      }
      .vhs-white {
        font-family: 'Courier New', Courier, monospace, sans-serif;
        font-weight: bold;
        fill: #FFFFFF;
        letter-spacing: 2px;
        filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.8));
      }
    </style>

    <!-- SCANLINES / GARIS KASET -->
    ${scanlines}

    <!-- VIGNETTE HALUS DI PINGGIRAN -->
    <rect x="0" y="0" width="${width}" height="${height}" fill="none" stroke="#000000" stroke-width="${Math.round(20 * baseScale)}" opacity="0.3"/>

    <!-- VHS BOTTOM GLITCH NOISE -->
    ${staticGlitch}

    <!-- TOP LEFT: PLAY & SP -->
    <text x="${Math.round(50 * baseScale)}" y="${topY}" class="vhs-text" font-size="${fontMain}">PLAY &#9654;</text>
    <text x="${Math.round(50 * baseScale)}" y="${topY + Math.round(40 * baseScale)}" class="vhs-text" font-size="${fontSub}">SP - 0:00:00</text>

    <!-- TOP RIGHT: BATTERY & REC -->
    <g transform="translate(${Math.round(width - (220 * baseScale))}, ${topY - Math.round(20 * baseScale)})">
      <!-- ICON BATERAI -->
      <rect x="0" y="-12" width="${Math.round(30 * baseScale)}" height="${Math.round(18 * baseScale)}" fill="none" stroke="#FFFFFF" stroke-width="2"/>
      <rect x="${Math.round(30 * baseScale)}" y="-6" width="3" height="6" fill="#FFFFFF"/>
      <rect x="3" y="-9" width="${Math.round(18 * baseScale)}" height="${Math.round(12 * baseScale)}" fill="#00FF66"/>

      <!-- REC RED DOT -->
      <circle cx="${Math.round(55 * baseScale)}" cy="-3" r="${Math.round(8 * baseScale)}" fill="#FF0000" />
      <text x="${Math.round(72 * baseScale)}" y="${Math.round(5 * baseScale)}" class="vhs-white" font-size="${fontMain}">REC</text>
    </g>

    <!-- BOTTOM LEFT: RETRO DATE & TIME REALTIME -->
    <text x="${Math.round(50 * baseScale)}" y="${bottomY - Math.round(35 * baseScale)}" class="vhs-white" font-size="${fontMain}">${dateStr}</text>
    <text x="${Math.round(50 * baseScale)}" y="${bottomY}" class="vhs-white" font-size="${fontMain}">${timeStr}</text>

    <!-- BOTTOM RIGHT: AUTO TRACKING -->
    <text x="${Math.round(width - (220 * baseScale))}" y="${bottomY}" class="vhs-text" font-size="${fontSub}">AUTO TRACKING</text>
  </svg>
  `);
}

async function handler(m, { sock, prefix, command }) {
  try {
    const targetMsg = m.isQuoted ? m.quoted : m;
    const msg = targetMsg.message?.viewOnceMessageV2?.message || 
                targetMsg.message?.viewOnceMessage?.message || 
                targetMsg.message;

    const isImage = targetMsg.mtype === 'imageMessage' || 
                    msg?.imageMessage || 
                    (msg?.documentMessage?.mimetype && msg.documentMessage.mimetype.startsWith('image/'));

    if (!isImage) {
      return await sock.sendMessage(
        m.chat,
        { text: `⚠️ *Format Salah*\n\nReply/kirim media foto (Biasa, Sekali Lihat / View Once, atau Dokumen Foto) dengan caption *${prefix || '.'}${command}*` },
        { quoted: m }
      );
    }

    await m.react('⏰');

    const buffer = targetMsg.download ? await targetMsg.download() : await m.download();
    
    const image = sharp(buffer);
    const metadata = await image.metadata();
    const width = metadata.width || 1080;
    const height = metadata.height || 1080;

    const svgOverlay = generateVHSOverlay(width, height);

    // Proses kombinasi visual: Tinting Analog Warm + Sharp Contrast + VHS Overlay
    const resultBuffer = await image
      .modulate({
        saturation: 1.25,
        brightness: 1.02
      })
      .composite([{ input: svgOverlay, top: 0, left: 0 }])
      .jpeg({ quality: 95 })
      .toBuffer();

    await sock.sendMessage(
      m.chat,
      {
        image: resultBuffer,
        caption: `📼 *VHS Camcorder 1998 Retro Photo*`,
      },
      { quoted: m }
    );

    await m.react('✅');

  } catch (err) {
    console.error('[FAKEVHS ERROR]', err);
    await m.react('❌');
    await sock.sendMessage(
      m.chat,
      { text: `❌ *Gagal memproses foto*\n\n> ${err.message}` },
      { quoted: m }
    );
  }
}

export { pluginConfig as config, handler };
