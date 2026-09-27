/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
import FormData from 'form-data';

const pluginConfig = {
    name: 'nanobananapro',
    alias: ['nanopro'],
    category: 'ai',
    description: 'Edit gambar dengan Nano Banana Pro dari source CANTARELLA',
    usage: '.nanobananapro <prompt> (reply gambar)',
    example: '.nanobananapro ubah jadi sketsa pensil',
    isOwner: false,
    isPremium: true,
    isGroup: false,
    isPrivate: false,
    cooldown: 30,
    energi: 2,
    isEnabled: true,
};

async function handler(m, { sock, text }) {
    if (!text?.trim()) return m.reply(`❌ Masukkan prompt. Contoh: ${m.prefix}nanobananapro ubah jadi sketsa pensil`);

    const q = m.quoted;
    const mime = q?.mimetype || q?.msg?.mimetype || '';
    if (!q || !/^image\//i.test(mime)) {
        return m.reply(`❌ Reply gambar dengan caption ${m.prefix}nanobananapro <prompt>`);
    }

    await m.react('⏳');
    let tempPath = null;
    try {
        const buffer = await q.download();
        if (!buffer?.length) throw new Error('Gagal mengunduh gambar');

        const form = new FormData();
        form.append('files[]', buffer, { filename: 'input.jpg', contentType: mime || 'image/jpeg' });
        const upload = await axios.post('https://uguu.se/upload.php', form, {
            headers: form.getHeaders(),
            timeout: 30000,
        });
        const imageUrl = upload.data?.files?.[0]?.url;
        if (!imageUrl) throw new Error('Upload gambar gagal');

        const apiUrl = `https://api-faa.my.id/faa/nano-banana?url=${encodeURIComponent(imageUrl)}&prompt=${encodeURIComponent(text.trim())}`;
        const result = await axios.get(apiUrl, {
            responseType: 'arraybuffer',
            timeout: 120000,
        });

        await sock.sendMessage(m.chat, {
            image: Buffer.from(result.data),
            caption: `✅ *NANO BANANA PRO*\n\n📝 Prompt: ${text.trim()}`,
        }, { quoted: m });
        await m.react('✅');
    } catch (error) {
        await m.react('❌').catch(() => {});
        return m.reply(`❌ Nano Banana Pro gagal: ${error?.response?.status ? `HTTP ${error.response.status}` : (error?.message || 'unknown error')}`);
    } finally {
        if (tempPath) {
            // Kept intentionally empty: current uploader uses memory buffer only.
        }
    }
}

export { pluginConfig as config, handler };
