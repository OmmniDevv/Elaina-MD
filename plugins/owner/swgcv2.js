/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getAssetBuffer } from "../../src/lib/elaina-asset-manager.js";
import { fileTypeFromBuffer } from "file-type";
import fs from "fs";
import path from "path";
import { config } from "../../config.js";
import te from "../../src/lib/elaina-error.js";
import { handleAntiSwGc } from "../../src/lib/elaina-group-protection.js";
import { saluranCtx } from "../../src/lib/elaina-context.js";
import { generateWAMessage } from '@rexxhayanasi/elaina-baileys';

const botConfig = config;

function buildSyntheticSwGcRawMessage(sock, remoteJid, innerMessage, messageId) {
  const botJid = sock.user?.id?.split(":")[0] + "@s.whatsapp.net";
  return {
    key: {
      remoteJid,
      fromMe: true,
      id: messageId,
      participant: botJid,
    },
    message: {
      groupStatusMessageV2: {
        message: innerMessage,
      },
    },
    messageTimestamp: Math.floor(Date.now() / 1000),
  };
}

const pluginConfig = {
  name: "swgcv2",
  alias: ["statusgrupv2"],
  category: "owner",
  description: "Post Group Status V2 ke grup pilihan",
  usage: ".swgcv2 <teks> atau reply media",
  example: ".swgcv2 Halo semua!",
  isOwner: true,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 0,
  isEnabled: true,
};

const pendingSwgcV2 = new Map();

