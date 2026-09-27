/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { games } from '../../src/lib/elaina-games.js'

games.register('tebakfilm', {
    alias: ['tf', 'guessmovie'],
    emoji: '🎬',
    title: 'TEBAK FILM',
    description: 'Tebak judul film'
})

const { config: pluginConfig, handler, answerHandler } = games.createPlugin('tebakfilm')
export { pluginConfig as config, handler, answerHandler }
