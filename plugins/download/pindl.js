/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fs from "fs";
import axios from "axios";
import path from "path";
import { queueFFmpeg } from "./../../src/lib/elaina-ffmpeg.js";
import { f } from "../../src/lib/elaina-http.js";
import te from "../../src/lib/elaina-error.js";
const pluginConfig = {
  name: "pindl",
  alias: ["pinterestdl", "pindownload", "pintdl"],
  category: "download",
  description: "Download gambar/video dari Pinterest",
  usage: ".pindl <url>",
  example: ".pindl https://pin.it/xxx",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 1,
  isEnabled: true,
};
async function handler(m, { sock }) {
  const url = m.text?.trim();
  if (!url) {
    return m.reply(
      `📌 *ᴘɪɴᴛᴇʀᴇsᴛ ᴅᴏᴡɴʟᴏᴀᴅ*\n\n` +
        `> Download gambar/video dari Pinterest\n\n` +
        `*ᴄᴏɴᴛᴏʜ:*\n` +
        `> \`${m.prefix}pindl https://pin.it/xxx\`\n` +
        `> \`${m.prefix}pindl https://pinterest.com/pin/xxx\``,
    );
  }
  if (!url.includes("pinterest") && !url.includes("pin.it")) {
    return m.reply("❌ URL tidak valid. Gunakan link Pinterest.");
  }
  m.react("🕕");
  try {
    const res = await axios.get(`https://api.azbry.com/api/download/pinterest?url=${encodeURIComponent(url)}`);
    if (!res.data || !res.data.status || !res.data.result) {
      throw new Error("Gagal mengambil data dari API Pinterest.");
    }

    const data = res.data.result;
    const mediaList = [];

    if (data.type === 'video') {
        const vidUrl = data.videos?.[0]?.url || data.download;
        if (vidUrl) mediaList.push({ type: 'video', url: vidUrl });
    }

    if (data.images && data.images.length > 0) {
        const orig = data.images.find(img => img.name === 'orig') || data.images[data.images.length - 1];
        if (orig && orig.url) mediaList.push({ type: 'image', url: orig.url });
    } else if (data.type === 'image' && data.download) {
        mediaList.push({ type: 'image', url: data.download });
    }

    if (mediaList.length === 0) {
      throw new Error("Tidak ada media ditemukan");
    }

    for (const media of mediaList) {
      if (media.type === "video") {
        let masterUrl = media.url;
        if (masterUrl.includes('.mp4')) {
            masterUrl = masterUrl.replace(/720p|480p|360p|240p/g, 'hls').replace('.mp4', '.m3u8');
        }

        const tempDir = path.join(process.cwd(), "temp");
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
        
        const timestamp = Date.now();
        const videoTemp = path.join(tempDir, `${timestamp}_v.mp4`);
        const audioTemp = path.join(tempDir, `${timestamp}_a.mp4`);
        const outputFile = path.join(tempDir, `${timestamp}_final.mp4`);

        try {
            const resHls = await axios.get(masterUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Referer': 'https://www.pinterest.com/'
                }
            });
            const text = resHls.data;
            const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

            const baseUrl = masterUrl.substring(0, masterUrl.lastIndexOf("/") + 1);
            let videoStreamUrl = null;
            let audioStreamUrl = null;
            let lastBandwidth = 0;

            for (let i = 0; i < lines.length; i++) {
              if (lines[i].startsWith("#EXT-X-STREAM-INF")) {
                const bwMatch = lines[i].match(/BANDWIDTH=(\d+)/);
                const bw = bwMatch ? parseInt(bwMatch[1]) : 0;
                if (bw > lastBandwidth) {
                  lastBandwidth = bw;
                  const u = lines[i + 1];
                  videoStreamUrl = u?.startsWith("http") ? u : baseUrl + u;
                }
              }
              if (lines[i].startsWith("#EXT-X-MEDIA") && lines[i].includes("TYPE=AUDIO")) {
                const mUrl = lines[i].match(/URI="([^"]+)"/);
                if (mUrl) audioStreamUrl = mUrl[1].startsWith("http") ? mUrl[1] : baseUrl + mUrl[1];
              }
            }

            const ffmpegHdr = `-user_agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" -headers "Referer: https://www.pinterest.com/"`;

            if (!videoStreamUrl) {
                await queueFFmpeg(`ffmpeg -y ${ffmpegHdr} -i "${masterUrl}" -c copy "${outputFile}"`);
            } else {
                await queueFFmpeg(`ffmpeg -y ${ffmpegHdr} -i "${videoStreamUrl}" -c copy "${videoTemp}"`);
                if (audioStreamUrl) {
                    await queueFFmpeg(`ffmpeg -y ${ffmpegHdr} -i "${audioStreamUrl}" -c copy "${audioTemp}"`);
                    await queueFFmpeg(`ffmpeg -y -i "${videoTemp}" -i "${audioTemp}" -c copy "${outputFile}"`);
                } else {
                    fs.renameSync(videoTemp, outputFile);
                }
            }
            
            await sock.sendMedia(m.chat, fs.readFileSync(outputFile), null, m, {
                type: "video",
                contextInfo: { forwardingScore: 99, isForwarded: true }
            });

        } catch (err) {
            console.error("[PinDL HLS Error]:", err.message);
            try {
                // Fallback: Pinterest memblokir generic axios (403), jadi download manual pakai User-Agent
                const fallbackBuffer = await axios.get(media.url, { 
                    responseType: 'arraybuffer',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Referer': 'https://www.pinterest.com/'
                    }
                });
                await sock.sendMedia(m.chat, Buffer.from(fallbackBuffer.data), null, m, {
                  type: "video",
                  contextInfo: { forwardingScore: 99, isForwarded: true },
                });
            } catch (fallbackErr) {
                console.error("[PinDL Fallback Error]:", fallbackErr.message);
            }
        } finally {
            if (fs.existsSync(videoTemp)) fs.unlinkSync(videoTemp);
            if (fs.existsSync(audioTemp)) fs.unlinkSync(audioTemp);
            if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
        }
      } else if (media.type === "image") {
        if (media.url.includes("gif")) {
          const tempPath = path.join(process.cwd(), "temp");
          if (!fs.existsSync(tempPath))
            fs.mkdirSync(tempPath, { recursive: true });
          const id = Date.now();
          const gifPath = path.join(tempPath, `pin-${id}.gif`);
          const mp4Path = path.join(tempPath, `pin-${id}.mp4`);
          try {
            const raw = await f(media.url, "buffer");
            if (!raw) throw new Error("Gagal download GIF");
            fs.writeFileSync(gifPath, raw);
            await queueFFmpeg(
              `ffmpeg -y -ignore_loop 0 -i "${gifPath}" -t 30 -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -c:v libx264 -pix_fmt yuv420p -movflags faststart -preset ultrafast -an "${mp4Path}"`,
            );
            if (!fs.existsSync(mp4Path)) throw new Error("Gagal convert GIF");
            await sock.sendMedia(m.chat, fs.readFileSync(mp4Path), null, m, {
              type: "video",
              gifPlayback: true,
              contextInfo: {
                forwardingScore: 99,
                isForwarded: true,
              },
            });
          } catch (gifErr) {
            console.error("[PinDL] GIF convert error:", gifErr.message);
            await sock.sendMedia(m.chat, media.url, null, m, {
              type: "image",
              contextInfo: { forwardingScore: 99, isForwarded: true },
            });
          } finally {
            if (fs.existsSync(gifPath)) fs.unlinkSync(gifPath);
            if (fs.existsSync(mp4Path)) fs.unlinkSync(mp4Path);
          }
        } else {
          await sock.sendMedia(m.chat, media.url, null, m, {
            type: "image",
            contextInfo: {
              forwardingScore: 99,
              isForwarded: true,
            },
          });
        }
      }
    }
    m.react("✅");
  } catch (error) {
    console.error("[PinDL] Error:", error);
    m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}
export { pluginConfig as config, handler };
