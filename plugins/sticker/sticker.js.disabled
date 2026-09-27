/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import config from '../../config.js'
import te from '../../src/lib/elaina-error.js'
const execAsync = promisify(exec)

const pluginConfig = {
    name: 'sticker',
    alias: ['s', 'stiker', 'stickergif'],
    category: 'sticker',
    description: 'Membuat sticker dari gambar/video dengan opsi crop/resize',
    usage: '.s [--crop] [--resize WxH] [--circle] [--rounded]',
    example: '.s --crop\n.s --resize 256x256\n.s --circle\n.s --rounded',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true
}

function parseOptions(args) {
    const options = {
        crop: false,
        resize: null,
        circle: false,
        rounded: false,
        packname: null,
        author: null
    }
    
    for (let i = 0; i < args.length; i++) {
        const arg = args[i]
        if (arg === '--crop' || arg === '-c') {
            options.crop = true
        } else if (arg === '--resize' || arg === '-r') {
            if (args[i + 1] && /^\d+x\d+$/i.test(args[i + 1])) {
                options.resize = args[i + 1]
                i++
            }
        } else if (arg === '--circle') {
            options.circle = true
        } else if (arg === '--rounded') {
            options.rounded = true
        } else if (!arg.startsWith('-') && !options.packname) {
            options.packname = arg
        } else if (!arg.startsWith('-') && options.packname && !options.author) {
            options.author = arg
        }
    }
    
    return options
}

async function processImage(inputPath, outputPath, options) {
    let filters = []
    
    if (options.resize) {
        const [width, height] = options.resize.split('x').map(Number)
        filters.push(`scale=${width}:${height}:force_original_aspect_ratio=decrease`)
        filters.push(`pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:color=0x00000000`)
    }
    
    if (options.crop) {
        filters.push(`crop='min(iw,ih)':'min(iw,ih)'`)
        filters.push(`scale=512:512`)
    }
    
    if (options.circle) {
        filters.push(`format=rgba`)
        filters.push(`geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='if(gt(pow(X-W/2,2)+pow(Y-H/2,2),pow(min(W,H)/2,2)),0,255)'`)
    }
    
    if (options.rounded) {
        const radius = 50
        filters.push(`format=rgba`)
        filters.push(`geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='if(lt(X,${radius})*lt(Y,${radius})*gt(pow(${radius}-X,2)+pow(${radius}-Y,2),pow(${radius},2)),0,if(gt(X,W-${radius})*lt(Y,${radius})*gt(pow(X-W+${radius},2)+pow(${radius}-Y,2),pow(${radius},2)),0,if(lt(X,${radius})*gt(Y,H-${radius})*gt(pow(${radius}-X,2)+pow(Y-H+${radius},2),pow(${radius},2)),0,if(gt(X,W-${radius})*gt(Y,H-${radius})*gt(pow(X-W+${radius},2)+pow(Y-H+${radius},2),pow(${radius},2)),0,255))))'`)
    }
    
    if (filters.length === 0) {
        fs.copyFileSync(inputPath, outputPath)
        return
    }
    
    const filterStr = filters.join(',')
    await execAsync(`ffmpeg -i "${inputPath}" -vf "${filterStr}" -y "${outputPath}"`)
}

async function processVideo(inputPath, outputPath, options) {
    let filters = []
    
    if (options.resize) {
        const [width, height] = options.resize.split('x').map(Number)
        filters.push(`scale=${width}:${height}:force_original_aspect_ratio=decrease`)
        filters.push(`pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:color=black`)
    }
    
    if (options.crop) {
        filters.push(`crop='min(iw,ih)':'min(iw,ih)'`)
        filters.push(`scale=512:512`)
    }
    
    if (filters.length === 0) {
        fs.copyFileSync(inputPath, outputPath)
        return
    }
    
    const filterStr = filters.join(',')
    await execAsync(`ffmpeg -i "${inputPath}" -vf "${filterStr}" -c:a copy -y "${outputPath}"`)
}

