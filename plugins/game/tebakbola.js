/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import axios from "axios"

let timeout = 60000
let poin = 4999

const pluginConfig = {
  name: "tebakbola",
  alias: ["whobola"],
  category: "game",
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

async function handler(m, { sock, prefix, command }) {
    const conn = sock;
    const usedPrefix = prefix || m.prefix || ".";
  conn.game = conn.game || {}
  const id = "tebakbola-" + m.chat

  if (command === "tebakbola") {
    if (id in conn.game)
      return m.reply("Masih ada soal yang belum terjawab!")

    let data
    try {
      const res = await axios.get("https://api.deline.web.id/game/tebakpemainbola")
      if (!res.data?.result) throw new Error()
      data = res.data.result
    } catch {
      return m.reply("Gagal mengambil data pemain bola, coba lagi.")
    }

    const answer = data.jawaban.trim().toLowerCase()
    const clue = data.deskripsi || "Tidak ada deskripsi."

    const caption = `
⚽ *TEBAK PEMAIN BOLA*

Soal:
❓ *${data.soal}*

Timeout: *${timeout / 1000} detik*
Ketik *${usedPrefix}whobola* untuk bantuan
Bonus: ${poin} XP
`.trim()

    let msg = await m.reply(caption)

    conn.game[id] = [
      msg,
      { answer },
      poin,
      setTimeout(() => {
        if (conn.game[id]) {
          conn.reply(
            m.chat,
            `⏳ *Waktu habis!*\nJawabannya adalah: *${data.jawaban}*`,
            conn.game[id][0]
          )
          delete conn.game[id]
        }
      }, timeout)
    ]
  }

  if (command === "whobola") {
    if (!(id in conn.game)) return m.reply("Tidak ada game aktif.")

    let ans = conn.game[id][1].answer
    let hint = ans[0] + "_".repeat(Math.max(ans.length - 2, 1)) + ans.slice(-1)

    return m.reply(`🧩 *Hint:* ${hint}`)
  }
}

handler.all = async function (m) {
  const id = "tebakbola-" + m.chat
  if (!(id in this.game)) return

  let text = (m.text || "").trim().toLowerCase()
  if (!text) return

  let ans = this.game[id][1].answer

  if (text === ans || text.includes(ans)) {
    clearTimeout(this.game[id][3])
    this.reply(
      m.chat,
      `🎉 *Benar!* Pemain tersebut adalah: *${ans.toUpperCase()}*`,
      this.game[id][0]
    )
    delete this.game[id]
  }
}

export { pluginConfig as config, handler };
