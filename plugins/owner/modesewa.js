/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from '../../src/lib/elaina-database.js';
const pluginConfig = {
    name: 'modesewa',
    alias: ['ms', 'sewamode', 'modesewa'],
    category: 'owner',
    description: 'Mode sewa bot - aktifkan/nonaktifkan sistem sewa',
    usage: '.modesewa <on/off/check>',
    example: '.modesewa on',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

const pendingConfirmations = new Map()

async function handler(m, { sock }) {
    const db = getDatabase()
    const args = m.text?.trim()?.toLowerCase()
    
    if (!db.db.data.sewa) {
        db.db.data.sewa = { enabled: false, groups: {} }
        db.db.save()
    }
    
    const currentStatus = db.db.data.sewa.enabled
    const sewaGroups = Object.keys(db.db.data.sewa.groups || {})
    
    // ========== CHECK STATUS ==========
    if (args === 'check' || args === 'status' || args === 'cek') {
        let txt = `╭━━━〔 🩸 *ᴍᴏᴅᴇ ꜱᴇᴡᴀ* 🩸 〕━━━⬣
│
│  🔮 *Sᴛᴀᴛᴜꜱ:* ${currentStatus ? '🟢 ᴀᴋᴛɪꜰ' : '🔴 ɴᴏɴᴀᴋᴛɪꜰ'}
│  📋 *Tᴏᴛᴀʟ ɢʀᴜᴘ ᴛᴇʀᴅᴀꜰᴛᴀʀ:* ${sewaGroups.length}
│
│  💀 *Dᴀʀʟɪɴɢ, ᴍᴏᴅᴇ ꜱᴇᴡᴀ ᴍᴇɴᴊᴀɢᴀ ʙᴏᴛ ᴀɢᴀʀ ʜᴀɴʏᴀ ʙᴇʀᴀᴅᴀ ᴅɪ ɢʀᴜᴘ ʏᴀɴɢ ᴅɪꜱᴇᴡᴀ*
│
╰━━━━━━━━━━━━━━━━━━━━━━━⬣`

        if (sewaGroups.length > 0) {
            txt += `\n\n╭━━━〔 📋 *ʟɪꜱᴛ ɢʀᴜᴘ* 〕━━━⬣\n`
            for (let i = 0; i < Math.min(sewaGroups.length, 10); i++) {
                const groupId = sewaGroups[i]
                const groupData = db.db.data.sewa.groups[groupId]
                const expired = groupData?.expired || 'Permanent'
                txt += `│  ${i+1}. ${groupId.slice(0, 20)}...\n│     └ ⏰ ${expired}\n`
            }
            if (sewaGroups.length > 10) {
                txt += `│  ...ᴅᴀɴ ${sewaGroups.length - 10} ɢʀᴜᴘ ʟᴀɪɴɴʏᴀ\n`
            }
            txt += `╰━━━━━━━━━━━━━━━━⬣`
        }
        
        await m.reply(txt)
        return
    }
    
    // ========== OFF ==========
    if (args === 'off' || args === 'disable') {
        if (!currentStatus) {
            return m.reply(`╭━━━〔 💀 *ᴍᴏᴅᴇ ꜱᴇᴡᴀ* 💀 〕━━━⬣
│
│  ❌ *ꜱᴇᴡᴀ ʙᴏᴛ ꜱᴜᴅᴀʜ ᴛɪᴅᴀᴋ ᴀᴋᴛɪꜰ*
│
│  💕 *ᴛɪᴅᴀᴋ ᴀᴅᴀ ʏᴀɴɢ ᴅɪᴜʙᴀʜ, ᴅᴀʀʟɪɴɢ~*
│
╰━━━━━━━━━━━━━━━━⬣`)
        }
        
        db.db.data.sewa.enabled = false
        db.db.save()
        await m.react('💀')
        
        await m.reply(`╭━━━〔 💀 *ᴍᴏᴅᴇ ꜱᴇᴡᴀ* 💀 〕━━━⬣
│
│  ✅ *ᴍᴏᴅᴇ ꜱᴇᴡᴀ ᴅɪɴᴏɴᴀᴋᴛɪꜰᴋᴀɴ*
│
│  🩸 *ʙᴏᴛ ʙᴇʙᴀꜱ ʙᴇʀᴀᴅᴀ ᴅɪ ꜱᴇᴍᴜᴀ ɢʀᴜᴘ*
│  💕 *ᴛɪᴅᴀᴋ ᴀᴋᴀɴ ᴀᴅᴀ ᴘᴇɴɢᴇᴄᴇᴋᴀɴ ᴏᴛᴏᴍᴀᴛɪꜱ*
│
╰━━━━━━━━━━━━━━━━━━━━━━━⬣`)
        return
    }
    
    // ========== ON ==========
    if (args === 'on' || args === 'enable') {
        if (currentStatus) {
            return m.reply(`╭━━━〔 💀 *ᴍᴏᴅᴇ ꜱᴇᴡᴀ* 💀 〕━━━⬣
│
│  ⚠️ *ᴍᴏᴅᴇ ꜱᴇᴡᴀ ꜱᴜᴅᴀʜ ᴀᴋᴛɪꜰ*
│
│  💀 *ᴅᴀʀʟɪɴɢ, ᴛɪᴅᴀᴋ ᴘᴇʀʟᴜ ᴍᴇɴɢᴀᴋᴛɪꜰᴋᴀɴ ᴜʟᴀɴɢ*
│
╰━━━━━━━━━━━━━━━━⬣`)
        }
        
        const pending = pendingConfirmations.get(m.sender)
        if (pending && pending.type === 'modesewa_on' && Date.now() - pending.timestamp < 60000) {
            return m.reply(`╭━━━〔 💀 *ᴍᴏᴅᴇ ꜱᴇᴡᴀ* 💀 〕━━━⬣
│
│  ⏳ *ᴍᴇɴᴜɴɢɢᴜ ᴋᴏɴꜰɪʀᴍᴀꜱɪ...*
│
│  📝 *ᴋᴇᴛɪᴋ:* \`${m.prefix}modesewa confirm\` ᴜɴᴛᴜᴋ ʟᴀɴᴊᴜᴛ
│  ❌ *ᴋᴇᴛɪᴋ:* \`${m.prefix}modesewa cancel\` ᴜɴᴛᴜᴋ ʙᴀᴛᴀʟ
│
╰━━━━━━━━━━━━━━━━⬣`)
        }
        
        pendingConfirmations.set(m.sender, {
            type: 'modesewa_on',
            timestamp: Date.now(),
            chat: m.chat
        })
        
        setTimeout(() => {
            if (pendingConfirmations.get(m.sender)?.type === 'modesewa_on') {
                pendingConfirmations.delete(m.sender)
            }
        }, 60000)
        
        await m.reply(`╭━━━〔 🩸 *ᴘᴇʀɪɴɢᴀᴛᴀɴ* 🩸 〕━━━⬣
│
│  ⚠️ *ᴘᴇʀʜᴀᴛɪᴋᴀɴ!*
│
│  ᴊɪᴋᴀ ᴍᴏᴅᴇ ꜱᴇᴡᴀ ᴅɪᴀᴋᴛɪꜰᴋᴀɴ:
│
│  ✅ ᴛᴇʀ-ᴡʜɪᴛᴇʟɪꜱᴛ: \`${sewaGroups.length}\` ɢʀᴜᴘ
│  ❌ ɢʀᴜᴘ ʟᴀɪɴ ᴀᴋᴀɴ ᴅɪᴛɪɴɢɢᴀʟᴋᴀɴ!
│
│  💀 *ʙᴏᴛ ᴀᴋᴀɴ ᴍᴇɴɪɴɢɢᴀʟᴋᴀɴ ꜱᴇᴍᴜᴀ ɢʀᴜᴘ*
│  *ʏᴀɴɢ ᴛɪᴅᴀᴋ ᴛᴇʀ-ᴅᴀꜰᴛᴀʀ ᴅɪ ꜱɪꜱᴛᴇᴍ ꜱᴇᴡᴀ*
│
│  ✨ *ᴜɴᴛᴜᴋ ᴋᴏɴꜰɪʀᴍᴀꜱɪ:*
│  \`${m.prefix}modesewa confirm\` - ʟᴀɴᴊᴜᴛᴋᴀɴ
│  \`${m.prefix}modesewa cancel\` - ʙᴀᴛᴀʟᴋᴀɴ
│
│  📝 *ᴛᴀᴍʙᴀʜ ɢʀᴜᴘ ᴋᴇ ᴡʜɪᴛᴇʟɪꜱᴛ:*
│  \`${m.prefix}addsewa <ʟɪɴᴋ> <ᴅᴜʀᴀꜱɪ>\`
│
╰━━━━━━━━━━━━━━━━━━━━━━━⬣`)
        return
    }
    
    // ========== CONFIRM ==========
    if (args === 'confirm' || args === 'yes' || args === 'y' || args === 'setuju') {
        const pending = pendingConfirmations.get(m.sender)
        if (!pending || pending.type !== 'modesewa_on') {
            return m.reply(`╭━━━〔 ❌ *ɢᴀɢᴀʟ* ❌ 〕━━━⬣
│
│  💀 *ᴛɪᴅᴀᴋ ᴀᴅᴀ ᴘᴇʀᴍɪɴᴛᴀᴀɴ ʏᴀɴɢ ᴘᴇɴᴅɪɴɢ*
│
│  📝 ᴋᴇᴛɪᴋ \`${m.prefix}modesewa on\` ᴅᴜʟᴜ
│
╰━━━━━━━━━━━━━━━━⬣`)
        }
        
        pendingConfirmations.delete(m.sender)
        
        db.db.data.sewa.enabled = true
        db.db.save()
        
        await m.react('🩸')
        
        await m.reply(`╭━━━〔 🩸 *ᴍᴏᴅᴇ ꜱᴇᴡᴀ ᴀᴋᴛɪꜰ* 🩸 〕━━━⬣
│
│  ✅ *ꜱɪꜱᴛᴇᴍ ꜱᴇᴡᴀ ᴛᴇʟᴀʜ ᴅɪᴀᴋᴛɪꜰᴋᴀɴ*
│
│  📋 *ᴛᴏᴛᴀʟ ɢʀᴜᴘ ᴛᴇʀ-ᴡʜɪᴛᴇʟɪꜱᴛ:* \`${sewaGroups.length}\`
│
│  💀 *ʟᴀɴɢᴋᴀʜ ꜱᴇʟᴀɴᴊᴜᴛɴʏᴀ:*
│  \`${m.prefix}modesewa leave\` - ᴛɪɴɢɢᴀʟᴋᴀɴ ɢʀᴜᴘ ɴᴏɴ-ᴡʜɪᴛᴇʟɪꜱᴛ
│
│  🩸 *“ᴅᴀʀʟɪɴɢ, ʙᴏᴛ ꜱɪᴀᴘ ᴍᴇɴᴊᴀɢᴀ ɢʀᴜᴘ ꜱᴇᴡᴀᴀɴ~”*
│
╰━━━━━━━━━━━━━━━━━━━━━━━⬣`)
        return
    }
    
    // ========== LEAVE ==========
    if (args === 'leave' || args === 'tinggalkan') {
        if (!currentStatus) {
            return m.reply(`╭━━━〔 ❌ *ɢᴀɢᴀʟ* ❌ 〕━━━⬣
│
│  💀 *ᴍᴏᴅᴇ ꜱᴇᴡᴀ ʙᴇʟᴜᴍ ᴀᴋᴛɪꜰ*
│
│  📝 ᴀᴋᴛɪꜰᴋᴀɴ ᴅᴜʟᴜ ᴅᴇɴɢᴀɴ:
│  \`${m.prefix}modesewa on\`
│
╰━━━━━━━━━━━━━━━━⬣`)
        }
        
        if (sewaGroups.length === 0) {
            return m.reply(`╭━━━〔 ⚠️ *ᴘᴇʀɪɴɢᴀᴛᴀɴ* ⚠️ 〕━━━⬣
│
│  💀 *ʙᴇʟᴜᴍ ᴀᴅᴀ ɢʀᴜᴘ ʏᴀɴɢ ᴅɪᴛᴀᴍʙᴀʜᴋᴀɴ*
│
│  📝 ᴛᴀᴍʙᴀʜᴋᴀɴ ɢʀᴜᴘ ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ:
│  \`${m.prefix}addsewa <ʟɪɴᴋ> <ᴅᴜʀᴀꜱɪ>\`
│
╰━━━━━━━━━━━━━━━━⬣`)
        }
        
        await m.react('⏳')
        await m.reply(`⏳ *ᴍᴇᴍᴘʀᴏꜱᴇꜱ...*\n\n> ᴍᴇɴɢᴀᴍʙɪʟ ᴅᴀꜰᴛᴀʀ ɢʀᴜᴘ...`)
        
        global.sewaLeaving = true
        
        try {
            global.isFetchingGroups = true
            const allGroups = await sock.groupFetchAllParticipating()
            global.isFetchingGroups = false
            const allGroupIds = Object.keys(allGroups)
            const unlistedGroups = allGroupIds.filter(id => !sewaGroups.includes(id))
            
            if (unlistedGroups.length === 0) {
                delete global.sewaLeaving
                await m.react('✅')
                return m.reply(`╭━━━〔 ✅ *ꜱᴇʟᴇꜱᴀɪ* ✅ 〕━━━⬣
│
│  🩸 *ᴛɪᴅᴀᴋ ᴀᴅᴀ ɢʀᴜᴘ ʏᴀɴɢ ᴘᴇʀʟᴜ ᴅɪᴛɪɴɢɢᴀʟᴋᴀɴ*
│
│  💕 *ꜱᴇᴍᴜᴀ ɢʀᴜᴘ ꜱᴜᴅᴀʜ ᴛᴇʀ-ᴡʜɪᴛᴇʟɪꜱᴛ, ᴅᴀʀʟɪɴɢ~*
│
╰━━━━━━━━━━━━━━━━⬣`)
            }
            
            await m.reply(`╭━━━〔 📊 *ɪɴꜰᴏʀᴍᴀꜱɪ* 📊 〕━━━⬣
│
│  👥 ᴛᴏᴛᴀʟ ɢʀᴜᴘ: \`${allGroupIds.length}\`
│  ✅ ᴛᴇʀ-ᴡʜɪᴛᴇʟɪꜱᴛ: \`${sewaGroups.length}\`
│  ❌ ᴀᴋᴀɴ ᴅɪᴛɪɴɢɢᴀʟᴋᴀɴ: \`${unlistedGroups.length}\`
│
╰━━━━━━━━━━━━━━━━⬣\n\n> ᴍᴇᴍᴘʀᴏꜱᴇꜱ ᴘᴇɴɢᴇʟᴜᴀʀᴀɴ ɢʀᴜᴘ...`)
            
            let leftCount = 0
            let failedCount = 0
            
            for (const groupId of unlistedGroups) {
                try {
                    await sock.sendMessage(groupId, {
                        text: `🩸 *ᴍᴏᴅᴇ ꜱᴇᴡᴀ* 🩸

╭━━━〔 💀 *ᴘᴇʀɪɴɢᴀᴛᴀɴ* 💀 〕━━━⬣
│
│  ⚠️ *ɢʀᴜᴘ ɪɴɪ ᴛɪᴅᴀᴋ ᴛᴇʀᴅᴀꜰᴛᴀʀ*
│  *ᴅᴀʟᴀᴍ ꜱɪꜱᴛᴇᴍ ꜱᴇᴡᴀ ʙᴏᴛ*
│
│  🩸 ʙᴏᴛ ᴀᴋᴀɴ ᴍᴇɴɪɴɢɢᴀʟᴋᴀɴ ɢʀᴜᴘ ɪɴɪ
│
│  📞 *ʜᴜʙᴜɴɢɪ ᴏᴡɴᴇʀ ᴜɴᴛᴜᴋ ꜱᴇᴡᴀ ʙᴏᴛ:*
│  \`${m.prefix}owner\`
│
╰━━━━━━━━━━━━━━━━━━━━━━━⬣

> ᴅᴀʀʟɪɴɢ, ᴍᴏʜᴏɴ ᴍᴀᴀꜰ ᴋᴀᴍɪ ᴘᴀᴍɪᴛ ᴘᴜʟᴀɴɢ~ 👋`
                    })
                    await new Promise(r => setTimeout(r, 2000))
                    await sock.groupLeave(groupId)
                    leftCount++
                    await new Promise(r => setTimeout(r, 5000))
                } catch (e) {
                    failedCount++
                }
            }
            
            delete global.sewaLeaving
            await m.react('✅')
            
            await m.reply(`╭━━━〔 ✅ *ꜱᴇʟᴇꜱᴀɪ* ✅ 〕━━━⬣
│
│  🩸 *ᴘʀᴏꜱᴇꜱ ᴘᴇɴɢᴇʟᴜᴀʀᴀɴ ʀᴀᴍᴘᴜɴɢ*
│
│  ✅ ʙᴇʀʜᴀꜱɪʟ: \`${leftCount}\` ɢʀᴜᴘ
│  ❌ ɢᴀɢᴀʟ: \`${failedCount}\` ɢʀᴜᴘ
│
│  💀 *ʙᴏᴛ ꜱᴇᴋᴀʀᴀɴɢ ʜᴀɴʏᴀ ʙᴇʀᴀᴅᴀ ᴅɪ*
│  *ɢʀᴜᴘ ʏᴀɴɢ ᴛᴇʀ-ᴡʜɪᴛᴇʟɪꜱᴛ ꜱᴀᴊᴀ*
│
╰━━━━━━━━━━━━━━━━━━━━━━━⬣`)
            
        } catch (error) {
            delete global.sewaLeaving
            await m.react('❌')
            await m.reply(`╭━━━〔 ❌ *ᴇʀʀᴏʀ* ❌ 〕━━━⬣
│
│  💀 *${error.message}*
│
╰━━━━━━━━━━━━━━━━⬣`)
        }
        return
    }
    
    // ========== CANCEL ==========
    if (args === 'cancel' || args === 'no' || args === 'n' || args === 'batal') {
        const pending = pendingConfirmations.get(m.sender)
        if (!pending || pending.type !== 'modesewa_on') {
            return m.reply(`╭━━━〔 ❌ *ɢᴀɢᴀʟ* ❌ 〕━━━⬣
│
│  💀 *ᴛɪᴅᴀᴋ ᴀᴅᴀ ᴘᴇʀᴍɪɴᴛᴀᴀɴ ʏᴀɴɢ ᴘᴇɴᴅɪɴɢ*
│
╰━━━━━━━━━━━━━━━━⬣`)
        }
        
        pendingConfirmations.delete(m.sender)
        await m.react('💀')
        
        await m.reply(`╭━━━〔 💀 *ᴅɪʙᴀᴛᴀʟᴋᴀɴ* 💀 〕━━━⬣
│
│  ❌ *ᴀᴋᴛɪᴠᴀꜱɪ ᴍᴏᴅᴇ ꜱᴇᴡᴀ ᴅɪʙᴀᴛᴀʟᴋᴀɴ*
│
│  📝 *ᴡʜɪᴛᴇʟɪꜱᴛ ɢʀᴜᴘ ᴘᴇɴᴛɪɴɢ ᴅᴜʟᴜ ᴅᴇɴɢᴀɴ:*
│  \`${m.prefix}addsewa <ʟɪɴᴋ> <ᴅᴜʀᴀꜱɪ>\`
│
│  💕 *ᴋᴇᴛɪᴋ ᴜʟᴀɴɢ ᴋᴀʟᴏ ᴊᴀᴅɪ, ᴅᴀʀʟɪɴɢ~*
│
╰━━━━━━━━━━━━━━━━━━━━━━━⬣`)
        return
    }
    
    // ========== HELP / DEFAULT ==========
    await m.reply(`╭━━━〔 🩸 *ᴍᴏᴅᴇ ꜱᴇᴡᴀ* 🩸 〕━━━⬣
│
│  🔮 *Sᴛᴀᴛᴜꜱ:* ${currentStatus ? '🟢 ᴀᴋᴛɪꜰ' : '🔴 ɴᴏɴᴀᴋᴛɪꜰ'}
│  📋 *Tᴏᴛᴀʟ ɢʀᴜᴘ ᴛᴇʀᴅᴀꜰᴛᴀʀ:* ${sewaGroups.length}
│
│  💀 *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ:*
│
│  ✨ \`${m.prefix}modesewa on\` - ᴍᴇɴɢᴀᴋᴛɪꜰᴋᴀɴ
│  ✨ \`${m.prefix}modesewa off\` - ᴍᴇɴᴏɴᴀᴋᴛɪꜰᴋᴀɴ
│  ✨ \`${m.prefix}modesewa check\` - ʟɪʜᴀᴛ ꜱᴛᴀᴛᴜꜱ
│  ✨ \`${m.prefix}modesewa leave\` - ᴛɪɴɢɢᴀʟᴋᴀɴ ɢʀᴜᴘ ɴᴏɴ-ᴡʜɪᴛᴇʟɪꜱᴛ
│
│  📝 *ᴄᴏɴᴛᴏʜ:*
│  \`${m.prefix}modesewa on\`
│  \`${m.prefix}modesewa check\`
│
│  🩸 *“ᴅᴀʀʟɪɴɢ, ᴍᴏᴅᴇ ꜱᴇᴡᴀ ᴍᴇɴᴊᴀɢᴀ ʙᴏᴛ ᴀɢᴀʀ ʜᴀɴʏᴀ
│    ʙᴇʀᴀᴅᴀ ᴅɪ ɢʀᴜᴘ ʏᴀɴɢ ᴅɪꜱᴇᴡᴀᴀɴ~”*
│
╰━━━━━━━━━━━━━━━━━━━━━━━⬣`)
}

export { pluginConfig as config, handler, pendingConfirmations };
