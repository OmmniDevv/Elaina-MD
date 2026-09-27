/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


/*
wa.me/6282285357346
github: https://github.com/sadxzyq
Instagram: https://instagram.com/tulisan.ku.id
ini wm gw cok jan di hapus
*/

const pluginConfig = {
  name: "listown",
  alias: ["er", "ers"],
  category: "owner",
  description: "Imported from Rimuru MD V4.6",
  usage: "",
  example: "",
  isOwner: true,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 1,
  isEnabled: true,
};

async function handler(m, {
	sock,
	text,
	prefix
}) {
    const conn = sock;
    const usedPrefix = prefix || m.prefix || ".";
	let response = "• *OWNER SUBSCRIPTION*\n\n";
	let totalOwner = 0;

	for (let user in global.db.data.users) {
		if (global.db.data.users[user].owner) {
			let number = user.split("@")[0];
			let name = global.db.data.users[user].name || "";
			let days = Math.abs(Math.floor((global.db.data.users[user].ownerTime - new Date()) / (24 * 60 * 60 * 1000)));
			let hours = Math.abs(Math.floor((global.db.data.users[user].ownerTime - new Date()) / (60 * 60 * 1000))) % 24;
			let minutes = Math.abs(Math.floor((global.db.data.users[user].ownerTime - new Date()) / (60 * 1000))) % 60;

			response += `∝───────•••───────\n◦  *${number}*\n•  ${name}\n*Active period*: ${days} Hari ${hours} Jam ${minutes} Menit\n∝───────•••───────\n`;

			totalOwner++;
		}
	}

	response += `┌  ◦  Total Owner : *${totalOwner}*\n`;
	response += "└  ◦  Upgrade Owner: *.owner*";

	m.reply(response, m.from, {
		contextInfo: {
			mentionedJid: Object.keys(global.db.data.users).filter(jid => global.db.data.users[jid].owner)
		}
	});
}

export { pluginConfig as config, handler };
