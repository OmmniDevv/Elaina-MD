/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import te from "../../src/lib/elaina-error.js";
import { saluranCtx } from "../../src/lib/elaina-context.js";
const pluginConfig = {
  name: "ttselon",
  alias: ["elontts", "ttselonmusk"],
  category: "tts",
  description: "Text to Speech dengan suara Elon Musk",
  usage: ".ttselon <text>",
  example: ".ttselon To Mars!",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 15,
  energi: 1,
  isEnabled: true,
};

function convertToOpus(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-i",
      inputPath,
      "-c:a",
      "libopus",
      "-b:a",
      "64k",
      "-vbr",
      "on",
      "-compression_level",
      "10",
      "-y",
      outputPath,
    ]);
    ffmpeg.on("close", (code) =>
      code === 0 ? resolve(true) : reject(new Error(`FFmpeg error`)),
    );
    ffmpeg.on("error", reject);
  });
}

async function handler(m, { sock }) {
  const text = m.text?.trim();
  if (!text)
    return m.reply(
      `🚀 *ᴇʟᴏɴ ᴍᴜsᴋ ᴛᴛs*\n\n> Gunakan: \`${m.prefix}ttselon <text>\``,
    );

  m.react("🚀");

  try {
    const res = await axios.get(
      `https://api.emiliabot.my.id/tools/text-to-speech?text=${encodeURIComponent(text)}`,
      { timeout: 60000 },
    );
    const voice = res.data?.result?.find((v) => v.elon_musk && !v.error);
    if (!voice) {
      m.react("❌");
      return m.reply(`❌ Elon voice error. Coba TTS lain.`);
    }

    const tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    const wavPath = path.join(tempDir, `tts_${Date.now()}.wav`);
    const opusPath = path.join(tempDir, `tts_${Date.now()}.ogg`);

    const audioRes = await axios.get(voice.elon_musk, {
      responseType: "arraybuffer",
    });
    fs.writeFileSync(wavPath, Buffer.from(audioRes.data));
    await convertToOpus(wavPath, opusPath);

    await sock.sendMessage(
      m.chat,
      {
        audio: fs.readFileSync(opusPath),
        mimetype: "audio/ogg; codecs=opus",
        ptt: true,
        contextInfo: saluranCtx(),
      },
      { quoted: m },
    );

    fs.unlinkSync(wavPath);
    fs.unlinkSync(opusPath);
    m.react("✅");
  } catch (err) {
    m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
