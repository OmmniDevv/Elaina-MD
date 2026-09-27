/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";

const pluginConfig = {
    name: 'wisedetail',
    alias: ['wise', 'kurs', 'currency', 'wiseconvert', 'wisecurrencies'],
    category: 'tools',
    description: 'Cek kurs mata uang, konversi nilai tukar, dan grafik tren dari Wise',
    usage: '.wisedetail <jumlah> <from> <to> atau .wisecurrencies',
    example: '.wisedetail 100 USD IDR',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true
};

const BASE_URL = "https://wise.com";
const TIMEOUT = 60000;
const LOCALE = "id";
const CHART_DAYS = 30;

const jar = new CookieJar();

const client = wrapper(axios.create({
  jar,
  withCredentials: true,
  timeout: TIMEOUT,
  decompress: true,
  validateStatus: () => true,
  headers: {
    "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36",
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
    "cache-control": "max-age=0",
    "upgrade-insecure-requests": "1",
    "sec-ch-ua": '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": '"Android"'
  }
}));

const api = wrapper(axios.create({
  jar,
  withCredentials: true,
  timeout: TIMEOUT,
  decompress: true,
  validateStatus: () => true,
  headers: {
    "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36",
    "accept": "application/json,text/plain,*/*",
    "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7"
  }
}));

function decodeHtml(value) {
  return String(value)
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function pickNextData(html) {
  const match = String(html).match(/<script[^>]+id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i);
  if (!match) return null;
  return JSON.parse(decodeHtml(match[1]));
}

function normalizeCode(code) {
  return String(code || "").trim().toUpperCase();
}

function numberValue(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function formatDateLabel(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toISOString().slice(0, 10);
}

function uniqByDate(points) {
  const map = new Map();
  for (const item of points) {
    if (!item.date || item.rate == null) continue;
    map.set(item.date, item);
  }
  return [...map.values()].sort((a, b) => new Date(a.date) - new Date(b.date));
}

function normalizeHistory(data) {
  const raw = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.rates)
        ? data.rates
        : Array.isArray(data?.history)
          ? data.history
          : [];

  const points = raw.map((item) => {
    const date = item.time || item.date || item.timestamp || item.createdTime || item.providerTimestamp;
    const rate = numberValue(item.rate ?? item.value ?? item.mid ?? item.close);

    return {
      Date: formatDateLabel(date),
      Rate: rate
    };
  }).filter((item) => item.Rate != null);

  return uniqByDate(points.map((item) => ({
    date: item.Date,
    rate: item.Rate
  }))).map((item) => ({
    Date: item.date,
    Rate: item.rate
  }));
}

async function fetchPage(from, to, amount) {
  const slug = `${from.toLowerCase()}-to-${to.toLowerCase()}-rate`;
  const url = `${BASE_URL}/${LOCALE}/currency-converter/${slug}?amount=${encodeURIComponent(amount)}`;
  const res = await client.get(url);

  return {
    url,
    code: res.status,
    html: typeof res.data === "string" ? res.data : String(res.data || "")
  };
}

async function fetchHomeCurrencies() {
  const url = `${BASE_URL}/${LOCALE}/currency-converter/`;
  const res = await client.get(url);
  const data = pickNextData(typeof res.data === "string" ? res.data : String(res.data || ""));
  const model = data?.props?.pageProps?.model || {};

  return {
    url,
    code: res.status,
    currencies: Array.isArray(model.currencies) ? model.currencies : []
  };
}

async function fetchHistory(from, to, days) {
  const source = normalizeCode(from);
  const target = normalizeCode(to);

  const endpoints = [
    `${BASE_URL}/rates/history+live?source=${source}&target=${target}&length=${days}&resolution=daily&unit=day`,
    `${BASE_URL}/rates/history?source=${source}&target=${target}&length=${days}&resolution=daily&unit=day`,
    `${BASE_URL}/gateway/v1/rates/history+live?source=${source}&target=${target}&length=${days}&resolution=daily&unit=day`,
    `${BASE_URL}/gateway/v1/rates/history?source=${source}&target=${target}&length=${days}&resolution=daily&unit=day`
  ];

  for (const url of endpoints) {
    try {
      const res = await api.get(url, {
        headers: {
          "referer": `${BASE_URL}/${LOCALE}/currency-converter/${source.toLowerCase()}-to-${target.toLowerCase()}-rate`
        }
      });
      const contentType = String(res.headers["content-type"] || "");
      const isJson = contentType.includes("application/json") || typeof res.data === "object";
      const points = isJson ? normalizeHistory(res.data) : [];

      if (res.status >= 200 && res.status < 300 && points.length) {
        return {
          ok: true,
          url,
          code: res.status,
          points
        };
      }
    } catch {}
  }

  return {
    ok: false,
    url: null,
    code: 0,
    points: []
  };
}

async function getChartBuffer({ from, to, amount, converted, rate, points }) {
  const labels = points.map((item) => item.Date);
  const values = points.map((item) => item.Rate);

  const formattedAmount = Number(amount).toLocaleString('id-ID');
  const formattedConverted = Number(converted).toLocaleString('id-ID', { maximumFractionDigits: 4 });
  const formattedRate = Number(rate).toLocaleString('id-ID', { maximumFractionDigits: 4 });

  const chart = {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: `${from}/${to}`,
          data: values,
          fill: false,
          borderWidth: 3,
          pointRadius: 2,
          tension: 0.25
        }
      ]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: `${formattedAmount} ${from} = ${formattedConverted} ${to}`
        },
        subtitle: {
          display: true,
          text: `Live rate: 1 ${from} = ${formattedRate} ${to}`
        },
        legend: {
          display: true
        }
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 45
          }
        },
        y: {
          beginAtZero: false
        }
      }
    }
  };

  const quickChartUrl = "https://quickchart.io/chart";

  const res = await axios.get(quickChartUrl, {
    timeout: TIMEOUT,
    responseType: "arraybuffer",
    params: {
      width: 1000,
      height: 520,
      format: "png",
      backgroundColor: "white",
      c: JSON.stringify(chart)
    },
    validateStatus: () => true
  });

  if (res.status < 200 || res.status >= 300) {
    throw new Error(`Gagal membuat chart image: ${res.status}`);
  }

  return Buffer.from(res.data);
}

