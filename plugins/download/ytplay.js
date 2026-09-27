/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";
import { randomUUID } from "node:crypto";

const config = {
  name: "ytplay",
  alias: ["ytp"],
  category: "download",
  description: "Putar video YouTube dengan HTML AI Rich + Direct Player",
  usage: ".ytplay <judul/link>",
  example: ".ytplay Alan Walker Faded",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 1,
  isEnabled: true,
};

const UA = "Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 Chrome/138 Mobile Safari/537.36";

async function sendHTMLRichMessage(sock, chatId, html, { title = "HTML Player", fallbackText = "" } = {}) {
  const responseId = randomUUID();
  try {
    return await sock.relayMessage(
      chatId,
      {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
          botMetadata: { messageDisclaimerText: '', botResponseId: responseId },
        },
        botForwardedMessage: {
          message: {
            richResponseMessage: {
              messageType: 1,
              submessages: [{ messageType: 2, messageText: title }],
              unifiedResponse: {
                data: Buffer.from(JSON.stringify({
                  response_id: responseId,
                  sections: [{
                    view_model: {
                      primitive: {
                        __typename: 'GenAIaeacdsnwHtmlPrimitive',
                        payload: html,
                        trusted_sources: [],
                      },
                      __typename: 'GenAISingleLayoutViewModel',
                    },
                  }],
                })).toString('base64'),
              },
              contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedAiBotMessageInfo: { botJid: '867051314767696@bot' },
                forwardOrigin: 4,
              },
            },
          },
        },
      },
      { messageId: responseId },
    );
  } catch (e) {
    if (fallbackText && typeof sock?.sendMessage === 'function') {
      return sock.sendMessage(chatId, { text: fallbackText });
    }
    throw e;
  }
}


function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function jsEsc(value) {
  return String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\r/g, "\\r")
    .replace(/\n/g, "\\n")
    .replace(/</g, "\\x3C")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function cleanYoutubeUrl(value) {
  try {
    const u = new URL(String(value).trim());
    const host = u.hostname.toLowerCase().replace(/^www\./, "");
    if (!/^(youtube\.com|m\.youtube\.com|youtu\.be)$/.test(host)) return "";
    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube.com/watch?v=${encodeURIComponent(id)}` : "";
    }
    if (u.pathname === "/watch" && u.searchParams.get("v")) {
      return `https://www.youtube.com/watch?v=${encodeURIComponent(u.searchParams.get("v"))}`;
    }
    if (u.pathname.startsWith("/shorts/")) {
      const id = u.pathname.split("/").filter(Boolean)[1];
      return id ? `https://www.youtube.com/watch?v=${encodeURIComponent(id)}` : "";
    }
    if (u.pathname.startsWith("/embed/")) {
      const id = u.pathname.split("/").filter(Boolean)[1];
      return id ? `https://www.youtube.com/watch?v=${encodeURIComponent(id)}` : "";
    }
    return "";
  } catch {
    return "";
  }
}

function isYoutubeUrl(value) {
  return !!cleanYoutubeUrl(value);
}

function textOf(node) {
  if (typeof node === "string") return node;
  if (!node || typeof node !== "object") return "";
  if (typeof node.simpleText === "string") return node.simpleText;
  if (Array.isArray(node.runs)) return node.runs.map(x => x?.text || "").join("");
  return "";
}

async function searchYoutube(query) {
  const endpoint = "https://www.youtube.com/youtubei/v1/search?prettyPrint=false";
  const body = {
    context: {
      client: {
        clientName: "WEB",
        clientVersion: "2.20260904.01.00",
        hl: "id",
        gl: "ID",
      },
    },
    query: String(query).trim(),
  };

  const { data } = await axios.post(endpoint, body, {
    timeout: 25000,
    headers: {
      "user-agent": UA,
      accept: "application/json",
      "content-type": "application/json",
      origin: "https://www.youtube.com",
      referer: "https://www.youtube.com/",
    },
  });

  const hits = [];
  const seen = new Set();
  const walk = node => {
    if (!node || typeof node !== "object" || hits.length >= 8) return;
    const v = node.videoRenderer;
    if (v?.videoId && !seen.has(v.videoId)) {
      seen.add(v.videoId);
      hits.push({
        id: v.videoId,
        url: `https://www.youtube.com/watch?v=${v.videoId}`,
        title: textOf(v.title) || "YouTube Video",
        channel: textOf(v.ownerText) || textOf(v.longBylineText) || "YouTube",
        thumb: v.thumbnail?.thumbnails?.at(-1)?.url || `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`,
        duration: textOf(v.lengthText) || "",
      });
    }
    for (const value of Object.values(node)) walk(value);
  };
  walk(data);

  if (!hits.length) throw new Error("Video YouTube tidak ditemukan");
  return hits[0];
}

