/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import te from "../../src/lib/elaina-error.js";
import {
  scheduleMessage,
  cancelScheduledMessage,
  getScheduledMessages,
  getSchedulerStatus,
  formatTimeRemaining,
  getMsUntilTime,
} from "../../src/lib/elaina-scheduler.js";
/**
 * Konfigurasi plugin
 */
const pluginConfig = {
  name: "schedule",
  alias: ["sched", "jadwal", "timer"],
  category: "owner",
  description: "Bikin reminder atau jadwal bebas dengan text custom",
  usage:
    ".schedule <add/edit/list/kategori/preset/detail/del/status> [options]",
  example: ".schedule preset sekolah 06:30",
  isOwner: true,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 0,
  isEnabled: true,
};

const repeatKeywords = new Set(["repeat", "daily", "harian", "ulang"]);
const repeatOffKeywords = new Set([
  "once",
  "sekali",
  "off",
  "false",
  "no",
  "tidak",
  "0",
]);

const presetTemplates = {
  sekolah: {
    category: "sekolah",
    title: "Berangkat sekolah",
    customText: "Mandi, sarapan, cek buku, dan berangkat tepat waktu.",
    repeat: true,
    target: "me",
  },
  kerja: {
    category: "kerja",
    title: "Mulai kerja",
    customText: "Siapkan device, cek task, dan mulai kerja tepat waktu.",
    repeat: true,
    target: "me",
  },
  turnamen: {
    category: "turnamen",
    title: "Persiapan turnamen",
    customText: "Cek roster, room, koneksi, dan standby sebelum match dimulai.",
    repeat: false,
    target: "here",
  },
  date: {
    category: "date",
    title: "Jadwal date",
    customText: "Siap-siap, cek lokasi, dan datang tepat waktu.",
    repeat: false,
    target: "me",
  },
};

const presetAliases = {
  school: "sekolah",
  sekolah: "sekolah",
  work: "kerja",
  kerja: "kerja",
  tournament: "turnamen",
  turnamen: "turnamen",
  scrim: "turnamen",
  date: "date",
  ngedate: "date",
  dating: "date",
};

