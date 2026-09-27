/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

/***
  @ Base: https://play.google.com/store/apps/details?id=com.app.aiimglarger
  @ Author: Shannz (Adapted for WA Bot)
  @ Note: Upscale, Retouch, and Sharpen image via Enlargerai (PhotoAI/ImgLarger).
***/

import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import crypto from 'crypto';
import { Buffer } from 'buffer';

const CONFIG = {
    BASE_URL: "https://photoai.imglarger.com/api/PhoAi",
    HEADERS: {
        'User-Agent': 'Dart/3.9 (dart:io)',
        'Accept-Encoding': 'gzip'
    }
};

const generateRandomUser = () => `${crypto.randomBytes(8).toString('hex')}_aiimglarger`;

const prepareFile = async (input) => {
    if (Buffer.isBuffer(input)) return input;
    if (typeof input === 'string') {
        if (input.startsWith('http')) {
            const res = await axios.get(input, { responseType: 'arraybuffer' });
            return Buffer.from(res.data);
        }
        if (fs.existsSync(input)) return fs.readFileSync(input);
    }
    return null;
};

const pollStatus = async (code, type) => {
    const maxAttempts = 20;
    let attempts = 0;

    while (attempts < maxAttempts) {
        try {
            const { data } = await axios.post(`${CONFIG.BASE_URL}/CheckStatus`, {
                code: code,
                type: parseInt(type),
                username: generateRandomUser()
            }, {
                headers: { ...CONFIG.HEADERS, 'Content-Type': 'application/json;charset=UTF-8' }
            });

            if (data.data?.status === 'success') {
                return { success: true, url: data.data.downloadUrls[0], data: data.data };
            }

            if (data.data?.status === 'failed') {
                return { success: false, msg: 'Processing failed on server' };
            }

            await new Promise(resolve => setTimeout(resolve, 3000));
            attempts++;
        } catch (e) {
            return { success: false, msg: e.message };
        }
    }
    return { success: false, msg: 'Timeout' };
};

const enlargerai = {
    upscale: async (imageInput, scale = '4') => {
        try {
            const file = await prepareFile(imageInput);
            if (!file) return { success: false, msg: 'File gambar tidak valid' };

            const form = new FormData();
            form.append('type', '0');
            form.append('username', generateRandomUser());
            form.append('scaleRadio', scale.toString());
            form.append('file', file, { filename: 'image.jpg', contentType: 'image/jpeg' });

            const { data } = await axios.post(`${CONFIG.BASE_URL}/Upload`, form, {
                headers: { ...CONFIG.HEADERS, ...form.getHeaders() }
            });

            if (data.code === 200 && data.data) {
                return await pollStatus(data.data, 0);
            }
            return { success: false, msg: data.msg || 'Upload failed' };
        } catch (error) {
            return { success: false, msg: error.message };
        }
    },

    retouch: async (imageInput) => {
        try {
            const file = await prepareFile(imageInput);
            if (!file) return { success: false, msg: 'File gambar tidak valid' };

            const form = new FormData();
            form.append('type', '3');
            form.append('username', generateRandomUser());
            form.append('file', file, { filename: 'image.jpg', contentType: 'image/jpeg' });

            const { data } = await axios.post(`${CONFIG.BASE_URL}/Upload`, form, {
                headers: { ...CONFIG.HEADERS, ...form.getHeaders() }
            });

            if (data.code === 200 && data.data) {
                return await pollStatus(data.data, 3);
            }
            return { success: false, msg: data.msg || 'Upload failed' };
        } catch (error) {
            return { success: false, msg: error.message };
        }
    },

    sharpen: async (imageInput) => {
        try {
            const file = await prepareFile(imageInput);
            if (!file) return { success: false, msg: 'File gambar tidak valid' };

            const form = new FormData();
            form.append('type', '1');
            form.append('username', generateRandomUser());
            form.append('file', file, { filename: 'image.jpg', contentType: 'image/jpeg' });

            const { data } = await axios.post(`${CONFIG.BASE_URL}/Upload`, form, {
                headers: { ...CONFIG.HEADERS, ...form.getHeaders() }
            });

            if (data.code === 200 && data.data) {
                return await pollStatus(data.data, 1);
            }
            return { success: false, msg: data.msg || 'Upload failed' };
        } catch (error) {
            return { success: false, msg: error.message };
        }
    }
};

const pluginConfig = {
    name: 'enlargerai',
    alias: ['enlargeraiphotos', 'enlarger'],
    category: 'tools',
    description: 'Meningkatkan kualitas gambar (HD, Retouch, Sharpen) dengan Enlargerai',
    usage: '.enlargerai [mode] [reply/kirim gambar]',
    example: '.enlargerai upscale',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true
};

async function handler(m, { command, text, prefix }) {
    const pfx = prefix || m.prefix || '.';

    // Deteksi media gambar dari pesan langsung atau quote/reply
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || '';

    if (!/image\/(jpe?g|png|webp)/.test(mime)) {
        if (m.react) await m.react('❌');
        return m.reply(
            `🖼️ *ENLARGERAI TOOLKIT*\n\n` +
            `Kirim atau reply gambar dengan perintah berikut:\n` +
            `• \`${pfx}enlargerai\` atau \`${pfx}enlargerai upscale\` - Tingkatkan Resolusi (4x HD)\n` +
            `• \`${pfx}enlargerai retouch\` - Perhalus & Perbaiki Wajah\n` +
            `• \`${pfx}enlargerai sharpen\` - Tajamkan Gambar Buram`
        );
    }

    if (m.react) await m.react('⏳');

    try {
        const mediaBuffer = await q.download();
        if (!mediaBuffer) {
            if (m.react) await m.react('❌');
            return m.reply('❌ Gagal mengunduh media gambar dari WhatsApp.');
        }

        let res;
        const subCommand = text.trim().toLowerCase();

        if (subCommand === 'retouch') {
            res = await enlargerai.retouch(mediaBuffer);
        } else if (subCommand === 'sharpen' || subCommand === 'unblur') {
            res = await enlargerai.sharpen(mediaBuffer);
        } else {
            // Default: upscale HD (4x)
            res = await enlargerai.upscale(mediaBuffer, '4');
        }

        if (!res || !res.success || !res.url) {
            if (m.react) await m.react('❌');
            return m.reply(`❌ *Proses Gagal:* ${res?.msg || 'Terjadi kesalahan pada server Enlargerai.'}`);
        }

        if (m.react) await m.react('✅');

        // Pengiriman balasan gambar HD
        if (m.pluginMediaReply) {
            return await m.pluginMediaReply(res.url, '✨ *Berhasil ditingkatkan oleh Enlargerai!*');
        } else {
            return await m.reply({ image: { url: res.url }, caption: '✨ *Berhasil ditingkatkan oleh Enlargerai!*' });
        }

    } catch (error) {
        console.error('Enlargerai Plugin Error:', error);
        if (m.react) await m.react('❌');
        return m.reply('❌ *Terjadi Kesalahan*\n\n> ' + (error.message || error));
    }
}

export { enlargerai, pluginConfig as config, handler };
export default handler;
