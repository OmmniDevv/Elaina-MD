import yargs from 'yargs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'
import { createRequire } from 'module'
import { createInterface } from 'readline'
import { spawn } from 'child_process'
import { watchFile, unwatchFile } from 'fs'
import { printBanner, log } from './lib/logger.js'

const rl = createInterface(process.stdin, process.stdout)
const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname)
const { name, version, author, description } = require(join(__dirname, './package.json'))

// Import config untuk nama bot
let config
try {
  config = (await import('./config.js')).default || await import('./config.js')
} catch (e) {
  config = {}
}

const botName = config.namebot || 'Elaina BOT'

printBanner({
  name: `${name.toUpperCase()}  —  ${botName}`,
  version,
  author: author?.name || author || 'OmmniDevv',
  desc: description || 'WhatsApp Bot'
})

var isRunning = false
/**
 * Start a js file
 * @param {String} file `path/to/file`
 */
function start(file) {
  if (isRunning) return
  isRunning = true
  let args = ['--import', join(__dirname, 'lib/suppress.js'), join(__dirname, file), ...process.argv.slice(2)]
  log.info(`Menjalankan ${chalk.white(file)} ...`)
  let p = spawn(process.argv[0], args, { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] })
  p.on('message', data => {
    log.info(`Pesan diterima: ${data}`)
    switch (data) {
      case 'reset':
        p.kill()
        isRunning = false
        start.apply(this, arguments)
        break
      case 'uptime':
        p.send(process.uptime())
        break
    }
  })
  p.on('exit', (_, code) => {
    isRunning = false
    if (code !== 0 && code !== null) {
      log.error(`Bot berhenti (code ${code}) — restart otomatis ...`)
      return start(file)
    }
    log.warn(`Bot berhenti (code ${code}) — menunggu perubahan ${file} ...`)
    watchFile(args[0], () => {
      unwatchFile(args[0])
      start(file)
    })
  })
  let opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
  if (!opts['test'])
    if (!rl.listenerCount()) rl.on('line', line => {
      p.emit('message', line.trim())
    })
}

start('main.js')
