/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

/* 
┏━━━━━━━━━━┓ MAGMA ESDM ┗━━━━━━━━━━┛ 
MAGMA Indonesia - Informasi Gunung Api 
Base: https://magma.esdm.go.id 
Plugin ESM 
*/

'use strict'

// ============================================================
// CONFIG
// ============================================================
const magmaConfig = {
  baseUrl: 'https://magma.esdm.go.id',
  listPath: '/v1/gunung-api/informasi-letusan',
  realtimePath: '/v1/json/var',
  maxRetries: 3,
  backoffBaseMs: 1000,
  backoffMaxMs: 30000,
  timeoutMs: 30000,
  requestDelayMs: 500,
  userAgent: 'AnyaMD-MAGMA/1.0 (+https://magma.esdm.go.id; public data research)'
}

// ============================================================
// SESSION
// ============================================================
const session = {
  cookie: '',
  csrf: null,
  signature: null,
  bootstrapped: false
}
let lastRequestAt = 0

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function rateLimit() {
  const now = Date.now()
  const delta = now - lastRequestAt
  if (lastRequestAt && delta < magmaConfig.requestDelayMs) {
    await sleep(magmaConfig.requestDelayMs - delta)
  }
  lastRequestAt = Date.now()
}

// ============================================================
// COOKIE
// ============================================================
function mergeCookies(current, setCookies) {
  const jar = new Map()

  function put(pairs) {
    for (const part of pairs) {
      const pair = String(part).split(';')[0]
      const eq = pair.indexOf('=')
      if (eq > 0) {
        jar.set(pair.slice(0, eq).trim(), pair.slice(eq + 1).trim())
      }
    }
  }

  if (current) {
    put(current.split(/;\s*/))
  }
  if (setCookies) {
    put(setCookies)
  }

  return Array.from(jar.entries())
    .map(([k, v]) => `${k}=${v}`)
    .join('; ')
}

function storeCookies(res) {
  let setCookies = []
  if (typeof res.headers.getSetCookie === 'function') {
    setCookies = res.headers.getSetCookie()
  } else {
    const combined = res.headers.get('set-cookie')
    if (combined) {
      setCookies = [combined]
    }
  }
  if (setCookies.length) {
    session.cookie = mergeCookies(session.cookie, setCookies)
  }
}

// ============================================================
// HTTP REQUEST
// ============================================================
async function request(url, options = {}, csrfRetried = false) {
  let lastError = null
  for (let attempt = 0; attempt <= magmaConfig.maxRetries; attempt++) {
    await rateLimit()
    const controller = new AbortController()
    const timer = setTimeout(() => {
      controller.abort()
    }, magmaConfig.timeoutMs)

    try {
      const headers = {
        'User-Agent': magmaConfig.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8',
        'Accept-Language': 'id-ID,id;q=0.9,en;q=0.8',
        ...(options.headers || {})
      }
      if (session.cookie) {
        headers.Cookie = session.cookie
      }

      const res = await fetch(url, {
        method: options.method || 'GET',
        body: options.body,
        headers,
        redirect: 'follow',
        signal: controller.signal
      })

      clearTimeout(timer)
      storeCookies(res)

      if ([429, 500, 502, 503, 504].includes(res.status)) {
        throw new Error(`HTTP ${res.status}`)
      }

      if (res.status === 419 && !csrfRetried) {
        resetSession()
        await bootstrap()
        return request(url, options, true)
      }
      return res
    } catch (err) {
      clearTimeout(timer)
      lastError = err
      if (attempt === magmaConfig.maxRetries) {
        break
      }
      const delay = Math.min(
        magmaConfig.backoffBaseMs * Math.pow(2, attempt),
        magmaConfig.backoffMaxMs
      )
      await sleep(delay + Math.random() * delay * 0.25)
    }
  }
  throw new Error(`Request gagal setelah retry: ${url} (${lastError ? lastError.message : 'unknown error'})`)
}

// ============================================================
// SESSION / CSRF
// ============================================================
function resetSession() {
  session.csrf = null
  session.signature = null
  session.bootstrapped = false
}

function extractCsrf(html) {
  const m = html.match(/name="csrf-token"\s+content="([^"]+)"/)
  return m ? m[1] : null
}

