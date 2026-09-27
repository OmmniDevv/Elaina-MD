/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import config from '../../config.js';
import { updateAssetUrl } from '../../src/lib/elaina-uploader.js';
import te from '../../src/lib/elaina-error.js';

const pluginConfig = {
    name: 'ganti-asset',
    alias: ['gantiasset', 'setasset'],
    category: 'owner',
    description: 'All-in-one tools untuk ganti asset secara interaktif',
    usage: '.ganti-asset (reply media)',
    example: '.ganti-asset',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
};

if (!global.gantiAssetSessions) {
    global.gantiAssetSessions = {};
}

async function handler(m, { sock }) {
    try {
        const isImage = m.isImage || (m.quoted && m.quoted.isImage);
        const isVideo = m.isVideo || (m.quoted && m.quoted.isVideo);
        const isAudio = m.isAudio || (m.quoted && m.quoted.isAudio);
        const isDocument = m.isDocument || (m.quoted && m.quoted.isDocument);

        const isMedia = isImage || isVideo || isAudio || isDocument;

        if (!isMedia) {
            return m.reply(`🖼️ *ɢᴀɴᴛɪ ᴀssᴇᴛ*\n\n> Silakan reply media (gambar/video/audio/document) dengan pesan \`${m.prefix}ganti-asset\``);
        }

        m.react('🕕');

        let buffer;
        if (m.quoted && m.quoted.isMedia) {
            buffer = await m.quoted.download();
        } else if (m.isMedia) {
            buffer = await m.download();
        }

        if (!buffer) {
            return m.reply('❌ Gagal mendownload media.');
        }

        const assets = config.assets || {};
        const keys = Object.keys(assets);
        if (keys.length === 0) {
            return m.reply('❌ Tidak ada asset di config.js.');
        }

        const imageKeys = [];
        const videoKeys = [];
        const audioKeys = [];
        const fontKeys = [];
        const otherKeys = [];

        keys.forEach(k => {
            const pathUrl = assets[k].toLowerCase();
            if (pathUrl.endsWith('.jpg') || pathUrl.endsWith('.png') || pathUrl.endsWith('.jpeg') || pathUrl.endsWith('.webp')) {
                imageKeys.push(k);
            } else if (pathUrl.endsWith('.mp4')) {
                videoKeys.push(k);
            } else if (pathUrl.endsWith('.mp3') || pathUrl.endsWith('.ogg') || pathUrl.endsWith('.wav')) {
                audioKeys.push(k);
            } else if (pathUrl.endsWith('.ttf') || pathUrl.endsWith('.otf')) {
                fontKeys.push(k);
            } else {
                otherKeys.push(k);
            }
        });

        const orderedKeys = [...imageKeys, ...videoKeys, ...audioKeys, ...fontKeys, ...otherKeys];

        let listText = `📂 *PILIH ASSET YANG INGIN DIGANTI*\n\n`;
        listText += `_Silakan reply pesan ini dengan nomor (1-${orderedKeys.length})_\n\n`;

        let idx = 1;
        if (imageKeys.length > 0) {
            listText += `*🖼️ Image Assets:*\n`;
            imageKeys.forEach(k => { listText += `> ${idx++}. ${k}\n`; });
            listText += `\n`;
        }
        if (videoKeys.length > 0) {
            listText += `*🎥 Video Assets:*\n`;
            videoKeys.forEach(k => { listText += `> ${idx++}. ${k}\n`; });
            listText += `\n`;
        }
        if (audioKeys.length > 0) {
            listText += `*🎵 Audio Assets:*\n`;
            audioKeys.forEach(k => { listText += `> ${idx++}. ${k}\n`; });
            listText += `\n`;
        }
        if (fontKeys.length > 0) {
            listText += `*🔤 Font Assets:*\n`;
            fontKeys.forEach(k => { listText += `> ${idx++}. ${k}\n`; });
            listText += `\n`;
        }
        if (otherKeys.length > 0) {
            listText += `*📁 Other Assets:*\n`;
            otherKeys.forEach(k => { listText += `> ${idx++}. ${k}\n`; });
            listText += `\n`;
        }

        global.gantiAssetSessions[m.chat] = {
            sender: m.sender,
            buffer,
            isImageUpload: isImage,
            isVideoUpload: isVideo,
            isAudioUpload: isAudio,
            isFontUpload: isDocument,
            keys: orderedKeys,
            imageKeys,
            videoKeys,
            audioKeys,
            fontKeys
        };

        await m.reply(listText.trim());

        setTimeout(() => {
            if (global.gantiAssetSessions[m.chat]) {
                delete global.gantiAssetSessions[m.chat];
            }
        }, 120000);

        m.react('✅');
    } catch (error) {
        m.react('☢');
        await m.reply(te(m.prefix, m.command, m.pushName));
    }
}

async function gantiAssetAnswerHandler(m, sock) {
    if (!m.body) return false;
    if (!global.gantiAssetSessions) return false;

    const session = global.gantiAssetSessions[m.chat];
    if (!session) return false;
    if (session.sender !== m.sender) return false;

    const num = parseInt(m.body.trim());
    if (isNaN(num)) return false;

    if (num < 1 || num > session.keys.length) {
        if (m.quoted && m.quoted.fromMe) {
            await m.reply(`❌ Nomor tidak valid. Pilih antara 1-${session.keys.length}.`);
        }
        return false;
    }

    const selectedKey = session.keys[num - 1];

    const isImageUpload = session.isImageUpload;
    const isVideoUpload = session.isVideoUpload;
    const isAudioUpload = session.isAudioUpload;
    const isFontUpload = session.isFontUpload;

    if (session.imageKeys && session.imageKeys.includes(selectedKey) && !isImageUpload) {
        await m.reply(`❌ Format tidak sesuai!\n> Asset *${selectedKey}* membutuhkan file gambar (Image).`);
        return true;
    }
    if (session.videoKeys && session.videoKeys.includes(selectedKey) && !isVideoUpload) {
        await m.reply(`❌ Format tidak sesuai!\n> Asset *${selectedKey}* membutuhkan file video.`);
        return true;
    }
    if (session.audioKeys && session.audioKeys.includes(selectedKey) && !isAudioUpload) {
        await m.reply(`❌ Format tidak sesuai!\n> Asset *${selectedKey}* membutuhkan file audio.`);
        return true;
    }
    if (session.fontKeys && session.fontKeys.includes(selectedKey) && !isFontUpload) {
        await m.reply(`❌ Format tidak sesuai!\n> Asset *${selectedKey}* membutuhkan file dokumen font (.ttf/.otf).`);
        return true;
    }

    let ext = '.jpg';
    if (isVideoUpload) ext = '.mp4';
    else if (isAudioUpload) ext = '.mp3';
    else if (isFontUpload) ext = '.ttf';

    const filename = selectedKey + ext;

    await m.react('🕕');

    try {
        const newPath = await updateAssetUrl(selectedKey, session.buffer, filename);
        await m.reply(`✅ *BERHASIL*\n\n> Asset *${selectedKey}* telah diganti ke:\n> ${newPath}\n> Config telah diupdate secara realtime!`);
        delete global.gantiAssetSessions[m.chat];
        await m.react('✅');
    } catch (e) {
        await m.react('❌');
        await m.reply(`❌ Gagal mengganti asset: ${e.message}`);
    }

    return true;
}

export { pluginConfig as config, handler, gantiAssetAnswerHandler };