const formatClock = (hour, minute) =>
  `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

const truncateText = (text = "", max = 90) =>
  text.length > max ? `${text.slice(0, max)}...` : text;

const normalizeCategory = (value = "") => String(value).trim().toLowerCase();

const getTaskCategory = (task) => normalizeCategory(task.category) || "umum";

const getTaskTitle = (task) => task.title || "Pengingat";

const getTaskText = (task, fallback = "-") =>
  task.customText || task.message?.text || fallback;

const getTaskTargetLabel = (task) => task.targetLabel || task.jid;

function parseTimeString(value = "") {
  const normalized = String(value).trim().replace(/\./g, ":");
  const parts = normalized.split(":");

  if (parts.length !== 2) return null;

  const hour = Number(parts[0]);
  const minute = Number(parts[1]);

  if (
    !Number.isInteger(hour) ||
    !Number.isInteger(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }

  return { hour, minute, label: formatClock(hour, minute) };
}

function isRepeatToken(value = "") {
  return repeatKeywords.has(String(value).trim().toLowerCase());
}

function isRepeatOffToken(value = "") {
  return repeatOffKeywords.has(String(value).trim().toLowerCase());
}

function parseRepeatValue(value = "") {
  if (isRepeatToken(value)) return true;
  if (isRepeatOffToken(value)) return false;
  throw new Error(
    "❌ Nilai repeat harus salah satu: repeat, daily, harian, once, sekali, off",
  );
}

function looksLikeTarget(value = "") {
  const normalized = String(value).trim().toLowerCase();
  const digits = normalized.replace(/[^0-9]/g, "");
  return (
    ["me", "self", "here", "this"].includes(normalized) ||
    normalized.includes("@") ||
    digits.length >= 5
  );
}

function resolveTarget(targetValue, m) {
  const raw = String(targetValue || "here").trim();
  const normalized = raw.toLowerCase();

  if (!raw || normalized === "here" || normalized === "this") {
    return {
      jid: m.chat,
      label: m.isGroup ? "here (chat ini)" : "here (private chat ini)",
    };
  }

  if (normalized === "me" || normalized === "self") {
    return {
      jid: m.sender,
      label: "me",
    };
  }

  if (raw.includes("@")) {
    return {
      jid: raw,
      label: raw,
    };
  }

  const digits = raw.replace(/[^0-9]/g, "");

  if (!digits) {
    return {
      jid: m.chat,
      label: m.isGroup ? "here (chat ini)" : "here (private chat ini)",
    };
  }

  return {
    jid: `${digits}@s.whatsapp.net`,
    label: `${digits}@s.whatsapp.net`,
  };
}

function extractTailOptions(
  m,
  parts,
  defaultTargetToken = "here",
  defaultRepeat = false,
) {
  const tail = [...parts];
  let targetToken = defaultTargetToken;
  let repeat = defaultRepeat;

  while (tail.length > 1) {
    const last = tail[tail.length - 1];

    if (isRepeatToken(last)) {
      repeat = true;
      tail.pop();
      continue;
    }

    if (isRepeatOffToken(last)) {
      repeat = false;
      tail.pop();
      continue;
    }

    if (looksLikeTarget(last)) {
      targetToken = tail.pop();
      continue;
    }

    break;
  }

  return {
    content: tail.join(" | ").trim(),
    target: resolveTarget(targetToken, m),
    repeat,
  };
}

function resolvePresetTemplate(name = "") {
  const normalized = normalizeCategory(name);
  const key = presetAliases[normalized] || normalized;

  if (!key || !presetTemplates[key]) {
    return { key: "", config: null };
  }

  return { key, config: presetTemplates[key] };
}

function getTaskState(task) {
  return {
    hour: task.hour,
    minute: task.minute,
    label: formatClock(task.hour, task.minute),
    category: getTaskCategory(task),
    title: getTaskTitle(task),
    customText: getTaskText(task, ""),
    repeat: Boolean(task.repeat),
    target: {
      jid: task.jid,
      label: getTaskTargetLabel(task),
    },
    mode: task.mode || "planner",
  };
}

function buildTaskPayload(id, parsed, extra = {}) {
  return {
    id,
    jid: parsed.target.jid,
    message: { text: parsed.customText },
    hour: parsed.hour,
    minute: parsed.minute,
    repeat: parsed.repeat,
    category: normalizeCategory(parsed.category) || "umum",
    title: parsed.title || "Pengingat",
    customText: parsed.customText,
    targetLabel: parsed.target.label,
    mode: parsed.mode || "planner",
    createdAt: extra.createdAt || null,
    ...(extra.meta || {}),
  };
}

function buildHelpText(m) {
  return `📅 *SCHEDULE PLANNER*

Fitur ini buat bikin jadwal atau reminder bebas.
Bisa dipakai untuk sekolah, pelajaran, kerja, meeting, ngedate, turnamen, atau agenda apa aja.

Pesan yang dikirim akan mengikuti *text custom* buatan owner.

*Format utama:*
\`.schedule add <HH:MM> | <kategori> | <judul> | <pesan> | [target] | [repeat]\`

*Edit jadwal:*
\`.schedule edit <id> <HH:MM> | <kategori> | <judul> | <pesan> | [target] | [repeat]\`
\`.schedule edit <id> time=08:00 | text=angkat rapat | repeat=off\`

*Filter kategori:*
\`.schedule kategori\`
\`.schedule kategori sekolah\`

*Quick preset:*
\`.schedule preset list\`
\`.schedule preset sekolah 06:30\`
\`.schedule preset kerja 09:00 | standup pagi | masuk room meeting | here | repeat\`

*Target opsional:*
• \`here\` = kirim ke chat ini
• \`me\` = kirim ke chat owner sendiri
• \`628xxx@s.whatsapp.net\` = kirim ke nomor tertentu

*Mode repeat opsional:*
• \`repeat\`
• \`daily\`
• \`harian\`

*Contoh:*
\`.schedule add 06:30 | sekolah | berangkat sekolah | mandi, sarapan, cek buku | me | repeat\`
\`.schedule add 12:00 | kerja | standup team | masuk room meeting jam 12 tepat | here | repeat\`
\`.schedule add 19:00 | date | dinner malam | jangan lupa datang rapi dan tepat waktu | me\`
\`.schedule add 20:00 | turnamen | scrim malam | room dibuka 15 menit sebelum mulai | here\`

*Subcommand:*
• \`.schedule list\`
• \`.schedule kategori <nama>\`
• \`.schedule preset <nama> <HH:MM>\`
• \`.schedule edit <id> ...\`
• \`.schedule detail <id>\`
• \`.schedule del <id>\`
• \`.schedule status\`

*Format lama masih didukung:*
\`.schedule add 08:00 628xxx repeat Selamat pagi tim\``;
}