function extractSignature(html) {
  const m = html.match(/\/v1\/json\/var\?signature=([a-f0-9]{64})/)
  return m ? m[1] : null
}

async function bootstrap() {
  if (session.bootstrapped) {
    return
  }
  const res = await request(`${magmaConfig.baseUrl}/`)
  const html = await res.text()
  session.csrf = extractCsrf(html)
  session.signature = extractSignature(html)
  session.bootstrapped = true
}

// ============================================================
// HTML HELPERS
// ============================================================
const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'",
  nbsp: ' ', plusmn: '±', deg: '°', times: '×', divide: '÷',
  hellip: '…', mdash: '—', ndash: '–', rsquo: '’', lsquo: '‘',
  ldquo: '“', rdquo: '”', middot: '·', eacute: 'é', sup2: '²', sup3: '³'
}

function decodeEntities(str) {
  return String(str || '').replace(
    /&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g,
    (m, ent) => {
      if (ent[0] === '#') {
        const code = ent[1] === 'x' || ent[1] === 'X'
          ? parseInt(ent.slice(2), 16)
          : parseInt(ent.slice(1), 10)
        return Number.isFinite(code) ? String.fromCodePoint(code) : m
      }
      return Object.prototype.hasOwnProperty.call(ENTITIES, ent) ? ENTITIES[ent] : m
    }
  )
}

function stripTags(html) {
  return decodeEntities(String(html || '').replace(/<[^>]*>/g, ''))
}

function cleanText(html) {
  return stripTags(html).replace(/\s+/g, ' ').trim()
}

function cleanMultiline(html) {
  return decodeEntities(String(html || '').replace(/<br\s*\/?>/gi, '\n'))
    .split('\n')
    .map(line => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n')
    .trim()
}

// ============================================================
// DATE / TIME
// ============================================================
const MONTHS = {
  januari: 1, februari: 2, maret: 3, april: 4, mei: 5, juni: 6,
  juli: 7, agustus: 8, september: 9, oktober: 10, november: 11, desember: 12
}

function parseIndonesianDate(text) {
  const m = String(text || '').match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/)
  if (!m) return null
  const month = MONTHS[m[2].toLowerCase()]
  if (!month) return null
  return { day: Number(m[1]), month, year: Number(m[3]) }
}

function parseLocalTime(text) {
  const m = String(text || '').match(/(\d{1,2}):(\d{2})\s*(WIB|WITA|WIT)/)
  if (!m) return null
  return { hhmm: `${String(Number(m[1])).padStart(2, '0')}:${m[2]}`, tz: m[3] }
}

function combineDateTime(date, time) {
  if (!date || !time) return null
  const [h, mi] = time.hhmm.split(':').map(Number)
  const d = new Date(Date.UTC(date.year, date.month - 1, date.day, h, mi))
  if (
    d.getUTCFullYear() !== date.year ||
    d.getUTCMonth() !== date.month - 1 ||
    d.getUTCDate() !== date.day
  ) {
    return null
  }
  const p = n => String(n).padStart(2, '0')
  return `${date.year}-${p(date.month)}-${p(date.day)}T${p(h)}:${p(mi)}`
}

// ============================================================
// CONSTANTS
// ============================================================
const UUID_RE = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i
const STATUS_LABELS = {
  1: 'Level I (Normal)',
  2: 'Level II (Waspada)',
  3: 'Level III (Siaga)',
  4: 'Level IV (Awas)'
}
const KNOWN_CODE_BY_NAME = {
  Agung: 'AGU', Bromo: 'BRO', Dempo: 'DEM', Dukono: 'DUK',
  Gamalama: 'GML', Ibu: 'IBU', Karangetang: 'KAR', Kerinci: 'KER',
  'Anak Krakatau': 'KRA', 'Ili Lewotolok': 'LEW', 'Lewotobi Laki-laki': 'LWK',
  Marapi: 'MAR', Merapi: 'MER', Raung: 'RAU', Ruang: 'RUA',
  Sinabung: 'SIN', Semeru: 'SMR', Soputan: 'SOP', 'Tangkuban Parahu': 'TPR'
}
const NAME_TO_CODE = { ...KNOWN_CODE_BY_NAME }
let catalog = null

