/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { games } from '../../src/lib/elaina-games.js'

// 1. REGISTRASI GAME KE ENGINE
games.register('tebakejenali', {
    // === METADATA ===
    alias: ['tebakali', 'ejenali'],
    emoji: '🕵️‍♂️',
    title: 'TEBAK KARAKTER EJEN ALI',
    description: 'Tebak nama karakter atau ejen dari serial Ejen Ali',
    
    // === BEHAVIOR & TIMING ===
    timeout: 60000,                       // Waktu menjawab (60 detik)
    cooldown: 5,                          // Cooldown command (5 detik)
    
    // === REWARDS ===
    rewards: {
        energi: 5,
        koin: 1200,
        exp: 2500
    },

    // === DATA CONFIGURATION ===
    dataFile: 'tebakejenali.json',         // Wajib sama dengan nama file JSON
    questionField: 'soal',
    answerField: 'jawaban',
    
    // === IMAGE CONFIGURATION ===
    hasImage: false,
    
    // === EKSTRA ===
    hintCount: 2
})

// 2. EXPORT INSTANCE HANDLER (WAJIB STANDAR INI)
const { config: pluginConfig, handler, answerHandler } = games.createPlugin('tebakejenali')
export { pluginConfig as config, handler, answerHandler }
