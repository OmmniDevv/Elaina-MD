/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";
import { fetchGroupsSafe } from "../../src/lib/elaina-jpm-helper.js";
import {
  getAutoJpmConfig,
  setAutoJpmConfig,
  startAutoJpmScheduler,
  stopAutoJpmScheduler,
  getAutoJpmStorageDir,
} from "../../src/lib/elaina-auto-jpm.js";
import { getMimeType, getExtension } from "../../src/lib/elaina-utils.js";
import * as timeHelper from "../../src/lib/elaina-time.js";
import {
  getBinaryNodeChild,
  prepareWAMessageMedia,
  generateWAMessageFromContent,
  proto,
} from '@rexxhayanasi/elaina-baileys';
import config from "../../config.js";
import te from "../../src/lib/elaina-error.js";
import { saluranCtx } from "../../src/lib/elaina-context.js";
import util from "util";
import axios from "axios";
import path from "path";
import fs from "fs";
import { getAssetBuffer } from "../../src/lib/elaina-asset-manager.js";

const pluginConfig = {
  name: "jpm",
  alias: [
    "jasher",
    "jaser",
    "jpmht",
    "jpmhidetag",
    "jpmch",
    "jpmchannel",
    "autojpm",
    "autojasher",
    "stopjpm",
    "stopjasher",
    "setdelayjpm",
    "delayjpm",
    "jedajpm",
    "setjedajpm",
    "jpmupdate",
    "updatejpm",
    "broadcastupdate",
    "blacklistjpm",
    "bljpm",
    "jpmbl",
    "jpmblacklist",
    "blautojpm",
    "blacklistautojpm",
    "autojpmbl",
  ],
  category: "jpm",
  description:
    "Sistem JPM lengkap: broadcast, hidetag, channel, auto, blacklist, delay, update",
  usage: ".jpm",
  example: ".jpm",
  isOwner: true,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

const jpmSessions = {};

let cachedThumb = null;
try {
  cachedThumb = getAssetBuffer("rimuru2");
} catch {}

function getVerifiedQuoted() {
  const botName = config.bot?.name || "Rimuru-AI";
  const botNumber = config.owner?.number?.[0] || "0";
  return {
    key: {
      participant: `0@s.whatsapp.net`,
      remoteJid: `status@broadcast`,
    },
    message: {
      contactMessage: {
        displayName: `📢 ${botName}`,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${botName};;;\nFN:${botName}\nitem1.TEL;waid=${botNumber}:${botNumber}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
        sendEphemeral: true,
      },
    },
  };
}

function parseInterval(raw) {
  if (!raw) return 0;
  const cleaned = raw.toLowerCase().replace(/\s+/g, "");
  const matches = [...cleaned.matchAll(/(\d+)([smhdw])/g)];
  if (!matches.length) return 0;
  const combined = matches.map((m) => m[0]).join("");
  if (combined !== cleaned) return 0;
  let total = 0;
  for (const match of matches) {
    const value = parseInt(match[1]);
    const unit = match[2];
    if (unit === "s") total += value * 1000;
    if (unit === "m") total += value * 60 * 1000;
    if (unit === "h") total += value * 60 * 60 * 1000;
    if (unit === "d") total += value * 24 * 60 * 60 * 1000;
    if (unit === "w") total += value * 7 * 24 * 60 * 60 * 1000;
  }
  return total;
}

function formatInterval(ms) {
  if (!ms || ms <= 0) return "0 detik";
  const units = [
    { label: "hari", value: 86400000 },
    { label: "jam", value: 3600000 },
    { label: "menit", value: 60000 },
    { label: "detik", value: 1000 },
  ];
  let remaining = ms;
  const parts = [];
  for (const unit of units) {
    const amount = Math.floor(remaining / unit.value);
    if (amount > 0) {
      parts.push(`${amount} ${unit.label}`);
      remaining -= amount * unit.value;
    }
  }
  return parts.length ? parts.join(" ") : "0 detik";
}

function previewText(text) {
  if (!text) return "-";
  const cleaned = text.replace(/\s+/g, " ").trim();
  return cleaned.length <= 80 ? cleaned : `${cleaned.slice(0, 77)}...`;
}

async function collectRecentJpmImages(m, sock) {
  const mediaList = [];
  const now = Date.now();
  const chatJid = m.chat;

  try {
    const store = sock.store || global.store;
    const messages = store?.messages?.[chatJid]?.array || [];

    for (const msg of messages) {
      const msgTime =
        (msg.messageTimestamp?.low || msg.messageTimestamp || 0) * 1000;
      if (!msgTime || now - msgTime > 60000) continue;
      if (msg.key?.fromMe) continue;

      const content = msg.message;
      if (!content?.imageMessage) continue;

      try {
        const stream = await sock.downloadMediaMessage(msg);
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        const buffer = Buffer.concat(chunks);
        if (buffer.length < 1000) continue;

        mediaList.push({
          buffer,
          type: "image",
          caption: content.imageMessage.caption || "",
          mimetype: content.imageMessage.mimetype || "image/jpeg",
        });
      } catch {}
    }
  } catch {}

  return mediaList;
}

async function fetchAllSubscribedChannels(sock) {
  const data = {};
  const encoder = new TextEncoder();
  const queryIds = ["6388546374527196"];
  for (const queryId of queryIds) {
    try {
      const result = await sock.query({
        tag: "iq",
        attrs: {
          id: sock.generateMessageTag(),
          type: "get",
          xmlns: "w:mex",
          to: "@s.whatsapp.net",
        },
        content: [
          {
            tag: "query",
            attrs: { query_id: queryId },
            content: encoder.encode(JSON.stringify({ variables: {} })),
          },
        ],
      });
      const child = getBinaryNodeChild(result, "result");
      if (!child?.content) continue;
      const parsed = JSON.parse(child.content.toString());
      const newsletters =
        parsed?.data?.["xwa2_newsletter_subscribed"] ||
        parsed?.data?.["newsletter_subscribed"] ||
        parsed?.data?.["subscribed"] ||
        [];
      if (newsletters.length > 0) {
        for (const ch of newsletters) {
          if (ch.id) {
            data[ch.id] = {
              id: ch.id,
              name: ch.thread_metadata?.name?.text || ch.name || "Unknown",
              subscribers: ch.thread_metadata?.subscribers_count || 0,
            };
          }
        }
        break;
      }
    } catch {
      continue;
    }
  }
  return data;
}

async function getTargetGroups(sock, db, blacklistKey = "jpmBlacklist") {
  const allGroups = await fetchGroupsSafe(sock);
  let groupIds = Object.keys(allGroups);
  const blacklist = db.setting("jpmBlacklist") || [];
  const autoBlacklist = db.setting(blacklistKey) || [];
  const fullBlacklist = [...new Set([...blacklist, ...autoBlacklist])];
  const blacklistedCount = groupIds.filter((id) =>
    fullBlacklist.includes(id),
  ).length;
  groupIds = groupIds.filter((id) => !fullBlacklist.includes(id));
  return { groupIds, allGroups, blacklistedCount };
}

async function sendInteractiveMessage(
  m,
  sock,
  { title, body, footer, buttons },
) {
  let headerMedia = null;
  if (cachedThumb) {
    try {
      headerMedia = await prepareWAMessageMedia(
        { image: cachedThumb },
        { upload: sock.waUploadToServer },
      );
    } catch {}
  }

  const botName = config.bot?.name || "Rimuru-AI";
  const saluranId = config.saluran?.id || "120363412350560864@newsletter";
  const saluranName = config.saluran?.name || botName;

  const msg = generateWAMessageFromContent(
    m.chat,
    {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2,
          },
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: proto.Message.InteractiveMessage.Body.fromObject({
              text: body,
            }),
            footer: proto.Message.InteractiveMessage.Footer.fromObject({
              text: footer || `${botName} JPM System`,
            }),
            header: proto.Message.InteractiveMessage.Header.fromObject({
              hasMediaAttachment: !!headerMedia,
              ...(headerMedia || {}),
            }),
            nativeFlowMessage:
              proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                buttons,
              }),
            contextInfo: {
              mentionedJid: [m.sender],
              forwardingScore: 9,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: saluranId,
                newsletterName: saluranName,
                serverMessageId: 127,
              },
            },
          }),
        },
      },
    },
    { userJid: m.sender, quoted: getVerifiedQuoted() },
  );

  await sock.relayMessage(m.chat, msg.message, {
    messageId: msg.key.id,
  });
}

