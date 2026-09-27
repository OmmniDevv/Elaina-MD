/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { games } from '../../src/lib/elaina-games.js'

games.register('tebaklagu', {
    alias: ['tl', 'guesssong'],
    emoji: '🎵',
    title: 'TEBAK LAGU',
    description: 'Tebak judul lagu'
})

const { config: pluginConfig, handler, answerHandler } = games.createPlugin('tebaklagu')
export { pluginConfig as config, handler, answerHandler }
