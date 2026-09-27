/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import sharp from 'sharp';

const pluginConfig = {
  name: 'fakecam',
  alias: ['paplive', 'fakekamera', 'iphonecam'],
  category: 'tools',
  description: 'Menimpa UI Kamera iOS iPhone Klasik Presisi',
  usage: '.fakecam (reply/kirim foto)',
  example: '.fakecam',
  isEnabled: true,
};

/**
 * SVG UI Kamera iPhone Klasik Presisi Sesuai Screenshot
 */
function generateIPhoneCameraUI(width, height) {
  const baseScale = Math.min(width, height) / 1000;
  
  // Posisi Elemen Vertical
  const topBarY = Math.round(50 * baseScale);
  const flashBadgeY = Math.round(100 * baseScale);
  const shutterY = Math.round(height - (100 * baseScale));
  const modeY = Math.round(shutterY - (90 * baseScale));

  // Font Sizes & Spacing
  const fontMode = Math.round(22 * baseScale);
  const fontTop = Math.round(18 * baseScale);

  return Buffer.from(`
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <!-- 1. TOP BAR IPHONE -->
    <!-- Flash Petir Kuning (Left) -->
    <path d="M ${Math.round(width * 0.08)} ${topBarY - Math.round(12 * baseScale)} L ${Math.round(width * 0.065)} ${topBarY + Math.round(2 * baseScale)} H ${Math.round(width * 0.085)} L ${Math.round(width * 0.07)} ${topBarY + Math.round(14 * baseScale)} L ${Math.round(width * 0.095)} ${topBarY - Math.round(2 * baseScale)} H ${Math.round(width * 0.075)} Z" fill="#FFCC00"/>

    <!-- HDR Text -->
    <text x="${Math.round(width * 0.28)}" y="${topBarY + Math.round(6 * baseScale)}" font-family="-apple-system, Arial, sans-serif" font-size="${fontTop}" font-weight="600" fill="#FFFFFF" text-anchor="middle">HDR</text>

    <!-- Live Photo Icon (Center) -->
    <g transform="translate(${Math.round(width * 0.5)}, ${topBarY})">
      <circle cx="0" cy="0" r="${Math.round(12 * baseScale)}" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="${Math.round(3 * baseScale)},${Math.round(3 * baseScale)}"/>
      <circle cx="0" cy="0" r="${Math.round(7 * baseScale)}" fill="none" stroke="#FFFFFF" stroke-width="1.5"/>
      <circle cx="0" cy="0" r="${Math.round(3 * baseScale)}" fill="#FFFFFF"/>
    </g>

    <!-- Timer Icon -->
    <g transform="translate(${Math.round(width * 0.72)}, ${topBarY})">
      <circle cx="0" cy="0" r="${Math.round(11 * baseScale)}" fill="none" stroke="#FFFFFF" stroke-width="2"/>
      <path d="M 0 -${Math.round(6 * baseScale)} L 0 0 L ${Math.round(5 * baseScale)} 0" stroke="#FFFFFF" stroke-width="2" fill="none"/>
      <circle cx="0" cy="-${Math.round(11 * baseScale)}" r="${Math.round(2 * baseScale)}" fill="#FFFFFF"/>
    </g>

    <!-- Filter 3 Circles (Right) -->
    <g transform="translate(${Math.round(width * 0.92)}, ${topBarY})">
      <circle cx="-${Math.round(5 * baseScale)}" cy="-${Math.round(4 * baseScale)}" r="${Math.round(8 * baseScale)}" fill="none" stroke="#FFFFFF" stroke-width="1.5"/>
      <circle cx="${Math.round(5 * baseScale)}" cy="-${Math.round(4 * baseScale)}" r="${Math.round(8 * baseScale)}" fill="none" stroke="#FFFFFF" stroke-width="1.5"/>
      <circle cx="0" cy="${Math.round(4 * baseScale)}" r="${Math.round(8 * baseScale)}" fill="none" stroke="#FFFFFF" stroke-width="1.5"/>
    </g>

    <!-- Yellow Flash Active Badge -->
    <g transform="translate(${Math.round(width * 0.5)}, ${flashBadgeY})">
      <rect x="-${Math.round(22 * baseScale)}" y="-${Math.round(12 * baseScale)}" width="${Math.round(44 * baseScale)}" height="${Math.round(24 * baseScale)}" rx="${Math.round(3 * baseScale)}" fill="#FFCC00"/>
      <path d="M 0 -${Math.round(7 * baseScale)} L -${Math.round(4 * baseScale)} ${Math.round(1 * baseScale)} H 0 L -${Math.round(2 * baseScale)} ${Math.round(8 * baseScale)} L ${Math.round(4 * baseScale)} -${Math.round(1 * baseScale)} H 0 Z" fill="#000000"/>
    </g>

    <!-- 2. MODE CAMERA (ALL CAPS & YELLOW PHOTO) -->
    <g transform="translate(0, ${modeY})" font-family="-apple-system, BlinkMacSystemFont, Arial, sans-serif" font-size="${fontMode}" font-weight="500" letter-spacing="1">
      <text x="${Math.round(width * 0.14)}" y="0" fill="#FFFFFF" text-anchor="middle">SLO-MO</text>
      <text x="${Math.round(width * 0.32)}" y="0" fill="#FFFFFF" text-anchor="middle">VIDEO</text>
      
      <!-- PHOTO in iOS Golden Yellow -->
      <text x="${Math.round(width * 0.50)}" y="0" fill="#FFCC00" font-weight="600" text-anchor="middle">PHOTO</text>
      
      <text x="${Math.round(width * 0.69)}" y="0" fill="#FFFFFF" text-anchor="middle">SQUARE</text>
      <text x="${Math.round(width * 0.86)}" y="0" fill="#FFFFFF" text-anchor="middle">PANO</text>
    </g>

    <!-- 3. BOTTOM SHUTTER & FLIP CAMERA -->
    <g transform="translate(0, ${shutterY})">
      <!-- Outer Ring (White Ring) -->
      <circle cx="${Math.round(width / 2)}" cy="0" r="${Math.round(48 * baseScale)}" fill="none" stroke="#FFFFFF" stroke-width="${Math.max(3, Math.round(4 * baseScale))}"/>
      <!-- Inner Solid White Circle -->
      <circle cx="${Math.round(width / 2)}" cy="0" r="${Math.round(41 * baseScale)}" fill="#FFFFFF"/>

      <!-- Switch Camera Icon (Camera Box + Arrows) -->
      <g transform="translate(${Math.round(width * 0.90)}, 0)">
        <rect x="-${Math.round(20 * baseScale)}" y="-${Math.round(14 * baseScale)}" width="${Math.round(40 * baseScale)}" height="${Math.round(28 * baseScale)}" rx="${Math.round(5 * baseScale)}" fill="none" stroke="#FFFFFF" stroke-width="2"/>
        <path d="M -${Math.round(6 * baseScale)} -${Math.round(14 * baseScale)} L -${Math.round(3 * baseScale)} -${Math.round(18 * baseScale)} H ${Math.round(3 * baseScale)} L ${Math.round(6 * baseScale)} -${Math.round(14 * baseScale)}" fill="none" stroke="#FFFFFF" stroke-width="2"/>
        <!-- Inner Arrows -->
        <path d="M -${Math.round(8 * baseScale)} -${Math.round(2 * baseScale)} A ${Math.round(8 * baseScale)} ${Math.round(8 * baseScale)} 0 0 1 ${Math.round(8 * baseScale)} -${Math.round(2 * baseScale)}" stroke="#FFFFFF" stroke-width="2" fill="none"/>
        <path d="M ${Math.round(8 * baseScale)} ${Math.round(2 * baseScale)} A ${Math.round(8 * baseScale)} ${Math.round(8 * baseScale)} 0 0 1 -${Math.round(8 * baseScale)} ${Math.round(2 * baseScale)}" stroke="#FFFFFF" stroke-width="2" fill="none"/>
      </g>
    </g>
  </svg>
  `);
}

async function handler(m, { sock }) {
  try {
    const isImage = m.type === 'imageMessage' || m.quotedType === 'imageMessage';
    if (!isImage) return m.reply('❌ Reply atau kirim foto yang mau dibikin UI Kamera iPhone!');

    await m.react('⏳');

    const imageBuffer = m.quoted ? await m.quoted.download() : await m.download();
    if (!imageBuffer) throw new Error("Gagal mengunduh gambar.");

    const { width, height } = await sharp(imageBuffer).metadata();
    const cameraOverlaySvg = generateIPhoneCameraUI(width, height);

    const finalImage = await sharp(imageBuffer)
      .composite([{ input: cameraOverlaySvg, top: 0, left: 0 }])
      .jpeg({ quality: 95 })
      .toBuffer();

    await sock.sendMessage(m.chat, {
      image: finalImage,
      caption: `📸 *iPhone Camera Viewfinder*`,
    }, { quoted: m });

    await m.react('📱');

  } catch (error) {
    console.error('[FakeCam iOS Error]:', error);
    await m.react('❌');
    m.reply('❌ Gagal memproses gambar: ' + error.message);
  }
}

export default { config: pluginConfig, handler };
