/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";

const pluginConfig = {
  name: "phisingataubukan",
  alias: ["cekphising", "checkphishing", "webphishing"],
  category: "tools",
  description: "Cek apakah sebuah link URL merupakan web phising/berbahaya atau aman.",
  usage: ".phisingataubukan <url>",
  example: ".phisingataubukan https://google.com",
  cooldown: 10,
  energi: 2,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const url = m.text?.trim();

  if (!url) {
    return m.reply(
      `Halo *${m.pushName}* 👋\n\n` +
      `Silakan masukkan link URL yang ingin dicek keamanannya.\n\n` +
      `Contoh:\n- \`${m.prefix}phisingataubukan https://google.com\``
    );
  }

  m.react("🕕");

  try {
    const apiUrl = `https://api.nexray.eu.cc/tools/webphishing?url=${encodeURIComponent(url)}`;
    const res = await axios.get(apiUrl);
    const data = res.data;

    if (!data.status || !data.result) {
      await m.react("❌");
      return m.reply("⚠️ Gagal mengecek URL. Pastikan link yang dimasukkan valid atau coba lagi nanti.");
    }

    const { result } = data;
    
    let info = `🛡️ *HASIL SCAN URL* 🛡️\n\n`;
    info += `🔗 *URL:* ${result.scanned_url}\n`;
    info += `📊 *Status:* ${result.status_description}\n\n`;
    info += `*DETAIL SCAN:*\n`;
    info += `- Phising: ${result.is_phishing ? "🚨 Ya" : "✅ Tidak"}\n`;
    info += `- Mengandung Malware: ${result.contains_malware ? "🚨 Ya" : "✅ Tidak"}\n`;
    info += `- Membawa ke Situs Berbahaya: ${result.sends_to_harmful_sites ? "🚨 Ya" : "✅ Tidak"}\n`;
    info += `- Menginstal Software Jahat: ${result.installs_malicious_software ? "🚨 Ya" : "✅ Tidak"}\n`;
    info += `- Unduhan Tidak Wajar: ${result.uncommon_downloads ? "🚨 Ya" : "✅ Tidak"}\n\n`;
    info += `_Terakhir dipindai: ${new Date(result.last_modified).toLocaleString("id-ID")}_`;

    await m.reply(info);
    m.react("✅");

  } catch (error) {
    console.error("[Phishing Check Error]", error);
    await m.react("❌");
    m.reply("😔 Terjadi kesalahan sistem saat mengecek URL tersebut. Mohon coba lagi nanti.");
  }
}

export { pluginConfig as config, handler };
