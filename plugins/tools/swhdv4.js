/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const execPromise = promisify(exec);

const pluginConfig = {
  name: "swhdv4",
  alias: ["swhd4"],
  category: "tools",
  description: "Convert document/URL to image/video (HD, Heavy File Support, Ultra Fast & Zero Buffering)",
  usage: ".swhdv4 [caption] atau .swhdv4 <link_tourl>",
  example: "reply document atau masukkan link tourl dengan .swhdv4",
  isOwner: false,
  isPremium: true,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 10,
  isEnabled: true,
};

async function handler(m, { sock, text, command, prefix }) {
  const fullText = (text || m.text || '').trim();
  
  // Cek apakah input berupa Link/URL (Tourl dari Catbox, Qu.ax, Uguu, Pone, dll)
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urlMatch = fullText.match(urlRegex);

  const hasMedia = m.isMedia || m.hasQuotedMedia || (m.quoted && m.quoted.mtype === 'documentMessage') || urlMatch;

  if (!hasMedia) {
    return await sock.sendMessage(
      m.chat,
      {
        text: `⚠️ *Format Salah*\n\n` +
              `Contoh 1 (Reply Document):\nReply document video/image dengan caption \`${prefix || '.'}${command} [caption]\`\n\n` +
              `Contoh 2 (Pakai Link Tourl untuk file >30MB):\n\`${prefix || '.'}${command} https://qu.ax/xxx.mp4 [caption]\``,
      },
      { quoted: m }
    );
  }

  await m.react('⏰');

  let inputPath = null;
  let outputPath = null;

  try {
    let buffer = null;
    let mimeType = '';
    let captionText = fullText;

    // --- OPSI A: INPUT BERUPA LINK / TOURL (Cocok untuk File Besar >30MB) ---
    if (urlMatch) {
      const mediaUrl = urlMatch[0];
      captionText = fullText.replace(mediaUrl, '').trim();

      const time = Date.now();
      inputPath = path.join('.', `input_url_${time}`);

      // Download Stream langsung ke file temp untuk menghemat RAM
      const response = await axios({
        method: 'get',
        url: mediaUrl,
        responseType: 'stream',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        },
        timeout: 120000 // Timeout 2 menit
      });

      const writer = fs.createWriteStream(inputPath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      mimeType = response.headers['content-type'] || '';

      // Tentukan mimetype berdasarkan ekstensi jika dari header tidak lengkap
      if (!mimeType || mimeType.includes('octet-stream')) {
        if (mediaUrl.match(/\.(mp4|mkv|mov|avi|webm)/i)) mimeType = 'video/mp4';
        else if (mediaUrl.match(/\.(jpg|jpeg|png|webp)/i)) mimeType = 'image/jpeg';
      }
    } 
    // --- OPSI B: INPUT BERUPA REPLY / ATTACHMENT DOCUMENT (Bawaan V1) ---
    else {
      buffer = m.isQuoted ? await m.quoted.download() : await m.download();
      
      mimeType = m.isQuoted 
        ? (m.quoted.mimetype || m.quoted.message?.documentMessage?.mimetype) 
        : (m.mimetype || m.message?.documentMessage?.mimetype);

      if (!mimeType) {
        throw new Error('Mimetype tidak ditemukan dari document.');
      }
    }

    // --- PROSES VIDEO ---
    if (mimeType.startsWith('video/') || (inputPath && !mimeType.startsWith('image/'))) {
      const time = Date.now();
      if (!inputPath) {
        inputPath = path.join('.', `input_${time}.mp4`);
        fs.writeFileSync(inputPath, buffer);
      }
      
      outputPath = path.join('.', `output_${time}.mp4`);

      // Optimized FFmpeg V4: Faststart + Fragmented MP4 Streaming + Clean Metadata (-c copy 100% HD)
      try {
        await execPromise(
          `ffmpeg -i "${inputPath}" -c copy -movflags +faststart+frag_keyframe+empty_moov -map_metadata -1 "${outputPath}" -y`
        );
      } catch (ffmpegErr) {
        // Fallback re-encode ultrafast jika video awal memakai codec aneh (misal H.265 / HEVC)
        await execPromise(
          `ffmpeg -i "${inputPath}" -vcodec libx264 -pix_fmt yuv420p -acodec aac -movflags +faststart+frag_keyframe+empty_moov -map_metadata -1 "${outputPath}" -y`
        );
      }

      const videoBuffer = fs.readFileSync(outputPath);

      await sock.sendMessage(
        m.chat,
        {
          video: videoBuffer,
          mimetype: 'video/mp4',
          caption: captionText,
          ptv: false
        },
        { quoted: m }
      );
    } 
    // --- PROSES GAMBAR ---
    else if (mimeType.startsWith('image/')) {
      const imgBuffer = buffer || fs.readFileSync(inputPath);
      await sock.sendMessage(
        m.chat,
        {
          image: imgBuffer,
          mimetype: mimeType,
          caption: captionText,
        },
        { quoted: m }
      );
    } else {
      throw new Error(`Tipe media tidak didukung: ${mimeType}`);
    }

    await m.react('✅');
  } catch (err) {
    console.error('[SWHDV4 ERROR]', err);
    await m.react('❌');
    await sock.sendMessage(
      m.chat,
      {
        text: `❌ *Gagal convert document (V4)*\n\n> ${err.message}`,
      },
      { quoted: m }
    );
  } finally {
    // Bersihkan file sementara
    if (inputPath && fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    if (outputPath && fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
  }
}

export { pluginConfig as config, handler };
