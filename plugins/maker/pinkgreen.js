/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fs from "fs/promises";
import os from "os";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

const pluginConfig = {
  name: "pinkgreen",
  category: "maker",
  description: "Efek pink-green bergaya Rimuru by Anita Putri Azzahra 2",
  usage: ".pinkgreen <reply/kirim gambar>",
  example: ".pinkgreen",
  isOwner: false,
  isPremium: false,
  cooldown: 8,
  energi: 5,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const qmsg = m.quoted || m;
  const mime = String(qmsg?.mimetype || qmsg?.msg?.mimetype || m.mimetype || m.msg?.mimetype || "");
  if (!/^image\//i.test(mime)) {
    return m.reply(`Reply/kirim gambar lalu gunakan *${m.prefix}pinkgreen*`);
  }

  const input = await (qmsg?.download ? qmsg.download() : m.download());
  if (!input) return m.reply("❌ Gagal mengunduh gambar.");

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "rimuru-pinkgreen-"));
  const inputPath = path.join(tmpDir, "input.jpg");
  const outputPath = path.join(tmpDir, "output.png");

  try {
    await fs.writeFile(inputPath, input);
    const ffmpeg = process.env.FFMPEG_PATH || "ffmpeg";
    const filter = "format=gray,lutrgb=r='255*pow(val/255,0.6)':g='100+(5*pow(val/255,0.6))':b='180*pow(val/255,0.6)'";
    await execFileAsync(ffmpeg, ["-y", "-i", inputPath, "-vf", filter, "-frames:v", "1", outputPath], { maxBuffer: 10 * 1024 * 1024 });
    const output = await fs.readFile(outputPath);
    await sock.sendMessage(m.chat, { image: output, caption: "🌸 *PinkGreen*" }, { quoted: m });
    return m.react("✅");
  } catch (e) {
    console.error("[PINKGREEN]", e);
    await m.react("❌").catch(() => {});
    return m.reply(`❌ Gagal membuat efek pinkgreen: ${e.message}`);
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
}

export { pluginConfig as config, handler };
