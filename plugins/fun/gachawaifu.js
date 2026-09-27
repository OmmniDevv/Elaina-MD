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
  name: ["gachawaifu", "waifuaction", "tinggalinwaifu", "waifuku", "istriku"],
  alias: ["gachaistri"],
  category: "fun",
  description: "Gacha waifu impianmu, jaga perasaannya, dan jadikan dia pasanganmu!",
  usage: ".gachawaifu | .waifuku | .tinggalinwaifu",
  example: ".gachawaifu",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 2,
  isEnabled: true,
};

// semoga  aja game ini seru

const waifuPool = [
  // Common (50% weight)
  { name: "Sakura Haruno", age: 16, height: "161 cm", weight: "45 kg", tier: "Common", keyword: "Sakura Haruno aesthetic icon", weightChance: 50 },
  { name: "Hinata Hyuga", age: 16, height: "160 cm", weight: "45 kg", tier: "Common", keyword: "Hinata Hyuga aesthetic anime", weightChance: 50 },
  { name: "Asuna Yuuki", age: 17, height: "168 cm", weight: "55 kg", tier: "Common", keyword: "Asuna Yuuki icon", weightChance: 50 },
  { name: "Ochako Uraraka", age: 15, height: "156 cm", weight: "43 kg", tier: "Common", keyword: "Ochako Uraraka aesthetic", weightChance: 50 },
  { name: "Nobara Kugisaki", age: 16, height: "160 cm", weight: "45 kg", tier: "Common", keyword: "Nobara Kugisaki anime icon", weightChance: 50 },
  { name: "Nami", age: 20, height: "170 cm", weight: "50 kg", tier: "Common", keyword: "Nami one piece aesthetic", weightChance: 50 },
  { name: "Nico Robin", age: 30, height: "188 cm", weight: "60 kg", tier: "Common", keyword: "Nico Robin aesthetic", weightChance: 50 },
  { name: "Rukia Kuchiki", age: 15, height: "144 cm", weight: "33 kg", tier: "Common", keyword: "Rukia Kuchiki icon", weightChance: 50 },
  { name: "Chizuru Mizuhara", age: 20, height: "162 cm", weight: "48 kg", tier: "Common", keyword: "Chizuru Mizuhara aesthetic", weightChance: 50 },
  { name: "Ruka Sarashina", age: 18, height: "153 cm", weight: "43 kg", tier: "Common", keyword: "Ruka Sarashina icon", weightChance: 50 },
  { name: "Lucy Heartfilia", age: 17, height: "165 cm", weight: "47 kg", tier: "Common", keyword: "Lucy Heartfilia aesthetic icon", weightChance: 50 },
  { name: "Erza Scarlet", age: 19, height: "169 cm", weight: "50 kg", tier: "Common", keyword: "Erza Scarlet aesthetic icon", weightChance: 50 },

  // Rare (30% weight)
  { name: "Miku Nakano", age: 17, height: "165 cm", weight: "49 kg", tier: "Rare", keyword: "Miku Nakano aesthetic icon", weightChance: 30 },
  { name: "Nino Nakano", age: 17, height: "165 cm", weight: "49 kg", tier: "Rare", keyword: "Nino Nakano aesthetic icon", weightChance: 30 },
  { name: "Yotsuba Nakano", age: 17, height: "165 cm", weight: "49 kg", tier: "Rare", keyword: "Yotsuba Nakano icon", weightChance: 30 },
  { name: "Itsuki Nakano", age: 17, height: "165 cm", weight: "49 kg", tier: "Rare", keyword: "Itsuki Nakano icon", weightChance: 30 },
  { name: "Ichika Nakano", age: 17, height: "165 cm", weight: "49 kg", tier: "Rare", keyword: "Ichika Nakano icon", weightChance: 30 },
  { name: "Rem", age: 17, height: "154 cm", weight: "45 kg", tier: "Rare", keyword: "Rem ReZero aesthetic", weightChance: 30 },
  { name: "Ram", age: 17, height: "154 cm", weight: "45 kg", tier: "Rare", keyword: "Ram ReZero aesthetic", weightChance: 30 },
  { name: "Shinobu Kocho", age: 18, height: "151 cm", weight: "37 kg", tier: "Rare", keyword: "Shinobu Kocho aesthetic", weightChance: 30 },
  { name: "Mitsuri Kanroji", age: 19, height: "167 cm", weight: "56 kg", tier: "Rare", keyword: "Mitsuri Kanroji aesthetic", weightChance: 30 },
  { name: "Nezuko Kamado", age: 14, height: "153 cm", weight: "45 kg", tier: "Rare", keyword: "Nezuko Kamado aesthetic", weightChance: 30 },
  { name: "Kaguya Shinomiya", age: 17, height: "158 cm", weight: "46 kg", tier: "Rare", keyword: "Kaguya Shinomiya aesthetic", weightChance: 30 },

  // Epic (15% weight)
  { name: "Elaina", age: 18, height: "155 cm", weight: "45 kg", tier: "Epic", keyword: "Elaina wandering witch aesthetic icon", weightChance: 15 },
  { name: "Yor Forger", age: 27, height: "170 cm", weight: "55 kg", tier: "Epic", keyword: "Yor Forger aesthetic icon", weightChance: 15 },
  { name: "Makima", age: 24, height: "173 cm", weight: "58 kg", tier: "Epic", keyword: "Makima aesthetic icon", weightChance: 15 },
  { name: "Power", age: 17, height: "170 cm", weight: "52 kg", tier: "Epic", keyword: "Power chainsaw man aesthetic", weightChance: 15 },
  { name: "Aqua", age: 17, height: "158 cm", weight: "47 kg", tier: "Epic", keyword: "Aqua konosuba aesthetic", weightChance: 15 },
  { name: "Hu Tao", age: 18, height: "155 cm", weight: "46 kg", tier: "Epic", keyword: "Hu Tao aesthetic icon", weightChance: 15 },
  { name: "Raiden Shogun", age: 500, height: "170 cm", weight: "55 kg", tier: "Epic", keyword: "Raiden Shogun aesthetic icon", weightChance: 15 },
  { name: "Furina", age: 500, height: "155 cm", weight: "45 kg", tier: "Epic", keyword: "Furina aesthetic icon", weightChance: 15 },
  { name: "Ganyu", age: 3000, height: "158 cm", weight: "48 kg", tier: "Epic", keyword: "Ganyu aesthetic icon", weightChance: 15 },
  { name: "Kafka", age: 25, height: "170 cm", weight: "55 kg", tier: "Epic", keyword: "Kafka honkai star rail aesthetic", weightChance: 15 },
  { name: "Firefly", age: 20, height: "158 cm", weight: "47 kg", tier: "Epic", keyword: "Firefly honkai star rail aesthetic", weightChance: 15 },

  // Legendary (5% weight)
  { name: "Zero Two", age: 16, height: "170 cm", weight: "55 kg", tier: "Legendary", keyword: "Zero Two aesthetic icon", weightChance: 5 },
  { name: "Kurumi Tokisaki", age: 17, height: "157 cm", weight: "46 kg", tier: "Legendary", keyword: "Kurumi Tokisaki aesthetic", weightChance: 5 },
  { name: "Saber (Artoria)", age: 24, height: "154 cm", weight: "42 kg", tier: "Legendary", keyword: "Saber Artoria Pendragon icon", weightChance: 5 },
  { name: "Frieren", age: 1000, height: "152 cm", weight: "40 kg", tier: "Legendary", keyword: "Frieren aesthetic icon", weightChance: 5 },
  { name: "Hoshino Ai", age: 20, height: "151 cm", weight: "42 kg", tier: "Legendary", keyword: "Hoshino Ai aesthetic icon", weightChance: 5 },
  { name: "Eula", age: 22, height: "172 cm", weight: "53 kg", tier: "Legendary", keyword: "Eula aesthetic icon", weightChance: 5 },
  { name: "Rias Gremory", age: 18, height: "172 cm", weight: "58 kg", tier: "Legendary", keyword: "Rias Gremory aesthetic icon", weightChance: 5 },
  { name: "Akeno Himejima", age: 18, height: "168 cm", weight: "54 kg", tier: "Legendary", keyword: "Akeno Himejima aesthetic icon", weightChance: 5 },
  { name: "Esdeath", age: 20, height: "170 cm", weight: "56 kg", tier: "Legendary", keyword: "Esdeath aesthetic icon", weightChance: 5 },
];

