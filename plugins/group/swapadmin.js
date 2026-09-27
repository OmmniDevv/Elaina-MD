/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getParticipantJid } from '../../src/lib/elaina-lid.js'
import { isOwner } from '../../config.js'
import te from '../../src/lib/elaina-error.js'

const pluginConfig = {
    name: 'swapadmin',
    alias: ['swapadmin', 'tukaradmin'],
    category: 'group',
    description: 'Menghapus semua admin saat ini dan menjadikan owner bot sebagai admin tunggal',
    usage: '.swapadmin',
    example: '.swapadmin',
    isOwner: true,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    isAdmin: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true,
    isBotAdmin: true
}

async function handler(m, { sock }) {
    try {
        await m.react("🕕")
        
        const groupMeta = m.groupMetadata
        const participants = groupMeta.participants
        const groupCreator = groupMeta.owner || groupMeta.subjectOwner || null
        
        const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net'
        
        let currentAdmins = []
        let ownersInGroup = []
        
        for (const p of participants) {
            const jid = getParticipantJid(p)
            
            if (p.admin === 'admin' || p.admin === 'superadmin') {
                currentAdmins.push(jid)
            }
            
            if (isOwner(jid)) {
                ownersInGroup.push(jid)
            }
        }
        
        if (ownersInGroup.length === 0) {
            await m.reply(
                `❌ *ɢᴀɢᴀʟ ᴍᴇʟᴀᴋᴜᴋᴀɴ ꜱᴡᴀᴘ ᴀᴅᴍɪɴ*\n\n` +
                `Halo! Maaf banget ya, fitur ini tidak bisa dijalankan karena *tidak ada satupun Owner bot* yang terdeteksi di dalam grup ini.\n\n` +
                `Fitur ini membutuhkan minimal satu Owner bot yang berada di grup untuk dijadikan admin baru setelah semua admin lama diturunkan.`
            )
            return
        }
        
        let toDemote = []
        for (const adminJid of currentAdmins) {
            if (adminJid === botJid) continue
            if (adminJid === groupCreator) continue
            
            const participantData = participants.find(p => getParticipantJid(p) === adminJid)
            if (participantData && participantData.admin === 'superadmin') continue
            
            if (ownersInGroup.includes(adminJid)) continue
            
            toDemote.push(adminJid)
        }
        
        let toPromote = []
        for (const ownerJid of ownersInGroup) {
            if (!currentAdmins.includes(ownerJid)) {
                toPromote.push(ownerJid)
            }
        }
        
        if (toDemote.length > 0) {
            await sock.groupParticipantsUpdate(m.chat, toDemote, 'demote')
        }
        
        if (toPromote.length > 0) {
            await sock.groupParticipantsUpdate(m.chat, toPromote, 'promote')
        }
        
        let replyText = `✅ *ꜱᴡᴀᴘ ᴀᴅᴍɪɴ ʙᴇʀʜᴀꜱɪʟ ᴅɪʟᴀᴋᴜᴋᴀɴ*\n\n`
        replyText += `Halo semuanya! Sistem telah berhasil melakukan perombakan admin di grup ini sesuai dengan perintah. Berikut adalah detail perubahan admin yang baru saja terjadi:\n\n`
        
        if (toDemote.length > 0) {
            replyText += `*Admin Yang Diturunkan:*\n`
            toDemote.forEach(v => {
                replyText += `- @${v.split('@')[0]}\n`
            })
            replyText += `\n`
        } else {
            replyText += `*Admin Yang Diturunkan:*\n- Tidak ada admin yang diturunkan\n\n`
        }
        
        replyText += `*Owner Yang Menjadi Admin:*\n`
        ownersInGroup.forEach(v => {
            replyText += `- @${v.split('@')[0]}\n`
        })
        
        replyText += `\nSebagai informasi tambahan, *Pembuat Grup* dan *Bot* tidak diturunkan dari jabatannya karena aturan sistem yang melindunginya. Terima kasih atas pengertiannya!`
        
        await m.reply(replyText, { mentions: [...toDemote, ...ownersInGroup] })
        
    } catch (error) {
        m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }
