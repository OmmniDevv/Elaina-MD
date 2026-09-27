/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import gemini from '../../src/scraper/gemini.js';
import { AIRich } from '../../src/lib/elaina-builder.js';
import te from '../../src/lib/elaina-error.js';

const pluginConfig = {
    name: 'ai',
    alias: ['ai4chat', 'gemini'],
    category: 'ai',
    description: 'Chat cerdas dengan AI (mendukung tabel, kode, dll via AIRich)',
    usage: '.ai <pertanyaan>',
    example: '.ai buatkan tabel perbandingan vue dan react',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true
};

const sessions = {};

const systemPrompt = `Kamu adalah asisten AI yang cerdas dan canggih (Rimuru AI).
Gunakan format markdown secara ketat:
1. Jika membuat daftar perbandingan atau sekumpulan data, SELALU gunakan format tabel markdown (diawali dan diakhiri dengan '|').
2. Jika memberikan kode pemrograman, SELALU bungkus dengan markdown code block (\`\`\`bahasa ... \`\`\`).
3. Gunakan formatting teks tebal (*teks*) untuk menekankan sesuatu, atau hashtag (#) untuk judul / penjelas besar.
Pastikan semua respon terstruktur dengan baik agar sistem AIRich dapat merendernya dengan cantik.`;

async function handler(m, { sock }) {
    const text = m.text?.trim();

    if (!text) {
        return m.reply(
            `🤖 *AI*\n\n` +
            `> Halo! Aku asisten cerdas\n\n` +
            `*Cara penggunaan:*\n` +
            `> \`${m.prefix}ai <pertanyaan>\`\n\n` +
            `*Contoh:*\n` +
            `> \`${m.prefix}ai buatkan tabel jadwal piket\``
        );
    }

    await m.react('🕕');

    const userJid = m.sender;
    const sessionId = sessions[userJid] || null;

    try {
        const result = await gemini({
            message: text,
            instruction: systemPrompt,
            sessionId: sessionId
        });

        if (result && result.sessionId) {
            sessions[userJid] = result.sessionId;
        }

        const replyText = result.text || '';

        const aiRich = new AIRich(sock);

        const lines = replyText.split('\n');
        let currentTable = [];
        let currentCode = [];
        let inCode = false;
        let codeLang = '';
        let textBuffer = [];

        const flushText = () => {
            if (textBuffer.length > 0) {
                aiRich.addText(textBuffer.join('\n').trim());
                textBuffer = [];
            }
        };

        const flushTable = () => {
            if (currentTable.length > 0) {
                const tableData = currentTable.map(line => {
                    return line.split('|').map(c => c.trim()).filter((_, i, arr) => i !== 0 && i !== arr.length - 1);
                });
                const filteredTableData = tableData.filter(row => !row.every(c => /^[-:]+$/.test(c)));

                if (filteredTableData.length > 0 && filteredTableData.every(row => row.length > 0)) {
                    aiRich.addTable(filteredTableData);
                } else {
                    aiRich.addText(currentTable.join('\n'));
                }
                currentTable = [];
            }
        };

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            if (line.trim().startsWith('```')) {
                if (!inCode) {
                    flushText();
                    flushTable();
                    inCode = true;
                    codeLang = line.trim().substring(3).trim() || 'text';
                } else {
                    inCode = false;
                    aiRich.addCode(codeLang, currentCode.join('\n'));
                    currentCode = [];
                }
                continue;
            }

            if (inCode) {
                currentCode.push(line);
                continue;
            }

            if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
                flushText();
                currentTable.push(line.trim());
                continue;
            }

            flushTable();
            textBuffer.push(line);
        }

        flushText();
        flushTable();

        await aiRich.send(m.chat, { quoted: m });

        await m.react('✅');
    } catch (error) {
        console.error('[AI Error]', error);
        await m.react('☢');
        return m.reply(te(m.prefix, m.command, m.pushName));
    }
}

export { pluginConfig as config, handler };