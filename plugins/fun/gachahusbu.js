/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";
import { getDatabase } from "../../src/lib/elaina-database.js";
import te from "../../src/lib/elaina-error.js";
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@rexxhayanasi/elaina-baileys';

const pluginConfig = {
  name: ["gachahusbu", "husbuaction", "tinggalinhusbu", "husbuku", "suamiku"],
  alias: ["gachasuami"],
  category: "fun",
  description: "Gacha husbu impianmu, rebut hatinya, dan jadikan dia pasanganmu!",
  usage: ".gachahusbu | .husbuku | .tinggalinhusbu",
  example: ".gachahusbu",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 2,
  isEnabled: true,
};

const husbuPool = [
  // Common (50% weight)
  { name: "Yuji Itadori", age: 16, height: "173 cm", weight: "80 kg", tier: "Common", keyword: "Yuji Itadori aesthetic icon", weightChance: 50 },
  { name: "Denji", age: 17, height: "173 cm", weight: "65 kg", tier: "Common", keyword: "Denji aesthetic icon", weightChance: 50 },
  { name: "Loid Forger", age: 28, height: "187 cm", weight: "75 kg", tier: "Common", keyword: "Loid Forger aesthetic", weightChance: 50 },
  { name: "Tanjiro Kamado", age: 15, height: "165 cm", weight: "61 kg", tier: "Common", keyword: "Tanjiro Kamado icon", weightChance: 50 },
  { name: "Zenitsu Agatsuma", age: 16, height: "164.5 cm", weight: "58 kg", tier: "Common", keyword: "Zenitsu Agatsuma aesthetic", weightChance: 50 },
  { name: "Izuku Midoriya", age: 16, height: "166 cm", weight: "60 kg", tier: "Common", keyword: "Izuku Midoriya anime icon", weightChance: 50 },
  { name: "Katsuki Bakugo", age: 16, height: "172 cm", weight: "63 kg", tier: "Common", keyword: "Katsuki Bakugo aesthetic", weightChance: 50 },
  { name: "Tobio Kageyama", age: 16, height: "181 cm", weight: "66 kg", tier: "Common", keyword: "Tobio Kageyama icon", weightChance: 50 },
  { name: "Asta", age: 16, height: "155 cm", weight: "55 kg", tier: "Common", keyword: "Asta Black Clover aesthetic", weightChance: 50 },
  { name: "Toge Inumaki", age: 17, height: "164 cm", weight: "58 kg", tier: "Common", keyword: "Toge Inumaki aesthetic icon", weightChance: 50 },

  // Rare (30% weight)
  { name: "Megumi Fushiguro", age: 15, height: "175 cm", weight: "60 kg", tier: "Rare", keyword: "Megumi Fushiguro aesthetic icon", weightChance: 30 },
  { name: "Shoto Todoroki", age: 16, height: "176 cm", weight: "62 kg", tier: "Rare", keyword: "Shoto Todoroki aesthetic", weightChance: 30 },
  { name: "Giyuu Tomioka", age: 21, height: "176 cm", weight: "69 kg", tier: "Rare", keyword: "Giyuu Tomioka aesthetic icon", weightChance: 30 },
  { name: "Sanji", age: 21, height: "180 cm", weight: "66 kg", tier: "Rare", keyword: "Sanji one piece aesthetic", weightChance: 30 },
  { name: "Roronoa Zoro", age: 21, height: "181 cm", weight: "71 kg", tier: "Rare", keyword: "Roronoa Zoro aesthetic", weightChance: 30 },
  { name: "Diluc", age: 22, height: "185 cm", weight: "72 kg", tier: "Rare", keyword: "Diluc aesthetic icon", weightChance: 30 },
  { name: "Kamisato Ayato", age: 24, height: "188 cm", weight: "75 kg", tier: "Rare", keyword: "Kamisato Ayato aesthetic icon", weightChance: 30 },
  { name: "Tenguzui Uzui", age: 23, height: "198 cm", weight: "95 kg", tier: "Rare", keyword: "Tengen Uzui aesthetic", weightChance: 30 },
  { name: "Kyojuro Rengoku", age: 20, height: "177 cm", weight: "72 kg", tier: "Rare", keyword: "Kyojuro Rengoku aesthetic", weightChance: 30 },

  // Epic (15% weight)
  { name: "Levi Ackerman", age: 30, height: "160 cm", weight: "65 kg", tier: "Epic", keyword: "Levi Ackerman aesthetic icon", weightChance: 15 },
  { name: "Itachi Uchiha", age: 21, height: "178 cm", weight: "58 kg", tier: "Epic", keyword: "Itachi Uchiha aesthetic icon", weightChance: 15 },
  { name: "Kakashi Hatake", age: 30, height: "181 cm", weight: "67 kg", tier: "Epic", keyword: "Kakashi Hatake aesthetic", weightChance: 15 },
  { name: "Zhongli", age: 6000, height: "190 cm", weight: "80 kg", tier: "Epic", keyword: "Zhongli aesthetic icon", weightChance: 15 },
  { name: "Tartaglia (Childe)", age: 21, height: "185 cm", weight: "74 kg", tier: "Epic", keyword: "Tartaglia Genshin aesthetic", weightChance: 15 },
  { name: "Neuvillette", age: 500, height: "188 cm", weight: "75 kg", tier: "Epic", keyword: "Neuvillette aesthetic icon", weightChance: 15 },
  { name: "Jing Yuan", age: 700, height: "185 cm", weight: "75 kg", tier: "Epic", keyword: "Jing Yuan honkai star rail aesthetic", weightChance: 15 },
  { name: "Dan Heng", age: 25, height: "180 cm", weight: "70 kg", tier: "Epic", keyword: "Dan Heng IL aesthetic icon", weightChance: 15 },
  { name: "Aventurine", age: 22, height: "183 cm", weight: "73 kg", tier: "Epic", keyword: "Aventurine honkai star rail aesthetic", weightChance: 15 },
  { name: "Kaeluc (Kaeya)", age: 22, height: "186 cm", weight: "75 kg", tier: "Epic", keyword: "Kaeya Genshin aesthetic", weightChance: 15 },

  // Legendary (5% weight)
  { name: "Gojo Satoru", age: 28, height: "190 cm", weight: "85 kg", tier: "Legendary", keyword: "Gojo Satoru aesthetic icon", weightChance: 5 },
  { name: "Ryomen Sukuna", age: 1000, height: "173 cm", weight: "80 kg", tier: "Legendary", keyword: "Sukuna aesthetic icon", weightChance: 5 },
  { name: "Toji Fushiguro", age: 30, height: "185 cm", weight: "90 kg", tier: "Legendary", keyword: "Toji Fushiguro aesthetic", weightChance: 5 },
  { name: "Gilgamesh", age: 3000, height: "182 cm", weight: "68 kg", tier: "Legendary", keyword: "Gilgamesh Fate aesthetic", weightChance: 5 },
  { name: "Sesshomaru", age: 900, height: "185 cm", weight: "75 kg", tier: "Legendary", keyword: "Sesshomaru aesthetic icon", weightChance: 5 },
  { name: "Alhaitham", age: 25, height: "188 cm", weight: "76 kg", tier: "Legendary", keyword: "Alhaitham aesthetic icon", weightChance: 5 },
  { name: "Dazai Osamu", age: 22, height: "181 cm", weight: "67 kg", tier: "Legendary", keyword: "Dazai Osamu aesthetic", weightChance: 5 },
];

