/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

/*
  @ Base: https://create.appmaker.xyz/
  @ Author: Shannz (Adapted for WA Bot)
  @ Note: Change website url to .apk application
*/

import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const appmaker = {
  defaultHeaders: {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'sec-ch-ua-platform': '"Android"',
    'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
    'dnt': '1',
    'sec-ch-ua-mobile': '?1',
    'origin': 'https://create.appmaker.xyz',
    'sec-fetch-site': 'same-site',
    'sec-fetch-mode': 'cors',
    'sec-fetch-dest': 'empty',
    'referer': 'https://create.appmaker.xyz/',
    'accept-language': 'id,en-US;q=0.9,en;q=0.8,ja;q=0.7',
    'priority': 'u=1, i'
  },

  createApp: async (url, email) => {
    try {
      const data = JSON.stringify({ url, email });
      const config = {
        method: 'POST',
        url: 'https://standalone-app-api.appmaker.xyz/webapp/build',
        headers: {
          ...appmaker.defaultHeaders,
          'Content-Type': 'application/json;charset=UTF-8'
        },
        data: data
      };

      const response = await axios.request(config);
      return response.data;
    } catch (e) {
      throw e;
    }
  },

  uploadFileBuffer: async (buffer, filename, appId) => {
    try {
      const data = new FormData();
      data.append('file', buffer, { filename });
      data.append('id', appId);

      const config = {
        method: 'POST',
        url: 'https://standalone-app-api.appmaker.xyz/webapp/build/file-upload',
        headers: {
          ...appmaker.defaultHeaders,
          ...data.getHeaders()
        },
        data: data
      };

      const response = await axios.request(config);
      return response.data;
    } catch (e) {
      throw e;
    }
  },

  buildApp: async (appConfig) => {
    try {
      const data = JSON.stringify(appConfig);
      const config = {
        method: 'POST',
        url: 'https://standalone-app-api.appmaker.xyz/webapp/build/build',
        headers: {
          ...appmaker.defaultHeaders,
          'Content-Type': 'application/json;charset=UTF-8'
        },
        data: data
      };

      const response = await axios.request(config);
      return response.data;
    } catch (e) {
      throw e;
    }
  },

  checkStatus: async (appId) => {
    try {
      const config = {
        method: 'GET',
        url: `https://standalone-app-api.appmaker.xyz/webapp/build/status?appId=${appId}`,
        headers: {
          ...appmaker.defaultHeaders
        }
      };

      const response = await axios.request(config);
      return response.data;
    } catch (e) {
      throw e;
    }
  },

  getDownloadUrl: async (appId) => {
    try {
      const config = {
        method: 'GET',
        url: `https://standalone-app-api.appmaker.xyz/webapp/complete/download?appId=${appId}`,
        headers: appmaker.defaultHeaders
      };

      const response = await axios.request(config);
      return response.data;
    } catch (e) {
      throw e;
    }
  },

  create: async (url, email, appName, iconBuffer, splashBuffer, options = {}) => {
    try {
      const createResult = await appmaker.createApp(url, email);
      const appId = createResult.body.appId;

      const iconUpload = await appmaker.uploadFileBuffer(iconBuffer, 'icon.jpeg', appId);
      const appIconUrl = iconUpload.cloudStoragePublicUrl;

      const splashUpload = await appmaker.uploadFileBuffer(splashBuffer, 'splash.jpeg', appId);
      const splashIconUrl = splashUpload.cloudStoragePublicUrl;

      const appConfig = {
        appId: appId,
        appIcon: appIconUrl,
        appName: appName,
        isPaymentInProgress: false,
        enableShowToolBar: options.enableShowToolBar !== undefined ? options.enableShowToolBar : true,
        toolbarColor: options.toolbarColor || "#03A9F4",
        toolbarTitleColor: options.toolbarTitleColor || "#FFFFFF",
        splashIcon: splashIconUrl,
        ...options
      };

      await appmaker.buildApp(appConfig);

      let status;
      let attempts = 0;
      const maxAttempts = 30;

      do {
        await new Promise(resolve => setTimeout(resolve, 10000));
        status = await appmaker.checkStatus(appId);
        attempts++;

        if (status.body?.status === 'success') {
          break;
        } else if (status.body?.status === 'failed') {
          throw new Error('App build failed di server Appmaker');
        }
      } while (attempts < maxAttempts && status.body?.status !== 'success');

      if (attempts >= maxAttempts) {
        throw new Error('Build timeout - melebihi batas waktu tunggu');
      }

      const downloadInfo = await appmaker.getDownloadUrl(appId);

      return {
        appId: appId,
        appName: downloadInfo.body.appName,
        packageName: downloadInfo.body.package_name,
        downloadUrl: downloadInfo.body.buildFile,
        aabFile: downloadInfo.body.aabFile,
        appIcon: downloadInfo.body.appIcon
      };

    } catch (e) {
      console.error('[AppMaker Error]', e);
      throw e;
    }
  }
};

