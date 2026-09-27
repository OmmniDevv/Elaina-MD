/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import config from "../../config.js";

const pluginConfig = {
  name: "usercard",
  alias: ["kartu", "mycard"],
  category: "main",
  description: "Menampilkan kartu profil pengguna",
  usage: ".usercard [reply/tag]",
  example: ".usercard",
  isOwner: false, isPremium: false, isGroup: false, isPrivate: false,
  cooldown: 5, energi: 0, isEnabled: true,
};

function targetJid(m) {
  return m.mentionedJid?.[0] || m.quoted?.sender || m.sender;
}

async function handler(m, { sock, db }) {
  const jid = targetJid(m);
  const user = db.getUser?.(jid) || db.setUser?.(jid) || {};
  let name = m.pushName || jid.split("@")[0];

  if (m.isGroup) {
    try {
      const meta = await sock.groupMetadata(m.chat);
      const p = meta.participants?.find(x => (x.id || x.jid) === jid);
      if (p?.notify) name = p.notify;
    } catch {}
  }

  const premium = Boolean(user.isPremium || user.premium);
  const energi = user.energi ?? 0;
  const exp = user.exp ?? user.xp ?? 0;
  const level = user.level ?? Math.floor(Number(exp) / 100) + 1;

  return m.reply(
    `🪪 *USER CARD*\n\n` +
    `👤 Nama: *${name}*\n` +
    `📱 Nomor: @${jid.split("@")[0]}\n` +
    `⭐ Level: *${level}*\n` +
    `✨ EXP: *${exp}*\n` +
    `⚡ Energi: *${energi === -1 ? "Unlimited" : energi}*\n` +
    `💎 Premium: *${premium ? "Ya" : "Tidak"}*`,
    { mentions: [jid] }
  );
}

export { pluginConfig as config, handler };
