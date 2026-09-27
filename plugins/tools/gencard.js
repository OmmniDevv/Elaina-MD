/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

/*
  @ Base: https://www.lambdatest.com/free-online-tools/credit-card-number-generator
  @ Author: Shannz (Adapted for WA Bot)
  @ Note: Credit Card Generator by Lambdatest.
*/

import axios from 'axios';

const creditGenerator = async (type, amount) => {
  const allowedTypes = ["Visa", "American Express", "MasterCard", "JCB"];
  
  // Normalisasi input type (Case-insensitive)
  const matchedType = allowedTypes.find(t => t.toLowerCase() === type.toLowerCase());
  
  if (!matchedType) {
    throw new Error(
      `Tipe kartu "${type}" tidak valid.\nTipe yang tersedia: *${allowedTypes.join(", ")}*`
    );
  }

  const numAmount = parseInt(amount);
  if (isNaN(numAmount) || numAmount <= 0 || numAmount > 100) {
    throw new Error(`Jumlah kartu tidak valid. Masukkan angka antara *1 hingga 100*.`);
  }

  try {
    const config = {
      method: 'GET',
      url: `https://backend.lambdatest.com/api/dev-tools/credit-card-generator?type=${encodeURIComponent(matchedType)}&no-of-cards=${numAmount}`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36',
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'sec-ch-ua-platform': '"Android"',
        'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
        'content-type': 'application/json',
        'dnt': '1',
        'sec-ch-ua-mobile': '?1',
        'origin': 'https://www.lambdatest.com',
        'sec-fetch-site': 'same-site',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        'referer': 'https://www.lambdatest.com/free-online-tools/credit-card-number-generator',
        'accept-language': 'id,en-US;q=0.9,en;q=0.8,ja;q=0.7',
        'priority': 'u=1, i'
      }
    };

    const api = await axios.request(config);
    return api.data;

  } catch (e) {
    console.error('[CreditGenerator Error]', e);
    throw new Error('Gagal mengambil data dari server LambdaTest.');
  }
};

const pluginConfig = {
  name: 'gencard',
  alias: ['ccgen', 'cardgen', 'fakecc'],
  category: 'tools',
  description: 'Membuat data dummy nomor kartu kredit (Visa, MasterCard, JCB, Amex)',
  usage: '.gencard Tipe | Jumlah',
  example: '.gencard Visa | 5',
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true
};

async function handler(m, { text, command, prefix }) {
  const pfx = prefix || m.prefix || '.';

  if (!text) {
    if (m.react) await m.react('❌');
    return m.reply(
      `*Format Salah!*\n\n` +
      `Silakan masukkan tipe kartu dan jumlah yang diinginkan.\n` +
      `\`${pfx}${command} Tipe | Jumlah\`\n\n` +
      `*Tipe yang tersedia:*\n` +
      `• Visa\n` +
      `• MasterCard\n` +
      `• American Express\n` +
      `• JCB\n\n` +
      `*Contoh:*\n` +
      `\`${pfx}${command} Visa | 5\``
    );
  }

  const [typeInput, amountInput] = text.split('|').map(s => s?.trim());

  if (!typeInput || !amountInput) {
    if (m.react) await m.react('❌');
    return m.reply(
      `*Format Kurang Lengkap!*\n\n` +
      `Gunakan tanda pemisah garis lurus (|).\n` +
      `Contoh: \`${pfx}${command} MasterCard | 3\``
    );
  }

  if (m.react) await m.react('⏳');

  try {
    const cards = await creditGenerator(typeInput, amountInput);

    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      if (m.react) await m.react('❌');
      return m.reply('❌ Tidak ada kartu yang berhasil dibuat.');
    }

    if (m.react) await m.react('✅');

    let resultText = `💳 *CREDIT CARD GENERATOR*\n\n`;
    resultText += `📌 *Tipe:* ${typeInput.toUpperCase()}\n`;
    resultText += `📊 *Total:* ${cards.length} Kartu\n\n`;
    resultText += `───────────────\n\n`;

    cards.forEach((card, index) => {
      resultText += `*${index + 1}. Card Details*\n`;
      resultText += `• *Card Number:* \`${card.cardNumber || card['Card Number'] || card.number || '-'}\`\n`;
      resultText += `• *Expiry Date:* \`${card.expDate || card['Expiration Date'] || card.expiry || '-'}\`\n`;
      resultText += `• *CVV:* \`${card.cvv || card.CVV || card.cvc || '-'}\`\n`;
      if (card.name || card['Name']) {
        resultText += `• *Name:* ${card.name || card['Name']}\n`;
      }
      resultText += `\n`;
    });

    resultText += `⚠️ *Catatan:* Data di atas murni dummy/fake untuk keperluan pengujian (testing).`;

    await m.reply(resultText);

  } catch (error) {
    console.error('CreditGen Plugin Error:', error);
    if (m.react) await m.react('❌');
    await m.reply('❌ *GAGAL*\n\n> ' + error.message);
  }
}

export { pluginConfig as config, handler };
