/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

// plugins/economy/primeff.js

const config = {
  name: "primeff",
  alias: ["prime", "kalkulatorprime", "primefreefire", "ffprime"],
  category: "economy",
  description: "Kalkulator Prime Free Fire untuk menghitung estimasi diamond dan harga rupiah",
  usage: ".primeff <jumlah poin>",
  example: ".primeff 12900",
  isOwner: false,
  isPremium: false,
  cooldown: 5,
  energi: 0
};

function formatRupiah(angka) {
  return "Rp " + Math.round(angka)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

async function hitungPrimeFF(poinPrime) {
  const poin = parseInt(
    String(poinPrime).replace(/[^0-9]/g, "")
  );

  if (isNaN(poin) || poin <= 0) {
    return {
      status: false,
      message: "Jumlah Poin Prime tidak valid."
    };
  }

  const url = "https://rifqistore.com/id/calculator-free-fire";
  let rate = 126;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    });

    if (res.ok) {
      const html = await res.text();

      const matchRate =
        html.match(/(?:Rp\s*|harga[:\s]*)(\d+)\s*\/\s*(?:1)?(?:dm|diamond)/i) ||
        html.match(/(\d+)\s*\/\s*1dm/i) ||
        html.match(/rate\s*[:=]\s*(\d+)/i);

      if (matchRate?.[1]) {
        const parsedRate = parseInt(matchRate[1]);

        if (!isNaN(parsedRate) && parsedRate > 0) {
          rate = parsedRate;
        }
      }
    }
  } catch {
    rate = 126;
  }

  const totalDiamond = poin;
  const totalHarga = totalDiamond * rate;

  return {
    status: true,
    data: {
      poin_prime: poin,
      total_diamond: totalDiamond.toLocaleString("id-ID"),
      harga_per_dm: rate,
      total_harga: totalHarga,
      formatted_harga: formatRupiah(totalHarga)
    }
  };
}

async function handler(m, { sock, config: botConfig }) {
  try {
    const args = m.args || [];
    const input = args[0];

    if (!input) {
      return m.reply(
        `❌ *Format salah!*\n\n` +
        `Gunakan:\n` +
        `.primeff <jumlah poin>\n\n` +
        `Contoh:\n` +
        `.primeff 12900`
      );
    }

    const result = await hitungPrimeFF(input);

    if (!result.status) {
      return m.reply(`❌ ${result.message}`);
    }

    const data = result.data;

    const text = [
      `🔥 *KALKULATOR PRIME FREE FIRE*`,
      ``,
      `💠 Poin Prime : *${data.poin_prime.toLocaleString("id-ID")}*`,
      `💎 Total Diamond : *${data.total_diamond} DM*`,
      `💰 Harga / Diamond : *Rp ${data.harga_per_dm.toLocaleString("id-ID")}*`,
      ``,
      `💵 *Estimasi Harga*`,
      `${data.formatted_harga}`,
      ``,
      `🌐 Rate diperoleh dari RifqiStore`,
      `❀ SHINOBU MD ❀`
    ].join("\n");

    return m.reply(text);
  } catch (err) {
    console.error("[PRIMEFF]", err);

    return m.reply(
      `❌ Gagal menghitung Prime Free Fire.\n\n` +
      `${err?.message || "Terjadi kesalahan tidak diketahui."}`
    );
  }
}

export default {
  config,
  handler
};