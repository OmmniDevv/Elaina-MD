/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { games } from '../../src/lib/elaina-games.js'

games.register('tebakbendera', {
    alias: ['tbendera', 'flag'],
    emoji: '🏳️',
    title: 'TEBAK BENDERA',
    description: 'Tebak negara dari bendera',
    dataFile: 'tebakbendera2.json',
    answerField: 'name',
    hasImage: true
})

const { config: pluginConfig, handler, answerHandler } = games.createPlugin('tebakbendera')
export { pluginConfig as config, handler, answerHandler }
