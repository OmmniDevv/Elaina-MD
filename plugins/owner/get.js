/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import config from "../../config.js";
import axios from "axios";
import fs from "fs";
import path from "path";
import te from "../../src/lib/elaina-error.js";
const pluginConfig = {
  name: "get",
  alias: ["fetch", "http", "request", "curl"],
  category: "owner",
  description: "Advanced HTTP request tool (Owner Only)",
  usage: ".get <url> [options]",
  example:
    '.get https://api.example.com --method POST --json {"key":"value"} --header "Authorization: Bearer token"',
  isOwner: true,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 0,
  energi: 0,
  isEnabled: true,
};

const MAX_CHAT_LENGTH = 4000;
const MAX_JSON_PREVIEW = 6000;

function detectExtension(contentType = "") {
  if (contentType.includes("json")) return "json";
  if (contentType.includes("html")) return "html";
  if (contentType.includes("xml")) return "xml";
  if (contentType.includes("javascript")) return "js";
  if (contentType.includes("css")) return "css";
  if (contentType.includes("yaml")) return "yml";
  if (contentType.includes("text")) return "txt";
  if (contentType.includes("csv")) return "csv";
  if (contentType.includes("pdf")) return "pdf";
  if (contentType.includes("zip")) return "zip";
  if (contentType.includes("gzip") || contentType.includes("tar")) return "gz";
  if (contentType.includes("png")) return "png";
  if (contentType.includes("jpeg")) return "jpg";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("svg")) return "svg";
  if (contentType.includes("mp4")) return "mp4";
  if (contentType.includes("webm")) return "webm";
  if (contentType.includes("mpeg") || contentType.includes("mp3")) return "mp3";
  if (contentType.includes("ogg")) return "ogg";
  if (contentType.includes("wav")) return "wav";
  return "bin";
}

function getMimeCategory(type = "") {
  if (type === "image/gif") return "gif";
  if (type.startsWith("audio/")) return "audio";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("text/") || type.includes("json")) return "text";
  return "document";
}

function isBlockedUrl(url) {
  const blocked = [
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
    "::1",
    "169.254.",
    "metadata.google",
    "metadata.azure",
    "100.100.100.200",
  ];
  return blocked.some((b) => url.includes(b));
}

