/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';

const pluginConfig = {
  name: 'nisfusyaban',
  alias: ['nisfu', 'malamnisfu', 'syaban'],
  category: 'religi',
  description: 'Informasi lengkap tentang Malam Nisfu Syaban (doa, amalan, keutamaan)',
  usage: '.nisfusyaban',
  example: '.nisfusyaban',
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const now = new Date();
  const year = now.getFullYear();

  // Perkiraan tanggal Nisfu Syaban (2027)
  const targetDate = new Date('2027-02-13T00:00:00+07:00');
  const diffMs = targetDate - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  let countdownText = '';
  let statusEmoji = '';
  let statusMessage = '';

  if (diffDays <= 0) {
    statusEmoji = '🌙';
    statusMessage = '✨ Malam Nisfu Syaban telah tiba! ✨';
    countdownText = '🌙 Malam penuh ampunan dan rahmat Allah!';
  } else {
    statusEmoji = '⏳';
    statusMessage = 'Menuju Malam Nisfu Syaban';
    countdownText = `${diffDays} hari lagi`;
  }

  const caption = `🕌 *MALAM NISFU SYABAN*
${statusEmoji} ${statusMessage}

📅 Tanggal: 15 Syaban 1448 H
🌙 Waktu: Malam hari (ba'da Maghrib)
📆 Perkiraan: ${targetDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
⏳ Countdown: ${countdownText}

✨ Keutamaan Malam Nisfu Syaban:
1. Malam penuh ampunan dari Allah SWT
2. Allah mencatat takdir setahun ke depan
3. Pintu rahmat dan maghfirah dibuka lebar
4. Doa-doa dikabulkan oleh Allah
5. Dibebaskannya hamba dari api neraka

🤲 Amalan yang Dianjurkan:
• Membaca Surah Yasin 3x (niat panjang umur, rezeki, iman)
• Shalat Sunnah (minimal 2 rakaat)
• Perbanyak Istighfar dan Doa
• Membaca Doa Nisfu Syaban
• Bersedekah dan berbuat baik

📖 Doa Nisfu Syaban:
اَللَّهُمَّ يَا ذَا الْمَنِّ وَلَا يُمَنُّ عَلَيْهِ، يَا ذَا الْجَلَالِ وَالْإِكْرَامِ، يَا ذَا الطَّوْلِ وَالْإِنْعَامِ، لَا إِلَٰهَ إِلَّا أَنْتَ، ظَهْرَ اللَّاجِئِينَ، وَجَارَ الْمُسْتَجِيرِينَ، وَأَمَانَ الْخَائِفِينَ...

📚 Sumber: HR. Ibnu Majah, Al-Baihaqi
💗 ZERO TWO AI • ${year}`;

  await m.reply(caption);
  await m.react('🕌');
}


export { pluginConfig as config, handler };