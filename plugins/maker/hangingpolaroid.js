/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import sharp from 'sharp';

const pluginConfig = {
  name: 'hangingpolaroid',
  alias: ['polaroid2', 'pola', 'bingkai', 'frame'],
  category: 'maker',
  description: 'Membuat foto bingkai Polaroid gantung yang otomatis menyesuaikan ukuran foto asli (Responsive pure SVG)',
  usage: '.pola (Kirim/Reply Foto)',
  example: '.pola',
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

// Fungsi Generator Frame Polaroid Dinamis (Pure SVG)
function createResponsivePolaroidSVG(
  canvasWidth, canvasHeight, 
  photoWidth, photoHeight, 
  pX, pY, // Koordinat Top/Left Foto
  paddTop, paddSides, paddBot // Padding Kertas Polaroid
) {
  
  // Hitung Dimensi Kertas Polaroid berdasarkan ukuran foto asli
  const paperWidth = photoWidth + (paddSides * 2);
  const paperHeight = photoHeight + paddTop + paddBot;
  
  // Hitung Koordinat Kertas (Tengah canvas)
  const paperX = Math.round((canvasWidth - paperWidth) / 2);
  const paperY = pY - paddTop; // Dimulai tepat di atas foto

  // Hitung Koordinat Tali & Paku
  const spikeX = Math.round(canvasWidth / 2);
  const spikeY = Math.round(canvasHeight * 0.1); // Paku di 10% tinggi canvas

  const ropeLeftX = paperX + Math.round(paddSides / 2);
  const ropeRightX = paperX + paperWidth - Math.round(paddSides / 2);

  return Buffer.from(`
    <svg width="${canvasWidth}" height="${canvasHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Masking untuk Melubangi Kotak Foto -->
        <mask id="polaroid-mask">
          <rect width="${canvasWidth}" height="${canvasHeight}" fill="white" />
          <!-- Bagian yang dibuat transparan (Bolong) -->
          <rect x="${pX}" y="${pY}" width="${photoWidth}" height="${photoHeight}" fill="black" />
        </mask>

        <!-- Drop Shadow Bingkai Polaroid -->
        <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="10" dy="15" stdDeviation="10" flood-color="#000000" flood-opacity="0.5"/>
        </filter>
      </defs>

      <!-- 1. TALI & PAKU DINDING (Garis Vektor Dinamis) -->
      <g>
        <!-- Tali Kiri & Kanan (Mengarah ke kertas dinamis) -->
        <line x1="${spikeX}" y1="${spikeY}" x2="${ropeLeftX}" y2="${pY}" stroke="#dddddd" stroke-width="2.5" />
        <line x1="${spikeX}" y1="${spikeY}" x2="${ropeRightX}" y2="${pY}" stroke="#eeeeee" stroke-width="2" />
        
        <!-- Pin / Paku Dinding (Lingkaran 3D) -->
        <circle cx="${spikeX}" cy="${spikeY}" r="14" fill="#cfcfcf" filter="drop-shadow(2px 4px 5px rgba(0,0,0,0.4))" />
        <circle cx="${spikeX}" cy="${spikeY}" r="8" fill="#ffffff" />
        <circle cx="${spikeX - 2}" cy="${spikeY - 2}" r="3" fill="#ffffff" opacity="0.9" />
      </g>

      <!-- 2. BINGKAI POLAROID UTAMA (Punya Masking & Shadow) -->
      <g mask="url(#polaroid-mask)" filter="url(#shadow)">
        <!-- Kertas Utama Polaroid Vintage Krem / Off-White -->
        <rect x="${paperX}" y="${paperY}" width="${paperWidth}" height="${paperHeight}" fill="#f6f3eb" rx="5" />
        
        <!-- Detail Bevel / Garis Lipatan Bingkai -->
        <rect x="${pX - 5}" y="${pY - 5}" width="${photoWidth + 10}" height="${photoHeight + 10}" fill="#e2decb" rx="2" />
        <rect x="${pX}" y="${pY}" width="${photoWidth}" height="${photoHeight}" fill="#f6f3eb" />
      </g>

      <!-- 3. DETAIL BEVEL / SHADOW BAGIAN DALAM BINGKAI -->
      <!-- Inner shadow agar foto kelihatan "mengintip" -->
      <rect x="${pX}" y="${pY}" width="${photoWidth}" height="15" fill="#000000" opacity="0.25" />
      <rect x="${pX}" y="${pY}" width="15" height="${photoHeight}" fill="#000000" opacity="0.2" />
    </svg>
  `);
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
    await m.react('🖼️');

    const inputBuffer = await targetToDownload.download();
    if (!inputBuffer) throw new Error('Gagal mengunduh foto.');

    // 1. Ambil Dimensi Foto Asli User
    const metadata = await sharp(inputBuffer).metadata();
    const origW = metadata.width;
    const origH = metadata.height;
    
    // Tentukan Batasan Dimensi Foto di Canvas agar tidak kekecilan/kebesaran
    // (Misal maksimal lebar foto 500px, atau maksimal tinggi foto 600px)
    const MAX_PHOTO_W = 500;
    const MAX_PHOTO_H = 600;
    
    // Hitung Rasio & Tentukan Ukuran Akhir Foto di Canvas
    let targetPhotoW, targetPhotoH;
    const ratio = Math.min(MAX_PHOTO_W / origW, MAX_PHOTO_H / origH);
    targetPhotoW = Math.round(origW * ratio);
    targetPhotoH = Math.round(origH * ratio);

    // Tentukan Padding Polaroid (Proposional)
    const paddingSides = Math.round(targetPhotoW * 0.1); // Padding kiri kanan 10% lebar foto
    const paddingTop = paddingSides; 
    const paddingBottom = Math.round(targetPhotoH * 0.2); // Bagian bawah lebih lebar

    // 2. Tentukan Dimensi Canvas (Lebih besar dari kertas dinamis)
    const canvasWidth = targetPhotoW + (paddingSides * 2) + 200; // Kasih ruang kiri kanan
    const canvasHeight = targetPhotoH + paddingTop + paddingBottom + 300; // Kasih ruang tali/paku

    // Hitung Koordinat Tengah untuk menaruh Foto
    const pX = Math.round((canvasWidth - targetPhotoW) / 2);
    const pY = Math.round((canvasHeight - targetPhotoH) / 1.7); // Sedikit di bawah tengah agar ada ruang paku

    // 3. Latar Belakang Blur Estetik (Menyesuaikan Canvas Dinamis)
    const backgroundBlur = await sharp(inputBuffer)
      .resize(canvasWidth, canvasHeight, { fit: 'cover' })
      .blur(25) // Blur pekat
      .modulate({ brightness: 0.5, saturation: 1.1 }) // Gelapkan dikit
      .toBuffer();

    // 4. Ubah ukuran Foto User (PENTING: Jangan di-crop, biarkan proporsional)
    const resizedUserPhoto = await sharp(inputBuffer)
      .resize(targetPhotoW, targetPhotoH, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .modulate({ brightness: 0.98, saturation: 1.05 })
      .toBuffer();

    // 5. Generate Overlay Bingkai SVG Dinamis
    const polaroidFrameSVG = createResponsivePolaroidSVG(
      canvasWidth, canvasHeight, 
      targetPhotoW, targetPhotoH, 
      pX, pY, 
      paddingTop, paddingSides, paddingBottom
    );

    // 6. Komposisi Layering
    const processedBuffer = await sharp(backgroundBlur)
      .composite([
        // Layer 1: Foto User (Di-set tepat di balik lubang bingkai dinamis)
        { input: resizedUserPhoto, top: pY, left: pX },
        // Layer 2: Overlay Frame Polaroid Responsif, Paku, & Tali
        { input: polaroidFrameSVG, top: 0, left: 0 }
      ])
      .jpeg({ quality: 95 })
      .toBuffer();

    await sock.sendMessage(
      m.chat,
      { image: processedBuffer, caption: '🖼️ *Responsive Hanging Polaroid Frame*' },
      { quoted: m }
    );

    await m.react('✅');

  } catch (err) {
    console.error('[HANGING POLAROID ERROR]', err);
    await m.react('❌');
    await sock.sendMessage(
      m.chat,
      { text: `❌ *Gagal memproses gambar:* ${err.message}` },
      { quoted: m }
    );
  }
}

export default { config: pluginConfig, handler };