// ============================================================
// URL
// ============================================================
function buildUrl(path, params) {
  const url = new URL(path.startsWith('http') ? path : magmaConfig.baseUrl + path)
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined) {
        url.searchParams.set(key, value)
      }
    }
  }
  return url.toString()
}

// ============================================================
// PARSER PAGINATION
// ============================================================
function parsePagination(html) {
  const info = { current: 1, total: null, hasNext: false }
  const menuMatch = html.match(/<div class="ui pagination menu">([\s\S]*?)<\/div>/)
  const menu = menuMatch ? menuMatch[1] : ''
  const pages = []
  let current = null
  const re = /<a[^>]*href="([^"]*[?&]page=(\d+))"[^>]*>/g
  let m

  while ((m = re.exec(menu))) {
    const page = Number(m[2])
    pages.push(page)
    if (/btn-secondary/.test(m[0])) {
      current = page
    }
  }

  info.current = current !== null ? current : pages.length ? Math.max(...pages) : 1
  info.total = pages.length ? Math.max(...pages) : info.current
  info.hasNext = /rel="next"/.test(menu)
  return info
}

// ============================================================
// YEAR COUNTS
// ============================================================
function parseYearCounts(html) {
  const counts = {}
  const re = /<div class="col-4[^"]*">\s*([\d.,]+)\s*<\/div>\s*<div class="col-8">([\s\S]*?)<\/div>/g
  let m

  while ((m = re.exec(html))) {
    const count = Number(m[1].replace(/[.,]/g, ''))
    const nameMatch = m[2].match(/<b[^>]*>([\s\S]*?)<\/b>/)
    const name = nameMatch ? cleanText(nameMatch[1]) : ''
    if (name && Number.isFinite(count)) {
      counts[name] = count
    }
  }
  return counts
}

// ============================================================
// PARSE LIST
// ============================================================
function parseListPage(html, options = {}) {
  const volcanoCode = options.volcanoCode || null
  const nameToCode = options.nameToCode || {}
  const result = {
    eruptions: [],
    pagination: parsePagination(html),
    yearCounts: parseYearCounts(html),
    pageDateLabel: null
  }

  const chunks = html.split(/<div class="timeline-item/).slice(1)
  let currentDateLabel = null

  for (const chunk of chunks) {
    if (/<p class="timeline-date">/.test(chunk)) {
      const dm = chunk.match(/<p class="timeline-date">([\s\S]*?)<\/p>/)
      if (dm) {
        currentDateLabel = cleanText(dm[1])
        if (result.pageDateLabel === null) {
          result.pageDateLabel = currentDateLabel
        }
      }
      continue
    }

    const titleM = chunk.match(/<p class="timeline-title">\s*<a[^>]*>([\s\S]*?)<\/a>/)
    if (!titleM) continue

    const timeM = chunk.match(/<div class="timeline-time">\s*<small>([\s\S]*?)<\/small>/)
    const authorM = chunk.match(/<p class="timeline-author">[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/)
    const textM = chunk.match(/<p class="timeline-text">([\s\S]*?)<\/p>/)
    const imageM = chunk.match(/<a\s+href="([^"]+)"\s+data-lightbox="file-set"/)
    const detailM = chunk.match(/<a\s+href="([^"]+\/show)"[^>]*class="btn btn-sm btn-outline-primary"/)

    const timeStr = timeM ? cleanText(timeM[1]) : ''
    const time = parseLocalTime(timeStr)
    const date = parseIndonesianDate(currentDateLabel || '')
    const detailUrl = detailM ? detailM[1] : null
    const idMatch = detailUrl ? detailUrl.match(UUID_RE) : null
    const volcanoName = cleanText(titleM[1])

    result.eruptions.push({
      id: idMatch ? idMatch[1] : null,
      volcanoName,
      volcanoCode: volcanoCode || nameToCode[volcanoName] || null,
      description: textM ? cleanText(textM[1]) : '',
      localTime: combineDateTime(date, time),
      timezone: time ? time.tz : null,
      dateLabel: currentDateLabel,
      author: authorM ? cleanText(authorM[1]) : null,
      imageUrl: imageM ? imageM[1] : null,
      detailUrl,
      recommendation: null,
      coordinates: null,
      scrapedAt: new Date().toISOString()
    })
  }
  return result
}

