/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { games } from '../../src/lib/elaina-games.js'

games.register('tebakmakanan', {
    alias: ['makanan', 'food'],
    emoji: '🍲',
    title: 'TEBAK MAKANAN',
    description: 'Tebak nama makanan',
    hasImage: true
})

const { config: pluginConfig, handler, answerHandler } = games.createPlugin('tebakmakanan')
export { pluginConfig as config, handler, answerHandler }
