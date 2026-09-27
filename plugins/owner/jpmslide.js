/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { generateWAMessageFromContent, generateWAMessage, proto } from '@rexxhayanasi/elaina-baileys';
export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";
const pluginConfig = {
  name: "jpmslide",
  alias: [],
  category: "owner",
  description: "JPM carousel/slide ke semua grup yang diikuti bot",
  usage: ".jpmslide",
  example: ".jpmslide",
  isOwner: true,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 30,
  energi: 0,
  isEnabled: true,
};

function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function handler(m, { sock, db }) {
  const allGroups = await sock.groupFetchAllParticipating();
  const groupIDs = Object.keys(allGroups || {});
  if (!groupIDs.length) return m.reply("❌ Tidak ada grup yang diikuti bot.");

  const blacklist = db?.setting?.("jpmBlacklist") || [];
  const image = globalThis.thumbbc || globalThis.thumbnail || globalThis.thumb || null;
  if (!image) return m.reply("❌ Thumbnail JPM belum tersedia di konfigurasi bot.");

  const processMsg = await m.reply(`⏳ *Memproses JPM Slide...*\nJumlah grup: ${groupIDs.length}\nTipe: Carousel Slide`);
  let sentCount = 0;

  const dataSlide = [
    {
      title: `</> ${globalThis.ownername || "Rimuru"} Menyediakan </>`,
      caption: `* Panel Pterodactyl Server Private\n* Script Bot WhatsApp\n* Domain & Jasa Bot\n* Jasa Fix/Edit/Tambah Fitur SC\n\n*Channel:*\n${globalThis.linkSaluran || "-"}`,
      button: "Hubungi Kami",
      source: globalThis.owner ? `https://wa.me/${String(globalThis.owner).replace(/\D/g, '')}` : "https://wa.me/",
    },
    {
      title: "</> Informasi Produk </>",
      caption: "* Gunakan carousel ini untuk menampilkan informasi produk atau layanan.\n* Setiap kartu memiliki tombol URL yang dapat dibuka langsung.",
      button: "Buka Channel",
      source: globalThis.linkSaluran || "https://whatsapp.com/",
    },
    {
      title: "</> Rimuru MD 👑 </>",
      caption: "Carousel slide JPM dengan beberapa kartu interaktif.\n\nGeser kartu untuk melihat informasi berikutnya.",
      button: "Website",
      source: "https://whatsapp.com/",
    },
  ];

  for (const id of groupIDs) {
    if (blacklist.includes(id)) continue;
    try {
      const cards = [];
      for (const item of dataSlide) {
        const imgMsg = await generateWAMessage(m.chat, { image: { url: image } }, { upload: sock.waUploadToServer });
        cards.push({
          body: proto.Message.InteractiveMessage.Body.fromObject({ text: item.caption }),
          header: proto.Message.InteractiveMessage.Header.fromObject({
            title: item.title,
            hasMediaAttachment: true,
            imageMessage: imgMsg.message.imageMessage,
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
            buttons: [{
              name: "cta_url",
              buttonParamsJson: JSON.stringify({ display_text: item.button, url: item.source }),
            }],
          }),
        });
      }

      const bot = generateWAMessageFromContent(id, {
        viewOnceMessage: {
          message: {
            messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
            interactiveMessage: proto.Message.InteractiveMessage.fromObject({
              body: proto.Message.InteractiveMessage.Body.create({ text: "*📢 Informasi Terbaru*\n*Geser slide di bawah untuk melihat semua kartu.*" }),
              header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
              carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards }),
            }),
          },
        },
      }, { userJid: m.sender });

      await sock.relayMessage(id, bot.message, { messageId: bot.key.id });
      sentCount++;
      await delay(Number(globalThis.delayJpm) || 4000);
    } catch (e) {
      console.error(`[JPM Slide] ${id}:`, e?.message || e);
    }
  }

  return m.reply(`✅ *JPM Slide Selesai!*\nBerhasil terkirim ke *${sentCount}* grup dari total *${groupIDs.length}* grup.`);
}

export { pluginConfig as config, handler };