async function sendInteractiveJpm(m, sock, db, contentInfo) {
  const prefix = m.prefix;
  const botName = config.bot?.name || "Rimuru-AI";
  const hasContent =
    contentInfo?.text ||
    contentInfo?.mediaBuffer ||
    contentInfo?.mediaList?.length >= 3;

  const autoJpmCfg = getAutoJpmConfig();
  const autoJpmStatus = autoJpmCfg.enabled ? "✅ Aktif" : "❌ Nonaktif";
  const currentDelay = db.setting("jedaJpm") || 5000;
  const blCount = (db.setting("jpmBlacklist") || []).length;
  const autoBlCount = (db.setting("autoJpmBlacklist") || []).length;

  let body =
    `📢 *JPM — Sistem Broadcast Massal*\n\n` +
    `Kirim pesan ke seluruh grup, channel, atau target tertentu secara otomatis maupun manual.\n\n` +
    `*Status saat ini:*\n` +
    `> ⏱️ Delay: *${(currentDelay / 1000).toFixed(1)} detik*\n` +
    `> 🔄 AutoJPM: *${autoJpmStatus}*\n` +
    `> 🚫 Blacklist JPM: *${blCount} grup*\n` +
    `> 🚫 Blacklist Auto: *${autoBlCount} grup*\n` +
    `> 📢 JPM Berjalan: *${global.statusjpm ? "⚠️ Ya" : "Tidak"}*`;

  if (hasContent) {
    body +=
      `\n\n📝 *Konten yang siap dikirim:*\n` +
      `> Teks: *${contentInfo?.text ? previewText(contentInfo.text) : "Tidak ada"}*\n` +
      `> Media: *${contentInfo?.mediaList?.length >= 3 ? `${contentInfo.mediaList.length} foto` : contentInfo?.mediaBuffer ? contentInfo.mediaType : "Tidak ada"}*\n\n` +
      `_Pilih mode pengiriman di bawah untuk mulai broadcast_`;
  } else {
    body +=
      `\n\n💡 *Cara pakai:*\n` +
      `1. Kirim teks, foto, audio, atau video\n` +
      `2. Reply pesan tersebut dengan *${prefix}jpm*\n` +
      `3. Pilih mode pengiriman dari tombol di bawah\n\n` +
      `_Atau langsung pilih mode dulu, lalu kirim kontennya_`;
  }

  const buttons = [
    {
      name: "single_select",
      buttonParamsJson: JSON.stringify({
        title: "📢 Pilih Mode JPM",
        sections: [
          {
            title: "📨 MODE BROADCAST",
            rows: [
              {
                title: "📢 JPM Basic",
                description: "Kirim pesan ke semua grup tanpa tag",
                id: `${prefix}jpm _mode_basic`,
              },
              {
                title: "👁️ JPM Hidetag",
                description: "Kirim pesan ke semua grup, tag tersembunyi",
                id: `${prefix}jpm _mode_hidetag`,
              },
              {
                title: "📺 JPM Channel",
                description: "Kirim pesan ke semua channel newsletter",
                id: `${prefix}jpm _mode_channel`,
              },
              {
                title: "🚀 JPM Update",
                description: "Broadcast changelog/update ke semua grup",
                id: `${prefix}jpm _mode_update`,
              },
              {
                title: "🔄 Auto JPM",
                description: "Atur jadwal siaran otomatis berdasar interval",
                id: `${prefix}jpm _mode_autojpm`,
              },
            ],
          },
          {
            title: "⚙️ PENGATURAN",
            rows: [
              {
                title: "⏱️ Atur Delay JPM",
                description: `Delay saat ini: ${(currentDelay / 1000).toFixed(1)}s`,
                id: `${prefix}jpm _set_delay`,
              },
              {
                title: "🚫 Blacklist JPM",
                description: `Kelola grup yang dikecualikan dari JPM (${blCount})`,
                id: `${prefix}jpm _bl_jpm`,
              },
              {
                title: "🚫 Blacklist AutoJPM",
                description: `Kelola grup yang dikecualikan dari AutoJPM (${autoBlCount})`,
                id: `${prefix}jpm _bl_autojpm`,
              },
              {
                title: "⏹️ Stop JPM",
                description: "Hentikan JPM yang sedang berjalan",
                id: `${prefix}jpm _stop`,
              },
              {
                title: "📊 Status AutoJPM",
                description: "Cek jadwal & detail auto JPM",
                id: `${prefix}jpm _autojpm_status`,
              },
            ],
          },
        ],
      }),
    },
    {
      name: "quick_reply",
      buttonParamsJson: JSON.stringify({
        display_text: "❓ Bantuan",
        id: `${prefix}jpm _help`,
      }),
    },
  ];

  return sendInteractiveMessage(m, sock, {
    title: `📢 ${botName} JPM`,
    body,
    footer: `${botName} JPM System`,
    buttons,
  });
}

