/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

// jjcapcut.js
// JJ CapCut - SC Shinobu ESM Plugin
// Support: jjlist, jjsearch, jjrender

import fs from 'node:fs'
import { spawn } from 'node:child_process'

const config = {
  name: 'jjcapcut',
  alias: ['jjlist', 'jjsearch', 'jjrender'],
  category: 'tools',
  description: 'Generate video JJ CapCut dari template.',
  usage: '.jjlist | .jjsearch <query> | .jjrender <nomor/id>',
  example: '.jjsearch jedag jedug',
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 0,
  isEnabled: true
}

// ================================
// JJ CAPCUT API
// ================================

class JJCapcut {
  constructor() {
    this.baseUrl = 'https://cc.fgsi.dpdns.org'

    this.headers = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Origin': 'https://cc.fgsi.dpdns.org',
      'Referer': 'https://cc.fgsi.dpdns.org/'
    }
  }

  async getCookie(templateId = '') {
    try {
      const url = templateId
        ? `${this.baseUrl}/create/${templateId}`
        : `${this.baseUrl}/`

      const res = await fetch(url, {
        headers: this.headers
      })

      const setCookie = res.headers.get('set-cookie') || ''

      return setCookie.split(';')[0] || ''
    } catch {
      return ''
    }
  }

  async list() {
    try {
      const res = await fetch(`${this.baseUrl}/list`, {
        headers: this.headers
      })

      if (res.ok) {
        const json = await res.json()

        return Object.entries(json).map(([key, val]) => ({
          index: Number(key),
          id: String(val.id),
          title: val.title || 'Untitled',
          mediaCount: Number(val.mediaCount || 1),
          resolusi: val.resolusi || '9:16'
        }))
      }
    } catch {}

    try {
      const htmlRes = await fetch(`${this.baseUrl}/`, {
        headers: this.headers
      })

      if (htmlRes.ok) {
        const html = await htmlRes.text()

        const match = html.match(
          /<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/
        )

        if (match) {
          const data = JSON.parse(match[1])

          const templates =
            data?.props?.pageProps?.templates || []

          return templates.map((val, idx) => ({
            index: idx + 1,
            id: String(val.id),
            title: val.title || 'Untitled',
            mediaCount: Number(val.mediaCount || 1),
            resolusi: val.resolusi || '9:16'
          }))
        }
      }
    } catch (e) {
      throw new Error(
        `Failed to fetch template list: ${e.message}`
      )
    }

    return []
  }

  async search(query = '', limit = 10, offset = 0) {
    if (!query) {
      throw new Error('Search query is required.')
    }

    const cookie = await this.getCookie()

    const url =
      `${this.baseUrl}/search` +
      `?q=${encodeURIComponent(query)}` +
      `&limit=${limit}` +
      `&offset=${offset}`

    const headers = {
      ...this.headers
    }

    if (cookie) {
      headers.Cookie = cookie
    }

    const res = await fetch(url, {
      headers
    })

    if (!res.ok) {
      throw new Error(
        `Search request failed with HTTP ${res.status}`
      )
    }

    return await res.json()
  }

  async create(templateId, images = []) {
    if (!templateId) {
      throw new Error('Template ID is required.')
    }

    if (!images || images.length === 0) {
      throw new Error('Images are required.')
    }

    const cookie = await this.getCookie(templateId)

    const form = new FormData()

    form.append('id', String(templateId))

    for (let i = 0; i < images.length; i++) {
      let buf = images[i]

      if (typeof buf === 'string') {
        if (fs.existsSync(buf)) {
          buf = fs.readFileSync(buf)
        } else if (buf.startsWith('http')) {
          const imgRes = await fetch(buf)

          if (!imgRes.ok) {
            throw new Error(
              `Gagal mengambil gambar HTTP ${imgRes.status}`
            )
          }

          buf = Buffer.from(
            await imgRes.arrayBuffer()
          )
        }
      }

      const blob = new Blob(
        [buf],
        {
          type: 'image/jpeg'
        }
      )

      form.append(
        'files',
        blob,
        `image_${i + 1}.jpg`
      )
    }

    const headers = {
      ...this.headers,
      Referer:
        `${this.baseUrl}/create/${templateId}`
    }

    if (cookie) {
      headers.Cookie = cookie
    }

    const res = await fetch(
      `${this.baseUrl}/jj`,
      {
        method: 'POST',
        body: form,
        headers
      }
    )

    if (!res.ok) {
      const errTxt =
        await res.text().catch(() => '')

      throw new Error(
        `Create task failed with HTTP ${res.status}: ${errTxt}`
      )
    }

    const json =
      await res.json().catch(() => ({}))

    if (!json.task_id) {
      throw new Error(
        json.error ||
        json.message ||
        'Failed to retrieve task_id.'
      )
    }

    return {
      taskId: json.task_id,
      cookie,
      templateId
    }
  }

  async checkTask(
    taskId,
    templateId = '',
    cookie = ''
  ) {
    if (!taskId) {
      throw new Error('Task ID is required.')
    }

    const headers = {
      ...this.headers,
      Referer: templateId
        ? `${this.baseUrl}/create/${templateId}`
        : `${this.baseUrl}/`
    }

    if (cookie) {
      headers.Cookie = cookie
    }

    const res = await fetch(
      `${this.baseUrl}/task/${taskId}`,
      {
        headers
      }
    )

    if (!res.ok) {
      throw new Error(
        `Check task failed with HTTP ${res.status}`
      )
    }

    const json = await res.json()

    const videoUrl =
      json.video?.videoUrl ||
      (
        typeof json.video === 'string'
          ? json.video
          : null
      ) ||
      json.result ||
      json.url ||
      null

    return {
      status: json.status,
      videoUrl,
      error: json.error || null,
      raw: json
    }
  }

  async render(
    templateId,
    images = [],
    options = {}
  ) {
    const {
      interval = 5000,
      maxRetries = 50,
      onProgress = null
    } = options

    const task =
      await this.create(
        templateId,
        images
      )

    const {
      taskId,
      cookie
    } = task

    for (
      let attempt = 1;
      attempt <= maxRetries;
      attempt++
    ) {
      await new Promise(
        resolve =>
          setTimeout(resolve, interval)
      )

      let result

      try {
        result =
          await this.checkTask(
            taskId,
            templateId,
            cookie
          )
      } catch {
        continue
      }

      if (typeof onProgress === 'function') {
        onProgress({
          attempt,
          maxRetries,
          status: result.status,
          taskId
        })
      }

      if (result.videoUrl) {
        return {
          status: 'success',
          taskId,
          templateId,
          videoUrl: result.videoUrl
        }
      }

      if (result.status === 'error') {
        const err =
          result.error ||
          'Unknown error'

        if (err.includes('503')) {
          throw new Error(
            'CapCut upstream server sedang down / unavailable (HTTP 503).'
          )
        }

        throw new Error(
          `Render failed: ${err}`
        )
      }
    }

    throw new Error(
      'Rendering process timed out.'
    )
  }
}

