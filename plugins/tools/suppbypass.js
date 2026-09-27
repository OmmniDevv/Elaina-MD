/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

/**
 * .suppbypass — daftar domain yang didukung
 */
const pluginConfig = {
  name: "suppbypass",
  alias: ["supportbypass", "bypasslist", "listbypass"],
  category: "tools",
  description: "List shortlink yang bisa di-bypass",
  usage: ".suppbypass",
  example: ".suppbypass",
  isOwner: false,
  isPremium: false,
  cooldown: 5,
  isEnabled: true,
};

const API = "https://albyoffc.my.id/api/bypass/support?apikey=albymd-235b23e";

function box(title, lines) {
  const body = lines.filter((l) => l !== undefined && l !== null).join("\n");
  return `╭──━─━─━─━─━─━─━─━─╮\n│ *${title}*\n├──━─━─━─━─━─━─━─━─┤\n${body
    .split("\n")
    .map((l) => `│ ${l}`)
    .join("\n")}\n╰──━─━─━─━─━─━─━─━─╯`;
}

async function handler(m, { prefix }) {
  const pfx = prefix || ".";
  try {
    await m.react?.("⏳");
    const res = await fetch(API, { headers: { accept: "application/json" } });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data) {
      await m.react?.("❌");
      return m.reply(`❌ Gagal ambil list (HTTP ${res.status}).`);
    }

    let list = [];
    if (Array.isArray(data)) list = data;
    else if (Array.isArray(data.result)) list = data.result;
    else if (Array.isArray(data.data)) list = data.data;
    else if (Array.isArray(data.support)) list = data.support;
    else if (data.data && typeof data.data === "object" && !Array.isArray(data.data)) {
      list = Object.keys(data.data);
    } else {
      for (const v of Object.values(data)) {
        if (Array.isArray(v)) {
          list = v;
          break;
        }
      }
    }

    if (!list.length) {
      await m.react?.("✅");
      return m.reply(
        box("BYPASS SUPPORT", [
          "```" + JSON.stringify(data, null, 2).slice(0, 3000) + "```",
        ])
      );
    }

    const lines = list.map((item, i) => {
      if (typeof item === "string") return `${i + 1}. ${item}`;
      if (item && typeof item === "object") {
        return `${i + 1}. ${item.name || item.domain || item.host || item.url || JSON.stringify(item)}`;
      }
      return `${i + 1}. ${String(item)}`;
    });

    // chunk if too long
    const chunkSize = 40;
    await m.react?.("✅");
    if (lines.length <= chunkSize) {
      return m.reply(
        box(`BYPASS SUPPORT (${list.length})`, [
          ...lines,
          ``,
          `Pakai: *${pfx}bypass <url>*`,
        ])
      );
    }
    await m.reply(box(`BYPASS SUPPORT (${list.length})`, lines.slice(0, chunkSize)));
    for (let i = chunkSize; i < lines.length; i += chunkSize) {
      await m.reply(lines.slice(i, i + chunkSize).join("\n"));
    }
    return m.reply(`_Pakai: *${pfx}bypass <url>*_`);
  } catch (e) {
    await m.react?.("❌");
    return m.reply(`❌ Error: ${e.message || e}`);
  }
}

export const config = pluginConfig;
export { handler, pluginConfig };
export default { config: pluginConfig, handler };