/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";
import config from "../../config.js";
import te from "../../src/lib/elaina-error.js";

const pluginConfig = {
  name: "caribug",
  alias: ["debug", "findbug"],
  category: "tools",
  description: "Cari bug di kode pemrograman",
  usage: ".caribug [kode] atau reply kode",
  example: ".caribug function test() {}",
  cooldown: 20,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { args }) {
  let code = m.quoted?.text || args.join(" ");

  if (!code) {
    return m.reply(
      `*🐛 CARI BUG*\n\nKirim kode atau reply pesan kode untuk mencari bug.\n\nContoh:\n\`${m.prefix}caribug function test() {}\``
    );
  }

  m.react("🕕");

  try {
    const apiUrl = `https://api.cuki.biz.id/api/aicode/caribug`;
    const res = await axios.get(apiUrl, {
      params: {
        apikey: config.APIkey.cuki,
        code: code,
        language: "auto"
      },
      timeout: 60000
    });

    const data = res.data;

    if (!data.success || !data.data) {
      throw new Error("Gagal menganalisa kode dari server");
    }

    const info = data.data;
    const meta = info.metadata;
    const bugInfo = info.bugsFound;
    
    let text = `🐛 *HASIL ANALISA BUG*\n\n`;
    text += `*Bahasa:* ${meta.detectedLanguage}\n`;
    text += `*Tingkat:* ${meta.severityInfo.level} ${meta.severityInfo.icon}\n`;
    text += `*Bug Ditemukan:* ${bugInfo.total}\n\n`;
    
    if (bugInfo.summary) {
      text += `*📝 Ringkasan:*\n${bugInfo.summary}\n\n`;
    }
    
    if (info.codeAnalysis?.fixed?.code) {
      text += `*✨ Kode Perbaikan:*\n\`\`\`${meta.detectedLanguage}\n${info.codeAnalysis.fixed.code}\n\`\`\`\n\n`;
    }
    
    if (bugInfo.details && bugInfo.details.length > 0) {
      text += `*📌 Detail:* \n`;
      bugInfo.details.forEach((d, i) => {
        text += `- ${d.type || d.description}\n`;
      });
    }

    m.react("✅");
    await m.reply(text.trim());
  } catch (err) {
    console.error("[CariBug]", err.message);
    m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
