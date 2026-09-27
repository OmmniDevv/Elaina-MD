/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';

const pluginConfig = {
  name: 'fakecamvid',
  alias: ['paplivevid', 'vcam'],
  category: 'tools',
  description: 'Menimpa UI Kamera iOS iPhone di atas Video (Size Presisi + Ultra HD)',
  usage: '.fakecamvid [reply/kirim video/dokumen]',
  example: 'reply video atau dokumen video dengan .fakecamvid',
  isEnabled: true,
};

// SVG UI Kamera iPhone Klasik (Mode Video)
function generateIPhoneCameraUI(width, height) {
  const baseScale = Math.min(width, height) / 1000;
  
  const topBarY = Math.round(50 * baseScale);
  const flashBadgeY = Math.round(100 * baseScale);
  const shutterY = Math.round(height - (100 * baseScale));
  const modeY = Math.round(shutterY - (90 * baseScale));

  const fontMode = Math.round(22 * baseScale);
  const fontTop = Math.round(18 * baseScale);

  return Buffer.from(`
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <!-- TOP BAR -->
    <path d="M ${Math.round(width * 0.08)} ${topBarY - Math.round(12 * baseScale)} L ${Math.round(width * 0.065)} ${topBarY + Math.round(2 * baseScale)} H ${Math.round(width * 0.085)} L ${Math.round(width * 0.07)} ${topBarY + Math.round(14 * baseScale)} L ${Math.round(width * 0.095)} ${topBarY - Math.round(2 * baseScale)} H ${Math.round(width * 0.075)} Z" fill="#FFCC00"/>

    <text x="${Math.round(width * 0.28)}" y="${topBarY + Math.round(6 * baseScale)}" font-family="-apple-system, Arial, sans-serif" font-size="${fontTop}" font-weight="600" fill="#FFFFFF" text-anchor="middle">HDR</text>

    <g transform="translate(${Math.round(width * 0.5)}, ${topBarY})">
      <circle cx="0" cy="0" r="${Math.round(12 * baseScale)}" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="${Math.round(3 * baseScale)},${Math.round(3 * baseScale)}"/>
      <circle cx="0" cy="0" r="${Math.round(7 * baseScale)}" fill="none" stroke="#FFFFFF" stroke-width="1.5"/>
      <circle cx="0" cy="0" r="${Math.round(3 * baseScale)}" fill="#FFFFFF"/>
    </g>

    <g transform="translate(${Math.round(width * 0.72)}, ${topBarY})">
      <circle cx="0" cy="0" r="${Math.round(11 * baseScale)}" fill="none" stroke="#FFFFFF" stroke-width="2"/>
      <path d="M 0 -${Math.round(6 * baseScale)} L 0 0 L ${Math.round(5 * baseScale)} 0" stroke="#FFFFFF" stroke-width="2" fill="none"/>
      <circle cx="0" cy="-${Math.round(11 * baseScale)}" r="${Math.round(2 * baseScale)}" fill="#FFFFFF"/>
    </g>

    <g transform="translate(${Math.round(width * 0.92)}, ${topBarY})">
      <circle cx="-${Math.round(5 * baseScale)}" cy="-${Math.round(4 * baseScale)}" r="${Math.round(8 * baseScale)}" fill="none" stroke="#FFFFFF" stroke-width="1.5"/>
      <circle cx="${Math.round(5 * baseScale)}" cy="-${Math.round(4 * baseScale)}" r="${Math.round(8 * baseScale)}" fill="none" stroke="#FFFFFF" stroke-width="1.5"/>
      <circle cx="0" cy="${Math.round(4 * baseScale)}" r="${Math.round(8 * baseScale)}" fill="none" stroke="#FFFFFF" stroke-width="1.5"/>
    </g>

    <g transform="translate(${Math.round(width * 0.5)}, ${flashBadgeY})">
      <rect x="-${Math.round(22 * baseScale)}" y="-${Math.round(12 * baseScale)}" width="${Math.round(44 * baseScale)}" height="${Math.round(24 * baseScale)}" rx="${Math.round(3 * baseScale)}" fill="#FFCC00"/>
      <path d="M 0 -${Math.round(7 * baseScale)} L -${Math.round(4 * baseScale)} ${Math.round(1 * baseScale)} H 0 L -${Math.round(2 * baseScale)} ${Math.round(8 * baseScale)} L ${Math.round(4 * baseScale)} -${Math.round(1 * baseScale)} H 0 Z" fill="#000000"/>
    </g>

    <!-- MODE TEXT (VIDEO warna Kuning) -->
    <g transform="translate(0, ${modeY})" font-family="-apple-system, BlinkMacSystemFont, Arial, sans-serif" font-size="${fontMode}" font-weight="500" letter-spacing="1">
      <text x="${Math.round(width * 0.14)}" y="0" fill="#FFFFFF" text-anchor="middle">SLO-MO</text>
      <text x="${Math.round(width * 0.32)}" y="0" fill="#FFCC00" font-weight="600" text-anchor="middle">VIDEO</text>
      <text x="${Math.round(width * 0.50)}" y="0" fill="#FFFFFF" text-anchor="middle">PHOTO</text>
      <text x="${Math.round(width * 0.69)}" y="0" fill="#FFFFFF" text-anchor="middle">SQUARE</text>
      <text x="${Math.round(width * 0.86)}" y="0" fill="#FFFFFF" text-anchor="middle">PANO</text>
    </g>

    <!-- SHUTTER BUTTON (Red Dot Video) -->
    <g transform="translate(0, ${shutterY})">
      <circle cx="${Math.round(width / 2)}" cy="0" r="${Math.round(48 * baseScale)}" fill="none" stroke="#FFFFFF" stroke-width="${Math.max(3, Math.round(4 * baseScale))}"/>
      <circle cx="${Math.round(width / 2)}" cy="0" r="${Math.round(41 * baseScale)}" fill="#FF3B30"/>

      <g transform="translate(${Math.round(width * 0.90)}, 0)">
        <rect x="-${Math.round(20 * baseScale)}" y="-${Math.round(14 * baseScale)}" width="${Math.round(40 * baseScale)}" height="${Math.round(28 * baseScale)}" rx="${Math.round(5 * baseScale)}" fill="none" stroke="#FFFFFF" stroke-width="2"/>
        <path d="M -${Math.round(6 * baseScale)} -${Math.round(14 * baseScale)} L -${Math.round(3 * baseScale)} -${Math.round(18 * baseScale)} H ${Math.round(3 * baseScale)} L ${Math.round(6 * baseScale)} -${Math.round(14 * baseScale)}" fill="none" stroke="#FFFFFF" stroke-width="2"/>
        <path d="M -${Math.round(8 * baseScale)} -${Math.round(2 * baseScale)} A ${Math.round(8 * baseScale)} ${Math.round(8 * baseScale)} 0 0 1 ${Math.round(8 * baseScale)} -${Math.round(2 * baseScale)}" stroke="#FFFFFF" stroke-width="2" fill="none"/>
        <path d="M ${Math.round(8 * baseScale)} ${Math.round(2 * baseScale)} A ${Math.round(8 * baseScale)} ${Math.round(8 * baseScale)} 0 0 1 -${Math.round(8 * baseScale)} ${Math.round(2 * baseScale)}" stroke="#FFFFFF" stroke-width="2" fill="none"/>
      </g>
    </g>
  </svg>
  `);
}