async function getWaifuImage(keyword) {
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
    console.error("[GachaWaifu] Pinterest API error:", e.message);
  }
  return "https://i.pinimg.com/736x/8f/3e/2a/8f3e2a77ec65cdbcfad4ff3bc17e825f.jpg";
}

async function getBuffer(url) {
  try {
    const res = await axios.get(url, { responseType: "arraybuffer", timeout: 15000 });
    return Buffer.from(res.data);
  } catch {
    return null;
  }
}

function rollWaifu() {
  const totalWeight = waifuPool.reduce((acc, w) => acc + w.weightChance, 0);
  let random = Math.random() * totalWeight;
  for (const waifu of waifuPool) {
    random -= waifu.weightChance;
    if (random <= 0) return waifu;
  }
  return waifuPool[waifuPool.length - 1];
}

async function sendWaifuMessage(m, sock, waifu, textContent, customButtons = null) {
  let imgBuffer = null;
  if (waifu.imageUrl) {
    imgBuffer = await getBuffer(waifu.imageUrl);
  }
  if (!imgBuffer) {
    const newUrl = await getWaifuImage(waifu.keyword);
    waifu.imageUrl = newUrl;
    imgBuffer = await getBuffer(newUrl) || Buffer.alloc(0);
  }

  const media = await prepareWAMessageMedia(
    { image: imgBuffer },
    { upload: sock.waUploadToServer }
  );

  let buttons = customButtons;
  if (!buttons) {
    if (waifu.affection < 80) {
      buttons = [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🚶‍♂️ Jalan-jalan", id: `${m.prefix}waifuaction jalanjalan` }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "☕ Ke Kafe", id: `${m.prefix}waifuaction kafe` }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🎬 Nonton Bioskop", id: `${m.prefix}waifuaction bioskop` }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🛍️ Belanja", id: `${m.prefix}waifuaction belanja` }) },
      ];
    } else if (waifu.affection < 100) {
      buttons = [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🫂 Peluk", id: `${m.prefix}waifuaction peluk` }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "💋 Cium", id: `${m.prefix}waifuaction cium` }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🛏️ Tidur Bareng", id: `${m.prefix}waifuaction tidur` }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🛁 Mandi Bareng", id: `${m.prefix}waifuaction mandi` }) },
      ];
    } else {
      if (!waifu.married) {
        buttons = [
          { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "💍 Nikahi Dia", id: `${m.prefix}waifuaction nikah` }) },
          { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "💝 Minta Hadiah", id: `${m.prefix}waifuaction hadiah` }) },
        ];
      } else {
        buttons = [
          { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "👨‍👩‍👦 Bermesraan", id: `${m.prefix}waifuaction mesra` }) },
          { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "💌 Rayu Istrimu", id: `${m.prefix}waifuaction rayu` }) },
        ];
      }
    }
  }

  let footerText = "❤️ Jaga terus perasaannya ya!";
  if (customButtons) footerText = "💭 Dia menunggu jawabanmu...";
  else if (waifu.married) footerText = "❤️ Kamu sudah menikahinya!";

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
            title: `🌟 *${waifu.tier.toUpperCase()} TIER WAIFU* 🌟`,
            subtitle: waifu.name,
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
  if (cmd === "waifuku" || cmd === "istriku") {
    if (!user.waifu) {
      return m.reply(`⚠️ *Kamu belum memiliki waifu!*\nSilakan ketik *${m.prefix}gachawaifu* untuk memulainya!`);
    }
    m.react("🕕");
    const waifu = user.waifu;
    let statusPernikahan = waifu.married ? "Telah Menikah 💍" : "Pendekatan 💖";
    const textContent = `📸 *STATUS WAIFU KAMU* 📸\n\n` +
      `💖 *Nama Lengkap:* ${waifu.name}\n` +
      `🎂 *Usia:* ${waifu.age} tahun\n` +
      `💎 *Tier:* ${waifu.tier}\n` +
      `💞 *Affection:* ${waifu.affection}/100\n` +
      `💍 *Status:* ${statusPernikahan}\n\n` +
      `Lanjutkan interaksi dengan memilih salah satu aksi kencan di bawah ini!`;

    m.react("✅");
    return await sendWaifuMessage(m, sock, waifu, textContent, null);
  }
  if (cmd === "tinggalinwaifu") {
    if (!user.waifu) {
      return m.reply(`⚠️ *Kamu bahkan belum punya waifu!* Apa yang mau ditinggalin? Halu ya?`);
    }

    const waifuName = user.waifu.name;
    const waifuJid = 'waifu_' + waifuName.replace(/\s+/g, '') + '@s.whatsapp.net';
    if (user.waifu.married) {
      if (user.fun && user.fun.pasangan === waifuJid) {
        user.fun.pasangan = "";
      }
      db.setUser(waifuJid, { fun: { pasangan: "" } });
    }

    delete user.waifu;
    db.setUser(m.sender, user);

    m.react("💔");
    return m.reply(
      `💔 *KAMU MEMUTUSKAN UNTUK MENINGGALKAN ${waifuName.toUpperCase()}!*\n\n` +
      `Kamu mengemas barang-barangmu dan mengatakan kepadanya bahwa hubungan ini sudah tidak bisa dilanjutkan lagi. ` +
      `Dia menangis tersedu-sedu dan memohon agar kamu tetap tinggal, namun hatimu sudah membeku.\n\n` +
      `Kalian kini resmi berpisah.`
    );
  }
  if (cmd === "gachawaifu" || cmd === "gachaistri") {
    if (user.waifu) {
      m.react("😡");
      let pesanStatus = user.waifu.married ? "Dia sudah menjadi istrimu!" : "Dia sangat mencintaimu!";
      return m.reply(
        `⚠️ *Kamu sudah memiliki waifu!*\n\n` +
        `Nama: *${user.waifu.name}*\n` +
        `Tier: *${user.waifu.tier}*\n` +
        `Affection: *${user.waifu.affection}/100*\n\n` +
        `Jangan serakah! Jaga waifu yang kamu miliki sekarang. ${pesanStatus} Ketik *${m.prefix}waifuku* untuk berinteraksi dengannya.`
      );
    }

    const sub = (m.args[0] || "").toLowerCase();

    if (sub !== "start") {
      const panduan = `💕 *SISTEM GACHA WAIFU* 💕\n\n` +
        `Simulasi kencan virtual interaktif. Dapatkan waifu impianmu, dekati hatinya, dan nikahi dia!\n\n` +
        `*PENGGUNAAN COMMAND:*\n` +
        `• *${m.prefix}gachawaifu* — Membuka menu panduan ini\n` +
        `• *${m.prefix}waifuku* — Membuka panel interaksi dengan waifumu\n` +
        `• *${m.prefix}tinggalinwaifu* — Mencampakkan waifu dan mereset status\n\n` +
        `*PENJELASAN ALUR CERITA:*\n` +
        `1. Tekan tombol **Mulai Gacha** di bawah untuk mendapatkan waifu pertamamu.\n` +
        `2. Akan ada 3 Fase Hubungan berdasarkan Poin Cinta (Affection).\n` +
        `3. *Fase Pendekatan (< 80)*: Lakukan aksi standar (Kencan, Kafe). Pilihan jalan-jalanmu akan memengaruhi *mood* sang waifu!\n` +
        `4. *Fase Intim (80 - 99)*: Terbuka interaksi fisik. Hati-hati, jika kamu mesum di saat affection masih rendah, dia akan marah besar!\n` +
        `5. *Fase Menikah (100)*: Capai affection penuh dan nikahi dia untuk mendapatkan *Reward Eksklusif* berupa koin dan limit melimpah!`;

      const msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
          message: {
            messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
            interactiveMessage: {
              body: { text: panduan },
              footer: { text: "Tekan tombol di bawah untuk memulai pencarian jodohmu!" },
              nativeFlowMessage: {
                buttons: [
                  { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🎲 Mulai Gacha Sekarang!", id: `${m.prefix}gachawaifu start` }) }
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
      const waifuData = rollWaifu();
      const waifu = {
        ...waifuData,
        affection: 50,
        married: false,
        imageUrl: await getWaifuImage(waifuData.keyword)
      };

      user.waifu = waifu;
      db.setUser(m.sender, user);

      const textContent = `🎉 *SELAMAT! KAMU MENDAPATKAN WAIFU BARU!* 🎉\n\n` +
        `💖 *Nama Lengkap:* ${waifu.name}\n` +
        `🎂 *Usia:* ${waifu.age} tahun\n` +
        `📏 *Tinggi Badan:* ${waifu.height}\n` +
        `⚖️ *Berat Badan:* ${waifu.weight}\n` +
        `💎 *Tier:* ${waifu.tier}\n` +
        `💞 *Affection:* ${waifu.affection}/100\n\n` +
        `Silakan pilih interaksi (kencan) di bawah ini untuk memulai PDKT dan meningkatkan poin cintanya. Hati-hati jangan sampai poin cintanya habis ya!`;

      m.react("✅");
      await sendWaifuMessage(m, sock, waifu, textContent, null);
    } catch (err) {
      console.error(err);
      m.react("☢");
      return m.reply(te(m.prefix, m.command, m.pushName));
    }
    return;
  }
  if (cmd === "waifuaction") {
    if (!user.waifu) {
      m.react("❌");
      return m.reply(`Kamu belum memiliki waifu! Silakan ketik *${m.prefix}gachawaifu* untuk mendapatkan waifu pertamamu.`);
    }

    const action = (m.args[0] || "").toLowerCase();
    let waifu = user.waifu;
    let responseText = "";
    let affectionChange = 0;
    if (action === "jalanjalan") {
      return sendWaifuMessage(m, sock, waifu, `Kamu mengajak *${waifu.name}* jalan-jalan bersamamu. Mau pergi kemana hari ini?`, [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🌳 Ke Taman", id: `${m.prefix}waifuaction kencan_taman` }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🏢 Ke Mall", id: `${m.prefix}waifuaction kencan_mall` }) }
      ]);
    }
    if (action === "kafe") {
      return sendWaifuMessage(m, sock, waifu, `Kalian pergi ke kafe yang sedang hits di kota. Ingin memesankan minuman apa untuknya?`, [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "☕ Kopi Pahit", id: `${m.prefix}waifuaction kencan_kopi` }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🍵 Matcha Latte", id: `${m.prefix}waifuaction kencan_matcha` }) }
      ]);
    }
    if (action === "bioskop") {
      return sendWaifuMessage(m, sock, waifu, `Kalian berdiri di depan loket bioskop. Mau pilih tiket film genre apa?`, [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "💞 Romantis", id: `${m.prefix}waifuaction kencan_romantis` }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "👻 Horor", id: `${m.prefix}waifuaction kencan_horor` }) }
      ]);
    }
    if (action === "belanja") {
      return sendWaifuMessage(m, sock, waifu, `Kalian berkeliling di pusat perbelanjaan elit. Kamu mau membelikannya hadiah apa?`, [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "👗 Baju Lucu", id: `${m.prefix}waifuaction kencan_baju` }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "💎 Perhiasan", id: `${m.prefix}waifuaction kencan_perhiasan` }) }
      ]);
    }
    const rejectIntimate = async () => {
      waifu.affection -= (Math.floor(Math.random() * 30) + 30);
      if (waifu.affection < 0) waifu.affection = 0;
      let outText = `💢 *PLAKK!!* Kamu mencoba bersikap mesum kepada *${waifu.name}*, namun dia merasa kalian belum sedekat itu! Dia menamparmu dengan keras dan memarahimu!`;
      await processAffection(outText, waifu.affection);
    };

    if (["peluk", "cium", "tidur", "mandi"].includes(action) && waifu.affection < 80) {
      return await rejectIntimate();
    }

    if (action === "peluk") {
      return sendWaifuMessage(m, sock, waifu, `Kamu menatap *${waifu.name}* yang sedang lengah. Bagaimana caramu memeluknya?`, [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🤗 Dari Belakang", id: `${m.prefix}waifuaction intim_belakang` }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "💑 Berhadapan", id: `${m.prefix}waifuaction intim_depan` }) }
      ]);
    }
    if (action === "cium") {
      return sendWaifuMessage(m, sock, waifu, `Wajah kalian kini sangat dekat, nafasnya terasa di wajahmu. Cium di bagian mana?`, [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "😚 Kening", id: `${m.prefix}waifuaction intim_kening` }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "💋 Bibir", id: `${m.prefix}waifuaction intim_bibir` }) }
      ]);
    }
    if (action === "tidur") {
      return sendWaifuMessage(m, sock, waifu, `Kalian merebahkan diri di atas ranjang yang empuk. Jantungmu berdebar kencang. Apa yang akan kamu lakukan?`, [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🫂 Peluk Pulas", id: `${m.prefix}waifuaction intim_kelon` }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🔥 Pemanasan", id: `${m.prefix}waifuaction intim_panas` }) }
      ]);
    }
    if (action === "mandi") {
      return sendWaifuMessage(m, sock, waifu, `*${waifu.name}* sedang berendam di bathtub. Kamu ikut masuk ke dalamnya. Kamu ingin menggosok bagian mana?`, [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🛁 Punggung", id: `${m.prefix}waifuaction intim_punggung` }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🧼 Bahu Depan", id: `${m.prefix}waifuaction intim_bahu` }) }
      ]);
    }
    if (action === "kencan_taman") {
      affectionChange = Math.floor(Math.random() * 10) + 10;
      responseText = `🌳 Suasana taman sangat sejuk. *${waifu.name}* sangat menikmati pemandangan dan ia tersenyum riang sambil menggandeng erat lenganmu!`;
    }
    else if (action === "kencan_mall") {
      affectionChange = Math.floor(Math.random() * 5) + 5;
      responseText = `🏢 Suasana mall cukup bising dan ramai. Kalian hanya berkeliling melihat barang-barang, namun dia tetap menghargai waktu bersamamu.`;
    }
    else if (action === "kencan_kopi") {
      affectionChange = -(Math.floor(Math.random() * 10) + 5);
      responseText = `☕ Ups, *${waifu.name}* ternyata tidak terlalu suka kopi hitam yang pahit! Wajahnya meringis saat meminumnya. Mood-nya sedikit turun.`;
    }
    else if (action === "kencan_matcha") {
      affectionChange = Math.floor(Math.random() * 15) + 10;
      responseText = `🍵 *${waifu.name}* sangat menyukai Matcha Latte manis pesananmu! Dia terlihat sangat gembira dan terus tersenyum manis padamu. Pilihan yang tepat!`;
    }
    else if (action === "kencan_romantis") {
      affectionChange = Math.floor(Math.random() * 15) + 5;
      responseText = `💞 Menonton film romantis membuat suasana hati kalian berdua mencair. Sepanjang film, dia diam-diam menyenderkan kepalanya di bahumu.`;
    }
    else if (action === "kencan_horor") {
      affectionChange = Math.floor(Math.random() * 10) + 15;
      responseText = `👻 *JUMPSCARE!* Karena ketakutan, *${waifu.name}* menjerit dan otomatis memeluk lenganmu dengan sangat kuat sepanjang film. Kalian jadi semakin dekat!`;
    }
    else if (action === "kencan_baju") {
      affectionChange = Math.floor(Math.random() * 15) + 5;
      responseText = `👗 Kamu membelikannya gaun yang sangat cantik. Ia langsung memakainya dan memamerkannya padamu dengan pipi merona!`;
    }
    else if (action === "kencan_perhiasan") {
      affectionChange = Math.floor(Math.random() * 20) + 10;
      responseText = `💎 Kamu membelikannya perhiasan mahal! Matanya berbinar bahagia dan ia sangat menghargai hadiah mewah darimu!`;
    }
    else if (action === "intim_belakang") {
      affectionChange = Math.floor(Math.random() * 10) + 10;
      responseText = `🤗 Kamu memeluknya erat dari belakang. *${waifu.name}* sedikit terkejut, namun ia merasa aman dan nyaman berada dalam dekapanmu.`;
    }
    else if (action === "intim_depan") {
      affectionChange = Math.floor(Math.random() * 15) + 5;
      responseText = `💑 Kalian saling berhadapan. Kamu menarik pinggangnya dengan pelan dan kalian saling menatap dengan penuh kasih sayang.`;
    }
    else if (action === "intim_kening") {
      affectionChange = Math.floor(Math.random() * 10) + 5;
      responseText = `😚 Kamu mengecup keningnya dengan penuh kelembutan. Itu adalah ciuman yang tulus dan membuatnya merasa sangat disayangi.`;
    }
    else if (action === "intim_bibir") {
      affectionChange = Math.floor(Math.random() * 15) + 15;
      responseText = `💋 Kamu melumat bibirnya dengan lembut namun penuh gairah. Ia membalas ciumanmu dengan desahan kecil. Malam terasa sangat panjang.`;
    }
    else if (action === "intim_kelon") {
      affectionChange = Math.floor(Math.random() * 10) + 10;
      responseText = `🫂 Kamu hanya memeluknya dan menepuk punggungnya hingga ia tertidur pulas. Senyum damai terlukis di wajah cantiknya.`;
    }
    else if (action === "intim_panas") {
      affectionChange = Math.floor(Math.random() * 20) + 15;
      responseText = `🔥 Kamu memulai pemanasan lembut, mencium lehernya, dan membuat wajahnya merah merona. Ia berbisik, "Tolong lembut ya malam ini..."`;
    }
    else if (action === "intim_punggung") {
      affectionChange = Math.floor(Math.random() * 10) + 10;
      responseText = `🛁 Kamu menggosok punggungnya yang mulus dengan lembut. Ia mendesah lega karena merasa rileks setelah hari yang panjang.`;
    }
    else if (action === "intim_bahu") {
      affectionChange = Math.floor(Math.random() * 15) + 15;
      responseText = `🧼 Kamu menggosok bahu dan area sensitifnya. *${waifu.name}* merintih pelan, merasa malu tapi sangat menikmati sentuhanmu di dalam air hangat.`;
    }
    else if (action === "nikah") {
      if (waifu.affection < 100) return m.reply(`⚠️ Poin affection belum mencapai 100! Jangan terburu-buru melamar!`);
      if (waifu.married) return m.reply(`⚠️ Kalian kan sudah menikah!`);

      waifu.married = true;
      user.limit = (user.limit || 0) + 5000;
      user.koin = (user.koin || 0) + 100000;

      if (!user.fun) user.fun = {};
      const waifuJid = 'waifu_' + waifu.name.replace(/\s+/g, '') + '@s.whatsapp.net';
      user.fun.pasangan = waifuJid;
      db.setUser(waifuJid, { fun: { pasangan: m.sender }, name: waifu.name });

      responseText = `💍 *KAMU RESMI MENIKAH DENGAN ${waifu.name.toUpperCase()}!* 💍\n\nKamu berlutut di bawah bintang-bintang dan memberikan cincin berlian kepadanya. Dia menangis terharu dan berkata "Iya, aku mau menjadi milikmu selamanya!"\n\nSebagai hadiah pernikahan (Dowry), kamu mendapatkan:\n- ⚡ 5000 Limit/Energi\n- 💰 100,000 Saldo/Koin\n\nStatus kamu di fitur \`.cekpacar\` kini resmi berpasangan dengannya!`;
      affectionChange = 0;
    }
    else if (action === "hadiah") {
      if (waifu.affection < 100) return m.reply(`⚠️ Dia belum cukup mencintaimu untuk memberikan hadiah!`);
      affectionChange = 0;
      user.limit = (user.limit || 0) + 500;
      responseText = `💝 *${waifu.name}* dengan senyum bahagia membawakanmu sebuah bekal cinta yang lezat!\nKamu mendapatkan ⚡ 500 Limit/Energi!`;
    }
    else if (["mesra", "rayu"].includes(action)) {
      if (!waifu.married) return m.reply(`Aksi ini hanya untuk pasangan suami istri!`);
      affectionChange = 0;
      responseText = `👨‍👩‍👦 Kalian berdua menikmati hari-hari manis yang damai sebagai pasangan suami istri yang harmonis. Cintanya padamu akan bertahan selamanya!`;
    }
    else {
      m.react("❓");
      return m.reply(`Aksi tidak dikenali. Silakan gunakan interaksi pada tombol waifu.`);
    }

    async function processAffection(customResponseText, currentAffectionVal) {
      let finalResponseText = customResponseText || responseText;
      waifu.affection += affectionChange;
      if (waifu.affection > 100) waifu.affection = 100;
      if (waifu.affection < 0) waifu.affection = 0;

      let sign = affectionChange > 0 ? "+" : "";
      let affectionText = `💞 *Affection berubah:* ${sign}${affectionChange} (Total: ${waifu.affection}/100)`;
      if (waifu.affection === 100) affectionText = `💞 *Affection MAKSIMAL! (100/100)*`;
      if (affectionChange === 0) affectionText = `💞 *Affection:* ${waifu.affection}/100`;

      if (waifu.affection <= 0) {
        const leavingText = `💔 *${waifu.name.toUpperCase()} MENGHILANG DARI KEHIDUPANMU!* 💔\n\n${finalResponseText}\n\n${affectionText}\n\nKarena kasih sayangnya padamu telah benar-benar habis (mencapai 0), dia mengemasi seluruh barang-barangnya secara diam-diam. Saat kamu bangun, dia sudah pergi dan meninggalkan sebuah surat yang basah oleh air matanya. Kamu telah kehilangan waifumu! Silakan cari waifu lain jika hatimu sudah siap.\n*(Ketik ${m.prefix}gachawaifu untuk memulai ulang)*`;

        if (waifu.married) {
          const waifuJid = 'waifu_' + waifu.name.replace(/\s+/g, '') + '@s.whatsapp.net';
          if (user.fun && user.fun.pasangan === waifuJid) user.fun.pasangan = "";
          db.setUser(waifuJid, { fun: { pasangan: "" } });
        }

        delete user.waifu;
        db.setUser(m.sender, user);

        m.react("💔");
        return m.reply(leavingText);
      }

      user.waifu = waifu;
      db.setUser(m.sender, user);

      const updatedText = `${finalResponseText}\n\n${affectionText}`;
      m.react(waifu.affection === 100 ? "💍" : "✨");
      await sendWaifuMessage(m, sock, waifu, updatedText, null);
    }

    await processAffection();
  }
}

export { pluginConfig as config, handler };
