/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


//Open AI 
// Sumber scrape : https://whatsapp.com/channel/0029Vaf07jKCBtxAsekFFk3i/3924
import axios from 'axios'
import * as cheerio from 'cheerio'
import FormData from 'form-data'

const pluginConfig = {
  name: "openai",
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

async function handler(m, { text, prefix, command }) {
    const usedPrefix = prefix || m.prefix || ".";
  if (!text) throw `Contoh: *${usedPrefix + command} apa itu AI?*`

  const message = text
  const prompt = `Kamu adalah AI pintar dan ramah. Jawab setiap pertanyaan dengan jelas, padat, dan sopan.`
  const tanggapan = `Hai! Saya adalah AI yang siap menjawab pertanyaanmu dengan informasi akurat dan mudah dipahami.`

  const htmlRes = await axios.get('https://chatopenai.id', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36'
    }
  })
  const $ = cheerio.load(htmlRes.data)
  const scriptContent = $('#wpaicg-init-js-extra').html()
  const match = scriptContent?.match(/"search_nonce":"([a-z0-9]+)"/i)
  const wpnonce = match?.[1]
  if (!wpnonce) throw 'Gagal mengambil token dari halaman.'

  const form = new FormData()
  form.append('_wpnonce', wpnonce)
  form.append('post_id', '2')
  form.append('url', 'https://chatopenai.id')
  form.append('action', 'wpaicg_chat_shortcode_message')
  form.append('message', message)
  form.append('bot_id', '0')
  form.append('chatbot_identity', 'shortcode')
  form.append('wpaicg_chat_client_id', '6MizuOGxCL')
  form.append('wpaicg_chat_history', JSON.stringify([
    `Human: ${prompt}`,
    `AI: ${tanggapan}`,
    `Human: ${message}`
  ]))

  const headers = {
    ...form.getHeaders(),
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36',
    'Referer': 'https://chatopenai.id/',
  }

  const res = await axios.post('https://chatopenai.id/wp-admin/admin-ajax.php', form, { headers })
  const jawab = res?.data?.data?.trim()

  if (!jawab) throw 'Gagal mendapatkan balasan dari AI.'

  m.reply(jawab)
}

export { pluginConfig as config, handler };
