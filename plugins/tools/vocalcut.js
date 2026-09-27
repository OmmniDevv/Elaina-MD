/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import os from "os";

export const config = {
  name: "vocalcut",
  alias: ["vocal", "separatortrack", "vocal-remover", "remvocals"],
  category: "tools",
  description: "Mempisahkan Vokal dan Musik/Instrumen dari file audio atau Voice Note",
  usage: ".vocalcut (kirim/reply audio)",
  example: ".vocalcut (reply ke file MP3)",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 15,
  energi: 2,
  isEnabled: true,
};

const UA = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36";
const XM_ORIGIN = "https://x-minus.pro";
const XM_AI_URL = "https://x-minus.pro/ai";
const MMD_HOST = "https://mmd.uvronline.app";

function extractAuthKey(html) {
  const m = html.match(/auth_key['"]?\s*[:=]\s*['"]([^'"]+)['"]/);
  if (m) return m[1];
  const m2 = html.match(/g\d+-[a-f0-9]+-\d+/);
  if (m2) return m2[0];
  throw new Error("Gagal mengambil auth key dari server");
}

async function getSession() {
  const res = await fetch(XM_AI_URL, {
    headers: {
      "user-agent": UA,
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      referer: XM_AI_URL
    }
  });
  const html = await res.text();
  const authKey = extractAuthKey(html);
  return { authKey };
}

function buildMultipart(fields, fileField) {
  const boundary = "----VocalCutBoundary" + crypto.randomBytes(12).toString("hex");
  const chunks = [];

  for (const [name, value] of Object.entries(fields)) {
    chunks.push(Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`
    ));
  }

  if (fileField) {
    chunks.push(Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="${fileField.name}"; filename="${fileField.filename}"\r\nContent-Type: ${fileField.contentType}\r\n\r\n`
    ));
    chunks.push(fileField.data);
    chunks.push(Buffer.from("\r\n"));
  }

  chunks.push(Buffer.from(`--${boundary}--\r\n`));

  return { body: Buffer.concat(chunks), boundary };
}

async function uploadJob({ filePath, authKey, model = "mdx_v2_vocft", format = "mp3" }) {
  const fileData = fs.readFileSync(filePath);
  const filename = path.basename(filePath);

  const fields = {
    auth_key: authKey,
    locale: "en_US",
    separation: "inst_vocal",
    separation_type: "vocals_music",
    format,
    version: "3-4-0",
    model,
    aggressiveness: "2",
    lvpanning: "center",
    uvrbve_ct: "auto",
    pre_rate: "100",
    bve_preproc: "auto",
    show_setting_format: "0",
    hostname: "x-minus.pro",
    client_fp: "-"
  };

  const { body, boundary } = buildMultipart(fields, {
    name: "myfile",
    filename,
    contentType: "audio/mpeg",
    data: fileData
  });

  const res = await fetch(`${MMD_HOST}/upload/vocalCutAi?catch-file`, {
    method: "POST",
    headers: {
      "user-agent": UA,
      "content-type": `multipart/form-data; boundary=${boundary}`,
      origin: XM_ORIGIN,
      referer: `${XM_ORIGIN}/`,
      accept: "*/*"
    },
    body
  });

  const json = await res.json();
  return { httpStatus: res.status, ...json };
}

async function checkJobStatus({ jobId, authKey }) {
  const fields = {
    job_id: jobId,
    auth_key: authKey,
    locale: "en_US"
  };

  const { body, boundary } = buildMultipart(fields, null);

  const res = await fetch(`${MMD_HOST}/upload/vocalCutAi?check-job-status`, {
    method: "POST",
    headers: {
      "user-agent": UA,
      "content-type": `multipart/form-data; boundary=${boundary}`,
      origin: XM_ORIGIN,
      referer: `${XM_ORIGIN}/`,
      accept: "*/*"
    },
    body
  });

  const json = await res.json();
  return { httpStatus: res.status, ...json };
}

async function waitForJob({ jobId, authKey, intervalMs = 3000, timeoutMs = 300000 }) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const status = await checkJobStatus({ jobId, authKey });
    if (status.status === "done" || status.status === "error") {
      return status;
    }
    await new Promise(r => setTimeout(r, intervalMs));
  }
  throw new Error("Proses pemisahan vokal memakan waktu terlalu lama (Timeout).");
}

