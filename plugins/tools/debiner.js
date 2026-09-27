/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
  name: "debiner",
  alias: ["bintotext", "bin2teks", "decodebiner"],
  category: "tools",
  description: "Mengubah kode binary menjadi teks",
  usage: ".debiner <binary>",
  example: ".debiner 01001000 01100101",
  isOwner: false, isPremium: false, isGroup: false, isPrivate: false,
  cooldown: 2, energi: 0, isEnabled: true,
};

async function handler(m) {
  const input = String(m.args?.join(" ") || m.text || "").trim();
  if (!input) return m.reply(`📝 *DECODE BINARY*\n\nContoh: ${m.prefix}debiner 01001000 01100101`);
  const parts = input.split(/\s+/);
  if (parts.some(v => !/^[01]+$/.test(v))) {
    return m.reply("❌ Binary hanya boleh berisi 0 dan 1, dipisahkan spasi.");
  }
  try {
    const text = parts.map(v => String.fromCodePoint(parseInt(v, 2))).join("");
    await m.react?.("📝");
    return m.reply(`📝 *DECODE BINARY*\n\nInput:\n\`${input.slice(0, 500)}\`\n\nOutput:\n${text}`);
  } catch (e) {
    return m.reply(`❌ Binary tidak valid: ${e.message}`);
  }
}

export { pluginConfig as config, handler };
