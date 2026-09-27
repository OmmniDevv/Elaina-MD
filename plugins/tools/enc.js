/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import JavaScriptObfuscator from 'javascript-obfuscator';
import config from '../../config.js';
const pluginConfig = {
    name: 'encrypt',
    alias: ['enc', 'obfuscate', 'enccode'],
    category: 'tools',
    description: 'Enkripsi / Obfuscate kode JavaScript',
    usage: '.encrypt (reply file/code)',
    example: '.encrypt',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true
}

async function encryptCode(code) {
    const options = {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.75,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.4,
        debugProtection: false,
        debugProtectionInterval: false,
        disableConsoleOutput: false,
        identifierNamesGenerator: 'hexadecimal',
        log: false,
        numbersToExpressions: true,
        renameGlobals: false,
        selfDefending: true,
        simplify: true,
        splitStrings: true,
        splitStringsChunkLength: 10,
        stringArray: true,
        stringArrayCallsTransform: true,
        stringArrayCallsTransformThreshold: 0.75,
        stringArrayEncoding: ['none'],
        stringArrayIndexShift: true,
        stringArrayRotate: true,
        stringArrayShuffle: true,
        stringArrayWrappersCount: 1,
        stringArrayWrappersChainedCalls: true,
        stringArrayWrappersParametersMaxCount: 2,
        stringArrayWrappersType: 'variable',
        stringArrayThreshold: 0.75,
        transformObjectKeys: true,
        unicodeEscapeSequence: false
    }
    
    const obfuscationResult = JavaScriptObfuscator.obfuscate(code, options)
    return obfuscationResult.getObfuscatedCode()
}

async function handler(m, { sock }) {
    const quoted = m.quoted
    
    if (!quoted) {
        return m.reply(
            `💕 *ᴇɴᴄʀʏᴘᴛ ᴄᴏᴅᴇ* 💕\n\n` +
            `╭━━━━━━━━━━━━━━━━━━━━━⬣\n` +
            `┃ ✦ *Cara Pakai*\n` +
            `┃\n` +
            `┃   Reply kode JavaScript yang mau dienkripsi\n` +
            `┃   dengan caption \`.encrypt\`\n` +
            `┃\n` +
            `┃ ✦ *Contoh*\n` +
            `┃\n` +
            `┃   const nama = 'Darling';\n` +
            `┃   console.log(nama);\n` +
            `┃\n` +
            `┃   (lalu reply dengan .encrypt)\n` +
            `┃\n` +
            `┃ 💗 *Rimuru:* Mau enkripsi kode apa darling~?\n` +
            `╰━━━━━━━━━━━━━━━━━━━━━⬣`
        )
    }
    
    // Ambil teks dari quoted message
    let code = quoted.text || quoted.body || ''
    
    if (!code || code.length < 10) {
        return m.reply(`❌ *ᴇʀʀᴏʀ*\n\n> Kode terlalu pendek atau tidak valid darling~`)
    }
    
    m.react('🔒')
    await m.reply(`⏳ *ᴇɴᴄʀʏᴘᴛɪɴɢ...*\n\n💗 *Rimuru:* Lagi mengenkripsi kode darling~ tunggu sebentar yaa 🔐`)
    
    try {
        const encrypted = await encryptCode(code)
        
        // Kirim sebagai file biar gak kepanjangan
        const buffer = Buffer.from(encrypted, 'utf8')
        const fileName = `encrypted_${Date.now()}.js`
        
        await sock.sendMessage(m.chat, {
            document: buffer,
            mimetype: 'application/javascript',
            fileName: fileName,
            caption: `✅ *ᴇɴᴄʀʏᴘᴛɪᴏɴ sᴜᴄᴄᴇss*\n\n` +
                    `╭━━━━━━━━━━━━━━━━━━━━━⬣\n` +
                    `┃ 📦 *sɪᴢᴇ*: ${(encrypted.length / 1024).toFixed(2)} KB\n` +
                    `┃ 📝 *ᴛʏᴘᴇ*: JavaScript Obfuscated\n` +
                    `┃\n` +
                    `┃ 💗 *Rimuru:* Ini kode terenkripsinya darling~ 🔒\n` +
                    `╰━━━━━━━━━━━━━━━━━━━━━⬣`
        }, { quoted: m })
        
        m.react('✅')
        
    } catch (err) {
        console.error('[Encrypt] Error:', err)
        m.react('💔')
        return m.reply(
            `💔 *ᴇʀʀᴏʀ*\n\n` +
            `> ${err.message}\n\n` +
            `> Coba lagi ya darling~ 🥺`
        )
    }
}

export { pluginConfig as config, handler };