async function getOembed(url) {
  try {
    const { data } = await axios.get("https://www.youtube.com/oembed", {
      params: { url, format: "json" },
      timeout: 10000,
      headers: { "user-agent": UA },
    });
    return {
      title: data?.title || "YouTube Video",
      channel: data?.author_name || "YouTube",
      thumb: data?.thumbnail_url || "",
    };
  } catch {
    return null;
  }
}

async function posterData(url) {
  if (!url) return "";
  try {
    const r = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 12000,
      headers: { "user-agent": UA },
      maxContentLength: 3 * 1024 * 1024,
    });
    const type = String(r.headers?.["content-type"] || "image/jpeg").split(";")[0];
    if (!/^image\//i.test(type)) return "";
    return `data:${type};base64,${Buffer.from(r.data).toString("base64")}`;
  } catch {
    return "";
  }
}


function youtubeId(value) {
  try {
    const u = new URL(String(value).trim());
    const host = u.hostname.toLowerCase().replace(/^www\./, "");
    if (host === "youtu.be") return u.pathname.split("/").filter(Boolean)[0] || "";
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (u.searchParams.get("v")) return u.searchParams.get("v");
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts[0] === "shorts" || parts[0] === "embed") return parts[1] || "";
    }
  } catch {}
  return "";
}

function qualityNumber(value) {
  const m = String(value || "").match(/(\d{3,4})p/i);
  return m ? Number(m[1]) : 0;
}

async function getPlayableStream(youtubeUrl) {
  const id = youtubeId(youtubeUrl);
  if (!id) return null;

  const pipedInstances = [
    "https://pipedapi.kavin.rocks",
    "https://pipedapi.adminforge.de",
  ];

  for (const base of pipedInstances) {
    try {
      const { data } = await axios.get(`${base}/streams/${encodeURIComponent(id)}`, {
        timeout: 12000,
        headers: { "user-agent": UA, accept: "application/json" },
      });

      const streams = Array.isArray(data?.videoStreams) ? data.videoStreams : [];
      const candidates = streams
        .filter(x => x?.url && x?.videoOnly === false && /^video\/mp4(?:;|$)/i.test(String(x?.mimeType || "")))
        .sort((a, b) => qualityNumber(b.quality) - qualityNumber(a.quality));

      if (candidates[0]?.url) {
        return {
          url: candidates[0].url,
          mime: String(candidates[0].mimeType || "video/mp4").split(";")[0],
          duration: Number(data?.duration) > 0 ? Number(data.duration) : 0,
          server: new URL(candidates[0].url).hostname,
          source: "Piped",
        };
      }
    } catch (e) {
      console.warn(`[YTPLAY] Piped resolver failed (${base}):`, e?.message || e);
    }
  }

  const invidiousInstances = [
    "https://inv.nadeko.net",
    "https://invidious.nerdvpn.de",
  ];

  for (const base of invidiousInstances) {
    try {
      const { data } = await axios.get(`${base}/api/v1/videos/${encodeURIComponent(id)}`, {
        params: { local: "true" },
        timeout: 12000,
        headers: { "user-agent": UA, accept: "application/json" },
      });

      const streams = Array.isArray(data?.formatStreams) ? data.formatStreams : [];
      const candidates = streams
        .filter(x => x?.url && /mp4/i.test(String(x?.type || "")))
        .sort((a, b) => qualityNumber(b.quality) - qualityNumber(a.quality));

      if (candidates[0]?.url) {
        return {
          url: candidates[0].url,
          mime: "video/mp4",
          duration: Number(data?.lengthSeconds) > 0 ? Number(data.lengthSeconds) : 0,
          server: new URL(candidates[0].url).hostname,
          source: "Invidious",
        };
      }
    } catch (e) {
      console.warn(`[YTPLAY] Invidious resolver failed (${base}):`, e?.message || e);
    }
  }

  return null;
}

