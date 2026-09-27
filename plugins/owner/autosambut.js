/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";

const pluginConfig = {
  name: "autosambut",
  alias: ["sambutowner"],
  category: "group",
  description: "Mengatur fitur sambutan otomatis saat owner muncul setelah lama idle",
  usage: ".autosambut on/off/delay/add/del/list",
  example: ".autosambut on",
  isOwner: true,
  isGroup: true,
  cooldown: 3,
  isEnabled: true,
};

function parseTime(str) {
  const match = str.match(/^([\d.]+)([a-zA-Z]+)$/);
  if (!match) return null;
  const val = parseFloat(match[1]);
  const unit = match[2].toLowerCase();

  if (unit.startsWith('s')) return val * 1000;
  if (unit.startsWith('m')) return val * 60 * 1000;
  if (unit.startsWith('h')) return val * 60 * 60 * 1000;
  if (unit.startsWith('d')) return val * 24 * 60 * 60 * 1000;
  if (unit.startsWith('w')) return val * 7 * 24 * 60 * 60 * 1000;
  if (unit.startsWith('y')) return val * 365 * 24 * 60 * 60 * 1000;
  return null;
}

function formatTime(ms) {
  if (ms < 60000) return `${ms / 1000} detik`;
  if (ms < 3600000) return `${ms / 60000} menit`;
  if (ms < 86400000) return `${ms / 3600000} jam`;
  if (ms < 604800000) return `${ms / 86400000} hari`;
  return `${ms / 86400000} hari`;
}