function buildDownloadUrl({ jobId, stem, fmt = "mp3", cdn = "0" }) {
  return `${MMD_HOST}/dl/vocalCutAi?job-id=${jobId}&stem=${stem}&fmt=${fmt}&cdn=${cdn}`;
}

async function resolveDownloadUrl(url) {
  const res = await fetch(url, {
    method: "GET",
    redirect: "manual",
    headers: {
      "user-agent": UA,
      referer: `${XM_ORIGIN}/`,
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    }
  });

  if (res.status >= 300 && res.status < 400) {
    return res.headers.get("location");
  }
  return url;
}

async function downloadFile(url, destPath) {
  const res = await fetch(url, {
    headers: {
      "user-agent": UA,
      referer: `${XM_ORIGIN}/`,
      accept: "*/*"
    }
  });

  if (!res.ok) {
    throw new Error(`Gagal mengunduh hasil dari ${url}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
  return destPath;
}

export async function handler(m, { usedPrefix, prefix, command, sock, conn }) {
  const client = sock || conn;
  const pfx = usedPrefix || prefix || '/';

  // Penanganan Quoted Message / Media Audio yang lebih Fleksibel
  const q = m.quoted ? m.quoted : m;
  const mtype = q.mtype || q.mediaType || '';
  const mime = q.mimetype || q.msg?.mimetype || q.message?.audioMessage?.mimetype || '';

  // Deteksi audio berdasarkan mimetype ATAU tipe pesan (mtype)
  const isAudio = /audio/.test(mime) || mtype === 'audioMessage' || Boolean(q.message?.audioMessage);

  if (!isAudio) {
    return m.reply(
      `*Format Salah!*\n\n` +
      `📌 *Cara Penggunaan:*\n` +
      `Kirim atau reply file **Audio / Voice Note** dengan mengetikkan:\n` +
      `👉 \`${pfx}${command}\``
    );
  }

  const tempDir = os.tmpdir();
  const randomName = crypto.randomBytes(8).toString('hex');
  const tempInputPath = path.join(tempDir, `${randomName}.mp3`);

  const vocalPath = path.join(tempDir, `${randomName}_Vocals.mp3`);
  const instPath = path.join(tempDir, `${randomName}_Instruments.mp3`);

  await m.react('⏳');

  try {
    // Unduh media audio dari WhatsApp
    const mediaBuffer = await q.download();
    if (!mediaBuffer) throw new Error("Gagal mengunduh file audio dari WhatsApp.");

    fs.writeFileSync(tempInputPath, mediaBuffer);

    // Ambil sesi & authKey
    const { authKey } = await getSession();

    // Upload & jalankan pemisahan vokal
    const uploadResult = await uploadJob({ filePath: tempInputPath, authKey, format: "mp3" });

    if (uploadResult.status !== "accepted") {
      throw new Error(uploadResult.message || "Gagal mengunggah file ke server pemisah.");
    }

    const jobId = uploadResult.job_id;
    const finalStatus = await waitForJob({ jobId, authKey });

    if (finalStatus.status !== "done") {
      throw new Error("Proses pemisahan vokal gagal dilakukan oleh AI.");
    }

    // Resolusi link download
    const vocalUrl = buildDownloadUrl({ jobId, stem: "vocal", fmt: "mp3" });
    const instUrl = buildDownloadUrl({ jobId, stem: "inst", fmt: "mp3" });

    const [vocalFinal, instFinal] = await Promise.all([
      resolveDownloadUrl(vocalUrl),
      resolveDownloadUrl(instUrl)
    ]);

    // Download file hasil
    await Promise.all([
      downloadFile(vocalFinal, vocalPath),
      downloadFile(instFinal, instPath)
    ]);

    // Kirim File Vokal
    await client.sendMessage(
      m.chat,
      {
        audio: fs.readFileSync(vocalPath),
        mimetype: "audio/mp4",
        fileName: "Vocal_Track.mp3"
      },
      { quoted: m }
    );

    // Kirim File Instrumen/Musik
    await client.sendMessage(
      m.chat,
      {
        audio: fs.readFileSync(instPath),
        mimetype: "audio/mp4",
        fileName: "Instrument_Track.mp3"
      },
      { quoted: m }
    );

    await m.react('✅');

  } catch (err) {
    console.error(err);
    await m.react('❌');
    m.reply(`❌ *Gagal memproses audio:*\n${err.message || String(err)}`);
  } finally {
    // Bersihkan file sementara
    [tempInputPath, vocalPath, instPath].forEach(filePath => {
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch {}
      }
    });
  }
}
