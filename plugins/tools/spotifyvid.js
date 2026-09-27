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
  name: 'spotivid',
  alias: ['fakeplay', 'spotifyvid'],
  category: 'tools',
  description: 'Mengubah Video menjadi UI Pemutar Lagu Spotify (Custom Title & Artist + Dynamic Scale)',
  usage: '.spotivid Judul Lagu | Nama Artis',
  example: '.spotivid Sialan | Juicy Luicy\n.spotivid Virtual Insanity | Jamiroquai',
  isEnabled: true,
};

// Helper untuk mencegah error SVG jika ada karakter khusus (&, <, >, dll)
function escapeXml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// SVG UI Pemutar Spotify (Responsi & Otomatis Skala Ukuran Video)
function generateSpotifyUI(width, height, rawTitle, rawArtist) {
  const title = escapeXml(rawTitle);
  const artist = escapeXml(rawArtist);

  // Perhitungan skala dinamis berdasarkan resolusi video (100% responsif)
  const scale = Math.min(width, height) / 1000;
  
  const fontTitle = Math.round(32 * scale);
  const fontArtist = Math.round(22 * scale);
  const fontTime = Math.round(15 * scale);

  const topY = Math.round(70 * scale);
  const bottomY = Math.round(height - (70 * scale));
  const shadowHeight = Math.round(height * 0.55);

  return Buffer.from(`
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Gradasi Shadow Bawah Pekat untuk Keterbacaan -->
      <linearGradient id="bottomShadow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#000000" stop-opacity="0" />
        <stop offset="40%" stop-color="#000000" stop-opacity="0.5" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0.95" />
      </linearGradient>
    </defs>

    <style>
      .sp-title { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; fill: #FFFFFF; font-weight: 700; filter: drop-shadow(0px 2px 6px rgba(0,0,0,0.9)); }
      .sp-artist { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; fill: #B3B3B3; font-weight: 500; filter: drop-shadow(0px 2px 6px rgba(0,0,0,0.9)); }
      .sp-time { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; fill: #B3B3B3; font-weight: 400; filter: drop-shadow(0px 1px 3px rgba(0,0,0,0.8)); }
      .sp-top { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; fill: #FFFFFF; font-weight: 600; letter-spacing: 1.5px; filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.8)); }
    </style>

    <!-- Shadow Gradient Bawah -->
    <rect x="0" y="${height - shadowHeight}" width="${width}" height="${shadowHeight}" fill="url(#bottomShadow)" />

    <!-- TOP BAR (PLAYING FROM PLAYLIST) -->
    <g transform="translate(${Math.round(40 * scale)}, ${topY})">
      <!-- Arrow Left -->
      <path d="M 0 0 L ${Math.round(10 * scale)} -${Math.round(8 * scale)} L ${Math.round(10 * scale)} ${Math.round(8 * scale)} Z" fill="#FFFFFF"/>
      
      <!-- Teks Tengah -->
      <text x="${Math.round((width - 80 * scale) / 2)}" y="${Math.round(4 * scale)}" class="sp-top" font-size="${Math.round(14 * scale)}" text-anchor="middle">PLAYING FROM PLAYLIST</text>
    </g>

    <!-- CONTAINER CONTROLS & INFO (BOTTOM) -->
    <g transform="translate(${Math.round(40 * scale)}, ${bottomY})">
      
      <!-- JUDUL LAGU & ARTIS + HEART -->
      <g transform="translate(0, -${Math.round(135 * scale)})">
        <text x="0" y="0" class="sp-title" font-size="${fontTitle}">${title}</text>
        <text x="0" y="${Math.round(32 * scale)}" class="sp-artist" font-size="${fontArtist}">${artist}</text>
        
        <!-- GREEN HEART ICON -->
        <g transform="translate(${width - Math.round(110 * scale)}, -${Math.round(15 * scale)})">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#1DB954" transform="scale(${scale * 1.4})" />
        </g>
      </g>

      <!-- PROGRESS BAR SPOTIFY -->
      <g transform="translate(0, -${Math.round(70 * scale)})">
        <!-- BAR BACKGROUND -->
        <rect x="0" y="0" width="${width - Math.round(80 * scale)}" height="${Math.round(4 * scale)}" rx="${Math.round(2 * scale)}" fill="#535353" />
        <!-- BAR PROGRESS (Terisi 35%) -->
        <rect x="0" y="0" width="${Math.round((width - 80 * scale) * 0.35)}" height="${Math.round(4 * scale)}" rx="${Math.round(2 * scale)}" fill="#FFFFFF" />
        <circle cx="${Math.round((width - 80 * scale) * 0.35)}" cy="${Math.round(2 * scale)}" r="${Math.round(5 * scale)}" fill="#FFFFFF" />

        <!-- TIME INDICATORS -->
        <text x="0" y="${Math.round(20 * scale)}" class="sp-time" font-size="${fontTime}">1:24</text>
        <text x="${width - Math.round(80 * scale)}" y="${Math.round(20 * scale)}" class="sp-time" font-size="${fontTime}" text-anchor="end">-2:15</text>
      </g>

      <!-- PLAYER BUTTONS -->
      <g transform="translate(${Math.round((width - 80 * scale) / 2)}, 0)">
        <!-- SHUFFLE -->
        <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.45 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" fill="#1DB954" transform="translate(-${Math.round(150 * scale)}, -${Math.round(14 * scale)}) scale(${scale * 1.1})" />

        <!-- PREVIOUS -->
        <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" fill="#FFFFFF" transform="translate(-${Math.round(75 * scale)}, -${Math.round(16 * scale)}) scale(${scale * 1.25})" />

        <!-- PLAY BUTTON (WHITE CIRCLE) -->
        <circle cx="0" cy="0" r="${Math.round(26 * scale)}" fill="#FFFFFF" />
        <path d="M-5 -9 L9 0 L-5 9 Z" fill="#000000" transform="scale(${scale * 0.9})" />

        <!-- NEXT -->
        <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" fill="#FFFFFF" transform="translate(${Math.round(45 * scale)}, -${Math.round(16 * scale)}) scale(${scale * 1.25})" />

        <!-- REPEAT -->
        <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" fill="#B3B3B3" transform="translate(${Math.round(120 * scale)}, -${Math.round(14 * scale)}) scale(${scale * 1.1})" />
      </g>

    </g>
  </svg>
  `);
}

