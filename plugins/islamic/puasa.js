/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';

const pluginConfig = {
  name: 'puasa',
  alias: ['puasasunnah', 'puasasenin', 'puasakamis', 'puasadawud'],
  category: 'religi',
  description: 'Panduan Puasa Sunnah Lengkap (Senin-Kamis, Dawud, Arafah, Asyura, dll)',
  usage: '.puasa <nama puasa>',
  example: '.puasa senin',
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  isEnabled: true,
};

// Database Puasa Sunnah
const PUASA_DATABASE = {
  'senin': {
    nama: 'Puasa Senin',
    hari: 'Senin',
    arab: 'نَوَيْتُ صَوْمَ يَوْمِ الْاِثْنَيْنِ سُنَّةً لِلَّهِ تَعَالَى',
    latin: 'Nawaitu shauma yaumil itsnaini sunnatan lillahi ta\'ala',
    arti: 'Aku niat puasa sunnah hari Senin karena Allah Ta\'ala',
    keutamaan: 'Hari lahirnya Rasulullah SAW, dan diangkatnya amal perbuatan',
    sumber: 'HR. Muslim'
  },
  'kamis': {
    nama: 'Puasa Kamis',
    hari: 'Kamis',
    arab: 'نَوَيْتُ صَوْمَ يَوْمِ الْخَمِيْسِ سُنَّةً لِلَّهِ تَعَالَى',
    latin: 'Nawaitu shauma yaumil khamisi sunnatan lillahi ta\'ala',
    arti: 'Aku niat puasa sunnah hari Kamis karena Allah Ta\'ala',
    keutamaan: 'Hari diangkatnya amal perbuatan, dan hari dimana doa diijabah',
    sumber: 'HR. Muslim'
  },
  'dawud': {
    nama: 'Puasa Dawud',
    hari: 'Selang-seling (1 hari puasa, 1 hari tidak)',
    arab: 'نَوَيْتُ صَوْمَ دَاوُدَ سُنَّةً لِلَّهِ تَعَالَى',
    latin: 'Nawaitu shauma dawuda sunnatan lillahi ta\'ala',
    arti: 'Aku niat puasa sunnah Dawud karena Allah Ta\'ala',
    keutamaan: 'Puasa yang paling dicintai Allah, seperti puasa Nabi Dawud AS',
    sumber: 'HR. Bukhari'
  },
  'arafah': {
    nama: 'Puasa Arafah',
    hari: '9 Dzulhijjah',
    arab: 'نَوَيْتُ صَوْمَ عَرَفَةَ سُنَّةً لِلَّهِ تَعَالَى',
    latin: 'Nawaitu shauma arafata sunnatan lillahi ta\'ala',
    arti: 'Aku niat puasa sunnah Arafah karena Allah Ta\'ala',
    keutamaan: 'Menghapus dosa setahun yang lalu dan setahun yang akan datang',
    sumber: 'HR. Muslim'
  },
  'asyura': {
    nama: 'Puasa Asyura',
    hari: '10 Muharram',
    arab: 'نَوَيْتُ صَوْمَ عَاشُوْرَاءَ سُنَّةً لِلَّهِ تَعَالَى',
    latin: 'Nawaitu shauma \'asyuuraa-a sunnatan lillahi ta\'ala',
    arti: 'Aku niat puasa sunnah Asyura karena Allah Ta\'ala',
    keutamaan: 'Menghapus dosa setahun yang lalu',
    sumber: 'HR. Muslim'
  },
  "sya'ban": {
    nama: 'Puasa Sya\'ban',
    hari: 'Bulan Sya\'ban (perbanyak puasa)',
    arab: 'نَوَيْتُ صَوْمَ شَعْبَانَ سُنَّةً لِلَّهِ تَعَالَى',
    latin: 'Nawaitu shauma sya\'bana sunnatan lillahi ta\'ala',
    arti: 'Aku niat puasa sunnah Sya\'ban karena Allah Ta\'ala',
    keutamaan: 'Bulan yang sering dilupakan, pintu menuju Ramadhan',
    sumber: 'HR. Bukhari & Muslim'
  },
  'enam': {
    nama: 'Puasa 6 Hari Syawal',
    hari: '6 Hari di Bulan Syawal',
    arab: 'نَوَيْتُ صَوْمَ سِتَّةٍ مِنْ شَوَّالٍ سُنَّةً لِلَّهِ تَعَالَى',
    latin: 'Nawaitu shauma sittatin min syawwalin sunnatan lillahi ta\'ala',
    arti: 'Aku niat puasa sunnah 6 hari Syawal karena Allah Ta\'ala',
    keutamaan: 'Seperti puasa setahun penuh',
    sumber: 'HR. Muslim'
  },
  'senin kamis': {
    nama: 'Puasa Senin-Kamis',
    hari: 'Senin dan Kamis',
    arab: 'نَوَيْتُ صَوْمَ يَوْمِ الْاِثْنَيْنِ وَالْخَمِيْسِ سُنَّةً لِلَّهِ تَعَالَى',
    latin: 'Nawaitu shauma yaumil itsnaini wal khamisi sunnatan lillahi ta\'ala',
    arti: 'Aku niat puasa sunnah hari Senin dan Kamis karena Allah Ta\'ala',
    keutamaan: 'Menggabungkan keutamaan puasa Senin dan Kamis',
    sumber: 'HR. Muslim'
  },
  '3hari': {
    nama: 'Puasa 3 Hari Setiap Bulan (Ayyamul Bidh)',
    hari: '13, 14, 15 Hijriyah',
    arab: 'نَوَيْتُ صَوْمَ أَيَّامِ الْبِيْضِ سُنَّةً لِلَّهِ تَعَالَى',
    latin: 'Nawaitu shauma ayyamil bidhi sunnatan lillahi ta\'ala',
    arti: 'Aku niat puasa sunnah Ayyamul Bidh karena Allah Ta\'ala',
    keutamaan: 'Seperti puasa setahun penuh',
    sumber: 'HR. Bukhari & Muslim'
  }
};

