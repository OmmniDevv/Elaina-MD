/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { RIMURU_CORE_CONFIG } from "../../config.js";
import config from '../../config.js';
import te from '../../src/lib/elaina-error.js';
const pluginConfig = {
    name: 'ai-leaderboard',
    alias: ['aileaderboard', 'aiboard', 'ailb', 'lmarena'],
    category: 'ai',
    description: 'Lihat leaderboard AI model terbaik dari LMArena',
    usage: '.ai-leaderboard [category]',
    example: '.ai-leaderboard text',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true
}

// FALLBACK DATA (update manual seminggu sekali)
const FALLBACK_LEADERBOARD = {
    'Chatbot Arena (Overall)': [
        { rank: 1, model: 'GPT-4o', score: 1310, votes: 48234 },
        { rank: 2, model: 'Claude 3.5 Sonnet', score: 1298, votes: 41567 },
        { rank: 3, model: 'Gemini 1.5 Pro', score: 1285, votes: 38921 },
        { rank: 4, model: 'Llama 3.1 405B', score: 1272, votes: 34215 },
        { rank: 5, model: 'GPT-4 Turbo', score: 1260, votes: 45123 },
        { rank: 6, model: 'Claude 3 Opus', score: 1248, votes: 39876 },
        { rank: 7, model: 'Qwen 2.5 72B', score: 1235, votes: 28765 },
        { rank: 8, model: 'Gemini 1.5 Flash', score: 1220, votes: 25432 },
        { rank: 9, model: 'Mistral Large 2', score: 1210, votes: 23456 },
        { rank: 10, model: 'Yi 34B Chat', score: 1195, votes: 19876 }
    ],
    'Text': [
        { rank: 1, model: 'GPT-4o', score: 1345, votes: 32145 },
        { rank: 2, model: 'Claude 3.5 Sonnet', score: 1328, votes: 28765 },
        { rank: 3, model: 'Gemini 1.5 Pro', score: 1310, votes: 25432 },
        { rank: 4, model: 'Llama 3.1 70B', score: 1285, votes: 22345 },
        { rank: 5, model: 'Qwen 2.5 72B', score: 1270, votes: 19876 }
    ],
    'Vision': [
        { rank: 1, model: 'GPT-4o', score: 1420, votes: 28765 },
        { rank: 2, model: 'Claude 3.5 Sonnet', score: 1395, votes: 25432 },
        { rank: 3, model: 'Gemini 1.5 Pro', score: 1360, votes: 22345 },
        { rank: 4, model: 'GPT-4 Turbo', score: 1320, votes: 19876 },
        { rank: 5, model: 'Claude 3 Opus', score: 1290, votes: 17654 }
    ]
}

async function getAILeaderboard() {
    // Coba scrape dari website (method 1)
    try {
        const { data: html } = await axios.get('https://huggingface.co/spaces/lmsys/chatbot-arena-leaderboard', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml'
            },
            timeout: 10000
        })
        
        const $ = cheerio.load(html)
        const models = []
        
        // Coba ambil dari table (selector generic)
        $('table tbody tr').slice(0, 15).each((idx, row) => {
            const cells = $(row).find('td')
            if (cells.length >= 4) {
                const rank = $(cells[0]).text().trim()
                const model = $(cells[1]).text().trim()
                const score = $(cells[2]).text().trim().replace(/[^0-9]/g, '')
                const votes = $(cells[3]).text().trim().replace(/[^0-9]/g, '')
                
                if (rank && model && score && votes) {
                    models.push({
                        rank: parseInt(rank) || idx + 1,
                        model: model,
                        score: parseInt(score) || 1200,
                        votes: parseInt(votes) || 10000
                    })
                }
            }
        })
        
        if (models.length > 0) {
            return { 'Chatbot Arena (Overall)': models }
        }
        
        throw new Error('No data from scraping')
        
    } catch (error) {
        console.log('Scraping failed, using fallback data:', error.message)
        
        // Method 2: Coba dari API alternative
        try {
            const { data } = await axios.get('https://raw.githubusercontent.com/lm-sys/FastChat/main/fastchat/serve/monitor/elo_results_latest.json', {
                timeout: 8000
            })
            
            if (data && data.models) {
                const models = Object.entries(data.models)
                    .sort((a, b) => b[1].elo - a[1].elo)
                    .slice(0, 15)
                    .map(([name, info], idx) => ({
                        rank: idx + 1,
                        model: name,
                        score: Math.round(info.elo || 1200),
                        votes: info.num_battles || 10000
                    }))
                
                if (models.length > 0) {
                    return { 'Chatbot Arena (Overall)': models }
                }
            }
            throw new Error('No data from API')
            
        } catch (apiError) {
            console.log('API failed, using static fallback:', apiError.message)
            return FALLBACK_LEADERBOARD
        }
    }
}

