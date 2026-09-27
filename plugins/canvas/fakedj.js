/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';

const pluginConfig = {
    name: 'fakedj',
    alias: ['djfake'],
    category: 'canvas',
    description: 'Membuat gambar fake DJ dari teks',
    usage: '.fakedj <teks>',
    example: '.fakedj nama pengirim',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true,
};

async function handler(m, { sock, text }) {
    const value = text?.trim();
    if (!value) return m.reply(`❌ Masukkan teks. Contoh: ${m.prefix}fakedj Anita`);
    await m.react('⏳');
    try {
        const apiUrl = `https://free-restapi.biz.id/api/fakedj?text=${encodeURIComponent(value)}`;
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer', timeout: 60000 });
        await sock.sendMessage(m.chat, {
            image: Buffer.from(response.data),
            caption: `✅ Fake DJ\n📝 ${value}`,
        }, { quoted: m });
        await m.react('✅');
    } catch (error) {
        await m.react('❌').catch(() => {});
        return m.reply(`❌ Gagal membuat Fake DJ: ${error?.message || 'unknown error'}`);
    }
}

export { pluginConfig as config, handler };
