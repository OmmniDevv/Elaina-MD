/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export default async function safeJson(response) {
  try {
    if (!response) return null
    if (typeof response.json === 'function') {
      return await response.json()
    }
    if (typeof response === 'string') {
      return JSON.parse(response)
    }
    return response
  } catch {
    return null
  }
}