// Helper membaca metadata resolusi asli & Bitrate Video
function getVideoMetadata(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);
      const videoStream = metadata.streams.find((s) => s.codec_type === 'video');

      const fileSizeInBits = fs.statSync(filePath).size * 8;
      const duration = metadata.format.duration || 1;
      const realBitrate = Math.round(fileSizeInBits / duration);

      resolve({
        width: videoStream ? videoStream.width : 720,
        height: videoStream ? videoStream.height : 1280,
        bitrate: realBitrate,
      });
    });
  });
}

async function handler(m, { sock, prefix, command, args }) {
  if (!(m.isMedia || m.hasQuotedMedia)) {
    return await sock.sendMessage(
      m.chat,
      {
        text: `⚠️ *Format Salah*\n\nReply atau kirim video dengan caption:\n*${prefix || '.'}${command} Judul Lagu | Nama Artis*\n\nContoh:\n*${prefix || '.'}${command} Sialan | Juicy Luicy*`,
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
        { text: '❌ Media yang dikirim/direply harus berupa video!' },
        { quoted: m }
      );
    }

    // Parsing Custom Text (Judul | Artist)
    const textInput = args.join(' ');
    let title = 'Aesthetic Vibe';
    let artist = 'Unknown Artist';

    if (textInput.includes('|')) {
      const parts = textInput.split('|');
      title = parts[0].trim() || title;
      artist = parts[1].trim() || artist;
    } else if (textInput.trim().length > 0) {
      title = textInput.trim();
    }

    await m.react('⏰');

    const buffer = m.isQuoted ? await m.quoted.download() : await m.download();
    
    const time = Date.now();
    inputPath = path.join('.', `input_${time}.mp4`);
    overlayPath = path.join('.', `overlay_${time}.png`);
    outputPath = path.join('.', `output_${time}.mp4`);

    fs.writeFileSync(inputPath, buffer);

    // Ambil resolusi asli video
    const { width, height, bitrate } = await getVideoMetadata(inputPath);

    // Render Overlay persis sesuai resolusi asli video (width & height)
    const svgOverlay = generateSpotifyUI(width, height, title, artist);
    await sharp(svgOverlay).png().toFile(overlayPath);

    // Render Video + Overlay tanpa merubah resolusi/rasio asli video
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
          '-preset', 'slow',
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
        caption: `🎧 *Spotify Music Player Video*\n📌 *Judul:* ${title}\n👤 *Artis:* ${artist}`,
      },
      { quoted: m }
    );

    await m.react('✅');

  } catch (err) {
    console.error('[SPOTIVID ERROR]', err);
    await m.react('❌');
    await sock.sendMessage(
      m.chat,
      { text: `❌ *Gagal memproses video*\n\n> ${err.message}` },
      { quoted: m }
    );
  } finally {
    if (inputPath && fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    if (overlayPath && fs.existsSync(overlayPath)) fs.unlinkSync(overlayPath);
    if (outputPath && fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
  }
}

export { pluginConfig as config, handler };
