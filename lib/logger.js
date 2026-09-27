// Elaina-MD — centralized pretty logger
// Satu format untuk semua log: [HH:MM:SS] LEVEL  pesan
// Dipakai index.js, main.js, lib/print.js, lib/errorLogger.js
import chalk from 'chalk'

const ts = () => new Date().toTimeString().split(' ')[0]

const LV = {
  BOOT: chalk.cyan('BOOT '),
  AUTH: chalk.magenta('AUTH '),
  PLUGIN: chalk.blue('PLUGIN'),
  CHAT: chalk.green('CHAT '),
  CMD: chalk.yellow('CMD  '),
  OK: chalk.green('OK   '),
  INFO: chalk.cyan('INFO '),
  WARN: chalk.yellow('WARN '),
  ERROR: chalk.red('ERROR'),
  DB: chalk.gray('DB   '),
  NET: chalk.gray('NET  ')
}

function line(level, msg) {
  console.log(`${chalk.gray(`[${ts()}]`)} ${LV[level] || LV.INFO}  ${msg}`)
}

export const log = {
  boot: (m) => line('BOOT', m),
  auth: (m) => line('AUTH', m),
  plugin: (m) => line('PLUGIN', m),
  chat: (m) => line('CHAT', m),
  cmd: (m) => line('CMD', m),
  ok: (m) => line('OK', m),
  info: (m) => line('INFO', m),
  warn: (m) => line('WARN', m),
  error: (m) => line('ERROR', chalk.red(m)),
  db: (m) => line('DB', chalk.gray(m)),
  net: (m) => line('NET', chalk.gray(m))
}

export function printBanner({ name = 'ELAINA-MD', version = '', author = '', desc = '', node = process.version } = {}) {
  const W = 52
  const bar = chalk.cyan('─'.repeat(W))
  const pad = (s, w) => s + ' '.repeat(Math.max(0, w - [...s].length))
  console.log('')
  console.log(bar)
  console.log(chalk.bold.white(`  ${name}`) + (version ? chalk.gray(`  v${version}`) : ''))
  if (desc) console.log(chalk.gray(`  ${desc}`))
  console.log(chalk.gray(`  by ${author}  •  node ${node}`))
  console.log(bar)
  console.log('')
}

export function printStatus(label, value, ok = true) {
  const icon = ok ? chalk.green('✓') : chalk.red('✖')
  console.log(`${chalk.gray(`[${ts()}]`)} ${icon}  ${chalk.white(pad2(label))} ${value}`)
}

function pad2(s, w = 14) { return (s + ' '.repeat(w)).slice(0, w) }

// Filter noise pihak ketiga (emoji-db, libsignal dump) — panggil sekali di awal main.js/index.js
const NOISE = /EmojiDB loaded|Emoji versions|Closing session|Opening session|Session already closed|Removing old closed session|Migrating session to|SessionEntry \{/
export function patchConsole() {
  for (const k of ['log', 'info', 'warn']) {
    const orig = console[k].bind(console)
    console[k] = (...args) => {
      if (typeof args[0] === 'string' && NOISE.test(args[0])) return
      return orig(...args)
    }
  }
}
