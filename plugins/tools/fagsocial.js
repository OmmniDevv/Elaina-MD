/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import sharp from 'sharp';

const pluginConfig = {
  name: 'fagsocial',
  alias: ['fag', 'ftt'],
  category: 'tools',
  description: 'Mengubah Foto menjadi Overlay IG Reels (.fag) atau TikTok FYP (.ftt) dengan responsif penuh',
  usage: '.fag username | caption  ATAU  .ftt username | caption',
  example: '.fag dj_sagara | Chill vibes 🌲✨\n.ftt sagara_tt | FYP Hari Ini 🔥',
  isEnabled: true,
};

// SVG Overlay Instagram Reels (Responsive 100%)
function generateIGOverlay(width, height, username, caption) {
  // Hitung skala berdasarkan dimensi foto asli
  const scale = Math.min(width, height) / 1000;
  
  const fontMain = Math.round(28 * scale);
  const fontSub = Math.round(22 * scale);
  const fontSmall = Math.round(18 * scale);

  const rightX = Math.round(width - (80 * scale));
  const bottomY = Math.round(height - (60 * scale));
  const shadowHeight = Math.round(height * 0.45); // Gradient shadow 45% dari tinggi foto

  return Buffer.from(`
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bottomShadow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#000000" stop-opacity="0" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0.85" />
      </linearGradient>
    </defs>

    <style>
      .ig-text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; fill: #FFFFFF; font-weight: 600; filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.8)); }
      .ig-cap { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; fill: #FFFFFF; font-weight: 400; filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.8)); }
      .ig-sub { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; fill: #EFEFEF; font-weight: 500; filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.8)); }
    </style>

    <!-- Gradient Shadow Bawah -->
    <rect x="0" y="${height - shadowHeight}" width="${width}" height="${shadowHeight}" fill="url(#bottomShadow)" />

    <!-- RIGHT BUTTONS (IG REELS) -->
    <g transform="translate(${rightX}, ${bottomY - Math.round(320 * scale)})">
      <!-- LIKE -->
      <g transform="translate(0, 0)">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#FF3040" transform="scale(${scale * 1.6}) translate(-10, -10)" />
        <text x="0" y="${Math.round(45 * scale)}" class="ig-sub" font-size="${fontSub}" text-anchor="middle">14.2K</text>
      </g>

      <!-- COMMENT -->
      <g transform="translate(0, ${Math.round(95 * scale)})">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="none" stroke="#FFFFFF" stroke-width="2.5" transform="scale(${scale * 1.3}) translate(-10, -10)" />
        <text x="0" y="${Math.round(45 * scale)}" class="ig-sub" font-size="${fontSub}" text-anchor="middle">520</text>
      </g>

      <!-- SHARE (PAPER PLANE) -->
      <g transform="translate(0, ${Math.round(190 * scale)})">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="#FFFFFF" transform="scale(${scale * 1.3}) translate(-10, -10)" />
        <text x="0" y="${Math.round(45 * scale)}" class="ig-sub" font-size="${fontSub}" text-anchor="middle">1.8K</text>
      </g>

      <!-- MORE (...) -->
      <g transform="translate(0, ${Math.round(270 * scale)})">
        <circle cx="0" cy="-${Math.round(8 * scale)}" r="${Math.round(3.5 * scale)}" fill="#FFFFFF" />
        <circle cx="0" cy="0" r="${Math.round(3.5 * scale)}" fill="#FFFFFF" />
        <circle cx="0" cy="${Math.round(8 * scale)}" r="${Math.round(3.5 * scale)}" fill="#FFFFFF" />
      </g>

      <!-- AUDIO THUMBNAIL -->
      <g transform="translate(-${Math.round(15 * scale)}, ${Math.round(310 * scale)})">
        <rect x="0" y="0" width="${Math.round(30 * scale)}" height="${Math.round(30 * scale)}" rx="${Math.round(6 * scale)}" fill="#222222" stroke="#FFFFFF" stroke-width="1.5" />
        <circle cx="${Math.round(15 * scale)}" cy="${Math.round(15 * scale)}" r="${Math.round(7 * scale)}" fill="#FF3040" />
      </g>
    </g>

    <!-- BOTTOM LEFT (IG PROFILE & CAPTION) -->
    <g transform="translate(${Math.round(40 * scale)}, ${bottomY})">
      <!-- AVATAR -->
      <circle cx="${Math.round(22 * scale)}" cy="-${Math.round(110 * scale)}" r="${Math.round(22 * scale)}" fill="#444" stroke="#FFFFFF" stroke-width="1.5" />
      <text x="${Math.round(22 * scale)}" y="-${Math.round(102 * scale)}" font-family="Arial" font-size="${fontSub}" fill="#FFF" text-anchor="middle" font-weight="bold">${username.charAt(0).toUpperCase()}</text>

      <!-- USERNAME & FOLLOW BUTTON -->
      <text x="${Math.round(55 * scale)}" y="-${Math.round(102 * scale)}" class="ig-text" font-size="${fontMain}">${username}</text>
      <rect x="${Math.round(65 * scale) + (username.length * Math.round(16 * scale))}" y="-${Math.round(124 * scale)}" width="${Math.round(75 * scale)}" height="${Math.round(28 * scale)}" rx="${Math.round(6 * scale)}" fill="none" stroke="#FFFFFF" stroke-width="1.5"/>
      <text x="${Math.round(102 * scale) + (username.length * Math.round(16 * scale))}" y="-${Math.round(105 * scale)}" class="ig-text" font-size="${fontSmall}" text-anchor="middle">Follow</text>

      <!-- CAPTION -->
      <text x="0" y="-${Math.round(50 * scale)}" class="ig-cap" font-size="${fontMain}">${caption}</text>

      <!-- AUDIO TRACK -->
      <g transform="translate(0, -${Math.round(10 * scale)})">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" fill="#FFFFFF" transform="scale(${scale * 0.9})" />
        <text x="${Math.round(25 * scale)}" y="${Math.round(12 * scale)}" class="ig-sub" font-size="${fontSub}">${username} • Original Audio</text>
      </g>
    </g>
  </svg>
  `);
}

