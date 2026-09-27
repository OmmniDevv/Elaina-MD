/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fs from "fs";
import path from "path";
import { unloadPlugin } from "../../src/lib/elaina-plugins.js";
import te from "../../src/lib/elaina-error.js";

const pluginConfig = {
  name: "delplugin",
  alias: ["delpl", "hapusplugin", "removeplugin"],
  category: "owner",
  description: "Hapus plugin berdasarkan nama",
  usage: ".delplugin <nama>",
  example: ".delplugin bliblidl",
  isOwner: true,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

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
  const name = m.fullArgs?.trim() || m.args?.[0];

  if (!name) {
    return m.reply(
      `Halo *${m.pushName}*, sepertinya kamu lupa memasukkan nama plugin yang ingin dihapus.\n\n` +
      `Silakan gunakan format perintah berikut:\n` +
      `- .delplugin <nama plugin>\n\n` +
      `Contoh penggunaan:\n` +
      `- .delplugin bliblidl`
    );
  }

  await m.react("🕕");

  try {
    const pluginsDir = path.join(process.cwd(), "plugins");
    const found = findPluginFile(pluginsDir, name);

    if (!found) {
      await m.react("❌");
      return m.reply(`Maaf *${m.pushName}*, plugin dengan nama ${name} tidak dapat ditemukan.`);
    }

    let unloadResult = { success: false };
    try {
      unloadResult = unloadPlugin(found.path) || { success: true };
    } catch {}

    fs.unlinkSync(found.path);

    await m.react("✅");
    let replyText =
      `Proses selesai! Plugin berhasil dihapus dari sistem.\n\n` +
      `- File: ${found.file}\n` +
      `- Folder: ${found.folder}\n` +
      `- Status Unload: ${unloadResult.success ? "Berhasil" : "Pending"}\n\n` +
      `Plugin tersebut sudah dihapus dan tidak aktif lagi.`;

    return m.reply(replyText);
  } catch (error) {
    await m.react("☢");
    await m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