function parsePlannerInput(m, args) {
  const timeInfo = parseTimeString(args[1]);

  if (!timeInfo) {
    throw new Error(
      "❌ Format waktu salah. Gunakan HH:MM atau HH.MM, contoh: 08:00",
    );
  }

  const raw = args.slice(2).join(" ").trim();

  if (!raw) {
    throw new Error(
      "❌ Format: `.schedule add <HH:MM> | <kategori> | <judul> | <pesan> | [target] | [repeat]`",
    );
  }

  if (!raw.includes("|")) {
    const target = resolveTarget(args[2], m);
    let repeat = false;
    let messageStart = 3;

    if (isRepeatToken(args[3])) {
      repeat = true;
      messageStart = 4;
    }

    const customText = args.slice(messageStart).join(" ").trim();

    if (!customText) {
      throw new Error("❌ Pesan jadwal tidak boleh kosong");
    }

    return {
      ...timeInfo,
      category: "umum",
      title: "Pengingat",
      customText,
      repeat,
      target,
      mode: "legacy",
    };
  }

  const segments = raw
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);

  if (segments.length < 3) {
    throw new Error(
      "❌ Format baru minimal: `.schedule add <HH:MM> | <kategori> | <judul> | <pesan>`",
    );
  }

  const category = normalizeCategory(segments[0]) || "umum";
  const title = segments[1];
  const parsedTail = extractTailOptions(m, segments.slice(2));
  const customText = parsedTail.content;

  if (!customText) {
    throw new Error("❌ Isi reminder tidak boleh kosong");
  }

  return {
    ...timeInfo,
    category,
    title,
    customText,
    repeat: parsedTail.repeat,
    target: parsedTail.target,
    mode: "planner",
  };
}

function parsePresetInput(m, args) {
  const { key, config } = resolvePresetTemplate(args[1]);

  if (!config) {
    throw new Error(
      "❌ Preset tidak dikenal. Gunakan `.schedule preset list` untuk lihat preset yang tersedia.",
    );
  }

  const timeInfo = parseTimeString(args[2]);

  if (!timeInfo) {
    throw new Error(
      "❌ Format: `.schedule preset <nama> <HH:MM> [| <judul> | <pesan> | [target] | [repeat]]`",
    );
  }

  const raw = args.slice(3).join(" ").trim();
  let title = config.title;
  let customText = config.customText;
  let repeat = config.repeat;
  let target = resolveTarget(config.target, m);

  if (raw) {
    const segments = raw
      .split("|")
      .map((part) => part.trim())
      .filter(Boolean);

    if (segments.length === 1) {
      customText = segments[0];
    } else if (segments.length > 1) {
      title = segments[0] || title;
      const parsedTail = extractTailOptions(
        m,
        segments.slice(1),
        config.target,
        config.repeat,
      );

      customText = parsedTail.content || customText;
      repeat = parsedTail.repeat;
      target = parsedTail.target;
    }
  }

  return {
    ...timeInfo,
    category: config.category,
    title,
    customText,
    repeat,
    target,
    mode: "preset",
    presetKey: key,
  };
}

