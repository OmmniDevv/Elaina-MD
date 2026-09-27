/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


/**
 ╔══════════════════════
      ⧉  [readqr] — [tools]
╚══════════════════════

  ✺ Type     : Plugin ESM
  ✺ Source   : https://whatsapp.com/channel/0029VbAXhS26WaKugBLx4E05
  ✺ Creator  : SXZnightmare
  ✺ Note    : gunain untuk membaca atau decode QR code langsung dari gambar, buat uji coba pake fitur qrcode lalu readqr juga bisa, tq to Zenz telah mencari web atau api nya ygy
*/

const pluginConfig = {
  name: "readqr",
  alias: [],
  category: "tools",
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

async function handler(m, { sock, prefix, command }) {
    const conn = sock;
    const usedPrefix = prefix || m.prefix || ".";
    try {
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || "";
        if (!mime.startsWith("image/")) {
            return m.reply(`*Reply atau kirim gambar QR Code*\n*Contoh: ${usedPrefix + command}*`);
        }

        await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

        let buffer = await q.download();
        let form = new FormData();
        form.append("file", new Blob([buffer]), "qrcode.png");

        let res = await fetch("https://api.qrserver.com/v1/read-qr-code/", {
            method: "POST",
            body: form
        });

        let json = await res.json();
        let result = json?.[0]?.symbol?.[0];

        if (!result || result.error || !result.data) {
            return m.reply(`🍂 *Gagal membaca QR Code.*\nPastikan gambar jelas dan tidak blur.`);
        }

        let output = `
📷 *QR Code Berhasil Dibaca*
━━━━━━━━━━━━━━
📄 *Isi QR:*
${result.data}
━━━━━━━━━━━━━━
        `.trim();

        await m.reply(output);
    } catch (e) {
        await m.reply(`🍂 *Terjadi kesalahan saat memproses QR Code.*`);
    } finally {
        await conn.sendMessage(m.chat, { react: { text: "", key: m.key } });
    }
};

handler.register = false; // true kan jika ada fitur register atau daftar di bot mu.

export { pluginConfig as config, handler };
