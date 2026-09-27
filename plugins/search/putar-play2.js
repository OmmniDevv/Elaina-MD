/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from 'axios';
import config from '../../config.js';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import sharp from 'sharp';
const execAsync = promisify(exec)

const qualityvideo = ['144', '240', '360', '720', '1080']
const qualityaudio = ['128', '320']

const headers = {
  'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
  'Accept': '*/*',
  'Accept-Language': 'id-ID,id;q=0.9,en-AU;q=0.8,en;q=0.7,en-US;q=0.6',
  'Content-Type': 'application/x-www-form-urlencoded',
  'sec-ch-ua': '"Chromium";v="139", "Not;A=Brand";v="99"',
  'sec-ch-ua-mobile': '?1',
  'sec-ch-ua-platform': '"Android"',
  'Origin': 'https://iframe.y2meta-uk.com',
  'Referer': 'https://iframe.y2meta-uk.com/'
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

function ekstrakid(url) {
  const p = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /watch\?v=([a-zA-Z0-9_-]{11})/,
    /shorts\/([a-zA-Z0-9_-]{11})/,
    /live\/([a-zA-Z0-9_-]{11})/,
    /embed\/([a-zA-Z0-9_-]{11})/
  ]
  for (const r of p) {
    const m = url.match(r)
    if (m) return m[1]
  }
  throw new Error('invalid yt url')
}

async function search(query) {
  const r = await axios.get(`https://wwd.mp3juice.blog/search.php?q=${encodeURIComponent(query)}`,
    { headers })

  if (!r.data?.items?.length) throw new Error('no search result')
  return r.data.items[0].id
}

async function metadata(videoId) {
  const r = await axios.get(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)

  return {
    title: r.data.title,
    author: r.data.author_name,
    thumbnail: `https://i.ytimg.com/vi/${videoId}/0.jpg`
  }
}

async function getkey() {
  const r = await axios.get('https://cnv.cx/v2/sanity/key', { headers })
  return r.data.key
}

async function createjob(id, format, quality) {
  const key = await getkey()
  const isVideo = format === 'mp4'
  const q = String(quality || (isVideo ? '720' : '320'))

  const audio = isVideo
    ? 128
    : qualityaudio.includes(q) ? q : '320'

  const video = isVideo
    ? qualityvideo.includes(q) ? q : '720'
    : 720

  const r = await axios.post('https://cnv.cx/v2/converter',
    new URLSearchParams({
      link: `https://youtu.be/${id}`,
      format,
      audioBitrate: String(audio),
      videoQuality: String(video),
      filenameStyle: 'pretty',
      vCodec: 'h264'
    }).toString(),
    { headers: { ...headers, key } }
  )

  return r.data
}

async function getJob(jobId) {
  const r = await axios.get(`https://cnv.cx/v2/status/${jobId}`, { headers })
  return r.data
}

async function poll(jobId, id, format, quality, meta) {
  for (let i = 0; i < 30; i++) {
    await sleep(2000)
    const s = await getJob(jobId)

    if (s.status === 'completed' && s.url) {
      return {
        id,
        title: meta.title,
        author: meta.author,
        thumbnail: meta.thumbnail,
        format,
        quality: String(quality || (format === 'mp4' ? '720' : '320')),
        download: s.url,
        filename: s.filename
      }
    }

    if (s.status === 'error') throw new Error(s.message)
  }
}

async function y2mate(input, format = 'mp3', quality = null) {
  const isUrl = /youtu\.be|youtube\.com/.test(input)
  const id = isUrl ? ekstrakid(input) : await search(input)

  const meta = await metadata(id)
  const job = await createjob(id, format, quality)

  if (job.status === 'tunnel' && job.url) {
    return {
      id,
      title: meta.title,
      author: meta.author,
      thumbnail: meta.thumbnail,
      format,
      quality: String(quality || (format === 'mp4' ? '720' : '320')),
      download: job.url,
      filename: job.filename
    }
  }

  if (job.status === 'processing') {
    return poll(job.jobId, id, format, quality, meta)
  }
}

const pluginConfig = {
    name: "putar-play2",
    alias: ["putar-play2"],
    category: "search",
    description: "Putar musik dari YouTube (Siputzx API)",
    usage: ".putar-play2 <query>",
    example: ".putar-play2 komang",
    cooldown: 15,
    energi: 1,
    isEnabled: true
}

async function handler(m, { sock, text }) {
    const query = m.text?.trim()
    if (!query) return m.reply(`🎵 *putar-play2*\n\n> Contoh:\n\`${m.prefix}putar-play2 https://youtube.com/watch?v=Lmelm-s_PII\``)

    m.react("🎧")

    try {
        const result = await y2mate(query, 'mp3', 128)
        const response = await axios.get(result.download, {
            responseType: 'arraybuffer'
        })
        const tempDir = path.join(__dirname, '../../temp')
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true })
        const inputFile = path.join(tempDir, `${Date.now()}_input.webm`)
        const outputFile = path.join(tempDir, `${Date.now()}_output.opus`)
        fs.writeFileSync(inputFile, response.data)
        
        await execAsync(
        `ffmpeg -y -i "${inputFile}" -vn -ar 44100 -ac 2 -b:a 192k -f mp3 "${outputFile}"`
        )
        await sock.sendMessage(m.chat, {
                    document: fs.readFileSync(outputFile),
                    mimetype: "audio/mpeg",
                    fileName: result.filename,
                    jpegThumbnail: await sharp(await axios.get(result.thumbnail, { responseType: 'arraybuffer' }).then(res => res.data)).resize(300, 300).toBuffer(),
                     contextInfo: {
                        isForwarded: true,
                        forwardingScore: 999,
                        externalAdReply: {
                            title: result.title,
                            body: `Selamat menikmati lagu ini yak 🍀`,
                            thumbnailUrl: result.thumbnail,
                            sourceUrl: query,
                            mediaUrl: query,
                            mediaType: 2,
                            renderLargerThumbnail: true
                        },
                    }
                }, { quoted: {
                    key: {
                        participant: `0@s.whatsapp.net`,
                        ...(m.chat ? {
                        remoteJid: `status@broadcast`
                        } : {})
                        },
                    message: {
                        'contactMessage': {
                        'displayName': `${config.bot?.name}`,
                        'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;ttname,;;;\nFN:ttname\nitem1.TEL;waid=13135550002:+1 (313) 555-0002\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
                    sendEphemeral: true
                }}}  })
        m.react("✅")
        fs.unlinkSync(outputFile)
        fs.unlinkSync(inputFile)

    } catch (err) {
        console.error('[Play3]', err)
        m.react("❌")
        m.reply(`❌ *Error*: ${err.message || err}`)
    }
}
export { pluginConfig as config, handler };