// Helper membaca metadata & menghitung Bitrate Asli File
function getVideoMetadata(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);
      const videoStream = metadata.streams.find((s) => s.codec_type === 'video');

      const fileSizeInBits = fs.statSync(filePath).size * 8;
      const duration = metadata.format.duration || 1;
      
      // Kalkulasi Bitrate Riil
      const realBitrate = Math.round(fileSizeInBits / duration);

      resolve({
        width: videoStream ? videoStream.width : 720,
        height: videoStream ? videoStream.height : 1280,
        bitrate: realBitrate,
      });
    });
  });
}

async function handler(m, { sock, prefix, command }) {
  if (!(m.isMedia || m.hasQuotedMedia)) {
    return await sock.sendMessage(
      m.chat,
      {
        text: `⚠️ *Format Salah*\n\nReply atau kirim video (bisa video biasa atau dokumen video) dengan caption *${prefix || '.'}${command}*`,
      },
      { quoted: m }
    );
  }

  let inputPath = null;
  let overlayPath = null;
  let outputPath = null;

  try {
    let mimeType = m.isQuoted 
      ? (m.quoted.mimetype || m.quoted.message?.documentMessage?.mimetype) 
      : (m.mimetype || m.message?.documentMessage?.mimetype);

    if (!mimeType || !mimeType.startsWith('video/')) {
      return await sock.sendMessage(
        m.chat,
        { text: '❌ Media yang dikirim/direply harus berupa video atau dokumen video mp4!' },
        { quoted: m }
      );
    }

    await m.react('⏰');

    const buffer = m.isQuoted ? await m.quoted.download() : await m.download();
    
    const time = Date.now();
    inputPath = path.join('.', `input_${time}.mp4`);
    overlayPath = path.join('.', `overlay_${time}.png`);
    outputPath = path.join('.', `output_${time}.mp4`);

    fs.writeFileSync(inputPath, buffer);

    const { width, height, bitrate } = await getVideoMetadata(inputPath);

    const svgOverlay = generateIPhoneCameraUI(width, height);
    await sharp(svgOverlay).png().toFile(overlayPath);

    // KUNCI RAHSIA KONSISTENSI SIZE & HIGH QUALITY:
    // Mengunci Bitrate Target (b:v) persis sebesar bitrate asli file
    // + Memberi toleransi maxrate 10% biar video HD (23MB) gak turun & video buram tetap tajam
    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(inputPath)
        .input(overlayPath)
        .outputOptions([
          '-filter_complex', '[0:v][1:v]overlay=0:0', 
          '-c:v', 'libx264',
          '-b:v', `${bitrate}`,
          '-minrate', `${bitrate}`,
          '-maxrate', `${Math.round(bitrate * 1.05)}`,
          '-bufsize', `${Math.round(bitrate * 2)}`,
          '-preset', 'slow',          // Preset slow memaksimalkan ketajaman tanpa buang-buang MB
          '-movflags', '+faststart',
          '-c:a', 'copy',
          '-pix_fmt', 'yuv420p'
        ])
        .output(outputPath)
        .on('end', resolve)
        .on('error', reject)
        .run();
    });

    const videoBuffer = fs.readFileSync(outputPath);

    await sock.sendMessage(
      m.chat,
      {
        video: videoBuffer,
        mimetype: 'video/mp4',
        caption: `🎥 *iPhone Video Camera Viewfinder*`,
      },
      { quoted: m }
    );

    await m.react('✅');

  } catch (err) {
    console.error('[FAKECAMVID ERROR]', err);
    await m.react('❌');
    await sock.sendMessage(
      m.chat,
      {
        text: `❌ *Gagal memproses video*\n\n> ${err.message}`,
      },
      { quoted: m }
    );
  } finally {
    if (inputPath && fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    if (overlayPath && fs.existsSync(overlayPath)) fs.unlinkSync(overlayPath);
    if (outputPath && fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
  }
}

export { pluginConfig as config, handler };
