/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { scSearch } from "./soundcloud.js";
import scdl from "../../src/scraper/soundclouddl.js";
import te from "../../src/lib/elaina-error.js";

const pluginConfig = {
  name: "playsoundcloud",
  alias: ["playsc"],
  category: "search",
  description: "Cari dan download lagu dari SoundCloud",
  usage: ".playsc judul",
  example: ".playsc Only We Know",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 15,
  energi: 2,
  isEnabled: true,
};

async function handler(m, { args, sock }) {
  if (!args[0]) {
    let txt = `🎶 *PLAY SOUNDCLOUD* 🎶\n\n`;
    txt += `Halo kak! Pengen dengerin lagu dari SoundCloud? Aku bisa cariin sekalian downloadin format MP3-nya buat kamu!\n\n`;
    txt += `*Cara Pakai:*\n`;
    txt += `👉 \`${m.prefix}playsc <judul lagu>\`\n\n`;
    txt += `*Contoh:*\n`;
    txt += `\`${m.prefix}playsc Only We Know\``;
    return m.reply(txt);
  }

  await m.react("🕕");

  try {
    const searchResults = await scSearch(args.join(" "));
    if (!searchResults.length) {
      return m.reply(`❌ Yah kak, lagunya nggak ketemu! Coba cari dengan judul lain ya. 😭`);
    }

    const track = searchResults[0];
    const downloadInfo = await scdl(track.url);
    let contentTxt = `🎵 *Judul :* ${downloadInfo.title}\n`;
    contentTxt += `👤 *Uploader :* ${downloadInfo.uploader}\n`;
    contentTxt += `⏱️ *Durasi :* ${downloadInfo.duration}\n`;
    contentTxt += `👁️ *Views :* ${downloadInfo.views}\n`;
    contentTxt += `❤️ *Likes :* ${downloadInfo.likes}\n`;
    contentTxt += `📦 *Ukuran :* ${downloadInfo.size}`;

    let txt = `🎉 *BERHASIL DOWNLOAD LAGU!* 🎉\n\n`;
    txt += contentTxt.trim().split("\n").map(line => `${line}`).join("\n");
    txt += `\n\n`;
    txt += `_Audio MP3 sedang dikirim, ditunggu ya kak!_ 🎶`;

    await sock.sendMedia(m.chat, downloadInfo.thumbnail || track.artwork, txt.trim(), m, { type: "image" });
    await sock.sendMedia(m.chat, downloadInfo.download_url, downloadInfo.title, m, { type: "audio" });

    await m.react("✅");
  } catch (e) {
    m.reply(`❌ Gagal mendownload lagu kak! 😭\nError: ${e.message}`);
  }
}

export { pluginConfig as config, handler };
