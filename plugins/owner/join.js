/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import config from "../../config.js";
import { saluranCtx } from "../../src/lib/elaina-context.js";
import te from "../../src/lib/elaina-error.js";

const pluginConfig = {
  name: "join",
  alias: ["joingrup", "joingroup", "gabung"],
  category: "owner",
  description: "Bot join ke grup via link invite, support reply pesan yang mengandung link",
  usage: ".join <link> / .join (reply pesan berisi link)",
  example: ".join https://chat.whatsapp.com/xxx",
  isOwner: true,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 0,
  isEnabled: true,
};

function extractAllInviteCodes(text) {
  if (!text) return [];
  const codes = [];
  const seen = new Set();

  const patterns = [
    /chat\.whatsapp\.com\/([a-zA-Z0-9]{20,})/gi,
    /invite\.whatsapp\.com\/([a-zA-Z0-9]{20,})/gi,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const code = match[1];
      if (!seen.has(code)) {
        seen.add(code);
        codes.push(code);
      }
    }
  }

  return codes;
}

async function joinGroup(sock, inviteCode) {
  try {
    const groupInfo = await sock.groupGetInviteInfo(inviteCode);
    if (!groupInfo) return { success: false, error: "Tidak dapat mengambil info grup" };

    const botJid = sock.user?.id?.replace(/:.*@/, "@") || "";
    const isMember = groupInfo.participants?.some(
      (p) => p.id === botJid || p.id?.includes(sock.user?.id?.split(":")[0]),
    );

    if (isMember) {
      return {
        success: false,
        alreadyMember: true,
        subject: groupInfo.subject || "Unknown",
      };
    }

    await sock.groupAcceptInvite(inviteCode);
    return {
      success: true,
      subject: groupInfo.subject || "Unknown",
      members: groupInfo.size || groupInfo.participants?.length || 0,
      owner: groupInfo.owner?.split("@")[0] || "Unknown",
    };
  } catch (error) {
    let errorMsg = error.message || "Link tidak valid";
    if (errorMsg.includes("not-authorized")) errorMsg = "Link sudah tidak valid atau expired";
    else if (errorMsg.includes("gone") || errorMsg.includes("item-not-found") || errorMsg.includes("404")) errorMsg = "Grup tidak ditemukan (link ngasal/sudah direvoke)";
    else if (errorMsg.includes("conflict")) errorMsg = "Bot sudah menjadi member";
    else errorMsg = "Link tidak valid atau bot dilarang join";
    return { success: false, error: errorMsg };
  }
}

async function handler(m, { sock }) {
  const input = m.args.join(" ").trim();
  let sourceText = input;

  if (!input && m.quoted) {
    sourceText = m.quoted.body || m.quoted.text || m.quoted.contentText || "";
  }

  if (!sourceText) {
    return m.reply(
      `🔗 *Join Grup*\n\n` +
        `Bot akan join ke grup berdasarkan link invite yang kamu berikan.\n\n` +
        `*PENGGUNAAN:*\n` +
        `> *${m.prefix}join <link>* — Join via link langsung\n` +
        `> *${m.prefix}join* (reply pesan) — Join dari link di pesan yang di-reply\n\n` +
        `*CONTOH:*\n` +
        `> *${m.prefix}join https://chat.whatsapp.com/xxx*\n` +
        `> Reply pesan berisi link lalu ketik *${m.prefix}join*\n\n` +
        `_Bot akan mendeteksi semua link grup di pesan dan join satu per satu_`
    );
  }

  const inviteCodes = extractAllInviteCodes(sourceText);

  if (inviteCodes.length === 0) {
    return m.reply(
      `❌ *Tidak Ada Link Grup*\n\n` +
        `> Bot tidak menemukan link invite grup di pesan tersebut.\n\n` +
        `*Format link yang didukung:*\n` +
        `> *https://chat.whatsapp.com/xxx*\n` +
        `> *https://invite.whatsapp.com/xxx*`
    );
  }

  m.react("🕕");

  if (inviteCodes.length === 1) {
    const result = await joinGroup(sock, inviteCodes[0]);

    if (result.alreadyMember) {
      m.react("❌");
      return m.reply(
        `❌ *Sudah Menjadi Member*\n\n> Bot sudah join di grup *${result.subject}*`
      );
    }

    if (!result.success) {
      m.react("❌");
      return m.reply(`❌ *Gagal Join*\n\n> ${result.error}`);
    }

    m.react("✅");
    const ctx = saluranCtx();
    return m.reply(
      `✅ *Berhasil Join!*\n\n` +
        `> 🏠 Nama: *${result.subject}*\n` +
        `> 👥 Member: *${result.members}*\n` +
        `> 👤 Owner: *${result.owner}*`,
      { contextInfo: ctx }
    );
  }

  let resultText =
    `🔗 *Multi Join — ${inviteCodes.length} Link Terdeteksi*\n\n` +
    `Bot akan join ke semua grup satu per satu.\n\n`;

  let successCount = 0;
  let alreadyCount = 0;
  let failedCount = 0;

  for (let i = 0; i < inviteCodes.length; i++) {
    const result = await joinGroup(sock, inviteCodes[i]);

    if (result.alreadyMember) {
      alreadyCount++;
      resultText += `*${i + 1}.* ${result.subject} — ⚠️ Sudah member\n`;
    } else if (result.success) {
      successCount++;
      resultText += `*${i + 1}.* ${result.subject} — ✅ Berhasil join\n`;
    } else {
      failedCount++;
      resultText += `*${i + 1}.* ${inviteCodes[i].substring(0, 12)}... — ❌ ${result.error}\n`;
    }

    if (i < inviteCodes.length - 1) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  resultText +=
    `\n*Hasil:*\n` +
    `> ✅ Berhasil: *${successCount}*\n` +
    `> ⚠️ Sudah member: *${alreadyCount}*\n` +
    `> ❌ Gagal: *${failedCount}*\n` +
    `> 📊 Total: *${inviteCodes.length}*`;

  m.react(successCount > 0 ? "✅" : "❌");
  return m.reply(resultText);
}

export { pluginConfig as config, handler };