function parseEditInput(m, args, task) {
  const raw = args.slice(2).join(" ").trim();

  if (!raw) {
    throw new Error(
      "❌ Format edit: `.schedule edit <id> <HH:MM> | <kategori> | <judul> | <pesan> | [target] | [repeat]` atau `.schedule edit <id> time=08:00 | text=... | repeat=off`",
    );
  }

  if (!raw.includes("=")) {
    const parsed = parsePlannerInput(m, ["add", ...args.slice(2)]);
    return {
      ...parsed,
      mode: task.mode || parsed.mode,
    };
  }

  const state = getTaskState(task);
  const segments = raw
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);

  if (!segments.length) {
    throw new Error("❌ Tidak ada field yang bisa diedit.");
  }

  for (const segment of segments) {
    const separatorIndex = segment.indexOf("=");

    if (separatorIndex === -1) {
      throw new Error(
        "❌ Format edit parsial harus `field=value`, contoh: `time=08:00 | text=angkat rapat`",
      );
    }

    const field = normalizeCategory(segment.slice(0, separatorIndex));
    const value = segment.slice(separatorIndex + 1).trim();

    if (!value) {
      throw new Error(`❌ Nilai untuk field \`${field}\` tidak boleh kosong`);
    }

    switch (field) {
      case "time":
      case "waktu":
      case "jam": {
        const timeInfo = parseTimeString(value);

        if (!timeInfo) {
          throw new Error(
            "❌ Format waktu edit salah. Gunakan HH:MM atau HH.MM",
          );
        }

        state.hour = timeInfo.hour;
        state.minute = timeInfo.minute;
        state.label = timeInfo.label;
        break;
      }
      case "category":
      case "kategori":
        state.category = normalizeCategory(value) || "umum";
        break;
      case "title":
      case "judul":
        state.title = value;
        break;
      case "text":
      case "pesan":
      case "message":
      case "msg":
        state.customText = value;
        break;
      case "target":
      case "tujuan":
      case "jid":
        state.target = resolveTarget(value, m);
        break;
      case "repeat":
      case "ulang":
        state.repeat = parseRepeatValue(value);
        break;
      default:
        throw new Error(
          "❌ Field edit tidak dikenal. Pakai: time, kategori, judul, text, target, repeat",
        );
    }
  }

  if (!state.customText) {
    throw new Error("❌ Isi reminder tidak boleh kosong");
  }

  return state;
}

function findTaskById(taskId) {
  return getScheduledMessages().find((task) => task.id === taskId) || null;
}

function buildCategoryListText(tasks) {
  const categoryCounts = tasks.reduce((accumulator, task) => {
    const category = getTaskCategory(task);
    accumulator.set(category, (accumulator.get(category) || 0) + 1);
    return accumulator;
  }, new Map());

  const entries = [...categoryCounts.entries()].sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
  );

  let text = "🏷️ *KATEGORI JADWAL AKTIF*\n\n";

  for (const [category, total] of entries) {
    text += `• ${category} (${total})\n`;
  }

  text += "\nGunakan `.schedule kategori <nama>` untuk filter list jadwal.";
  return text;
}

function buildPresetListText() {
  let text = "⚡ *QUICK PRESET SCHEDULE*\n\n";

  for (const [name, preset] of Object.entries(presetTemplates)) {
    text += `• *${name}*\n`;
    text += `  📝 ${preset.title}\n`;
    text += `  🔄 ${preset.repeat ? "Harian" : "Sekali"}\n`;
    text += `  📍 Default target: ${preset.target}\n`;
    text += `  💬 ${truncateText(preset.customText, 100)}\n\n`;
  }

  text += "Pakai:\n";
  text += "`.schedule preset sekolah 06:30`\n";
  text +=
    "`.schedule preset kerja 09:00 | standup pagi | masuk room meeting | here | repeat`";
  return text;
}

function buildListText(tasks, header = null) {
  const sorted = [...tasks].sort(
    (a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute),
  );
  let text = `${header || `📅 *SCHEDULE PLANNER (${sorted.length})*`}\n\n`;

  for (const task of sorted) {
    const msUntil = getMsUntilTime(task.hour, task.minute);
    text += `• *${getTaskTitle(task)}*\n`;
    text += `  🆔 ${task.id}\n`;
    text += `  🏷️ ${getTaskCategory(task)}\n`;
    text += `  ⏰ ${formatClock(task.hour, task.minute)} WIB\n`;
    text += `  📍 ${getTaskTargetLabel(task)}\n`;
    text += `  🔄 ${task.repeat ? "Harian" : "Sekali"}\n`;
    text += `  🕕 ${formatTimeRemaining(msUntil)} lagi\n`;
    text += `  📝 ${truncateText(getTaskText(task))}\n\n`;
  }

  return text.trim();
}

