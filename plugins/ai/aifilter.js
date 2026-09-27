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
    name: 'aifilter',
    alias: ['filterai', 'filterreaction', 'filter-reaction', 'reactionfilter'],
    category: 'ai',
    description: 'AI image filter dan perubahan ekspresi wajah, diadaptasi dari CANTARELLA',
    usage: '.aifilter <style> (reply gambar) / .filterreaction <expression> (reply gambar)',
    example: '.aifilter anime',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 30,
    energi: 2,
    isEnabled: true,
};

const DEFAULT_HEADERS = {
    origin: 'https://pixnova.ai',
    referer: 'https://pixnova.ai/app/ai-filter/?style=105',
    'theme-version': '83EmcUoQTUv50LhNx0VrdcK8rcGexcP35FcZDcpgWsAXEyO4xqL5shCY6sFIWB2Q',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    accept: 'application/json, text/plain, */*',
};

async function pixnovaFilter(buffer, style) {
    const form = new FormData();
    form.append('file', buffer, { filename: 'image.jpg', contentType: 'image/jpeg' });
    form.append('fn_name', 'demo-image2image-series');
    form.append('call_type', 1);
    form.append('request_from', '2');
    form.append('origin_from', '111977c0d5def647');

    const headers = { ...DEFAULT_HEADERS, ...form.getHeaders() };
    const upload = await axios.post('https://api.pixnova.ai/aitools/upload-img', form, {
        headers,
        timeout: 60000,
    });
    const sourceImage = upload.data?.data?.path;
    if (!sourceImage) throw new Error('Upload gambar ke PixNova gagal');

    const task = await axios.post('https://api.pixnova.ai/aitools/rp/create', {
        fn_name: 'demo-image2image-series',
        call_type: 1,
        input: {
            source_image: sourceImage,
            prompt: style ? `(masterpiece), best quality, ${style}` : '(masterpiece), best quality',
            negative_prompt: '(worst quality, low quality:1.4), (greyscale, monochrome:1.1), cropped, lowres, username, blurry, trademark, watermark',
            request_from: 2,
        },
        request_from: 2,
        origin_from: '111977c0d5def647',
    }, {
        headers: { ...headers, 'content-type': 'application/json' },
        timeout: 60000,
    });
    const taskId = task.data?.data?.task_id;
    if (!taskId) throw new Error('Task AI filter tidak dibuat');

    for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 2000));
        const check = await axios.post('https://api.pixnova.ai/aitools/rp/check-status', {
            task_id: taskId,
            style_name: style || 'anime',
            fn_name: 'demo-image2image-series',
            call_type: 3,
            request_from: 2,
            origin_from: '111977c0d5def647',
        }, {
            headers: { ...headers, 'content-type': 'application/json' },
            timeout: 30000,
        });
        const data = check.data?.data;
        if (data?.status === 2 && data?.result_image) {
            const url = data.result_image.startsWith('http') ? data.result_image : `https://oss-global.pixnova.ai/${data.result_image}`;
            const result = await axios.get(url, { responseType: 'arraybuffer', timeout: 60000 });
            return Buffer.from(result.data);
        }
        if (data?.status === 3) throw new Error('PixNova gagal memproses gambar');
    }
    throw new Error('Timeout menunggu hasil AI filter');
}

async function nanoExpression(buffer, expression) {
    const prompt = `change facial expression to look ${expression}, realistic face expression change, keep original person identity`;
    const upload = new FormData();
    upload.append('file', buffer, { filename: 'image.jpg', contentType: 'image/jpeg' });
    const uploaded = await axios.post('https://uguu.se/upload.php', upload, {
        headers: upload.getHeaders(),
        timeout: 30000,
    });
    const imageUrl = uploaded.data?.files?.[0]?.url;
    if (!imageUrl) throw new Error('Upload gambar gagal');

    const result = await axios.get(
        `https://api-faa.my.id/faa/nano-banana?url=${encodeURIComponent(imageUrl)}&prompt=${encodeURIComponent(prompt)}`,
        { responseType: 'arraybuffer', timeout: 120000 },
    );
    return Buffer.from(result.data);
}

async function handler(m, { sock, text }) {
    const q = m.quoted;
    const mime = q?.mimetype || q?.msg?.mimetype || '';
    if (!q || !/^image\//i.test(mime)) return m.reply(`❌ Reply gambar dengan ${m.prefix}${m.command} <opsi>`);

    const input = (text || '').trim();
    const command = (m.command || '').toLowerCase();
    const isReaction = ['filterreaction', 'reactionfilter'].includes(command);
    const value = input || (isReaction ? 'happy' : 'anime');
    await m.react('⏳');

    try {
        const buffer = await q.download();
        if (!buffer?.length) throw new Error('Gagal mengunduh gambar');
        const output = isReaction ? await nanoExpression(buffer, value) : await pixnovaFilter(buffer, value);
        await sock.sendMessage(m.chat, {
            image: output,
            caption: `✅ *${isReaction ? 'FILTER REACTION' : 'AI FILTER'}*\n\n🎨 ${value}`,
        }, { quoted: m });
        await m.react('✅');
    } catch (error) {
        await m.react('❌').catch(() => {});
        return m.reply(`❌ Gagal: ${error?.message || 'Terjadi kesalahan'}`);
    }
}

export { pluginConfig as config, handler };