async function runBroadcast(
  sock,
  m,
  db,
  { groupIds, allGroups, mode, text, mediaBuffer, mediaType, mediaList = [] },
) {
  const jedaJpm = db.setting("jedaJpm") || 5000;
  const ctx = saluranCtx();
  const isHidetag = mode === "hidetag";
  const modeLabel = isHidetag
    ? "Hidetag"
    : mode === "channel"
      ? "Channel"
      : mode === "update"
        ? "Update"
        : "Basic";

  await m.reply(
    `📢 *JPM ${modeLabel} Dimulai*\n\n` +
      `> 📝 Pesan: *${text.substring(0, 50)}${text.length > 50 ? "..." : ""}*\n` +
      `> 📷 Media: *${mediaBuffer ? mediaType : "Tidak ada"}*\n` +
      `> 👥 Target: *${groupIds.length}* ${mode === "channel" ? "channel" : "grup"}\n` +
      `> ⏱️ Jeda: *${(jedaJpm / 1000).toFixed(1)} detik*\n` +
      `> 📊 Estimasi: *${Math.ceil((groupIds.length * jedaJpm) / 60000)} menit*\n\n` +
      `_Sedang mengirim ke semua target..._`,
  );

  global.statusjpm = true;
  let successCount = 0;
  let failedCount = 0;

  for (const targetId of groupIds) {
    if (global.stopjpm) {
      delete global.stopjpm;
      delete global.statusjpm;
      await m.reply(
        `⏹️ *JPM Dihentikan*\n\n` +
          `> ✅ Berhasil: *${successCount}*\n` +
          `> ❌ Gagal: *${failedCount}*\n` +
          `> ⏸️ Sisa: *${groupIds.length - successCount - failedCount}*`,
      );
      return;
    }

    try {
      if (isHidetag && allGroups[targetId]) {
        const mentions = allGroups[targetId].participants
          .map((p) => p.id || p.jid)
          .filter(Boolean);
        const hidetagCtx = { ...ctx, mentionedJid: mentions };
        if (mediaList.length >= 3) {
          for (let i = 0; i < mediaList.length; i++) {
            const media = mediaList[i];
            await sock.sendMessage(targetId, {
              image: media.buffer,
              caption: i === 0 ? text || media.caption : "",
              mimetype: media.mimetype,
              mentions,
              contextInfo: hidetagCtx,
            });
          }
        } else if (mediaBuffer) {
          await sock.sendMessage(targetId, {
            [mediaType]: mediaBuffer,
            caption: text,
            mentions,
            contextInfo: hidetagCtx,
          });
        } else {
          await sock.sendMessage(targetId, {
            text,
            mentions,
            contextInfo: hidetagCtx,
          });
        }
      } else if (mediaList.length >= 3) {
        for (let i = 0; i < mediaList.length; i++) {
          const media = mediaList[i];
          await sock.sendMessage(targetId, {
            image: media.buffer,
            caption: i === 0 ? text || media.caption : "",
            mimetype: media.mimetype,
            contextInfo: { forwardingScore: 99, isForwarded: true },
          });
        }
      } else if (mediaBuffer) {
        await sock.sendMedia(targetId, mediaBuffer, text, null, {
          type: mediaType,
          contextInfo: { forwardingScore: 99, isForwarded: true },
        });
      } else {
        await sock.sendText(targetId, text, null, {
          contextInfo: { forwardingScore: 99, isForwarded: true },
        });
      }
      successCount++;
    } catch {
      failedCount++;
    }

    await new Promise((resolve) => setTimeout(resolve, jedaJpm));
  }

  delete global.statusjpm;
  m.react("✅");
  await m.reply(
    `✅ *JPM ${modeLabel} Selesai!*\n\n` +
      `> ✅ Berhasil: *${successCount}*\n` +
      `> ❌ Gagal: *${failedCount}*\n` +
      `> 📊 Total: *${groupIds.length}*`,
  );
}

function showHelp(m) {
  const p = m.prefix;
  return m.reply(
    `📢 *JPM — Sistem Broadcast Massal*\n\n` +
      `Sistem lengkap untuk mengirim pesan ke seluruh grup, channel, atau target tertentu secara otomatis maupun manual.\n\n` +
      `*CARA PAKAI:*\n` +
      `> Ketik *${p}jpm* untuk membuka menu interaktif\n` +
      `> Bisa reply/kirim teks, foto, audio, atau video lalu ketik *${p}jpm*\n` +
      `> Pilih mode pengiriman dari tombol yang muncul\n\n` +
      `*MODE BROADCAST:*\n` +
      `> 📢 *JPM Basic* — Kirim pesan ke semua grup tanpa tag\n` +
      `> 👁️ *JPM Hidetag* — Kirim pesan ke semua grup, tag tersembunyi\n` +
      `> 📺 *JPM Channel* — Kirim pesan ke semua channel newsletter\n` +
      `> 🚀 *JPM Update* — Broadcast changelog/update ke semua grup\n` +
      `> 🔄 *Auto JPM* — Atur jadwal siaran otomatis berdasar interval\n\n` +
      `*PENGATURAN:*\n` +
      `> ⏱️ *Atur Delay* — Jeda antar pengiriman per grup\n` +
      `> 🚫 *Blacklist JPM* — Kelola grup yang dikecualikan dari JPM\n` +
      `> 🚫 *Blacklist AutoJPM* — Kelola grup yang dikecualikan dari AutoJPM\n` +
      `> ⏹️ *Stop JPM* — Hentikan JPM yang sedang berjalan\n\n` +
      `*FORMAT INTERVAL:*\n` +
      `> *10m* (10 menit) • *1h* (1 jam) • *2h30m* (2 jam 30 menit) • *1d* (1 hari)`,
  );
}

async function handler(m, { sock }) {
  const db = getDatabase();
  const command = m.command?.toLowerCase() || "";
  const input = (m.text || "").trim();
  const fullInput = (m.fullArgs || m.text || "").trim();

  if (command === "stopjpm" || command === "stopjasher") {
    if (!global.statusjpm)
      return m.reply(`❌ Tidak ada JPM yang sedang berjalan.`);
    global.stopjpm = true;
    m.react("⏹️");
    return m.reply(`⏹️ *JPM Dihentikan*\n\n> Proses JPM sedang dihentikan...`);
  }

  if (
    command === "setdelayjpm" ||
    command === "delayjpm" ||
    command === "jedajpm" ||
    command === "setjedajpm"
  ) {
    return handleSetDelay(m, sock, db, input);
  }

  if (
    command === "blacklistjpm" ||
    command === "bljpm" ||
    command === "jpmbl" ||
    command === "jpmblacklist" ||
    command === "listblacklistjpm"
  ) {
    return handleBlacklist(m, sock, db, "jpmBlacklist", "JPM");
  }

  if (
    command === "blautojpm" ||
    command === "blacklistautojpm" ||
    command === "autojpmbl" ||
    command === "listblautojpm"
  ) {
    return handleBlacklist(m, sock, db, "autoJpmBlacklist", "AUTO JPM");
  }

  if (command === "autojpm" || command === "autojasher") {
    return handleAutoJpm(m, sock, db, input, fullInput);
  }

  if (
    command === "jpmupdate" ||
    command === "updatejpm" ||
    command === "broadcastupdate"
  ) {
    return handleJpmUpdate(m, sock, db, input);
  }

  if (command === "jpmch" || command === "jpmchannel") {
    return handleJpmChannel(m, sock, db, fullInput);
  }

  if (command === "jpmht" || command === "jpmhidetag") {
    return handleJpmDirect(m, sock, db, fullInput, "hidetag");
  }

  if (command === "jpm" || command === "jasher" || command === "jaser") {
    return handleJpmMain(m, sock, db, fullInput);
  }

  return showHelp(m);
}