async function handler(m, { sock, args, text, prefix }) {
  const p = prefix || '.';
  const query = text?.replace(new RegExp(`^\\${p}puasa\\s*`, 'i'), '').trim();

  if (!query) {
    let list = '🌙 *PUASA SUNNAH LENGKAP*\n\n';
    list += `Cara pakai: ${p}puasa <nama puasa>\n`;
    list += `Contoh: ${p}puasa senin\n\n`;
    list += '📋 Daftar Puasa Sunnah:\n';
    const keys = Object.keys(PUASA_DATABASE);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      list += `${i+1}. ${key.charAt(0).toUpperCase() + key.slice(1)}\n`;
    }
    list += `\n💗 ZERO TWO AI • ${new Date().getFullYear()}`;
    return m.reply(list);
  }

  const puasaKey = query.toLowerCase();
  let puasa = PUASA_DATABASE[puasaKey];

  if (!puasa) {
    const match = Object.keys(PUASA_DATABASE).find(key => key.includes(puasaKey));
    if (match) {
      puasa = PUASA_DATABASE[match];
      const foundKey = match;
      const displayKey = foundKey.charAt(0).toUpperCase() + foundKey.slice(1);
      let caption = `🌙 *PUASA ${displayKey.toUpperCase()}*\n\n`;
      caption += `📌 Hari: ${puasa.hari}\n\n`;
      caption += `📜 Niat:\n${puasa.arab}\n\n`;
      caption += `🔤 Latin:\n${puasa.latin}\n\n`;
      caption += `💡 Artinya:\n${puasa.arti}\n\n`;
      caption += `✨ Keutamaan:\n${puasa.keutamaan}\n\n`;
      caption += `📚 Sumber: ${puasa.sumber}\n`;
      caption += `\n💗 ZERO TWO AI • ${new Date().getFullYear()}`;
      return m.reply(caption);
    }
    return m.reply(`❌ Puasa "${query}" tidak ditemukan.\n\n📋 Ketik ${p}puasa untuk melihat daftar.`);
  }

  const displayKey = puasaKey.charAt(0).toUpperCase() + puasaKey.slice(1);
  let caption = `🌙 *PUASA ${displayKey.toUpperCase()}*\n\n`;
  caption += `📌 Hari: ${puasa.hari}\n\n`;
  caption += `📜 Niat:\n${puasa.arab}\n\n`;
  caption += `🔤 Latin:\n${puasa.latin}\n\n`;
  caption += `💡 Artinya:\n${puasa.arti}\n\n`;
  caption += `✨ Keutamaan:\n${puasa.keutamaan}\n\n`;
  caption += `📚 Sumber: ${puasa.sumber}\n`;
  caption += `\n💗 ZERO TWO AI • ${new Date().getFullYear()}`;

  await m.reply(caption);
  await m.react('🌙');
}


export { pluginConfig as config, handler };