/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'kapan',
    alias: ['when'],
    category: 'fun',
    description: 'Tanya bot kapan sesuatu',
    usage: '.kapan <pertanyaan>',
    example: '.kapan aku nikah?',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true
};

const answers = [
    'Besok mungkin?',
    'Tahun depan kayaknya.',
    '3 hari lagi!',
    'Hmm, masih lama sih.',
    'Sebentar lagi kok!',
    'Kalau sudah waktunya, pasti terjadi.',
    'Bulan depan!',
    'Entah kapan, yang penting sabar.',
    'Dalam waktu dekat!',
    '10 tahun lagi mungkin?',
    'Nggak lama lagi!',
    'Kalau jodoh, pasti ketemu.',
    'Hmm, susah diprediksi.',
    'Minggu depan!',
    'Kalau usahanya lebih keras, lebih cepat!',
    'Pas waktunya tepat.',
    'Secepatnya, tenang aja.',
    'Ntar kalo udah siap.',
    'Dalam hitungan hari!',
    'Saat kamu sudah siap menerimanya.'
];

async function handler(m) {
    const text = m.text?.trim();
    
    if (!text) {
        return m.reply(`⏰ *ᴋᴀᴘᴀɴ*\n\n> Masukkan pertanyaan!\n\n*Contoh:*\n> .kapan aku nikah?`);
    }
    
    const answer = answers[Math.floor(Math.random() * answers.length)];
    
    await m.reply(`${m.body.slice(1)}?\n*${answer}*`);
}

export { pluginConfig as config, handler }