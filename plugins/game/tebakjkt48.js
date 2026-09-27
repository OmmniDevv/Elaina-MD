/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { games } from '../../src/lib/elaina-games.js'

games.register('tebakjkt48', {
    alias: ['jkt48', 'jkt'],
    emoji: '🎀',
    title: 'TEBAK JKT48',
    description: 'Tebak member JKT48',
    hasImage: true
})

const { config: pluginConfig, handler, answerHandler } = games.createPlugin('tebakjkt48')
export { pluginConfig as config, handler, answerHandler }