// ============================================================
// GET HTML
// ============================================================
async function getHtml(path, params) {
  const res = await request(buildUrl(path, params))
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} - ${path}`)
  }
  return res.text()
}

// ============================================================
// VOLCANO CATALOG
// ============================================================
async function getVolcanoCatalog(refresh = false) {
  if (catalog && !refresh) return catalog

  const html = await getHtml('/')
  let m = html.match(/var\s+markersGunungApi\s*=\s*(\[[\s\S]*?\])\s*[,;]/)
  if (!m) {
    m = html.match(/var\s+markersGunungApi\s*=\s*(\[[\s\S]*?\])/)
  }
  if (!m) {
    catalog = []
    return catalog
  }

  let raw
  try {
    raw = JSON.parse(m[1])
  } catch {
    catalog = []
    return catalog
  }

  catalog = raw
    .filter(item => item && item.ga_code)
    .map(item => ({
      code: String(item.ga_code),
      name: item.ga_nama_gapi || '',
      lat: Number(item.ga_lat_gapi),
      lon: Number(item.ga_lon_gapi),
      elevation: Number(item.ga_elev_gapi),
      province: item.ga_prov_gapi || null,
      kabupaten: item.ga_kab_gapi || null,
      status: Number(item.ga_status),
      hasVona: Boolean(item.has_vona)
    }))

  for (const volcano of catalog) {
    if (volcano.name) {
      NAME_TO_CODE[volcano.name] = volcano.code
    }
  }
  return catalog
}

// ============================================================
// LIST ERUPTION
// ============================================================
async function getList(page = 1, volcanoCode = null) {
  const path = volcanoCode ? `${magmaConfig.listPath}/${volcanoCode}` : magmaConfig.listPath
  const params = page > 1 ? { page } : null
  const html = await getHtml(path, params)
  return parseListPage(html, { volcanoCode, nameToCode: NAME_TO_CODE })
}

// ============================================================
// DETAIL
// ============================================================
function parseDetailPage(html, id) {
  const labelM = html.match(/<h5 class="blog-title">\s*<a[^>]*>([\s\S]*?)<\/a>/)
  const categoryM = html.match(/<p class="blog-category[^"]*">([\s\S]*?)<\/p>/)
  const subtitleM = html.match(/<p class="card-subtitle[^"]*">([\s\S]*?)<\/p>\s*<p>([\s\S]*?)<\/p>/)
  const recM = html.match(/<p class="blog-text">([\s\S]*?)<\/p>/)
  const imageM = html.match(/<figure>[\s\S]*?<img src="([^"]+)"/)
  const codeM = html.match(/MAG_CODE='([A-Z0-9]+)'/)
  const centerM = html.match(/center:\s*\[(-?[\d.]+),\s*(-?[\d.]+)\]/)

  const category = categoryM ? cleanText(categoryM[1]) : ''
  const description = subtitleM ? cleanText(subtitleM[2]) : ''
  const date = parseIndonesianDate(category)
  const time = parseLocalTime(description)
  let volcanoLabel = labelM ? cleanText(labelM[1]) : ''
  const volcanoName = volcanoLabel.replace(/^Gunung\s+Api\s+/i, '').trim()
  let author = subtitleM ? cleanText(subtitleM[1]) : null

  if (author) {
    author = author.replace(/^Dibuat oleh,?\s*/i, '').trim() || null
  }

  let recommendation = null
  if (recM) {
    const text = cleanMultiline(recM[1])
    recommendation = text.replace(/^rekomendasi\s*\n?/i, '').trim()
  }

  return {
    id: id || null,
    volcanoName: volcanoName || volcanoLabel || null,
    volcanoCode: codeM ? codeM[1] : null,
    description,
    localTime: combineDateTime(date, time),
    timezone: time ? time.tz : null,
    dateLabel: category,
    author,
    imageUrl: imageM ? imageM[1] : null,
    detailUrl: id ? `${magmaConfig.listPath}/${id}/show` : null,
    recommendation,
    coordinates: centerM ? [Number(centerM[1]), Number(centerM[2])] : null,
    scrapedAt: new Date().toISOString()
  }
}

async function getDetail(id) {
  const html = await getHtml(`${magmaConfig.listPath}/${id}/show`)
  return parseDetailPage(html, id)
}

// ============================================================
// REALTIME STATUS
// ============================================================
function normalizeStatus(payload, code) {
  const d = payload && payload.data ? payload.data : {}
  const g = d.gunungapi || {}
  const status = Number(g.status)

  return {
    code,
    name: g.nama || '',
    status: Number.isFinite(status) ? status : null,
    statusLabel: STATUS_LABELS[status] || 'Unknown',
    coordinates: Array.isArray(g.koordinat) ? g.koordinat.map(Number) : null,
    hasVona: String(g.has_vona) === '1',
    reportPeriod: d.laporan && d.laporan.tanggal ? d.laporan.tanggal : null,
    reportAuthor: d.laporan && d.laporan.pembuat ? d.laporan.pembuat : null,
    visual: d.visual && d.visual.deskripsi ? d.visual.deskripsi : null,
    visualOther: d.visual && d.visual.lainnya ? d.visual.lainnya : null,
    visualPhoto: d.visual && d.visual.foto ? d.visual.foto : null,
    climatology: d.klimatologi && d.klimatologi.deskripsi ? d.klimatologi.deskripsi : null,
    seismic: d.gempa && d.gempa.deskripsi ? d.gempa.deskripsi : [],
    seismicChart: d.gempa && d.gempa.grafik ? d.gempa.grafik : null,
    recommendation: d.rekomendasi || null,
    vona: d.vona || null,
    scrapedAt: new Date().toISOString()
  }
}

async function getRealTimeStatus(code) {
  await bootstrap()
  const params = session.signature ? { signature: session.signature } : null
  const res = await request(buildUrl(magmaConfig.realtimePath, params), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-CSRF-TOKEN': session.csrf || '',
      'X-Requested-With': 'XMLHttpRequest',
      Referer: `${magmaConfig.baseUrl}/`
    },
    body: new URLSearchParams({ ga_code: code }).toString()
  })

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} - realtime ${code}`)
  }
  const payload = await res.json()
  const status = normalizeStatus(payload, code)

  if (catalog) {
    const volcano = catalog.find(item => item.code === code)
    if (volcano && volcano.name) {
      status.name = volcano.name
    }
  }
  return status
}

