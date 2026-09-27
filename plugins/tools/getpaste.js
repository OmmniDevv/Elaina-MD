/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios'
import * as timeHelper from '../../src/lib/elaina-time.js'
import te from '../../src/lib/elaina-error.js'
const pluginConfig = {
  name: "getpaste",
  alias: ["pastebin", "getpb"],
  category: "tools",
  description: "Ambil konten dari Pastebin",
  usage: ".getpaste <link pastebin>",
  example: ".getpaste https://pastebin.com/Gu8RZaqv",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

class GetPastebin {
  constructor() {
    this.url = "https://pastebin.com/raw/";
  }

  _id(link) {
    const match = link.match(/pastebin\.com\/(?:raw\/)?([a-zA-Z0-9]+)/);
    return match ? match[1] : link;
  }

  async fetch(link) {
    const id = this._id(link);
    if (!id) return null;

    try {
      const req = await fetch(this.url + id);
      if (!req.ok) return null;
      return await req.text();
    } catch {
      return null;
    }
  }
}

async function handler(m, { sock }) {
  const text = m.text?.trim();

  if (!text || !text.includes("pastebin.com")) {
    return m.reply(
      `📋 *ɢᴇᴛ ᴘᴀsᴛᴇʙɪɴ*\n\n` +
      `> Masukkan link Pastebin yang valid\n\n` +
      `> Contoh: \`${m.prefix}getpaste https://pastebin.com/Gu8RZaqv\``,
    );
  }

  m.react("📋");

  try {
    const data = await new GetPastebin().fetch(text);
    await m.reply(data);
    m.react("✅");
  } catch (err) {
    m.react('☢');
    m.reply(te(m.prefix, m.command, m.pushName))
  }
}

export { pluginConfig as config, handler }