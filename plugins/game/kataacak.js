/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { games } from '../../src/lib/elaina-games.js'

games.register('kataacak', {
    alias: ['ka', 'acakkata'],
    emoji: '🔤',
    title: 'KATA ACAK',
    description: 'Susun huruf acak'
})

const { config: pluginConfig, handler, answerHandler } = games.createPlugin('kataacak')
export { pluginConfig as config, handler, answerHandler }