async function handler(m, { sock, db }) {
  const args = m.args || [];
  const text = m.text || "";

  if (args[0] === "--confirm" && args[1]) {
    const targetGroupId = args[1];
    const pendingData = pendingSwgcV2.get(m.sender);

    if (!pendingData) {
      await m.reply(
        `⚠️ *Tidak ada data pending. Silakan kirim ulang media + .swgcv2*`,
      );
      return;
    }

    try {
      let groupName = "Grup";
      try {
        const meta = await sock.groupMetadata(targetGroupId);
        groupName = meta.subject;
      } catch (e) { }

      await m.react("🕕");

      const rawContent = pendingData.rawContent;

      let baseContent = {};
      if (rawContent.image) {
        baseContent = { image: rawContent.image, caption: rawContent.caption || "" };
      } else if (rawContent.video) {
        baseContent = { video: rawContent.video, caption: rawContent.caption || "" };
      } else if (rawContent.audio) {
        baseContent = { audio: rawContent.audio, mimetype: rawContent.mimetype || "audio/mpeg", ptt: rawContent.ptt || false };
      } else if (rawContent.text) {
        baseContent = { text: rawContent.text };
      }

      const genMsg = await generateWAMessage(targetGroupId, baseContent, {
        userJid: sock.user.id,
        upload: sock.waUploadToServer
      });

      const msgType = Object.keys(genMsg.message).find(k => k.endsWith('Message') && k !== 'senderKeyDistributionMessage');

      let mediaMessage = {};
      if (msgType) {
        mediaMessage[msgType] = genMsg.message[msgType];
        const newContextInfo = {
          isGroupStatus: true,
          statusSourceType: rawContent.text ? 4 : rawContent.audio ? 3 : rawContent.video ? 1 : 0,
          featureEligibilities: {
            canBeReshared: true,
            canReceiveMultiReact: false
          },
          statusAttributions: [
            {
              type: 10
            }
          ],
          statusAudienceMetadata: {
            audienceType: 1
          }
        };

        if (mediaMessage[msgType].contextInfo) {
          Object.assign(mediaMessage[msgType].contextInfo, newContextInfo);
        } else {
          mediaMessage[msgType].contextInfo = newContextInfo;
        }
      }

      const payload = {
        groupStatusMessageV2: {
          message: mediaMessage
        }
      };

      const messageId = genMsg.key.id;

      await sock.relayMessage(targetGroupId, payload, { messageId });

      const syntheticRawMsg = buildSyntheticSwGcRawMessage(sock, targetGroupId, mediaMessage, messageId);
      await handleAntiSwGc(syntheticRawMsg, sock, db);

      const mediaType = pendingData.rawContent.text
        ? "Teks"
        : pendingData.rawContent.image
          ? "Gambar"
          : pendingData.rawContent.video
            ? "Video"
            : pendingData.rawContent.audio
              ? "Audio"
              : "Media";

      const successMsg = `✅ Berhasil up sw (V2) ke grup ${groupName}`;

      await m.reply(successMsg);
      pendingSwgcV2.delete(m.sender);

      if (pendingData.tempFile && fs.existsSync(pendingData.tempFile)) {
        setTimeout(() => {
          try {
            fs.unlinkSync(pendingData.tempFile);
          } catch (e) { }
        }, 5000);
      }
    } catch (error) {
      await m.reply(
        `❌ *ᴇʀʀᴏʀ*\n\n` + `> Gagal posting story V2.\n` + `> _${error.message}_`,
      );
    }
    return;
  }

  let rawContent = {};
  let buffer, ext, tempFile;
  const tempDir = path.join(process.cwd(), "temp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  if (
    m.quoted &&
    (m.quoted.isImage ||
      m.quoted.isVideo ||
      m.quoted.isAudio ||
      m.quoted.mimetype?.startsWith("audio"))
  ) {
    try {
      buffer = await m.quoted.download();
      if (!buffer) {
        await m.reply(`❌ Gagal mengambil media.`);
        return;
      }
      const fileType = await fileTypeFromBuffer(buffer);
      ext = fileType?.ext || "bin";
      tempFile = path.join(tempDir, `swgcv2_${Date.now()}.${ext}`);
      fs.writeFileSync(tempFile, buffer);

      if (m.quoted.isImage) {
        rawContent.image = buffer;
        rawContent.caption = text || "";
      } else if (m.quoted.isVideo) {
        rawContent.video = buffer;
        rawContent.caption = text || "";
      } else if (m.quoted.isAudio || m.quoted.mimetype?.startsWith("audio")) {
        rawContent.audio = buffer;
        rawContent.mimetype =
          fileType?.mime || m.quoted.mimetype || "audio/mpeg";
        rawContent.ptt = m.quoted.msg?.ptt || false;
      }
    } catch (e) {
      await m.reply(te(m.prefix, m.command, m.pushName));
      return;
    }
  } else if (
    m.isImage ||
    m.isVideo ||
    m.isAudio ||
    m.mimetype?.startsWith("audio")
  ) {
    try {
      buffer = await m.download();
      if (!buffer) {
        await m.reply(`❌ Gagal mengambil media.`);
        return;
      }
      const fileType = await fileTypeFromBuffer(buffer);
      ext = fileType?.ext || "bin";
      tempFile = path.join(tempDir, `swgcv2_${Date.now()}.${ext}`);
      fs.writeFileSync(tempFile, buffer);

      if (m.isImage) {
        rawContent.image = buffer;
        rawContent.caption = text || "";
      } else if (m.isVideo) {
        rawContent.video = buffer;
        rawContent.caption = text || "";
      } else if (m.isAudio || m.mimetype?.startsWith("audio")) {
        rawContent.audio = buffer;
        rawContent.mimetype = fileType?.mime || m.mimetype || "audio/mpeg";
        rawContent.ptt = m.msg?.ptt || false;
      }
    } catch (e) {
      await m.reply(te(m.prefix, m.command, m.pushName));
      return;
    }
  } else if (text && text.trim()) {
    rawContent.text = text;
    rawContent.font = 0;
    rawContent.backgroundColor = "#128C7E";
  } else {
    await m.reply(
      `⚠️ *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ*\n\n` +
      `> \`${m.prefix}swgcv2 teks\` - Story teks\n` +
      `> Reply gambar/video/audio + \`${m.prefix}swgcv2\`\n` +
      `> Kirim gambar/video + caption \`${m.prefix}swgcv2\``,
    );
    return;
  }

  pendingSwgcV2.set(m.sender, {
    rawContent: rawContent,
    tempFile: tempFile,
    timestamp: Date.now(),
  });

  try {
    global.isFetchingGroups = true;
    const groups = await sock.groupFetchAllParticipating();
    global.isFetchingGroups = false;
    const groupList = Object.entries(groups);

    if (groupList.length === 0) {
      await m.reply(`⚠️ *Bot tidak berada di grup manapun.*`);
      return;
    }

    const groupRows = groupList.map(([id, meta]) => ({
      title: meta.subject || "Unknown Group",
      description: id,
      id: `${m.prefix}swgcv2 --confirm ${id}`,
    }));

    const prefix = m.prefix || ".";
    const mediaType = rawContent.text
      ? "Teks"
      : rawContent.image
        ? "Gambar"
        : rawContent.video
          ? "Video"
          : rawContent.audio
            ? "Audio"
            : "Media";

    let thumbnail = null;
    try {
      thumbnail = getAssetBuffer("rimuru2");
    } catch (e) { }

    await sock.sendMessage(m.chat, {
      text:
        `📋 *ᴘɪʟɪʜ ɢʀᴜᴘ ᴜɴᴛᴜᴋ ᴘᴏsᴛ sᴛᴏʀʏ ᴠ2*\n\n` +
        `> Media: *${mediaType}*\n` +
        `> Total Grup: *${groupList.length}*\n\n` +
        `_Pilih grup dari daftar di bawah:_`,
      contextInfo: {
        ...saluranCtx(),
        forwardedNewsletterMessageInfo: {
          newsletterJid: botConfig?.saluran?.id,
          newsletterName: botConfig?.saluran?.name,
        },
      },
      footer: "Rimuru MD",
      interactiveButtons: [
        {
          name: "single_select",
          buttonParamsJson: JSON.stringify({
            title: "🏠 Pilih Grup",
            sections: [
              {
                title: "Daftar Grup",
                rows: groupRows,
              },
            ],
          }),
        },
        {
          name: "quick_reply",
          buttonParamsJson: JSON.stringify({
            display_text: "❌ Batal",
            id: `${prefix}cancelswgcv2`,
          }),
        },
      ],
    });
  } catch (error) {
    await m.reply(
      `❌ *ᴇʀʀᴏʀ*\n\n` +
      `> Gagal mengambil daftar grup.\n` +
      `> _${error.message}_`,
    );
    if (tempFile && fs.existsSync(tempFile)) {
      try {
        fs.unlinkSync(tempFile);
      } catch (e) { }
    }
    pendingSwgcV2.delete(m.sender);
  }
}

export { pluginConfig as config, handler, pendingSwgcV2 };