const jj = new JJCapcut()

// ================================
// FFmpeg IMAGE COMPRESS
// ================================

async function compressImageBuffer(buffer) {
  return new Promise(
    (resolve, reject) => {
      const args = [
        '-i',
        'pipe:0',

        '-vf',
        "scale='min(720,iw)':-1",

        '-q:v',
        '5',

        '-f',
        'image2',

        '-c:v',
        'mjpeg',

        'pipe:1'
      ]

      const ffmpegProcess =
        spawn(
          'ffmpeg',
          args
        )

      const chunks = []

      ffmpegProcess.stdout.on(
        'data',
        chunk => chunks.push(chunk)
      )

      ffmpegProcess.stderr.on(
        'data',
        () => {}
      )

      ffmpegProcess.on(
        'close',
        code => {
          if (code === 0) {
            resolve(
              Buffer.concat(chunks)
            )
          } else {
            reject(
              new Error(
                `FFmpeg exited with code ${code}`
              )
            )
          }
        }
      )

      ffmpegProcess.on(
        'error',
        reject
      )

      ffmpegProcess.stdin.write(buffer)
      ffmpegProcess.stdin.end()
    }
  )
}

// ================================
// FFmpeg VIDEO COMPRESS
// ================================

async function compressVideoBuffer(buffer) {
  return new Promise(
    (resolve, reject) => {
      const args = [
        '-i',
        'pipe:0',

        '-vcodec',
        'libx264',

        '-crf',
        '28',

        '-preset',
        'ultrafast',

        '-f',
        'mp4',

        '-movflags',
        'frag_keyframe+empty_moov',

        'pipe:1'
      ]

      const ffmpegProcess =
        spawn(
          'ffmpeg',
          args
        )

      const chunks = []

      ffmpegProcess.stdout.on(
        'data',
        chunk => chunks.push(chunk)
      )

      ffmpegProcess.stderr.on(
        'data',
        () => {}
      )

      ffmpegProcess.on(
        'close',
        code => {
          if (code === 0) {
            resolve(
              Buffer.concat(chunks)
            )
          } else {
            reject(
              new Error(
                `FFmpeg exited with code ${code}`
              )
            )
          }
        }
      )

      ffmpegProcess.on(
        'error',
        reject
      )

      ffmpegProcess.stdin.write(buffer)
      ffmpegProcess.stdin.end()
    }
  )
}

