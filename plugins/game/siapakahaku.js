/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { games } from '../../src/lib/elaina-games.js'

games.register('siapakahaku', {
    alias: ['siapa', 'whoami'],
    emoji: '🎭',
    title: 'SIAPAKAH AKU',
    description: 'Tebak dari deskripsi'
})

const { config: pluginConfig, handler, answerHandler } = games.createPlugin('siapakahaku')
export { pluginConfig as config, handler, answerHandler }
