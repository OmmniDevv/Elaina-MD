/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { games } from '../../src/lib/elaina-games.js'

games.register('tebakprofesi', {
    alias: ['tp', 'guessjob'],
    emoji: '👨‍💼',
    title: 'TEBAK PROFESI',
    description: 'Tebak nama profesi'
})

const { config: pluginConfig, handler, answerHandler } = games.createPlugin('tebakprofesi')
export { pluginConfig as config, handler, answerHandler }
