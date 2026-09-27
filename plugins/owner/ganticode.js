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
  name: "ganticode",
  alias: ["replaceplugin", "updateplugin", "gantiplugin"],
  category: "owner",
  description: "Ganti code plugin yang sudah ada",
  usage: ".ganticode [namafile] [folder]",
  example: ".ganticode ping main",
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
  const nameMatch = code.match(/name:\s*['"`]([^'"`]+)['"`]/i);
  if (nameMatch) info.name = nameMatch[1];
  const categoryMatch = code.match(/category:\s*['"`]([^'"`]+)['"`]/i);
  if (categoryMatch) info.category = categoryMatch[1];
  return info;
}

function findPluginFile(pluginsDir, name) {
  const folders = fs
    .readdirSync(pluginsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  for (const folder of folders) {
    const folderPath = path.join(pluginsDir, folder);
    const files = fs.readdirSync(folderPath).filter((f) => f.endsWith(".js"));

    for (const file of files) {
      const baseName = file.replace(".js", "");
      if (baseName.toLowerCase() === name.toLowerCase()) {
        return { folder, file, path: path.join(folderPath, file) };
      }
    }
  }

  return null;
}

async function handler(m, { sock }) {
  const quoted = m.quoted;

  if (!quoted) {
    return m.reply(
      `Halo *${m.pushName}*, sepertinya kamu belum mereply kode plugin barunya.\n\n` +
      `Silakan reply kode plugin yang baru dengan perintah:\n` +
      `- .ganticode (untuk deteksi otomatis)\n` +
      `- .ganticode <nama file> (untuk nama kustom)\n` +
      `- .ganticode <nama file> <folder> (untuk kustom nama dan folder)\n\n` +
      `Tenang saja, kode yang lama akan otomatis dibackup sebelum diganti.`
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
      `Maaf *${m.pushName}*, aku tidak bisa mendeteksi nama pluginnya. Silakan gunakan perintah dengan format .ganticode <nama file>.`
    );
  }

  fileName = fileName.toLowerCase().replace(/[^a-z0-9\-_]/g, "");

  if (!fileName) {
    return m.reply(`Maaf *${m.pushName}*, proses gagal karena nama file tidak valid.`);
  }

  await m.react("🕕");

  try {
    const pluginsDir = path.join(process.cwd(), "plugins");
    const existing = findPluginFile(pluginsDir, fileName);

    let filePath;
    let targetFolder;
    let isNewFile = false;
    let backupPath = null;
    let oldSize = 0;

    if (existing) {
      filePath = existing.path;
      targetFolder = existing.folder;
      oldSize = fs.statSync(filePath).size;

      const backupDir = path.join(process.cwd(), "backup", "plugins");
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .slice(0, 19);
      backupPath = path.join(backupDir, `${fileName}_${timestamp}.js`);
      fs.copyFileSync(filePath, backupPath);
    } else {
      if (!folderName) folderName = "other";
      folderName = folderName.toLowerCase().replace(/[^a-z0-9\-_]/g, "");

      targetFolder = folderName;
      const folderPath = path.join(pluginsDir, targetFolder);

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      filePath = path.join(folderPath, `${fileName}.js`);
      isNewFile = true;
    }

    fs.writeFileSync(filePath, code);

    let reloadResult = { success: false };
    try {
      reloadResult = (await hotReloadPlugin(filePath)) || { success: true };
    } catch {}

    await m.react("✅");

    let replyText =
      `Proses selesai! Kode plugin berhasil ${isNewFile ? "ditambahkan" : "diperbarui"}.\n\n` +
      `- File: ${fileName}.js\n` +
      `- Folder: ${targetFolder}\n` +
      `- Ukuran: ${code.length} bytes\n`;

    if (!isNewFile) {
      replyText += `- Ukuran Lama: ${oldSize} bytes\n`;
    }

    replyText +=
      `- Status Reload: ${reloadResult.success ? "Berhasil" : "Pending"}\n\n`;

    if (backupPath) {
      const relBackup = path.relative(process.cwd(), backupPath);
      replyText += `File lama sudah dibackup dengan aman di lokasi berikut:\n${relBackup}\n\n`;
    }

    replyText += `Plugin sudah aktif dan siap digunakan, silakan dicoba ya!`;

    return m.reply(replyText);
  } catch (error) {
    await m.react("☢");
    await m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
