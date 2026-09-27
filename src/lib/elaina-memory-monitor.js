/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { logger } from "./elaina-logger.js";
const RSS_LIMIT = 1024 * 1024 * 1024;
const CHECK_INTERVAL = 5 * 60 * 1000;

let monitorTimer = null;

function formatMB(bytes) {
  return (bytes / 1024 / 1024).toFixed(1) + "MB";
}

function startMemoryMonitor() {
  if (monitorTimer) return;

  monitorTimer = setInterval(() => {
    const mem = process.memoryUsage();

    if (global.gc) global.gc();

    logger.system(
      "memory",
      `rss ${formatMB(mem.rss)} · heap ${formatMB(mem.heapUsed)}/${formatMB(mem.heapTotal)}`,
    );
  }, CHECK_INTERVAL);

  if (monitorTimer.unref) monitorTimer.unref();
  logger.success(
    "memory",
    `Pantau RAM aktif, limit ${formatMB(RSS_LIMIT)}, cek tiap ${CHECK_INTERVAL / 60000} menit`,
  );
}

function stopMemoryMonitor() {
  if (monitorTimer) {
    clearInterval(monitorTimer);
    monitorTimer = null;
  }
}

export { startMemoryMonitor, stopMemoryMonitor };