// SVG Overlay TikTok FYP (Responsive 100%)
function generateTikTokOverlay(width, height, username, caption) {
  const scale = Math.min(width, height) / 1000;
  
  const fontMain = Math.round(28 * scale);
  const fontSub = Math.round(22 * scale);

  const rightX = Math.round(width - (80 * scale));
  const bottomY = Math.round(height - (60 * scale));
  const shadowHeight = Math.round(height * 0.45);

  return Buffer.from(`
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bottomShadow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#000000" stop-opacity="0" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0.85" />
      </linearGradient>
    </defs>

    <style>
      .tt-text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; fill: #FFFFFF; font-weight: 700; filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.9)); }
      .tt-cap { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; fill: #FFFFFF; font-weight: 400; filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.9)); }
      .tt-sub { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; fill: #FFFFFF; font-weight: 600; filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.9)); }
    </style>

    <!-- Gradient Shadow Bawah -->
    <rect x="0" y="${height - shadowHeight}" width="${width}" height="${shadowHeight}" fill="url(#bottomShadow)" />

    <!-- RIGHT BUTTONS (TIKTOK) -->
    <g transform="translate(${rightX}, ${bottomY - Math.round(410 * scale)})">
      <!-- AVATAR + PLUS -->
      <g transform="translate(0, 0)">
        <circle cx="0" cy="0" r="${Math.round(26 * scale)}" fill="#333" stroke="#FFFFFF" stroke-width="2" />
        <text x="0" y="${Math.round(8 * scale)}" font-family="Arial" font-size="${fontMain}" fill="#FFF" text-anchor="middle" font-weight="bold">${username.charAt(0).toUpperCase()}</text>
        <circle cx="0" cy="${Math.round(24 * scale)}" r="${Math.round(11 * scale)}" fill="#FE2C55" />
        <text x="0" y="${Math.round(29 * scale)}" font-family="Arial" font-size="${Math.round(16 * scale)}" fill="#FFFFFF" text-anchor="middle" font-weight="bold">+</text>
      </g>

      <!-- LIKE (WHITE) -->
      <g transform="translate(0, ${Math.round(85 * scale)})">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#FFFFFF" transform="scale(${scale * 1.5}) translate(-10, -10)" />
        <text x="0" y="${Math.round(42 * scale)}" class="tt-sub" font-size="${fontSub}" text-anchor="middle">88.5K</text>
      </g>

      <!-- COMMENT -->
      <g transform="translate(0, ${Math.round(165 * scale)})">
        <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z" fill="#FFFFFF" transform="scale(${scale * 1.4}) translate(-10, -10)" />
        <text x="0" y="${Math.round(42 * scale)}" class="tt-sub" font-size="${fontSub}" text-anchor="middle">1204</text>
      </g>

      <!-- BOOKMARK / SAVE RIBBON -->
      <g transform="translate(0, ${Math.round(245 * scale)})">
        <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" fill="#FFFFFF" transform="scale(${scale * 1.4}) translate(-10, -10)" />
        <text x="0" y="${Math.round(42 * scale)}" class="tt-sub" font-size="${fontSub}" text-anchor="middle">5420</text>
      </g>

      <!-- SHARE ARROW -->
      <g transform="translate(0, ${Math.round(325 * scale)})">
        <path d="M10 9V5l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11z" fill="#FFFFFF" transform="scale(${scale * 1.4}) translate(-10, -10)" />
        <text x="0" y="${Math.round(42 * scale)}" class="tt-sub" font-size="${fontSub}" text-anchor="middle">3120</text>
      </g>

      <!-- SPINNING VINYL DISC -->
      <g transform="translate(0, ${Math.round(410 * scale)})">
        <circle cx="0" cy="0" r="${Math.round(24 * scale)}" fill="#111" stroke="#222" stroke-width="2" />
        <circle cx="0" cy="0" r="${Math.round(15 * scale)}" fill="#333" />
        <circle cx="0" cy="0" r="${Math.round(7 * scale)}" fill="#FE2C55" />
      </g>
    </g>

    <!-- BOTTOM LEFT (TIKTOK PROFILE & CAPTION) -->
    <g transform="translate(${Math.round(40 * scale)}, ${bottomY})">
      <text x="0" y="-${Math.round(80 * scale)}" class="tt-text" font-size="${fontMain}">@${username}</text>
      <text x="0" y="-${Math.round(35 * scale)}" class="tt-cap" font-size="${fontMain}">${caption}</text>

      <g transform="translate(0, ${Math.round(10 * scale)})">
        <text x="0" y="${Math.round(10 * scale)}" class="tt-sub" font-size="${fontSub}">♫  suara asli - ${username}</text>
      </g>
    </g>
  </svg>
  `);
}

