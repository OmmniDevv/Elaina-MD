/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { RIMURU_CORE_CONFIG } from "../../config.js";
import crypto from 'crypto';
import config from '../../config.js';

function buildStickerExif(metadata) {
  const json = Buffer.from(JSON.stringify(metadata), "utf-8");
  const exif = Buffer.concat([
    Buffer.from([0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00]),
    Buffer.alloc(4),
    Buffer.from([0x16, 0x00, 0x00, 0x00]),
    json,
  ]);
  exif.writeUInt32LE(json.length, 14);
  return exif;
}

function makeChunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const sizeBuffer = Buffer.alloc(4);
  sizeBuffer.writeUInt32LE(data.length, 0);
  const padding = data.length % 2 === 1 ? Buffer.from([0x00]) : Buffer.alloc(0);
  return Buffer.concat([typeBuffer, sizeBuffer, data, padding]);
}

function setWebpExif(webpBuffer, metadata) {
  if (webpBuffer.slice(0, 4).toString() !== "RIFF" || webpBuffer.slice(8, 12).toString() !== "WEBP") {
    throw new Error("File bukan WEBP valid.");
  }
  const chunks = [];
  let offset = 12;
  while (offset + 8 <= webpBuffer.length) {
    const type = webpBuffer.slice(offset, offset + 4).toString();
    const size = webpBuffer.readUInt32LE(offset + 4);
    const chunkStart = offset;
    const chunkEnd = offset + 8 + size + (size % 2);
    if (chunkEnd > webpBuffer.length) break;
    if (type !== "EXIF") chunks.push(webpBuffer.slice(chunkStart, chunkEnd));
    offset = chunkEnd;
  }
  const exifPayload = buildStickerExif(metadata);
  const exifChunk = makeChunk("EXIF", exifPayload);
  const body = Buffer.concat([...chunks, exifChunk]);
  const header = Buffer.alloc(12);
  header.write("RIFF", 0);
  header.writeUInt32LE(body.length + 4, 4);
  header.write("WEBP", 8);
  return Buffer.concat([header, body]);
}

const pluginConfig = {
  name: 'anticolong',
  alias: ['ac', 'anticolongsticker', 'acsticker'],
  category: 'sticker',
  description: 'Mengubah stiker biasa menjadi anti-colong (tidak bisa diforward/save)',
  usage: '.anticolong (reply pesan stiker)',
  example: '.anticolong',
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  isAdmin: false,
  isBotAdmin: false,
  cooldown: 5,
  energi: 2,
  isEnabled: true,
};

async function handler(m, { sock }) {
  try {
    const isQuotedSticker = m.isQuoted && (m.quotedType === 'stickerMessage' || m.quoted?.type === 'stickerMessage');
    
    if (!isQuotedSticker) return m.reply('❌ *GAGAL*\n\n> Silahkan balas/reply ke *Stiker* yang ingin dibuat anti-colong.');

    await m.react('⏳');

    const buffer = await m.quoted.download();
    if (!buffer) throw new Error("Gagal mendownload stiker.");

    const botName = RIMURU_CORE_CONFIG.bot?.name || 'Ourin-MD';
    const dynamicPackName = `Anti colong •`;
    const dynamicPublisher = `By ${botName}`;

    const antiColongMetadata = {
      "sticker-pack-id": crypto.randomBytes(16).toString('hex'),
      "sticker-pack-name": dynamicPackName,
      "sticker-pack-publisher": dynamicPublisher,
      "accessibility-text": "Protected Sticker",
      "android-app-store-link": "https://whatsapp.com",
      "ios-app-store-link": "https://whatsapp.com/channel/RIMURU_CHANNEL",
      emojis: ["🦸"],
      "is-from-sticker-maker": 0,
      "is-avatar-sticker": 1,
      "avatar-sticker-template-id": "whatsapp",
      "is-ai-sticker": 1,
      "is-avatar-country-sticker": 1,
      "is-avatar-instant-sticker": 1,
      "sticker-maker-source-type": 4,
      "is-avatar-social-sticker": 1,
      "avatar-sticker-style": "whatsapp",
      "avatar-sticker-revision-id": "2026",
      "is-from-user-created-pack": 1,
      "origin-pack-id": "whatsapp",
      "is-text-sticker": 1,
    };

    const newStickerBuffer = setWebpExif(buffer, antiColongMetadata);

    await sock.sendMessage(m.chat, { sticker: newStickerBuffer, viewOnce: true }, { quoted: m });
    await m.react('✅');
  } catch (error) {
    console.error('[AntiColong] Error:', error);
    await m.react('❌');
    await m.reply('❌ *GAGAL PROSES STIKER*\n\n> ' + error.message);
  }
}

export default { config: pluginConfig, handler };
