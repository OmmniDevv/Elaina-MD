/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';

const pluginConfig = {
    name: 'livescore',
    alias: ['skorbola', 'livebola', 'skor'],
    category: 'info',
    description: 'Menampilkan live score pertandingan sepak bola dari Goal.com',
    usage: '.livescore',
    example: '.livescore',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 2,
    isEnabled: true
};

const _headerGacor = {
  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
  'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'
};

async function ambilLivescore(edisi = 'id') {
  try {
    const url = edisi === 'id' ? 'https://www.goal.com/id/livescore' : `https://www.goal.com/${edisi}/live-scores`;
    const res = await axios.get(url, { headers: _headerGacor, timeout: 15000 });
    const cocok = res.data.match(/__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s);
    if (!cocok) throw new Error('Gagal menemukan data skor');
    const json = JSON.parse(cocok[1]);
    const liveScores = json?.props?.pageProps?.content?.liveScores;
    if (!liveScores) throw new Error('Data liveScores kosong');
    return liveScores;
  } catch (error) {
    throw new Error(error.message);
  }
}

function _statusIndo(status) {
  const map = {
    FIXTURE: 'Belum Mulai',
    LIVE: 'Berlangsung',
    FINISHED: 'Selesai',
    POSTPONED: 'Ditunda',
    CANCELLED: 'Dibatalkan',
    HALF_TIME: 'Turun Minum'
  };
  return map[status] || status;
}

function _rapikanPertandingan(dataMentah) {
  return dataMentah.map(grup => ({
    kompetisi: grup.competition?.name || '-',
    pertandingan: (grup.matches || []).map(m => ({
      status: _statusIndo(m.status),
      waktu: m.startDate,
      tuanRumah: m.teamA?.name,
      tandang: m.teamB?.name,
      skorTuanRumah: (typeof m.score?.teamA === 'object' && m.score?.teamA !== null) ? (m.score.teamA.current ?? m.score.teamA.normalTime ?? m.score.teamA.score ?? '-') : (m.score?.teamA ?? '-'),
      skorTandang: (typeof m.score?.teamB === 'object' && m.score?.teamB !== null) ? (m.score.teamB.current ?? m.score.teamB.normalTime ?? m.score.teamB.score ?? '-') : (m.score?.teamB ?? '-'),
      kartuMerahTuanRumah: m.redCards?.teamA ?? 0,
      kartuMerahTandang: m.redCards?.teamB ?? 0,
      periode: (typeof m.period === 'object' && m.period !== null) ? (m.period.name ?? m.period.short ?? m.period.long ?? '-') : (m.period || '')
    }))
  }));
}

async function handler(m, { text }) {
    try {
        await m.react('🕕');
        const data = await ambilLivescore('id');
        const rapi = _rapikanPertandingan(data);
        
        if (!rapi || rapi.length === 0) {
            await m.react('❌');
            return m.reply(`⚽ *LIVESCORE BOLA* ⚽\n\nSaat ini tidak ada pertandingan yang sedang berlangsung atau dijadwalkan.`);
        }
        
        let caption = `⚽ *LIVE SCORE BOLA HARI INI* ⚽\n\n`;
        
        let count = 0;
        for (const grup of rapi) {
            if (count >= 15) break; 
            if (grup.pertandingan.length === 0) continue;
            
            caption += `🏆 *${grup.kompetisi.toUpperCase()}*\n`;
            
            for (const p of grup.pertandingan) {
                const skorA = p.skorTuanRumah;
                const skorB = p.skorTandang;
                
                let kmA = p.kartuMerahTuanRumah > 0 ? ` 🟥${p.kartuMerahTuanRumah}` : '';
                let kmB = p.kartuMerahTandang > 0 ? ` 🟥${p.kartuMerahTandang}` : '';
                
                caption += `▪️ ${p.tuanRumah}${kmA} *[ ${skorA} - ${skorB} ]* ${p.tandang}${kmB}\n`;
                caption += `   └ ⏳ _Status: ${p.status}_`;
                if (p.periode) caption += ` | ⏱️ _${p.periode}_`;
                caption += `\n`;
            }
            caption += `\n`;
            count++;
        }
        
        caption += `_Sumber: Goal.com_`;
        
        await m.reply(caption.trim());
        await m.react('✅');
    } catch (e) {
        console.error(e);
        await m.react('❌');
        m.reply(`❌ *GAGAL MENGAMBIL SKOR*\n\nMaaf, sistem gagal mengambil data live score saat ini. Error: _${e.message}_`);
    }
}

export { pluginConfig as config, handler };
