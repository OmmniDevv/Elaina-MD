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
  prepareWAMessageMedia,
} from '@rexxhayanasi/elaina-baileys';
import te from "../../src/lib/elaina-error.js";
import { f } from "../../src/lib/elaina-http.js";

const pluginConfig = {
  name: "pap",
  alias: ["papcewe", "papcowo", "papfemboy"],
  category: "search",
  description: "Minta pap cewe, cowo, atau femboy dari Pinterest",
  usage: ".pap <cewe/cowo/femboy>",
  example: ".pap cewe",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const arg = m.args[0]?.toLowerCase();
  const validTypes = ["cewe", "cowo", "femboy"];

  if (!arg || !validTypes.includes(arg)) {
    return m.reply("❌ Pilih salah satu tipe pap yang tersedia: `cewe`, `cowo`, atau `femboy`.\n\nContoh: `.pap cewe`");
  }

  await m.react("🕕");

  try {
    const query = arg;
    
    const data = await f(
      `https://api.cuki.biz.id/api/search/pinterest?apikey=cuki-x&query=${encodeURIComponent(query)}&type=image`
    );

    const results = data?.data?.results?.filter(item => item.image_url);
    if (!results || results.length === 0) {
      await m.react("❌");
      return m.reply(`❌ Waduh, pap ${query} lagi kosong nih. Coba lagi nanti.`);
    }

    const randomItem = results[Math.floor(Math.random() * results.length)];
    const imageUrl = randomItem.image_url;

    if (!imageUrl) {
      await m.react("❌");
      return m.reply("⚠️ Gambar tidak tersedia.");
    }

    const mediaMessage = await prepareWAMessageMedia({
      image: { url: imageUrl }
    }, { upload: sock.waUploadToServer });

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {},
          interactiveMessage: {
            header: {
              title: "",
              subtitle: "",
              hasMediaAttachment: true,
              imageMessage: mediaMessage.imageMessage
            },
            footer: {
              text: "Pilih menu pap lainnya di bawah ini 👇"
            },
            body: {
              text: `📸 *PAP ${arg.toUpperCase()}*`
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "quick_reply",
                  buttonParamsJson: JSON.stringify({
                    display_text: "🔁 Next",
                    id: `${m.prefix}pap ${arg}`
                  })
                },
                {
                  name: "quick_reply",
                  buttonParamsJson: JSON.stringify({
                    display_text: "👧 Cewe",
                    id: `${m.prefix}pap cewe`
                  })
                },
                {
                  name: "quick_reply",
                  buttonParamsJson: JSON.stringify({
                    display_text: "👦 Cowo",
                    id: `${m.prefix}pap cowo`
                  })
                },
                {
                  name: "quick_reply",
                  buttonParamsJson: JSON.stringify({
                    display_text: "⚧ Femboy",
                    id: `${m.prefix}pap femboy`
                  })
                }
              ]
            }
          }
        }
      }
    }, { quoted: m, userJid: sock.user.jid });

    await sock.relayMessage(m.chat, msg.message, {
      messageId: msg.key.id,
    });

    await m.react("✅");

  } catch (error) {
    console.error("[PAP Search]", error.message);
    await m.react("☢");
    m.reply("😔 Gagal memuat PAP. Server Pinterest mungkin sedang bermasalah.");
  }
}

export { pluginConfig as config, handler };