async function handler(m, { usedPrefix, prefix, command, sock, conn, args }) {
  const clientBot = sock || conn;
  const pfx = usedPrefix || prefix || '.';

  // Fitur daftar mata uang jika dipanggil via alias .wisecurrencies
  if (command === 'wisecurrencies' || (args[0] && args[0].toLowerCase() === 'list')) {
    if (typeof m.react === 'function') await m.react('⏳');
    try {
      const home = await fetchHomeCurrencies();
      if (!home.currencies.length) {
        throw new Error("Gagal mengambil daftar mata uang dari Wise.");
      }

      let text = `💱 *DAFTAR MATA UANG WISE (${home.currencies.length})*\n────────────────────────────\n\n`;
      const formattedCurrencies = home.currencies.map(c => `• *${c.code}* - ${c.slug || '-'} (${c.symbol || '-'})`).join('\n');
      text += formattedCurrencies;

      await clientBot.sendMessage(m.chat, { text }, { quoted: m });
      if (typeof m.react === 'function') await m.react('✅');
      return;
    } catch (error) {
      console.error('Wise Currencies Error:', error);
      if (typeof m.react === 'function') await m.react('❌');
      return await m.reply('❌ *GAGAL*\n\n> ' + (error.message || String(error)));
    }
  }

  // Fitur Konversi Uang
  if (args.length < 3) {
    return await m.reply(
      `*Format Salah!*\n\n` +
      `📌 *Cara Penggunaan:*\n` +
      `Ketik \`${pfx}${command} <Jumlah> <Mata Uang Asal> <Mata Uang Tujuan>\`\n\n` +
      `💡 *Contoh:*\n` +
      `\`${pfx}${command} 100 USD IDR\`\n` +
      `\`${pfx}${command} 50 EUR JPY\`\n\n` +
      `ℹ️ Ketik \`${pfx}wisecurrencies\` untuk melihat daftar kode mata uang.`
    );
  }

  const amount = Number(args[0]);
  const from = normalizeCode(args[1]);
  const to = normalizeCode(args[2]);

  if (isNaN(amount) || amount <= 0) {
    return await m.reply(`❌ *Jumlah nominal harus berupa angka yang valid dan lebih dari 0.*`);
  }

  if (typeof m.react === 'function') await m.react('⏳');

  try {
    const page = await fetchPage(from, to, amount);
    const data = pickNextData(page.html);

    if (!data) {
      throw new Error("Gagal membaca data Wise. Kemungkinan server sedang terproteksi.");
    }

    const model = data?.props?.pageProps?.model || {};
    const rateData = model.rate || {};
    const rate = numberValue(rateData.value);

    if (rate == null) {
      throw new Error(`Data kurs untuk ${from} ke ${to} tidak ditemukan.`);
    }

    const converted = amount * rate;
    const history = await fetchHistory(from, to, CHART_DAYS);

    const formattedAmount = amount.toLocaleString('id-ID');
    const formattedConverted = converted.toLocaleString('id-ID', { maximumFractionDigits: 4 });
    const formattedRate = rate.toLocaleString('id-ID', { maximumFractionDigits: 4 });

    let caption = `💱 *KONVERSI MATA UANG WISE*\n────────────────────────────\n`;
    caption += `💵 *Input:* ${formattedAmount} ${from}\n`;
    caption += `📊 *Hasil:* ${formattedConverted} ${to}\n`;
    caption += `📈 *Nilai Tukar Live:* 1 ${from} = ${formattedRate} ${to}\n`;
    caption += `────────────────────────────\n`;
    caption += `🕒 *Riwayat Grafik:* ${history.points.length ? `${CHART_DAYS} Hari Terakhir` : 'Tidak tersedia'}`;

    let imageBuffer = null;
    if (history.points.length >= 2) {
      try {
        imageBuffer = await getChartBuffer({
          from,
          to,
          amount,
          converted,
          rate,
          points: history.points
        });
      } catch (err) {
        console.error("Gagal generate chart image:", err.message);
      }
    }

    if (imageBuffer) {
      await clientBot.sendMessage(
        m.chat,
        {
          image: imageBuffer,
          caption: caption
        },
        { quoted: m }
      );
    } else {
      await clientBot.sendMessage(
        m.chat,
        { text: caption },
        { quoted: m }
      );
    }

    if (typeof m.react === 'function') await m.react('✅');

  } catch (error) {
    console.error('Wise Detail Plugin Error:', error);
    if (typeof m.react === 'function') await m.react('❌');
    await m.reply('❌ *GAGAL*\n\n> ' + (error.message || String(error)));
  }
}

export { pluginConfig as config, handler };
