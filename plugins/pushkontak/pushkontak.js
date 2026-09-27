/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fs from "fs";
import path from "path";
import { getDatabase } from "../../src/lib/elaina-database.js";
import { getGroupMode } from "../group/botmode.js";
import te from "../../src/lib/elaina-error.js";
import config from "../../config.js";
import {
  resolveAnyLidToJid,
  isLidConverted,
  getCachedJid,
} from "../../src/lib/elaina-lid.js";

const pluginConfig = {
  name: "pushkontak",
  alias: [
    "puskontak",
    "push",
    "stoppush",
    "setjedapush",
    "pushkontak_start",
    "kelolapush",
    "autovcf_on",
    "autovcf_off",
    "kodeunik_on",
    "kodeunik_off",
    "vcftarget_private",
    "vcftarget_group",
    "skipadmin_on",
    "skipadmin_off",
  ],
  category: "pushkontak",
  description: "Push pesan ke semua member grup + auto simpan kontak VCF",
  usage: ".pushkontak",
  example: ".pushkontak",
  isOwner: true,
  isPremium: false,
  isGroup: true,
  isPrivate: false,
  cooldown: 10,
  energi: 0,
  isEnabled: true,
};

if (!global.pushkontakSessions) global.pushkontakSessions = {};

const SESSION_TIMEOUT = 300000;
const SERIAL_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

import axios from "axios";
import { getAssetBuffer } from "../../src/lib/elaina-asset-manager.js";

let cachedThumb = null;
let cachedDoc = null;
try {
  if (getAssetBuffer("rimuru")) {
    cachedThumb = getAssetBuffer("rimuru");
  }
  cachedDoc = fs.readFileSync("./package.json");
} catch { }

function serial(len) {
  let r = "";
  for (let i = 0; i < len; i++)
    r += SERIAL_CHARS[Math.floor(Math.random() * SERIAL_CHARS.length)];
  return r;
}

function buildVcf(contacts) {
  return contacts
    .map((jid) => {
      const num = jid.split("@")[0];
      return `BEGIN:VCARD\nVERSION:3.0\nFN:WA[${serial(2)}] ${num}\nTEL;type=CELL;type=VOICE;waid=${num}:+${num}\nEND:VCARD\n`;
    })
    .join("");
}

function resolveParticipants(metadata, botId, senderJid, skipAdmin = false) {
  return metadata.participants
    .filter((p) => {
      if (skipAdmin && (p.admin === "admin" || p.admin === "superadmin"))
        return false;
      return true;
    })
    .map((p) => {
      if (p.phoneNumber) return p.phoneNumber;
      if (p.jid && !p.jid.endsWith("@lid")) return p.jid;
      if (p.id && !p.id.endsWith("@lid")) return p.id;
      const resolved = resolveAnyLidToJid(p.jid || p.id, metadata.participants);
      if (resolved && !resolved.endsWith("@lid") && !isLidConverted(resolved))
        return resolved;
      const cached = getCachedJid(p.jid || p.id || p.lid || "");
      if (cached && !cached.endsWith("@lid") && !isLidConverted(cached))
        return cached;
      return null;
    })
    .filter((id) => id && id !== botId && !id.includes(senderJid));
}

function getSession(jid) {
  return global.pushkontakSessions[jid] || null;
}

function clearSession(jid) {
  const s = global.pushkontakSessions[jid];
  if (s?.timeout) clearTimeout(s.timeout);
  delete global.pushkontakSessions[jid];
}

function createSession(jid, chatJid) {
  clearSession(jid);
  const session = {
    step: "message",
    message: null,
    chatJid,
    promptId: null,
    startedAt: Date.now(),
    timeout: setTimeout(() => {
      delete global.pushkontakSessions[jid];
    }, SESSION_TIMEOUT),
  };
  global.pushkontakSessions[jid] = session;
  return session;
}

