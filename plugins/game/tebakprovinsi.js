/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { games } from '../../src/lib/elaina-games.js'

// 1. REGISTRASI GAME KE ENGINE
games.register('tebakprovinsi', {
    // === METADATA ===
    alias: ['tprovinsi', 'tebakprov', 'provinsi'], 
    emoji: '🇮🇩',                          
    title: 'TEBAK PROVINSI',                
    description: 'Tebak nama provinsi berdasarkan ibu kotanya',
    
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
    dataFile: 'tebakprovinsi.json',         
    questionField: 'soal',                
    answerField: 'jawaban',               
    
    // === IMAGE CONFIGURATION ===
    hasImage: false,                      // Game berbasis teks
    
    // === EKSTRA ===
    hintCount: 3                          
})

// 2. EXPORT INSTANCE HANDLER (WAJIB STANDAR V2)
const { config: pluginConfig, handler, answerHandler } = games.createPlugin('tebakprovinsi')
export { pluginConfig as config, handler, answerHandler }
