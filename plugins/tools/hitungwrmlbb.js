/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";

const pluginConfig = {
  name: "hitungwrmlbb",
  alias: ["wrml", "wrmlbb", "winrate"],
  category: "tools",
  description: "Hitung kebutuhan win tanpa lose untuk mencapai target win rate di Mobile Legends.",
  usage: ".hitungwrmlbb <total_match> <wr_sekarang> <wr_target>",
  example: ".hitungwrmlbb 4242 22 88",
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock, args }) {
  if (args.length < 3) {
    return m.reply(
      `Halo *${m.pushName}* 👋\n\n` +
      `Untuk menghitung target Win Rate MLBB kamu, gunakan format:\n` +
      `- \`${m.prefix}hitungwrmlbb <total_match> <wr_sekarang> <wr_target>\`\n\n` +
      `Contoh:\n- \`${m.prefix}hitungwrmlbb 4242 22 88\``
    );
  }

  const [totalMatch, wrNow, wrTarget] = args;

  if (isNaN(totalMatch) || isNaN(wrNow) || isNaN(wrTarget)) {
    return m.reply("❌ Angka tidak valid. Pastikan semua yang dimasukkan adalah angka (tanpa %).\n\nContoh: `.hitungwrmlbb 4242 22 88`");
  }

  m.react("🕕");

  try {
    const apiUrl = `https://api.nexray.eu.cc/tools/winrate-mlbb?total_match=${totalMatch}&wr_now=${wrNow}&wr_target=${wrTarget}`;
    const res = await axios.get(apiUrl);
    const data = res.data;

    if (!data.status || !data.result) {
      await m.react("❌");
      return m.reply("⚠️ Gagal menghitung Win Rate. Pastikan angkanya masuk akal atau coba lagi nanti.");
    }

    let info = `🎮 *KALKULATOR WINRATE MLBB* 🎮\n\n`;
    info += `📊 Total Match: *${totalMatch}*\n`;
    info += `📉 WR Sekarang: *${wrNow}%*\n`;
    info += `📈 WR Target: *${wrTarget}%*\n\n`;
    info += `💡 *Hasil Analisa:*\n${data.result}`;

    await m.reply(info);
    m.react("✅");

  } catch (error) {
    console.error("[WR MLBB Error]", error);
    await m.react("❌");
    m.reply("😔 Terjadi kesalahan sistem saat menghitung Win Rate. Mohon coba lagi nanti.");
  }
}

export { pluginConfig as config, handler };
