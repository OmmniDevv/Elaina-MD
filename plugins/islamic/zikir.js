/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';

const pluginConfig = {
  name: 'zikir',
  alias: ['dzikir', 'wirid', 'zikirpagi', 'zikirpetang'],
  category: 'religi',
  description: 'Kumpulan Zikir Harian (Pagi, Petang, Setelah Sholat, dan Lainnya)',
  usage: '.zikir <pagi/petang/sholat>',
  example: '.zikir pagi',
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  isEnabled: true,
};

// Database Zikir
const ZIKIR_DATABASE = {
  'pagi': {
    nama: 'Zikir Pagi',
    waktu: 'Setelah Sholat Subuh sampai terbit matahari',
    daftar: [
      {
        arab: 'اَللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
        latin: 'Allahumma bika ashbana wa bika amsaina wa bika nahya wa bika namutu wa ilaikan nusyur',
        arti: 'Ya Allah, dengan-Mu kami berpagi hari, dengan-Mu kami bersore hari, dengan-Mu kami hidup, dengan-Mu kami mati, dan kepada-Mu kami kembali.',
        jumlah: '1x'
      },
      {
        arab: 'اَللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا',
        latin: 'Allahumma inni as-aluka \'ilman nafi\'an wa rizqan thayyiban wa \'amalan mutaqabbalan',
        arti: 'Ya Allah, aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang baik, dan amal yang diterima.',
        jumlah: '1x'
      },
      {
        arab: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ وَرِضَا نَفْسِهِ وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ',
        latin: 'Subhanallahi wa bihamdihi \'adada khalqihi wa ridha nafsihi wa zinata \'arshihi wa midada kalimatih',
        arti: 'Maha Suci Allah dan segala puji bagi-Nya, sebanyak makhluk-Nya, dan keridhaan diri-Nya, dan seberat \'Arsy-Nya, dan sebanyak tinta kalimat-kalimat-Nya.',
        jumlah: '3x'
      },
      {
        arab: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        latin: 'La ilaha illallahu wahdahu la syarika lah, lahul mulku wa lahul hamdu wa huwa \'ala kulli syai\'in qadir',
        arti: 'Tidak ada Tuhan selain Allah Yang Maha Esa, tidak ada sekutu bagi-Nya. Milik-Nya kerajaan dan milik-Nya segala puji, dan Dia Maha Kuasa atas segala sesuatu.',
        jumlah: '10x'
      }
    ]
  },
  'petang': {
    nama: 'Zikir Petang',
    waktu: 'Setelah Sholat Ashar sampai Maghrib',
    daftar: [
      {
        arab: 'اَللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
        latin: 'Allahumma bika amsaina wa bika ashbana wa bika nahya wa bika namutu wa ilaikan nusyur',
        arti: 'Ya Allah, dengan-Mu kami bersore hari, dengan-Mu kami berpagi hari, dengan-Mu kami hidup, dengan-Mu kami mati, dan kepada-Mu kami kembali.',
        jumlah: '1x'
      },
      {
        arab: 'اَللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا فِيهَا وَأَعُوذُ بِكَ مِنْ شَرِّهَا وَشَرِّ مَا فِيهَا',
        latin: 'Allahumma inni as-aluka khaira hadzihil lailati wa khaira ma fiha wa a\'udzu bika min syarriha wa syarri ma fiha',
        arti: 'Ya Allah, aku memohon kepada-Mu kebaikan malam ini dan kebaikan apa yang ada di dalamnya, dan aku berlindung kepada-Mu dari kejahatannya dan kejahatan apa yang ada di dalamnya.',
        jumlah: '1x'
      }
    ]
  },
  'sholat': {
    nama: 'Zikir Setelah Sholat',
    waktu: 'Setelah Sholat Fardhu',
    daftar: [
      {
        arab: 'أَسْتَغْفِرُ اللَّهَ (3x)',
        latin: 'Astaghfirullah (3x)',
        arti: 'Aku memohon ampun kepada Allah (3x)',
        jumlah: '3x'
      },
      {
        arab: 'اَللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
        latin: 'Allahumma antas salam wa minkas salam tabarakta ya dzal jalali wal ikram',
        arti: 'Ya Allah, Engkaulah keselamatan, dan dari-Mu lah keselamatan. Maha Suci Engkau, wahai Tuhan yang memiliki keagungan dan kemuliaan.',
        jumlah: '1x'
      },
      {
        arab: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        latin: 'La ilaha illallahu wahdahu la syarika lah, lahul mulku wa lahul hamdu wa huwa \'ala kulli syai\'in qadir',
        arti: 'Tidak ada Tuhan selain Allah Yang Maha Esa, tidak ada sekutu bagi-Nya. Milik-Nya kerajaan dan milik-Nya segala puji, dan Dia Maha Kuasa atas segala sesuatu.',
        jumlah: '1x'
      },
      {
        arab: 'سُبْحَانَ اللَّهِ (33x)',
        latin: 'Subhanallah (33x)',
        arti: 'Maha Suci Allah (33x)',
        jumlah: '33x'
      },
      {
        arab: 'اَلْحَمْدُ لِلَّهِ (33x)',
        latin: 'Alhamdulillah (33x)',
        arti: 'Segala puji bagi Allah (33x)',
        jumlah: '33x'
      },
      {
        arab: 'اَللَّهُ أَكْبَرُ (33x)',
        latin: 'Allahu Akbar (33x)',
        arti: 'Allah Maha Besar (33x)',
        jumlah: '33x'
      },
      {
        arab: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        latin: 'La ilaha illallahu wahdahu la syarika lah, lahul mulku wa lahul hamdu wa huwa \'ala kulli syai\'in qadir',
        arti: 'Tidak ada Tuhan selain Allah Yang Maha Esa, tidak ada sekutu bagi-Nya. Milik-Nya kerajaan dan milik-Nya segala puji, dan Dia Maha Kuasa atas segala sesuatu.',
        jumlah: '1x'
      }
    ]
  },
  'tidur': {
    nama: 'Zikir Sebelum Tidur',
    waktu: 'Sebelum tidur',
    daftar: [
      {
        arab: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
        latin: 'Bismikallahumma amutu wa ahya',
        arti: 'Dengan nama-Mu ya Allah, aku mati dan aku hidup.',
        jumlah: '1x'
      },
      {
        arab: 'اَللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
        latin: 'Allahumma qini \'adzabaka yauma tab\'atsu \'ibadak',
        arti: 'Ya Allah, peliharalah aku dari siksa-Mu pada hari Engkau membangkitkan hamba-hamba-Mu.',
        jumlah: '3x'
      },
      {
        arab: 'سُبْحَانَ اللَّهِ (33x)',
        latin: 'Subhanallah (33x)',
        arti: 'Maha Suci Allah (33x)',
        jumlah: '33x'
      },
      {
        arab: 'اَلْحَمْدُ لِلَّهِ (33x)',
        latin: 'Alhamdulillah (33x)',
        arti: 'Segala puji bagi Allah (33x)',
        jumlah: '33x'
      },
      {
        arab: 'اَللَّهُ أَكْبَرُ (34x)',
        latin: 'Allahu Akbar (34x)',
        arti: 'Allah Maha Besar (34x)',
        jumlah: '34x'
      }
    ]
  }
};

