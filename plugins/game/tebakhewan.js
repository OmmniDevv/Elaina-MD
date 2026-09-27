/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { games } from '../../src/lib/elaina-games.js'

games.register('tebakhewan', {
    alias: ['th', 'guessanimal'],
    emoji: '🐾',
    title: 'TEBAK HEWAN',
    description: 'Tebak nama hewan',
})

const { config: pluginConfig, handler, answerHandler } = games.createPlugin('tebakhewan')
export { pluginConfig as config, handler, answerHandler }