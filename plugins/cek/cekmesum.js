/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
  name: "cekmesum",
  alias: ["mesum"],
  category: "cek",
  description: "Cek seberapa mesum kamu",
  usage: ".cekmesum <nama>",
  example: ".cekmesum Budi",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

async function handler(m) {
  const percent = Math.floor(Math.random() * 101);
  const mentioned = m.mentionedJid[0] || m.sender;

  let desc = "";
  if (percent >= 90) {
    desc = "MESUM AKUT! Tobat mas! 😳🔞";
  } else if (percent >= 70) {
    desc = "Mesum banget! 👀";
  } else if (percent >= 50) {
    desc = "Lumayan mesum 😏";
  } else if (percent >= 30) {
    desc = "Sedikit mesum 🙈";
  } else {
    desc = "Polos dan suci! 😇";
  }

  let txt =
    mentioned === m.sender
      ? `Hai @${mentioned.split("@")[0]}
    
Tingkat kemesuman kamu *${percent}%*
\`\`\`${desc}\`\`\``
      : `Kamu ingin ngecek tingkat kemesuman @${mentioned.split("@")[0]} yak? 
    
Tingkat kemesuman dia sebesar *${percent}%*
\`\`\`${desc}\`\`\``;

  await m.reply(txt, { mentions: [mentioned] });
}

export { pluginConfig as config, handler };