function nativeFlowMsg(m, title, buttons) {
  return {
    interactiveMessage: {
      title,
      footer: config.bot?.name || "Rimuru-AI",
      image: cachedThumb,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 7,
        isForwarded: true,
      },
      nativeFlowMessage: {
        messageParamsJson: JSON.stringify({
          limited_time_offer: {
            text: config.bot?.name || "Rimuru-AI",
            url: "",
            copy_code: "Push Kontak",
            expiration_time: Date.now() * 7,
          },
          bottom_sheet: {
            in_thread_buttons_limit: 2,
            divider_indices: [1, 2, 3, 4, 5, 999],
            list_title: "Push Kontak",
            button_title: "📢 Pilih Fitur",
          },
          tap_target_configuration: {
            title: " X ",
            description: "bomboclard",
            canonical_url: "https://rimuru.site",
            domain: "shop.example.com",
            button_index: 0,
          },
        }),
        buttons,
      },
    },
  };
}

async function sendVcf(sock, ownerJid, contacts, groupName) {
  const tmpDir = path.join(process.cwd(), "tmp");
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
  const vcfPath = path.join(tmpDir, `pushkontak_${Date.now()}.vcf`);
  fs.writeFileSync(vcfPath, buildVcf(contacts), "utf8");
  await sock.sendMessage(ownerJid, {
    document: fs.readFileSync(vcfPath),
    fileName: `Kontak_${groupName || "Group"}_${contacts.length}.vcf`,
    mimetype: "text/vcard",
    caption:
      `💾 *AUTO-SAVE KONTAK*\n\n` +
      `📊 *Total:* ${contacts.length} kontak\n` +
      `👥 *Grup:* ${groupName || "Unknown"}\n\n` +
      `📱 _Import file ini ke HP untuk menyimpan semua kontak_`,
  });
  try {
    fs.unlinkSync(vcfPath);
  } catch { }
}

async function handleStop(m) {
  if (!global.statuspush) {
    return m.reply(
      `❌ *GAGAL*\n\n🚫 *Tidak ada push kontak yang berjalan saat ini*`,
    );
  }
  global.stoppush = true;
  m.react("⏹️");
  return m.reply(
    `⏹️ *PUSH DIHENTIKAN*\n\n✅ *Proses push kontak akan segera berhenti*`,
  );
}

function getPushSettings(db) {
  return {
    autoVcf: db.setting("pushAutoVcf") !== false,
    kodeUnik: db.setting("pushKodeUnik") !== false,
    vcfTarget: db.setting("pushVcfTarget") || "private",
    skipAdmin: db.setting("pushSkipAdmin") === true,
    jeda: db.setting("jedaPush") || 5000,
  };
}

