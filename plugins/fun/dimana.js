/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
    name: 'dimana',
    alias: ['where', 'mana'],
    category: 'fun',
    description: 'Tanya bot dimana sesuatu',
    usage: '.dimana <pertanyaan>',
    example: '.dimana jodohku berada?',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true
};

const answers = [
    'Di dekatmu!',
    'Jauh di sana.',
    'Di tempat yang tidak kamu duga.',
    'Di hatimu.',
    'Di sekitar sini.',
    'Hmm, coba cari di kamar.',
    'Di luar sana, menunggumu.',
    'Di tempat yang sama denganmu.',
    'Di suatu tempat yang indah.',
    'Di balik pintu.',
    'Di sebelah kirimu.',
    'Di depan matamu!',
    'Jauh banget, di luar negeri mungkin?',
    'Di tempat yang penuh kenangan.',
    'Di mana-mana!',
    'Di dunia maya.',
    'Di alam mimpi.',
    'Di tempat rahasia.',
    'Hmm, susah dijelaskan lokasinya.',
    'Di tempat yang akan membuatmu bahagia.'
];

async function handler(m) {
    const text = m.text?.trim();
    
    if (!text) {
        return m.reply(`📍 *ᴅɪᴍᴀɴᴀ*\n\n> Masukkan pertanyaan!\n\n*Contoh:*\n> .dimana jodohku berada?`);
    }
    
    const answer = answers[Math.floor(Math.random() * answers.length)];
    
    await m.reply(`${m.body.slice(1)}?
*${answer}*`);
}

export { pluginConfig as config, handler }