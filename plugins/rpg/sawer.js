/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


const pluginConfig = {
  name: "sawer",
  alias: ["nyawer"],
  category: "rpg",
  description: "Imported from Rimuru MD V4.6",
  usage: "",
  example: "",
  isOwner: false,
  isPremium: false,
  isGroup: true,
  isPrivate: false,
  cooldown: 3,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { groupMetadata, command, sock, text, args, prefix }) {
    const conn = sock;
    const usedPrefix = prefix || m.prefix || ".";
    //if (!Number(text)) throw 'Masukkan Angka';
    if (!args[0] || isNaN(args[0])) {
		throw '*Example*: .sawer 1000';
	};
	let count = parseInt(args[0]);
    let ps = groupMetadata.participants.map(v => v.id);
    let a = ps[Math.floor(Math.random() * ps.length)]; // Memilih secara acak peserta dari array ps
    let name = await conn.getName(m.sender);
    let user = global.db.data.users[m.sender];
    let aa = global.db.data.users[a];
    
    if (user.money < count) return m.reply(`money kamu tidak cukup untuk sawer sebanyak ${count}`)

    let hsl = `*@${a.split`@`[0]}* Kamu mendapatkan saweran dari @${m.sender.split`@`[0]} sebesar *${count}* `;
    user.money -= count;
    aa.money += count;

    conn.reply(m.chat, hsl, m);
}

handler.register = true;

export { pluginConfig as config, handler };
