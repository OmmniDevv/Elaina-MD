// © Elaina-MD | https://github.com/OmmniDevv/Elaina-MD — Jangan Dijual!
// Cerdas Cermat SD via Deline API — gratis, no key
// API: https://api.deline.web.id/game/cc-sd?matapelajaran=<mapel>
// Mapel: bindo, tik, pkn, bing, penjas, pai, matematika, jawa, ips, ipa
import fetch from 'node-fetch'
import { elainaSay, elainaReact } from '../../lib/elainaVoice.js'

const MAPEL = ['bindo', 'tik', 'pkn', 'bing', 'penjas', 'pai', 'matematika', 'jawa', 'ips', 'ipa']

let handler = async (m, { conn, args, usedPrefix, command }) => {
    conn.game = conn.game ? conn.game : {};
    conn['ccsd'] = conn['ccsd'] ? conn['ccsd'] : {};
    let id = m.chat;

    if (id in conn['ccsd'] || id in conn.game) {
        conn.reply(m.chat, elainaSay('gagal', `masih ada game *${conn.game[id] || 'ccsd'}* yang belum terjawab... selesaikan atau ketik *nyerah* dulu ya~`), conn['ccsd']?.[id]?.[0] || m);
        throw false;
    }

    let mapel = (args[0] || 'bindo').toLowerCase();
    if (!MAPEL.includes(mapel)) {
        return m.reply(elainaSay('noargs', `mapelnya apa nih? Pilih salah satu: ${MAPEL.join(', ')}\nContoh: ${usedPrefix + command} matematika`));
    }

    try {
        await conn.sendMessage(m.chat, { react: { text: elainaReact('mikir'), key: m.key } });

        const response = await fetch(`https://api.deline.web.id/game/cc-sd?matapelajaran=${mapel}`, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const json = await response.json();

        if (!json.status || !Array.isArray(json.soal) || !json.soal.length) throw new Error(json.error || 'Gagal mengambil soal dari server');

        let q = json.soal[Math.floor(Math.random() * json.soal.length)];
        let opts = (q.semua_jawaban || []).map(o => {
            let k = Object.keys(o)[0];
            return `  ${k.toUpperCase()}. ${o[k]}`;
        }).join('\n');

        let answerData = String(q.jawaban_benar || '').toLowerCase().trim();

        let text = `📚 *CERDAS CERMAT SD — ${mapel.toUpperCase()}*\n\n`;
        text += `📝 *Soal:* ${q.pertanyaan}\n\n${opts}\n`;
        text += `\n⏰ *Waktu:* 60 detik\n`;
        text += `🎁 *Hadiah:* +500 XP & +10 Koin\n\n`;
        text += `Jawab dengan huruf jawabannya (A/B/C/D)!\n`;
        text += `Ketik *nyerah* untuk menyerah.`;

        conn.game[id] = 'ccsd';
        conn['ccsd'][id] = [
            await conn.sendMessage(m.chat, { text: text.trim() }, { quoted: m }),
            { status: true, result: { jawaban: answerData, deskripsi: `Mapel ${mapel}` } },
            setTimeout(() => {
                if (conn['ccsd'] && conn['ccsd'][id]) {
                    conn.reply(m.chat, `⏳ *WAKTU HABIS!*\n\nJawabannya adalah: *${answerData.toUpperCase()}*`, conn['ccsd'][id][0]);
                    delete conn['ccsd'][id];
                    if (conn.game) delete conn.game[id];
                }
            }, 60000),
            answerData
        ];

        await conn.sendMessage(m.chat, { react: { text: elainaReact('sukses'), key: m.key } });
    } catch (e) {
        await conn.sendMessage(m.chat, { react: { text: elainaReact('gagal'), key: m.key } }).catch(() => {});
        console.error('[Game ccsd Error]', e);
        m.reply(elainaSay('gagal', 'nggak bisa ambil soal... coba lagi ya~'));
    }
}

handler.help = ['ccsd <mapel>']
handler.tags = ['game']
handler.command = /^(ccsd|cc-sd|cerdascermat)$/i
handler.limit = 1;

export default handler;
