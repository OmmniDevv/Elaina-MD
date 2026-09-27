/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fs from "fs";
import path from "path";
import config from "../../config.js";
import { AIRich } from "../../src/lib/elaina-builder.js";
const pluginConfig = {
  name: "getplugin",
  alias: ["gp", "getcode", "plugincode", "sourcecode"],
  category: "owner",
  description: "Dapatkan source code plugin",
  usage: ".getplugin <nama plugin>",
  example: ".getplugin menu",
  isOwner: true,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

function searchPlugin(name, pluginsDir) {
  const categories = fs.readdirSync(pluginsDir).filter((f) => {
    return fs.statSync(path.join(pluginsDir, f)).isDirectory();
  });

  for (const category of categories) {
    const categoryPath = path.join(pluginsDir, category);
    const files = fs.readdirSync(categoryPath).filter((f) => f.endsWith(".js"));

    for (const file of files) {
      const baseName = file.replace(".js", "").toLowerCase();
      if (baseName === name.toLowerCase()) {
        return {
          path: path.join(categoryPath, file),
          category,
          file,
        };
      }
    }
  }

  for (const category of categories) {
    const categoryPath = path.join(pluginsDir, category);
    const files = fs.readdirSync(categoryPath).filter((f) => f.endsWith(".js"));

    for (const file of files) {
      const filePath = path.join(categoryPath, file);
      try {
        const content = fs.readFileSync(filePath, "utf-8");
        const aliasMatch = content.match(/alias:\s*\[([^\]]+)\]/);
        if (aliasMatch) {
          const aliases = aliasMatch[1].match(/['"`]([^'"`]+)['"`]/g);
          if (aliases) {
            const cleanAliases = aliases.map((a) =>
              a.replace(/['"`]/g, "").toLowerCase(),
            );
            if (cleanAliases.includes(name.toLowerCase())) {
              return {
                path: filePath,
                category,
                file,
              };
            }
          }
        }
      } catch { }
    }
  }

  return null;
}

function getSimilarPlugins(name, pluginsDir) {
  const results = [];
  const categories = fs.readdirSync(pluginsDir).filter((f) => {
    return fs.statSync(path.join(pluginsDir, f)).isDirectory();
  });

  for (const category of categories) {
    const categoryPath = path.join(pluginsDir, category);
    const files = fs.readdirSync(categoryPath).filter((f) => f.endsWith(".js"));

    for (const file of files) {
      const baseName = file.replace(".js", "").toLowerCase();
      if (
        baseName.includes(name.toLowerCase()) ||
        name.toLowerCase().includes(baseName)
      ) {
        results.push(`${category}/${file}`);
      }
    }
  }

  return results.slice(0, 5);
}

async function handler(m, { sock }) {
  if (!config.isOwner(m.sender)) {
    return m.reply("❌ *Owner Only!*");
  }

  const pluginName = m.args?.[0]?.trim();

  if (!pluginName) {
    return m.reply(
      `Halo *${m.pushName}*, sepertinya kamu lupa memasukkan nama plugin yang ingin dicari.\n\n` +
      `Silakan gunakan format berikut:\n` +
      `- .getplugin <nama plugin>\n\n` +
      `Contoh penggunaan:\n` +
      `- .getplugin menu\n` +
      `- .getplugin sticker\n` +
      `- .getplugin game/tebakgambar`
    );
  }

  const pluginsDir = path.join(process.cwd(), "plugins");

  let pluginInfo = null;

  if (pluginName.includes("/")) {
    const [category, file] = pluginName.split("/");
    const filePath = path.join(
      pluginsDir,
      category,
      file.endsWith(".js") ? file : `${file}.js`,
    );
    if (fs.existsSync(filePath)) {
      pluginInfo = {
        path: filePath,
        category,
        file: file.endsWith(".js") ? file : `${file}.js`,
      };
    }
  } else {
    pluginInfo = await searchPlugin(pluginName, pluginsDir);
  }

  if (!pluginInfo) {
    const similar = getSimilarPlugins(pluginName, pluginsDir);
    let text = `Maaf ya *${m.pushName}*, plugin dengan nama *${pluginName}* tidak dapat ditemukan.\n\n`;

    if (similar.length > 0) {
      text += `Mungkin maksud kamu salah satu dari plugin ini:\n`;
      similar.forEach((s) => {
        text += `- ${s}\n`;
      });
    }

    return m.reply(text);
  }

  const code = fs.readFileSync(pluginInfo.path);

  return await sock.sendMessage(m.chat, {
    text: "Langsung aja, pencet tombol dibawah",
    footer: config.bot.name,
    interactiveButtons: [
      {
        name: "cta_copy",
        buttonParamsJson: JSON.stringify({
          display_text: "Salin Kode",
          copy_code: code.toString("utf-8")
        })
      }
    ]
  }, { quoted: m });
}

export { pluginConfig as config, handler };