async function getHusbuImage(keyword) {
  try {
    const res = await axios.get(`https://api.cuki.biz.id/api/search/pinterest?apikey=cuki-x&query=${encodeURIComponent(keyword)}&type=image`);
    const results = res.data?.data?.results;
    if (results && results.length > 0) {
      const validImages = results.filter((item) => item.image_url);
      if (validImages.length > 0) {
        const limit = Math.min(15, validImages.length);
        return validImages[Math.floor(Math.random() * limit)].image_url;
      }
    }
  } catch (e) {
    console.error("[GachaHusbu] Pinterest API error:", e.message);
  }
  return "https://i.pinimg.com/736x/8f/3e/2a/8f3e2a77ec65cdbcfad4ff3bc17e825f.jpg"; // Placeholder fall-back
}

async function getBuffer(url) {
  try {
    const res = await axios.get(url, { responseType: "arraybuffer", timeout: 15000 });
    return Buffer.from(res.data);
  } catch {
    return null;
  }
}

function rollHusbu() {
  const totalWeight = husbuPool.reduce((acc, h) => acc + h.weightChance, 0);
  let random = Math.random() * totalWeight;
  for (const husbu of husbuPool) {
    random -= husbu.weightChance;
    if (random <= 0) return husbu;
  }
  return husbuPool[husbuPool.length - 1];
}

