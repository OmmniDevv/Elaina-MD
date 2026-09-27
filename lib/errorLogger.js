import fs from 'fs'
import path from 'path'
import { log } from './logger.js'

const LOG_DIR = './log'
const LOG_FILE = path.join(LOG_DIR, 'error.log')

try {
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true })
} catch (e) {
  log.error('Gagal buat direktori log: ' + e.message)
}

export function logError(context, error) {
  const timestamp = new Date().toISOString()
  const errMsg = error instanceof Error
    ? `${error.message}\nStack: ${error.stack}`
    : (typeof error === 'object' ? JSON.stringify(error, null, 2) : String(error))
  const entry = `[${timestamp}] [ERROR] [${context}]\n${errMsg}\n${'─'.repeat(72)}\n`
  log.error(`[${context}] ${error?.message || error}`)
  try { fs.appendFileSync(LOG_FILE, entry, 'utf8') } catch {}
}

export function logInfo(context, message) {
  log.info(`[${context}] ${message}`)
}

process.on('uncaughtException', (err) => logError('uncaughtException', err))
process.on('unhandledRejection', (reason) => {
  logError('unhandledRejection', reason instanceof Error ? reason : new Error(String(reason)))
})
