/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fs from "fs";
import path from "path";
import { hotReloadPlugin } from "../../src/lib/elaina-plugins.js";
import te from "../../src/lib/elaina-error.js";

const pluginConfig = {
  name: "addplugin",
  alias: ["addpl", "tambahplugin"],
  category: "owner",
  description: "Tambah plugin baru dari code yang di-reply",
  usage: ".addplugin [namafile] [folder]",
  example: ".addplugin bliblidl downloader",
  isOwner: true,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

function extractPluginInfo(code) {
  const info = { name: null, category: null };
  const nameMatch = code.match(/name:\s*['"`]([^'"`]+)['"]/i);
  if (nameMatch) info.name = nameMatch[1];
  const categoryMatch = code.match(/category:\s*['"`]([^'"`]+)['"]/i);
  if (categoryMatch) info.category = categoryMatch[1];
  return info;
}

async function handler(m, { sock }) {
  const quoted = m.quoted;

  if (!quoted) {
    return m.reply(
      `Halo *${m.pushName}*, sepertinya kamu belum mereply kode pluginnya.\n\n` +
      `Silakan reply kode plugin yang ingin ditambahkan dengan perintah:\n` +
      `- .addplugin (untuk deteksi otomatis)\n` +
      `- .addplugin <nama file> (untuk nama kustom)\n` +
      `- .addplugin <nama file> <folder> (untuk nama dan folder kustom)`
    );
  }

  let code = quoted.text || quoted.body || "";

  if (
    quoted.mimetype === "application/javascript" ||
    quoted.filename?.endsWith(".js")
  ) {
    try {
      code = (await quoted.download()).toString();
    } catch (e) {
      return m.reply(`Maaf *${m.pushName}*, proses gagal karena file tidak dapat diunduh.`);
    }
  }

  if (!code || code.length < 50) {
    return m.reply(`Maaf *${m.pushName}*, proses gagal karena kode terlalu pendek atau tidak valid.`);
  }

  const hasExport = code.includes("module.exports") || code.includes("export ");
  const hasConfig = code.includes("pluginConfig") || code.includes("config");
  if (!hasExport || !hasConfig) {
    return m.reply(
      `Maaf *${m.pushName}*, proses gagal karena kode bukan format plugin yang valid. Pastikan ada export dan config di dalamnya.`
    );
  }

  const extracted = extractPluginInfo(code);
  const args = m.args;

  let fileName = args[0] || extracted.name;
  let folderName = args[1] || extracted.category;

  if (!fileName) {
    return m.reply(
      `Maaf *${m.pushName}*, aku tidak bisa mendeteksi nama pluginnya. Silakan gunakan perintah dengan format .addplugin <nama file>.`
    );
  }

  if (!folderName) folderName = "other";

  fileName = fileName.toLowerCase().replace(/[^a-z0-9\-_]/g, "");
  folderName = folderName.toLowerCase().replace(/[^a-z0-9\-_]/g, "");

  if (!fileName) {
    return m.reply(`Maaf *${m.pushName}*, proses gagal karena nama file tidak valid.`);
  }

  await m.react("🕕");

  try {
    const pluginsDir = path.join(process.cwd(), "plugins");
    const folderPath = path.join(pluginsDir, folderName);
    const filePath = path.join(folderPath, `${fileName}.js`);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    if (fs.existsSync(filePath)) {
      await m.react("❌");
      return m.reply(
        `Maaf *${m.pushName}*, file ${fileName}.js sudah ada di folder ${folderName}.\n\n` +
        `💡 Tips: Gunakan perintah .ganticode ${fileName} ${folderName} jika kamu ingin mengganti kode plugin yang sudah ada.`
      );
    }

    fs.writeFileSync(filePath, code);

    let reloadResult = { success: false };
    try {
      reloadResult = (await hotReloadPlugin(filePath)) || { success: true };
    } catch {}

    await m.react("✅");
    let replyText =
      `Proses selesai! Plugin berhasil ditambahkan ke dalam sistem.\n\n` +
      `- File: ${fileName}.js\n` +
      `- Folder: ${folderName}\n` +
      `- Ukuran: ${code.length} bytes\n` +
      `- Status Reload: ${reloadResult.success ? "Berhasil" : "Pending"}\n\n` +
      `Plugin sudah aktif dan siap digunakan, silakan dicoba ya!`;

    return m.reply(replyText);
  } catch (error) {
    await m.react("☢");
    await m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
