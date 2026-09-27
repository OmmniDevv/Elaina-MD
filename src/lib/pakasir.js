/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
import config from '../../config.js';

function getConfig() {
  return config?.pakasir || {};
}

function isEnabled() {
  const c = getConfig();
  return Boolean(c.enabled && (c.apiKey || c.slug || c.project));
}

async function cancelTransaction(orderId, amount) {
  const c = getConfig();
  if (!isEnabled()) return { success: false, disabled: true };
  if (!c.cancelUrl) return { success: false, unsupported: true };
  const response = await axios.post(c.cancelUrl, { orderId, amount }, {
    timeout: Number(c.timeout) || 15000,
    headers: c.apiKey ? { Authorization: `Bearer ${c.apiKey}` } : undefined,
  });
  return response.data;
}

async function simulatePayment(orderId, amount) {
  const c = getConfig();
  if (!c.sandbox) return { success: false, sandbox: false };
  if (!c.simulateUrl) return { success: true, simulated: true, orderId, amount };
  const response = await axios.post(c.simulateUrl, { orderId, amount }, {
    timeout: Number(c.timeout) || 15000,
    headers: c.apiKey ? { Authorization: `Bearer ${c.apiKey}` } : undefined,
  });
  return response.data;
}

export default { isEnabled, cancelTransaction, simulatePayment };
export { isEnabled, cancelTransaction, simulatePayment };
