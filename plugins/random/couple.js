/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import config from '../../config.js'
import { downloadMediaMessage } from '@rexxhayanasi/elaina-baileys'
import fs from 'fs'
import { default as axios } from 'axios'
import te from '../../src/lib/elaina-error.js'
const pluginConfig = {
    name: 'ppcouple',
    alias: ['cp', 'ppcp'],
    category: 'random',
    description: 'Random gambar pp couple',
    usage: '.ppcouple',
    isGroup: true,
    isBotAdmin: false,
    isAdmin: false,
    cooldown: 10,
    energi: 2,
    isEnabled: true
};

async function handler(m, { sock }) {
   try {
        const res = await axios.get(`https://api.deline.web.id/random/ppcouple`)
        const data = res.data.result
        const cowo = data.cowo
        const cewe = data.cewe
        await sock.sendMessage(m.chat, {
            albumMessage: [
                {
                    image: { url: cowo },
                },
                {
                    image: { url: cewe },
                }
            ]
        }, { quoted: m })
   } catch (error) {
    m.reply(te(m.prefix, m.command, m.pushName))
   }
}

export { pluginConfig as config, handler }