// ============================================================
// FORMAT MESSAGE
// ============================================================
function statusEmoji(status) {
  switch (status) {
    case 1: return '🟢'
    case 2: return '🟡'
    case 3: return '🟠'
    case 4: return '🔴'
    default: return '⚪'
  }
}

function formatStatus(data) {
  let text = ''
  text += '╭━━〔 🌋 MAGMA ESDM 〕━━⬣\n'
  text += `┃ 🌋 Gunung : ${data.name || data.code}\n`
  text += `┃ 🆔 Kode : ${data.code}\n`
  text += `┃ 📊 Status : ${statusEmoji(data.status)} ${data.statusLabel}\n`

  if (data.reportPeriod) text += `┃ 🕐 Laporan: ${data.reportPeriod}\n`
  if (data.reportAuthor) text += `┃ 👤 Oleh : ${data.reportAuthor}\n`
  if (data.visual) text += `┃ 👁️ Visual : ${data.visual}\n`
  if (data.visualOther) text += `┃ 📝 Lainnya: ${data.visualOther}\n`

  if (data.recommendation) {
    text += '\n┃ 📢 Rekomendasi:\n'
    const rec = String(data.recommendation).split('\n')
    for (const line of rec) {
      text += `┃ ${line}\n`
    }
  }
  text += '╰━━━━━━━━━━━━━━━━━━⬣'
  return text
}

function formatEruption(item) {
  let text = ''
  text += `🌋 *${item.volcanoName || '-'}*\n`
  if (item.volcanoCode) text += `🆔 Kode: ${item.volcanoCode}\n`
  if (item.dateLabel) text += `📅 ${item.dateLabel}\n`
  if (item.localTime) text += `🕐 ${item.localTime} ${item.timezone || ''}\n`
  if (item.description) text += `📝 ${item.description}\n`
  if (item.author) text += `👤 ${item.author}\n`
  return text.trim()
}

const config={
  name:'gunungapi',
  alias:['magma','gunung','erupsi','volcano'],
  category:'info',
  description:'Informasi aktivitas gunung api Indonesia dari MAGMA ESDM',
  usage:'.magma | .magma status <kode> | .magma gunung <nama> | .magma list <halaman>',
  cooldown:5,
  energi:0,
  limit:true,
  isEnabled:true
}

