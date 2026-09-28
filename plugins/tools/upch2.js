/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


const channels = {}; 

const handler = async (m, { sock, text, command }) => {
  const user = m.sender;
  
  if (command === "setchid") {
    if (!text) return await m.reply("Gunakan: .setchid <id channel>");
    channels[user] = [text];
    return await m.reply(`ID channel berhasil disimpan: ${text}`);
  }

  if (command === "addchid") {
    if (!text) return await m.reply("Gunakan: .addchid <id channel>");
    if (!channels[user]) channels[user] = [];
    if (!channels[user].includes(text)) {
      channels[user].push(text);
      return await m.reply(`ID channel berhasil ditambahkan: ${text}`);
    } else {
      return await m.reply("ID channel sudah ada dalam daftar.");
    }
  }

  if (command === "getchid") {
    const chidList = channels[user];
    return await m.reply(chidList ? `ID channel Anda:\n${chidList.join("\n")}` : "Belum ada ID channel yang disimpan.");
  }

  const chidList = channels[user];
  if (!chidList || chidList.length === 0) return await m.reply("Set dulu ID channel dengan .setchid atau .addchid");

  if (!text && !m.quoted) return await m.reply("Masukkan teks atau reply media dengan teks");

  let messageOptions = {};

  if (m.quoted && m.quoted.mimetype) {
    let mime = m.quoted.mimetype;

    if (/image/.test(mime)) {
      messageOptions = {
        image: await m.quoted.download(),
        caption: text || m.quoted.text || ""
      };
    } else if (/video/.test(mime)) {
      messageOptions = {
        video: await m.quoted.download(),
        caption: text || m.quoted.text || "",
        mimetype: mime
      };
    } else if (/audio/.test(mime)) {
      messageOptions = {
        audio: await m.quoted.download(),
        mimetype: "audio/mp4",
        fileName: "audio.mp3",
        ptt: true,
        contextInfo: {
          forwardingScore: 1,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: chidList[0], 
            serverMessageId: null,
            newsletterName: "Ryo Yamada",
          }
        }
      };
    } else if (/sticker/.test(mime)) {
      messageOptions = {
        sticker: await m.quoted.download()
      };
    }
  } else {
    messageOptions = { text: text };
  }

  for (const chid of chidList) {
    await sock.sendMessage(chid, messageOptions);
  }

  await m.reply("Pesan berhasil dikirim ke semua channel.");
};


export default handler;
const pluginConfig = {
  name: 'upch2',
  alias: ['setchid2', 'addchid2', 'getchid2'],
  category: 'tools',
  description: 'Varian broadcast ke channel dari Tensura.',
  usage: '.upch2 <teks>',
  example: '.upch2 <teks>',
  isOwner: true,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

export { pluginConfig as config, handler };
