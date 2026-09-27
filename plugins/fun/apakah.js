/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'apakah',
    alias: ['apa'],
    category: 'fun',
    description: 'Tanya bot apakah sesuatu',
    usage: '.apakah <pertanyaan>',
    example: '.apakah aku bisa kaya?',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true
};

const answers = [
    'Ya, tentu saja!',
    'Tidak, sepertinya tidak.',
    'Mungkin saja, coba lagi nanti.',
    'Hmm... aku rasa iya.',
    'Aku ragu, tapi bisa jadi.',
    'Pasti! 100%!',
    'Tidak mungkin.',
    'Bisa jadi, siapa yang tau?',
    'Menurutku sih iya.',
    'Wah, kayaknya nggak deh.',
    'Tentu, kenapa tidak?',
    'Aku nggak tau, coba tanya yang lain.',
    'Ya ampun, pasti lah!',
    'Hmm... sepertinya tidak.',
    'Aku yakin iya!',
    'Nggak mungkin banget.',
    'Mungkin, tapi jangan berharap terlalu tinggi.',
    'Iya dong!',
    'Nggak, maaf ya.',
    'Bisa! Semangat!'
];

async function handler(m) {
    const text = m.text?.trim();
    
    if (!text) {
        return m.reply(`❓ *ᴀᴘᴀᴋᴀʜ*\n\n> Masukkan pertanyaan!\n\n*Contoh:*\n> .apakah aku bisa jadi kaya?`);
    }
    
    const answer = answers[Math.floor(Math.random() * answers.length)];
    
    await m.reply(`${m.body.slice(1)}?
*${answer}*`);
}

export { pluginConfig as config, handler }