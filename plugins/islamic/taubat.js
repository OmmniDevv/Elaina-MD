/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'taubat',
    alias: ['taubatnasuha', 'taubat-nasuha', 'doataubat'],
    category: 'religi',
    description: 'Panduan taubat nasuha lengkap dengan doa, latin, arti, dan tata caranya',
    usage: '.taubat',
    example: '.taubat',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m) {
    const text =
`🕌 *PANDUAN TAUBAT NASUHA*

Hai ${m.pushName || 'Teman'} 🌙

Taubat nasuha adalah taubat yang dilakukan dengan sungguh-sungguh kepada Allah SWT, disertai penyesalan atas dosa, meninggalkan dosa tersebut, dan bertekad untuk tidak mengulanginya.

╭━━〔 📖 *CARA TAUBAT NASUHA* 〕━━╮
┃
┃ *1️⃣ Berhenti dari dosa*
┃
┃ Tinggalkan perbuatan dosa yang
┃ sedang dilakukan dan jangan
┃ sengaja meneruskannya.
┃
┃ *2️⃣ Menyesali perbuatan*
┃
┃ Sesali dosa yang telah dilakukan
┃ dengan sungguh-sungguh.
┃
┃ *3️⃣ Memohon ampun kepada Allah*
┃
┃ Perbanyak membaca istighfar dan
┃ memohon ampun kepada Allah SWT.
┃
┃ *4️⃣ Bertekad tidak mengulangi*
┃
┃ Berusaha dengan sungguh-sungguh
┃ agar tidak kembali melakukan
┃ dosa tersebut.
┃
┃ *5️⃣ Jika menyangkut hak orang lain*
┃
┃ Kembalikan hak orang tersebut
┃ atau selesaikan kewajiban kepada
┃ orang yang dirugikan dengan cara
┃ yang baik dan benar.
┃
╰━━━━━━━━━━━━━━━━━━━━╯

╭━━〔 🤲 *DOA TAUBAT* 〕━━╮
┃
┃ *Arab:*
┃
┃ اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي
┃ ظُلْمًا كَثِيرًا، وَلَا يَغْفِرُ
┃ الذُّنُوبَ إِلَّا أَنْتَ،
┃ فَاغْفِرْ لِي مَغْفِرَةً مِنْ
┃ عِنْدِكَ، وَارْحَمْنِي،
┃ إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ
┃
┃ *Latin:*
┃
┃ Allahumma inni zhalamtu nafsi
┃ zhulman katsiran, wa laa
┃ yaghfirudz-dzunuuba illaa anta,
┃ faghfir lii maghfiratan min
┃ 'indika, warhamnii, innaka
┃ antal-ghafuurur-rahiim.
┃
┃ *Artinya:*
┃
┃ "Ya Allah, sesungguhnya aku telah
┃ menzalimi diriku dengan kezaliman
┃ yang banyak. Tidak ada yang dapat
┃ mengampuni dosa kecuali Engkau.
┃ Maka ampunilah aku dengan
┃ ampunan dari sisi-Mu dan
┃ rahmatilah aku. Sesungguhnya
┃ Engkau Maha Pengampun lagi
┃ Maha Penyayang."
┃
╰━━━━━━━━━━━━━━━━━━━━╯

╭━━〔 📿 *ISTIGHFAR* 〕━━╮
┃
┃ أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ
┃
┃ *Latin:*
┃
┃ Astaghfirullaaha wa atuubu ilaih.
┃
┃ *Artinya:*
┃
┃ "Aku memohon ampun kepada Allah
┃ dan aku bertaubat kepada-Nya."
┃
╰━━━━━━━━━━━━━━━━━━━━╯

╭━━〔 🌙 *SETELAH BERBUAT DOSA* 〕━━╮
┃
┃ Jangan berputus asa dari rahmat
┃ Allah. Segeralah kembali kepada
┃ Allah dengan memperbaiki diri,
┃ meninggalkan dosa, dan memperbanyak
┃ amal kebaikan.
┃
┃ Allah SWT berfirman:
┃
┃ *"Janganlah kamu berputus asa
┃ dari rahmat Allah."*
┃
┃ *(QS. Az-Zumar: 53)*
┃
╰━━━━━━━━━━━━━━━━━━━━╯

╭━━〔 💡 *YANG PERLU DIINGAT* 〕━━╮
┃
┃ 🤍 Allah Maha Pengampun
┃ 🤍 Jangan sengaja menunda taubat
┃ 🤍 Tinggalkan dosa
┃ 🤍 Perbanyak istighfar
┃ 🤍 Perbanyak amal kebaikan
┃ 🤍 Berusaha menjadi lebih baik
┃
╰━━━━━━━━━━━━━━━━━━━━╯

✨ *Semoga Allah menerima taubat
kita dan memberikan kekuatan
untuk menjadi pribadi yang lebih
baik.*

> 🕌 ZERO AI • Islamic Guide`

    await m.reply(text)
}

export { pluginConfig as config, handler };
