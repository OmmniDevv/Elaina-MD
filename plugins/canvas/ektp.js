/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { createCanvas, loadImage } from "@napi-rs/canvas";
import { downloadMediaMessage, getContentType } from '@rexxhayanasi/elaina-baileys';
import te from "../../src/lib/elaina-error.js";
import axios from "axios";

const pluginConfig = {
  name: "ektp",
  alias: ["ktp"],
  category: "canvas",
  description: "Bikin gambar e-KTP palsu",
  usage: ".ektp <nik>|<nama>|<tanggalLahir> (reply/kirim foto)",
  example: ".ektp 123456789|Fauzan|01-01-2000",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 2,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const text = m.text?.trim();
  if (!text || !text.includes("|")) {
    return m.reply(`⚠️ Harap masukkan NIK, Nama, dan Tanggal Lahir!\nContoh: \`${m.prefix}${m.command} 123456789|Fauzan|01-01-2000\``);
  }

  const data = text.split("|");
  const nik = data[0]?.trim() || "1234567890123456";
  const nama = data[1]?.trim() || "NAMA ANDA";
  const ttl = data[2]?.trim() || "SEMARANG, 01-01-2000";

  let media = null;
  const msgObj = m.quoted?.message ? m.quoted : m;
  const type = getContentType(msgObj.message);

  if (!type || type !== "imageMessage") {
    return m.reply(`⚠️ Harap kirim atau reply foto profil (pas foto) dengan perintah \`${m.prefix}${m.command}\``);
  }
  
  await m.react("🕕");
  
  try {
    media = await downloadMediaMessage(msgObj, "buffer", {});
    if (!media) throw new Error("Gagal membaca media");

    const templateUrl = "https://raw.githubusercontent.com/BochilGaming/games-wabot/master/src/image/ektp.png";
    let bgBuffer;
    try {
        bgBuffer = await axios.get(templateUrl, { responseType: "arraybuffer" }).then(r => r.data);
    } catch(e) {
        // Fallback jika tidak ada KTP blank, kita tidak bisa merender.
        throw new Error("Gagal mengambil template E-KTP dari publik.");
    }

    const template = await loadImage(Buffer.from(bgBuffer));
    const pasPhoto = await loadImage(media);

    const width = 850;
    const height = 530;
    const radius = 20;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#F0F0F0";
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(width - radius, 0);
    ctx.quadraticCurveTo(width, 0, width, radius);
    ctx.lineTo(width, height - radius);
    ctx.quadraticCurveTo(width, height, width - radius, height);
    ctx.lineTo(radius, height);
    ctx.quadraticCurveTo(0, height, 0, height - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.fill();

    ctx.drawImage(template, 0, 0, width, height);

    ctx.fillStyle = "black";
    ctx.font = "bold 25px Arial";
    ctx.textAlign = "center";
    ctx.fillText("PROVINSI JAWA TENGAH", width / 2, 45);
    ctx.fillText("KABUPATEN SEMARANG", width / 2, 75);

    ctx.textAlign = "left";
    ctx.font = "35px Courier New";
    ctx.fillText(nik, 205, 140);

    ctx.font = "bold 20px Arial";
    const valueX = 225;
    ctx.fillText(nama.toUpperCase(), valueX, 180);
    ctx.fillText(ttl.toUpperCase(), valueX, 205);
    ctx.fillText("LAKI-LAKI", valueX, 230);
    ctx.fillText("-", 550, 230);
    ctx.fillText("JL. MAWAR NO. 1", valueX, 255);
    ctx.fillText("001/001", valueX, 282);
    ctx.fillText("DESA MAWAR", valueX, 307);
    ctx.fillText("KEC. MAWAR", valueX, 332);
    ctx.fillText("ISLAM", valueX, 358);
    ctx.fillText("BELUM KAWIN", valueX, 383);
    ctx.fillText("PELAJAR/MAHASISWA", valueX, 409);
    ctx.fillText("WNI", valueX, 434);
    ctx.fillText("SEUMUR HIDUP", valueX, 459);

    const photoX = 635;
    const photoY = 150;
    const photoWidth = 180;
    const photoHeight = 240;

    const photoCanvas = createCanvas(photoWidth, photoHeight);
    const photoCtx = photoCanvas.getContext("2d");

    photoCtx.fillStyle = "#FF0000";
    photoCtx.fillRect(0, 0, photoWidth, photoHeight);

    const aspectRatio = pasPhoto.width / pasPhoto.height;
    let srcWidth, srcHeight, srcX, srcY;

    if (aspectRatio > photoWidth / photoHeight) {
      srcHeight = pasPhoto.height;
      srcWidth = srcHeight * (photoWidth / photoHeight);
      srcX = (pasPhoto.width - srcWidth) / 2;
      srcY = 0;
    } else {
      srcWidth = pasPhoto.width;
      srcHeight = srcWidth * (photoHeight / photoWidth);
      srcX = 0;
      srcY = (pasPhoto.height - srcHeight) / 2;
    }

    photoCtx.drawImage(pasPhoto, srcX, srcY, srcWidth, srcHeight, 0, 0, photoWidth, photoHeight);
    ctx.drawImage(photoCanvas, photoX, photoY, photoWidth, photoHeight);

    ctx.textAlign = "center";
    ctx.font = "16px Arial";
    ctx.fillText("KABUPATEN SEMARANG", photoX + photoWidth / 2, photoY + photoHeight + 35);
    ctx.fillText("01-01-2024", photoX + photoWidth / 2, photoY + photoHeight + 60);

    const signName = nama.split(" ")[0];
    ctx.font = "italic 36px Times New Roman";
    ctx.fillText(signName, photoX + photoWidth / 2, photoY + photoHeight + 110);

    const buffer = await canvas.encode("png");
    await sock.sendMessage(m.chat, { image: buffer, caption: "🪪 *E-KTP*" }, { quoted: m });
    await m.react("✅");

  } catch (err) {
    await m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
