/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import te from '../../src/lib/elaina-error.js'
const pluginConfig = {
    name: ['clearchat', 'cc', 'cleangc', 'deletechat', 'delchat'],
    alias: [],
    category: 'group',
    description: 'Membersihkan chat grup',
    usage: '.clearchat',
    example: '.clearchat',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    isAdmin: true,
    isBotAdmin: true,
    cooldown: 60,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    m.react('🗑️')
    
    try {
        const now = Math.floor(Date.now() / 1000)
        
        await sock.chatModify({ 
            delete: true, 
            lastMessages: [{ 
                key: m.key, 
                messageTimestamp: m.messageTimestamp || now
            }] 
        }, m.chat)
        
        await m.reply(`✅ *ᴄʜᴀᴛ ᴅɪʙᴇʀsɪʜᴋᴀɴ*\n\n> Chat grup telah dibersihkan oleh @${m.sender.split('@')[0]}`, { mentions: [m.sender] })
        
    } catch (error) {
        try {
            await sock.chatModify({ 
                clear: { 
                    messages: [{ 
                        id: m.key.id, 
                        fromMe: m.key.fromMe,
                        timestamp: Math.floor(Date.now() / 1000)
                    }] 
                } 
            }, m.chat)
            
            await m.reply(`✅ *ᴄʜᴀᴛ ᴅɪʙᴇʀsɪʜᴋᴀɴ*\n\nChat grup di wa bot telah dibersihkan oleh @${m.sender.split('@')[0]}\nSilahkan lihat sendiri di wa bot kamu`, { mentions: [m.sender] })
        } catch (e) {
            m.react('☢')
            m.reply(te(m.prefix, m.command, m.pushName))
        }
    }
}

export { pluginConfig as config, handler }