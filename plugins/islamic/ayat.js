/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';

const pluginConfig = {
  name: 'ayat',
  alias: ['ayatpilihan', 'suratpilihan'],
  category: 'religi',
  description: 'Kumpulan Ayat Pilihan Al-Quran (Arsy, Kursi, Ruqyah, dll)',
  usage: '.ayat <nama ayat>',
  example: '.ayat kursi',
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  isEnabled: true,
};

// Database Ayat Pilihan
const AYAT_DATABASE = {
  'kursi': {
    nama: 'Ayat Kursi',
    surah: 'Al-Baqarah: 255',
    arab: 'اَللّٰهُ لَاۤ اِلٰهَ اِلَّا هُوَۚ اَلْحَيُّ الْقَيُّوْمُۚ لَا تَأْخُذُهٗ سِنَةٌ وَّلَا نَوْمٌۗ لَهُ مَا فِى السَّمٰوٰتِ وَمَا فِى الْاَرْضِۗ مَنْ ذَا الَّذِيْ يَشْفَعُ عِنْدَهٗٓ اِلَّا بِاِذْنِهٖۗ يَعْلَمُ مَا بَيْنَ اَيْدِيْهِمْ وَمَا خَلْفَهُمْۖ وَلَا يُحِيْطُوْنَ بِشَيْءٍ مِّنْ عِلْمِهٖٓ اِلَّا بِمَا شَاۤءَۗ وَسِعَ كُرْسِيُّهُ السَّمٰوٰتِ وَالْاَرْضَۖ وَلَا يَـُٔوْدُهٗ حِفْظُهُمَاۚ وَهُوَ الْعَلِيُّ الْعَظِيْمُ',
    latin: 'Allahu la ilaha illa huwal hayyul qayyum, la ta\'khudzuhu sinatuw wa la naum, lahu ma fis-samawati wa ma fil-ard, man dzalladzi yasyfa\'u \'indahu illa bi-idznih, ya\'lamu ma baina aidihim wa ma khalfahum, wa la yuhithuna bi syai-in min \'ilmihi illa bima sya-a, wasi\'a kursiyyuhus-samawati wal-ard, wa la ya\'uduhu hifzhuhuma, wa huwal \'aliyyul \'azhim.',
    arti: 'Allah, tidak ada Tuhan selain Dia. Yang Maha Hidup, Yang terus menerus mengurus (makhluk-Nya). Tidak mengantuk dan tidak tidur. Kepunyaan-Nya apa yang di langit dan di bumi. Tiada yang dapat memberi syafaat di sisi-Nya tanpa izin-Nya. Dia mengetahui apa yang di hadapan mereka dan di belakang mereka, dan mereka tidak mengetahui sesuatu apa pun tentang ilmu-Nya melainkan apa yang Dia kehendaki. Kursi-Nya meliputi langit dan bumi. Dan Dia tidak merasa berat memelihara keduanya, dan Dia Maha Tinggi, Maha Besar.',
    keutamaan: 'Dibaca setelah sholat wajib → penghalang masuk surga. Dibaca pagi & petang → perlindungan dari setan.'
  },
  'arsy': {
    nama: 'Ayat Arsy',
    surah: 'Al-Baqarah: 255 (lanjutan)',
    arab: 'اَللّٰهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكَسَلِ وَالْهَرَمِ',
    latin: 'Allahumma inni a\'udzu bika minal kasali wal harami',
    arti: 'Ya Allah, aku berlindung kepada-Mu dari rasa malas dan pikun.',
    keutamaan: 'Perlindungan dari kemalasan dan ketuaan.'
  },
  'ruqyah': {
    nama: 'Ayat Ruqyah',
    surah: 'Al-Fatihah + Al-Ikhlas + Al-Falaq + An-Nas',
    arab: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ (1) الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ (2) الرَّحْمَنِ الرَّحِيمِ (3) مَالِكِ يَوْمِ الدِّينِ (4) إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ (5) اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ (6) صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ (7)',
    latin: 'Bismillahirrahmanirrahim. Alhamdulillahi rabbil \'alamin. Arrahmanirrahim. Maliki yaumiddin. Iyyaka na\'budu wa iyyaka nasta\'in. Ihdinas shiratal mustaqim. Shiratal ladzina an\'amta \'alaihim ghairil maghdubi \'alaihim wa lad dhallin.',
    arti: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang. Segala puji bagi Allah, Tuhan seluruh alam, Yang Maha Pengasih, Maha Penyayang, Pemilik hari pembalasan. Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami memohon pertolongan. Tunjukilah kami jalan yang lurus, yaitu jalan orang-orang yang telah Engkau beri nikmat, bukan jalan mereka yang dimurkai dan bukan jalan mereka yang sesat.',
    keutamaan: 'Dibaca untuk pengobatan (ruqyah), perlindungan dari gangguan jin dan sihir.'
  },
  'mukminun': {
    nama: 'Ayat 10 Surat Al-Mukminun',
    surah: 'Al-Mukminun: 10-11',
    arab: 'اُولٰۤىِٕكَ هُمُ الْوَارِثُوْنَۙ (10) الَّذِيْنَ يَرِثُوْنَ الْفِرْدَوْسَۗ هُمْ فِيْهَا خٰلِدُوْنَ (11)',
    latin: 'Ula\'ika humul-waritsun. Alladzina yaritsunal-firdaus, hum fiha khalidun.',
    arti: 'Merekalah orang-orang yang akan mewarisi (surga Firdaus). Mereka kekal di dalamnya.',
    keutamaan: 'Doa untuk mendapatkan surga Firdaus.'
  },
  'tahmid': {
    nama: 'Kalimat Tahmid',
    surah: 'HR. Bukhari & Muslim',
    arab: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ',
    latin: 'Subhanallahi wa bihamdihi, subhanallahil \'azhim',
    arti: 'Maha Suci Allah dengan segala puji-Nya, Maha Suci Allah Yang Maha Agung.',
    keutamaan: 'Dibaca 100x, dosa diampuni meskipun sebanyak buih di lautan.'
  },
  'istighfar': {
    nama: 'Istighfar',
    surah: 'HR. Bukhari',
    arab: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
    latin: 'Astaghfirullahal \'azhim alladzi la ilaha illa huwal hayyul qayyum wa atubu ilaih',
    arti: 'Aku memohon ampun kepada Allah Yang Maha Agung, yang tiada Tuhan selain Dia, Yang Maha Hidup, Yang Maha Berdiri Sendiri, dan aku bertaubat kepada-Nya.',
    keutamaan: 'Dibaca 100x, dibukakan pintu rezeki dan diampuni dosa.'
  },
  'talbiyah': {
    nama: 'Talbiyah',
    surah: 'HR. Bukhari & Muslim',
    arab: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ',
    latin: 'Labbaika allahumma labbaik, labbaika la syarika laka labbaik, innal hamda wan ni\'mata laka wal mulk, la syarika lak.',
    arti: 'Aku datang memenuhi panggilan-Mu ya Allah, aku datang memenuhi panggilan-Mu, tiada sekutu bagi-Mu, sesungguhnya segala puji dan nikmat adalah milik-Mu dan kerajaan, tiada sekutu bagi-Mu.',
    keutamaan: 'Dibaca saat melaksanakan ibadah haji dan umrah.'
  },
  'doa sapu jagat': {
    nama: 'Doa Sapu Jagat',
    surah: 'Al-Baqarah: 201',
    arab: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    latin: 'Rabbana atina fid-dunya hasanah wa fil-akhirati hasanah waqina \'adzabannar',
    arti: 'Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat dan peliharalah kami dari siksa neraka.',
    keutamaan: 'Doa yang paling sering dibaca oleh Nabi Muhammad SAW.'
  }
};