function formatSize(bytes) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i > 0 ? 2 : 0)} ${units[i]}`;
}

function parseHeaders(headerArgs) {
  const headers = {};
  const regex = /--header\s+["']([^:]+):\s*([^"']+)["']/gi;
  let match;
  while ((match = regex.exec(headerArgs)) !== null) {
    headers[match[1].trim()] = match[2].trim();
  }
  const simpleRegex = /--header\s+(\S+?):(\S+)/gi;
  while ((match = simpleRegex.exec(headerArgs)) !== null) {
    if (!headers[match[1].trim()]) {
      headers[match[1].trim()] = match[2].trim();
    }
  }
  return headers;
}

async function handler(m, { sock }) {
  if (!config.isOwner(m.sender)) {
    return m.reply("❌ *Owner Only!*");
  }

  let input = m.fullArgs?.trim() || m.text?.trim();
  if (!input) {
    return m.reply(
      `🌐 *HTTP REQUEST TOOL*\n\n` +
        `╭┈┈⬡「 📋 OPTIONS 」\n` +
        `┃ ◦ \`--method <GET|POST|PUT|PATCH|DELETE>\`\n` +
        `┃ ◦ \`--json <body>\` — JSON body\n` +
        `┃ ◦ \`--header \"Key: Value\"\` — Custom header\n` +
        `┃ ◦ \`--auth user:pass\` — Basic auth\n` +
        `┃ ◦ \`--verbose\` / \`-v\` — Show response headers\n` +
        `┃ ◦ \`--timeout <ms>\` — Request timeout\n` +
        `┃ ◦ \`--post\` — Shortcut for --method POST\n` +
        `╰┈┈⬡\n\n` +
        `\`Examples:\`\n` +
        `> .get https://api.example.com\n` +
        `> .get https://api.example.com --post --json {\"key\":\"val\"}\n` +
        `> .get https://api.example.com --method PUT --json {\"id\":1}\n` +
        `> .get https://api.example.com --header \"Authorization: Bearer token\"\n` +
        `> .get https://api.example.com --auth user:pass -v`,
    );
  }

  const isVerbose = /--verbose|-v\b/i.test(input);
  input = input.replace(/--verbose|-v\b/gi, "").trim();

  const isPost = /--post\b/i.test(input);
  input = input.replace(/--post\b/gi, "").trim();

  let method = "GET";
  const methodMatch = input.match(/--method\s+(\w+)/i);
  if (methodMatch) {
    method = methodMatch[1].toUpperCase();
    input = input.replace(/--method\s+\w+/i, "").trim();
  } else if (isPost) {
    method = "POST";
  }

  const validMethods = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "HEAD",
    "OPTIONS",
  ];
  if (!validMethods.includes(method)) {
    return m.reply(
      `❌ Invalid method: ${method}. Valid: ${validMethods.join(", ")}`,
    );
  }

  let jsonBody = null;
  const jsonMatch = input.match(/--json\s+(\{[\s\S]*?\})(?=\s+--|$)/i);
  if (jsonMatch) {
    try {
      jsonBody = JSON.parse(jsonMatch[1]);
      input = input.replace(/--json\s+\{[\s\S]*?\}/i, "").trim();
    } catch (e) {
      return m.reply(`❌ Invalid JSON body: ${e.message}`);
    }
  }

  let auth = null;
  const authMatch = input.match(/--auth\s+(\S+)/i);
  if (authMatch) {
    auth = authMatch[1];
    input = input.replace(/--auth\s+\S+/i, "").trim();
  }

  let timeout = 120000;
  const timeoutMatch = input.match(/--timeout\s+(\d+)/i);
  if (timeoutMatch) {
    timeout = Math.min(parseInt(timeoutMatch[1]), 300000);
    input = input.replace(/--timeout\s+\d+/i, "").trim();
  }

  const customHeaders = parseHeaders(input);
  input = input.replace(/--header\s+["'][^"']+["']/gi, "").trim();
  input = input.replace(/--header\s+\S+:\S+/gi, "").trim();

  let url = input.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  if (isBlockedUrl(url)) {
    return m.reply("❌ Localhost / internal / metadata address blocked");
  }

  try {
    new URL(url);
  } catch {
    return m.reply("❌ Invalid URL");
  }

  await m.reply(`🕕 ${method} ${url} ...`);

  try {
    const startTime = Date.now();

    const axiosConfig = {
      timeout,
      maxRedirects: 5,
      validateStatus: () => true,
      responseType: "arraybuffer",
      headers: {
        "User-Agent": "Rimuru-Bot/2.0",
        Accept: "*/*",
        ...(jsonBody ? { "Content-Type": "application/json" } : {}),
        ...customHeaders,
      },
      ...(auth
        ? {
            auth: {
              username: auth.split(":")[0],
              password: auth.split(":").slice(1).join(":"),
            },
          }
        : {}),
    };

    const response = await axios({
      method: method.toLowerCase(),
      url,
      data: jsonBody,
      ...axiosConfig,
    });

    const elapsed = Date.now() - startTime;
    const contentType = response.headers["content-type"] || "";
    const mimeType = contentType.split(";")[0];
    const ext = detectExtension(contentType);
    const category = getMimeCategory(mimeType);

    const buffer = Buffer.from(response.data);
    const size = buffer.length;
    const statusEmoji =
      response.status >= 200 && response.status < 300 ? "✅" : "⚠️";

    let header = `🌐 *HTTP RESPONSE*

╭┈┈⬡「 📋 INFO 」
┃ ${statusEmoji} Status: ${response.status} ${response.statusText}
┃ 📨 Method: ${method}
┃ ⏱️ Time: ${elapsed}ms
┃ 📦 Size: ${formatSize(size)}
┃ 📄 Type: ${mimeType || "unknown"}
╰┈┈⬡`;

    if (isVerbose) {
      const respHeaders = Object.entries(response.headers)
        .map(([k, v]) => `┃ ${k}: ${v}`)
        .join("\n");
      header += `\n\n╭┈┈⬡「 📨 RESPONSE HEADERS 」\n${respHeaders}\n╰┈┈⬡`;
    }

    if (category === "gif") {
      await sock.sendMessage(
        m.chat,
        {
          video: buffer,
          gifPlayback: true,
          mimetype: "video/mp4",
          caption: header,
        },
        { quoted: m },
      );
    } else if (category === "audio") {
      await sock.sendMessage(
        m.chat,
        {
          audio: buffer,
          mimetype: mimeType,
          caption: header,
        },
        { quoted: m },
      );
    } else if (category === "video") {
      await sock.sendMessage(
        m.chat,
        {
          video: buffer,
          mimetype: mimeType,
          caption: header,
        },
        { quoted: m },
      );
    } else if (category === "image") {
      await sock.sendMessage(
        m.chat,
        {
          image: buffer,
          mimetype: mimeType,
          caption: header,
        },
        { quoted: m },
      );
    } else if (category === "text" && buffer.length <= MAX_CHAT_LENGTH) {
      let text = buffer.toString();
      if (ext === "json") {
        try {
          const parsed = JSON.parse(text);
          text = JSON.stringify(parsed, null, 2);
          if (text.length > MAX_JSON_PREVIEW) {
            text =
              text.slice(0, MAX_JSON_PREVIEW) +
              "\n\n... (truncated, full size: " +
              formatSize(size) +
              ")";
          }
        } catch {}
      }
      await m.reply(header + `\n\n\`\`\`${text}\`\`\``);
    } else if (category === "text" && buffer.length > MAX_CHAT_LENGTH) {
      if (ext === "json") {
        try {
          const parsed = JSON.parse(buffer.toString());
          const pretty = JSON.stringify(parsed, null, 2);
          const preview = pretty.slice(0, MAX_CHAT_LENGTH);
          const fileName = `response_${Date.now()}.json`;
          await sock.sendMessage(
            m.chat,
            {
              document: Buffer.from(pretty, "utf-8"),
              fileName,
              mimetype: "application/json",
              caption:
                header +
                `\n\n📄 Pretty JSON dikirim sebagai file (${formatSize(pretty.length)})`,
            },
            { quoted: m },
          );
        } catch {
          const fileName = `response_${Date.now()}.${ext}`;
          await sock.sendMessage(
            m.chat,
            {
              document: buffer,
              fileName,
              mimetype: mimeType || "application/octet-stream",
              caption: header + "\n\n📎 Full response dikirim sebagai file",
            },
            { quoted: m },
          );
        }
      } else {
        const fileName = `response_${Date.now()}.${ext}`;
        await sock.sendMessage(
          m.chat,
          {
            document: buffer,
            fileName,
            mimetype: mimeType || "application/octet-stream",
            caption: header + "\n\n📎 Full response dikirim sebagai file",
          },
          { quoted: m },
        );
      }
    } else {
      const fileName = `response_${Date.now()}.${ext}`;
      await sock.sendMessage(
        m.chat,
        {
          document: buffer,
          fileName,
          mimetype: mimeType || "application/octet-stream",
          caption: header + "\n\n📎 Full response dikirim sebagai file",
        },
        { quoted: m },
      );
    }
  } catch (e) {
    await m.reply(`❌ *REQUEST FAILED*\n\n> ${e.message}`);
  }
}

export { pluginConfig as config, handler };
