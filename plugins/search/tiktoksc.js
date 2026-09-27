/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { randomUUID } from 'node:crypto'
import { tiktokSearchVideo } from '../../src/scraper/tiktoksearch.js'
import te from '../../src/lib/elaina-error.js'

const pluginConfig = {
  name: 'tiktoksc',
  alias: ['searchtt', 'tthtml'],
  category: 'search',
  description: 'TikTok HTML Feed Airich — video vertikal langsung di WhatsApp',
  usage: '.tiktoksc <kata kunci>',
  example: '.tiktoksc kucing lucu',
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 15,
  energi: 1,
  isEnabled: true,
}

function esc(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function safeUrl(value = '') {
  const raw = String(value || '').trim()
  if (!/^https?:\/\//i.test(raw)) return ''
  return esc(raw)
}

function formatNumber(value) {
  const n = Number(value || 0)
  if (!Number.isFinite(n)) return '0'
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1).replace('.0', '')} M`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace('.0', '')} jt`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace('.0', '')} rb`
  return n.toLocaleString('id-ID')
}

function buildTikTokHTML(videos, query) {
  const cards = videos.map((video, index) => {
    const author = video?.author || {}
    const stats = video?.stats || {}
    const videoUrl = video?.link || video?.watermarkLink || ''
    const cover = video?.originCover || video?.cover || ''
    const nickname = author?.nickname || 'TikTok User'
    const avatar = author?.avatar || ''
    const caption = video?.title || 'Tanpa caption'
    const username = author?.uniqueId || author?.unique_id || nickname

    return `
<section class="slide" data-index="${index}">
  <video class="media" src="${safeUrl(videoUrl)}" poster="${safeUrl(cover)}" playsinline webkit-playsinline preload="metadata" muted></video>
  <div class="vignette"></div>
  <div class="top">
    <div class="title">TikTok</div>
    <div class="searchbar" data-query="${esc(query)}" role="button" tabindex="0">
      <span class="search-icon">⌕</span><b>Pencarian</b><span class="dot">·</span><span class="query">${esc(query)}</span>
    </div>
  </div>
  <div class="side">
    <button class="download" data-url="${safeUrl(videoUrl)}" aria-label="Unduh">↓</button>
    <span>Unduh</span>
  </div>
  <div class="info">
    <div class="profile">
      ${avatar ? `<img src="${safeUrl(avatar)}" alt="">` : '<span class="avatar">♪</span>'}
      <div><strong>@${esc(username)}</strong><small>${esc(nickname)}</small></div>
    </div>
    <p>${esc(caption)}</p>
    <div class="stats">
      <span>▶ ${formatNumber(stats.plays)}</span>
      <span>♡ ${formatNumber(stats.likes)}</span>
      <span>↗ ${formatNumber(stats.shares)}</span>
    </div>
  </div>
  <div class="progress"><i></i></div>
</section>`
  }).join('')

  return `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<meta name="theme-color" content="#000">