async function handler(m, { sock, args, text, prefix }) {
  const p = prefix || '.';
  const query = text?.replace(new RegExp(`^\\${p}ayat\\s*`, 'i'), '').trim();

  if (!query) {
    let list = '🕌 *AYAT PILIHAN AL-QURAN*\n\n';
    list += `Cara pakai: ${p}ayat <nama ayat>\n`;
    list += `Contoh: ${p}ayat kursi\n\n`;
    list += '📋 Daftar Ayat:\n';
    const keys = Object.keys(AYAT_DATABASE);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      list += `${i+1}. ${key.charAt(0).toUpperCase() + key.slice(1)}\n`;
    }
    list += `\n💗 ZERO TWO AI • ${new Date().getFullYear()}`;
    return m.reply(list);
  }

  const ayatKey = query.toLowerCase();
  let ayat = AYAT_DATABASE[ayatKey];

  if (!ayat) {
    const match = Object.keys(AYAT_DATABASE).find(key => key.includes(ayatKey));
    if (match) {
      ayat = AYAT_DATABASE[match];
      const foundKey = match;
      const displayKey = foundKey.charAt(0).toUpperCase() + foundKey.slice(1);
      let caption = `🕌 *${ayat.nama}*\n`;
      caption += `📖 ${ayat.surah}\n\n`;
      caption += `📜 Arab:\n${ayat.arab}\n\n`;
      caption += `🔤 Latin:\n${ayat.latin}\n\n`;
      caption += `💡 Artinya:\n${ayat.arti}\n\n`;
      caption += `✨ Keutamaan:\n${ayat.keutamaan}\n\n`;
      caption += `💗 ZERO TWO AI • ${new Date().getFullYear()}`;
      return m.reply(caption);
    }
    return m.reply(`❌ Ayat "${query}" tidak ditemukan.\n\n📋 Ketik ${p}ayat untuk melihat daftar.`);
  }

  const displayKey = ayatKey.charAt(0).toUpperCase() + ayatKey.slice(1);
  let caption = `🕌 *${ayat.nama}*\n`;
  caption += `📖 ${ayat.surah}\n\n`;
  caption += `📜 Arab:\n${ayat.arab}\n\n`;
  caption += `🔤 Latin:\n${ayat.latin}\n\n`;
  caption += `💡 Artinya:\n${ayat.arti}\n\n`;
  caption += `✨ Keutamaan:\n${ayat.keutamaan}\n\n`;
  caption += `💗 ZERO TWO AI • ${new Date().getFullYear()}`;

  await m.reply(caption);
  await m.react('🕌');
}

export { pluginConfig as config, handler };