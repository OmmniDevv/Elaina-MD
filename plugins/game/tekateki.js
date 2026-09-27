/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { games } from '../../src/lib/elaina-games.js'

games.register('tekateki', {
    alias: ['teka'],
    emoji: '🧩',
    title: 'TEKA-TEKI',
    description: 'Game teka-teki tradisional'
})

const { config: pluginConfig, handler, answerHandler } = games.createPlugin('tekateki')
export { pluginConfig as config, handler, answerHandler }
