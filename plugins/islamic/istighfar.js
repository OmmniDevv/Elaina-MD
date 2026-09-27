/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';

const pluginConfig = {
  name: 'istighfar',
  alias: ['sayyidulistighfar', 'istighfar', 'sayyidul'],
  category: 'religi',
  description: 'Sayyidul Istighfar (Doa Istighfar Terbaik) lengkap Arab, Latin, Arti, dan Keutamaan',
  usage: '.istighfar',
  example: '.istighfar',
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const caption = `🤲 *SAYYIDUL ISTIGHFAR*
Doa Istighfar Terbaik (Penghulu Istighfar)

📜 *Arab:*
اَللَّهُمَّ أَنْتَ رَبِّيْ لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِيْ وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوْذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِيْ، فَاغْفِرْ لِيْ، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوْبَ إِلَّا أَنْتَ

🔤 *Latin:*
Allahumma anta rabbi la ilaha illa anta, khalaqtani wa ana 'abduka, wa ana 'ala 'ahdika wa wa'dika mastatha'tu, a'udzu bika min syarri ma shana'tu, abu'u laka bini'matika 'alayya, wa abu'u laka bidzanbi, faghfir li, fa innahu la yaghfirudz dzunuba illa anta.

💡 *Artinya:*
Ya Allah, Engkau adalah Tuhanku, tidak ada Tuhan selain Engkau. Engkau telah menciptakanku dan aku adalah hamba-Mu. Aku akan setia pada perjanjian-Mu dan janji-Mu semampuku. Aku berlindung kepada-Mu dari kejahatan yang telah aku perbuat. Aku mengakui nikmat-Mu kepadaku, dan aku mengakui dosaku. Maka ampunilah aku, karena sesungguhnya tidak ada yang mengampuni dosa kecuali Engkau.

✨ *Keutamaan Sayyidul Istighfar:*

1. Doa istighfar terbaik yang diajarkan Rasulullah SAW
2. Dibaca pagi dan petang → dijamin masuk surga
3. Dosa diampuni meskipun sebanyak buih di lautan
4. Mendapat ketenangan hati dan perlindungan Allah
5. Dibaca 3x setelah sholat → diampuni dosanya

📖 *Rasulullah SAW bersabda:*
"Barang siapa membacanya dengan yakin di pagi hari, lalu meninggal pada hari itu, maka ia masuk surga. Dan barang siapa membacanya dengan yakin di malam hari, lalu meninggal pada malam itu, maka ia masuk surga." (HR. Bukhari)

📚 *Sumber:* HR. Bukhari (no. 6306)

💗 *ZERO TWO AI* • ${new Date().getFullYear()}`;

  await m.reply(caption);
  await m.react('🤲');
}


export { pluginConfig as config, handler };