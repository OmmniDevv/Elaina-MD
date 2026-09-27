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
  name: "audioquran",
  alias: ["audio-quran", "murottal"],
  category: "religi",
  description: "Cari dan putar audio Al-Quran dari berbagai Qari (mp3quran)",
  usage: ".audio-quran [mode] [args]",
  example: ".audio-quran audio Sudais 1\n.audio-quran reciters\n.audio-quran suwar",
  cooldown: 15,
  energi: 1,
  isEnabled: true,
};

const API = "https://www.mp3quran.net/api/v3";

async function mp3quranFetch(path, params = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = qs ? `${API}${path}?${qs}` : `${API}${path}`;
  const res = await axios.get(url, {
    timeout: 20000,
    validateStatus: () => true,
    headers: {
      Accept: "application/json",
      Origin: "https://code.rifkyshre.biz.id",
      Referer: "https://code.rifkyshre.biz.id/",
    },
  });
  if (res.status !== 200) {
    throw new Error(`mp3quran HTTP ${res.status}`);
  }
  return res.data;
}

function buildAudioUrl(serverBase, surahId) {
  const padded = String(surahId).padStart(3, "0");
  const base = serverBase.endsWith("/") ? serverBase : serverBase + "/";
  return `${base}${padded}.mp3`;
}

