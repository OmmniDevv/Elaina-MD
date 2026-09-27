/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';

const pluginConfig = {
  name: 'tahlil',
  alias: ['tahlilan', 'doatahlil', 'tahlil'],
  category: 'religi',
  description: 'Panduan Tahlil Lengkap (Doa, Bacaan, dan Tata Cara)',
  usage: '.tahlil',
  example: '.tahlil',
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const caption = `🤲 *PANDUAN TAHLIL LENGKAP*
Bacaan Tahlil untuk mendoakan orang yang telah meninggal

📋 *SUSUNAN TAHLIL:*

1️⃣ *Bacaan Surat Al-Fatihah*
بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
الرَّحْمَٰنِ الرَّحِيمِ
مَالِكِ يَوْمِ الدِّينِ
إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ
اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ
صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ
غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ

📌 Dilanjutkan dengan:
لِإِلٰـهِ حَاضِرِيْ هٰذَا الْمَجْلِسِ وَاِلٰى جَمِيْعِ الْمُسْلِمِيْنَ وَالْمُسْلِمَاتِ وَالْمُؤْمِنِيْنَ وَالْمُؤْمِنَاتِ الْأَحْيَاءِ مِنْهُمْ وَالْأَمْوَاتِ
(Lafalkan dengan niat menghadiahkan kepada yang hadir dan semua muslim)

2️⃣ *Surat Al-Ikhlas 3x*
قُلْ هُوَ اللَّهُ أَحَدٌ
اللَّهُ الصَّمَدُ
لَمْ يَلِدْ وَلَمْ يُولَدْ
وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ

3️⃣ *Surat Al-Falaq 1x*
قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ
مِنْ شَرِّ مَا خَلَقَ
وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ
وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ
وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ

4️⃣ *Surat An-Nas 1x*
قُلْ أَعُوذُ بِرَبِّ النَّاسِ
مَلِكِ النَّاسِ
إِلَٰهِ النَّاسِ
مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ
الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ
مِنَ الْجِنَّةِ وَالنَّاسِ

5️⃣ *Bacaan Tahlil & Istighfar*
لَا إِلَٰهَ إِلَّا اللَّهُ (3x)
أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ (3x)

6️⃣ *Bacaan Tahlil Inti*
لَا إِلَٰهَ إِلَّا اللَّهُ (100x atau 33x)

7️⃣ *Doa Tahlil*
اَللَّهُمَّ اغْفِرْ لِلْمُسْلِمِيْنَ وَالْمُسْلِمَاتِ
وَالْمُؤْمِنِيْنَ وَالْمُؤْمِنَاتِ
الْأَحْيَاءِ مِنْهُمْ وَالْأَمْوَاتِ
إِنَّكَ سَمِيعٌ قَرِيبٌ مُجِيبُ الدَّعَوَاتِ

8️⃣ *Penutup*
سُبْحَانَ رَبِّكَ رَبِّ الْعِزَّةِ عَمَّا يَصِفُونَ
وَسَلَامٌ عَلَى الْمُرْسَلِينَ
وَالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ

📖 *Keutamaan Tahlil:*
• Mendoakan orang yang telah meninggal
• Mendapat pahala dari Allah
• Menghidupkan sunnah
• Mendekatkan diri kepada Allah

📚 *Sumber:* Kitab-kitab Fiqih & Ulama Nusantara

💗 *ZERO TWO AI* • ${new Date().getFullYear()}`;

  await m.reply(caption);
  await m.react('🤲');
}


export { pluginConfig as config, handler };