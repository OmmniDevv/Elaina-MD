import fs from 'fs'
import path from 'path'
import { log } from './logger.js'

const LOG_DIR = './log'
const LOG_FILE = path.join(LOG_DIR, 'error.log')
// Cap ukuran: kalau log lewat batas ini, dipangkas ke KEEP_LINES baris terakhir.
// Tanpa cap, satu loop error bisa bikin file ratusan MB dalam hitungan detik.
const MAX_BYTES = 5 * 1024 * 1024
const KEEP_LINES = 1000

// Error yang bukan kesalahan aplikasi: stdout/stderr sudah mati (mis. terminal
// ditutup, output di-pipe ke proses yang keluar). Mencatatnya justru memicu
// loop, karena tiap tulis console melempar EPIPE lagi.
const IGNORED_CODES = new Set(['EPIPE', 'ERR_STREAM_DESTROYED', 'ERR_STREAM_WRITE_AFTER_END'])

let writing = false          // guard reentrancy: logError tidak boleh memanggil dirinya sendiri
let consoleBroken = false    // setelah EPIPE pertama, berhenti nulis ke console

try {
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true })
} catch (e) {
  try { log.error('Gagal buat direktori log: ' + e.message) } catch {}
}

function rotateIfNeeded() {
  try {
    const { size } = fs.statSync(LOG_FILE)
    if (size < MAX_BYTES) return
    const lines = fs.readFileSync(LOG_FILE, 'utf8').split('\n')
    const tail = lines.slice(-KEEP_LINES).join('\n')
    fs.writeFileSync(LOG_FILE, `[rotasi ${new Date().toISOString()}] log dipangkas dari ${size} byte\n` + tail, 'utf8')
  } catch {}
}

export function logError(context, error) {
  // Pipe mati / stream sudah ditutup bukan error aplikasi — keluar diam-diam,
  // jangan sampai masuk lagi lewat uncaughtException.
  if (error && typeof error === 'object' && IGNORED_CODES.has(error.code)) return
  if (writing) return

  writing = true
  try {
    const timestamp = new Date().toISOString()
    const errMsg = error instanceof Error
      ? `${error.message}\nStack: ${error.stack}`
      : (typeof error === 'object' ? JSON.stringify(error, null, 2) : String(error))
    const entry = `[${timestamp}] [ERROR] [${context}]\n${errMsg}\n${'─'.repeat(72)}\n`

    if (!consoleBroken) {
      try {
        log.error(`[${context}] ${error?.message || error}`)
      } catch (e) {
        if (IGNORED_CODES.has(e?.code)) consoleBroken = true
      }
    }

    rotateIfNeeded()
    try { fs.appendFileSync(LOG_FILE, entry, 'utf8') } catch {}
  } finally {
    writing = false
  }
}

export function logInfo(context, message) {
  if (consoleBroken) return
  try { log.info(`[${context}] ${message}`) } catch (e) {
    if (IGNORED_CODES.has(e?.code)) consoleBroken = true
  }
}

// Handler proses: bungkus try/catch supaya kegagalan logging sendiri tidak
// menabrak proses atau memicu loop handler.
process.on('uncaughtException', (err) => {
  try { logError('uncaughtException', err) } catch {}
})
process.on('unhandledRejection', (reason) => {
  try {
    logError('unhandledRejection', reason instanceof Error ? reason : new Error(String(reason)))
  } catch {}
})
