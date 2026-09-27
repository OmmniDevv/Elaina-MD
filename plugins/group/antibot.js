/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";
import {
  findParticipantByNumber,
  getParticipantJid,
} from "../../src/lib/elaina-lid.js";
import config from "../../config.js";
const pluginConfig = {
  name: ["antibot", "botdetect"],
  alias: [],
  category: "group",
  description: "Deteksi dan kick bot WhatsApp (baileys) dari grup",
  usage: ".antibot <on/off>",
  example: ".antibot on",
  isOwner: false,
  isPremium: false,
  isGroup: true,
  isPrivate: false,
  isAdmin: true,
  isBotAdmin: true,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

function gpMsg(key, replacements = {}) {
  const defaults = {
    antibot: "🤖 *AntiBot* — @%user% terdeteksi sebagai bot dan di-kick.",
  };
  let text = config.groupProtection?.[key] || defaults[key] || "";
  for (const [k, v] of Object.entries(replacements)) {
    text = text.replace(new RegExp(`%${k}%`, "g"), v);
  }
  return text;
}

function extractMessageId(m) {
  return String(m?.key?.id || m?.id || "").trim();
}

function extractSenderDevice(m) {
  const participant = String(m?.key?.participant || "");
  const match = participant.match(/:(\d+)@/);
  if (!match) return null;
  const value = Number.parseInt(match[1], 10);
  return Number.isNaN(value) ? null : value;
}

function isUnknownPushName(pushName) {
  const value = String(pushName || "")
    .trim()
    .toLowerCase();
  return !value || ["unknown", "undefined", "null"].includes(value);
}

function analyzeBotMessage(m) {
  const messageId = extractMessageId(m);
  if (!messageId) {
    return { isBot: false, score: 0, reasons: [], confidence: "low" };
  }

  if (messageId.startsWith("WAMID.") || messageId.startsWith("false_") || messageId.startsWith("true_")) {
    return { isBot: false, score: 0, reasons: [], confidence: "low" };
  }

  let score = 0;
  const reasons = [];
  const idUpper = messageId.toUpperCase();

  if (idUpper.startsWith("BAE5")) {
    score += 5;
    reasons.push("id-BAE5");
  } else if (idUpper.startsWith("3EB0") && idUpper.length === 22) {
    score += 4;
    reasons.push("id-3EB0");
  } else if (idUpper.startsWith("B24E")) {
    score += 5;
    reasons.push("id-B24E");
  } else if (idUpper.startsWith("94DD")) {
    score += 5;
    reasons.push("id-94DD");
  } else if (idUpper.startsWith("B1E")) {
    score += 5;
    reasons.push("id-B1E");
  } else if (/^[A-F0-9]{28,40}$/i.test(messageId)) {
    score += 2;
    reasons.push("id-upper-hex");
  } else if (messageId.length === 16) {
    score += 3;
    reasons.push("id-length-16");
  } else if (messageId.length < 20 && !messageId.includes("-")) {
    score += 2;
    reasons.push("id-length-suspicious");
  }

  if (/[a-z]/.test(messageId) && !messageId.startsWith("3EB0") && !messageId.includes("-")) {
    score += 4;
    reasons.push("id-lowercase-signature");
  }

  const len = messageId.length;
  if (len !== 16 && len !== 20 && len !== 22 && len !== 32 && !messageId.includes("-")) {
    score += 3;
    reasons.push(`id-length-unusual`);
  }

  if (m?.isBaileys === true) {
    score += 5;
    reasons.push("flag-isBaileys");
  }

  const msg = m?.message || {};
  const actualMsg = msg.ephemeralMessage?.message || msg.viewOnceMessage?.message || msg.viewOnceMessageV2?.message || msg;

  const textMsg = m?.text || actualMsg?.conversation || actualMsg?.extendedTextMessage?.text || "";
  const contextInfo = actualMsg?.extendedTextMessage?.contextInfo || actualMsg?.imageMessage?.contextInfo || actualMsg?.videoMessage?.contextInfo || {};

  if (contextInfo.externalAdReply) {
    score += 6;
    reasons.push("custom-ad-reply");
  }

  if (contextInfo.isForwarded && contextInfo.forwardingScore > 100) {
    score += 3;
    reasons.push("fake-forward-score");
  }

  if (/[\u200B-\u200D\uFEFF]/.test(textMsg)) {
    score += 3;
    reasons.push("invisible-characters");
  }

  const botMessageTypes = [
    'buttonsMessage', 'templateMessage', 'listMessage',
    'interactiveMessage', 'buttonsResponseMessage',
    'templateButtonReplyMessage', 'listResponseMessage',
    'interactiveResponseMessage'
  ];

  for (const type of botMessageTypes) {
    if (actualMsg[type]) {
      score += 6;
      reasons.push(`message-type-${type}`);
      break;
    }
  }

  if (msg.deviceSentMessage) {
    score += 1;
    reasons.push("message-deviceSent");
    if (msg.deviceSentMessage?.message) {
      score += 1;
      reasons.push("message-deviceWrapper");
    }
  }

  const senderDevice = extractSenderDevice(m);
  if (Number.isInteger(senderDevice) && senderDevice > 20) {
    score += 2;
    reasons.push("participant-highDevice");
  }

  const lowerPushName = String(m?.pushName || "").toLowerCase();
  if (isUnknownPushName(m?.pushName)) {
    score += 1;
    reasons.push("pushname-unknown");
  } else if (/(bot|system|admin|owner|host|panel)/i.test(lowerPushName)) {
    score += 2;
    reasons.push("pushname-suspicious");
  }

  const confidence = score >= 6 ? "high" : score >= 4 ? "medium" : "low";
  return {
    isBot: score >= 5,
    score,
    reasons,
    confidence,
    messageId,
    senderDevice,
  };
}

function handler(m, { sock }) {
  const db = getDatabase();
  const args = m.args[0]?.toLowerCase();
  const groupData = db.getGroup(m.chat) || {};
  const current = groupData.antibot || false;

  if (!args || args === "status") {
    return m.reply(
      `🤖 *AntiBot*\n\n` +
      `> Status: ${current ? "✅ Aktif" : "❌ Nonaktif"}\n\n` +
      `> Deteksi: *Smart Heuristic*\n\n` +
      `> \`.antibot on/off\``,
    );
  }

  if (args === "on") {
    db.setGroup(m.chat, { ...groupData, antibot: true });
    db.save();
    m.react("✅");
    return m.reply(`✅ *AntiBot diaktifkan*`);
  }

  if (args === "off") {
    db.setGroup(m.chat, { ...groupData, antibot: false });
    db.save();
    m.react("❌");
    return m.reply(`❌ *AntiBot dinonaktifkan*`);
  }

  return m.reply(`❌ Gunakan \`.antibot on\` atau \`.antibot off\``);
}

function isBotMessage(m) {
  const result = analyzeBotMessage(m);
  return {
    isBot: result.isBot,
    reason: result.reasons[0] || null,
    score: result.score,
    reasons: result.reasons,
    confidence: result.confidence,
  };
}

async function detectBot(m, sock) {
  if (!m.isGroup) return false;

  const db = getDatabase();
  const groupData = db.getGroup(m.chat);
  if (!groupData?.antibot) return false;

  const result = isBotMessage(m);
  if (!result.isBot) return false;

  const botJid = m.sender;
  if (!botJid) return false;

  const groupMeta = m.groupMetadata;
  if (!groupMeta) return false;

  const myNumber = sock.user?.id?.split(":")[0] || sock.user?.id?.split("@")[0];
  const myJid = myNumber + "@s.whatsapp.net";
  if (botJid === myJid) return false;

  const botParticipant = findParticipantByNumber(groupMeta.participants, myJid);
  if (!botParticipant?.admin) return false;

  const targetParticipant = findParticipantByNumber(
    groupMeta.participants,
    botJid,
  );
  if (targetParticipant?.admin) return false;

  const targetJidToKick = targetParticipant
    ? getParticipantJid(targetParticipant)
    : botJid;

  try {
    try {
      await sock.sendMessage(m.chat, { delete: m.key });
    } catch {
      await sock.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key?.id || m.id,
          participant: m.sender,
        },
      });
    }
    await sock.groupParticipantsUpdate(m.chat, [targetJidToKick], "remove");

    await sock.sendMessage(m.chat, {
      text: gpMsg("antibot", { user: botJid.split("@")[0] }),
      mentions: [botJid],
    });

    return true;
  } catch (err) {
    return false;
  }
}

export { pluginConfig as config, handler, detectBot, isBotMessage };