async function handleKelola(m, sock) {
  const db = getDatabase();
  const s = getPushSettings(db);
  const p = m.prefix;

  const buttons = [
    {
      name: "single_select",
      buttonParamsJson: JSON.stringify({ has_multiple_buttons: true }),
    },
    {
      name: "single_select",
      buttonParamsJson: JSON.stringify({
        title: "⚙️ Kelola Push Kontak",
        sections: [
          {
            title: "💾 Auto VCF",
            highlight_label: s.autoVcf ? "ON" : "OFF",
            rows: [
              {
                title: `${s.autoVcf ? "🔴" : "🟢"} Auto VCF: ${s.autoVcf ? "Matikan" : "Nyalakan"}`,
                id: `${p}${s.autoVcf ? "autovcf_off" : "autovcf_on"}`,
                description: "Simpan kontak ke VCF otomatis setelah push",
              },
            ],
          },
          {
            title: "🔑 Kode Unik",
            highlight_label: s.kodeUnik ? "ON" : "OFF",
            rows: [
              {
                title: `${s.kodeUnik ? "🔴" : "🟢"} Kode Unik: ${s.kodeUnik ? "Matikan" : "Nyalakan"}`,
                id: `${p}${s.kodeUnik ? "kodeunik_off" : "kodeunik_on"}`,
                description: "Tambah kode random di akhir pesan",
              },
            ],
          },
          {
            title: "📱 Target VCF",
            highlight_label: s.vcfTarget === "private" ? "Private" : "Group",
            rows: [
              {
                title: `${s.vcfTarget === "private" ? "✅" : "⬜"} Kirim ke Private Chat`,
                id: `${p}vcftarget_private`,
                description: "VCF dikirim ke chat pribadi owner",
              },
              {
                title: `${s.vcfTarget === "group" ? "✅" : "⬜"} Kirim ke Group Chat`,
                id: `${p}vcftarget_group`,
                description: "VCF dikirim ke group chat",
              },
            ],
          },
          {
            title: "👑 Skip Admin",
            highlight_label: s.skipAdmin ? "ON" : "OFF",
            rows: [
              {
                title: `${s.skipAdmin ? "🔴" : "🟢"} Skip Admin: ${s.skipAdmin ? "Matikan" : "Nyalakan"}`,
                id: `${p}${s.skipAdmin ? "skipadmin_off" : "skipadmin_on"}`,
                description: "Lewati admin grup saat push",
              },
            ],
          },
          {
            title: "⏱️ Jeda Push",
            highlight_label: `${(s.jeda / 1000).toFixed(0)}s`,
            rows: [
              {
                title: "⚡ 3 Detik",
                id: `${p}setjedapush 3000`,
                description: "Cepat, risiko ban tinggi",
              },
              {
                title: "🔄 5 Detik",
                id: `${p}setjedapush 5000`,
                description: "Normal, rekomendasi",
              },
              {
                title: "🛡️ 10 Detik",
                id: `${p}setjedapush 10000`,
                description: "Aman dari ban",
              },
              {
                title: "🐢 15 Detik",
                id: `${p}setjedapush 15000`,
                description: "Sangat aman",
              },
            ],
          },
        ],
        has_multiple_buttons: true,
      }),
    },
    {
      name: "quick_reply",
      buttonParamsJson: JSON.stringify({
        display_text: "📢 Mulai Push",
        id: `${p}pushkontak_start`,
      }),
    },
  ];

  return sock.sendMessage(
    m.chat,
    nativeFlowMsg(
      m,
      `⚙️ *KELOLA PUSH KONTAK*

` +
      `📋 *SETTING SAAT INI*\n\n` +
      `💾 Auto VCF: *${s.autoVcf ? "✅ ON" : "❌ OFF"}*\n` +
      `🔑 Kode Unik: *${s.kodeUnik ? "✅ ON" : "❌ OFF"}*\n` +
      `📱 VCF Target: *${s.vcfTarget === "private" ? "Private" : "Group"}*\n` +
      `👑 Skip Admin: *${s.skipAdmin ? "✅ ON" : "❌ OFF"}*\n` +
      `⏱️ Jeda: *${s.jeda}ms (${(s.jeda / 1000).toFixed(1)}s)*\n\n` +
      `📌 *Pilih dari tombol di bawah untuk mengubah setting*`,
      buttons,
    ),
    { quoted: m },
  );
}

async function handleSettingToggle(m, settingKey, label, onVal, offVal) {
  const db = getDatabase();
  const cmd = m.command?.toLowerCase();
  const isOn = cmd.endsWith("_on");
  db.setting(settingKey, isOn ? onVal : offVal);
  m.react(isOn ? "✅" : "🔴");
  await m.reply(
    `${isOn ? "✅" : "🔴"} *${label} ${isOn ? "DINYALAKAN" : "DIMATIKAN"}*

` + `⚙️ *${label}:* ${isOn ? "ON" : "OFF"}`,
  );
}

