/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import { createCanvas, loadImage } from '@napi-rs/canvas'
import fs from 'fs'
import path from 'path'

const pluginConfig = {
  name: "sertifikatcinta",
  alias: [],
  category: "maker",
  description: "Imported from Rimuru MD V4.6",
  usage: "",
  example: "",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 0,
  isEnabled: true,
};

async function handler(m, { text, sock }) {
    const conn = sock;
  const nama = text || m.pushName || 'Kamu'
  const alasan = pick([
    'karena terlalu tampan hingga memicu pemanasan global',
    'karena senyumnya bikin resah warga +62',
    'karena cinta palsunya berhasil menyakiti banyak hati',
    'karena telah membuat 7 dari 10 orang gagal move on',
    'karena berhasil ghosting dengan cara elegan'
  ])

  try {
    const width = 800, height = 600
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    // Background
    ctx.fillStyle = '#fff0f5'
    ctx.fillRect(0, 0, width, height)

    // Judul
    ctx.fillStyle = '#e91e63'
    ctx.font = 'bold 36px Sans'
    ctx.textAlign = 'center'
    ctx.fillText('💘 SERTIFIKAT CINTA PALSU 💘', width / 2, 100)

    // Nama
    ctx.fillStyle = '#000'
    ctx.font = '28px Sans'
    ctx.fillText(`Diberikan kepada: ${nama}`, width / 2, 200)

    // Alasan
    ctx.font = '22px Sans'
    ctx.fillText(`Sebagai penghargaan`, width / 2, 260)
    ctx.fillText(`karena ${alasan}`, width / 2, 300)

    // Footer
    ctx.font = '18px Sans'
    ctx.fillText(`Dikeluarkan oleh: Dinas Cinta Palsu Internasional`, width / 2, 450)
    ctx.fillText(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, width / 2, 490)

    // TTD
    ctx.fillText(`____________________`, width / 2, 550)
    ctx.fillText(`Direktur Patah Hati Nasional`, width / 2, 575)

    const buffer = canvas.toBuffer()
    await conn.sendFile(m.chat, buffer, 'sertifikat-cinta.jpg', `📜 Sertifikat untuk *${nama}* berhasil dibuat.`, m)
  } catch (e) {
    console.error(e)
    m.reply('❌ Gagal membuat sertifikat cinta palsu.')
  }
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export { pluginConfig as config, handler };