async function handler(m, { sock, args, text, prefix }) {
  const p = prefix || '.';
  const query = text?.replace(new RegExp(`^\\${p}zikir\\s*`, 'i'), '').trim();

  if (!query) {
    let list = '🤲 *ZIKIR HARIAN LENGKAP*\n\n';
    list += `Cara pakai: ${p}zikir <pagi/petang/sholat/tidur>\n`;
    list += `Contoh: ${p}zikir pagi\n\n`;
    list += '📋 Daftar Zikir:\n';
    const keys = Object.keys(ZIKIR_DATABASE);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      list += `${i+1}. ${key.charAt(0).toUpperCase() + key.slice(1)}\n`;
    }
    list += `\n💗 ZERO TWO AI • ${new Date().getFullYear()}`;
    return m.reply(list);
  }

  const zikirKey = query.toLowerCase();
  let zikir = ZIKIR_DATABASE[zikirKey];

  if (!zikir) {
    const match = Object.keys(ZIKIR_DATABASE).find(key => key.includes(zikirKey));
    if (match) {
      zikir = ZIKIR_DATABASE[match];
      const foundKey = match;
      const displayKey = foundKey.charAt(0).toUpperCase() + foundKey.slice(1);
      let caption = `🤲 *ZIKIR ${displayKey.toUpperCase()}*\n`;
      caption += `⏰ ${zikir.waktu}\n\n`;
      for (const dz of zikir.daftar) {
        caption += `📜 ${dz.arab}\n`;
        caption += `🔤 ${dz.latin}\n`;
        caption += `💡 ${dz.arti}\n`;
        caption += `📌 Dibaca ${dz.jumlah}\n\n`;
      }
      caption += `💗 ZERO TWO AI • ${new Date().getFullYear()}`;
      return m.reply(caption);
    }
    return m.reply(`❌ Zikir "${query}" tidak ditemukan.\n\n📋 Ketik ${p}zikir untuk melihat daftar.`);
  }

  const displayKey = zikirKey.charAt(0).toUpperCase() + zikirKey.slice(1);
  let caption = `🤲 *ZIKIR ${displayKey.toUpperCase()}*\n`;
  caption += `⏰ ${zikir.waktu}\n\n`;
  for (const dz of zikir.daftar) {
    caption += `📜 ${dz.arab}\n`;
    caption += `🔤 ${dz.latin}\n`;
    caption += `💡 ${dz.arti}\n`;
    caption += `📌 Dibaca ${dz.jumlah}\n\n`;
  }
  caption += `💗 ZERO TWO AI • ${new Date().getFullYear()}`;

  await m.reply(caption);
  await m.react('🤲');
}


export { pluginConfig as config, handler };