async function handleJpmMain(m, sock, db, fullInput) {
  if (fullInput.startsWith("_")) {
    return handleInternalCommand(m, sock, db, fullInput);
  }

  let mediaBuffer = null;
  let mediaType = null;
  let mediaList = [];
  let text = fullInput || "";
  const qmsg = m.quoted || m;

  if (!text && m.quoted) {
    text = m.quoted.body || m.quoted.text || m.quoted.contentText || "";
  }

  if (!m.quoted || qmsg.isImage) {
    try {
      const recentImages = await collectRecentJpmImages(m, sock);
      if (recentImages.length >= 3) mediaList = recentImages;
    } catch {}
  }

  if (mediaList.length >= 3) {
    mediaBuffer = mediaList[0].buffer;
    mediaType = "image";
  } else if (qmsg.isImage) {
    try {
      mediaBuffer = await qmsg.download();
      mediaType = "image";
    } catch {}
  } else if (qmsg.isVideo) {
    try {
      mediaBuffer = await qmsg.download();
      mediaType = "video";
    } catch {}
  } else if (qmsg.isAudio || qmsg.mimetype?.startsWith("audio")) {
    try {
      mediaBuffer = await qmsg.download();
      mediaType = "audio";
    } catch {}
  } else if (
    qmsg.isDocument ||
    (qmsg.mimetype && !qmsg.mimetype.startsWith("text/plain"))
  ) {
    try {
      mediaBuffer = await qmsg.download();
      mediaType = "document";
    } catch {}
  }

  const contentInfo =
    mediaBuffer || text || mediaList.length >= 3
      ? { text, mediaBuffer, mediaType, mediaList }
      : null;

  if (contentInfo) {
    jpmSessions[m.sender] = {
      text,
      mediaBuffer,
      mediaType,
      mediaList,
      timestamp: Date.now(),
    };
  }

  return sendInteractiveJpm(m, sock, db, contentInfo);
}

async function handleInternalCommand(m, sock, db, fullInput) {
  const prefix = m.prefix;
  const cmd = fullInput.trim();

  if (cmd === "_mode_basic") return executeJpmWithSession(m, sock, db, "basic");
  if (cmd === "_mode_hidetag")
    return executeJpmWithSession(m, sock, db, "hidetag");
  if (cmd === "_mode_channel")
    return executeJpmWithSession(m, sock, db, "channel");
  if (cmd === "_mode_update")
    return executeJpmWithSession(m, sock, db, "update");
  if (cmd === "_mode_autojpm") return startAutoJpmSession(m, sock, db);
  if (cmd === "_set_delay") return handleSetDelay(m, sock, db, "");
  if (cmd === "_bl_jpm")
    return handleBlacklist(m, sock, db, "jpmBlacklist", "JPM");
  if (cmd === "_bl_autojpm")
    return handleBlacklist(m, sock, db, "autoJpmBlacklist", "AUTO JPM");
  if (cmd === "_autojpm_status") return showAutoJpmStatus(m);

  if (cmd === "_stop") {
    if (!global.statusjpm)
      return m.reply(`❌ Tidak ada JPM yang sedang berjalan.`);
    global.stopjpm = true;
    m.react("⏹️");
    return m.reply(`⏹️ *JPM Dihentikan*\n\n> Proses JPM sedang dihentikan...`);
  }

  if (cmd === "_help") return showHelp(m);

  if (cmd.startsWith("_autojpm_interval_")) {
    const intervalStr = cmd.replace("_autojpm_interval_", "");
    return completeAutoJpmSetup(m, sock, db, intervalStr);
  }

  if (cmd.startsWith("_delay_")) {
    const ms = parseInt(cmd.replace("_delay_", ""));
    if (!isNaN(ms) && ms >= 1000 && ms <= 30000) {
      return handleSetDelay(m, sock, db, String(ms));
    }
  }

  return m.reply(
    `❌ Perintah tidak dikenali. Ketik *${prefix}jpm* untuk membuka menu.`,
  );
}

async function executeJpmWithSession(m, sock, db, mode) {
  const session = jpmSessions[m.sender];
  const text = session?.text || "";
  const mediaBuffer = session?.mediaBuffer || null;
  const mediaType = session?.mediaType || null;
  const mediaList = session?.mediaList || [];

  if (!text && !mediaBuffer && mediaList.length < 3) {
    return m.reply(
      `❌ *Tidak Ada Konten*\n\n` +
        `Kirim pesan, foto, audio, atau video terlebih dahulu, lalu reply dengan *${m.prefix}jpm* dan pilih mode pengiriman.\n\n` +
        `*Cara yang benar:*\n` +
        `1. Kirim teks/foto/video/audio\n` +
        `2. Reply pesan tersebut dengan *${m.prefix}jpm*\n` +
        `3. Pilih mode dari tombol yang muncul`,
    );
  }

  if (mode === "update") return handleJpmUpdateWithContent(m, sock, db, text);
  if (mode === "channel")
    return handleJpmChannelWithContent(
      m,
      sock,
      db,
      text,
      mediaBuffer,
      mediaType,
    );

  if (global.statusjpm) {
    return m.reply(
      `❌ *JPM Sedang Berjalan*\n\n> Ketik *${m.prefix}stopjpm* untuk menghentikan terlebih dahulu.`,
    );
  }

  m.react("📢");

  try {
    const { groupIds, allGroups, blacklistedCount } = await getTargetGroups(
      sock,
      db,
    );
    if (groupIds.length === 0) {
      m.react("❌");
      return m.reply(
        `❌ *Tidak Ada Grup*\n\n` +
          `> Bot tidak menemukan grup yang bisa dituju${blacklistedCount > 0 ? ` (${blacklistedCount} grup di-blacklist)` : ""}`,
      );
    }
    await runBroadcast(sock, m, db, {
      groupIds,
      allGroups,
      mode,
      text,
      mediaBuffer,
      mediaType,
      mediaList,
    });
  } catch (error) {
    delete global.statusjpm;
    m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  } finally {
    delete jpmSessions[m.sender];
  }
}

