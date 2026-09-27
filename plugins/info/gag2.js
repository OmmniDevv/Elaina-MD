/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";
import te from "../../src/lib/elaina-error.js";

const pluginConfig = {
  name: "gag2",
  alias: ["growagarden2"],
  category: "info",
  description: "Cek stock Grow a Garden dengan fitur watch",
  usage: ".gag2 [watch] [item]",
  example: ".gag2 watch seed",
  cooldown: 15,
  energi: 1,
  isEnabled: true,
};

const API = "https://api.rifkyshre.biz.id";
const ROUTE = "/scrape/gag2-stock";

async function gag2Fetch() {
  const res = await axios.get(`${API}${ROUTE}`, {
    timeout: 30000,
    validateStatus: () => true,
    headers: {
      Accept: "application/json",
      Origin: "https://code.rifkyshre.biz.id",
      Referer: "https://code.rifkyshre.biz.id/",
    },
  });
  if (!res.data?.status) {
    return {
      ok: false,
      error: res.data?.error ?? `HTTP ${res.status}`,
    };
  }
  return { ok: true, data: res.data.data };
}

function emojiForItem(name) {
  const n = name.toLowerCase();
  if (n.includes("seed")) return "🌱";
  if (n.includes("watering") || n.includes("hose") || n.includes("sprinkler")) return "💧";
  if (n.includes("crate") || n.includes("box")) return "📦";
  if (n.includes("egg")) return "🥚";
  return "•";
}

function formatStock(d) {
  const lines = [];
  lines.push(`*${d.message}*`);
  lines.push("");
  lines.push(`- ⏰ Restock in : *${d.restockInLabel}*`);
  lines.push(`- 🔄 Rotation   : *${d.rotationId} (cycle ${d.cycleSeconds}s)*`);
  lines.push(`- 📊 Status     : *${d.status} (${d.staleness})*`);
  lines.push(`- 💾 Cache      : *${d.cache.servedFromCache ? "HIT" : "MISS"} (age ${d.cache.ageSec}s/${d.cache.ttlSec}s)*`);
  lines.push("");
  if (d.weather?.active) {
    lines.push(`- ⛅ *WEATHER: ${d.weather.type.toUpperCase()}*`);
    if (Array.isArray(d.weather.effects)) {
      for (const eff of d.weather.effects) lines.push(`   - ✨ ${eff}`);
    }
    lines.push("");
  }
  if (d.seeds?.length) {
    lines.push(`- 🌱 *SEEDS (${d.seeds.length}):*`);
    for (const s of d.seeds) lines.push(`   - ${s.name} × ${s.quantity}`);
    lines.push("");
  }
  if (d.gear?.length) {
    lines.push(`- ⚙️ *GEAR (${d.gear.length}):*`);
    for (const g of d.gear) lines.push(`   - ${g.name} × ${g.quantity}`);
    lines.push("");
  }
  if (d.crates?.length) {
    lines.push(`- 📦 *CRATES (${d.crates.length}):*`);
    for (const c of d.crates) lines.push(`   - ${c.name} × ${c.quantity}`);
  }
  return lines.join("\n");
}

async function modeStock(m) {
  const r = await gag2Fetch();
  if (!r.ok) {
    return m.reply(`❌ ${r.error}`);
  }
  return m.reply(formatStock(r.data));
}

async function modeWatch(watchItems, m, sock) {
  const wants = watchItems.map((w) => w.toLowerCase());
  await m.reply(`👀 *Watching for:* ${watchItems.join(", ")}\n> Max 5 iterations (~2.5 menit). Re-run buat extend.`);

  for (let i = 1; i <= 5; i++) {
    const r = await gag2Fetch();
    if (!r.ok) {
      await new Promise((res) => setTimeout(res, 30000));
      continue;
    }
    const d = r.data;
    const allItems = [...(d.seeds ?? []), ...(d.gear ?? []), ...(d.crates ?? [])];
    const hits = allItems.filter((item) =>
      wants.some((w) => item.name.toLowerCase().includes(w)),
    );

    if (hits.length > 0) {
      let msg = `🎯 *[iter ${i}] FOUND ${hits.length} watched item(s)!*\n\n`;
      for (const h of hits) {
        msg += `- ${emojiForItem(h.name)} *${h.name} × ${h.quantity}*\n`;
      }
      msg += `\n` + formatStock(d);
      await sock.sendMessage(m.chat, { text: msg }, { quoted: m });
      return;
    }

    if (i < 5) await new Promise((res) => setTimeout(res, 30000));
  }
  
  await sock.sendMessage(m.chat, { text: `⏱️ 5 iterations done, no match. Re-run buat lanjut.` }, { quoted: m });
}

async function handler(m, { sock, args }) {
  m.react("🕕");
  try {
    const isWatch = args[0]?.toLowerCase() === "watch";
    if (isWatch) {
      const items = args.slice(1);
      if (items.length === 0) {
        return m.reply("❌ Masukkan nama item yang ingin dipantau. Contoh: `.gag2 watch seed apple`");
      }
      m.react("✅");
      await modeWatch(items, m, sock);
    } else {
      await modeStock(m);
      m.react("✅");
    }
  } catch (err) {
    console.error("[Gag2]", err.message);
    m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
