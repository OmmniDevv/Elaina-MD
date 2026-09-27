/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import _sharp from 'sharp'
import axios from "axios";
import * as cheerio from "cheerio";

function getSharp() {
  return _sharp;
}
import te from "../../src/lib/elaina-error.js";
async function nerdfonts() {
  try {
    const { data } = await axios.get(
      "https://www.nerdfonts.com/font-downloads",
    );
    const $ = cheerio.load(data);
    const result = [];
    $("div.item").each((_, rynn) => {
      const name = $(rynn).find("span.nerd-font-invisible-text").text().trim();
      const textContent = $(rynn).find("div").first().text();
      const version =
        textContent.match(/Version:\s*([^\n\r]+)/)[1].trim() || null;
      const info = textContent.match(/Info:\s*([^\n\r]+)/)[1].trim() || null;
      const preview_image =
        "https://www.nerdfonts.com" +
          $(rynn)
            .find("a.font-preview")
            .attr("style")
            .match(
              /background-image\s*:\s*url\s*\(\s*['"]?([^'"]+)['"]?\s*\)/i,
            )[1] || null;
      const preview_url =
        $(rynn).find("a.nf-oct-link_external").attr("href") || null;
      const download_url = $(rynn).find("a.nf-fa-download").attr("href");
      if (name && download_url) {
        result.push({
          name,
          version,
          info,
          preview_image,
          preview_url,
          download_url,
        });
      }
    });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
}
const pluginConfig = {
  name: "nerdfont-ambil",
  alias: ["dafont-ambil", "fontambil"],
  category: "search",
  description: "Cari font di DaFont",
  usage: ".nerdfont-ambil <query>",
  example: ".nerdfont-ambil Coolvetica",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};
function formatNumber(num) {
  const n = parseInt(num);
  if (isNaN(n)) return num;
  if (n >= 1000000000) return (n / 1000000000).toFixed(1) + "B";
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}
async function handler(m, { sock }) {
  const query = m.text?.trim()?.toLowerCase();
  if (!query)
    return m.reply(`*NERD FONT*\n\n> Masukan nama font yang ingin didownload`);
  try {
    const res = await nerdfonts();
    const data = res.find(
      (d, i) => d?.name.toLowerCase() === query.toLowerCase(),
    );
    sock.sendMessage(m.chat, {
      document: { url: data.download_url },
      fileName: data.name,
      mimetype: "application/zip",
      jpegThumbnail: await (
        await getSharp()
      )(
        await axios
          .get(data.preview_image, { responseType: "arraybuffer" })
          .then((res) => Buffer.from(res.data)),
      )
        .resize(50, 50)
        .toBuffer(),
      caption: `*Done*
Jika kamu ingin mendownload lagi, ketik ${m.prefix}nerdfont lagi`,
    });
  } catch (err) {
    return m.reply(te(m.prefix, m.command, m.pushName));
  }
}
export { pluginConfig as config, handler };
