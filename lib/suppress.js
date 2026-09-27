// Elaina-MD — suppress pihak ketiga SEBELUM modul lain dimuat.
// Dipakai via: node --import ./lib/suppress.js main.js (dipasang otomatis dari index.js)
// Menelan log import-time: emoji-db, libsignal dump.
const NOISE = /EmojiDB loaded|Emoji versions|Closing session|Opening session|Session already closed|Removing old closed session|Migrating session to|SessionEntry \{/
for (const k of ['log', 'info', 'warn']) {
  const orig = console[k].bind(console)
  console[k] = (...args) => {
    if (typeof args[0] === 'string' && NOISE.test(args[0])) return
    return orig(...args)
  }
}
