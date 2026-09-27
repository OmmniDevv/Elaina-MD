/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { games } from '../../src/lib/elaina-games.js'

games.register('tebaktebakan', {
    alias: ['tbt', 'tebak2an', 'receh'],
    emoji: '😄',
    title: 'TEBAK-TEBAKAN',
    description: 'Tebak-tebakan receh'
})

const { config: pluginConfig, handler, answerHandler } = games.createPlugin('tebaktebakan')
export { pluginConfig as config, handler, answerHandler }