async function handler(m, { sock, prefix, command, args }) {
  try {
    const targetMsg = m.isQuoted ? m.quoted : m;
    const msg = targetMsg.message?.viewOnceMessageV2?.message || 
                targetMsg.message?.viewOnceMessage?.message || 
                targetMsg.message;

    const isImage = targetMsg.mtype === 'imageMessage' || 
                    msg?.imageMessage || 
                    (msg?.documentMessage?.mimetype && msg.documentMessage.mimetype.startsWith('image/'));

    const cmd = command.toLowerCase();
    const isTikTok = cmd === 'ftt';

    if (!isImage) {
      return await sock.sendMessage(
        m.chat,
        { text: `⚠️ *Format Salah*\n\nReply/kirim foto dengan caption:\n*${prefix || '.'}${command} username | caption*\n\nContoh:\n*${prefix || '.'}${command} dj_sagara | Night vibes 🌙✨*` },
        { quoted: m }
      );
    }

    const textInput = args.join(' ');
    let username = isTikTok ? 'sagara_tt' : 'dj_sagara';
    let caption = 'Aesthetic photo ✨';

    if (textInput.includes('|')) {
      const parts = textInput.split('|');
      username = parts[0].trim().replace(/\s+/g, '_').toLowerCase() || username;
      caption = parts[1].trim() || caption;
    } else if (textInput.trim().length > 0) {
      caption = textInput.trim();
    }

    await m.react('⏰');

    const buffer = targetMsg.download ? await targetMsg.download() : await m.download();
    const image = sharp(buffer);
    
    // Ambil metadata dimensi foto ASLI
    const metadata = await image.metadata();
    const width = metadata.width || 1080;
    const height = metadata.height || 1080;

    // Buat SVG overlay presisi sesuai dimensi foto asli
    const svgOverlay = isTikTok 
      ? generateTikTokOverlay(width, height, username, caption)
      : generateIGOverlay(width, height, username, caption);

    // Tempelkan overlay persis di atas foto asli tanpa meng-crop / meresize fotonya
    const resultBuffer = await image
      .composite([{ input: svgOverlay, top: 0, left: 0 }])
      .jpeg({ quality: 95 })
      .toBuffer();

    await sock.sendMessage(
      m.chat,
      {
        image: resultBuffer,
        caption: isTikTok ? `📱 *TikTok FYP (.ftt) Responsive Overlay*` : `📱 *Instagram Reels (.fag) Responsive Overlay*`,
      },
      { quoted: m }
    );

    await m.react('✅');

  } catch (err) {
    console.error('[FAG/FTT ERROR]', err);
    await m.react('❌');
    await sock.sendMessage(
      m.chat,
      { text: `❌ *Gagal memproses foto*\n\n> ${err.message}` },
      { quoted: m }
    );
  }
}

export { pluginConfig as config, handler };
