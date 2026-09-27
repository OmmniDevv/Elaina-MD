/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { RIMURU_CORE_CONFIG } from "../../config.js";
import config from '../../config.js';
const pluginConfig = {
    name: "sharetoch",
    alias: ["sharetosaluran"],
    category: "owner",
    description: "Share ke channel tanpa watermark",
    usage: ".sharetoch (reply pesan)",
    example: ".sharetoch",
    isOwner: true,
    cooldown: 3,
    isEnabled: true
}

async function handler(m, { sock }) {
    const quoted = m.quoted
    if (!quoted) return m.reply("Reply pesan yang mau dikirim.")

    const CHANNEL_ID = RIMURU_CORE_CONFIG.saluran?.id
    if (!CHANNEL_ID) {
        return m.reply("❌ ID Saluran tidak ditemukan di config!\n\n> Cek bagian `saluran.id` di config.js")
    }

    m.react("⏳")

    try {
        let msg = quoted.message

        if (msg?.ephemeralMessage) msg = msg.ephemeralMessage.message
        if (msg?.viewOnceMessage) msg = msg.viewOnceMessage.message
        if (msg?.viewOnceMessageV2) msg = msg.viewOnceMessageV2.message

        const type = Object.keys(msg)[0]

        if (type === "conversation" || type === "extendedTextMessage") {
            await sock.sendMessage(CHANNEL_ID, {
                text: quoted.text || msg.conversation
            })
        } else {
            const buffer = await quoted.download()
            if (!buffer) return m.reply("❌ Gagal ambil media")

            let payload = {}

            switch (type) {
                case "imageMessage":
                    payload = {
                        image: buffer,
                        caption: msg.imageMessage?.caption || ""
                    }
                    break

                case "videoMessage":
                    payload = {
                        video: buffer,
                        caption: msg.videoMessage?.caption || ""
                    }
                    break

                case "audioMessage":
                    payload = {
                        audio: buffer,
                        mimetype: "audio/mpeg",
                        ptt: msg.audioMessage?.ptt || false
                    }
                    break

                case "stickerMessage":
                    payload = { sticker: buffer }
                    break

                case "documentMessage":
                    payload = {
                        document: buffer,
                        mimetype: msg.documentMessage?.mimetype || "application/octet-stream",
                        fileName: msg.documentMessage?.fileName || "file"
                    }
                    break

                default:
                    return m.reply("❌ Tipe tidak support")
            }

            await sock.sendMessage(CHANNEL_ID, payload)
        }

        m.react("✅")

    } catch (e) {
        console.log(e)
        m.react("❌")
        m.reply("Error: " + e.message)
    }
}

export { pluginConfig as config, handler };
