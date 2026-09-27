/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { generateWAMessageFromContent, proto } from '@rexxhayanasi/elaina-baileys';

const pluginConfig = {
  name: ["sprem", "stickerpremium", "premiumsticker"],
  alias: [],
  category: "owner",
  description: "Kirim ulang sticker sebagai premium (Lottie/AI)",
  usage: ".sprem (reply sticker)",
  example: ".sprem",
  isOwner: true,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

async function handler(m, { sock }) {
  if (!m.quoted) {
    return m.reply(
      "⭐ *sᴛɪᴄᴋᴇʀ ᴘʀᴇᴍɪᴜᴍ*\n\n" +
        "> Reply sticker yang mau dijadikan premium!\n\n" +
        `> Penggunaan: \`${m.prefix}sprem\``,
    );
  }

  const q = m.quoted;

  try {
    const msg = q.message?.stickerMessage;
    if (!msg) return m.reply("❌ Gagal membaca data sticker");

    const stickerMessage = proto.Message.StickerMessage.fromObject({
      url: msg.url,
      fileSha256: msg.fileSha256,
      fileEncSha256: msg.fileEncSha256,
      mediaKey: msg.mediaKey,
      mimetype: msg.mimetype || "image/webp",
      height: msg.height,
      width: msg.width,
      directPath: msg.directPath,
      fileLength: msg.fileLength,
      mediaKeyTimestamp: msg.mediaKeyTimestamp,
      isAnimated: true,
      stickerSentTs: Date.now(),
      isAvatar: false,
      isAiSticker: true,
      premium: 1,
      isLottie: false,
      accessibilityLabel: msg.accessibilityLabel || "",
      contextInfo: {
        stanzaId: m.key?.id,
        participant: m.key?.participant || m.sender,
        remoteJid: m.chat,
      },
    });

    let targetJid = m.chat;
    const num = m.args?.[0]?.replace(/[^0-9]/g, "");
    if (num) targetJid = num + "@s.whatsapp.net";

    const waMsg = generateWAMessageFromContent(
      targetJid,
      { stickerMessage },
      {
        userJid: sock.user?.id,
        quoted: m,
      },
    );

    await sock.relayMessage(targetJid, waMsg.message, {
      messageId: waMsg.key.id,
    });

    await m.react("✅");
  } catch (err) {
    console.error("[sprem]", err.message);
    return m.reply(`❌ Gagal: ${err.message}`);
  }
}

export { pluginConfig as config, handler };
