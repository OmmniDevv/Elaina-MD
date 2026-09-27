/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const pluginConfig = {
  name: "kalkulatormbg",
  alias: ["kkmbg"],
  category: "tools",
  description: "Hitung durasi dan perbandingan dana Makan Bergizi Gratis (MBG)",
  usage: ".kkmbg <jumlah_uang>",
  example: ".kkmbg 1000000000",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

function hitungMBG(uang) {
  const pengeluaranPerHari = 319600000000;
  const hargaPorsi = 15000;

  const hariFloat = uang / pengeluaranPerHari;

  const tahun = Math.floor(hariFloat / 365);
  const bulan = Math.floor((hariFloat % 365) / 30);
  const hari = Math.floor(hariFloat % 30);

  const jam = Math.floor((hariFloat % 1) * 24);
  const menit = Math.floor(((hariFloat * 24) % 1) * 60);
  const detik = (((hariFloat * 24 * 60) % 1) * 60);

  const porsi = Math.floor(uang / hargaPorsi);

  const umrDKI = 5400000;
  const umrJateng = 2040000;
  const guruHonorer = 300000;

  const persenDKI = ((uang / umrDKI) * 100).toFixed(1);
  const persenJateng = ((uang / umrJateng) * 100).toFixed(1);
  const kaliGuru = (uang / guruHonorer).toFixed(1);

  const pemain = [
    { nama: "Cristiano Ronaldo (Al Nassr)", gaji: 4500000000000 },
    { nama: "Lionel Messi (Inter Miami)", gaji: 2100000000000 },
    { nama: "Karim Benzema (Al-Ittihad)", gaji: 1700000000000 },
    { nama: "Kylian Mbappé (Real Madrid)", gaji: 1500000000000 },
    { nama: "Erling Haaland (Man City)", gaji: 1300000000000 },
    { nama: "Vinícius Jr. (Real Madrid)", gaji: 960000000000 },
    { nama: "Mohamed Salah (Liverpool)", gaji: 880000000000 },
    { nama: "Sadio Mané (Al Nassr)", gaji: 864000000000 },
    { nama: "Jude Bellingham (Real Madrid)", gaji: 704000000000 },
    { nama: "Lamine Yamal (Barcelona)", gaji: 688000000000 }
  ];

  const perbandinganPemain = pemain.map(p => {
    const persen = ((uang / p.gaji) * 100);
    return {
      nama: p.nama,
      gaji: p.gaji,
      persen: persen < 0.0001 ? "0%" : persen.toFixed(4) + "%"
    };
  });

  return {
    durasi: {
      tahun,
      bulan,
      hari,
      jam,
      menit,
      detik: detik.toFixed(2)
    },
    pengeluaran: pengeluaranPerHari,
    porsi,
    gajiIndonesia: {
      dki: persenDKI + "%",
      jateng: persenJateng + "%",
      guru: kaliGuru + "x"
    },
    pemain: perbandinganPemain
  };
}

function formatRupiah(angka) {
  const formatted = angka.toLocaleString('id-ID');
  return angka < 1000 ? `${formatted} Perak` : `Rp ${formatted}`;
}

async function handler(m, { args }) {
  if (!args[0]) {
    let txt = `🧮 *KALKULATOR MBG (Makan Bergizi Gratis)* 🧮\n\n`;
    txt += `Halo kak! Penasaran berapa lama uang kamu bisa nyuplai program Makan Bergizi Gratis se-Indonesia?\n\n`;
    txt += `*Cara Pakai:*\n`;
    txt += `👉 \`${m.prefix}kkmbg <nominal uang>\`\n\n`;
    txt += `*Contoh:*\n`;
    txt += `\`${m.prefix}kkmbg 1000000000\``;
    return m.reply(txt);
  }

  await m.react("🧮");

  try {
    const uang = Number(args[0].replace(/[^0-9]/g, ''));
    if (isNaN(uang) || uang <= 0) {
      return m.reply("❌ Kak, tolong masukin angka uang yang valid ya! (Cuma angka aja, misal 500000)");
    }

    const data = hitungMBG(uang);

    let contentTxt = `💰 *Dana :* ${formatRupiah(uang)}\n\n`;
    contentTxt += `⏳ *Durasi MBG:*\n`;
    contentTxt += `${data.durasi.tahun} TAHUN, ${data.durasi.bulan} BULAN, ${data.durasi.hari} HARI\n`;
    contentTxt += `${data.durasi.jam} JAM, ${data.durasi.menit} MENIT, ${data.durasi.detik} DETIK\n`;
    contentTxt += `_(Berdasarkan pengeluaran ~Rp ${(data.pengeluaran / 1000000000).toFixed(1)} Miliar/hari)_\n\n`;
    
    contentTxt += `🍱 *Setara Porsi Makan:*\n`;
    contentTxt += `${data.porsi.toLocaleString('id-ID')} porsi (@ Rp 15.000/porsi)\n\n`;

    contentTxt += `📊 *Perbandingan Gaji Indonesia:*\n`;
    contentTxt += `🏢 UMR DKI Jakarta (Rp 5,4 Jt/bulan): ${data.gajiIndonesia.dki}\n`;
    contentTxt += `🏭 UMR Jawa Tengah (Rp 2,04 Jt/bulan): ${data.gajiIndonesia.jateng}\n`;
    contentTxt += `👨‍🏫 Gaji Guru Honorer (Rp 300rb/bulan): ${data.gajiIndonesia.guru}\n\n`;

    contentTxt += `⚽ *Perbandingan Gaji Pesepakbola:*\n`;
    for (let p of data.pemain) {
      contentTxt += `🏆 ${p.nama}\n`;
      contentTxt += `💵 ${formatRupiah(p.gaji)}/tahun\n`;
      contentTxt += `📈 Persentase: ${p.persen}\n\n`;
    }

    let txt = `🍽️ *HASIL HITUNG KALKULATOR MBG* 🍽️\n\n`;
    txt += contentTxt.trim().split("\n").map(line => line.trim() ? `${line}` : ``).join("\n");

    await m.reply(txt);
    await m.react("✅");
  } catch (e) {
    m.reply(`❌ Maaf kak, terjadi kesalahan saat menghitung! 😭\nError: ${e.message}`);
  }
}

export { pluginConfig as config, handler };
