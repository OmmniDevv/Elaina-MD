/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';

async function fbdown(url) {
  try {
    const res = await axios.get(`https://api.azbry.com/api/download/facebook?url=${encodeURIComponent(url)}`);
    if (res.data && res.data.status) {
      return res.data;
    }
    return { status: false, message: "Gagal mengambil data dari API" };
  } catch (err) {
    return { status: false, message: err.message };
  }
}

export { fbdown };