function getArgs(m,ctx={}){
  if(Array.isArray(ctx.args))return [...ctx.args].map(String).filter(Boolean)
  if(Array.isArray(m?.args))return [...m.args].map(String).filter(Boolean)
  const text=String(ctx.text??m?.text??m?.body??m?.message?.conversation??m?.message?.extendedTextMessage?.text??'').trim()
  return text?text.split(/\s+/):[]
}

async function handler(m,ctx={}){
  try{
    const args=getArgs(m,ctx)
    const command=String(ctx.command||'').toLowerCase()
    const aliases=[config.name,...config.alias].map(x=>String(x).toLowerCase())
    if(args.length&&aliases.includes(String(args[0]).toLowerCase()))args.shift()
    const sub=String(args[0]||'').toLowerCase()
    const reply=typeof m?.reply==='function'?m.reply.bind(m):async text=>ctx.sock?.sendMessage?.(m?.chat||m?.key?.remoteJid,{text})

    if(!sub){
      const list=await getList(1)
      const eruptions=list.eruptions.slice(0,8)
      if(!eruptions.length)return reply('Data letusan MAGMA sedang tidak tersedia.')
      let text='🌋 *MAGMA INDONESIA* - Informasi letusan terbaru\n\n'
      eruptions.forEach((item,i)=>{text+=`${i+1}. ${formatEruption(item)}\n\n`})
      text+=`Ketik *${command&&aliases.includes(command)?'.'+command:'.magma'} status SMR* untuk status realtime Semeru.`
      return reply(text.trim())
    }

    if(['status','realtime','rt'].includes(sub)){
      const code=String(args[1]||'SMR').toUpperCase()
      await reply(`⏳ Mengambil status realtime *${code}* dari MAGMA ESDM...`)
      const data=await getRealTimeStatus(code)
      return reply(formatStatus(data))
    }

    if(['gunung','volcano'].includes(sub)){
      const name=args.slice(1).join(' ').trim()
      if(!name)return reply(`Contoh:\n.magma gunung Semeru`)
      await getVolcanoCatalog()
      let code=NAME_TO_CODE[name]
      if(!code){
        const found=catalog.find(v=>String(v.name||'').toLowerCase().includes(name.toLowerCase()))
        if(found)code=found.code
      }
      if(!code)return reply(`❌ Gunung *${name}* tidak ditemukan di katalog MAGMA.`)
      const data=await getRealTimeStatus(code)
      return reply(formatStatus(data))
    }

    if(['list','erupsi','letusan'].includes(sub)){
      const page=Math.max(1,Number(args[1])||1)
      const result=await getList(page)
      if(!result.eruptions.length)return reply(`Tidak ada data letusan pada halaman ${page}.`)
      let text=`🌋 *LETUSAN MAGMA*\nHalaman: ${page}\n\n`
      result.eruptions.forEach((item,i)=>{text+=`${i+1}. ${formatEruption(item)}\n\n`})
      return reply(text.trim())
    }

    await getVolcanoCatalog()
    const name=[sub,...args.slice(1)].join(' ').trim()
    let code=NAME_TO_CODE[name]
    if(!code){
      const found=catalog.find(v=>String(v.name||'').toLowerCase().includes(name.toLowerCase()))
      if(found)code=found.code
    }
    if(code){
      const data=await getRealTimeStatus(code)
      return reply(formatStatus(data))
    }

    return reply(`╭━━〔 🌋 MAGMA HELP 〕━━⬣\n┃ .magma\n┃ .magma status SMR\n┃ .magma gunung Semeru\n┃ .magma list 1\n┃ .magma <nama gunung>\n╰━━━━━━━━━━━━━━━━━━⬣`)
  }catch(err){
    console.error('[MAGMA ERROR]',err)
    const reply=typeof m?.reply==='function'?m.reply.bind(m):async text=>ctx.sock?.sendMessage?.(m?.chat||m?.key?.remoteJid,{text})
    return reply(`❌ Gagal mengambil data MAGMA.\n\n> ${err?.message||'Unknown error'}`)
  }
}

export default{config,handler}
