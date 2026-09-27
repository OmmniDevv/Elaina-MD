/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fs from "fs";
import os from "os";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const pluginConfig = {
  name: "hdvid",
  alias: ["hdvideo", "enhancevid", "hdv"],
  category: "tools",
  description: "Meningkatkan kualitas video menjadi HD dengan pure FFMPEG",
  usage: ".hdvid (reply video)",
  example: ".hdvid",
  isOwner: false,
  isPremium: true,
  isGroup: false,
  isPrivate: false,
  cooldown: 120,
  energi: 3,
  isEnabled: true,
};

async function handler(m, { sock }) {
  let isVideoMessage = m.isVideo || (m.quoted && m.quoted.type === "videoMessage");
  let isDocumentMessage = (m.type === "documentMessage" && m.message?.documentMessage?.mimetype?.startsWith("video")) || (m.quoted && m.quoted.type === "documentMessage" && m.quoted.message?.documentMessage?.mimetype?.startsWith("video"));

  if (!isVideoMessage && !isDocumentMessage) {
    let txt = `📹 *HD VIDEO ENHANCER* 📹\n\n`;
    txt += `Halo kak! Punya video yang buram? Aku bisa bantu bikin jadi HD lho!\n\n`;
    txt += `*Cara Pakai:*\n`;
    txt += `👉 Kirim video (atau document video) dengan caption \`${m.prefix}hdvid\`\n`;
    txt += `👉 Atau reply video (atau document video) dengan \`${m.prefix}hdvid\`\n\n`;
    txt += `⚠️ _Fitur Premium, proses bisa memakan waktu tergantung ukuran ya kak!_`;
    return m.reply(txt);
  }

  await m.react("🕕");

  try {
    const videoBuffer = (await m?.quoted?.download?.()) || (await m.download?.());

    if (!videoBuffer || videoBuffer.length === 0) {
      await m.react("❌");
      return m.reply(`❌ *GAGAL*\n\nAduh kak, videonya gagal diunduh! Coba kirim ulang ya.`);
    }

    if (videoBuffer.length > 50 * 1024 * 1024) {
      await m.react("❌");
      return m.reply(`❌ *FILE TERLALU BESAR*\n\nMaaf kak, maksimal ukuran video cuma 50MB ya!`);
    }

    await m.reply(`🎞️ *PROSES ENHANCE DIMULAI* 🎞️\n\nVideo kakak sedang diproses agar menjadi HD! ✨\nEstimasi waktu tergantung ukuran video, mohon bersabar ya kak!`);

    const tempDir = os.tmpdir();
    const inputPath = path.join(tempDir, `input-hd-${Date.now()}.mp4`);
    const outputPath = path.join(tempDir, `output-hd-${Date.now()}.mp4`);

    fs.writeFileSync(inputPath, videoBuffer);

    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .videoFilters([
          'scale=iw*2:ih*2:flags=lanczos',
          'unsharp=5:5:1.0:5:5:0.0'
        ])
        .outputOptions(['-c:v libx264', '-preset fast', '-crf 23', '-c:a copy'])
        .save(outputPath)
        .on('end', () => resolve())
        .on('error', (err) => reject(err));
    });

    const resultBuffer = fs.readFileSync(outputPath);

    await sock.sendMedia(m.chat, resultBuffer, `✨ *PROSES SELESAI* ✨\n\nIni dia hasil videonya kak, udah jauh lebih mulus dan HD kan? 😍`, m, {
      type: "video",
      mimetype: "video/mp4",
      fileName: `HDVID-${Date.now()}.mp4`,
    });

    await m.react("✅");

    try {
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
    } catch (e) {}
  } catch (err) {
    await m.react("❌");
    await m.reply(`❌ Maaf kak, proses enhance videonya gagal! 😭\n\nDetail: ${err.message}`);
  }
}

export { pluginConfig as config, handler };
