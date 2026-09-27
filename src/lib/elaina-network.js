/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const RETRYABLE_CODES = new Set([
  'EAI_AGAIN',
  'ENOTFOUND',
  'ECONNRESET',
  'ECONNREFUSED',
  'ETIMEDOUT',
  'UND_ERR_CONNECT_TIMEOUT',
  'UND_ERR_SOCKET',
]);

function isNetworkError(error) {
  if (!error) return false;
  const code = String(error.code || error.cause?.code || '').toUpperCase();
  const message = String(error.message || '').toLowerCase();
  return RETRYABLE_CODES.has(code)
    || /enotfound|eai_again|econnreset|econnrefused|etimedout|network error|fetch failed|socket hang up|connect timeout/.test(message);
}

function formatNetworkError(error, service = 'layanan eksternal') {
  if (isNetworkError(error)) {
    return `Layanan ${service} sedang tidak dapat dijangkau. Silakan coba lagi beberapa saat lagi.`;
  }

  const status = error?.response?.status;
  if (status === 429) {
    return `Layanan ${service} sedang membatasi permintaan. Silakan tunggu sebentar lalu coba lagi.`;
  }
  if (status >= 500) {
    return `Server ${service} sedang bermasalah (${status}). Silakan coba lagi nanti.`;
  }

  const message = String(error?.message || 'Terjadi kesalahan.');
  return message.length > 180 ? `${message.slice(0, 177)}...` : message;
}

async function withNetworkRetry(task, {
  retries = 2,
  delayMs = 900,
  factor = 1.8,
  shouldRetry = isNetworkError,
} = {}) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await task(attempt);
    } catch (error) {
      lastError = error;
      const retryable = shouldRetry(error);
      if (!retryable || attempt >= retries) throw error;
      const delay = Math.round(delayMs * (factor ** attempt));
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Network request failed');
}

export { isNetworkError, formatNetworkError, withNetworkRetry };