function playerHtml({ title, channel, duration, videoUrl, poster, mediaUrl, mediaMime }) {
  const t = esc(title), c = esc(channel), d = esc(duration || "0:00");
  const media = esc(mediaUrl || "");
  const p = esc(poster || "");
  const mmime = esc(mediaMime || "video/mp4");
  const yt = youtubeId(videoUrl);
  const embed = yt ? `https://www.youtube.com/embed/${encodeURIComponent(yt)}?autoplay=0&playsinline=1&rel=0` : "";
  const eembed = jsEsc(embed);
  return `<style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none}html,body{margin:0;width:100%;min-height:100%;font-family:Arial,Helvetica,sans-serif;background:#090a0f;color:#fff}body{padding:10px}.wrap{width:100%;max-width:440px;margin:auto}.card{position:relative;overflow:hidden;background:#111318;border:1px solid rgba(255,255,255,.12);border-radius:22px;box-shadow:0 10px 40px rgba(0,0,0,.55)}.bg{position:absolute;inset:-30px;background:center/cover no-repeat url('${p}');filter:blur(24px);opacity:.3;transform:scale(1.12)}.ov{position:absolute;inset:0;background:linear-gradient(180deg,rgba(5,6,10,.28),rgba(5,6,10,.82))}.content{position:relative;z-index:2;padding:17px}.top{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px}.tt{font-size:13px;font-weight:800;letter-spacing:.9px}.sub{font-size:10px;opacity:.5;margin-top:3px;max-width:280px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.icon{width:35px;height:35px;border:0;border-radius:50%;background:rgba(255,255,255,.09);color:#fff;display:flex;align-items:center;justify-content:center}.frame{position:relative;width:100%;aspect-ratio:16/9;border-radius:16px;overflow:hidden;background:#000;box-shadow:0 12px 35px rgba(0,0,0,.45)}video{width:100%;height:100%;display:block;object-fit:contain;background:#000}iframe{width:100%;height:100%;display:block;border:0;background:#000}.big{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.16);pointer-events:none}.big button{width:62px;height:62px;border:0;border-radius:50%;background:#fff;color:#090a0f;font-size:25px;pointer-events:auto}.playing .big{opacity:0;pointer-events:none}.title{font-size:19px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:15px}.artist{font-size:13px;opacity:.58;margin-top:5px}.prog{margin-top:17px}.range{width:100%;height:4px;accent-color:#fff}.times{display:flex;justify-content:space-between;font-size:10px;opacity:.55;margin-top:7px}.controls{display:flex;align-items:center;justify-content:center;gap:25px;margin-top:13px}.ctrl{width:40px;height:40px;border:0;background:transparent;color:#fff;font-size:23px}.bottom{display:flex;align-items:center;justify-content:space-between;margin-top:14px}.volume{width:86px}.hint{margin-top:13px;font-size:10px;opacity:.5;text-align:center}</style>
<div class="wrap"><div class="card"><div class="bg"></div><div class="ov"></div><div class="content"><div class="top"><div><div class="tt">NOW PLAYING VIDEO</div><div class="sub">${t}</div></div><button class="icon" onclick="mute()">◖</button></div><div class="frame" id="frame"><video id="v" playsinline webkit-playsinline preload="metadata" controls poster="${p}"${media ? ` src="${media}" type="${mmime}"` : ""}></video>${embed ? `<iframe id="yt" src="${eembed}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen style="display:${media ? 'none' : 'block'}"></iframe>` : ''}<div class="big"><button onclick="toggle()">▶</button></div></div><div class="title">${t}</div><div class="artist">${c}</div><div class="prog"><input class="range" id="progress" type="range" min="0" max="100" value="0" step=".1" oninput="seek(this.value)"><div class="times"><span id="cur">0:00</span><span id="dur">${d}</span></div></div><div class="controls"><button class="ctrl" onclick="jump(-10)">↶</button><button class="ctrl" onclick="toggle()" id="cp">▶</button><button class="ctrl" onclick="jump(10)">↷</button></div><div class="bottom"><button class="icon" onclick="toggleLoop()">↻</button><div><button class="icon" onclick="mute()">◖</button><input class="range volume" id="volume" type="range" min="0" max="1" step=".01" value=".8" oninput="setVol(this.value)"></div></div><div class="hint" id="hint">${media ? 'Video siap diputar' : (embed ? 'Memuat YouTube Player...' : 'Sumber video tidak tersedia')}</div></div></div></div>
<script>(function(){var v=document.getElementById('v'),yt=document.getElementById('yt'),frame=document.getElementById('frame'),progress=document.getElementById('progress'),cur=document.getElementById('cur'),dur=document.getElementById('dur'),cp=document.getElementById('cp'),vol=document.getElementById('volume'),hint=document.getElementById('hint');var repeat=false;function tm(n){if(!isFinite(n))return'0:00';return Math.floor(n/60)+':'+String(Math.floor(n%60)).padStart(2,'0')}function ui(){var paused=v.paused;cp.textContent=paused?'▶':'Ⅱ';frame.classList.toggle('playing',!paused)}function safePlay(){if(!v.src){if(hint)hint.textContent='YouTube Player digunakan';return}try{var p=v.play();if(p&&p.catch)p.catch(function(){if(hint)hint.textContent='Tekan ▶ lagi untuk memutar video'})}catch(e){if(hint)hint.textContent='Gagal memutar video'}}window.toggle=function(){if(!v.src){return}if(v.paused)safePlay();else v.pause();ui()};window.jump=function(n){if(isFinite(v.duration))v.currentTime=Math.max(0,Math.min(v.duration,v.currentTime+n))};window.seek=function(x){if(isFinite(v.duration))v.currentTime=Number(x)/100*v.duration};window.setVol=function(x){v.volume=Math.max(0,Math.min(1,Number(x)||0));v.muted=false};window.mute=function(){v.muted=!v.muted};window.toggleLoop=function(){repeat=!repeat;v.loop=repeat};v.volume=.8;v.onloadedmetadata=function(){dur.textContent=tm(v.duration)};v.ontimeupdate=function(){if(!isFinite(v.duration))return;var p=v.currentTime/v.duration*100;progress.value=p;cur.textContent=tm(v.currentTime);dur.textContent=tm(v.duration)};v.onplay=function(){if(yt)yt.style.display='none';ui();if(hint)hint.textContent='Playing'};v.onpause=ui;v.onended=function(){ui();if(repeat){v.currentTime=0;safePlay()}};v.onerror=function(){if(yt&&yt.src){yt.style.display='block';if(hint)hint.textContent='Direct stream gagal, YouTube Player tersedia sebagai fallback'}else if(hint)hint.textContent='Video gagal diputar'};ui()})();</script>`;
}

function tmServer(n) {
  n = Number(n) || 0;
  return Math.floor(n / 60) + ":" + String(Math.floor(n % 60)).padStart(2, "0");
}

async function handler(m, { sock }) {
  const query = String(m.text || "").trim();
  if (!query) return m.reply(`〄 *YT PLAY*\n\n〄 ${m.prefix}ytplay <judul/link>\n〄 ${m.prefix}ytplay https://youtu.be/xxxx`);

  try {
    await m.react("🕐");
    let meta;
    if (isYoutubeUrl(query)) {
      const url = cleanYoutubeUrl(query);
      meta = { url, title: "YouTube Video", channel: "YouTube", thumb: "" };
      const o = await getOembed(url);
      if (o) Object.assign(meta, o);
    } else {
      meta = await searchYoutube(query);
    }

    if (!meta?.url) throw new Error("Video YouTube tidak ditemukan");

    const stream = await getPlayableStream(meta.url);
    const poster = await posterData(meta.thumb);
    const html = playerHtml({
    title: meta.title || "YouTube Video",
      channel: meta.channel || "YouTube",
      duration: meta.duration || (stream?.duration ? tmServer(stream.duration) : "0:00"),
      videoUrl: meta.url,
      poster,
      mediaUrl: stream?.url || "",
      mediaMime: stream?.mime || "video/mp4",
    });

    await sendHTMLRichMessage(sock, m.chat, html, {
      title: "YouTube Player • Fitur By: Anita Putri Azzahra",
      fallbackText: `〄 *YT PLAY*\n\n〄 ${meta.title || "YouTube Video"}\n〄 ${meta.channel || "YouTube"}\n\n〄 Player video siap diputar.`,
    });
    await m.react("✅");
  } catch (e) {
    console.error("[YTPLAY]", e?.stack || e?.message || e);
    await m.react("❌");
    return m.reply(`〄 *YT PLAY ERROR*\n\n〄 ${e?.message || "Gagal memproses video."}`);
  }
}

export default { config, handler };