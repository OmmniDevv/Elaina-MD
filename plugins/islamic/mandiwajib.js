/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'mandiwajib',
    alias: ['caramandiwajib', 'mandiwajib', 'mandi-wajib'],
    category: 'religi',
    description: 'Panduan cara mandi wajib beserta doa',
    usage: '.mandiwajib',
    example: '.mandiwajib',
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
`🕌 *PANDUAN MANDI WAJIB*

Hai ${m.pushName || 'Darling'} 🌙

Mandi wajib dilakukan untuk menghilangkan hadas besar sebelum melakukan ibadah yang mensyaratkan keadaan suci.

╭━━〔 📖 *NIAT* 〕━━╮
┃
┃ *Niat mandi wajib:*
┃
┃ "Saya berniat mandi untuk
┃ menghilangkan hadas besar
┃ karena Allah Ta'ala."
┃
╰━━━━━━━━━━━━━━╯

🚿 *CARA MANDI WAJIB*

1️⃣ *Niat*
   Niatkan dalam hati untuk
   menghilangkan hadas besar.

2️⃣ *Mencuci tangan*
   Bersihkan kedua tangan.

3️⃣ *Membersihkan bagian tubuh*
   Bersihkan bagian tubuh yang
   terkena kotoran/najis.

4️⃣ *Berwudu*
   Lakukan wudu seperti wudu
   untuk salat.

5️⃣ *Membasahi kepala*
   Siram kepala hingga air
   mengenai kulit kepala dan
   seluruh rambut.

6️⃣ *Membasahi seluruh tubuh*
   Siram dan ratakan air ke
   seluruh tubuh. Pastikan tidak
   ada bagian tubuh yang terlewat.

7️⃣ *Selesai*
   Setelah seluruh tubuh terkena
   air, mandi wajib telah selesai.

╭━━〔 🤲 *DOA* 〕━━╮
┃
┃ Setelah mandi wajib, tidak ada
┃ doa khusus yang wajib dibaca.
┃
┃ Kamu dapat membaca doa setelah
┃ wudu jika menginginkannya.
┃
╰━━━━━━━━━━━━━━╯

💡 *Catatan:*
Yang paling penting dalam mandi
wajib adalah *niat* dan memastikan
air mengenai seluruh tubuh.

✨ Semoga bermanfaat dan membantu
kamu menjaga kesucian sebelum
beribadah.

> 🕌 ZERO AI • Islamic Guide`

    await m.reply(text)
}

export { pluginConfig as config, handler };
