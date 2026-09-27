/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { games } from '../../src/lib/elaina-games.js'

// 1. REGISTRASI GAME KE ENGINE
games.register('tebakhp', {
    // === METADATA ===
    alias: ['thp', 'merekhp', 'brandhp'], 
    emoji: '📱',                          
    title: 'TEBAK MEREK HP',                
    description: 'Tebak merek smartphone berdasarkan petunjuk ciri khas atau serinya',
    
    // === BEHAVIOR & TIMING ===
    timeout: 60000,                       // 60 detik waktu jawab
    cooldown: 5,                          // Jeda 5 detik antar command
    
    // === REWARDS (Hadiah Game) ===
    rewards: {
        energi: 3,                        
        koin: 500,                       
        exp: 1000
    },

    // === DATA CONFIGURATION ===
    dataFile: 'tebakhp.json',             // Sudah diganti lebih pendek
    questionField: 'soal',                
    answerField: 'jawaban',               
    
    // === IMAGE CONFIGURATION ===
    hasImage: false,                      // Murni teks
    
    // === EKSTRA ===
    hintCount: 3                          
})

// 2. EXPORT INSTANCE HANDLER (WAJIB STANDAR V2)
const { config: pluginConfig, handler, answerHandler } = games.createPlugin('tebakhp')
export { pluginConfig as config, handler, answerHandler }
