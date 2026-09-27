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

const execPromise = promisify(exec);

const pluginConfig = {
  name: "swhdv3",
  alias: ["swhd3"],
  category: "tools",
  description: "Convert document to image/video (Ultra Fast & Zero Buffering)",
  usage: ".swhdv3 [caption]",
  example: "reply document dengan .swhdv3",
  isOwner: false,
  isPremium: true,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 10,
  isEnabled: true,
};

async function handler(m, { sock, text, command, prefix }) {
  if (!(m.isMedia || m.hasQuotedMedia)) {
    return await sock.sendMessage(
      m.chat,
      {
        text: `⚠️ *Format Salah*\n\nContoh:\nReply document video/image dengan caption ${prefix || '.'}${command} [caption]`,
      },
      { quoted: m }
    );
  }

  await m.react('⏰');

  let inputPath = null;
  let outputPath = null;

  try {
    const buffer = m.isQuoted ? await m.quoted.download() : await m.download();
    
    let mimeType = m.isQuoted 
      ? (m.quoted.mimetype || m.quoted.message?.documentMessage?.mimetype) 
      : (m.mimetype || m.message?.documentMessage?.mimetype);

    if (!mimeType) {
      throw new Error('Mimetype tidak ditemukan dari document.');
    }

    const captionText = text || m.text || '';

    if (mimeType.startsWith('video/')) {
      // 1. Simpan buffer ke temporary file
      const time = Date.now();
      inputPath = path.join('.', `input_${time}.mp4`);
      outputPath = path.join('.', `output_${time}.mp4`);

      fs.writeFileSync(inputPath, buffer);

      // 2. Optimized FFmpeg V3: Faststart + Fragmented MP4 Streaming + Clean Metadata (-c copy 100% HD)
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
    } else if (mimeType.startsWith('image/')) {
      await sock.sendMessage(
        m.chat,
        {
          image: buffer,
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
    console.error('[SWHDV3 ERROR]', err);
    await m.react('❌');
    await sock.sendMessage(
      m.chat,
      {
        text: `❌ *Gagal convert document*\n\n> ${err.message}`,
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
