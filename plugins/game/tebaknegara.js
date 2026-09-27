/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { games } from '../../src/lib/elaina-games.js'

games.register('tebaknegara', {
    alias: ['tn', 'guesscountry'],
    emoji: '🌍',
    title: 'TEBAK NEGARA',
    description: 'Tebak nama negara'
})

const { config: pluginConfig, handler, answerHandler } = games.createPlugin('tebaknegara')
export { pluginConfig as config, handler, answerHandler }