<title>Rimuru TikTok</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
html,body{width:100%;height:100%;overflow:hidden;background:#000;color:#fff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif}
.feed{height:100svh;width:100%;overflow-y:auto;overflow-x:hidden;scroll-snap-type:y mandatory;background:#000;overscroll-behavior-y:contain}
.slide{position:relative;width:100%;height:100svh;min-height:520px;scroll-snap-align:start;scroll-snap-stop:always;overflow:hidden;background:#111}
.media{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#111;cursor:pointer}
.vignette{position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(0,0,0,.42),transparent 25%,transparent 58%,rgba(0,0,0,.82) 100%)}
.top{position:absolute;z-index:5;top:max(11px,env(safe-area-inset-top));left:12px;right:12px;display:flex;align-items:center;gap:10px}
.title{font-size:18px;font-weight:950;letter-spacing:-.5px;text-shadow:0 2px 7px #000;min-width:58px}
.searchbar{height:40px;flex:1;min-width:0;display:flex;align-items:center;gap:7px;padding:0 13px;border:1px solid rgba(255,255,255,.18);border-radius:22px;background:rgba(0,0,0,.48);backdrop-filter:blur(14px);box-shadow:0 5px 20px rgba(0,0,0,.25);overflow:hidden}
.search-icon{font-size:25px;line-height:1}.searchbar b{font-size:13px;white-space:nowrap}.dot{color:#aaa}.query{font-size:13px;color:#eee;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.side{position:absolute;z-index:6;right:12px;bottom:154px;display:flex;flex-direction:column;align-items:center;gap:4px;text-shadow:0 2px 7px #000}
.side button{width:52px;height:52px;border-radius:50%;border:1px solid rgba(255,255,255,.3);background:rgba(0,0,0,.55);color:#fff;font-size:29px;font-weight:900;display:grid;place-items:center;cursor:pointer;backdrop-filter:blur(10px);box-shadow:0 7px 18px rgba(0,0,0,.3)}
.side button:active{transform:scale(.9)}.side span{font-size:10px;font-weight:800}
.info{position:absolute;z-index:5;left:15px;right:78px;bottom:max(28px,env(safe-area-inset-bottom));text-shadow:0 2px 8px rgba(0,0,0,.85)}
.profile{display:flex;align-items:center;gap:9px;margin-bottom:9px}.profile img,.avatar{width:38px;height:38px;border-radius:50%;object-fit:cover;border:1px solid rgba(255,255,255,.9);background:#222;display:grid;place-items:center;font-weight:900}.profile strong{display:block;font-size:14px;font-weight:900}.profile small{display:block;margin-top:1px;font-size:10px;color:rgba(255,255,255,.78)}
.info p{font-size:15px;line-height:1.35;max-width:620px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.stats{display:flex;gap:13px;margin-top:9px;color:rgba(255,255,255,.82);font-size:11px;font-weight:750}
.progress{position:absolute;z-index:7;left:0;right:0;bottom:0;height:3px;background:rgba(255,255,255,.18)}.progress i{display:block;width:0;height:100%;background:#fff}
@media(max-width:390px){.top{left:9px;right:9px}.title{font-size:16px;min-width:50px}.searchbar{height:37px;padding:0 10px}.searchbar b,.query{font-size:12px}.info{left:12px;right:70px}.info p{font-size:13px}.side{right:9px}}
</style>
</head>
<body>
<div class="feed" id="feed">${cards}</div>
<script>
(()=>{
'use strict'
const root=document.getElementById('feed')
const slides=[...document.querySelectorAll('.slide')]
let active=-1
function play(v){if(!v)return;const p=v.play();if(p&&p.catch)p.catch(()=>{})}
function pauseAll(except){slides.forEach(s=>{const v=s.querySelector('.media');if(v!==except){try{v.pause()}catch{}}})}
function setProgress(slide){const v=slide.querySelector('.media'),bar=slide.querySelector('.progress i');if(!v||!bar)return;const d=Number(v.duration);if(d>0&&Number.isFinite(d))bar.style.width=Math.min(100,(v.currentTime/d)*100)+'%'}
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting||entry.intersectionRatio<.72)return
    const slide=entry.target
    const v=slide.querySelector('.media')
    active=Number(slide.dataset.index||0)
    pauseAll(v)
    play(v)
  })
},{root,threshold:[.72]})
slides.forEach(slide=>{
  observer.observe(slide)
  const v=slide.querySelector('.media')
  v.addEventListener('timeupdate',()=>setProgress(slide))
  v.addEventListener('click',async()=>{
    if(v.paused){v.muted=false;play(v)}else v.pause()
  })
  v.addEventListener('error',()=>{v.poster='';})
})
document.querySelectorAll('.download').forEach(btn=>btn.addEventListener('click',e=>{
  e.preventDefault();e.stopPropagation()
  const u=btn.dataset.url
  if(!u)return
  try{window.open(u,'_blank','noopener,noreferrer')}catch{location.href=u}
}))
document.querySelectorAll('.searchbar').forEach(el=>el.addEventListener('click',()=>{}))
document.addEventListener('keydown',e=>{
  if(e.key==='ArrowDown')root.scrollBy({top:innerHeight,behavior:'smooth'})
  if(e.key==='ArrowUp')root.scrollBy({top:-innerHeight,behavior:'smooth'})
  if(e.key===' '){e.preventDefault();const s=slides[active];const v=s&&s.querySelector('.media');if(v){if(v.paused){v.muted=false;play(v)}else v.pause()}}
})
setTimeout(()=>{const v=slides[0]?.querySelector('.media');play(v)},250)
})()
</script>
</body>
</html>`
}

async function sendTikTokHTML(sock, m, html) {
  const responseId = randomUUID()
  await sock.relayMessage(
    m.chat,
    {
      messageContextInfo: {
        deviceListMetadata: {},
        deviceListMetadataVersion: 2,
        botMetadata: { messageDisclaimerText: '', botResponseId: responseId },
      },
      botForwardedMessage: {
        message: {
          richResponseMessage: {
            messageType: 1,
            submessages: [{ messageType: 2, messageText: 'TikTok Player' }],
            unifiedResponse: {
              data: Buffer.from(JSON.stringify({
                response_id: responseId,
                sections: [{
                  view_model: {
                    primitive: {
                      __typename: 'GenAIaeacdsnwHtmlPrimitive',
                      payload: html,
                      trusted_sources: [],
                    },
                    __typename: 'GenAISingleLayoutViewModel',
                  },
                }],
              })).toString('base64'),
            },
            contextInfo: {
              forwardingScore: 1,
              isForwarded: true,
              forwardedAiBotMessageInfo: { botJid: '867051314767696@bot' },
              forwardOrigin: 4,
            },
          },
        },
      },
    },
    { messageId: responseId },
  )
}

async function handler(m, { sock }) {
  const query = m.args.join(' ').trim()
  if (!query) return m.reply(`Contoh:\n${m.prefix}tiktoksc kucing lucu`)
  m.react('🔍')
  try {
    const results = await tiktokSearchVideo(query)
    const videos = results.filter(v => v?.link).slice(0, 8)
    if (!videos.length) {
      m.react('❌')
      return m.reply(`❌ Tidak ditemukan video untuk: ${query}`)
    }
    await sendTikTokHTML(sock, m, buildTikTokHTML(videos, query))
    m.react('✅')
  } catch (error) {
    console.error('[TIKTOKSC HTML]', error)
    m.react('❌')
    return m.reply(te(m.prefix, m.command, m.pushName))
  }
}

export { pluginConfig as config, handler, tiktokSearchVideo }
