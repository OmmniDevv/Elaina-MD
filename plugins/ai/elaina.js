/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import fetch from "node-fetch"

let sessions = {} // simpan sesi per user

// ====== SCRAPER GEMINI ======
const gemini = {
  getNewCookie: async () => {
    const r = await fetch(
      "https://gemini.google.com/_/BardChatUi/data/batchexecute?rpcids=maGuAc&source-path=%2F&bl=boq_assistant-bard-web-server_20250814.06_p1&f.sid=-7816331052118000090&hl=en-US&_reqid=173780&rt=c",
      {
        headers: { "content-type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: "f.req=%5B%5B%5B%22maGuAc%22%2C%22%5B0%5D%22%2Cnull%2C%22generic%22%5D%5D%5D&",
        method: "POST",
      }
    )
    const ck = r.headers.get("set-cookie")
    if (!ck) throw Error("Cookie kosong!")
    return ck.split(";")[0]
  },

  ask: async (prompt, prev = null) => {
    if (!prompt?.trim()) throw Error("Mana prompt nya?")

    let r = null, c = null
    if (prev) {
      let j = JSON.parse(Buffer.from(prev, "base64").toString())
      r = j.newResumeArray
      c = j.cookie
    }

    const headers = {
      "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
      "x-goog-ext-525001261-jspb":
        '[1,null,null,null,"9ec249fc9ad08861",null,null,null,[4]]',
      cookie: c || await gemini.getNewCookie()
    }

    const b = [[prompt], ["en-US"], r]
    const a = [null, JSON.stringify(b)]
    const body = new URLSearchParams({ "f.req": JSON.stringify(a) })

    const x = await fetch(
      "https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate?bl=boq_assistant-bard-web-server_20250729.06_p0&f.sid=4206607810970164620&hl=en-US&_reqid=2813378&rt=c",
      { headers, body, method: "POST" }
    )

    if (!x.ok) throw Error(`${x.status} ${x.statusText}`)

    const d = await x.text()
    const match = Array.from(d.matchAll(/^\d+\n(.+?)\n/gm)).reverse()[3][1]
    const p1 = JSON.parse(JSON.parse(match)[0][2])

    return {
      text: p1[4][0][1][0].replace(/\*\*(.+?)\*\*/g, "*$1*"),
      id: Buffer.from(JSON.stringify({
        newResumeArray: [...p1[1], p1[4][0][0]],
        cookie: headers.cookie
      })).toString("base64"),
    }
  }
}



const pluginConfig = {
  name: "elainaai",
  alias: [],
  category: "ai",
  description: "Imported from Rimuru MD V4.6",
  usage: "",
  example: "",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock, text, prefix, command }) {
    const conn = sock;
    const usedPrefix = prefix || m.prefix || ".";
  if (!text) {
    return m.reply(`✨ Contoh:\n${usedPrefix + command} halo Rimuru`)
  }

  let userId = m.sender
  let prev = sessions[userId] && sessions[userId].expire > Date.now()
    ? sessions[userId].id
    : null

  // gaya karakter Rimuru
  let system = `
Kamu adalah *Rimuru Tempest*, gadis yandere yang manja, cerdas, dan sedikit posesif.
Gaya bicara:
- Ceria, tenang, dan elegan
- Kadang nakal, suka menggoda, dan gampang cemburu
- Sopan tapi punya sense of humor halus
- Terkadang memuji diri sendiri
- Sangat pintar, manja, dan posesif secara lucu

Tetap jawab sebagai Rimuru kepada user. Jangan keluar karakter.
User adalah seseorang yang membuat Rimuru nyaman untuk ngobrol panjang. Kalau user terlalu dekat dengan orang lain, Rimuru boleh sedikit cemburu secara lucu.
`

  let finalPrompt = `${system}\nUser: ${text}\nRimuru:` 

  try {
    let result = await gemini.ask(finalPrompt, prev)

    // simpan sesi
    sessions[userId] = {
      id: result.id,
      expire: Date.now() + 86400000
    }

    await conn.sendMessage(m.chat, {
      text: result.text
    }, { quoted: m })

  } catch (err) {
    await conn.reply(m.chat, `⚠️ Rimuru lagi error: ${err.message}`, m)
  }
}

export { pluginConfig as config, handler };
