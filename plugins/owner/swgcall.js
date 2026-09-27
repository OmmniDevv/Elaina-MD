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
import { saluranCtx } from "../../src/lib/elaina-context.js";

const botConfig = config;

const pluginConfig = {
  name: "swgcall",
  alias: ["swgcsemua", "swgcbroadcast", "swgcbc", "groupstoryall"],
  category: "owner",
  description: "Post Group Status/Story ke SEMUA grup sekaligus (border hijau)",
  usage: ".swgcall <teks> atau reply media",
  example: ".swgcall Pengumuman penting!",
  isOwner: true,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 30,
  energi: 0,
  isEnabled: true,
};

async function sendGroupStatus(sock, jid, content) {
  return await sock.sendMessage(jid, { groupStatusMessage: content });
}

async function handler(m, { sock, db }) {
  const args = m.args || [];
  const text = m.text || "";

  if (args[0] === "--yes") {
    const pending = global._swgcallPending?.get(m.sender);
    if (!pending) {
      return m.reply(
        `⚠️ *Tidak ada data pending. Kirim ulang media + .swgcall*`,
      );
    }

    const { rawContent, groups, tempFile } = pending;

    await m.react("🔄");

    let content = {};
    if (rawContent.image)
      content = { image: rawContent.image, caption: rawContent.caption || "" };
    else if (rawContent.video)
      content = { video: rawContent.video, caption: rawContent.caption || "" };
    else if (rawContent.audio)
      content = {
        audio: rawContent.audio,
        mimetype: rawContent.mimetype || "audio/mpeg",
        ptt: rawContent.ptt || false,
      };
    else if (rawContent.text) content = { text: rawContent.text };

    let success = 0;
    let failed = 0;
    const failedGroups = [];
    const total = groups.length;
    const delay = (ms) => new Promise((r) => setTimeout(r, ms));

    for (let i = 0; i < groups.length; i++) {
      const [groupId, meta] = groups[i];
      try {
        await sendGroupStatus(sock, groupId, content);
        success++;
      } catch (e) {
        failed++;
        failedGroups.push(meta.subject || groupId);
      }

      if ((i + 1) % 5 === 0) {
        await delay(2000);
      } else {
        await delay(500);
      }
    }

    global._swgcallPending.delete(m.sender);
    if (tempFile && fs.existsSync(tempFile)) {
      try {
        fs.unlinkSync(tempFile);
      } catch {}
    }

    let report =
      `✅ *ʙʀᴏᴀᴅᴄᴀsᴛ sᴡɢᴄ sᴇʟᴇsᴀɪ*\n\n` +
      `> Total: *${total}* grup\n` +
      `> Berhasil: *${success}* ✅\n` +
      `> Gagal: *${failed}* ❌`;

    if (failedGroups.length > 0) {
      report +=
        `\n\n*Grup gagal:*\n` + failedGroups.map((g) => `> • ${g}`).join("\n");
    }

    await m.reply(report);
    await m.react("✅");
    return;
  }

  let rawContent = {};
  let buffer, ext, tempFile;
  const tempDir = path.join(process.cwd(), "temp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const source =
    m.quoted &&
    (m.quoted.isImage ||
      m.quoted.isVideo ||
      m.quoted.isAudio ||
      m.quoted.mimetype?.startsWith("audio"))
      ? m.quoted
      : m.isImage || m.isVideo || m.isAudio || m.mimetype?.startsWith("audio")
        ? m
        : null;

  if (source) {
    try {
      buffer = await source.download();
      if (!buffer) return m.reply(`❌ Gagal mengambil media.`);

      const fileType = await fileTypeFromBuffer(buffer);
      ext = fileType?.ext || "bin";
      tempFile = path.join(tempDir, `swgcall_${Date.now()}.${ext}`);
      fs.writeFileSync(tempFile, buffer);

      const isImage = source.isImage || fileType?.mime?.startsWith("image");
      const isVideo = source.isVideo || fileType?.mime?.startsWith("video");
      const isAudio =
        source.isAudio ||
        fileType?.mime?.startsWith("audio") ||
        source.mimetype?.startsWith("audio");

      if (isImage) {
        rawContent.image = buffer;
        rawContent.caption = text || "";
      } else if (isVideo) {
        rawContent.video = buffer;
        rawContent.caption = text || "";
      } else if (isAudio) {
        rawContent.audio = buffer;
        rawContent.mimetype = fileType?.mime || source.mimetype || "audio/mpeg";
        rawContent.ptt = source.msg?.ptt || false;
      }
    } catch {
      return m.reply(te(m.prefix, m.command, m.pushName));
    }
  } else if (text && text.trim()) {
    rawContent.text = text;
    rawContent.font = 0;
    rawContent.backgroundColor = "#128C7E";
  } else {
    return m.reply(
      `⚠️ *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ*\n\n` +
        `> \`${m.prefix}swgcall teks\` - Story teks ke semua grup\n` +
        `> Reply gambar/video/audio + \`${m.prefix}swgcall\`\n` +
        `> Kirim gambar/video + caption \`${m.prefix}swgcall\`\n\n` +
        `⚠️ _Fitur ini akan mengirim story ke SEMUA grup!_`,
    );
  }

  try {
    global.isFetchingGroups = true;
    const groups = await sock.groupFetchAllParticipating();
    global.isFetchingGroups = false;
    const groupList = Object.entries(groups);

    if (groupList.length === 0) {
      return m.reply(`⚠️ *Bot tidak berada di grup manapun.*`);
    }

    if (!global._swgcallPending) global._swgcallPending = new Map();
    global._swgcallPending.set(m.sender, {
      rawContent,
      groups: groupList,
      tempFile,
      timestamp: Date.now(),
    });

    const mediaType = rawContent.text
      ? "Teks"
      : rawContent.image
        ? "Gambar"
        : rawContent.video
          ? "Video"
          : rawContent.audio
            ? rawContent.ptt
              ? "Voice Note"
              : "Audio"
            : "Unknown";

    let thumbnail = null;
    try {
      thumbnail = getAssetBuffer("rimuru2");
    } catch {}

    const estimatedTime = Math.ceil(groupList.length * 1.5);

    await sock.sendMessage(m.chat, {
      text:
        `📢 *ᴋᴏɴꜰɪʀᴍᴀsɪ ʙʀᴏᴀᴅᴄᴀsᴛ sᴡɢᴄ*\n\n` +
        `> Media: *${mediaType}*\n` +
        `> Total Grup: *${groupList.length}*\n` +
        `> Estimasi: *~${estimatedTime} detik*\n\n` +
        `⚠️ _Story akan dipost ke SEMUA grup!_\n` +
        `_Tekan konfirmasi untuk melanjutkan._`,
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
          name: "quick_reply",
          buttonParamsJson: JSON.stringify({
            display_text: `✅ Kirim ke ${groupList.length} Grup`,
            id: `${m.prefix}swgcall --yes`,
          }),
        },
        {
          name: "quick_reply",
          buttonParamsJson: JSON.stringify({
            display_text: "❌ Batal",
            id: `${m.prefix}cancelswgcall`,
          }),
        },
      ],
    });
  } catch (error) {
    await m.reply(
      `❌ *ᴇʀʀᴏʀ*\n\n> Gagal mengambil daftar grup.\n> _${error.message}_`,
    );
    if (tempFile && fs.existsSync(tempFile)) {
      try {
        fs.unlinkSync(tempFile);
      } catch {}
    }
    global._swgcallPending?.delete(m.sender);
  }
}

export { pluginConfig as config, handler };
