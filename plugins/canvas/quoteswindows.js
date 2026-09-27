/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

/**
‎✧ Name   : quotes windows 
‎✧ Creator   : Rin imup lucu🤤
‎✧ Category : Canvas
‎✧ Link fitur : https://whatsapp.com/channel/RIMURU_CHANNEL
‎✧ *Note* : Jangan hapus wm ya ,btw ini masih bablas text nya tinggal sesuaikan aja sendiri 🤭
‎**/

import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import { writeFile, mkdir, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import axios from 'axios';

const pluginConfig = {
    name: 'quoteswindows',
    alias: ['wq', 'qwindows'],
    category: 'canvas',
    description: 'Buat meme quotes bergaya Windows',
    usage: '.wq <text>',
    example: '.wq just friend kok manggil sayang dan cemburu',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true
}

async function handler(m, { sock }) {
    const text = m.text?.trim()

    if (!text) {
        return m.reply(`*Format salah!*\n\nContoh penggunaan:\n${m.prefix}${m.command} just friend kok manggil sayang dan cemburu`)
    }

    const BG_URL = 'https://raw.githubusercontent.com/ryyntwx/allimagerin/refs/heads/main/wdws.png';

    try {
        await m.reply("⏳ Memproses pembuatan gambar...");

        const ASSETS_DIR = join(process.cwd(), 'assets', 'wdws_meme');
        const FONTS_DIR = join(ASSETS_DIR, 'fonts');
        const BG_LOCAL = join(ASSETS_DIR, 'template_wdws.png');
        const TMP_DIR = join(process.cwd(), 'tmp');

        await mkdir(FONTS_DIR, { recursive: true });
        await mkdir(TMP_DIR, { recursive: true });

        const fontConfigs = [
            { url: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hiJ-Ek-_EeA.woff2', name: 'Inter-Bold.ttf', family: 'InterBoldMeme' }
        ];

        for (const fc of fontConfigs) {
            const fPath = join(FONTS_DIR, fc.name);
            if (!existsSync(fPath)) {
                const fRes = await axios.get(fc.url, { responseType: 'arraybuffer', headers: { 'User-Agent': 'Mozilla/5.0' } });
                await writeFile(fPath, Buffer.from(fRes.data));
            }
            GlobalFonts.registerFromPath(fPath, fc.family);
        }

        if (!existsSync(BG_LOCAL)) {
            const res = await axios.get(BG_URL, { responseType: 'arraybuffer', headers: { 'User-Agent': 'Mozilla/5.0' } });
            await writeFile(BG_LOCAL, Buffer.from(res.data));
        }

        const bgImg = await loadImage(BG_LOCAL);
        const canvas = createCanvas(bgImg.width, bgImg.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

        const x = 127;
        const y = 406;
        const w = 450;
        const h = 601;
        let fSize = 150;
        const lHeight = 1.3;
        const rawText = text.trim();

        ctx.fillStyle = '#1c1d21';
        ctx.textBaseline = 'top';

        function getWrappedLines(context, textStr, maxWidth) {
            const words = textStr.split(/\s+/);
            const resLines = [];
            let currentLine = '';

            for (let i = 0; i < words.length; i++) {
                if (!words[i]) continue;
                let testLine = currentLine + words[i] + ' ';
                let metrics = context.measureText(testLine.trim());

                if (metrics.width > maxWidth && i > 0) {
                    resLines.push(currentLine.trim());
                    currentLine = words[i] + ' ';
                } else {
                    currentLine = testLine;
                }
            }
            if (currentLine.trim()) resLines.push(currentLine.trim());
            return resLines;
        }

        ctx.font = `700 ${fSize}px InterBoldMeme`;
        let lines = getWrappedLines(ctx, rawText, w);

        let totalTextHeight = lines.length * (fSize * lHeight);
        while (totalTextHeight > h && fSize > 24) {
            fSize -= 4;
            ctx.font = `700 ${fSize}px InterBoldMeme`;
            lines = getWrappedLines(ctx, rawText, w);
            totalTextHeight = lines.length * (fSize * lHeight);
        }

        let startY = y;
        if (totalTextHeight < h) {
            startY = y + (h - totalTextHeight) / 2;
        }

        const wordCount = rawText.split(/\s+/).filter(w => w.length > 0).length;

        lines.forEach((line, index) => {
            const currentY = startY + (index * (fSize * lHeight));

            if (currentY + fSize <= y + h) {
                if (wordCount === 1) {
                    ctx.textAlign = 'center';
                    ctx.fillText(line, x + (w / 2), currentY);
                } else {
                    ctx.textAlign = 'left';
                    ctx.fillText(line, x, currentY);
                }
            }
        });

        const outPath = join(TMP_DIR, `wdws-${Date.now()}.png`);
        await writeFile(outPath, await canvas.encode('png'));

        await sock.sendFile(m.chat, outPath, 'meme_wdws.png', `💬 *qoutes Windows done*\n\n"${rawText}"`, m);

        if (existsSync(outPath)) await unlink(outPath);

    } catch (err) {
        console.error(err);
        m.reply("❌ Terjadi kesalahan saat memproses gambar\n\n" + err.message);
    }
}

export { pluginConfig as config, handler }