async function handleJpmDirect(m, sock, db, text, mode) {
  if (!text && m.quoted) {
    text = m.quoted.body || m.quoted.text || m.quoted.contentText || "";
  }

  if (!text) {
    const modeLabel = mode === "hidetag" ? "Hidetag" : "Basic";
    return m.reply(
      `📢 *JPM ${modeLabel}*\n\n` +
        `Kirim pesan broadcast ke seluruh grup${mode === "hidetag" ? " dengan tag semua member secara tersembunyi" : ""}.\n\n` +
        `*PENGGUNAAN:*\n` +
        `> *${m.prefix}${mode === "hidetag" ? "jpmht" : "jpm"} <pesan>*\n` +
        `> *${m.prefix}${mode === "hidetag" ? "jpmht" : "jpm"}* (reply foto/video)\n\n` +
        `*CONTOH:*\n` +
        `> *${m.prefix}${mode === "hidetag" ? "jpmht" : "jpm"} Halo semuanya! Jangan lupa event besok.*`,
    );
  }

  if (global.statusjpm) {
    return m.reply(
      `❌ *JPM Sedang Berjalan*\n\n> Ketik *${m.prefix}stopjpm* untuk menghentikan.`,
    );
  }

  m.react("📢");

  try {
    let mediaBuffer = null;
    let mediaType = null;
    const qmsg = m.quoted || m;
    if (qmsg.isImage) {
      try {
        mediaBuffer = await qmsg.download();
        mediaType = "image";
      } catch {}
    } else if (qmsg.isVideo) {
      try {
        mediaBuffer = await qmsg.download();
        mediaType = "video";
      } catch {}
    }

    const { groupIds, allGroups, blacklistedCount } = await getTargetGroups(
      sock,
      db,
    );
    if (groupIds.length === 0) {
      m.react("❌");
      return m.reply(
        `❌ *Tidak Ada Grup*\n\n> Bot tidak menemukan grup yang bisa dituju${blacklistedCount > 0 ? ` (${blacklistedCount} grup di-blacklist)` : ""}`,
      );
    }

    await runBroadcast(sock, m, db, {
      groupIds,
      allGroups,
      mode,
      text,
      mediaBuffer,
      mediaType,
    });
  } catch (error) {
    delete global.statusjpm;
    m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

async function handleJpmChannel(m, sock, db, text) {
  if (!text && m.quoted) {
    text = m.quoted.body || m.quoted.text || m.quoted.contentText || "";
  }

  if (!text) {
    return m.reply(
      `📢 *JPM Channel*\n\n` +
        `Kirim pesan ke semua channel WhatsApp yang di-subscribe bot.\n\n` +
        `*PENGGUNAAN:*\n` +
        `> *${m.prefix}jpmch <pesan>*\n` +
        `> *${m.prefix}jpmch* (reply foto/video)\n\n` +
        `*CONTOH:*\n` +
        `> *${m.prefix}jpmch Halo semua, ikuti update terbaru kami!*`,
    );
  }
  return handleJpmChannelWithContent(m, sock, db, text, null, null);
}

async function handleJpmChannelWithContent(
  m,
  sock,
  db,
  text,
  mediaBuffer,
  mediaType,
) {
  if (global.statusjpm) {
    return m.reply(
      `❌ *JPM Sedang Berjalan*\n\n> Ketik *${m.prefix}stopjpm* untuk menghentikan.`,
    );
  }

  m.react("📢");

  try {
    if (!mediaBuffer) {
      const qmsg = m.quoted || m;
      if (qmsg.isImage) {
        try {
          mediaBuffer = await qmsg.download();
          mediaType = "image";
        } catch {}
      } else if (qmsg.isVideo) {
        try {
          mediaBuffer = await qmsg.download();
          mediaType = "video";
        } catch {}
      }
    }

    const channels = await fetchAllSubscribedChannels(sock);
    const channelIds = Object.keys(channels);
    if (channelIds.length === 0) {
      m.react("❌");
      return m.reply(
        `❌ *Tidak Ada Channel*\n\n> Bot belum subscribe channel apapun`,
      );
    }

    const jedaJpm = db.setting("jedaJpm") || 5000;
    const ctx = saluranCtx();

    await m.reply(
      `📢 *JPM Channel Dimulai*\n\n` +
        `> 📝 Pesan: *${text.substring(0, 50)}${text.length > 50 ? "..." : ""}*\n` +
        `> 📷 Media: *${mediaBuffer ? mediaType : "Tidak ada"}*\n` +
        `> 📺 Target: *${channelIds.length}* channel\n` +
        `> ⏱️ Jeda: *${(jedaJpm / 1000).toFixed(1)} detik*\n\n` +
        `_Sedang mengirim ke semua channel..._`,
    );

    global.statusjpm = true;
    let successCount = 0;
    let failedCount = 0;

    for (const chId of channelIds) {
      if (global.stopjpm) {
        delete global.stopjpm;
        delete global.statusjpm;
        await m.reply(
          `⏹️ *JPM Channel Dihentikan*\n\n` +
            `> ✅ Berhasil: *${successCount}*\n` +
            `> ❌ Gagal: *${failedCount}*`,
        );
        return;
      }
      try {
        if (mediaBuffer) {
          await sock.sendMessage(chId, {
            [mediaType]: mediaBuffer,
            caption: text,
            contextInfo: ctx,
          });
        } else {
          await sock.sendMessage(chId, { text, contextInfo: ctx });
        }
        successCount++;
      } catch {
        failedCount++;
      }
      await new Promise((resolve) => setTimeout(resolve, jedaJpm));
    }

    delete global.statusjpm;
    m.react("✅");
    await m.reply(
      `✅ *JPM Channel Selesai!*\n\n` +
        `> ✅ Berhasil: *${successCount}*\n` +
        `> ❌ Gagal: *${failedCount}*\n` +
        `> 📊 Total: *${channelIds.length}*`,
    );
  } catch (error) {
    delete global.statusjpm;
    m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

async function handleJpmUpdate(m, sock, db, input) {
  if (!input && m.quoted) {
    input = m.quoted.body || m.quoted.text || m.quoted.contentText || "";
  }

  if (!input) {
    return m.reply(
      `📢 *JPM Update*\n\n` +
        `Kirim informasi update / changelog ke seluruh grup!\n\n` +
        `*FORMAT:*\n` +
        `> *${m.prefix}jpmupdate <versi> | <isi changelog>*\n\n` +
        `*CONTOH:*\n` +
        `> *${m.prefix}jpmupdate v3.0 | Fitur Baru: - JPM Hidetag - Sistem AFK*`,
    );
  }
  return handleJpmUpdateWithContent(m, sock, db, input);
}

async function handleJpmUpdateWithContent(m, sock, db, input) {
  if (global.statusjpm) {
    return m.reply(
      `❌ *JPM Sedang Berjalan*\n\n> Ketik *${m.prefix}stopjpm* untuk menghentikan.`,
    );
  }

  let version = config.bot?.version || "v1.0";
  let changelog = input;
  if (input.includes("|")) {
    const parts = input.split("|");
    version = parts[0].trim();
    changelog = parts.slice(1).join("|").trim();
  }
  if (!changelog) return m.reply(`❌ Changelog tidak boleh kosong!`);

  m.react("🕕");

  try {
    const { groupIds, blacklistedCount } = await getTargetGroups(sock, db);
    if (groupIds.length === 0) {
      m.react("❌");
      return m.reply(
        `❌ *Tidak Ada Grup*\n\n> Bot tidak menemukan grup yang bisa dituju${blacklistedCount > 0 ? ` (${blacklistedCount} grup di-blacklist)` : ""}`,
      );
    }

    const botName = config.bot?.name || "Rimuru-AI";
    const dateStr = timeHelper.formatDate("DD MMMM YYYY");
    const updateMessage =
      `🚀 *UPDATE !! | ${version}*\n\n` +
      `📅 *Tanggal:* ${dateStr}\n\n` +
      `*CHANGELOG:*\n${changelog}\n\n` +
      `*CATATAN TERBARU:*\n` +
      `> 💡 Ketik *${m.prefix}menu* untuk mengeksplorasi fitur-fitur ini.\n` +
      `> 📢 _Terima kasih telah menggunakan ${botName}_`;

    const jedaJpm = db.setting("jedaJpm") || 5000;

    await m.reply(
      `📢 *JPM Update Dimulai*\n\n` +
        `> 🏷️ Versi: *${version}*\n` +
        `> 👥 Target: *${groupIds.length}* grup\n` +
        `> ⏱️ Jeda: *${(jedaJpm / 1000).toFixed(1)} detik*\n\n` +
        `_Sedang broadcast update ke semua grup..._`,
    );

    global.statusjpm = true;
    let successCount = 0;
    let failedCount = 0;

    for (const groupId of groupIds) {
      if (global.stopjpm) {
        delete global.stopjpm;
        delete global.statusjpm;
        await m.reply(
          `⏹️ *JPM Update Dihentikan*\n\n` +
            `> ✅ Berhasil: *${successCount}*\n` +
            `> ❌ Gagal: *${failedCount}*\n` +
            `> ⏸️ Sisa: *${groupIds.length - successCount - failedCount}*`,
        );
        return;
      }
      try {
        await sock.sendMessage(groupId, {
          text: updateMessage,
          contextInfo: saluranCtx(),
        });
        successCount++;
      } catch {
        failedCount++;
      }
      await new Promise((resolve) => setTimeout(resolve, jedaJpm));
    }

    delete global.statusjpm;
    m.react("✅");
    await m.reply(
      `✅ *JPM Update Selesai!*\n\n` +
        `> ✅ Sukses: *${successCount}*\n` +
        `> ❌ Gagal: *${failedCount}*\n` +
        `> 📊 Total: *${groupIds.length}*`,
    );
  } catch (error) {
    delete global.statusjpm;
    m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

async function startAutoJpmSession(m, sock, db) {
  const session = jpmSessions[m.sender];
  const prefix = m.prefix;
  const hasContent = session?.text || session?.mediaBuffer;

  let body =
    `🔄 *Auto JPM — Sesi Pengaturan*\n\n` +
    `Bot akan mengirim pesan secara otomatis ke seluruh grup berdasarkan interval waktu yang kamu tentukan.\n\n`;

  if (hasContent) {
    body +=
      `📝 *Konten yang akan dikirim:*\n` +
      `> Teks: *${session.text ? previewText(session.text) : "Tidak ada"}*\n` +
      `> Media: *${session.mediaBuffer ? session.mediaType : "Tidak ada"}*\n\n`;
  }

  body +=
    `*Pilih interval di bawah:*\n` +
    `> Semakin lama interval, semakin aman dari spam detection.\n` +
    `> Minimal: *15 menit*`;

  const buttons = [
    {
      name: "single_select",
      buttonParamsJson: JSON.stringify({
        title: "⏱️ Pilih Interval",
        sections: [
          {
            title: "⏱️ INTERVAL POPULER",
            rows: [
              {
                title: "🕐 15 Menit",
                description: "Cocok untuk pengingat singkat",
                id: `${prefix}jpm _autojpm_interval_15m`,
              },
              {
                title: "🕐 30 Menit",
                description: "Interval standar",
                id: `${prefix}jpm _autojpm_interval_30m`,
              },
              {
                title: "🕐 1 Jam",
                description: "Paling umum digunakan",
                id: `${prefix}jpm _autojpm_interval_1h`,
              },
              {
                title: "🕐 2 Jam",
                description: "Aman & tidak mengganggu",
                id: `${prefix}jpm _autojpm_interval_2h`,
              },
              {
                title: "🕐 3 Jam",
                description: "Sangat aman dari spam",
                id: `${prefix}jpm _autojpm_interval_3h`,
              },
              {
                title: "🕐 6 Jam",
                description: "Setengah hari sekali",
                id: `${prefix}jpm _autojpm_interval_6h`,
              },
              {
                title: "🕐 12 Jam",
                description: "Dua kali sehari",
                id: `${prefix}jpm _autojpm_interval_12h`,
              },
              {
                title: "🕐 1 Hari",
                description: "Sekali sehari",
                id: `${prefix}jpm _autojpm_interval_1d`,
              },
            ],
          },
          {
            title: "⚙️ KUSTOM",
            rows: [
              {
                title: "✏️ Input Manual",
                description:
                  "Ketik interval sendiri (contoh: .autojpm on 2h30m pesan)",
                id: `${prefix}jpm _help`,
              },
            ],
          },
        ],
      }),
    },
    {
      name: "quick_reply",
      buttonParamsJson: JSON.stringify({
        display_text: "❌ Batal",
        id: `${prefix}jpm`,
      }),
    },
  ];

  return sendInteractiveMessage(m, sock, {
    title: `🔄 ${config.bot?.name || "Rimuru-AI"} AutoJPM`,
    body,
    footer: `${config.bot?.name || "Rimuru-AI"} AutoJPM`,
    buttons,
  });
}

async function completeAutoJpmSetup(m, sock, db, intervalStr) {
  const intervalMs = parseInterval(intervalStr);
  if (!intervalMs)
    return m.reply(
      `❌ Interval tidak valid. Contoh: *15m*, *1h*, *2h30m*, *1d*`,
    );
  if (intervalMs < 15 * 60 * 1000)
    return m.reply(`❌ Interval minimal *15 menit* untuk mencegah spam.`);

  const session = jpmSessions[m.sender];
  const existing = getAutoJpmConfig();
  const quoted = m.quoted || m;
  let messageText = session?.text || "";
  if (!messageText && quoted.body)
    messageText = quoted.body.replace(/\\n/g, "\n").trim();

  let mediaData = existing?.message?.media || null;
  if (session?.mediaBuffer) {
    const buffer = session.mediaBuffer;
    const mType = session.mediaType || "image";
    const mimetype = quoted.mimetype || "image/jpeg";
    const extension = getExtension(mimetype) || "jpg";
    const fileName = `autojpm_${Date.now()}.${extension}`;
    const storageDir = getAutoJpmStorageDir();
    const filePath = path.join(storageDir, fileName);
    fs.writeFileSync(filePath, buffer);
    if (mediaData?.path && mediaData.path !== filePath) {
      try {
        const baseDir = getAutoJpmStorageDir();
        if (
          path.resolve(mediaData.path).startsWith(path.resolve(baseDir)) &&
          fs.existsSync(mediaData.path)
        ) {
          fs.unlinkSync(mediaData.path);
        }
      } catch {}
    }
    mediaData = { type: mType, path: filePath, mimetype, fileName };
  }

  if (
    !messageText &&
    !mediaData &&
    !existing?.message?.text &&
    !existing?.message?.media
  ) {
    return m.reply(
      `❌ *Pesan atau Media Wajib Diisi*\n\n> Kirim konten terlebih dahulu, lalu ketik *${m.prefix}jpm* dan pilih Auto JPM.`,
    );
  }

  const updatedConfig = {
    enabled: true,
    intervalMs,
    message: {
      text: messageText || existing?.message?.text || "",
      media: mediaData,
    },
    lastRun: 0,
    nextRun: Date.now() + intervalMs,
  };

  setAutoJpmConfig(updatedConfig);
  startAutoJpmScheduler(sock);
  delete jpmSessions[m.sender];

  return m.reply(
    `✅ *Auto JPM Aktif!*\n\n` +
      `> ⏱️ Interval: *${formatInterval(intervalMs)}*\n` +
      `> 🕒 Pertama kali: *${timeHelper.fromTimestamp(updatedConfig.nextRun)}*\n` +
      `> 📷 Media: *${updatedConfig.message.media?.type || "Tidak ada"}*\n` +
      `> 📝 Pesan: *${previewText(updatedConfig.message.text)}*\n\n` +
      `_AutoJPM akan berjalan secara otomatis sesuai jadwal._`,
  );
}

async function handleAutoJpm(m, sock, db, input, fullInput) {
  const prefix = m.prefix;
  if (!input) return startAutoJpmSession(m, sock, db);

  const match = input.match(/^(\S+)(?:\s+(\S+))?(?:\s+([\s\S]*))?$/);
  const action = match?.[1]?.toLowerCase() || "";
  const intervalRaw = match?.[2];
  const messageRaw = match?.[3];

  if (["off", "stop", "disable"].includes(action)) {
    const current = getAutoJpmConfig();
    if (!current.enabled) return m.reply(`ℹ️ AutoJPM sudah nonaktif.`);
    setAutoJpmConfig({ ...current, enabled: false });
    stopAutoJpmScheduler();
    return m.reply(
      `✅ *AutoJPM Dinonaktifkan*\n\n> Jadwal siaran otomatis telah dimatikan.`,
    );
  }

  if (["status", "info"].includes(action)) return showAutoJpmStatus(m);

  if (!["on", "start", "enable"].includes(action)) {
    return m.reply(
      `❌ Format salah. Gunakan *${prefix}autojpm on/off/status*.`,
    );
  }

  if (!intervalRaw) return startAutoJpmSession(m, sock, db);

  const intervalMs = parseInterval(intervalRaw);
  if (!intervalMs)
    return m.reply(
      `❌ Interval tidak valid. Contoh: *10m*, *1h*, *2h30m*, *1d*.`,
    );
  if (intervalMs < 15 * 60 * 1000)
    return m.reply(`❌ Interval minimal *15 menit* untuk mencegah spam.`);

  const existing = getAutoJpmConfig();
  const quoted = m.quoted || m;
  let messageText = (messageRaw || "").replace(/\\n/g, "\n").trim();
  if (!messageText && quoted.body)
    messageText = quoted.body.replace(/\\n/g, "\n").trim();

  let mediaData = existing?.message?.media || null;
  if (quoted.isImage || quoted.isVideo || quoted.isAudio || quoted.isDocument) {
    const buffer = await quoted.download();
    if (buffer) {
      const mediaType = quoted.isImage
        ? "image"
        : quoted.isVideo
          ? "video"
          : quoted.isAudio
            ? "audio"
            : "document";
      const mimetype = quoted.mimetype || getMimeType(buffer);
      const extension = getExtension(mimetype);
      const fileName = quoted.fileName || `autojpm_${Date.now()}.${extension}`;
      const storageDir = getAutoJpmStorageDir();
      const filePath = path.join(storageDir, fileName);
      fs.writeFileSync(filePath, buffer);
      if (mediaData?.path && mediaData.path !== filePath) {
        try {
          const baseDir = getAutoJpmStorageDir();
          if (
            path.resolve(mediaData.path).startsWith(path.resolve(baseDir)) &&
            fs.existsSync(mediaData.path)
          ) {
            fs.unlinkSync(mediaData.path);
          }
        } catch {}
      }
      mediaData = { type: mediaType, path: filePath, mimetype, fileName };
    }
  }

  if (
    !messageText &&
    !mediaData &&
    !existing?.message?.text &&
    !existing?.message?.media
  ) {
    return m.reply(`❌ Pesan atau media wajib diisi.`);
  }

  const updatedConfig = {
    enabled: true,
    intervalMs,
    message: {
      text: messageText || existing?.message?.text || "",
      media: mediaData,
    },
    lastRun: 0,
    nextRun: Date.now() + intervalMs,
  };

  setAutoJpmConfig(updatedConfig);
  startAutoJpmScheduler(sock);

  return m.reply(
    `✅ *Auto JPM Aktif!*\n\n` +
      `> ⏱️ Interval: *${formatInterval(intervalMs)}*\n` +
      `> 🕒 Pertama kali: *${timeHelper.fromTimestamp(updatedConfig.nextRun)}*\n` +
      `> 📷 Media: *${updatedConfig.message.media?.type || "Tidak ada"}*\n` +
      `> 📝 Pesan: *${previewText(updatedConfig.message.text)}*`,
  );
}

function showAutoJpmStatus(m) {
  const current = getAutoJpmConfig();
  if (!current?.message)
    return m.reply(
      `ℹ️ AutoJPM belum dikonfigurasi. Ketik *${m.prefix}jpm* untuk mengatur.`,
    );
  return m.reply(
    `📢 *Status Auto JPM*\n\n` +
      `> Status: *${current.enabled ? "✅ Aktif" : "❌ Nonaktif"}*\n` +
      `> Interval: *${formatInterval(current.intervalMs || 0)}*\n\n` +
      `*Jadwal:*\n` +
      `> Terakhir: *${current.lastRun ? timeHelper.fromTimestamp(current.lastRun) : "Belum pernah"}*\n` +
      `> Berikutnya: *${current.nextRun ? timeHelper.fromTimestamp(current.nextRun) : "Belum dijadwalkan"}*\n\n` +
      `*Pesan:*\n` +
      `> Teks: *${previewText(current.message?.text)}*\n` +
      `> Media: *${current.message?.media?.type ? current.message.media.type.toUpperCase() : "Tidak ada"}*`,
  );
}

async function handleSetDelay(m, sock, db, input) {
  const current = db.setting("jedaJpm") || 5000;
  const prefix = m.prefix;

  if (!input) {
    const body =
      `⏱️ *JPM Delay*\n\n` +
      `Atur jeda waktu antar pengiriman pesan ke setiap grup.\n` +
      `Semakin lama delay, semakin aman dari spam detection.\n\n` +
      `> Delay saat ini: *${current}ms* (*${(current / 1000).toFixed(1)} detik*)\n\n` +
      `*Pilih delay di bawah:*`;

    const buttons = [
      {
        name: "single_select",
        buttonParamsJson: JSON.stringify({
          title: "⏱️ Pilih Delay",
          sections: [
            {
              title: "⏱️ DELAY POPULER",
              rows: [
                {
                  title: "⚡ 1 detik",
                  description: "Sangat cepat, risiko spam tinggi",
                  id: `${prefix}jpm _delay_1000`,
                },
                {
                  title: "⚡ 2 detik",
                  description: "Cepat, risiko spam sedang",
                  id: `${prefix}jpm _delay_2000`,
                },
                {
                  title: "⚡ 3 detik",
                  description: "Standar, cukup aman",
                  id: `${prefix}jpm _delay_3000`,
                },
                {
                  title: "🕐 5 detik",
                  description: "Aman, paling umum digunakan",
                  id: `${prefix}jpm _delay_5000`,
                },
                {
                  title: "🕐 7 detik",
                  description: "Sangat aman",
                  id: `${prefix}jpm _delay_7000`,
                },
                {
                  title: "🕐 10 detik",
                  description: "Paling aman dari spam",
                  id: `${prefix}jpm _delay_10000`,
                },
                {
                  title: "🕐 15 detik",
                  description: "Untuk grup sangat banyak",
                  id: `${prefix}jpm _delay_15000`,
                },
              ],
            },
          ],
        }),
      },
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "↩️ Kembali",
          id: `${prefix}jpm`,
        }),
      },
    ];

    return sendInteractiveMessage(m, sock, {
      title: `⏱️ ${config.bot?.name || "Rimuru-AI"} Delay`,
      body,
      footer: `${config.bot?.name || "Rimuru-AI"} JPM System`,
      buttons,
    });
  }

  const ms = parseInt(input);
  if (isNaN(ms) || ms < 1000 || ms > 30000) {
    return m.reply(
      `❌ Delay harus antara *1000ms* (1 detik) sampai *30000ms* (30 detik)`,
    );
  }
  db.setting("jedaJpm", ms);
  return m.reply(
    `✅ *Delay JPM Diubah*\n\n` +
      `> Sebelumnya: *${current}ms* (*${(current / 1000).toFixed(1)} detik*)\n` +
      `> Sekarang: *${ms}ms* (*${(ms / 1000).toFixed(1)} detik*)\n\n` +
      `> Estimasi 100 grup: *${Math.ceil((100 * ms) / 60000)} menit*`,
  );
}

async function handleBlacklist(m, sock, db, settingKey, label) {
  let blacklist = db.setting(settingKey) || [];
  const allGroups = await sock.groupFetchAllParticipating();
  const groups = Object.values(allGroups).sort((a, b) =>
    a.subject.localeCompare(b.subject),
  );

  if (!m.text || m.text.trim().startsWith("_")) {
    if (groups.length === 0)
      return m.reply(`❌ Bot belum tergabung di grup mana pun.`);
    let listText =
      `📋 *Daftar Grup & ${label} Blacklist*\n\n` +
      `Berikut *${groups.length} grup* yang diikuti bot *${config.bot?.name}*\n` +
      `Tanda *🚫* berarti grup sedang di-blacklist.\n\n`;
    for (let i = 0; i < groups.length; i++) {
      const isBlacklisted = blacklist.includes(groups[i].id);
      listText += `*${i + 1}.* ${groups[i].subject}${isBlacklisted ? " 🚫" : ""}\n`;
    }
    listText +=
      `\n*CARA BLACKLIST / UN-BLACKLIST:*\n` +
      `Ketik command diikuti nomor grup (bisa lebih dari satu, pisahkan spasi).\n\n` +
      `*Contoh:*\n` +
      `> *${m.prefix}${settingKey === "autoJpmBlacklist" ? "blautojpm" : "bljpm"} 2 3 7*`;
    return m.reply(listText);
  }

  const args = m.text.trim().split(/\s+/);
  const toggled = [];
  for (const numStr of args) {
    const num = parseInt(numStr);
    if (!isNaN(num) && num > 0 && num <= groups.length) {
      const targetGroup = groups[num - 1];
      if (blacklist.includes(targetGroup.id)) {
        blacklist = blacklist.filter((jid) => jid !== targetGroup.id);
        toggled.push(`*${num}.* ${targetGroup.subject} ✅ *(Di-Unblacklist)*`);
      } else {
        blacklist.push(targetGroup.id);
        toggled.push(`*${num}.* ${targetGroup.subject} 🚫 ~(Di-Blacklist)~`);
      }
    }
  }

  if (toggled.length === 0) {
    return m.reply(
      `❌ Tidak ada nomor grup yang valid.\n\nKetik *${m.prefix}${settingKey === "autoJpmBlacklist" ? "blautojpm" : "bljpm"}* untuk melihat daftar nomor.`,
    );
  }

  db.setting(settingKey, blacklist);
  m.react("✅");
  return m.reply(`📢 *${label} Blacklist Diperbarui*\n\n${toggled.join("\n")}`);
}

export { pluginConfig as config, handler };
