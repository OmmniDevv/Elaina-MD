/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';

const pluginConfig = {
  name: 'istikharah',
  alias: ['sholatistikharah', 'istikhoroh', 'istikharoh'],
  category: 'religi',
  description: 'Panduan Sholat Istikharah lengkap (tata cara, doa, waktu, dan keutamaan)',
  usage: '.istikharah',
  example: '.istikharah',
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const caption = `🕌 *SHOLAT ISTIKHARAH*
Sholat untuk meminta petunjuk terbaik dari Allah

📌 *Pengertian:*
Sholat Istikharah adalah sholat sunnah 2 rakaat untuk meminta petunjuk Allah dalam menentukan pilihan terbaik.

⏰ *Waktu:*
Bisa dilakukan kapan saja, kecuali waktu terlarang sholat. Paling utama di sepertiga malam.

📋 *Tata Cara:*

1️⃣ Niat Sholat Istikharah (2 rakaat)
"Ushalli sunnatal istikharati rak'ataini lillahi ta'ala"

2️⃣ Rakaat 1: Baca Al-Fatihah + Al-Kafirun
Rakaat 2: Baca Al-Fatihah + Al-Ikhlas

3️⃣ Setelah salam, baca doa Istikharah

🤲 *Doa Istikharah:*

اَللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ، وَتَعْلَمُ وَلَا أَعْلَمُ، وَأَنْتَ عَلَّامُ الْغُيُوبِ

Allahumma inni astakhiruka bi'ilmika, wa astaqdiruka bi qudratika, wa as-aluka min fadlikal 'azhim, fa innaka taqdiru wa la aqdiru, wa ta'lamu wa la a'lamu, wa anta 'allamul ghuyub.

Ya Allah, aku memohon petunjuk kepada-Mu dengan ilmu-Mu, dan aku memohon kemampuan dari-Mu dengan kekuatan-Mu, dan aku memohon karunia-Mu yang agung. Sesungguhnya Engkau Maha Kuasa, sedang aku tidak kuasa, Engkau Maha Mengetahui sedang aku tidak mengetahui, dan Engkau Maha Mengetahui hal-hal yang gaib.

🌙 *Kemudian dilanjutkan:*

اَللَّهُمَّ إِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الْأَمْرَ خَيْرٌ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي، فَاقْدُرْهُ لِي وَيَسِّرْهُ لِي ثُمَّ بَارِكْ لِي فِيهِ

Allahumma in kunta ta'lamu anna hadzal amra khairun li fi dini wa ma'asyi wa 'aqibati amri, faqdurhu li wa yassirhu li tsumma barik li fih.

Ya Allah, jika Engkau mengetahui bahwa urusan ini baik bagiku dalam agamaku, kehidupanku, dan akhir urusanku, maka takdirkanlah ia untukku, mudahkanlah ia untukku, kemudian berkahilah ia untukku.

✦ *Dan jika tidak baik:*

وَإِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الْأَمْرَ شَرٌّ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي، فَاصْرِفْهُ عَنِّي وَاصْرِفْنِي عَنْهُ، وَاقْدُرْ لِيَ الْخَيْرَ حَيْثُ كَانَ ثُمَّ أَرْضِنِي بِهِ

Wa in kunta ta'lamu anna hadzal amra syarrun li fi dini wa ma'asyi wa 'aqibati amri, fashrifhu 'anni wash-rifni 'anhu, waqdur liyal khaira haitsu kana tsumma ardini bih.

Dan jika Engkau mengetahui bahwa urusan ini buruk bagiku dalam agamaku, kehidupanku, dan akhir urusanku, maka jauhkanlah ia dariku, dan jauhkanlah aku darinya, dan takdirkanlah untukku kebaikan di mana pun ia berada, kemudian ridhailah aku dengannya.

💡 *Keutamaan:*
• Mendapat petunjuk terbaik dari Allah
• Terhindar dari penyesalan
• Menyerahkan urusan kepada Allah
• Meningkatkan ketakwaan

📚 *Sumber:* HR. Bukhari

💗 *ZERO TWO AI* • ${new Date().getFullYear()}`;

  await m.reply(caption);
  await m.react('🕌');
}


export { pluginConfig as config, handler };