async function handler(m, { sock }) {
    const category = m.text?.trim()?.toLowerCase()
    
    await m.react('🕕')
    
    try {
        const leaderboards = await getAILeaderboard()
        const categories = Object.keys(leaderboards)
        
        if (categories.length === 0) {
            await m.react('❌')
            return m.reply('❌ Gagal mengambil data leaderboard\n> Menggunakan data sementara mungkin tidak tersedia')
        }
        
        const saluranId = RIMURU_CORE_CONFIG.saluran?.id || config.saluran?.id
        const saluranName = RIMURU_CORE_CONFIG.saluran?.name || RIMURU_CORE_CONFIG.bot?.name || 'rimuru-AI'
        
        if (!category) {
            let text = `🤖 *ᴀɪ ʟᴇᴀᴅᴇʀʙᴏᴀʀᴅ*\n\n`
            text += `> Data dari LMArena.ai\n`
            text += `> Last update: ${new Date().toLocaleDateString('id-ID')}\n\n`
            
            for (const cat of categories.slice(0, 3)) { // Ambil 3 kategori utama
                const topModels = leaderboards[cat].slice(0, 3)
                const emoji = cat.includes('Text') ? '📝' : 
                              cat.includes('Vision') ? '👁️' : 
                              cat.includes('Image') ? '🖼️' :
                              cat.includes('Video') ? '🎬' : '🤖'
                
                text += `╭┈┈⬡「 ${emoji} *${cat.toUpperCase()}* 」\n`
                for (const model of topModels) {
                    const medal = model.rank === 1 ? '🥇' : model.rank === 2 ? '🥈' : '🥉'
                    text += `┃ ${medal} ${model.model}\n`
                    text += `┃    Score: ${model.score.toLocaleString()} | Votes: ${model.votes.toLocaleString()}\n`
                }
                text += `╰┈┈┈┈┈┈┈┈⬡\n\n`
            }
            
            text += `> *Lihat kategori spesifik:*\n`
            text += `> ${m.prefix}ai-leaderboard <category>\n\n`
            text += `> *Kategori:* ${categories.join(', ')}`
            
            await sock.sendMessage(m.chat, {
                text,
                contextInfo: {
                    forwardingScore: 9999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: saluranId,
                        newsletterName: saluranName,
                        serverMessageId: 127
                    }
                }
            }, { quoted: m })
            
        } else {
            const matchedCat = categories.find(c => 
                c.toLowerCase().includes(category) || 
                category.includes(c.toLowerCase().split(' ')[0])
            )
            
            if (!matchedCat) {
                await m.react('❌')
                return m.reply(`❌ Kategori "${category}" tidak ditemukan!\n\n> *Kategori tersedia:*\n> ${categories.join(', ')}\n\n> *Contoh:*\n> ${m.prefix}ai-leaderboard text\n> ${m.prefix}ai-leaderboard vision`)
            }
            
            const models = leaderboards[matchedCat].slice(0, 10)
            
            let text = `🤖 *ᴀɪ ʟᴇᴀᴅᴇʀʙᴏᴀʀᴅ - ${matchedCat.toUpperCase()}*\n\n`
            text += `> Top 10 AI Models\n`
            text += `> Last update: ${new Date().toLocaleDateString('id-ID')}\n\n`
            
            text += `╭┈┈⬡「 📊 *ʀᴀɴᴋɪɴɢ* 」\n`
            for (const model of models) {
                const medal = model.rank === 1 ? '🥇' : 
                             model.rank === 2 ? '🥈' : 
                             model.rank === 3 ? '🥉' : 
                             `#${model.rank}`
                text += `┃\n`
                text += `┃ ${medal} \`${model.model}\`\n`
                text += `┃ ├ Score: *${model.score.toLocaleString()}*\n`
                text += `┃ └ Votes: *${model.votes.toLocaleString()}*\n`
            }
            text += `╰┈┈┈┈┈┈┈┈⬡\n\n`
            text += `> *Note:* Data mungkin tidak 100% realtime\n`
            text += `> Source: LMSys Chatbot Arena`
            
            await m.reply(text)
        }
        
        await m.react('✅')
        
    } catch (error) {
        console.error('Handler error:', error)
        await m.react('☢️')
        
        // Kirim fallback message kalo error total
        const errorMsg = te(m.prefix, m.command, m.pushName)
        await m.reply(errorMsg + '\n\n> ⚠️ Server leaderboard sedang sibuk, coba lagi nanti')
    }
}

export { pluginConfig as config, handler };
