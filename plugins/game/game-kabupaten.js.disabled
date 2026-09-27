import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command }) => {
    conn.game = conn.game ? conn.game : {};
    conn['kabupaten'] = conn['kabupaten'] ? conn['kabupaten'] : {};
    let id = m.chat;

    if (id in conn['kabupaten'] || id in conn.game) {
        conn.reply(m.chat, `⚠️ Masih ada game *${conn.game[id] || 'kabupaten'}* yang belum terjawab di chat ini!\nSelesaikan atau ketik *nyerah* terlebih dahulu.`, conn['kabupaten']?.[id]?.[0] || m);
        throw false;
    }

    try {
        await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        let apiKey = global.apikey?.jereapi || global.apiKey;
        
        const response = await fetch(`${global.web}/api/game/kabupaten?apikey=${apiKey}`);
        const json = await response.json();
        
        if (!json.status || !json.result) throw new Error(json.error || json.message || "Gagal mengambil soal game dari server");

        let p = json.result;

        let soalText = p.soal || p.pertanyaan || p.str || p.deskripsi || p.caption || "Tebak jawaban dari petunjuk berikut:";
        let answerData = p.jawaban !== undefined ? p.jawaban : (p.result !== undefined ? p.result : (p.nama || p.name || p.title || ''));
        let clueText = p.bantuan || p.clue || p.tipe || '';
        let mediaUrl = p.img || p.image || p.gambar || p.link || p.audio || p.url || null;
        let isAudio = 'image' === 'audio' || (mediaUrl && (mediaUrl.endsWith('.mp3') || mediaUrl.endsWith('.opus') || mediaUrl.endsWith('.m4a')));

        let text = `🎮 *${'TEBAK KABUPATEN / KOTA'}*\n\n`;
        text += `📝 *Soal:* ${soalText}\n`;
        if (clueText) text += `💡 *Petunjuk:* ${clueText}\n`;
        text += `\n⏰ *Waktu:* 60 detik\n`;
        text += `🎁 *Hadiah:* +500 XP & +10 Koin\n\n`;
        text += `Balas (reply) pesan ini untuk menjawab!\n`;
        text += `Ketik *nyerah* untuk menyerah.`;

        let msgOptions = { text: text.trim() };
        if (mediaUrl && typeof mediaUrl === 'string' && mediaUrl.startsWith('http')) {
            if (isAudio) {
                msgOptions = { audio: { url: mediaUrl }, mimetype: 'audio/mp4', ptt: false, caption: text.trim() };
            } else {
                try {
                    let imgRes = await fetch(mediaUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } });
                    if (imgRes.ok) {
                        let buffer = await imgRes.arrayBuffer();
                        msgOptions = { image: Buffer.from(buffer), caption: text.trim() };
                    } else {
                        msgOptions = { image: { url: mediaUrl }, caption: text.trim() };
                    }
                } catch (err) {
                    msgOptions = { image: { url: mediaUrl }, caption: text.trim() };
                }
            }
        }

        conn.game[id] = 'kabupaten';
        conn['kabupaten'][id] = [
            await conn.sendMessage(m.chat, msgOptions, { quoted: m }),
            json,
            setTimeout(() => {
                if (conn['kabupaten'] && conn['kabupaten'][id]) {
                    let ansDisplay = Array.isArray(answerData) ? answerData.join(' / ') : answerData;
                    conn.reply(m.chat, `⏳ *WAKTU HABIS!*\n\nJawabannya adalah: *${ansDisplay}*`, conn['kabupaten'][id][0]);
                    delete conn['kabupaten'][id];
                    if (conn.game) delete conn.game[id];
                }
            }, 60000),
            answerData
        ];
        
        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (e) {
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } }).catch(() => {});
        console.error('[Game kabupaten Error]', e);
        m.reply("❌ Error: " + (e.message || "Gagal memulai game"));
    }
}

handler.help = ['kabupaten']
handler.tags = ['game']
handler.command = /^kabupaten$/i
handler.limit = 1;

export default handler;
