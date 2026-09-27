/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
const config = {
    name: 'nanoedit',
    alias: ['editimage', 'aiimage', 'hapusobjek', 'removeobject'],
    category: 'ai',
    description: 'Edit gambar dengan AI (hapus objek, ganti latar, dll)',
    usage: '.nanoedit <prompt> (reply gambar)',
    example: '.nanoedit hapus orang ini',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 45,
    energi: 5,
    isEnabled: true
}

function genserial() {
    let s = ''
    for (let i = 0; i < 32; i++) s += Math.floor(Math.random() * 16).toString(16)
    return s
}

async function nanoEditV1(imageBuffer, prompt) {
    const tempPath = path.join(process.cwd(), `temp_v1_${Date.now()}.jpg`)
    fs.writeFileSync(tempPath, imageBuffer)
    
    try {
        const filename = path.basename(tempPath)
        const form = new FormData()
        form.append('file_name', filename)
        
        const upRes = await axios.post('https://api.imgupscaler.ai/api/common/upload/upload-image', form, {
            headers: { ...form.getHeaders(), origin: 'https://imgupscaler.ai', referer: 'https://imgupscaler.ai/' },
            timeout: 30000
        })
        
        const uploadData = upRes.data.result
        const fileContent = fs.readFileSync(tempPath)
        
        await axios.put(uploadData.url, fileContent, {
            headers: { 'Content-Type': 'image/jpeg', 'Content-Length': fileContent.length },
            maxBodyLength: Infinity,
            timeout: 60000
        })
        
        const cdnUrl = 'https://cdn.imgupscaler.ai/' + uploadData.object_name
        const jobForm = new FormData()
        jobForm.append('model_name', 'magiceraser_v4')
        jobForm.append('original_image_url', cdnUrl)
        jobForm.append('prompt', prompt)
        jobForm.append('ratio', 'match_input_image')
        jobForm.append('output_format', 'jpg')
        
        const jobRes = await axios.post('https://api.magiceraser.org/api/magiceraser/v2/image-editor/create-job', jobForm, {
            headers: {
                ...jobForm.getHeaders(),
                'product-code': 'magiceraser',
                'product-serial': genserial(),
                origin: 'https://imgupscaler.ai',
                referer: 'https://imgupscaler.ai/'
            },
            timeout: 30000
        })
        
        const jobId = jobRes.data.result.job_id
        let result
        
        for (let i = 0; i < 30; i++) {
            await new Promise(r => setTimeout(r, 3000))
            
            const checkRes = await axios.get(`https://api.magiceraser.org/api/magiceraser/v1/ai-remove/get-job/${jobId}`, {
                headers: { origin: 'https://imgupscaler.ai', referer: 'https://imgupscaler.ai/' },
                timeout: 15000
            })
            
            result = checkRes.data
            if (result.code !== 300006) break
        }
        
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath)
        
        if (result?.result?.output_url?.[0]) {
            return result.result.output_url[0]
        }
        throw new Error('No output URL')
        
    } catch (e) {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath)
        throw e
    }
}

async function nanoEditV2(buffer, prompt) {
    const headers = { 'Product-Code': '067003', 'Product-Serial': 'vj6o8n' }
    const form = new FormData()
    form.append('model_name', 'seedream')
    form.append('edit_type', 'style_transfer')
    form.append('prompt', prompt)
    form.append('target_images', Readable.from(buffer), { filename: 'input.jpg', contentType: 'image/jpeg' })
    
    const { data } = await axios.post('https://api.photoeditorai.io/pe/photo-editor/create-job', form, {
        headers: { ...form.getHeaders(), ...headers },
        timeout: 30000
    })
    
    const jobId = data.result.job_id
    
    for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 2500))
        
        const { data: statusData } = await axios.get(`https://api.photoeditorai.io/pe/photo-editor/get-job/${jobId}`, {
            headers,
            timeout: 15000
        })
        
        if (statusData.result?.status === 2 && statusData.result?.output?.length) {
            return statusData.result.output[0]
        }
    }
    
    throw new Error('Timeout waiting for result')
}

async function nanoEdit(inputBuffer, prompt) {
    try {
        return await nanoEditV1(inputBuffer, prompt)
    } catch (e) {
        try {
            return await nanoEditV2(inputBuffer, prompt)
        } catch (err2) {
            throw new Error(`Edit failed: ${err2.message}`)
        }
    }
}

async function handler(m, { sock }) {
    const prompt = m.text?.trim()
    
    if (!prompt) {
        return m.reply(`🎨 *ɴᴀɴᴏᴇᴅɪᴛ - ᴀɪ ɪᴍᴀɢᴇ ᴇᴅɪᴛᴏʀ*\n\n> Edit gambar dengan AI (hapus objek, ganti latar, ubah gaya)\n\n> Contoh:\n> • .nanoedit hapus orang ini (reply gambar)\n> • .nanoedit ubah jadi anime (reply gambar)\n> • .nanoedit ganti background pantai\n\n📝 *Prompt ideas:*\n> • hapus objek ini\n> • ganti background jadi langit malam\n> • ubah gaya jadi lukisan\n> • tambahkan kucing di sini`)
    }
    
    if (!m.quoted || !m.quoted.message?.imageMessage) {
        return m.reply(`🖼️ *ᴇᴅɪᴛ ɢᴀᴍʙᴀʀ*\n\n> Reply gambar yang ingin diedit!\n\n> Contoh: reply gambar lalu ketik .nanoedit hapus objek ini`)
    }
    
    await m.reply(`⏳ *Memproses gambar...*\n> 📝 Prompt: "${prompt}"\n> 🕐 Ini mungkin memakan waktu 30-60 detik, Darling~`)
    
    try {
        const media = await m.quoted.download()
        
        if (media.length > 10 * 1024 * 1024) {
            return m.reply(`❌ *GAMBAR TERLALU BESAR*\n\n> Maksimal ukuran gambar 10MB.\n> Ukuran: ${(media.length / 1024 / 1024).toFixed(2)} MB`)
        }
        
        const resultUrl = await nanoEdit(media, prompt)
        
        if (resultUrl) {
            await sock.sendMessage(m.chat, {
                image: { url: resultUrl },
                caption: `✅ *ɴᴀɴᴏᴇᴅɪᴛ ꜱᴇʟᴇꜱᴀɪ!*\n\n📝 Prompt: *${prompt}*\n🔗 URL: ${resultUrl}`
            })
        } else {
            await m.reply(`❌ *GAGAL MENGEDIT GAMBAR*\n\n> Coba lagi nanti dengan prompt yang berbeda, Darling~`)
        }
        
    } catch (error) {
        console.error('NanoEdit Error:', error)
        await m.reply(`❌ *ERROR*\n\n> ${error.message}\n> Coba lagi nanti atau gunakan prompt yang lebih sederhana, Darling~`)
    }
}
export { config, handler };