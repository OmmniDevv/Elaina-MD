/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const cancelJadibot = new Set()

const pluginConfig = {
  name: "bataljadibot",
  alias: ["canceljadibot", "stopjadibotstart"],
  category: "premium",
  description: "Batalkan proses jadibot yang sedang dimulai",
  usage: ".bataljadibot",
  example: ".bataljadibot",
  isOwner: false,
  isPremium: true,
  isGroup: false,
  cooldown: 5,
  isEnabled: true,
}

async function handler(m) {

  const userJid = m.sender

  cancelJadibot.add(userJid)

  await m.reply(
`🌸 *RIMURU NOTICE*

Baik darling~

Proses *jadibot* sudah
Rimuru batalkan ya 💕

Kalau ingin mencoba lagi
silakan ketik *.jadibot* ✨`
  )

}

export { pluginConfig as config, handler, cancelJadibot };
