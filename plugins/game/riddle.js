/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { games } from '../../src/lib/elaina-games.js'

games.register('riddle', {
    alias: ['rd', 'tebaktebak', 'riddles'],
    emoji: '❓',
    title: 'RIDDLE',
    description: 'Riddle/tebak-tebakan'
})

const { config: pluginConfig, handler, answerHandler } = games.createPlugin('riddle')
export { pluginConfig as config, handler, answerHandler }