async function handleSetJeda(m, sock) {
  const db = getDatabase();
  const val = parseInt(m.args[1] || m.args[0]);

  if (!val || isNaN(val)) {
    const current = db.setting("jedaPush") || 5000;
    const buttons = [
      {
        name: "single_select",
        buttonParamsJson: JSON.stringify({ has_multiple_buttons: true }),
      },
      {
        name: "single_select",
        buttonParamsJson: JSON.stringify({
          title: "⏱️ Pilih Jeda",
          sections: [
            {
              title: "⏱️ Rekomendasi Jeda Push Kontak",
              highlight_label: "Rekomendasi",
              rows: [
                {
                  title: "⚡ 3 Detik (Cepat)",
                  id: `${m.prefix}setjedapush 3000`,
                  description: "Risiko ban lebih tinggi",
                },
                {
                  title: "🔄 5 Detik (Normal)",
                  id: `${m.prefix}setjedapush 5000`,
                  description: "Rekomendasi untuk pemakaian umum",
                },
                {
                  title: "🛡️ 10 Detik (Aman)",
                  id: `${m.prefix}setjedapush 10000`,
                  description: "Paling aman dari risiko ban",
                },
                {
                  title: "🐢 15 Detik (Sangat Aman)",
                  id: `${m.prefix}setjedapush 15000`,
                  description: "Untuk grup besar 500+ member",
                },
                {
                  title: "🏔️ 30 Detik (Maksimal)",
                  id: `${m.prefix}setjedapush 30000`,
                  description: "Jeda paling lama",
                },
              ],
            },
          ],
          has_multiple_buttons: true,
        }),
      },
    ];
    return sock.sendMessage(
      m.chat,
      nativeFlowMsg(
        m,
        `⏱️ *SET JEDA PUSH KONTAK*\n\n` +
        `📋 *Mengatur interval antar pengiriman pesan*\n\n` +
        `⏱️ *Jeda saat ini:* ${current}ms (${(current / 1000).toFixed(1)} detik)\n\n` +
        `*PENGGUNAAN:*\n` +
        `📝 *${m.prefix}setjedapush <milidetik>* — Mengubah jeda push\n\n` +
        `*PENJELASAN:*\n` +
        `1. Jeda adalah waktu tunggu antar pengiriman pesan ke setiap member\n` +
        `2. Semakin kecil jeda, semakin cepat push selesai, tapi risiko ban lebih tinggi\n` +
        `3. Rekomendasi minimal *3000ms* (3 detik) agar aman\n` +
        `4. Nilai maksimal *30000ms* (30 detik)\n\n` +
        `📌 *Pilih jeda dari tombol di bawah atau ketik manual*`,
        buttons,
      ),
      { quoted: m },
    );
  }

  if (val < 1000 || val > 30000) {
    return m.reply(`❌ *GAGAL*\n\n🚫 *Jeda harus antara 1000ms - 30000ms*`);
  }

  db.setting("jedaPush", val);
  m.react("✅");
  return m.reply(
    `✅ *JEDA DIUBAH*\n\n` +
    `⏱️ *Jeda baru:* ${val}ms (${(val / 1000).toFixed(1)} detik)`,
  );
}

