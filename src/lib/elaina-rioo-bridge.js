/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "./elaina-database.js";
import { f as httpRequest } from "./elaina-http.js";
import { fetchJson, randomInt, md5 } from "./elaina-utils.js";
import { sendText } from "./elaina-message.js";
import { rimuruApiManager } from "./elaina-apimanager.js";
import config from "../../config.js";

export { getDatabase, httpRequest, fetchJson, randomInt, md5, sendText, rimuruApiManager, config };

export async function riooJson(url, options = {}) {
  const { method = "GET", headers = {}, body = null, timeout } = options;
  if (timeout) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, {
        method,
        headers,
        body,
        signal: controller.signal,
      });
      return await response.json();
    } finally {
      clearTimeout(timer);
    }
  }
  return fetchJson(url, options.fetchOptions || {});
}
