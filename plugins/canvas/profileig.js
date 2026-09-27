/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios";
import te from "../../src/lib/elaina-error.js";
import { uploadImage } from "../../src/lib/elaina-uploader.js";
import { downloadMediaMessage } from '@rexxhayanasi/elaina-baileys';

const pluginConfig = {
    name: "profileig",
    alias: ["profileig", "igprofile"],
    category: "canvas",
    description: "Membuat canvas profile instagram",
    usage: ".profileig <pengikut>|<mengikuti>|<postingan>|<username>|<bio>|<verif(true/false)>",
    example: ".profileig 10M|1|150|jokowi|Presiden RI|true",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 2,
    isEnabled: true,
};

async function handler(m, { sock, text }) {
    if (!text) return m.reply(`Format salah!\n\n> Contoh: .profileig 10M|1|150|jokowi|Presiden RI|true\n> \n> _Catatan: Reply gambar untuk dijadikan foto profil._`);
    const [pengikut, mengikuti, postingan, username, bio, verif] = text.split("|").map(v => v.trim());
    if (!pengikut || !mengikuti || !postingan || !username || !bio || !verif) return m.reply(`Pastikan semua argumen diisi dengan benar, dipisah dengan tanda |.`);
    
    let imgUrl = "";
    const isImage = m.type === "imageMessage" || (m.quoted && m.quoted.type === "imageMessage");
    
    await m.react("🕕");
    try {
        if (isImage) {
            const msg = m.quoted ? m.quoted : m;
            const buffer = await downloadMediaMessage(msg, "buffer", {}, { logger: console });
            imgUrl = await uploadImage(buffer);
        } else {
            try {
                imgUrl = await sock.profilePictureUrl(m.sender, 'image');
            } catch (e) {
                // If user doesn't have a profile picture, provide a default URL
                imgUrl = "https://i.ibb.co/3Fh9Q6M/blank-profile-picture.png";
            }
        }
        
        const url = `https://kyzznekoo.zone.id/api/canvas/profileig?url=${encodeURIComponent(imgUrl)}&pengikut=${encodeURIComponent(pengikut)}&mengikuti=${encodeURIComponent(mengikuti)}&postingan=${encodeURIComponent(postingan)}&username=${encodeURIComponent(username)}&bio=${encodeURIComponent(bio)}&verif=${encodeURIComponent(verif)}`;
        
        const res = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36",
                "Content-Type": "application/json"
            }
        });
        
        await sock.sendMessage(m.chat, { image: Buffer.from(res.data), caption: "✅ Berhasil membuat profile IG" }, { quoted: m });
        await m.react("✅");
    } catch (e) {
        console.error("[ProfileIG Error]", e);
        await m.react("❌");
        m.reply(te(m.prefix, m.command, m.pushName));
    }
}

export { pluginConfig as config, handler };
