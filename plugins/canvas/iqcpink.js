/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const pluginConfig = {
    name: "iqcpink",
    alias: [],
    category: "canvas",
    description: "Membuat Fake Quote iOS style versi pink.",
    usage: ".iqcpink [text/reply]",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 2,
    isEnabled: true,
};

let fontsLoaded = false;
const BG_URL   = "https://files.catbox.moe/2fsv03.png";
let bgImgBuffer = null;

const INTER_FONTS = [
    { url: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2', file: 'Inter-Regular.ttf' },
    { url: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hiJ-Ek-_EeA.woff2', file: 'Inter-Medium.ttf'  },
    { url: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hiJ-Ek-_EeA.woff2', file: 'Inter-SemiBold.ttf' },
];

const APPLE_EMOJI_JSON_URL   = 'https://media.githubusercontent.com/media/Ditzzx-vibecoder/entahlah/main/emoji-apple.json';

const BG_W = 906;
const BG_H = 1736;
const SX = BG_W / 1080;
const SY = BG_H / 2280;

const state = {
    text: "Kesendirian adalah teman terbaik ku😂😂",
    time: "22.54",
    bubbleColor:  "#ffc5d5", 
    textColor:    "#111111",
    timeColor:    "#5e4146", 
    tickColor:    "#8c1d2c",
    fontSize:     Math.round(45  * SX), 
    bubbleWidth:  Math.round(746 * SX),
    showReaction: true,
    emojiSize:    Math.round(90  * SX),
    emojiSpacing: Math.round(110 * SX),
    emojiXOffset: Math.round(15  * SX),
    emojiYOffset: -15,
    reactionScale: 1.0,
    emojis: ["👍", "❤️", "😂", "😮", "😢", "🙏"],
    offsetX: 20,
    offsetY: 0,
};

let appleEmojiMap = null;

async function downloadFile(url) {
    const axios = (await import('axios')).default;
    const res = await axios.get(url, {
        responseType: 'arraybuffer',
        headers: { 'User-Agent': 'Mozilla/5.0' },
        maxRedirects: 5,
    });
    return Buffer.from(res.data);
}

function emojiToUnicode(emoji) {
    return [...emoji].map(c => c.codePointAt(0).toString(16)).join('-');
}

async function loadAppleEmojiMap() {
    if (appleEmojiMap) return appleEmojiMap;
    const buf = await downloadFile(APPLE_EMOJI_JSON_URL);
    appleEmojiMap = JSON.parse(buf.toString('utf-8'));
    return appleEmojiMap;
}

async function drawAppleEmoji(ctx, emoji, x, y, size) {
    const map = await loadAppleEmojiMap();
    const base = emojiToUnicode(emoji);
    const variants = [
        base,
        base.replace(/-fe0f/g, ''),
        base.toUpperCase(),
        base.replace(/-fe0f/g, '').toUpperCase(),
    ];
    let b64 = null;
    for (const v of variants) {
        if (map[v]) { b64 = map[v]; break; }
    }
    if (!b64) {
        ctx.fillText(emoji, x, y);
        return;
    }
    const buf = Buffer.from(b64, 'base64');
    const img = await loadImage(buf);
    ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
}

async function ensureAssets() {
    if (!fontsLoaded) {
        for (const f of INTER_FONTS) {
            const buf = await downloadFile(f.url);
            GlobalFonts.register(buf, 'Inter');
        }
        fontsLoaded = true;
    }

    await loadAppleEmojiMap();

    if (!bgImgBuffer) {
        bgImgBuffer = await downloadFile(BG_URL);
    }
}

function drawRoundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

function measureTextCustom(ctx, text, fontSize) {
    const parts = text.split(/(\p{Extended_Pictographic})/gu);
    let totalWidth = 0;
    for (const part of parts) {
        if (!part) continue;
        if (/\p{Extended_Pictographic}/u.test(part)) {
            totalWidth += fontSize * 1.05; 
        } else {
            totalWidth += ctx.measureText(part).width;
        }
    }
    return totalWidth;
}

async function drawTextWithEmojis(ctx, text, x, y, fontSize) {
    const parts = text.split(/(\p{Extended_Pictographic})/gu);
    let currentX = x;
    
    for (const part of parts) {
        if (!part) continue;
        if (/\p{Extended_Pictographic}/u.test(part)) {
            const emojiSize = fontSize * 1.05;
            const emojiCX = currentX + emojiSize / 2;
            const emojiCY = y; 
            await drawAppleEmoji(ctx, part, emojiCX, emojiCY, emojiSize);
            currentX += emojiSize;
        } else {
            ctx.fillText(part, currentX, y);
            currentX += ctx.measureText(part).width;
        }
    }
}

function wrapText(ctx, text, maxWidth, fontSize) {
    ctx.font = `500 ${fontSize}px Inter`;
    const words = text.split(" ");
    const lines = [];
    let cur = "";
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (word.includes('\n')) {
            const parts = word.split('\n');
            for (let j = 0; j < parts.length; j++) {
                const test = cur + (cur ? " " : "") + parts[j];
                if (measureTextCustom(ctx, test, fontSize) > maxWidth && cur) {
                    lines.push(cur); cur = parts[j];
                } else { cur = test; }
                if (j < parts.length - 1) { lines.push(cur); cur = ""; }
            }
            continue;
        }
        const test = cur + (cur ? " " : "") + word;
        if (measureTextCustom(ctx, test, fontSize) > maxWidth && i > 0) {
            lines.push(cur); cur = word;
        } else { cur = test; }
    }
    if (cur) lines.push(cur);
    return lines;
}

async function render(text, time, imgUrl, outputPath) {
    await ensureAssets();

    const s = { ...state, text: text ?? state.text, time: time ?? state.time };

    let imgObj = null;
    if (imgUrl) {
        imgObj = await loadImage(imgUrl);
    }

    const canvas = createCanvas(BG_W, BG_H);
    const ctx    = canvas.getContext('2d');

    const bgImg = await loadImage(bgImgBuffer);
    ctx.drawImage(bgImg, 0, 0, BG_W, BG_H);

    const rightPadding   = Math.round(80  * SX);
    const textPaddingX   = Math.round(36  * SX);
    const paddingTop     = Math.round(28  * SY);
    const paddingBottom  = Math.round(28  * SY);
    const bRadius        = Math.round(32  * SX);
    const menuTopBorderY = Math.round(1276 * SY);
    const timeFontSize   = Math.round(23  * SX);

    ctx.font = `600 ${timeFontSize}px Inter`;
    const timeMetrics    = ctx.measureText(s.time);
    const ticksWidth     = Math.round(34 * SX);
    const timestampWidth = timeMetrics.width + ticksWidth + Math.round(12 * SX);
    const timestampHeight = timeFontSize;

    const textLimitW = s.bubbleWidth - (textPaddingX * 2);
    ctx.font = `500 ${s.fontSize}px Inter`;
    let textLines = [];
    if (s.text) textLines = wrapText(ctx, s.text, textLimitW, s.fontSize);

    const lineWidths = textLines.map(line => measureTextCustom(ctx, line, s.fontSize));
    const maxLineWidth = Math.max(...lineWidths, 0);

    let bubbleActualW = 0;
    let timestampOnNewRow = false;
    const minBubbleW = Math.round(280 * SX);

    let imgDrawH = 0;
    if (imgObj) {
        const imgAspect = imgObj.width / imgObj.height;
        bubbleActualW = Math.min(Math.max(imgObj.width, minBubbleW), s.bubbleWidth);
        if (s.text && textLines.length > 0) {
            bubbleActualW = Math.max(bubbleActualW, maxLineWidth + (textPaddingX * 2));
        }
        imgDrawH = Math.round(bubbleActualW / imgAspect);
    } else {
        if (textLines.length === 1) {
            bubbleActualW = maxLineWidth + (textPaddingX * 2) + timestampWidth + Math.round(35 * SX);
        } else if (textLines.length > 1) {
            const lastLineWidth = lineWidths[textLines.length - 1] || 0;
            if (lastLineWidth + timestampWidth + Math.round(35 * SX) <= maxLineWidth) {
                bubbleActualW = maxLineWidth + (textPaddingX * 2);
            } else if (lastLineWidth + timestampWidth + Math.round(35 * SX) <= textLimitW) {
                bubbleActualW = lastLineWidth + timestampWidth + Math.round(35 * SX) + (textPaddingX * 2);
            } else {
                bubbleActualW = maxLineWidth + (textPaddingX * 2);
                timestampOnNewRow = true;
            }
        }
    }

    if (bubbleActualW < minBubbleW) bubbleActualW = minBubbleW;
    if (bubbleActualW > s.bubbleWidth) bubbleActualW = s.bubbleWidth;
    if (imgObj && bubbleActualW < timestampWidth + Math.round(50 * SX)) bubbleActualW = timestampWidth + Math.round(50 * SX);

    const bubbleX = BG_W - bubbleActualW - rightPadding;

    const lineGap = Math.round(12 * SY);
    const textTotalHeight = (textLines.length * s.fontSize) + (Math.max(0, textLines.length - 1) * lineGap);

    let bubbleHeight = 0;
    if (timestampOnNewRow || !s.text) {
        bubbleHeight = paddingTop + textTotalHeight + Math.round(16 * SY) + timestampHeight + paddingBottom;
    } else {
        bubbleHeight = paddingTop + textTotalHeight + paddingBottom;
    }

    if (imgObj) {
        bubbleHeight += imgDrawH;
        if (s.text) bubbleHeight += Math.round(12 * SY);
    }

    const currentBubbleY = menuTopBorderY - bubbleHeight - Math.round(28 * SY);

    ctx.save();
    ctx.translate(s.offsetX, s.offsetY);

    ctx.save();
    ctx.shadowColor   = "rgba(0,0,0,0.05)";
    ctx.shadowBlur    = 20;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle     = s.bubbleColor;
    drawRoundedRect(ctx, bubbleX, currentBubbleY, bubbleActualW, bubbleHeight, bRadius);
    ctx.fill();
    ctx.restore();

    if (imgObj) {
        ctx.save();
        drawRoundedRect(ctx, bubbleX, currentBubbleY, bubbleActualW, bubbleHeight, bRadius);
        ctx.clip();
        ctx.drawImage(imgObj, bubbleX, currentBubbleY, bubbleActualW, imgDrawH);
        ctx.restore();
    }

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(bubbleX + bubbleActualW - Math.round(15 * SX), currentBubbleY + bubbleHeight - 5);
    ctx.lineTo(bubbleX + bubbleActualW + Math.round(10 * SX), currentBubbleY + bubbleHeight - 5);
    ctx.quadraticCurveTo(
        bubbleX + bubbleActualW + Math.round(2 * SX),
        currentBubbleY + bubbleHeight - Math.round(20 * SY),
        bubbleX + bubbleActualW - Math.round(1 * SX),
        currentBubbleY + bubbleHeight - Math.round(32 * SY)
    );
    ctx.closePath();
    ctx.fillStyle = s.bubbleColor;
    ctx.fill();
    ctx.restore();

    if (s.text) {
        ctx.save();
        ctx.fillStyle    = s.textColor;
        ctx.font         = `400 ${s.fontSize}px Inter`;
        ctx.textAlign    = "left";
        ctx.textBaseline = "middle";
        let textStartY = currentBubbleY + paddingTop;
        if (imgObj) textStartY = currentBubbleY + imgDrawH + Math.round(12 * SY);
        for (let i = 0; i < textLines.length; i++) {
            const lineY = textStartY + (i * (s.fontSize + lineGap)) + (s.fontSize / 2);
            await drawTextWithEmojis(ctx, textLines[i], bubbleX + textPaddingX, lineY, s.fontSize);
        }
        ctx.restore();
    }

    ctx.save();
    let timeX = bubbleX + bubbleActualW - textPaddingX - timestampWidth;
    let timeY = 0;

    if (timestampOnNewRow || !s.text) {
        timeY = currentBubbleY + bubbleHeight - paddingBottom - timestampHeight + Math.round(4 * SY);
    } else {
        let textStartY = currentBubbleY + paddingTop;
        if (imgObj) textStartY = currentBubbleY + imgDrawH + Math.round(12 * SY);
        const lastLineTop = textStartY + ((textLines.length - 1) * (s.fontSize + lineGap));
        timeY = lastLineTop + s.fontSize - timestampHeight + Math.round(2 * SY);
    }

    ctx.fillStyle    = s.timeColor;
    ctx.font         = `600 ${timeFontSize}px Inter`;
    ctx.textBaseline = "top";
    ctx.fillText(s.time, timeX, timeY);

    const tickX = timeX + timeMetrics.width + Math.round(10 * SX);
    const t     = (n) => Math.round(n * SX);
    const tickY = timeY + (timeFontSize / 2) - t(8); 

    ctx.strokeStyle = s.tickColor;
    ctx.lineWidth   = 3.6 * SX;
    ctx.lineCap     = "round";
    ctx.lineJoin    = "round";
    
    ctx.beginPath();
    ctx.moveTo(tickX,         tickY + t(8));
    ctx.lineTo(tickX + t(6),  tickY + t(14));
    ctx.lineTo(tickX + t(16), tickY + t(2));
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(tickX + t(7),         tickY + t(8));
    ctx.lineTo(tickX + t(7) + t(6),  tickY + t(14));
    ctx.lineTo(tickX + t(7) + t(16), tickY + t(2));
    ctx.stroke();
    ctx.restore();

    if (s.showReaction) {
        ctx.save();
        const emojiNum  = s.emojis.length;
        const startPad  = Math.round(52  * SX);
        const plusBtnW  = Math.round(80  * SX);
        const rxHeight  = Math.round(160 * SX);
        const rxWidth   = startPad + ((emojiNum - 1) * s.emojiSpacing) + s.emojiSpacing * 0.5 + plusBtnW + startPad * 0.5;

        const rxX       = bubbleX + bubbleActualW - rxWidth + s.emojiXOffset;
        const rxY       = currentBubbleY - rxHeight + s.emojiYOffset;
        const rxRadius  = rxHeight / 2;

        const rxPivotX = rxX + rxWidth - Math.round(80 * SX);
        const rxPivotY = rxY + rxHeight / 2;
        ctx.translate(rxPivotX, rxPivotY);
        ctx.scale(s.reactionScale, s.reactionScale);
        ctx.translate(-rxPivotX, -rxPivotY);

        ctx.save();
        ctx.shadowColor   = "rgba(0,0,0,0.10)";
        ctx.shadowBlur    = 36;
        ctx.shadowOffsetY = 16;
        ctx.fillStyle     = "#FFFFFF";
        drawRoundedRect(ctx, rxX, rxY, rxWidth, rxHeight, rxRadius);
        ctx.fill();
        ctx.restore();

        const emojiCY = rxY + rxHeight / 2;
        for (let i = 0; i < emojiNum; i++) {
            await drawAppleEmoji(ctx, s.emojis[i], rxX + startPad + (i * s.emojiSpacing), emojiCY, s.emojiSize);
        }

        const plusX = rxX + startPad + (emojiNum - 1) * s.emojiSpacing + Math.round(90 * SX);
        const plusY = emojiCY;
        const plusR = Math.round(38 * SX);
        const arm   = Math.round(13 * SX);
        ctx.beginPath();
        ctx.arc(plusX, plusY, plusR, 0, Math.PI * 2);
        ctx.fillStyle = "#E5E5EA";
        ctx.fill();
        ctx.strokeStyle = "#8E8E93";
        ctx.lineWidth   = 4.5 * SX;
        ctx.lineCap     = "round";
        ctx.beginPath();
        ctx.moveTo(plusX - arm, plusY); ctx.lineTo(plusX + arm, plusY);
        ctx.moveTo(plusX, plusY - arm); ctx.lineTo(plusX, plusY + arm);
        ctx.stroke();
        ctx.restore();
    }

    ctx.restore();

    const pngData = await canvas.encode('png');
    const out = outputPath ?? join(process.cwd(), 'temp', `iqcpink_${Date.now()}.png`);
    await writeFile(out, pngData);
    return out;
}

async function handler(m, { sock, text }) {
    try {
        const targetText = text || (m.quoted && m.quoted.text ? m.quoted.text : "");
        
        let targetImgBuffer = null;
        try {
            if (m.quoted && typeof m.quoted.download === 'function') {
                targetImgBuffer = await m.quoted.download();
            } else if (typeof m.download === 'function' && (m.isMedia || m.mtype === 'imageMessage' || m.type === 'imageMessage')) {
                targetImgBuffer = await m.download();
            }
        } catch (e) {}
        
        if (!targetText && !targetImgBuffer) {
            return m.reply(
                `🩷 *FITUR FAKE QUOTE iOS PINK*\n\n` +
                `Sistem ini akan mengubah teks yang kamu berikan menjadi gambar *quote* bergaya iOS dengan tema Pink yang cantik dan elegan.\n\n` +
                `*CARA PENGGUNAAN:*\n` +
                `- Ketik \`${m.prefix}iqcpink <teks kamu>\`\n` +
                `- Atau balas (*reply*) pesan orang lain dengan perintah \`${m.prefix}iqcpink\`\n\n` +
                `_Pesan yang dibalas akan otomatis diubah menjadi quote menggunakan nama dan foto profil pembuat pesan tersebut!_`
            );
        }

        let ts = m.messageTimestamp;
        if (ts && typeof ts === 'object' && ts.low !== undefined) ts = ts.low;
        ts = Number(ts) * 1000;
        const date = isNaN(ts) ? new Date() : new Date(ts);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const timeStr = `${hours}.${minutes}`;

        await m.react('🕕');

        let imgUrl = "";
        let caption = targetText || "";
        const tmpImgPath = join(process.cwd(), 'temp', `iqcpink_${Date.now()}.png`);
        
        if (targetImgBuffer) {
            await writeFile(tmpImgPath, targetImgBuffer);
            imgUrl = tmpImgPath;
        }

        const outPath = join(process.cwd(), 'temp', `iqcpink_out_${Date.now()}.png`);
        await mkdir(join(process.cwd(), 'temp'), { recursive: true });

        const resultPath = await render(caption, timeStr, imgUrl, outPath);

        await sock.sendMessage(m.chat, { image: { url: resultPath } }, { quoted: m });
        
        if (existsSync(resultPath)) fs.unlinkSync(resultPath);
        if (imgUrl && existsSync(imgUrl)) fs.unlinkSync(imgUrl);
        await m.react('✅');

    } catch (error) {
        bgImgBuffer = null;
        fontsLoaded = false;
        appleEmojiMap = null;
        console.error("[iqcpink error]:", error);
        await m.react('❌');
        m.reply(`❌ *GAGAL MEMPROSES QUOTE*\n\nMaaf, terjadi kesalahan saat mencoba membuat gambar quote pink. Silakan coba lagi beberapa saat.`);
    }
}

export { pluginConfig as config, handler };
