/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import config from '../../config.js'
const pluginConfig = {
    name: 'gay',
    alias: ['howgay'],
    category: 'fun',
    description: 'Menunjuk member paling gay di grup',
    usage: '.gay',
    isGroup: true,
    isBotAdmin: false,
    isAdmin: false,
    cooldown: 10,
    energi: 2,
    isEnabled: true
};

async function handler(m, { sock }) {
    if (!m.isGroup) return m.reply(config.messages.groupOnly);
    const groupMetadata = m.groupMetadata;
    const participants = groupMetadata.participants;
    const member = participants.map(u => u.jid);
    const orang1 = member[Math.floor(Math.random() * member.length)];
    const orang2 = member[Math.floor(Math.random() * member.length)];
    const text = `@${orang1.split('@')[0]} *Nge gay sama* @${orang2.split('@')[0]}`;
    await m.reply(text, { mentions: [orang1, orang2] })
}

export { pluginConfig as config, handler }