async function handlePush(m, sock) {
  const db = getDatabase();
  const groupMode = getGroupMode(m.chat, db);

  if (groupMode !== "pushkontak" && groupMode !== "all") {
    const buttons = [
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "🔓 Aktifkan Mode Pushkontak",
          id: `${m.prefix}botmode pushkontak`,
        }),
      },
    ];
    return sock.sendMessage(
      m.chat,
      nativeFlowMsg(
        m,
        `❌ *MODE TIDAK SESUAI*\n\n` +
        `🔒 *Grup ini belum dalam mode pushkontak*\n\n` +
        `*CARA AKTIVASI:*\n` +
        `1. Tekan tombol di bawah untuk mengaktifkan mode pushkontak\n` +
        `2. Setelah mode berubah, ulangi perintah push kontak`,
        buttons,
      ),
      { quoted: m },
    );
  }

  const text = m.text?.trim();

  if (text) {
    return startPush(m, sock, text);
  }

  const s = getPushSettings(db);
  const buttons = [
    {
      name: "single_select",
      buttonParamsJson: JSON.stringify({ has_multiple_buttons: true }),
    },
    {
      name: "single_select",
      buttonParamsJson: JSON.stringify({
        title: "📋 Pilih Fitur",
        sections: [
          {
            title: "📢 Aksi",
            highlight_label: "Push Kontak",
            rows: [
              {
                title: "📢 Mulai Push (Sesi Input)",
                id: `${m.prefix}pushkontak_start`,
                description: "Input pesan lalu push ke semua member",
              },
              {
                title: "⏹️ Stop Push",
                id: `${m.prefix}stoppush`,
                description: "Hentikan push yang sedang berjalan",
              },
            ],
          },
          {
            title: "⚙️ Kelola Cepat",
            highlight_label: "Setting",
            rows: [
              {
                title: "⚙️ Kelola Push Kontak",
                id: `${m.prefix}kelolapush`,
                description: `VCF:${s.autoVcf ? "ON" : "OFF"} | Kode:${s.kodeUnik ? "ON" : "OFF"} | Jeda:${(s.jeda / 1000).toFixed(0)}s`,
              },
              {
                title: "⏱️ Set Jeda Push",
                id: `${m.prefix}setjedapush`,
                description: `Jeda saat ini: ${s.jeda}ms`,
              },
            ],
          },
        ],
        has_multiple_buttons: true,
      }),
    },
    {
      name: "quick_reply",
      buttonParamsJson: JSON.stringify({
        display_text: "⚙️ Kelola",
        id: `${m.prefix}kelolapush`,
      }),
    },
    {
      name: "quick_reply",
      buttonParamsJson: JSON.stringify({
        display_text: "📢 Mulai Push",
        id: `${m.prefix}pushkontak_start`,
      }),
    },
  ];
  return sock.sendMessage(
    m.chat,
    nativeFlowMsg(
      m,
      `📢 *PUSH KONTAK*\n\n` +
      `📋 *Kirim pesan ke semua member grup secara otomatis + simpan kontak ke file VCF*\n\n` +
      `*PENGGUNAAN:*\n` +
      `📝 *${m.prefix}pushkontak <pesan>* — Push langsung dengan pesan\n` +
      `📢 *${m.prefix}pushkontak* — Buka menu interaktif\n` +
      `⏹️ *${m.prefix}stoppush* — Hentikan push yang sedang berjalan\n` +
      `⏱️ *${m.prefix}setjedapush <ms>* — Atur jeda antar pengiriman\n\n` +
      `*PENJELASAN ALUR PENGGUNAAN:*\n` +
      `1. Pastikan grup dalam mode pushkontak: *${m.prefix}botmode pushkontak*\n` +
      `2. Ketik *${m.prefix}pushkontak* lalu pilih "Mulai Push" dari menu\n` +
      `3. Bot akan meminta kamu menginput pesan yang ingin dikirim via reply\n` +
      `4. Setelah konfirmasi, bot mengirim pesan ke setiap member satu per satu\n` +
      `5. Setiap pesan ditambahkan kode unik agar terdeteksi berbeda oleh WhatsApp\n` +
      `6. Setelah selesai, bot otomatis mengirimkan file VCF berisi semua kontak member\n\n` +
      `*INFO:*\n` +
      `📋 *SETTING*\n\n` +
      `💾 Auto VCF: *${s.autoVcf ? "✅ ON" : "❌ OFF"}*\n` +
      `🔑 Kode Unik: *${s.kodeUnik ? "✅ ON" : "❌ OFF"}*\n` +
      `📱 VCF Target: *${s.vcfTarget === "private" ? "Private" : "Group"}*\n` +
      `👑 Skip Admin: *${s.skipAdmin ? "✅ ON" : "❌ OFF"}*\n` +
      `⏱️ Jeda: *${s.jeda}ms (${(s.jeda / 1000).toFixed(1)}s)*\n\n` +
      `🔑 *Akses:* Owner only`,
      buttons,
    ),
    { quoted: m },
  );
}

async function handleStartSession(m, sock) {
  const db = getDatabase();
  const groupMode = getGroupMode(m.chat, db);

  if (groupMode !== "pushkontak" && groupMode !== "all") {
    return m.reply(
      `❌ *GAGAL*\n\n🔒 *Aktifkan mode pushkontak terlebih dahulu*\n\n📝 *${m.prefix}botmode pushkontak*`,
    );
  }

  if (global.statuspush) {
    return m.reply(
      `❌ *GAGAL*\n\n🔄 *Push kontak sedang berjalan*\n\n⏹️ *Ketik* ${m.prefix}stoppush *untuk menghentikan*`,
    );
  }

  if (getSession(m.sender)) {
    return m.reply(
      `📝 *Sesi push sudah aktif*\n\n📩 *Reply pesan sebelumnya dengan pesan yang ingin di-push*\n\n❌ *Atau reply* \`batal\` *untuk membatalkan*`,
    );
  }

  const session = createSession(m.sender, m.chat);

  const sent = await m.reply(
    `📢 *SESI PUSH KONTAK*\n\n` +
    `📝 *Langkah 1/2 — Input Pesan*\n\n` +
    `🔤 *Kirim pesan yang ingin di-push ke semua member*\n\n` +
    `📩 *Reply pesan ini dengan pesan yang ingin dikirim*\n\n` +
    `❌ *Reply* \`batal\` *untuk membatalkan sesi*`,
  );

  session.promptId = sent?.key?.id || null;
  m.react("📝");
}