function checkImageMedia(msg) {
  if (!msg) return false;
  if (msg.isImage) return true;
  const rawMsg = msg.message || msg.msg || msg;
  const mimetype = msg.mimetype || rawMsg?.mimetype || rawMsg?.documentMessage?.mimetype || rawMsg?.imageMessage?.mimetype || "";
  return mimetype.startsWith("image/");
}

const pluginConfig = {
  name: 'web2apk',
  alias: ['appmaker', 'makeapk', 'tobuildapk'],
  category: 'maker',
  description: 'Mengubah URL Website menjadi Aplikasi Android (.apk)',
  usage: '.web2apk NamaApp | URL | Email (balas foto untuk icon/splash)',
  example: '.web2apk KitsuLabs | https://www.kitsulabs.xyz | user@gmail.com',
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 30,
  energi: 2,
  isEnabled: true
};

async function handler(m, { sock, text, command, prefix }) {
  const isDirectImage = checkImageMedia(m);
  const isQuotedImage = m.quoted ? checkImageMedia(m.quoted) : false;
  const targetMsg = isQuotedImage ? m.quoted : (isDirectImage ? m : null);

  const pfx = prefix || m.prefix || '.';

  if (!text) {
    if (m.react) await m.react('❌');
    return m.reply(
      `*Format Salah!*\n\n` +
      `Silakan reply/balas gambar (untuk Icon & Splash Screen) dengan caption:\n` +
      `\`${pfx}${command} NamaApp | URL | Email\`\n\n` +
      `*Contoh:*\n` +
      `\`${pfx}${command} KitsuLabs | https://www.kitsulabs.xyz | mymail@gmail.com\``
    );
  }

  const [appName, webUrl, userEmail] = text.split('|').map(s => s?.trim());

  if (!appName || !webUrl || !userEmail) {
    if (m.react) await m.react('❌');
    return m.reply(
      `*Format Kurang Lengkap!*\n\n` +
      `Pastikan menggunakan pemisah garis lurus (|) secara lengkap.\n` +
      `\`${pfx}${command} NamaApp | URL | Email\``
    );
  }

  if (!webUrl.startsWith('http://') && !webUrl.startsWith('https://')) {
    if (m.react) await m.react('❌');
    return m.reply('❌ URL Website harus diawali `http://` atau `https://`');
  }

  if (!targetMsg) {
    if (m.react) await m.react('❌');
    return m.reply('❌ Mohon sertakan/balas foto yang akan dijadikan Icon & Splash Screen aplikasi!');
  }

  if (m.react) await m.react('⏳');
  await m.reply('⏳ *Sedang memproses pembuatan APK...*\n\n> Proses ini memakan waktu sekitar 1-3 menit. Harap bersabar!');

  try {
    let imgBuffer;
    if (targetMsg.download) {
      imgBuffer = await targetMsg.download().catch(async () => sock?.downloadMediaMessage(targetMsg));
    } else {
      imgBuffer = await sock?.downloadMediaMessage(targetMsg);
    }

    if (!imgBuffer) {
      if (m.react) await m.react('❌');
      return m.reply('❌ Gagal mengunduh gambar ikon.');
    }

    const res = await appmaker.create(webUrl, userEmail, appName, imgBuffer, imgBuffer);

    if (m.react) await m.react('✅');

    const caption = 
      `🚀 *WEB2APK CONVERTER SUCCESS*\n\n` +
      `📱 *Nama App:* ${res.appName}\n` +
      `📦 *Package Name:* \`${res.packageName}\`\n` +
      `🆔 *App ID:* \`${res.appId}\`\n\n` +
      `🔗 *Link Download APK:*\n${res.downloadUrl}`;

    await m.reply(caption);

  } catch (error) {
    console.error('AppMaker Plugin Error:', error);
    if (m.react) await m.react('❌');
    await m.reply('❌ *GAGAL MEMBUAT APK*\n\n> ' + error.message);
  }
}

export { pluginConfig as config, handler };