async function handler(m, { sock, db }) {
  const args = m.args || [];
  const action = args[0]?.toLowerCase();
  const isGlobal = args.includes("--global");

  const database = getDatabase();
  let groupData = database.getGroup(m.chat);
  if (!groupData.autoSambut) {
    groupData.autoSambut = {
      enabled: false,
      delayMs: 2 * 60 * 60 * 1000,
      pesanList: ["Halo {user}! Selamat datang kembali 🙇‍♂️"],
      lastChats: {}
    };
    database.setGroup(m.chat, { autoSambut: groupData.autoSambut });
  }
  if (groupData.autoSambut.pesan !== undefined) {
    if (!groupData.autoSambut.pesanList) {
      groupData.autoSambut.pesanList = [groupData.autoSambut.pesan];
    }
    delete groupData.autoSambut.pesan;
    database.setGroup(m.chat, { autoSambut: groupData.autoSambut });
  }
  // Fallback
  if (!Array.isArray(groupData.autoSambut.pesanList) || groupData.autoSambut.pesanList.length === 0) {
    groupData.autoSambut.pesanList = ["Halo {user}! Selamat datang kembali 🙇‍♂️"];
  }

  if (!action) {
    const status = groupData.autoSambut.enabled ? "Aktif ✅" : "Nonaktif ❌";
    const delayMs = groupData.autoSambut.delayMs || 7200000;
    const totalPesan = groupData.autoSambut.pesanList.length;

    return m.reply(
      `⚠️ *SISTEM AUTO SAMBUT*\n\n` +
      `Sistem otomatis menyambut owner di grup secara acak ketika owner muncul setelah lama idle.\n` +
      `Status: *${status}*\n` +
      `Batas Waktu Idle: *${formatTime(delayMs)}*\n` +
      `Jumlah Pesan Acak: *${totalPesan} Sapaan*\n\n` +
      `*PENGGUNAAN UTAMA:*\n` +
      `• *${m.prefix}autosambut on/off* — Menghidupkan/mematikan fitur di grup ini\n` +
      `• *${m.prefix}autosambut delay <waktu>* — Mengubah batas waktu idle\n\n` +
      `*PENGATURAN PESAN ACAK (LIST):*\n` +
      `• *${m.prefix}autosambut list* — Melihat semua sapaan yang telah didaftarkan\n` +
      `• *${m.prefix}autosambut add <teks>* — Menambah teks sambutan baru ke daftar\n` +
      `• *${m.prefix}autosambut del <angka>* — Menghapus pesan pada nomor urutan tertentu\n\n` +
      `*PENJELASAN KHUSUS:*\n` +
      `1. Gunakan format waktu: *s* (detik), *m* (menit), *h* (jam), *d* (hari). Contoh: *${m.prefix}autosambut delay 30m*\n` +
      `2. Gunakan *{name}* untuk menyebut pushname owner, dan *{user}* untuk me-mention owner.\n` +
      `3. Jika kamu menambahkan atribut *--global* di akhir setiap perintah, maka pengaturan di grup *ini* akan langsung dicopy ke SEMUA grup yang bot singgahi!`
    );
  }

  if (action === "on" || action === "off") {
    const isEnable = action === "on";
    if (isGlobal) {
      const groups = await sock.groupFetchAllParticipating();
      let count = 0;
      for (const jid of Object.keys(groups)) {
        let gData = database.getGroup(jid) || {};
        gData.autoSambut = {
          enabled: isEnable,
          delayMs: groupData.autoSambut.delayMs,
          pesanList: [...groupData.autoSambut.pesanList],
          lastChats: {}
        };
        database.setGroup(jid, { autoSambut: gData.autoSambut });
        count++;
      }
      return m.reply(`${isEnable ? '✅' : '❌'} *Fitur Auto Sambut Global ${isEnable ? 'Diaktifkan' : 'Dinonaktifkan'}!*\n\nSemua grup (${count}) sekarang menggunakan sistem sapaan yang sama dengan grup ini.`);
    }

    groupData.autoSambut.enabled = isEnable;
    database.setGroup(m.chat, { autoSambut: groupData.autoSambut });
    return m.reply(isEnable ? `✅ *Fitur Auto Sambut Diaktifkan!*` : `❌ *Fitur Auto Sambut Dinonaktifkan.*`);
  }

  if (action === "delay") {
    const timeInput = args[1];
    if (!timeInput) return m.reply(`Tolong berikan waktu! Contoh: \`${m.prefix}autosambut delay 2h\``);

    const parsedMs = parseTime(timeInput);
    if (!parsedMs) {
      return m.reply(`Format waktu tidak dikenali. Gunakan angka dan akhiran s, m, h, d, w, y. Contoh: \`2h\` (2 jam), \`30m\` (30 menit).`);
    }

    if (isGlobal) {
      const groups = await sock.groupFetchAllParticipating();
      let count = 0;
      for (const jid of Object.keys(groups)) {
        let gData = database.getGroup(jid) || {};
        gData.autoSambut = {
          enabled: groupData.autoSambut.enabled,
          delayMs: parsedMs,
          pesanList: [...groupData.autoSambut.pesanList],
          lastChats: {}
        };
        database.setGroup(jid, { autoSambut: gData.autoSambut });
        count++;
      }
      return m.reply(`⏱️ *Delay Auto Sambut Global Diubah ke ${formatTime(parsedMs)} untuk ${count} grup!*`);
    }

    groupData.autoSambut.delayMs = parsedMs;
    database.setGroup(m.chat, { autoSambut: groupData.autoSambut });
    return m.reply(`⏱️ *Delay Auto Sambut Diubah!*\n\nSekarang bot akan menyambutmu setelah kamu tidak mengetik apa-apa di grup ini selama *${formatTime(parsedMs)}* berturut-turut.`);
  }

  if (action === "list") {
    let listText = `📜 *DAFTAR PESAN AUTO SAMBUT*\n\nTotal ada *${groupData.autoSambut.pesanList.length}* sapaan acak yang terdaftar di grup ini:\n\n`;
    groupData.autoSambut.pesanList.forEach((text, index) => {
      listText += `*${index + 1}.* ${text}\n\n`;
    });
    listText += `_Gunakan \`${m.prefix}autosambut del <angka>\` untuk menghapus salah satu._`;
    return m.reply(listText);
  }

  if (action === "add") {
    const newMsg = args.slice(1).filter(v => v !== '--global').join(" ").trim();
    if (!newMsg) {
      return m.reply(`Tolong masukkan teks sambutannya.\nContoh: \`${m.prefix}autosambut add Halo bosku {user}!\``);
    }

    groupData.autoSambut.pesanList.push(newMsg);
    database.setGroup(m.chat, { autoSambut: groupData.autoSambut });

    if (isGlobal) {
      const groups = await sock.groupFetchAllParticipating();
      let count = 0;
      for (const jid of Object.keys(groups)) {
        let gData = database.getGroup(jid) || {};
        gData.autoSambut = {
          enabled: groupData.autoSambut.enabled,
          delayMs: groupData.autoSambut.delayMs,
          pesanList: [...groupData.autoSambut.pesanList],
          lastChats: {}
        };
        database.setGroup(jid, { autoSambut: gData.autoSambut });
        count++;
      }
      return m.reply(`💬 *Pesan Baru Ditambahkan ke Daftar Global (${count} grup)!*\n\nPesan terdaftar:\n"${newMsg}"`);
    }

    return m.reply(`💬 *Pesan Baru Berhasil Ditambahkan!*\nKini ada ${groupData.autoSambut.pesanList.length} sapaan acak di dalam daftar.`);
  }

  if (action === "del") {
    const indexInput = parseInt(args[1]);
    if (isNaN(indexInput) || indexInput < 1 || indexInput > groupData.autoSambut.pesanList.length) {
      return m.reply(`Tolong masukkan angka urutan pesan yang valid.\nLihat daftar angka dengan \`${m.prefix}autosambut list\`.`);
    }
    if (groupData.autoSambut.pesanList.length <= 1) {
      return m.reply(`Gagal dihapus! Harus ada minimal 1 pesan di dalam daftar sapaan grup ini.`);
    }

    const removedMsg = groupData.autoSambut.pesanList.splice(indexInput - 1, 1)[0];
    database.setGroup(m.chat, { autoSambut: groupData.autoSambut });

    if (isGlobal) {
      const groups = await sock.groupFetchAllParticipating();
      let count = 0;
      for (const jid of Object.keys(groups)) {
        let gData = database.getGroup(jid) || {};
        gData.autoSambut = {
          enabled: groupData.autoSambut.enabled,
          delayMs: groupData.autoSambut.delayMs,
          pesanList: [...groupData.autoSambut.pesanList],
          lastChats: {}
        };
        database.setGroup(jid, { autoSambut: gData.autoSambut });
        count++;
      }
      return m.reply(`🗑️ *Pesan Berhasil Dihapus Secara Global (${count} grup)!*\n\nTerhapus:\n"${removedMsg}"`);
    }

    return m.reply(`🗑️ *Pesan Berhasil Dihapus!*\n\nTerhapus:\n"${removedMsg}"\nSisa daftar sapaan: ${groupData.autoSambut.pesanList.length}`);
  }

  if (action === "pesan") {
    return m.reply(`⚠️ Perintah \`pesan\` telah usang dan digantikan oleh sistem acak.\nSilakan gunakan \`${m.prefix}autosambut add <teks>\` untuk menambahkan sapaan, atau \`${m.prefix}autosambut list\` untuk melihat daftar sapaan.`);
  }

  return m.reply(`Perintah tidak valid. Coba ketik \`${m.prefix}autosambut\` tanpa embel-embel untuk melihat buku panduannya.`);
}

export { pluginConfig as config, handler };
