/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import {
  generateWAMessage,
  generateWAMessageFromContent,
  jidNormalizedUser,
} from '@rexxhayanasi/elaina-baileys';
import { pinterest } from "btch-downloader";
import axios from "axios";
import crypto from "crypto";
import te from "../../src/lib/elaina-error.js";
import { f } from "../../src/lib/elaina-http.js";

const pluginConfig = {
  name: "pin",
  alias: ["pinsearch", "pinterestsearch", "pins"],
  category: "search",
  description: "Cari gambar di Pinterest (album)",
  usage: ".pin <query>",
  example: ".pin Zhao Lusi",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
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
  // btch-downloader already exists in this SC and supports Pinterest search queries.
  // Use it first because the old Cuki response schema is no longer reliable.
  try {
    const data = await pinterest(query);
    const results = getResults(data).filter((item) => getImageUrl(item));
    if (results.length) return results;
  } catch (err) {
    console.log("[Pins] btch-downloader gagal, mencoba fallback:", err.message);
  }

  // Keep the previous API as a fallback so the command still has a second provider.
  try {
    const data = await f(
      `https://api.cuki.biz.id/api/search/pinterest?apikey=cuki-x&query=${encodeURIComponent(query)}&type=image`,
    );
    return getResults(data).filter((item) => getImageUrl(item));
  } catch (err) {
    console.log("[Pins] Fallback Pinterest API gagal:", err.message);
    return [];
  }
}

async function handler(m, { sock, config }) {
  const query = m.text?.trim();
  if (!query) {
    return m.reply(
      `🔍 *ᴘɪɴᴛᴇʀᴇsᴛ sᴇᴀʀᴄʜ*\n\n` +
      `> Contoh:\n` +
      `\`${m.prefix}pin Zhao Lusi\``,
    );
  }
  m.react("🕕");

  try {
    const results = (await searchPinterest(query)).slice(0, 10);
    if (!results.length) {
      m.react("❌");
      return m.reply(`❌ Tidak ditemukan hasil untuk: ${query}`);
    }

    const mediaList = [];

    for (const item of results) {
      const imageUrl = getImageUrl(item);
      if (!imageUrl) continue;

      try {
        const imgRes = await axios.get(imageUrl, {
          responseType: "arraybuffer",
          timeout: 15000,
          maxContentLength: 15 * 1024 * 1024,
        });
        const imgBuffer = Buffer.from(imgRes.data);

        if (imgBuffer.length > 1000) {
          mediaList.push({ image: imgBuffer });
        }
      } catch (e) {
        continue;
      }
    }

    if (!mediaList.length) {
      m.react("❌");
      return m.reply("❌ Gagal memuat gambar");
    }

    try {
      const opener = generateWAMessageFromContent(
        m.chat,
        {
          messageContextInfo: { messageSecret: crypto.randomBytes(32) },
          albumMessage: {
            expectedImageCount: mediaList.length,
            expectedVideoCount: 0,
          },
        },
        {
          userJid: jidNormalizedUser(sock.user.id),
          quoted: m,
          upload: sock.waUploadToServer,
        },
      );

      await sock.relayMessage(opener.key.remoteJid, opener.message, {
        messageId: opener.key.id,
      });

      for (const content of mediaList) {
        const msg = await generateWAMessage(opener.key.remoteJid, content, {
          upload: sock.waUploadToServer,
        });

        msg.message.messageContextInfo = {
          messageSecret: crypto.randomBytes(32),
          messageAssociation: {
            associationType: 1,
            parentMessageKey: opener.key,
          },
        };

        await sock.relayMessage(msg.key.remoteJid, msg.message, {
          messageId: msg.key.id,
        });
      }

      m.react("✅");
    } catch (albumErr) {
      console.log("[Pins] Album gagal, kirim satu-satu:", albumErr.message);

      const saluranId = config.saluran?.id || "120363412350560864@newsletter";
      const saluranName =
        config.saluran?.name || config.bot?.name || "Rimuru-AI";

      for (const content of mediaList) {
        await sock.sendMessage(
          m.chat,
          {
            image: content.image,
            contextInfo: {
              forwardingScore: 9999,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: saluranId,
                newsletterName: saluranName,
                serverMessageId: 127,
              },
            },
          },
          { quoted: m },
        );
      }
    }
  } catch (err) {
    console.error("[Pins] Error:", err.message);
    m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