async function mp3quran(input) {
  try {
    const mode = (input?.mode ?? "reciters").toLowerCase();
    const language = typeof input?.language === "string" ? input.language : "eng";

    if (mode === "reciters") {
      const data = await mp3quranFetch("/reciters", { language });
      const list = Array.isArray(data?.reciters) ? data.reciters : [];
      return {
        Status: true,
        Code: 200,
        Input: input,
        Result: {
          message: `🎙️ ${list.length} qari tersedia (bahasa: ${language})`,
          count: list.length,
          reciters: list.map((r) => ({
            id: r.id,
            name: r.name,
            letter: r.letter,
            moshafCount: Array.isArray(r.moshaf) ? r.moshaf.length : 0,
            moshaf: (r.moshaf ?? []).map((m) => ({
              id: m.id,
              name: m.name,
              server: m.server,
              surahTotal: m.surah_total,
              surahList: m.surah_list,
            })),
          })),
        },
      };
    }

    if (mode === "suwar") {
      const data = await mp3quranFetch("/suwar", { language });
      const list = Array.isArray(data?.suwar) ? data.suwar : [];
      return {
        Status: true,
        Code: 200,
        Input: input,
        Result: {
          message: `📖 ${list.length} surah (1-114)`,
          count: list.length,
          suwar: list.map((s) => ({
            id: s.id,
            name: s.name?.trim(),
            startPage: s.start_page,
            endPage: s.end_page,
            type: s.makkia === 1 ? "Makkiyah" : "Madaniyah",
          })),
        },
      };
    }

    if (mode === "riwayat") {
      const data = await mp3quranFetch("/riwayat", { language });
      const list = Array.isArray(data?.riwayat) ? data.riwayat : [];
      return {
        Status: true,
        Code: 200,
        Input: input,
        Result: {
          message: `📚 ${list.length} riwayat bacaan`,
          count: list.length,
          riwayat: list,
        },
      };
    }

    if (mode === "radios") {
      const data = await mp3quranFetch("/radios", { language });
      const list = Array.isArray(data?.radios) ? data.radios : [];
      return {
        Status: true,
        Code: 200,
        Input: input,
        Result: {
          message: `📻 ${list.length} radio stream live`,
          count: list.length,
          radios: list,
        },
      };
    }

    if (mode === "audio") {
      const reciterQuery = typeof input?.reciter === "string" ? input.reciter.trim().toLowerCase() : "";
      const surahId = Number(input?.surah);
      if (!reciterQuery) {
        return {
          Status: false, Code: 400, Input: input, Result: null,
          Error: "Field 'reciter' wajib (contoh: 'Sudais', 'Mishary', 'Husary').",
        };
      }
      if (!Number.isInteger(surahId) || surahId < 1 || surahId > 114) {
        return {
          Status: false, Code: 400, Input: input, Result: null,
          Error: "Field 'surah' harus 1-114.",
        };
      }

      const ALIASES = {
        sudais: ["alsudaes", "sudaes", "abdulrahman alsudaes"],
        mishary: ["meshary", "mishary alafasy", "alafasy", "alafasi"],
        misyari: ["meshary", "alafasy"],
        husary: ["hosary", "alhosary", "mahmoud khalil alhosary"],
        hosary: ["alhosary", "husary"],
        ghamdi: ["alghamdi", "saad alghamdi", "saad al ghamdi"],
        ghamidi: ["alghamdi"],
        shuraim: ["alshuraim", "saud alshuraim"],
        shatri: ["shatry", "abubakr ashshatri", "abu bakr al shatri"],
        ajmi: ["alajmi", "ahmed alajmi"],
        minshawi: ["minshawy", "mohamed siddiq elminshawi"],
        afasy: ["alafasy", "meshary alafasy"],
        rifai: ["alrefaei", "hani rifai"],
        muaiqly: ["maher almuaiqly", "almuaiqly"],
        muaiqli: ["almuaiqly"],
        juhany: ["aljohany", "abdullah aljohany"],
        johany: ["aljohany"],
        basfar: ["albasfar", "abdullah basfar"],
        ayyub: ["mohammad ayyoub"],
        ayyoub: ["mohammad ayyoub"],
        budair: ["albudair", "salah albudair"],
        tablawi: ["altablawi", "mohammed altablawi"],
        thubaity: ["althubaity", "ibrahim althubaity"],
      };

      function lev(a, b) {
        const m = a.length, n = b.length;
        if (m === 0) return n;
        if (n === 0) return m;
        const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
        for (let j = 0; j <= n; j++) dp[0][j] = j;
        for (let i = 1; i <= m; i++) {
          for (let j = 1; j <= n; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(
              dp[i - 1][j] + 1,
              dp[i][j - 1] + 1,
              dp[i - 1][j - 1] + cost,
            );
          }
        }
        return dp[m][n];
      }

      const data = await mp3quranFetch("/reciters", { language });
      const all = Array.isArray(data?.reciters) ? data.reciters : [];

      let matches = all.filter((r) =>
        (r.name ?? "").toLowerCase().includes(reciterQuery),
      );

      if (matches.length === 0) {
        const expanded = [reciterQuery, ...(ALIASES[reciterQuery] ?? [])];
        for (const word of reciterQuery.split(/\s+/)) {
          if (ALIASES[word]) expanded.push(...ALIASES[word]);
        }
        for (const variant of expanded) {
          const found = all.filter((r) =>
            (r.name ?? "").toLowerCase().includes(variant),
          );
          if (found.length > 0) {
            matches = found;
            break;
          }
        }
      }

      if (matches.length === 0) {
        const threshold = reciterQuery.length <= 4 ? 1 : 2;
        const fuzzyHits = [];
        for (const r of all) {
          const tokens = (r.name ?? "").toLowerCase().split(/[\s\-']+/).filter(Boolean);
          for (const tok of tokens) {
            const d = lev(reciterQuery, tok);
            if (d <= threshold) {
              fuzzyHits.push({ reciter: r, distance: d });
              break;
            }
          }
        }
        fuzzyHits.sort((a, b) => a.distance - b.distance);
        matches = fuzzyHits.slice(0, 10).map((h) => h.reciter);
      }

      if (matches.length === 0) {
        const ranked = all.map((r) => {
          const tokens = (r.name ?? "").toLowerCase().split(/[\s\-']+/).filter(Boolean);
          let best = Infinity;
          for (const tok of tokens) {
            const d = lev(reciterQuery, tok);
            if (d < best) best = d;
          }
          return { name: r.name, distance: best };
        }).sort((a, b) => a.distance - b.distance).slice(0, 5);
        return {
          Status: false, Code: 404, Input: input, Result: null,
          Error: `Qari "${input.reciter}" gak ketemu. Suggestion terdekat: ${ranked.map((r) => r.name).join(", ")}. Atau mode "reciters" buat list lengkap.`,
        };
      }

      const audios = [];
      for (const reciter of matches) {
        for (const moshaf of reciter.moshaf ?? []) {
          const surahList = String(moshaf.surah_list ?? "").split(",").map((n) => Number(n.trim()));
          if (!surahList.includes(surahId)) continue;
          audios.push({
            reciterId: reciter.id,
            reciterName: reciter.name,
            moshafId: moshaf.id,
            moshafName: moshaf.name,
            surahId,
            audioUrl: buildAudioUrl(moshaf.server, surahId),
          });
        }
      }

      if (audios.length === 0) {
        return {
          Status: false, Code: 404, Input: input, Result: null,
          Error: `Qari ketemu (${matches.length}× match) tapi surah ${surahId} gak tersedia di moshaf-nya.`,
        };
      }

      return {
        Status: true, Code: 200, Input: input,
        Result: {
          message: `🎵 ${audios.length} audio surah ${surahId} dari ${matches.length} qari match "${input.reciter}"`,
          matchCount: matches.length,
          audioCount: audios.length,
          firstAudio: audios[0].audioUrl,
          audios,
        },
      };
    }

    return {
      Status: false, Code: 400, Input: input, Result: null,
      Error: `Unknown mode "${mode}". Pakai: reciters | suwar | riwayat | radios | audio`,
    };
  } catch (e) {
    return {
      Status: false,
      Code: e.response?.status ?? 500,
      Input: input,
      Result: null,
      Error: e.message ?? String(e),
    };
  }
}

async function handler(m, { sock, args }) {
  if (args.length === 0) {
    return m.reply(
      `🕌 *AUDIO QURAN*\n\n` +
      `> Mode yang tersedia:\n` +
      `- \`.audio-quran reciters\` (List qari)\n` +
      `- \`.audio-quran suwar\` (List surah 1-114)\n` +
      `- \`.audio-quran radios\` (List radio live)\n` +
      `- \`.audio-quran riwayat\` (List bacaan)\n` +
      `- \`.audio-quran audio <nama_qari> <nomor_surah>\`\n\n` +
      `*Contoh:* \`.audio-quran audio sudais 1\``
    );
  }

  m.react("🕕");

  try {
    const mode = args[0].toLowerCase();
    
    if (mode === "audio") {
      if (args.length < 3) {
        m.react("❌");
        return m.reply("❌ Format salah! Contoh: `.audio-quran audio sudais 1`");
      }
      
      const surahId = parseInt(args.pop());
      const reciterQuery = args.slice(1).join(" ");
      
      const input = { mode: "audio", reciter: reciterQuery, surah: surahId, language: "id" };
      const res = await mp3quran(input);
      
      if (!res.Status) {
        m.react("❌");
        return m.reply(`❌ ${res.Error}`);
      }
      
      const r = res.Result;
      const audioUrl = r.firstAudio;
      const reciterName = r.audios[0].reciterName;
      const moshafName = r.audios[0].moshafName;
      
      let caption = `🕌 *AUDIO QURAN*\n\n`;
      caption += `*Qari:* ${reciterName}\n`;
      caption += `*Moshaf:* ${moshafName}\n`;
      caption += `*Surah:* ke-${surahId}\n\n`;
      caption += `> Sedang mengirim audio...`;
      
      await m.reply(caption);
      
      await sock.sendMessage(m.chat, {
        audio: { url: audioUrl },
        mimetype: "audio/mpeg",
        ptt: false,
      }, { quoted: m });
      
      m.react("✅");
      return;
    }
    
    // For other modes: reciters, suwar, riwayat, radios
    const input = { mode, language: "id" };
    const res = await mp3quran(input);
    
    if (!res.Status) {
      m.react("❌");
      return m.reply(`❌ ${res.Error}`);
    }
    
    const r = res.Result;
    let txt = `🕌 *${r.message}*\n\n`;
    
    if (mode === "reciters") {
      for (const q of r.reciters.slice(0, 50)) {
        txt += `- #${q.id} *${q.name}* (${q.moshafCount} riwayat)\n`;
      }
      if (r.reciters.length > 50) txt += `\n> ... +${r.reciters.length - 50} qari lainnya.`;
    } else if (mode === "suwar") {
      for (const s of r.suwar) {
        txt += `- #${s.id} *${s.name}* (${s.type})\n`;
      }
    } else if (mode === "riwayat") {
      for (const rw of r.riwayat) {
        txt += `- #${rw.id} *${rw.name}*\n`;
      }
    } else if (mode === "radios") {
      for (const rd of r.radios.slice(0, 50)) {
        txt += `- #${rd.id} *${rd.name}*\n  Link: ${rd.url}\n`;
      }
    }
    
    m.react("✅");
    return m.reply(txt);
    
  } catch (err) {
    console.error("[AudioQuran]", err.message);
    m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
