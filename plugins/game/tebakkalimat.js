/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { games } from '../../src/lib/elaina-games.js'

games.register('tebakkalimat', {
    alias: ['tkl', 'peribahasa'],
    emoji: '📖',
    title: 'TEBAK KALIMAT',
    description: 'Tebak kalimat atau peribahasa'
})

const { config: pluginConfig, handler, answerHandler } = games.createPlugin('tebakkalimat')
export { pluginConfig as config, handler, answerHandler }
