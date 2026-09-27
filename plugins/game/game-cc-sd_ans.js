// Answer handler untuk Cerdas Cermat SD (game-cc-sd.js)
// Jawaban berupa huruf A/B/C/D
let handler = m => m

handler.before = async function (m) {
    let id = m.chat;
    this.game = this.game ? this.game : {};
    this['ccsd'] = this['ccsd'] ? this['ccsd'] : {};

    if (this.game[id] === 'ccsd' && id in this['ccsd']) {
        if (!m.text) return !0;

        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text.trim());
        if (isSurrender) {
            clearTimeout(this['ccsd'][id][2]);
            let ans = this['ccsd'][id][3];
            let ansDisplay = String(ans).toUpperCase();
            delete this['ccsd'][id];
            delete this.game[id];
            return m.reply(`🏳️ *Kamu Menyerah!*\n\nJawabannya adalah: *${ansDisplay}*`);
        }

        let rawAns = String(this['ccsd'][id][3] || '').toLowerCase().trim();
        // Ambil huruf pertama aja (biar "jawabannya B" tetap dihitung)
        let input = m.text.toLowerCase().trim().replace(/[^a-z]/g, '').charAt(0) || m.text.toLowerCase().trim();
        let isCorrect = (input === rawAns);

        if (isCorrect) {
            if (!global.db.data) global.db.data = {};
            if (!global.db.data.users) global.db.data.users = {};
            if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = { exp: 0, limit: 25, coin: 0 };

            global.db.data.users[m.sender].exp = (global.db.data.users[m.sender].exp || 0) + 500;
            global.db.data.users[m.sender].coin = (global.db.data.users[m.sender].coin || 0) + 10;

            m.reply(`🎉 *BENAR!* 🎉\n\nJawaban: *${rawAns.toUpperCase()}*\nKamu dapat *+500 XP* & *+10 Koin*!`);

            clearTimeout(this['ccsd'][id][2]);
            delete this['ccsd'][id];
            delete this.game[id];
        } else {
            let isReply = m.quoted && m.quoted.id === this['ccsd'][id][0]?.key?.id;
            if (isReply) {
                m.reply('❌ *Salah! Coba lagi.*');
            }
        }
    }
    return !0;
}

handler.limit = 1;
export default handler;