async function handler(m, { sock, config: botConfig }) {
    const isImage = m.isImage || (m.quoted && m.quoted.type === 'imageMessage')
    const isVideo = m.isVideo || (m.quoted && m.quoted.type === 'videoMessage')
    
    if (!isImage && !isVideo) {
        await m.reply(
            `🖼️ *sᴛɪᴄᴋᴇʀ ᴍᴀᴋᴇʀ*\n\n` +
            `Kirim/reply gambar atau video dengan caption:\n` +
            `\`${m.prefix}s\`\n\n` +
            `*ᴏᴘsɪ:*\n` +
            `> \`--crop\` - Crop jadi kotak\n` +
            `> \`--resize WxH\` - Resize ke ukuran\n` +
            `> \`--circle\` - Bentuk lingkaran\n` +
            `> \`--rounded\` - Sudut melengkung\n\n` +
            `*ᴄᴏɴᴛᴏʜ:*\n` +
            `> \`${m.prefix}s --crop\`\n` +
            `> \`${m.prefix}s --resize 256x256\`\n` +
            `> \`${m.prefix}s --circle\`\n` +
            `> \`${m.prefix}s PackName Author\``
        )
        return
    }
    
    await m.react('🕕')
    
    const options = parseOptions(m.args || [])
    
    try {
        let buffer
        if (m.quoted && m.quoted.isMedia) {
            buffer = await m.quoted.download()
        } else if (m.isMedia) {
            buffer = await m.download()
        }
        
        if (!buffer) {
            await m.reply('❌ Gagal mendownload media!')
            await m.react('❌')
            return
        }
        
        if (isVideo) {
            const tempDir = path.join(process.cwd(), 'temp')
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true })
            }
            
            const tempVideo = path.join(tempDir, `duration_check_${Date.now()}.mp4`)
            fs.writeFileSync(tempVideo, buffer)
            
            try {
                const { stdout } = await execAsync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${tempVideo}"`)
                const duration = parseFloat(stdout.trim())
                
                if (duration > 10) {
                    await m.reply(`❌ Video terlalu panjang!\n\n> Durasi: ${duration.toFixed(1)} detik\n> Maksimal: 10 detik`)
                    await m.react('☢')
                    if (fs.existsSync(tempVideo)) fs.unlinkSync(tempVideo)
                    return
                }
            } catch (e) {}
            
            if (fs.existsSync(tempVideo)) fs.unlinkSync(tempVideo)
        }
        
        const packname = options.packname || botConfig.sticker?.packname || botConfig.bot?.name || 'Rimuru-AI'
        const author = options.author || botConfig.sticker?.author || botConfig.owner?.name || 'Bot'
        
        const hasProcessing = options.crop || options.resize || options.circle || options.rounded
        
        if (hasProcessing) {
            const tempDir = path.join(process.cwd(), 'temp')
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true })
            }
            
            const ext = isVideo ? 'mp4' : 'png'
            const inputPath = path.join(tempDir, `sticker_in_${Date.now()}.${ext}`)
            const outputPath = path.join(tempDir, `sticker_out_${Date.now()}.${ext}`)
            
            fs.writeFileSync(inputPath, buffer)
            
            try {
                if (isImage) {
                    await processImage(inputPath, outputPath, options)
                } else if (isVideo) {
                    await processVideo(inputPath, outputPath, options)
                }
                buffer = fs.readFileSync(outputPath)
            } catch (e) {}
            
            if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath)
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath)
        }
        
        if (isImage) {
            await sock.sendImageAsSticker(m.chat, buffer, m, { packname, author })
        } else if (isVideo) {
            await sock.sendVideoAsSticker(m.chat, buffer, m, { packname, author })
        }
        
        await m.react('✅')
        
    } catch (error) {
        m.reply(te(m.prefix, m.command, m.pushName))
        await m.react('❌')
    }
}

export { pluginConfig as config, handler }