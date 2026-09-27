/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";
import { canUseAm, markSuccess } from '../../src/lib/am-roles.js';

const pluginConfig = {
  name: "ambulk",
  alias: ["amremlist", "bulkam", "ambulkgen"],
  category: "tools",
  description: "Membuat beberapa akun Alight Motion Premium sekaligus (bulk)",
  usage: ".ambulk <jumlah> <prefix>",
  example: ".ambulk 3 rimuru",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 15,
  energi: 0,
  isEnabled: true,
};

const API_KEY = "albymd-235b23e";
const BASE_URL_RANDOM = "https://albyoffc.my.id/api/v1/am/bulkrandom";
const BASE_URL_CUSTOM = "https://albyoffc.my.id/api/v1/am/bulkcustom";

async function handler(m, { sock }) {
  // Role gate: free 1x/hari (sukses saja yang dihitung)
  try {
    const isOwn = Boolean(arguments[1]?.isOwner || m.isOwner);
    const gate = canUseAm(m.sender, isOwn);
    if (!gate.ok) {
      return m.reply('❌ ' + (gate.message || 'Limit free habis. Upgrade role AM.'));
    }
  } catch (e) {}

  const args = (m.fullArgs?.trim() || m.text?.trim() || '').split(' ');
  const inputAmount = args[0] || '1';
  const prefix = args[1] || ''; // Kosong jika tidak ada prefix
  
  const amount = parseInt(inputAmount) || 1;

  if (amount < 1 || amount > 10) {
    return m.reply(
      `⚠️ *Jumlah Tidak Valid*\n\n` +
      `Penggunaan:\n` +
      `└ \`${m.prefix || '.'}ambulk <jumlah>\` (Random tanpa prefix)\n` +
      `└ \`${m.prefix || '.'}ambulk <jumlah> <prefix>\` (Dengan prefix)\n\n` +
      `Contoh:\n` +
      `└ \`${m.prefix || '.'}ambulk 3\` (Random)\n` +
      `└ \`${m.prefix || '.'}ambulk 3 rimuru\` (Prefix rimuru)`
    );
  }

  await m.react('⏳');

  try {
    let url;
    let isCustom = false;
    
    // Jika ada prefix, pakai bulkcustom
    if (prefix && prefix.length > 0) {
      url = `${BASE_URL_CUSTOM}?apikey=${API_KEY}&count=${amount}&prefix=${prefix}`;
      isCustom = true;
    } else {
      // Jika tidak ada prefix, pakai bulkrandom
      url = `${BASE_URL_RANDOM}?apikey=${API_KEY}&count=${amount}`;
    }

    const { data } = await axios.get(url);
    console.log('API Response:', data);

    // Cek apakah response adalah string
    if (typeof data === 'string' && data.includes('Berhasil membuat')) {
      await m.react('✅');
      
      // Mark success untuk role
      try { markSuccess(m.sender); } catch (e) {}
      
      let caption = `✨ *ALIGHT MOTION BULK GENERATOR* ✨\n\n`;
      caption += `✅ *${data}*\n\n`;
      caption += `📊 *Detail:*\n`;
      caption += `└ 📦 Jumlah: ${amount}\n`;
      if (isCustom) {
        caption += `└ 🏷️ Prefix: ${prefix}\n`;
      } else {
        caption += `└ 🎲 Mode: Random\n`;
      }
      caption += `\n_Cek email Anda untuk verifikasi akun Alight Motion!_`;

      return m.reply(caption);
    }

    // Cek apakah response adalah object dengan status true dan data
    if (data && data.status === true && data.data) {
      await m.react('✅');
      
      // Mark success untuk role
      try { markSuccess(m.sender); } catch (e) {}
      
      let caption = `✨ *ALIGHT MOTION BULK GENERATOR* ✨\n\n`;
      caption += `✅ *${data.message || 'Berhasil membuat akun!'}*\n\n`;
      caption += `📊 *Detail:*\n`;
      caption += `└ 📦 Total: ${data.data.total || amount}\n`;
      caption += `└ ✅ Sukses: ${data.data.success || 0}\n`;
      caption += `└ ❌ Gagal: ${data.data.failed || 0}\n`;
      if (isCustom && data.data.prefix) {
        caption += `└ 🏷️ Prefix: ${data.data.prefix}\n`;
      } else {
        caption += `└ 🎲 Mode: Random\n`;
      }
      caption += `└ ⏱️ Waktu: ${data.data.elapsedMs || 0}ms\n\n`;
      
      // Tampilkan daftar akun
      if (data.data.accounts && data.data.accounts.length > 0) {
        caption += `📧 *Daftar Akun:*\n`;
        data.data.accounts.forEach((acc, i) => {
          caption += `\n*${i + 1}. Akun Alight Motion*\n`;
          caption += `└ 📧 Email: \`${acc.email || 'Tidak tersedia'}\`\n`;
          if (acc.inboxUrl) {
            caption += `└ 🔗 Inbox: ${acc.inboxUrl}\n`;
          }
          if (acc.orderId) {
            caption += `└ 🆔 Order ID: ${acc.orderId}\n`;
          }
          if (acc.billing) {
            caption += `└ 📅 Billing: ${acc.billing}\n`;
          }
          if (acc.waitTime) {
            caption += `└ ⏱️ Wait: ${acc.waitTime}\n`;
          }
          if (acc.password) {
            caption += `└ 🔑 Password: \`${acc.password}\`\n`;
          }
          if (acc.login_url) {
            caption += `└ 🔗 Login URL: ${acc.login_url}\n`;
          }
        });
      }
      
      // Tampilkan daftar gagal jika ada
      if (data.data.failed_list && data.data.failed_list.length > 0) {
        caption += `\n❌ *Gagal:*\n`;
        data.data.failed_list.forEach((fail, i) => {
          caption += `\n${i + 1}. ${fail.reason || 'Unknown error'}`;
        });
      }

      caption += `\n\n_Cek inbox email untuk verifikasi akun Alight Motion!_`;

      return m.reply(caption);
    }

    // Jika response adalah object dengan data array (format lain)
    if (data && data.data && Array.isArray(data.data)) {
      await m.react('✅');
      
      // Mark success untuk role
      try { markSuccess(m.sender); } catch (e) {}
      
      let caption = `✨ *ALIGHT MOTION BULK GENERATOR* ✨\n\n`;
      caption += `✅ *Berhasil membuat ${data.data.length} akun*\n`;
      if (isCustom) {
        caption += `🏷️ *Prefix:* ${prefix}\n`;
      } else {
        caption += `🎲 *Mode:* Random\n`;
      }
      caption += `───────────────────\n\n`;

      data.data.forEach((acc, i) => {
        caption += `*${i + 1}. Akun Alight Motion*\n`;
        caption += `📧 *Email:* \`${acc.email || acc.account || 'Tidak tersedia'}\`\n`;
        caption += `🔑 *Password:* \`${acc.password || 'Tidak tersedia'}\`\n`;
        if (acc.login_url) caption += `🔗 *Login URL:* ${acc.login_url}\n`;
        caption += `🌟 *Status:* ${acc.status || 'Active'}\n\n`;
      });

      return m.reply(caption.trim());
    }

    // Jika gagal
    await m.react('❌');
    return m.reply(`❌ *Gagal Generate:* ${data?.message || data || 'Terjadi kesalahan pada API.'}`);

  } catch (error) {
    console.error('[AMBULK ERROR]', error);
    await m.react('❌');
    return m.reply(`❌ *Error:* ${error.response?.data?.message || error.message}`);
  }
}

export { pluginConfig as config, handler };