async function sendHusbuMessage(m, sock, husbu, textContent, customButtons = null) {
  let imgBuffer = null;
  if (husbu.imageUrl) {
    imgBuffer = await getBuffer(husbu.imageUrl);
  }
  if (!imgBuffer) {
    const newUrl = await getHusbuImage(husbu.keyword);
    husbu.imageUrl = newUrl;
    imgBuffer = await getBuffer(newUrl) || Buffer.alloc(0);
  }

  const media = await prepareWAMessageMedia(
    { image: imgBuffer },
    { upload: sock.waUploadToServer }
  );

  let buttons = customButtons;
  if (!buttons) {
    if (husbu.affection < 80) {
      buttons = [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🚶‍♀️ Jalan-jalan", id: `${m.prefix}husbuaction jalanjalan` }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "☕ Nongkrong di Kafe", id: `${m.prefix}husbuaction kafe` }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🎬 Nonton Bioskop", id: `${m.prefix}husbuaction bioskop` }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🛍️ Beli Baju", id: `${m.prefix}husbuaction belanja` }) },
      ];
    } else if (husbu.affection < 100) {
      buttons = [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🫂 Peluk Punggungnya", id: `${m.prefix}husbuaction peluk` }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "💋 Cium Pipinya", id: `${m.prefix}husbuaction cium` }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🛏️ Tidur Bareng", id: `${m.prefix}husbuaction tidur` }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🛁 Mandi Bareng", id: `${m.prefix}husbuaction mandi` }) },
      ];
    } else {
      if (!husbu.married) {
        buttons = [
          { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "💍 Terima Lamarannya", id: `${m.prefix}husbuaction nikah` }) },
          { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "💝 Minta Uang Belanja", id: `${m.prefix}husbuaction hadiah` }) },
        ];
      } else {
        buttons = [
          { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "👨‍👩‍👦 Habiskan Waktu Bersama", id: `${m.prefix}husbuaction mesra` }) },
          { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "💌 Goda Suamimu", id: `${m.prefix}husbuaction rayu` }) },
        ];
      }
    }
  }

  let footerText = "❤️ Buat dia luluh dan jatuh cinta padamu!";
  if (customButtons) footerText = "💭 Dia menunggu jawabanmu...";
  else if (husbu.married) footerText = "❤️ Kamu adalah istrinya yang sah!";

  const msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
        },
        interactiveMessage: {
          body: { text: textContent },
          footer: { text: footerText },
          header: {
            title: `🌟 *${husbu.tier.toUpperCase()} TIER HUSBANDO* 🌟`,
            subtitle: husbu.name,
            hasMediaAttachment: true,
            imageMessage: media.imageMessage
          },
          nativeFlowMessage: { buttons }
        }
      }
    }
  }, { quoted: m });

  await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
}

