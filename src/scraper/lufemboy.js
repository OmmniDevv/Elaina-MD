/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

function cekfemboy(nama) {
    try {
        if (!nama) throw new Error('Masukkan nama dulu dong!');
        
        const percent = Math.floor(Math.random() * 101);
        let desc = '';
        let imgUrl = '';
        
        if (percent < 20) {
            desc = 'Cowok banget! 😎';
            imgUrl = 'https://cek-seberapa-femboy.vercel.app/img/normal.gif';
        } else if (percent < 40) {
            desc = 'Ada aura lembutnya dikit~ 🌸';
            imgUrl = 'https://cek-seberapa-femboy.vercel.app/img/dibwh40.gif';
        } else if (percent < 60) {
            desc = 'Lumayan femboy 😘';
            imgUrl = 'https://cek-seberapa-femboy.vercel.app/img/dibwh60.gif';
        } else if (percent < 80) {
            desc = 'Femboy sejati 💅✨';
            imgUrl = 'https://cek-seberapa-femboy.vercel.app/img/dibwh80.gif';
        } else {
            desc = 'FEMBOY DEWA 🔥💖';
            imgUrl = 'https://cek-seberapa-femboy.vercel.app/img/femboyyyy.gif';
        }
        
        return {
            hasil: `${nama}, kamu ${percent}% femboy!, ${desc}`,
            gif: imgUrl
        };
    } catch (error) {
        throw new Error(error.message);
    }
}

export default cekfemboy