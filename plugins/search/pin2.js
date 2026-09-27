/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import {
  generateWAMessageFromContent,
  prepareWAMessageMedia,
} from '@rexxhayanasi/elaina-baileys';
import { pinterest } from "btch-downloader";
import axios from "axios";
import te from "../../src/lib/elaina-error.js";
import { f } from "../../src/lib/elaina-http.js";

const pluginConfig = {
  name: "pin2",
  alias: ["pinterest2"],
  category: "search",
  description: "Cari satu gambar acak di Pinterest dengan tombol next",
  usage: ".pin2 <query>",
  example: ".pin2 anime",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

function getResults(data) {
  const candidates = [
    data?.result?.result?.result,
    data?.result?.result,
    data?.result,
    data?.data?.results,
    data?.results,
  ];

  for (const value of candidates) {
    if (Array.isArray(value)) return value;
  }

  return [];
}

function getImageUrl(item) {
  if (typeof item === "string") return item;
  return (
    item?.image_url ||
    item?.image ||
    item?.images?.orig?.url ||
    item?.images?.['736x']?.url ||
    item?.images?.['564x']?.url ||
    item?.url ||
    item?.thumbnail ||
    null
  );
}

async function searchPinterest(query) {
  try {
    const data = await pinterest(query);
    const results = getResults(data).filter((item) => getImageUrl(item));
    if (results.length) return results;
  } catch (err) {
    console.log("[PIN2] btch-downloader gagal, mencoba fallback:", err.message);
  }

  try {
    const data = await f(
      `https://api.cuki.biz.id/api/search/pinterest?apikey=cuki-x&query=${encodeURIComponent(query)}&type=image`,
    );
    return getResults(data).filter((item) => getImageUrl(item));
  } catch (err) {
    console.log("[PIN2] Fallback Pinterest API gagal:", err.message);
    return [];
  }
}

async function handler(m, { sock }) {
  const query = m.text?.trim();

  if (!query) {
    return m.reply(`❌ Masukkan kata kunci pencarian.\n\nContoh: \`${m.prefix}pin2 kucing\``);
  }

  await m.react("🕕");

  try {
    const results = await searchPinterest(query);
    if (!results.length) {
      await m.react("❌");
      return m.reply(`❌ Waduh, pencarian untuk *${query}* tidak ditemukan. Coba kata kunci lain.`);
    }

    // Coba beberapa hasil sampai menemukan gambar yang benar-benar bisa dimuat.
    const shuffled = [...results].sort(() => Math.random() - 0.5);
    let imageBuffer = null;

    for (const item of shuffled) {
      const imageUrl = getImageUrl(item);
      if (!imageUrl) continue;

      try {
        const response = await axios.get(imageUrl, {
          responseType: "arraybuffer",
          timeout: 15000,
          maxContentLength: 15 * 1024 * 1024,
        });
        const buffer = Buffer.from(response.data);
        if (buffer.length > 1000) {
          imageBuffer = buffer;
          break;
        }
      } catch (err) {
        continue;
      }
    }

    if (!imageBuffer) {
      await m.react("❌");
      return m.reply("⚠️ Gambar Pinterest ditemukan, tetapi gagal dimuat.");
    }

    const mediaMessage = await prepareWAMessageMedia(
      { image: imageBuffer },
      { upload: sock.waUploadToServer },
    );

    const msg = generateWAMessageFromContent(
      m.chat,
      {
        viewOnceMessage: {
          message: {
            messageContextInfo: {},
            interactiveMessage: {
              header: {
                title: "",
                subtitle: "",
                hasMediaAttachment: true,
                imageMessage: mediaMessage.imageMessage,
              },
              footer: {
                text: "Klik tombol di bawah untuk gambar lain 👇",
              },
              body: {
                text: `📸 *PINTEREST SEARCH*\n\n> Pencarian: *${query}*`,
              },
              nativeFlowMessage: {
                buttons: [
                  {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                      display_text: "🔁 Next",
                      id: `${m.prefix}pin2 ${query}`,
                    }),
                  },
                ],
              },
            },
          },
        },
      },
      { quoted: m, userJid: sock.user.jid },
    );

    await sock.relayMessage(m.chat, msg.message, {
      messageId: msg.key.id,
    });

    await m.react("✅");
  } catch (error) {
    console.error("[PIN2 Search]", error.message);
    await m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