async function handler(m, { sock }) {
  const db = getDatabase();
  const user = db.getUser(m.sender);
  if (!user) return;

  const cmd = m.command.toLowerCase();
  if (cmd === "husbuku" || cmd === "suamiku") {
    if (!user.husbu) {
      return m.reply(`⚠️ *Kamu belum memiliki husbu!*\nSilakan ketik *${m.prefix}gachahusbu* untuk memulainya!`);
    }
    m.react("🕕");
    const husbu = user.husbu;
    let statusPernikahan = husbu.married ? "Telah Menikah 💍" : "Pendekatan 💖";
    const textContent = `📸 *STATUS HUSBU KAMU* 📸\n\n` +
      `💖 *Nama Lengkap:* ${husbu.name}\n` +
      `🎂 *Usia:* ${husbu.age} tahun\n` +
      `💎 *Tier:* ${husbu.tier}\n` +
      `💞 *Affection:* ${husbu.affection}/100\n` +
      `💍 *Status:* ${statusPernikahan}\n\n` +
      `Lanjutkan interaksi dengan memilih salah satu aksi kencan di bawah ini!`;

    m.react("✅");
    return await sendHusbuMessage(m, sock, husbu, textContent, null);
  }
  if (cmd === "tinggalinhusbu") {
    if (!user.husbu) {
      return m.reply(`⚠️ *Kamu bahkan belum punya husbu!* Cari dulu gih!`);
    }

    const husbuName = user.husbu.name;
    const husbuJid = 'husbu_' + husbuName.replace(/\s+/g, '') + '@s.whatsapp.net';
    if (user.husbu.married) {
      if (user.fun && user.fun.pasangan === husbuJid) {
        user.fun.pasangan = "";
      }
      db.setUser(husbuJid, { fun: { pasangan: "" } });
    }

    delete user.husbu;
    db.setUser(m.sender, user);

    m.react("💔");
    return m.reply(
      `💔 *KAMU MENCAMPAKKAN ${husbuName.toUpperCase()}!*\n\n` +
      `Kamu mengembalikan barang-barangnya dan memintanya untuk pergi. ` +
      `Dia menatapmu dengan mata kecewa yang mendalam, berbalik tanpa sepatah kata pun, lalu menghilang di tengah hujan.\n\n` +
      `Kalian kini resmi berpisah.`
    );
  }
  if (cmd === "gachahusbu" || cmd === "gachasuami") {
    if (user.husbu) {
      m.react("😡");
      let pesanStatus = user.husbu.married ? "Dia sudah menjadi suamimu!" : "Dia sedang berusaha meluluhkan hatimu!";
      return m.reply(
        `⚠️ *Kamu sudah memiliki Husbu!*\n\n` +
        `Nama: *${user.husbu.name}*\n` +
        `Tier: *${user.husbu.tier}*\n` +
        `Affection: *${user.husbu.affection}/100*\n\n` +
        `Jangan serakah! Jaga husbu yang kamu miliki sekarang. ${pesanStatus} Ketik *${m.prefix}husbuku* untuk berinteraksi dengannya.`
      );
    }

    const sub = (m.args[0] || "").toLowerCase();

    if (sub !== "start") {
      const panduan = `💕 *SISTEM GACHA HUSBU* 💕\n\n` +
        `Simulasi kencan virtual interaktif untuk mendapatkan laki-laki anime idamanmu! Tarik perhatiannya, buat dia jatuh cinta, dan nikahi dia!\n\n` +
        `*PENGGUNAAN COMMAND:*\n` +
        `• *${m.prefix}gachahusbu* — Membuka menu panduan ini\n` +
        `• *${m.prefix}husbuku* — Membuka panel interaksi dengan husbumu\n` +
        `• *${m.prefix}tinggalinhusbu* — Mencampakkan husbu dan mereset status\n\n` +
        `*PENJELASAN ALUR CERITA:*\n` +
        `1. Tekan tombol **Mulai Gacha** di bawah untuk memanggil cowok terganteng ke kehidupanmu.\n` +
        `2. Akan ada 3 Fase Hubungan berdasarkan Poin Cinta (Affection).\n` +
        `3. *Fase Pendekatan (< 80)*: Pilih rute kencan! Setiap pilihanmu akan memengaruhi perasaannya padamu.\n` +
        `4. *Fase Intim (80 - 99)*: Kalau dia sudah nyaman, interaksi yang lebih mesra akan terbuka. Tapi jangan kelewat batas sebelum waktunya, atau dia bakal *ilfeel*!\n` +
        `5. *Fase Menikah (100)*: Buat dia bertekuk lutut dan melamarmu untuk mendapatkan *Reward Eksklusif* berupa koin dan limit!`;

      const msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
          message: {
            messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
            interactiveMessage: {
              body: { text: panduan },
              footer: { text: "Tekan tombol di bawah untuk memanggil calon jodohmu!" },
              nativeFlowMessage: {
                buttons: [
                  { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🎲 Panggil Husbando Sekarang!", id: `${m.prefix}gachahusbu start` }) }
                ]
              }
            }
          }
        }
      }, { quoted: m });
      return await sock.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    }

    m.react("🕕");
    try {
      const husbuData = rollHusbu();
      const husbu = {
        ...husbuData,
        affection: 50,
        married: false,
        imageUrl: await getHusbuImage(husbuData.keyword)
      };

      user.husbu = husbu;
      db.setUser(m.sender, user);

      const textContent = `🎉 *KYAAA! KAMU MENDAPATKAN HUSBANDO BARU!* 🎉\n\n` +
        `💖 *Nama Lengkap:* ${husbu.name}\n` +
        `🎂 *Usia:* ${husbu.age} tahun\n` +
        `📏 *Tinggi Badan:* ${husbu.height}\n` +
        `⚖️ *Berat Badan:* ${husbu.weight}\n` +
        `💎 *Tier:* ${husbu.tier}\n` +
        `💞 *Affection:* ${husbu.affection}/100\n\n` +
        `Silakan pilih interaksi di bawah ini untuk memulai PDKT. Jawab dengan hati-hati agar perasaannya padamu semakin dalam!`;

      m.react("✅");
      await sendHusbuMessage(m, sock, husbu, textContent, null);
    } catch (err) {
      console.error(err);
      m.react("☢");
      return m.reply(te(m.prefix, m.command, m.pushName));
    }
    return;
  }
  if (cmd === "husbuaction") {
    if (!user.husbu) {
      m.react("❌");
      return m.reply(`Kamu belum memiliki husbu! Silakan ketik *${m.prefix}gachahusbu* untuk mendapatkan husbando pertamamu.`);
    }

    const action = (m.args[0] || "").toLowerCase();
    let husbu = user.husbu;
    let responseText = "";
    let affectionChange = 0;
    if (action === "jalanjalan") {
      return sendHusbuMessage(m, sock, husbu, `Kamu dan *${husbu.name}* sedang jalan berdua. Dia terlihat bosan. Ingin membawanya kemana?`, [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🌳 Ke Taman Piknik", id: `${m.prefix}husbuaction kencan_taman` }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🎢 Ke Taman Bermain", id: `${m.prefix}husbuaction kencan_mall` }) }
      ]);
    }
    if (action === "kafe") {
      return sendHusbuMessage(m, sock, husbu, `*${husbu.name}* mentraktirmu di kafe favoritnya. Saat memesan kopi, dia menanyakan selera minumanmu.`, [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "☕ Kopi Pahit", id: `${m.prefix}husbuaction kencan_kopi` }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🍓 Strawberry Milk", id: `${m.prefix}husbuaction kencan_matcha` }) }
      ]);
    }
    if (action === "bioskop") {
      return sendHusbuMessage(m, sock, husbu, `Kalian pergi nonton ke bioskop. Dia menyuruhmu memilih filmnya. Film apa yang kamu pilih?`, [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "💥 Film Action", id: `${m.prefix}husbuaction kencan_romantis` }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "👻 Film Horor", id: `${m.prefix}husbuaction kencan_horor` }) }
      ]);
    }
    if (action === "belanja") {
      return sendHusbuMessage(m, sock, husbu, `Kalian pergi ke pusat perbelanjaan. *${husbu.name}* menawarkan membelikan sesuatu untukmu. Kamu minta apa?`, [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "👕 Jaket Keren Pasangan", id: `${m.prefix}husbuaction kencan_baju` }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "💍 Cincin Mewah", id: `${m.prefix}husbuaction kencan_perhiasan` }) }
      ]);
    }
    const rejectIntimate = async () => {
      husbu.affection -= (Math.floor(Math.random() * 30) + 30);
      if (husbu.affection < 0) husbu.affection = 0;
      let outText = `💢 *HENTIKAN!* Kamu bertindak terlalu agresif di saat perasaannya masih samar! *${husbu.name}* menepis tanganmu dengan wajah marah dan kecewa! "Kamu menganggapku apa?!" bentaknya.`;
      await processAffection(outText, husbu.affection);
    };

    if (["peluk", "cium", "tidur", "mandi"].includes(action) && husbu.affection < 80) {
      return await rejectIntimate();
    }

    if (action === "peluk") {
      return sendHusbuMessage(m, sock, husbu, `Kamu melihat punggung lebar *${husbu.name}*. Kesempatan bagus, kamu memeluknya! Di bagian mana?`, [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🤗 Peluk Pinggangnya", id: `${m.prefix}husbuaction intim_belakang` }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "💪 Pegang Tangannya Erat", id: `${m.prefix}husbuaction intim_depan` }) }
      ]);
    }
    if (action === "cium") {
      return sendHusbuMessage(m, sock, husbu, `Wajahnya sangat dekat menatapmu dengan tajam. Kamu memberanikan diri menciumnya. Di mana?`, [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "😚 Cium Pipinya", id: `${m.prefix}husbuaction intim_kening` }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "💋 Cium Bibirnya", id: `${m.prefix}husbuaction intim_bibir` }) }
      ]);
    }
    if (action === "tidur") {
      return sendHusbuMessage(m, sock, husbu, `Malam larut, kalian berada di kamar berdua. Dia menarikmu ke pelukannya. Apa reaksimu?`, [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🫂 Senderan di Dadanya", id: `${m.prefix}husbuaction intim_kelon` }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🔥 Balas Dengan Gairah", id: `${m.prefix}husbuaction intim_panas` }) }
      ]);
    }
    if (action === "mandi") {
      return sendHusbuMessage(m, sock, husbu, `*${husbu.name}* menarikmu masuk ke kamar mandi bersamanya. Wajahnya tersenyum menggoda. Apa yang kamu lakukan?`, [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🛁 Membasuh Punggungnya", id: `${m.prefix}husbuaction intim_punggung` }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🧼 Usap Dadanya yang Bidang", id: `${m.prefix}husbuaction intim_bahu` }) }
      ]);
    }

    if (action === "kencan_taman") {
      affectionChange = Math.floor(Math.random() * 10) + 10;
      responseText = `🌳 *${husbu.name}* sangat menikmati angin sejuk dan menghabiskan waktu dengan tiduran di pangkuanmu di taman.`;
    }
    else if (action === "kencan_mall") {
      affectionChange = Math.floor(Math.random() * 15) + 10;
      responseText = `🎢 Bermain di taman bermain ternyata sangat seru baginya! *${husbu.name}* memenangkan boneka beruang besar dan memberikannya padamu.`;
    }
    else if (action === "kencan_kopi") {
      affectionChange = Math.floor(Math.random() * 10) + 10;
      responseText = `☕ "Pilihan yang elegan," pujinya padamu. Kalian meminum kopi pahit sambil mengobrol seru, dia terlihat sangat nyaman mengobrol denganmu.`;
    }
    else if (action === "kencan_matcha") {
      affectionChange = -(Math.floor(Math.random() * 10) + 5);
      responseText = `🍓 Dia membelikanmu minuman manis, tapi rupanya obrolan kalian sedikit kurang nyambung. Dia tampak agak bosan dan diam saja.`;
    }
    else if (action === "kencan_romantis") {
      affectionChange = Math.floor(Math.random() * 15) + 10;
      responseText = `💥 Nonton film action adalah hal favoritnya! Sepanjang film dia memegang tanganmu dengan erat karena terlalu seru.`;
    }
    else if (action === "kencan_horor") {
      affectionChange = Math.floor(Math.random() * 5) + 5;
      responseText = `👻 *JUMPSCARE!* Kamu refleks melompat memeluknya. Dia sedikit tertawa tapi kemudian mendekapmu untuk melindungimu dari rasa takut.`;
    }
    else if (action === "kencan_baju") {
      affectionChange = Math.floor(Math.random() * 15) + 10;
      responseText = `👕 Dia membelikanmu jaket couple yang sangat cocok! Dia tersenyum bangga melihatmu memakai pakaian kembar dengannya.`;
    }
    else if (action === "kencan_perhiasan") {
      affectionChange = -(Math.floor(Math.random() * 10) + 10);
      responseText = `💍 "Uangku tidak sebanyak itu bulan ini," keluhnya sambil mendesah berat. Dia menolak membelikannya dan merasa kamu terlalu materialistis.`;
    }
    else if (action === "intim_belakang") {
      affectionChange = Math.floor(Math.random() * 10) + 10;
      responseText = `🤗 Dia terkejut saat kamu memeluk pinggangnya dari belakang, namun telinganya memerah. Dia mengelus tanganmu pelan.`;
    }
    else if (action === "intim_depan") {
      affectionChange = Math.floor(Math.random() * 15) + 10;
      responseText = `💪 Kamu memegang tangannya dengan erat. Dia tersenyum lembut dan balik menggenggam tanganmu sambil menatap matamu dalam-dalam.`;
    }
    else if (action === "intim_kening") {
      affectionChange = Math.floor(Math.random() * 10) + 5;
      responseText = `😚 Kamu mengecup pipinya. Dia terkekeh pelan dan membalas mengecup keningmu dengan sangat hangat.`;
    }
    else if (action === "intim_bibir") {
      affectionChange = Math.floor(Math.random() * 20) + 10;
      responseText = `💋 Kamu mencium bibirnya secara mendadak. Dia membulatkan matanya sesaat sebelum menarik pinggangmu dan membalas lumatannya dengan ganas.`;
    }
    else if (action === "intim_kelon") {
      affectionChange = Math.floor(Math.random() * 15) + 10;
      responseText = `🫂 Kamu merebahkan kepala di dadanya yang bidang. Dia mengelus rambutmu perlahan sambil membisikkan betapa berartinya dirimu baginya.`;
    }
    else if (action === "intim_panas") {
      affectionChange = Math.floor(Math.random() * 20) + 15;
      responseText = `🔥 Kamu menatap matanya dengan penuh gairah. Dia menyeringai tipis, "Kau yang memintanya..." ucapnya dengan suara serak yang seksi sebelum menerkammu.`;
    }
    else if (action === "intim_punggung") {
      affectionChange = Math.floor(Math.random() * 10) + 10;
      responseText = `🛁 Kamu membasuh punggungnya perlahan. Sentuhan tanganmu membuatnya rileks dan ia menghembuskan napas lega sambil memejamkan mata.`;
    }
    else if (action === "intim_bahu") {
      affectionChange = Math.floor(Math.random() * 15) + 15;
      responseText = `🧼 Saat kamu mengusap dadanya yang bidang, dia menarik napas tajam dan meraih tanganmu. "Kau sengaja menggodaku, ya?" bisiknya.`;
    }
    else if (action === "nikah") {
      if (husbu.affection < 100) return m.reply(`⚠️ Poin affection belum mencapai 100! Tunggu sampai dia benar-benar melamarmu!`);
      if (husbu.married) return m.reply(`⚠️ Kalian kan sudah menikah!`);

      husbu.married = true;
      user.limit = (user.limit || 0) + 5000;
      user.koin = (user.koin || 0) + 100000;

      if (!user.fun) user.fun = {};
      const husbuJid = 'husbu_' + husbu.name.replace(/\s+/g, '') + '@s.whatsapp.net';
      user.fun.pasangan = husbuJid;
      db.setUser(husbuJid, { fun: { pasangan: m.sender }, name: husbu.name });

      responseText = `💍 *KAMU RESMI MENERIMA LAMARAN ${husbu.name.toUpperCase()}!* 💍\n\nDia berlutut di hadapanmu sambil menyodorkan cincin berlian yang indah, "Maukah kau menjadi istriku selamanya?" tanyanya. Saat kamu mengangguk, dia langsung menggendong dan menciummu penuh kebahagiaan!\n\nSebagai Nafkah pertama darinya, kamu mendapatkan:\n- ⚡ 5000 Limit/Energi\n- 💰 100,000 Saldo/Koin\n\nStatus kamu di fitur \`.cekpacar\` kini resmi berpasangan dengannya!`;
      affectionChange = 0;
    }
    else if (action === "hadiah") {
      if (husbu.affection < 100) return m.reply(`⚠️ Suamimu sedang sibuk bekerja, jangan diganggu!`);
      affectionChange = 0;
      user.koin = (user.koin || 0) + 5000;
      responseText = `💝 *${husbu.name}* memberikan kartu kreditnya kepadamu sambil tersenyum, "Pakai saja sepuasnya, Sayang."\nKamu mendapatkan 💰 5,000 Koin dari suamimu!`;
    }
    else if (["mesra", "rayu"].includes(action)) {
      if (!husbu.married) return m.reply(`Aksi ini hanya untuk pasangan suami istri!`);
      affectionChange = 0;
      responseText = `👨‍👩‍👦 Kalian berdua menikmati makan malam romantis yang damai. Tatapan cintanya tidak pernah luntur, dia sangat bersyukur memilikimu sebagai istrinya.`;
    }
    else {
      m.react("❓");
      return m.reply(`Aksi tidak dikenali. Silakan gunakan interaksi pada tombol.`);
    }

    async function processAffection(customResponseText, currentAffectionVal) {
      let finalResponseText = customResponseText || responseText;
      husbu.affection += affectionChange;
      if (husbu.affection > 100) husbu.affection = 100;
      if (husbu.affection < 0) husbu.affection = 0;

      let sign = affectionChange > 0 ? "+" : "";
      let affectionText = `💞 *Affection berubah:* ${sign}${affectionChange} (Total: ${husbu.affection}/100)`;
      if (husbu.affection === 100) affectionText = `💞 *Affection MAKSIMAL! (100/100)*`;
      if (affectionChange === 0) affectionText = `💞 *Affection:* ${husbu.affection}/100`;

      if (husbu.affection <= 0) {
        const leavingText = `💔 *${husbu.name.toUpperCase()} MENINGGALKANMU SELAMANYA!* 💔\n\n${finalResponseText}\n\n${affectionText}\n\nKarena kasih sayangnya padamu telah benar-benar habis (mencapai 0), dia mengemasi seluruh barang-barangnya. Saat kamu mencoba menahannya, dia menepis tanganmu. "Hubungan kita cukup sampai di sini," ucapnya dingin sebelum pergi. Kamu telah kehilangan suamimu! Silakan cari husbu lain jika hatimu sudah siap.\n*(Ketik ${m.prefix}gachahusbu untuk memulai ulang)*`;

        if (husbu.married) {
          const husbuJid = 'husbu_' + husbu.name.replace(/\s+/g, '') + '@s.whatsapp.net';
          if (user.fun && user.fun.pasangan === husbuJid) user.fun.pasangan = "";
          db.setUser(husbuJid, { fun: { pasangan: "" } });
        }

        delete user.husbu;
        db.setUser(m.sender, user);

        m.react("💔");
        return m.reply(leavingText);
      }

      user.husbu = husbu;
      db.setUser(m.sender, user);

      const updatedText = `${finalResponseText}\n\n${affectionText}`;
      m.react(husbu.affection === 100 ? "💍" : "✨");
      await sendHusbuMessage(m, sock, husbu, updatedText, null);
    }

    await processAffection();
  }
}

export { pluginConfig as config, handler };