async function startPush(m, sock, text) {
  if (global.statuspush) {
    return m.reply(
      `❌ *GAGAL*\n\n🔄 *Push kontak sedang berjalan*\n\n⏹️ *Ketik* ${m.prefix}stoppush *untuk menghentikan*`,
    );
  }

  m.react("📢");

  try {
    const db = getDatabase();
    const metadata = m.groupMetadata;
    const botId = sock.user.id.split(":")[0] + "@s.whatsapp.net";
    const s = getPushSettings(db);
    const participants = resolveParticipants(
      metadata,
      botId,
      m.sender,
      s.skipAdmin,
    );

    if (participants.length === 0) {
      m.react("❌");
      return m.reply(
        `❌ *GAGAL*\n\n🚫 *Tidak ada member yang bisa dikirim pesan*`,
      );
    }

    const jedaPush = s.jeda;
    const estimasi = Math.ceil((participants.length * jedaPush) / 60000);

    const buttons = [
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "⏹️ Stop Push",
          id: `${m.prefix}stoppush`,
        }),
      },
    ];

    await sock.sendMessage(
      m.chat,
      nativeFlowMsg(
        m,
        `📢 *PUSH KONTAK DIMULAI*\n\n` +
        `📝 *Pesan:* ${text.substring(0, 80)}${text.length > 80 ? "..." : ""}\n` +
        `👥 *Target:* ${participants.length} member\n` +
        `⏱️ *Jeda:* ${jedaPush}ms\n` +
        `📊 *Estimasi:* ${estimasi} menit\n` +
        `💾 *Auto VCF:* ${s.autoVcf ? "ON" : "OFF"} | 🔑 *Kode Unik:* ${s.kodeUnik ? "ON" : "OFF"}\n\n` +
        `🔄 *Memulai push...*`,
        buttons,
      ),
      { quoted: m },
    );

    global.statuspush = true;
    let success = 0;
    let failed = 0;
    const saved = [];

    for (const member of participants) {
      if (global.stoppush) {
        delete global.stoppush;
        delete global.statuspush;
        await m.reply(
          `⏹️ *PUSH DIHENTIKAN*\n\n` +
          `✅ *Berhasil:* ${success}\n` +
          `❌ *Gagal:* ${failed}\n` +
          `⏸️ *Sisa:* ${participants.length - success - failed}`,
        );
        if (saved.length > 0 && s.autoVcf) {
          const vcfTarget = s.vcfTarget === "group" ? m.chat : m.sender;
          await sendVcf(sock, vcfTarget, saved, metadata.subject);
        }
        return;
      }

      try {
        const msgText = s.kodeUnik ? `${text}\n\n#${serial(6)}` : text;
        await sock.sendMessage(member, { text: msgText });
        saved.push(member);
        success++;
      } catch {
        failed++;
      }

      await new Promise((r) => setTimeout(r, jedaPush));
    }

    delete global.statuspush;
    if (saved.length > 0 && s.autoVcf) {
      const vcfTarget = s.vcfTarget === "group" ? m.chat : m.sender;
      await sendVcf(sock, vcfTarget, saved, metadata.subject);
    }

    m.react("✅");

    const doneButtons = [
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "📢 Push Ulang",
          id: `${m.prefix}pushkontak_start`,
        }),
      },
    ];

    await sock.sendMessage(
      m.chat,
      nativeFlowMsg(
        m,
        `✅ *PUSH SELESAI*\n\n` +
        `✅ *Berhasil:* ${success}\n` +
        `❌ *Gagal:* ${failed}\n` +
        `📊 *Total:* ${participants.length}\n` +
        `💾 *Kontak:* ${saved.length} disimpan\n\n` +
        `📱 *File VCF telah dikirim ke chat pribadi*`,
        doneButtons,
      ),
      { quoted: m },
    );
  } catch (error) {
    delete global.statuspush;
    m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

async function pushkontakAnswerHandler(m, sock) {
  if (!m.body) return false;
  if (m.isCommand) return false;

  const session = getSession(m.sender);
  if (!session) return false;
  if (m.chat !== session.chatJid) return false;

  const text = m.body.trim();
  const lowText = text.toLowerCase();

  if (["batal", "cancel", "batalkan"].includes(lowText)) {
    clearSession(m.sender);
    await m.reply(
      `❌ *Sesi push kontak dibatalkan*\n\n📢 *Ketik* ${m.prefix}pushkontak *untuk memulai lagi*`,
    );
    return true;
  }

  if (session.step === "message") {
    if (text.length < 1) {
      await m.reply(
        `❌ *Pesan tidak boleh kosong*\n\n📩 *Reply lagi dengan pesan yang valid*`,
      );
      return true;
    }

    session.message = text;
    session.step = "confirm";

    const db = getDatabase();
    const metadata = m.groupMetadata;
    const botId = sock.user.id.split(":")[0] + "@s.whatsapp.net";
    const s = getPushSettings(db);
    const participants = resolveParticipants(
      metadata,
      botId,
      m.sender,
      s.skipAdmin,
    );
    const jedaPush = s.jeda;
    const estimasi = Math.ceil((participants.length * jedaPush) / 60000);

    const sent = await m.reply(
      `✅ *LANGKAH 2/2 — KONFIRMASI*\n\n` +
      `📝 *Pesan:* ${text.substring(0, 100)}${text.length > 100 ? "..." : ""}\n` +
      `👥 *Target:* ${participants.length} member\n` +
      `⏱️ *Jeda:* ${jedaPush}ms\n` +
      `📊 *Estimasi:* ${estimasi} menit\n\n` +
      `*Reply pesan ini dengan:*\n` +
      `✅ *ya* — Mulai push sekarang\n` +
      `📝 *ubah* — Ubah pesan yang ingin dikirim\n` +
      `❌ *batal* — Batalkan sesi`,
    );

    session.promptId = sent?.key?.id || session.promptId;
    return true;
  }

  if (session.step === "confirm") {
    if (
      ["ya", "y", "iya", "yes", "lanjut", "confirm", "ok"].includes(lowText)
    ) {
      const pushMessage = session.message;
      clearSession(m.sender);
      await startPush(m, sock, pushMessage);
      return true;
    }

    if (["ubah", "edit", "ganti", "revisi"].includes(lowText)) {
      session.step = "message";
      const sent = await m.reply(
        `📝 *UBAH PESAN*\n\n` +
        `🔤 *Kirim pesan baru yang ingin di-push*\n\n` +
        `📩 *Reply pesan ini dengan pesan baru*\n\n` +
        `❌ *Reply* \`batal\` *untuk membatalkan*`,
      );
      session.promptId = sent?.key?.id || session.promptId;
      return true;
    }

    await m.reply(
      `❌ *Reply tidak valid*\n\n📩 *Reply dengan:* \`ya\`, \`ubah\`, atau \`batal\``,
    );
    return true;
  }

  return false;
}

async function handler(m, { sock }) {
  const cmd = m.command?.toLowerCase();
  if (cmd === "stoppush") return handleStop(m);
  if (cmd === "setjedapush") return handleSetJeda(m, sock);
  if (cmd === "pushkontak_start") return handleStartSession(m, sock);
  if (cmd === "kelolapush") return handleKelola(m, sock);
  if (cmd === "autovcf_on" || cmd === "autovcf_off")
    return handleSettingToggle(m, "pushAutoVcf", "Auto VCF", true, false);
  if (cmd === "kodeunik_on" || cmd === "kodeunik_off")
    return handleSettingToggle(m, "pushKodeUnik", "Kode Unik", true, false);
  if (cmd === "vcftarget_private")
    return handleSettingToggle(
      m,
      "pushVcfTarget",
      "VCF Target",
      "private",
      "private",
    );
  if (cmd === "vcftarget_group")
    return handleSettingToggle(
      m,
      "pushVcfTarget",
      "VCF Target",
      "group",
      "group",
    );
  if (cmd === "skipadmin_on" || cmd === "skipadmin_off")
    return handleSettingToggle(m, "pushSkipAdmin", "Skip Admin", true, false);
  return handlePush(m, sock);
}

export { pluginConfig as config, handler, pushkontakAnswerHandler };