// ================================
// MESSAGE HELPERS
// ================================

function getText(m) {
  return (
    m?.text ||
    m?.body ||
    m?.message?.conversation ||
    m?.message?.extendedTextMessage?.text ||
    m?.message?.imageMessage?.caption ||
    ''
  ).trim()
}

function getCommandArgs(m) {
  const text = getText(m)

  return text
    .replace(
      /^[.!#/]?(?:jjlist|jjsearch|jjrender)\b/i,
      ''
    )
    .trim()
}

function getQuotedMessage(m) {
  return m?.quoted || m
}

function getMime(q) {
  return (
    q?.mimetype ||
    q?.msg?.mimetype ||
    q?.message?.imageMessage?.mimetype ||
    q?.message?.documentMessage?.mimetype ||
    ''
  ).toLowerCase()
}

async function downloadMedia(q) {
  if (
    typeof q?.download === 'function'
  ) {
    return await q.download()
  }

  if (
    typeof q?.downloadMedia === 'function'
  ) {
    return await q.downloadMedia()
  }

  throw new Error(
    'Fungsi download media tidak tersedia di message Shinobu.'
  )
}

async function reply(m, text) {
  if (
    typeof m?.reply === 'function'
  ) {
    return m.reply(text)
  }

  throw new Error(
    text
  )
}

async function react(m, emoji) {
  try {
    if (
      typeof m?.react === 'function'
    ) {
      await m.react(emoji)
    }
  } catch {}
}

// ================================
// HANDLER
// ================================

async function handler(m, { sock }) {
  try {
    const text = getCommandArgs(m)

    /*
     * JJ LIST
     */

    if (
      /^jjlist\b/i.test(
        getText(m)
      )
    ) {
      await reply(
        m,
        '🔄 Sedang mengambil daftar template...'
      )

      const templates =
        await jj.list()

      if (!templates.length) {
        return reply(
          m,
          '❌ Gagal mengambil template atau daftar kosong.'
        )
      }

      let txt =
        '*DAFTAR TEMPLATE CAPCUT*\n\n'

      for (const t of templates) {
        txt +=
          `*${t.index}.* ${t.title}\n`

        txt +=
          `↳ 🆔 ID: \`${t.id}\`\n`

        txt +=
          `↳ 📸 Butuh: ${t.mediaCount} Foto | 📐 Rasio: ${t.resolusi}\n\n`
      }

      txt +=
        `💡 *Cara Pakai:*\n` +
        `Kirim/balas gambar dengan caption:\n` +
        `*.jjrender 1*`

      return reply(
        m,
        txt.trim()
      )
    }

    /*
     * JJ SEARCH
     */

    if (
      /^jjsearch\b/i.test(
        getText(m)
      )
    ) {
      if (!text) {
        return reply(
          m,
          `❓ Masukkan kata kunci!\n\n` +
          `Contoh:\n` +
          `*.jjsearch jedag jedug*`
        )
      }

      await reply(
        m,
        `🔍 Mencari template untuk: *${text}*...`
      )

      const results =
        await jj.search(
          text,
          5,
          0
        )

      if (
        !results ||
        !results.length
      ) {
        return reply(
          m,
          '❌ Template tidak ditemukan.'
        )
      }

      let txt =
        '*HASIL PENCARIAN TEMPLATE*\n\n'

      results.forEach(
        (item, i) => {
          txt +=
            `*${i + 1}.* ${item.title || 'Untitled'}\n`

          txt +=
            `↳ 🆔 ID: \`${item.id || '-'}\`\n`

          txt +=
            `↳ 👤 Author: ${item.author?.name || 'Unknown'}\n\n`
        }
      )

      return reply(
        m,
        txt.trim()
      )
    }

    /*
     * JJ RENDER
     */

    if (
      /^jjrender\b/i.test(
        getText(m)
      )
    ) {
      const input =
        text.trim()

      if (!input) {
        return reply(
          m,
          `❓ Masukkan nomor urut atau ID Template!\n\n` +
          `Contoh nomor:\n` +
          `*.jjrender 1*\n\n` +
          `Contoh ID:\n` +
          `*.jjrender 7649585745329540360*`
        )
      }

      const q =
        getQuotedMessage(m)

      const mime =
        getMime(q)

      if (!mime.includes('image')) {
        return reply(
          m,
          `📸 Kirim atau balas sebuah gambar dengan caption:\n\n` +
          `*.jjrender ${input}*`
        )
      }

      await react(
        m,
        '🕒'
      )

      let templateId =
        input

      let mediaCount = 1

      /*
       * Ambil template berdasarkan nomor
       */

      if (
        input.length < 5 &&
        /^\d+$/.test(input)
      ) {
        const templates =
          await jj.list()

        const found =
          templates.find(
            t =>
              t.index ===
              Number(input)
          )

        if (!found) {
          await react(
            m,
            '❌'
          )

          return reply(
            m,
            '❌ Nomor template tidak ditemukan di daftar *.jjlist*.'
          )
        }

        templateId =
          found.id

        mediaCount =
          found.mediaCount || 1
      } else {
        /*
         * Kalau langsung ID template
         */

        try {
          const templates =
            await jj.list()

          const found =
            templates.find(
              t =>
                String(t.id) ===
                String(input)
            )

          if (found) {
            mediaCount =
              found.mediaCount || 1
          }
        } catch {}
      }

      await reply(
        m,
        `⏳ *Memproses template...*\n\n` +
        `🆔 ID: ${templateId}\n` +
        `📸 Foto dibutuhkan: ${mediaCount}\n\n` +
        `Bot sedang mengunduh & mengkompres gambar.`
      )

      /*
       * Download gambar
       */

      let buffer =
        await downloadMedia(q)

      if (
        !buffer ||
        !Buffer.isBuffer(buffer) ||
        buffer.length < 1
      ) {
        await react(
          m,
          '❌'
        )

        return reply(
          m,
          '❌ Gagal mengunduh gambar.'
        )
      }

      /*
       * Compress image
       */

      try {
        buffer =
          await compressImageBuffer(
            buffer
          )
      } catch (compressErr) {
        console.log(
          '[JJCapCut] Gagal kompres gambar:',
          compressErr.message
        )
      }

      /*
       * Gandakan gambar sesuai
       * kebutuhan template
       */

      const imagesToRender =
        Array(
          mediaCount
        ).fill(buffer)

      /*
       * Render
       */

      const result =
        await jj.render(
          templateId,
          imagesToRender,
          {
            interval: 5000,
            maxRetries: 100
          }
        )

      await reply(
        m,
        `✅ *Video berhasil dibuat!*\n\n` +
        `Sedang melakukan kompresi video sebelum dikirim...`
      )

      /*
       * Download video
       */

      let videoBuffer

      try {
        const vidRes =
          await fetch(
            result.videoUrl
          )

        if (!vidRes.ok) {
          throw new Error(
            `HTTP ${vidRes.status}`
          )
        }

        const arrayBuf =
          await vidRes.arrayBuffer()

        videoBuffer =
          Buffer.from(
            arrayBuf
          )

        /*
         * Compress video
         */

        videoBuffer =
          await compressVideoBuffer(
            videoBuffer
          )
      } catch (err) {
        console.log(
          '[JJCapCut] Gagal kompres video:',
          err.message
        )

        /*
         * Fallback URL
         */

        videoBuffer = {
          url:
            result.videoUrl
        }
      }

      /*
       * Kirim video
       */

      const chat =
        m?.chat ||
        m?.key?.remoteJid

      if (!chat) {
        throw new Error(
          'JID chat tidak ditemukan.'
        )
      }

      await sock.sendMessage(
        chat,
        {
          video: videoBuffer,
          mimetype:
            'video/mp4',
          caption:
            `✅ *Render & Kompresi Berhasil!*\n\n` +
            `🆔 ID Template: ${templateId}`
        },
        {
          quoted: m
        }
      )

      await react(
        m,
        '✅'
      )
    }
  } catch (error) {
    console.error(
      '[JJCapCut]',
      error
    )

    await react(
      m,
      '❌'
    )

    return reply(
      m,
      `❌ *Terjadi Kesalahan*\n\n${error?.message || 'Unknown error'}`
    )
  }
}

export default {
  config,
  handler
}