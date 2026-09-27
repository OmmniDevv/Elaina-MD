/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

// plugins/benaratausalah.js
const pluginConfig = {
  name: "benaratausalah",
  alias: ['bata', 'benarsalah', 'bors'],
  category: "game",
  description: "Game benar atau salah — jawab pertanyaan dengan 'benar' / 'salah'",
  usage: ".benaratausalah",
  example: ".benaratausalah",
  isOwner: false,
  isPremium: false,
  isGroup: true,
  isPrivate: true,
  cooldown: 3,
  energi: 0,
  isEnabled: true,
};

const API_BASE = "https://api.synoxcloud.xyz/games/benaratausalah";
const API_KEY = "FREE";

// Sesi game per chat: Map<chatId, { question, answer, timeout, startAt }>
const sessions = new Map();

const TIMEOUT_MS = 30_000; // 30 detik
const POIN_BENAR = 10;
const POIN_SALAH = -5;

// Simpan skor per user: Map<jid, poin>
const skor = new Map();

/* ========== AMBIL SOAL ========== */
async function fetchSoal() {
  const url = `${API_BASE}?apikey=${API_KEY}`;
  const res = await fetch(url);

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API HTTP ${res.status}: ${body.slice(0, 200)}`);
  }

  const json = await res.json();

  if (!json?.status || !json?.result) {
    throw new Error(`Response tidak valid: ${JSON.stringify(json).slice(0, 200)}`);
  }

  const { question, answer } = json.result;
  if (!question || !answer) {
    throw new Error("Soal atau jawaban kosong dari API.");
  }

  return {
    question: String(question).trim(),
    answer: String(answer).toLowerCase().trim(), // "benar" / "salah"
  };
}

/* ========== NORMALISASI ========== */
function normalizeJawaban(str) {
  return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w]/g, "");
}

/* ========== HANDLER ========== */
async function handler(m, ctx = {}) {
  const conn = ctx.conn || ctx.client || ctx.sock || m?.conn || m?.client;
  const usedPrefix = ctx.usedPrefix ?? ctx.prefix ?? m?.prefix ?? ".";
  const command = ctx.command ?? ctx.cmd ?? m?.command ?? "benaratausalah";
  const chatId = m.chat || m.key?.remoteJid;

  try {
    const sender = m.sender || m.key?.participant || m.key?.remoteJid;
    const teks = String(ctx.text ?? m?.text ?? m?.body ?? "").trim().toLowerCase();

    // Buang prefix + command kalau masih ada
    let arg = teks;
    if (arg.startsWith(usedPrefix)) arg = arg.slice(usedPrefix.length);
    const parts = arg.split(/\s+/);
    if (parts[0]?.toLowerCase() === command.toLowerCase()) parts.shift();
    arg = parts.join(" ").trim();

    // ====== CEK SUB-COMMAND: .bata skor / .bata reset ======
    if (arg === "skor" || arg === "score") {
      if (!skor.size) return m.reply("📊 Belum ada yang punya skor.");
      const sorted = [...skor.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
      let txt = `🏆 *Top 10 Skor Benar/Salah*\n\n`;
      sorted.forEach(([jid, p], i) => {
        txt += `${i + 1}. @${jid.split("@")[0]} — *${p}* poin\n`;
      });
      return conn.sendMessage(
        chatId,
        { text: txt, mentions: sorted.map(([jid]) => jid) },
        { quoted: m }
      );
    }

    if (arg === "reset" && skor.size) {
      skor.clear();
      return m.reply("♻️ Semua skor direset.");
    }

    // ====== CEK JAWABAN USER (kalau ada sesi aktif) ======
    if (sessions.has(chatId)) {
      const sesi = sessions.get(chatId);
      const jawabanUser = normalizeJawaban(arg);

      // Cuma proses kalau user kirim "benar" atau "salah"
      if (jawabanUser === "benar" || jawabanUser === "salah" || jawabanUser === "b" || jawabanUser === "s") {
        clearTimeout(sesi.timeout);
        sessions.delete(chatId);

        // Normalisasi B/S -> benar/salah
        let final = jawabanUser;
        if (jawabanUser === "b") final = "benar";
        if (jawabanUser === "s") final = "salah";

        const benar = final === sesi.answer;
        const deltaPoin = benar ? POIN_BENAR : POIN_SALAH;
        const poinSekarang = (skor.get(sender) || 0) + deltaPoin;
        skor.set(sender, poinSekarang);

        if (benar) {
          return conn.sendMessage(
            chatId,
            {
              text:
                `✅ *BENAR!*\n\n` +
                `📖 Soal: _${sesi.question}_\n` +
                `🎯 Jawaban: *${sesi.answer}*\n` +
                `🎉 +${POIN_BENAR} poin\n` +
                `📊 Total: *${poinSekarang}* poin\n\n` +
                `_Ketik *${usedPrefix}${command}* untuk soal berikutnya._`,
              mentions: [sender],
            },
            { quoted: m }
          );
        } else {
          return conn.sendMessage(
            chatId,
            {
              text:
                `❌ *SALAH!*\n\n` +
                `📖 Soal: _${sesi.question}_\n` +
                `👤 Jawabanmu: *${final}*\n` +
                `🎯 Jawaban benar: *${sesi.answer}*\n` +
                `💧 ${POIN_SALAH} poin\n` +
                `📊 Total: *${poinSekarang}* poin\n\n` +
                `_Ketik *${usedPrefix}${command}* untuk soal berikutnya._`,
              mentions: [sender],
            },
            { quoted: m }
          );
        }
      }
      // Kalau bukan jawaban valid, lanjut buat soal baru
    }

    // ====== MULAI SOAL BARU ======
    // Bersihkan sesi lama kalau ada
    if (sessions.has(chatId)) {
      clearTimeout(sessions.get(chatId).timeout);
      sessions.delete(chatId);
    }

    await m.reply("🎲 Mengambil soal...");

    let soal;
    try {
      soal = await fetchSoal();
    } catch (e) {
      return m.reply(`❌ Gagal mengambil soal:\n${e.message}`);
    }

    const pesan =
      `🎯 *BENAR ATAU SALAH*\n\n` +
      `📖 *${soal.question}*\n\n` +
      `💬 Jawab dengan: *benar* / *salah*\n` +
      `⏱️ Waktu: *30 detik*\n` +
      `🏆 Benar: +${POIN_BENAR} | Salah: ${POIN_SALAH}\n\n` +
      `_Ketik langsung di chat tanpa prefix._`;

    await conn.sendMessage(chatId, { text: pesan }, { quoted: m });

    // Set timer timeout
    const timeout = setTimeout(() => {
      if (sessions.has(chatId)) {
        sessions.delete(chatId);
        conn
          .sendMessage(chatId, {
            text:
              `⏰ *Waktu habis!*\n\n` +
              `📖 Soal: _${soal.question}_\n` +
              `🎯 Jawaban: *${soal.answer}*\n\n` +
              `_Ketik *${usedPrefix}${command}* untuk soal baru._`,
          })
          .catch(() => {});
      }
    }, TIMEOUT_MS);

    // Simpan sesi
    sessions.set(chatId, {
      question: soal.question,
      answer: soal.answer,
      timeout,
      startAt: Date.now(),
    });
  } catch (err) {
    console.error("[benaratausalah] ERROR:", err);
    try {
      await m.reply(`❌ Error:\n${err.message || err}`);
    } catch (_) {}
  }
}

async function answerHandler(m, sock) {
  const chatId = m.chat || m.key?.remoteJid;
  if (!chatId || !sessions.has(chatId)) return false;
  const raw = String(m.body || m.text || "").trim();
  if (!raw || raw.startsWith(".")) return false;

  const sesi = sessions.get(chatId);
  const jawabanUser = normalizeJawaban(raw);
  if (!['benar', 'salah', 'b', 's'].includes(jawabanUser)) return false;

  clearTimeout(sesi.timeout);
  sessions.delete(chatId);

  const sender = m.sender || m.key?.participant || m.key?.remoteJid;
  const final = jawabanUser === 'b' ? 'benar' : jawabanUser === 's' ? 'salah' : jawabanUser;
  const benar = final === sesi.answer;
  const deltaPoin = benar ? POIN_BENAR : POIN_SALAH;
  const poinSekarang = (skor.get(sender) || 0) + deltaPoin;
  skor.set(sender, poinSekarang);
  const usedPrefix = m.prefix || '.';
  const command = 'benaratausalah';
  const client = sock || m.conn || m.client;

  if (!client?.sendMessage) return false;
  const text = benar
    ? `✅ *BENAR!*\n\n📖 Soal: _${sesi.question}_\n🎯 Jawaban: *${sesi.answer}*\n🎉 +${POIN_BENAR} poin\n📊 Total: *${poinSekarang}* poin\n\n_Ketik *${usedPrefix}${command}* untuk soal berikutnya._`
    : `❌ *SALAH!*\n\n📖 Soal: _${sesi.question}_\n👤 Jawabanmu: *${final}*\n🎯 Jawaban benar: *${sesi.answer}*\n💧 ${POIN_SALAH} poin\n📊 Total: *${poinSekarang}* poin\n\n_Ketik *${usedPrefix}${command}* untuk soal berikutnya._`;
  await client.sendMessage(chatId, { text, mentions: sender ? [sender] : [] }, { quoted: m });
  return true;
}

export { pluginConfig as config, handler, answerHandler };
export default { config: pluginConfig, handler, answerHandler };