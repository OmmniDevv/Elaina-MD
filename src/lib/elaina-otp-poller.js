/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { isEnabled, checkSms } from './elaina-otp-service.js';

let timer = null;
const activeOrders = new Map();

export function watchOtpOrder(orderId, onOtp) {
  if (!orderId) return;
  activeOrders.set(String(orderId), typeof onOtp === 'function' ? onOtp : null);
}

export function unwatchOtpOrder(orderId) {
  activeOrders.delete(String(orderId));
}

export function startOtpPoller(intervalMs = 10_000) {
  if (!isEnabled() || timer) return timer;
  timer = setInterval(async () => {
    for (const [orderId, callback] of activeOrders) {
      try {
        const otp = await checkSms(orderId);
        if (otp) {
          activeOrders.delete(orderId);
          if (callback) await callback(otp, orderId);
        }
      } catch {}
    }
  }, intervalMs);
  timer.unref?.();
  return timer;
}

export function stopOtpPoller() {
  if (timer) clearInterval(timer);
  timer = null;
}
