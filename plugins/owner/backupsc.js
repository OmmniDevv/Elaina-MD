/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import moment from "moment-timezone";
import fs from "fs";
import path from "path";
import archiver from "archiver";
import config from "../../config.js";
import te from "../../src/lib/elaina-error.js";
const pluginConfig = {
  name: "backupsc",
  alias: ["backup", "backupscript", "backupsource"],
  category: "owner",
  description: "Backup script bot dalam bentuk zip",
  usage: ".backupsc",
  example: ".backupsc",
  isOwner: true,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 60,
  energi: 0,
  isEnabled: true,
};

const EXCLUDE_DIRS = new Set([
  "node_modules",
  ".git",
  "tmp",
  "temp",
  ".cache",
  ".npm",
  ".yarn",
  "dist",
  "coverage",
  "__pycache__",
  "build",
]);

const EXCLUDE_EXTENSIONS = new Set([
  ".zip",
  ".tar.gz",
  ".7z",
  ".mp4",
  ".mp3",
  ".wav",
  ".avi",
  ".mkv",
  ".ico",
  ".svg",
  ".traineddata",
  ".log",
  ".bak",
  ".lock",
]);

const EXCLUDE_FILES = new Set([
  ".env",
  ".env.local",
  "creds.json",
  "package-lock.json",
  "yarn.lock",
  ".npmrc",
  ".gitignore",
  "boot_final.log",
  "bot_log.txt",
  "error.txt",
  "changelog.txt",
  "UPDATE.txt",
  "CHANGELOG.md",
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function shouldExclude(filePath, basePath) {
  const relativePath = path.relative(basePath, filePath);
  const parts = relativePath.split(path.sep);
  for (const part of parts) {
    if (EXCLUDE_DIRS.has(part)) return true;
  }
  const fileName = path.basename(filePath);
  if (EXCLUDE_FILES.has(fileName)) return true;
  const ext = path.extname(fileName).toLowerCase();
  if (EXCLUDE_EXTENSIONS.has(ext)) {
    const isAsset =
      relativePath.startsWith("assets" + path.sep) ||
      relativePath.startsWith("database" + path.sep);
    if (!isAsset) return true;
  }
  if (fileName.endsWith(".tar.gz")) return true;
  return false;
}

function getBackupOutputDir(projectRoot) {
  const backupDir = path.join(projectRoot, "backups", "script");
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
  return backupDir;
}

async function handler(m, { sock }) {
  await m.react("🕕");
  await m.reply(
    `📦 *ʙᴀᴄᴋᴜᴘ sᴄʀɪᴘᴛ*\n\n> Memproses backup...\n> Mohon tunggu sebentar...`,
  );
  try {
    const projectRoot = process.cwd();
    const timestamp = moment().tz("Asia/Jakarta").format("YYYY-MM-DD_HH-mm-ss");
    const botName =
      config.bot?.name?.replace(/[^a-zA-Z0-9]/g, "") || "RimuruBot";
    const zipFileName = `${botName}_backup_${timestamp}.zip`;
    const backupDir = getBackupOutputDir(projectRoot);
    const zipFilePath = path.join(backupDir, zipFileName);

    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver("zip", { zlib: { level: 9 } });
    let fileCount = 0;

    await new Promise((resolve, reject) => {
      let settled = false;
      const fail = (error) => {
        if (settled) return;
        settled = true;
        try {
          output.destroy();
        } catch { }
        try {
          if (fs.existsSync(zipFilePath)) fs.unlinkSync(zipFilePath);
        } catch { }
        reject(error);
      };
      const succeed = () => {
        if (settled) return;
        settled = true;
        resolve();
      };
      output.on("error", fail);
      output.on("close", () => {
        try {
          if (!fs.existsSync(zipFilePath)) {
            fail(new Error("File backup tidak ditemukan setelah proses zip"));
            return;
          }
          const stats = fs.statSync(zipFilePath);
          if (stats.size <= 0) {
            fail(new Error("File backup kosong atau 0KB"));
            return;
          }
          succeed();
        } catch (error) {
          fail(error);
        }
      });
      archive.on("error", reject);
      archive.on("warning", (error) => {
        if (error?.code !== "ENOENT") fail(error);
      });
      archive.pipe(output);

      function addDirectory(dirPath) {
        try {
          const items = fs.readdirSync(dirPath);
          for (const item of items) {
            const fullPath = path.join(dirPath, item);
            if (shouldExclude(fullPath, projectRoot)) continue;
            try {
              const stat = fs.statSync(fullPath);
              if (stat.isDirectory()) {
                addDirectory(fullPath);
              } else if (stat.isFile() && stat.size < MAX_FILE_SIZE) {
                const relativePath = path.relative(projectRoot, fullPath);
                archive.file(fullPath, { name: relativePath });
                fileCount += 1;
              }
            } catch { }
          }
        } catch { }
      }

      addDirectory(projectRoot);
      if (fileCount === 0) {
        fail(new Error("Tidak ada file yang masuk ke backup script"));
        return;
      }
      archive.finalize();
    });

    const stats = fs.statSync(zipFilePath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    const saluranId = config.saluran?.id || "120363412350560864@newsletter";
    const saluranName = config.saluran?.name || config.bot?.name || "Rimuru-AI";

    await sock.sendMessage(
      m.chat,
      {
        document: fs.readFileSync(zipFilePath),
        fileName: zipFileName,
        mimetype: "application/zip",
        caption:
          `✅ *ʙᴀᴄᴋᴜᴘ sᴇʟᴇsᴀɪ*\n\n` +
          `╭┈┈⬡「 📋 *ᴅᴇᴛᴀɪʟ* 」\n` +
          `┃ 📝 ɴᴀᴍᴀ: \`${zipFileName}\`\n` +
          `┃ 📊 sɪᴢᴇ: \`${fileSizeMB} MB\`\n` +
          `┃ 📁 ꜰɪʟᴇ: \`${fileCount}\`\n` +
          `┃ 📅 ᴛᴀɴɢɢᴀʟ: \`${moment().tz("Asia/Jakarta").format("DD/MM/YYYY")}\`\n` +
          `╰┈┈⬡`,
        contextInfo: {
          forwardingScore: 9999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: saluranId,
            newsletterName: saluranName,
            serverMessageId: 127,
          },
        },
      },
      { quoted: m },
    );

    await m.react("✅");

    try {
      fs.unlinkSync(zipFilePath);
    } catch { }
  } catch (error) {
    await m.react("☢");
    await m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
