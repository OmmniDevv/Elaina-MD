/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "./elaina-database.js";
import { logger } from "./elaina-logger.js";
import { CronJob } from "cron";
import config from "../../config.js";
import * as timeHelper from "./elaina-time.js";
import { saluranCtx } from "./elaina-context.js";
import { getTodaySchedule, extractPrayerTimes } from "./elaina-sholat-api.js";

const TZ = "Asia/Jakarta";

const SHOLAT_MESSAGES = {
  imsak:
    "🌙 *WAKTU IMSAK*\n\n> Hai Sahabat, waktu Imsak telah tiba.\n> Segera makan sahur sebelum waktu habis.",
  subuh:
    "🌅 *WAKTU SUBUH*\n\n> Hai Sahabat, waktu Sholat Subuh telah tiba.\n> Ambilah air wudhu dan segeralah sholat.",
  terbit:
    "☀️ *WAKTU TERBIT*\n\n> Matahari telah terbit.\n> Selamat beraktivitas hari ini!",
  dhuha:
    "🌤️ *WAKTU DHUHA*\n\n> Hai Sahabat, waktu Sholat Dhuha telah tiba.\n> Jangan lupa sholat Dhuha 2-8 rakaat.",
  dzuhur:
    "🌞 *WAKTU DZUHUR*\n\n> Hai Sahabat, waktu Sholat Dzuhur telah tiba.\n> Ambilah air wudhu dan segeralah sholat.",
  ashar:
    "🌇 *WAKTU ASHAR*\n\n> Hai Sahabat, waktu Sholat Ashar telah tiba.\n> Ambilah air wudhu dan segeralah sholat.",
  maghrib:
    "🌆 *WAKTU MAGHRIB*\n\n> Hai Sahabat, waktu Sholat Maghrib telah tiba.\n> Ambilah air wudhu dan segeralah sholat.",
  isya: "🌙 *WAKTU ISYA*\n\n> Hai Sahabat, waktu Sholat Isya telah tiba.\n> Ambilah air wudhu dan segeralah sholat.",
};

const GAMBAR_SUASANA = {
  imsak: "https://cdn.gimita.id/download/images_1769502277606_04d594fe.jfif",
  subuh: "https://cdn.gimita.id/download/images_1769502277606_04d594fe.jfif",
  terbit: "https://cdn.gimita.id/download/images_1769502277606_04d594fe.jfif",
  dhuha: "https://cdn.gimita.id/download/images_1769502277606_04d594fe.jfif",
  dzuhur:
    "https://cdn.gimita.id/download/qf2d6868_sheikh-zayed-grand-mosque_625x300_04_March_25_1769502237718_92212561.webp",
  ashar:
    "https://cdn.gimita.id/download/18537d69-a2e0-4dc2-a144-57dde0f359b5_1769502389063_5c004902.jpg",
  maghrib:
    "https://cdn.gimita.id/download/mosque-5950407_1280_1769502206553_660ae15c.webp",
  isya: "https://cdn.gimita.id/download/pngtree-nighttime-mosque-illustration-with-realistic-details-celebrating-ramadan-kareem-mubarak-image_3814083_1769502091988_e4cf3326.jpg",
};

const AUDIO_ADZAN = "https://files.catbox.moe/z2bj5s.mp3";

let sock = null;
let cachedSchedule = null;
let cacheDate = "";
const sholatCronJobs = new Map();
let dailyRefreshJob = null;

function getTodayDateString() {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: TZ }));
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

async function loadTodaySchedule() {
  const todayStr = getTodayDateString();
  if (cachedSchedule && cacheDate === todayStr) return cachedSchedule;

  const db = getDatabase();
  const kotaSetting = db.setting("autoSholatKota") || {
    id: "1301",
    nama: "KOTA JAKARTA",
  };

  try {
    const jadwalData = await getTodaySchedule(kotaSetting.id);
    const schedule = extractPrayerTimes(jadwalData);
    const daerah = jadwalData.daerah || "DKI JAKARTA";
    
    let cityTz = "Asia/Jakarta";
    const d = daerah.toUpperCase();
    if (d.includes("SULAWESI") || d.includes("BALI") || d.includes("NUSA TENGGARA") || d.includes("KALIMANTAN SELATAN") || d.includes("KALIMANTAN TIMUR") || d.includes("KALIMANTAN UTARA")) {
      cityTz = "Asia/Makassar";
    } else if (d.includes("MALUKU") || d.includes("PAPUA")) {
      cityTz = "Asia/Jayapura";
    }

    cachedSchedule = { schedule, cityTz };
    cacheDate = todayStr;
    return cachedSchedule;
  } catch (e) {
    logger.error("SholatScheduler", `Gagal fetch jadwal: ${e.message}`);
    return null;
  }
}

function clearSholatCronJobs() {
  for (const [, job] of sholatCronJobs) job.stop();
  sholatCronJobs.clear();
}

async function schedulePrayerTimes() {
  clearSholatCronJobs();

  const db = getDatabase();
  const globalEnabled = db.setting("autoSholat");
  if (!globalEnabled) return;

  const data = await loadTodaySchedule();
  if (!data) return;

  const { schedule, cityTz } = data;

  for (const [sholat, waktu] of Object.entries(schedule)) {
    if (waktu === "-") continue;

    const [hour, minute] = waktu.split(":").map(Number);
    const cronExpr = `${minute} ${hour} * * *`;

    const job = new CronJob(
      cronExpr,
      async () => {
        await sendSholatNotifications(sholat, waktu);
      },
      null,
      true,
      cityTz,
    );

    sholatCronJobs.set(sholat, job);
  }

  logger.info(
    "SholatScheduler",
    `Scheduled ${sholatCronJobs.size} prayer times (Timezone: ${cityTz})`,
  );
}

