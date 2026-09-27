/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import http from "http";
import https from "https";
import te from "../../src/lib/elaina-error.js";

const pluginConfig = {
  name: "searchthatsong",
  alias: ["sts", "carilagu"],
  category: "search",
  description: "Mencari detail sebuah lagu dari lirik atau potongan kata",
  usage: ".searchthatsong <potongan lirik>",
  example: ".searchthatsong ku menangis membayangkan",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

const _BASE = "https://searchthatsong.com";
const _UA = "Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36 VyrSTS/1.0";

function _vyrRequest(method, url, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const isHttps = parsed.protocol === "https:";
    const lib = isHttps ? https : http;
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: parsed.hostname,
      port: parsed.port || (isHttps ? 443 : 80),
      path: parsed.pathname + parsed.search,
      method,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json, text/plain, */*",
        "User-Agent": _UA,
        "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        ...(payload ? { "Content-Length": Buffer.byteLength(payload) } : {}),
        ...headers,
      },
    };
    const req = lib.request(options, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        const raw = Buffer.concat(chunks).toString();
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(raw) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, data: raw });
        }
      });
    });
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function _extractSessionId(setCookieArr) {
  if (!setCookieArr) return null;
  const cookies = Array.isArray(setCookieArr) ? setCookieArr : [setCookieArr];
  for (const c of cookies) {
    const m = c.match(/session_id=([^;]+)/);
    if (m) return m[1];
  }
  return null;
}

async function _routePreview(query, sessionCookie = "") {
  const headers = sessionCookie ? { Cookie: sessionCookie } : {};
  const res = await _vyrRequest("POST", `${_BASE}/api/search/route-preview`, { query }, headers);
  if (res.status !== 200) throw new Error(`request failed [rp] status=${res.status}`);
  const sid = _extractSessionId(res.headers["set-cookie"]);
  return { route: res.data, sessionId: sid };
}

async function _fullSearch(query, routePreview, sessionId = "") {
  const headers = sessionId ? { Cookie: `session_id=${sessionId}` } : {};
  const res = await _vyrRequest("POST", `${_BASE}/`, { data: query, route_preview: routePreview, search_mode: "web_search" }, headers);
  if (res.status !== 200) throw new Error(`request failed [fs] status=${res.status}`);
  return res.data;
}

function _buildResult(raw) {
  const a = raw.answer || raw;
  return {
    song: a.song ?? null,
    artist: a.artist ?? null,
    album: a.album ?? null,
    year: a.year_song_released ?? a.year ?? null,
    genre: a.genre ?? null,
    confidence: a.router_confidence ?? null,
    lyrics: (a.plain_lyrics && a.plain_lyrics !== "n/a") ? a.plain_lyrics : null,
    relevantChunk: (a.most_relevant_chunk && a.most_relevant_chunk !== "n/a") ? a.most_relevant_chunk : null,
    previewUrl: a.preview_audio_url ?? null,
    albumArtwork: a.album_artwork_url ?? a.album_artwork ?? null,
    youtubeUrl: a.Youtube_URL ?? a.youtube_url ?? null,
  };
}

async function search(query) {
  const { route: routeData, sessionId } = await _routePreview(query, "");
  const sid = sessionId || routeData.session_id;
  const routePreview = routeData.route ?? routeData;
  const fullData = await _fullSearch(query, routePreview, sid);
  return _buildResult(fullData);
}

async function handler(m, { sock }) {
  const query = m.args.join(" ") || m.text?.trim();

  if (!query) {
    return m.reply("❌ Masukkan potongan lirik atau nama lagu yang ingin dicari.\n\nContoh: `.sts ku menangis membayangkan`");
  }

  await m.react("🕕");

  try {
    const result = await search(query);

    if (!result.song) {
      await m.react("❌");
      return m.reply("⚠️ Lagu tidak ditemukan. Coba gunakan lirik yang lebih spesifik.");
    }

    let caption = `🎵 *SEARCH THAT SONG* 🎵\n\n`;
    caption += `*Judul:* ${result.song}\n`;
    if (result.artist) caption += `*Artis:* ${result.artist}\n`;
    if (result.album) caption += `*Album:* ${result.album}\n`;
    if (result.year) caption += `*Tahun:* ${result.year}\n`;
    if (result.genre) caption += `*Genre:* ${result.genre}\n`;
    if (result.youtubeUrl) caption += `*YouTube:* ${result.youtubeUrl}\n`;
    if (result.relevantChunk) caption += `\n*Match:* ${result.relevantChunk}\n`;
    
    if (result.albumArtwork) {
      await sock.sendMessage(m.chat, {
        image: { url: result.albumArtwork },
        caption: caption.trim()
      }, { quoted: m });
    } else {
      await m.reply(caption.trim());
    }

    if (result.lyrics) {
      await sock.sendMessage(m.chat, { text: `*Lirik:*\n\n${result.lyrics}` }, { quoted: m });
    }

    if (result.previewUrl) {
      await sock.sendMessage(m.chat, {
        audio: { url: result.previewUrl },
        mimetype: "audio/mpeg",
        ptt: false
      }, { quoted: m });
    }

    await m.react("✅");

  } catch (error) {
    console.error("[SearchThatSong]", error.message);
    await m.react("☢");
    m.reply("😔 Terjadi kesalahan saat mencari lagu. Server mungkin sedang bermasalah.");
  }
}

export { pluginConfig as config, handler };
