/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fs from 'fs'
import path from 'path'
import config from '../../config.js'
const PREF_DB_PATH = path.join(process.cwd(), 'database', 'prefix.json')

function loadPrefixes() {
    try {
        if (fs.existsSync(PREF_DB_PATH)) {
            return JSON.parse(fs.readFileSync(PREF_DB_PATH, 'utf8'))
        }
    } catch {}
    return { prefixes: [], noprefix: false }
}

function savePrefixes(data) {
    const dir = path.dirname(PREF_DB_PATH)
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(PREF_DB_PATH, JSON.stringify(data, null, 2), 'utf8')
}

function getAllPrefixes() {
    const dbPrefixes = loadPrefixes().prefixes || []
    const configPrefix = config.command?.prefix || '.'
    const combined = [configPrefix, ...dbPrefixes]
    return [...new Set(combined)]
}

function isNoPrefix() {
    const data = loadPrefixes()
    return data.noprefix === true
}

const pluginConfig = {
    name: ['addprefix', 'gantiprefix', 'setprefix', 'delprefix', 'listprefix', 'resetprefix'],
    alias: [],
    category: 'owner',
    description: 'Manajemen prefix bot',
    usage: '.addprefix <prefix1> <prefix2>...',
    example: '.addprefix ! # $',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

function handler(m, { sock }) {
    const cmd = m.command?.toLowerCase()
    const args = m.args || []
    
    const data = loadPrefixes()
    if (!data.prefixes) data.prefixes = []
    if (data.noprefix === undefined) data.noprefix = false
    
    switch (cmd) {
        case 'addprefix': {
            if (args.length === 0) {
                return m.reply(
                    `✏️ *ᴀᴅᴅ ᴘʀᴇғɪx*\n\n` +
                    `> Tambah prefix baru untuk bot\n\n` +
                    `*Format:*\n` +
                    `> \`${m.prefix}addprefix <prefix1> <prefix2> ...\`\n\n` +
                    `*Contoh:*\n` +
                    `> \`${m.prefix}addprefix ! # $ 😚\`\n\n` +
                    `*Special:*\n` +
                    `> \`${m.prefix}addprefix <noprefix>\` - Tanpa prefix`
                )
            }
            
            if (args.includes('<noprefix>') || args.includes('noprefix')) {
                data.noprefix = true
                savePrefixes(data)
                return m.reply(
                    `✅ *ɴᴏᴘʀᴇғɪx ᴅɪᴀᴋᴛɪғᴋᴀɴ*\n\n` +
                    `> Bot sekarang bisa dijalankan tanpa prefix\n` +
                    `> Ketik langsung nama command (misal: \`menu\`)`
                )
            }
            
            const newPrefixes = args.filter(p => {
                if (!p || p.length > 5) return false
                if (data.prefixes.includes(p)) return false
                return true
            })
            
            if (newPrefixes.length === 0) {
                return m.reply(`❌ Tidak ada prefix baru yang valid!`)
            }
            
            data.prefixes = [...new Set([...data.prefixes, ...newPrefixes])]
            savePrefixes(data)
            
            m.reply(
                `✅ *ᴘʀᴇғɪx ᴅɪᴛᴀᴍʙᴀʜᴋᴀɴ*\n\n` +
                `> Added: \`${newPrefixes.join('` `')}\`\n\n` +
                `*Semua prefix aktif:*\n` +
                `> \`${getAllPrefixes().join('` `')}\`` +
                `${data.noprefix ? '\n> + *noprefix* aktif' : ''}`
            )
            break
        }
        
        case 'setprefix':
        case 'gantiprefix': {
            if (args.length === 0) {
                return m.reply(
                    `🔄 *ɢᴀɴᴛɪ/sᴇᴛ ᴘʀᴇғɪx*\n\n` +
                    `> Ganti semua prefix dengan yang baru\n\n` +
                    `*Format:*\n` +
                    `> \`${m.prefix}${cmd} <prefix1> <prefix2> ...\`\n\n` +
                    `*Contoh:*\n` +
                    `> \`${m.prefix}${cmd} ! G #\`\n\n` +
                    `*Special:*\n` +
                    `> \`${m.prefix}${cmd} <noprefix>\` - Tanpa prefix saja\n` +
                    `> \`${m.prefix}${cmd} . <noprefix>\` - Prefix . + noprefix\n\n` +
                    `⚠️ Ini akan menghapus semua prefix lama di database!`
                )
            }
            
            const hasNoprefix = args.includes('<noprefix>') || args.includes('noprefix')
            const newPrefixes = args.filter(p => {
                if (!p || p.length > 5) return false
                if (p === '<noprefix>' || p === 'noprefix') return false
                return true
            })
            
            data.prefixes = [...new Set(newPrefixes)]
            data.noprefix = hasNoprefix
            savePrefixes(data)
            
            let replyText = `✅ *ᴘʀᴇғɪx ᴅɪɢᴀɴᴛɪ*\n\n`
            
            if (newPrefixes.length > 0) {
                replyText += `> New prefixes: \`${newPrefixes.join('` `')}\`\n`
            }
            
            if (hasNoprefix) {
                replyText += `> *Noprefix: Aktif* (bisa ketik command langsung)\n`
            }
            
            replyText += `\n*Semua prefix aktif:*\n`
            replyText += `> \`${getAllPrefixes().join('` `')}\``
            if (data.noprefix) replyText += `\n> + *noprefix* aktif`
            
            m.reply(replyText)
            break
        }
        
        case 'delprefix': {
            if (args.length === 0) {
                return m.reply(
                    `🗑️ *ᴅᴇʟᴇᴛᴇ ᴘʀᴇғɪx*\n\n` +
                    `> Hapus prefix dari database\n\n` +
                    `*Format:*\n` +
                    `> \`${m.prefix}delprefix <prefix1> <prefix2> ...\`\n\n` +
                    `*Contoh:*\n` +
                    `> \`${m.prefix}delprefix ! $\`\n` +
                    `> \`${m.prefix}delprefix <noprefix>\` - Nonaktifkan noprefix`
                )
            }
            
            if (args.includes('<noprefix>') || args.includes('noprefix')) {
                data.noprefix = false
                savePrefixes(data)
                return m.reply(`✅ *ɴᴏᴘʀᴇғɪx ᴅɪɴᴏɴᴀᴋᴛɪғᴋᴀɴ*`)
            }
            
            const toDelete = args
            const deleted = []
            
            data.prefixes = data.prefixes.filter(p => {
                if (toDelete.includes(p)) {
                    deleted.push(p)
                    return false
                }
                return true
            })
            
            savePrefixes(data)
            
            m.reply(
                `✅ *ᴘʀᴇғɪx ᴅɪʜᴀᴘᴜs*\n\n` +
                `> Deleted: \`${deleted.length > 0 ? deleted.join('` `') : 'None'}\`\n\n` +
                `*Semua prefix aktif:*\n` +
                `> \`${getAllPrefixes().join('` `')}\`` +
                `${data.noprefix ? '\n> + *noprefix* aktif' : ''}`
            )
            break
        }
        
        case 'listprefix': {
            const all = getAllPrefixes()
            const configPref = config.command?.prefix || '.'
            
            let text = `📋 *ʟɪsᴛ ᴘʀᴇғɪx*\n\n`
            text += `╭┈┈⬡「 ⚙️ *ᴄᴏɴғɪɢ* 」\n`
            text += `┃ Default: \`${configPref}\`\n`
            text += `┃ Noprefix: ${data.noprefix ? '✅ Aktif' : '❌ Nonaktif'}\n`
            text += `╰┈┈┈┈┈┈┈┈⬡\n\n`
            
            if (data.prefixes.length > 0) {
                text += `╭┈┈⬡「 📁 *ᴅᴀᴛᴀʙᴀsᴇ* 」\n`
                data.prefixes.forEach((p, i) => {
                    text += `┃ ${i + 1}. \`${p}\`\n`
                })
                text += `╰┈┈┈┈┈┈┈┈⬡\n\n`
            }
            
            text += `*Total prefix aktif:* ${all.length}`
            if (data.noprefix) text += ` + noprefix`
            text += `\n> \`${all.join('` `')}\``
            
            m.reply(text)
            break
        }
        
        case 'resetprefix': {
            data.prefixes = []
            data.noprefix = false
            savePrefixes(data)
            
            m.reply(
                `✅ *ᴘʀᴇғɪx ᴅɪʀᴇsᴇᴛ*\n\n` +
                `> Semua prefix di database dihapus!\n` +
                `> Noprefix dinonaktifkan!\n` +
                `> Hanya tersisa prefix dari config.js\n\n` +
                `*Prefix aktif:* \`${config.command?.prefix || '.'}\``
            )
            break
        }
    }
}

export { pluginConfig as config, handler, getAllPrefixes, loadPrefixes, savePrefixes, isNoPrefix }