async function sendSholatNotifications(sholat, waktu) {
  try {
    const db = getDatabase();

    const closeGroup = db.setting("autoSholatCloseGroup") || false;
    const duration = db.setting("autoSholatDuration") || 5;
    const sendAudio = db.setting("autoSholatAudio") !== false;
    const kotaSetting = db.setting("autoSholatKota") || {
      nama: "KOTA JAKARTA",
    };

    const saluranId = config.saluran?.id || "120363412350560864@newsletter";
    const saluranName = config.saluran?.name || config.bot?.name || "Rimuru-AI";

    let groupList = [];
    try {
      const groupsObj = await sock.groupFetchAllParticipating();
      groupList = Object.keys(groupsObj);
    } catch (e) {
      logger.error("SholatScheduler", `Failed to fetch groups: ${e.message}`);
      return;
    }

    if (groupList.length === 0) return;

    let sentCount = 0;
    const closedGroups = [];
    const isSholatTime = [
      "subuh",
      "dzuhur",
      "ashar",
      "maghrib",
      "isya",
    ].includes(sholat);

    let message = `${SHOLAT_MESSAGES[sholat] || `🕌 *WAKTU ${sholat.toUpperCase()}*`}\n\n⏰ *${waktu} WIB*\n📍 *${kotaSetting.nama}*`;

    if (closeGroup && isSholatTime) {
      message += `\n\n> 🔒 _Grup ditutup ${duration} menit untuk sholat_`;
    }

    for (const groupId of groupList) {
      const groupData = db.data?.groups?.[groupId] || {};
      if (groupData.notifSholat === false) continue;

      try {
        if (sendAudio && isSholatTime) {
          try {
            await sock.sendMessage(groupId, {
              audio: { url: AUDIO_ADZAN },
              mimetype: "audio/mpeg",
              ptt: false,
              contextInfo: {
                ...saluranCtx(),
                forwardedNewsletterMessageInfo: {
                  newsletterJid: saluranId,
                  newsletterName: saluranName,
                  serverMessageId: 127,
                },
              },
            });
          } catch (audioErr) {
            logger.error("SholatScheduler", `Failed to send audio to ${groupId}: ${audioErr.message}`);
          }
        }

        await sock.sendMessage(groupId, {
          text: message,
          contextInfo: {
            ...saluranCtx(),
            forwardedNewsletterMessageInfo: {
              newsletterJid: saluranId,
              newsletterName: saluranName,
              serverMessageId: 127,
            },
          },
        });

        if (closeGroup && isSholatTime) {
          try {
            await sock.groupSettingUpdate(groupId, "announcement");
            closedGroups.push(groupId);
          } catch (e) {
            logger.error(
              "SholatScheduler",
              `Failed to close ${groupId}: ${e.message}`,
            );
          }
        }

        sentCount++;
        await new Promise((r) => setTimeout(r, 500));
      } catch (err) {
        logger.error(
          "SholatScheduler",
          `Failed to send to ${groupId}: ${err.message}`,
        );
      }
    }

    if (closeGroup && closedGroups.length > 0) {
      setTimeout(
        async () => {
          for (const groupId of closedGroups) {
            try {
              await sock.groupSettingUpdate(groupId, "not_announcement");
              await sock.sendMessage(groupId, {
                text: `✅ Grup dibuka kembali setelah sholat ${sholat}.\n\n> Semoga sholat kita diterima. Aamiin 🤲`,
                contextInfo: {
                  forwardingScore: 9999,
                  isForwarded: true,
                  forwardedNewsletterMessageInfo: {
                    newsletterJid: saluranId,
                    newsletterName: saluranName,
                    serverMessageId: 127,
                  },
                },
              });
              await new Promise((r) => setTimeout(r, 600));
            } catch (e) {
              logger.error(
                "SholatScheduler",
                `Failed to open ${groupId}: ${e.message}`,
              );
            }
          }
          logger.info(
            "SholatScheduler",
            `Opened ${closedGroups.length} groups after ${sholat}`,
          );
        },
        duration * 60 * 1000,
      );
    }

    if (sentCount > 0) {
      logger.info(
        "SholatScheduler",
        `Sent ${sholat} notification to ${sentCount} groups` +
          (closedGroups.length > 0 ? ` (${closedGroups.length} closed)` : ""),
      );
    }
  } catch (error) {
    logger.error("SholatScheduler", `Error: ${error.message}`);
  }
}

function initSholatScheduler(socketInstance) {
  sock = socketInstance;

  if (dailyRefreshJob) dailyRefreshJob.stop();

  dailyRefreshJob = new CronJob(
    "1 0 * * *",
    async () => {
      cachedSchedule = null;
      await schedulePrayerTimes();
    },
    null,
    true,
    TZ,
  );

  schedulePrayerTimes();
  logger.info(
    "SholatScheduler",
    "Jadwal waktu sholat otomatis udah nyala ya bosku (Realtime)",
  );
}

function stopSholatScheduler() {
  clearSholatCronJobs();
  if (dailyRefreshJob) {
    dailyRefreshJob.stop();
    dailyRefreshJob = null;
  }
  logger.info("SholatScheduler", "Jadwal waktu sholat udah dimatiin");
}

export {
  initSholatScheduler,
  stopSholatScheduler,
  SHOLAT_MESSAGES,
  GAMBAR_SUASANA,
  AUDIO_ADZAN,
};
