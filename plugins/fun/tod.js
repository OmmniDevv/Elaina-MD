/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { getDatabase } from "../../src/lib/elaina-database.js";
import te from "../../src/lib/elaina-error.js";

const pluginConfig = {
  name: ["tod", "spin", "putarbotol"],
  alias: ["todgame"],
  category: "fun",
  description: "Bermain Truth or Dare bersama teman-teman grup secara instan!",
  usage: ".tod",
  example: ".tod",
  isOwner: false,
  isPremium: false,
  isGroup: true,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

const truths = [
  "Siapa orang terakhir yang kamu chat sebelum pesan ini?",
  "Apa rahasia terbesar yang belum pernah kamu ceritakan pada siapapun di grup ini?",
  "Jika kamu diwajibkan menikah dengan salah satu member grup ini, siapa yang akan kamu pilih? Tag orangnya!",
  "Pernahkah kamu menyukai seseorang di grup ini tapi tidak berani mengungkapkannya?",
  "Apa hal paling memalukan yang pernah terjadi padamu di depan umum?",
  "Sebutkan 3 hal yang paling kamu benci dari dirimu sendiri.",
  "Jika kamu bisa kembali ke masa lalu, momen memalukan apa yang ingin kamu ubah?",
  "Siapa mantan terindahmu? Kenapa putus?",
  "Pernahkah kamu berbohong ke orang tua demi bolos sekolah/kuliah/kerja? Ceritakan!",
  "Apa hal paling konyol yang pernah kamu cari di history Google pencarianmu?",
  "Siapa member di grup ini yang menurutmu paling asik, dan siapa yang paling ngeselin?",
  "Kapan terakhir kali kamu menangis dan apa alasannya?",
  "Berapa jumlah saldo di rekening/e-wallet kamu sekarang? Jujur!",
  "Apakah kamu pernah ketahuan stalking sosmed orang? Siapa?",
  "Apa kebohongan terbesar yang pernah kamu ucapkan ke sahabatmu?"
];

const dares = [
  "Kirim foto selfie kamu dengan gaya paling jelek sekarang juga ke grup!",
  "Kirim VN (Voice Note) nyanyi reff lagu 'Balonku Ada Lima' tapi semua huruf vokalnya diganti jadi 'O'.",
  "Chat mantan kamu sekarang, bilang 'Aku masih sayang', lalu screenshot dan kirim ke grup ini!",
  "Pakai foto profil wajah jelekmu selama 1 jam penuh!",
  "Tulis status WhatsApp 'Aku sayang banget sama [Tag 1 Member Grup]' dan biarkan selama 30 menit. SS ke grup!",
  "Kirim VN bilang 'Mewing mewing sigma skibidi' dengan nada serius ke grup.",
  "Spam 5 stiker paling absurd/nggak jelas yang kamu punya ke grup ini sekarang.",
  "Tag salah satu admin grup dan bilang 'Kamu jelek banget hari ini'.",
  "Ubah bio WhatsApp kamu menjadi 'Saya badut ancol' selama 1 hari.",
  "Kirim gombalan paling maut ke member yang berlawanan jenis di grup ini!",
  "Buat 1 puisi alay tentang ayam goreng, bacakan lewat VN!",
  "Ketik 'Aku ini sebenernya alien' dan tag 3 orang secara acak di grup ini.",
  "Sebutkan nama lengkapmu dengan suara berteriak di VN!",
  "Pilih salah satu nomor secara acak dari kontakmu, chat 'P' sebanyak 10 kali, screenshot ke sini!",
  "Jadikan foto profil bot ini sebagai foto profil WhatsApp kamu selama 30 menit."
];

async function handler(m, { sock }) {
  try {
    const cmd = m.command.toLowerCase();
    if (cmd === "tod" || cmd === "spin" || cmd === "putarbotol") {
      const groupMetadata = await sock.groupMetadata(m.chat);
      const participants = groupMetadata.participants;
      const randomMember = participants[Math.floor(Math.random() * participants.length)];
      const targetJid = randomMember.jid;
      const isTruth = Math.random() > 0.5;
      let typeLabel = "";
      let challengeText = "";

      if (isTruth) {
        typeLabel = "🗣️ *TRUTH* 🗣️\n_(Harus dijawab dengan sangat jujur!)_";
        challengeText = truths[Math.floor(Math.random() * truths.length)];
      } else {
        typeLabel = "🔥 *DARE* 🔥\n_(Harus dilakukan, buktikan ke grup!)_";
        challengeText = dares[Math.floor(Math.random() * dares.length)];
      }

      let text = `🍾 *BOTOL DIPUTAR!* 🍾\n\n`;
      text += `Botol berputar kencang di tengah-tengah kalian...\n`;
      text += `Perlahan putarannya melambat, dan berhenti menunjuk kepada...\n\n`;
      text += `👉 @${targetJid.split('@')[0]} 👈\n\n`;
      text += `${typeLabel}\n\n`;
      text += `*Tantangan/Pertanyaan:*\n👉 ${challengeText}`;

      return m.reply(text, { mentions: [targetJid] });
    }
  } catch (error) {
    console.error("[ToD Plugin Error]", error);
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