function buildDetailText(task) {
  const msUntil = getMsUntilTime(task.hour, task.minute);
  return `📌 *DETAIL JADWAL*

🆔 ID: \`${task.id}\`
🏷️ Kategori: ${getTaskCategory(task)}
📝 Judul: ${getTaskTitle(task)}
⏰ Waktu: ${formatClock(task.hour, task.minute)} WIB
📍 Target: ${getTaskTargetLabel(task)}
🔄 Mode: ${task.repeat ? "Harian" : "Sekali"}
🕕 Next run: ${formatTimeRemaining(msUntil)} lagi
🗓️ Dibuat: ${task.createdAt || "-"}

Pesan custom:
${getTaskText(task)}`;
}

/**
 * Handler untuk command schedule
 */
async function handler(m, { sock, args }) {
  const subCommand = args[0]?.toLowerCase();

  if (!subCommand || ["help", "menu"].includes(subCommand)) {
    await m.reply(buildHelpText(m));
    return;
  }

  switch (subCommand) {
    case "add": {
      try {
        const parsed = parsePlannerInput(m, args);
        const id = `sched_${Date.now()}`;

        await scheduleMessage(buildTaskPayload(id, parsed), sock);

        const msUntil = getMsUntilTime(parsed.hour, parsed.minute);

        await m.reply(`✅ *JADWAL BERHASIL DIBUAT*

🆔 ID: \`${id}\`
🏷️ Kategori: ${parsed.category}
📝 Judul: ${parsed.title}
⏰ Waktu: ${parsed.label} WIB
📍 Target: ${parsed.target.label}
🔄 Mode: ${parsed.repeat ? "Harian" : "Sekali"}
🕕 Next run: ${formatTimeRemaining(msUntil)} lagi

Text custom:
${truncateText(parsed.customText, 180)}`);
      } catch (error) {
        await m.reply(
          error.message?.startsWith("❌")
            ? error.message
            : te(m.prefix, m.command, m.pushName),
        );
      }
      break;
    }

    case "preset": {
      if (!args[1] || ["list", "all"].includes(normalizeCategory(args[1]))) {
        await m.reply(buildPresetListText());
        return;
      }

      try {
        const parsed = parsePresetInput(m, args);
        const id = `sched_${Date.now()}`;

        await scheduleMessage(
          buildTaskPayload(id, parsed, {
            meta: { presetKey: parsed.presetKey },
          }),
          sock,
        );

        const msUntil = getMsUntilTime(parsed.hour, parsed.minute);

        await m.reply(`✅ *PRESET JADWAL BERHASIL DIBUAT*

🆔 ID: \`${id}\`
⚡ Preset: ${parsed.presetKey}
🏷️ Kategori: ${parsed.category}
📝 Judul: ${parsed.title}
⏰ Waktu: ${parsed.label} WIB
📍 Target: ${parsed.target.label}
🔄 Mode: ${parsed.repeat ? "Harian" : "Sekali"}
🕕 Next run: ${formatTimeRemaining(msUntil)} lagi

Text custom:
${truncateText(parsed.customText, 180)}`);
      } catch (error) {
        await m.reply(
          error.message?.startsWith("❌")
            ? error.message
            : te(m.prefix, m.command, m.pushName),
        );
      }
      break;
    }

    case "edit": {
      const taskId = args[1];

      if (!taskId) {
        await m.reply("❌ Format: `.schedule edit <id> ...`");
        return;
      }

      const task = findTaskById(taskId);

      if (!task) {
        await m.reply(`❌ Jadwal dengan ID \`${taskId}\` tidak ditemukan`);
        return;
      }

      try {
        const parsed = parseEditInput(m, args, task);

        await scheduleMessage(
          buildTaskPayload(task.id, parsed, {
            createdAt: task.createdAt,
            meta: { presetKey: task.presetKey || null },
          }),
          sock,
        );

        const msUntil = getMsUntilTime(parsed.hour, parsed.minute);

        await m.reply(`✅ *JADWAL BERHASIL DIUPDATE*

🆔 ID: \`${task.id}\`
🏷️ Kategori: ${parsed.category}
📝 Judul: ${parsed.title}
⏰ Waktu: ${parsed.label} WIB
📍 Target: ${parsed.target.label}
🔄 Mode: ${parsed.repeat ? "Harian" : "Sekali"}
🕕 Next run: ${formatTimeRemaining(msUntil)} lagi

Text custom:
${truncateText(parsed.customText, 180)}`);
      } catch (error) {
        await m.reply(
          error.message?.startsWith("❌")
            ? error.message
            : te(m.prefix, m.command, m.pushName),
        );
      }
      break;
    }

    case "list": {
      const tasks = getScheduledMessages();

      if (tasks.length === 0) {
        await m.reply(
          "📅 Belum ada jadwal aktif. Gunakan `.schedule` untuk lihat format planner.",
        );
        return;
      }

      await m.reply(buildListText(tasks));
      break;
    }

    case "kategori":
    case "category": {
      const tasks = getScheduledMessages();

      if (tasks.length === 0) {
        await m.reply(
          "📅 Belum ada jadwal aktif. Gunakan `.schedule` untuk lihat format planner.",
        );
        return;
      }

      const categoryName = normalizeCategory(args.slice(1).join(" "));

      if (!categoryName) {
        await m.reply(buildCategoryListText(tasks));
        return;
      }

      const filteredTasks = tasks.filter(
        (task) => getTaskCategory(task) === categoryName,
      );

      if (!filteredTasks.length) {
        await m.reply(
          `❌ Tidak ada jadwal aktif untuk kategori \`${categoryName}\``,
        );
        return;
      }

      await m.reply(
        buildListText(
          filteredTasks,
          `🏷️ *KATEGORI: ${categoryName.toUpperCase()} (${filteredTasks.length})*`,
        ),
      );
      break;
    }

    case "detail":
    case "show":
    case "view": {
      const taskId = args[1];

      if (!taskId) {
        await m.reply("❌ Format: `.schedule detail <id>`");
        return;
      }

      const task = findTaskById(taskId);

      if (!task) {
        await m.reply(`❌ Jadwal dengan ID \`${taskId}\` tidak ditemukan`);
        return;
      }

      await m.reply(buildDetailText(task));
      break;
    }

    case "del":
    case "delete":
    case "remove": {
      const taskId = args[1];

      if (!taskId) {
        await m.reply("❌ Format: `.schedule del <id>`");
        return;
      }

      const existingTask = findTaskById(taskId);
      const cancelled = cancelScheduledMessage(taskId);

      if (cancelled) {
        await m.reply(
          `✅ Jadwal \`${taskId}\` dihapus${existingTask?.title ? `\n\n📝 ${existingTask.title}` : ""}`,
        );
      } else {
        await m.reply(`❌ Jadwal \`${taskId}\` tidak ditemukan`);
      }
      break;
    }

    case "status": {
      const status = getSchedulerStatus();
      const tasks = getScheduledMessages();
      const categories = [
        ...new Set(tasks.map((task) => getTaskCategory(task))),
      ];

      const text = `📊 *SCHEDULE PLANNER STATUS*

📝 Jadwal aktif: ${status.scheduledMessagesCount}
🏷️ Kategori aktif: ${categories.length ? categories.join(", ") : "-"}
📨 Reminder terkirim: ${status.totalMessagesSent}
🔄 Daily limit reset: ${status.dailyResetEnabled ? "✅ Active" : "❌ Inactive"}
📅 Last reset: ${status.lastLimitReset}

Gunakan \`.schedule list\` untuk lihat semua jadwal aktif.`;

      await m.reply(text);
      break;
    }

    default:
      await m.reply(
        "❌ Subcommand tidak dikenal. Gunakan: add, edit, list, kategori, preset, detail, del, status",
      );
  }
}

export { pluginConfig as config, handler };
