const threshold = 0.72

let handler = m => m

handler.before = async function (m) {
    let id = m.chat;
    this.game = this.game ? this.game : {};
    this['asahotak'] = this['asahotak'] ? this['asahotak'] : {};

    if (this.game[id] === 'asahotak' && id in this['asahotak']) {
        if (!m.text) return !0;

        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text.trim());
        if (isSurrender) {
            clearTimeout(this['asahotak'][id][2]);
            let ans = this['asahotak'][id][3] || this['asahotak'][id][1]?.result?.jawaban;
            let ansDisplay = Array.isArray(ans) ? ans.join(' / ') : ans;
            delete this['asahotak'][id];
            delete this.game[id];
            return m.reply(`🏳️ *Kamu Menyerah!*\n\nJawabannya adalah: *${ansDisplay}*`);
        }

        let rawAns = this['asahotak'][id][3] || this['asahotak'][id][1]?.result?.jawaban;
        let input = m.text.toLowerCase().trim();
        let isCorrect = false;

        if (Array.isArray(rawAns)) {
            isCorrect = rawAns.some(a => String(a).toLowerCase().trim() === input);
        } else {
            isCorrect = (input === String(rawAns).toLowerCase().trim());
        }

        if (isCorrect) {
            if (!global.db.data) global.db.data = {};
            if (!global.db.data.users) global.db.data.users = {};
            if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = { exp: 0, limit: 25, coin: 0 };
            
            global.db.data.users[m.sender].exp = (global.db.data.users[m.sender].exp || 0) + 500;
            global.db.data.users[m.sender].coin = (global.db.data.users[m.sender].coin || 0) + 10;

            let extraDesc = this['asahotak'][id][1]?.result?.deskripsi ? `\n\n📝 *Penjelasan:* ${this['asahotak'][id][1].result.deskripsi}` : '';
            m.reply(`🎉 *BENAR!* 🎉\n\nKamu berhasil menjawab dan mendapatkan *+500 XP* & *+10 Koin*!${extraDesc}`);

            clearTimeout(this['asahotak'][id][2]);
            delete this['asahotak'][id];
            delete this.game[id];
        } else {
            let answerStr = Array.isArray(rawAns) ? rawAns.join(' / ') : String(rawAns);
            let answer = answerStr.toLowerCase().trim();
            let isClose = false;
            let matchCount = 0;
            for (let i = 0; i < input.length; i++) {
                if (answer.includes(input[i])) matchCount++;
            }
            if (input.length > 2 && (matchCount / answer.length) >= threshold) {
                isClose = true;
            }

            let isReply = m.quoted && m.quoted.id === this['asahotak'][id][0]?.key?.id;
            if (isReply) {
                if (isClose) m.reply('🔥 *Dikit lagi!*');
                else m.reply('❌ *Salah! Coba lagi.*');
            } else if (!m.quoted && isClose) {
                m.reply('🔥 *Dikit lagi!*');
            }
        }
    }
    return !0;
}

handler.limit = 1;
export default handler;
