/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

// speedydash.js
// HTML Rich Snippet Game — Speedy Dash: Emerald Coast Run
// (zerotwo_3_2)

import te from '../../src/lib/elaina-error.js';

const html = `
<style>
:root{
  --ink:#e9edef;
  --ink-soft:#aebac1;
  --muted:#8696a0;
  --accent:#00a884;
  --danger:#f15c5c;
  --line:#2a3942;
  --line-strong:#374248;
  --cell-bg:#111b21;
  --card-2:#2a3942;
  --sys:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
}

*{
  margin:0;
  padding:0;
  box-sizing:border-box;
  -webkit-tap-highlight-color:transparent;
}

html,body{
  background:transparent;
  color:var(--ink);
  font-family:var(--sys);
  min-height:100vh;
  overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
}

.stage{
  min-height:100vh;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  padding:24px 16px;
}

.card{
  width:100%;
  max-width:360px;
}

.header{
  display:flex;
  align-items:baseline;
  justify-content:space-between;
  margin-bottom:14px;
  padding-bottom:12px;
  border-bottom:1px solid var(--line);
  gap:8px;
}

.header__title{
  font-size:17px;
  font-weight:600;
  color:var(--ink);
}

.header__sub{
  font-size:12px;
  color:var(--muted);
}

.status{
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-bottom:14px;
  font-size:13px;
  gap:8px;
}

.status__score{
  display:flex;
  gap:10px;
  color:var(--muted);
  font-size:11px;
}

.status__score b{
  color:var(--ink);
  margin-left:3px;
}

.board-wrap{
  position:relative;
  width:100%;
  aspect-ratio:16/10;
  background:#1a2b4d;
  border-radius:8px;
  overflow:hidden;
  border:1px solid var(--line);
}

canvas{
  width:100%;
  height:100%;
  display:block;
}

.boost-bar-wrap{
  position:absolute;
  top:8px;
  left:8px;
  right:70px;
}

.boost-bar{
  height:6px;
  background:rgba(0,0,0,0.4);
  border-radius:4px;
  overflow:hidden;
  border:1px solid rgba(255,255,255,0.2);
}

.boost-fill{
  height:100%;
  width:100%;
  background:linear-gradient(90deg,#ffd24c,#ff9d2f);
}

.boost-label{
  color:#ffd24c;
  font-size:10px;
  font-weight:700;
  height:12px;
  text-shadow:0 1px 2px rgba(0,0,0,.6);
}

.spd-indicator{
  position:absolute;
  top:8px;
  right:8px;
  background:rgba(0,0,0,0.4);
  color:#fff;
  font-size:10px;
  font-weight:700;
  padding:3px 6px;
  border-radius:5px;
}

.controls{
  margin-top:16px;
  display:flex;
  gap:10px;
}

.controls button{
  flex:1;
  border:none;
  border-radius:12px;
  padding:14px 0;
  font-size:14px;
  font-weight:700;
  color:#0b141a;
  cursor:pointer;
  font-family:inherit;
  letter-spacing:.3px;
}

#btn-boost{
  background:linear-gradient(180deg,#ffcf4c,#f5a623);
}

#btn-jump{
  background:linear-gradient(180deg,#55b8ff,#1b7fe0);
  color:#fff;
}

.controls button:active{
  filter:brightness(.92);
}

.footer{
  margin-top:12px;
  display:flex;
  justify-content:center;
}

.footer__reset{
  background:none;
  border:none;
  color:var(--accent);
  font-family:inherit;
  font-size:13px;
  font-weight:500;
  cursor:pointer;
  padding:8px 16px;
}

@media(max-width:380px){
  .stage{
    padding:16px 12px;
  }
}
</style>

<main class="stage">

  <div class="card">

    <div class="header">
      <div class="header__title">
        Speedy Dash
      </div>
      <div class="header__sub">
        Emerald Coast Run
      </div>
    </div>

    <div class="status">
      <div class="status__score">
        <span>Rings<b id="hud-rings">0</b></span>
        <span>Jarak<b id="hud-dist">0</b></span>
        <span>Hit<b id="hud-hits">0</b></span>
      </div>
    </div>

    <div class="board-wrap">
      <canvas id="board"></canvas>
      <div class="boost-bar-wrap">
        <div class="boost-bar"><div id="boost-fill" class="boost-fill"></div></div>
        <div id="boost-label" class="boost-label"></div>
      </div>
      <div class="spd-indicator" id="spd-indicator">SPD 0.0</div>
    </div>

    <div class="controls">
      <button id="btn-boost">⚡ BOOST</button>
      <button id="btn-jump">⤴ JUMP</button>
    </div>

    <div class="footer">
      <button class="footer__reset" id="reset">Ulang papan</button>
    </div>

  </div>

</main>

<script>

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

let W = 320, H = 200, groundY = 0;

function resizeCanvas(){
  const rect = canvas.getBoundingClientRect();
  W = canvas.width = Math.max(280, Math.floor(rect.width));
  H = canvas.height = Math.max(160, Math.floor(rect.height));
  groundY = H * 0.78;
}

const GRAVITY = 0.85;
const JUMP_V = -14;

const player = { x:0, y:0, r:16, vy:0, grounded:true };
function resetPlayer(){
  player.x = Math.min(90, W * 0.22);
  player.y = groundY - player.r;
  player.vy = 0;
  player.grounded = true;
}

let baseSpeed = 4;
let speed = baseSpeed;
let boost = 100;
let boosting = false;
const BOOST_DRAIN = 1.3;
const BOOST_REGEN = 0.22;
const BOOST_MULT = 1.9;

let rings = 0;
let distance = 0;
let hits = 0;
let invulnerable = 0;

let scrollX = 0;
let obstacles = [];
let nextSpawnDist = 220;

function spawnObstacle(){
  const worldX = scrollX + W + 60;
  const r = Math.random();
  if (r < 0.55) {
    const count = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      obstacles.push({
        type: 'ring',
        x: worldX + i * 38,
        y: groundY - 50 - Math.sin((i / count) * Math.PI) * 40,
        collected: false
      });
    }
  } else if (r < 0.82) {
    obstacles.push({ type: 'enemy', x: worldX, y: groundY - 16, hit: false });
  } else {
    obstacles.push({ type: 'coin', x: worldX, y: groundY - 75, collected: false });
  }
  const gap = Math.max(130, 210 + Math.random() * 150 - Math.min(80, distance * 0.05));
  nextSpawnDist = scrollX + W + gap;
}

function doJump(){
  if (player.grounded) {
    player.vy = JUMP_V;
    player.grounded = false;
  }
}
function setBoost(v){
  boosting = v;
}

document.getElementById('btn-jump').addEventListener('pointerdown', e => { e.preventDefault(); doJump(); });
document.getElementById('btn-boost').addEventListener('pointerdown', e => { e.preventDefault(); setBoost(true); });
document.getElementById('btn-boost').addEventListener('pointerup', () => setBoost(false));
document.getElementById('btn-boost').addEventListener('pointerleave', () => setBoost(false));
document.getElementById('btn-boost').addEventListener('pointercancel', () => setBoost(false));

document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === ' ' || k === 'arrowup' || k === 'w') { e.preventDefault(); doJump(); }
  if (k === 'shift') setBoost(true);
});
document.addEventListener('keyup', e => {
  if (e.key.toLowerCase() === 'shift') setBoost(false);
});

document.getElementById('reset').addEventListener('click', () => {
  rings = 0; distance = 0; hits = 0; scrollX = 0;
  boost = 100; obstacles = [];
  nextSpawnDist = 220;
  resetPlayer();
});

function checkCollisions(){
  for (const o of obstacles) {
    const sx = o.x - scrollX;
    if (o.type === 'ring' && !o.collected) {
      if (Math.hypot(sx - player.x, o.y - player.y) < player.r + 9) {
        o.collected = true;
        rings++;
      }
    } else if (o.type === 'coin' && !o.collected) {
      if (Math.hypot(sx - player.x, o.y - player.y) < player.r + 11) {
        o.collected = true;
        boost = Math.min(100, boost + 35);
      }
    } else if (o.type === 'enemy' && !o.hit) {
      if (invulnerable <= 0 && Math.hypot(sx - player.x, o.y - player.y) < player.r + 14) {
        o.hit = true;
        hits++;
        rings = Math.max(0, Math.floor(rings * 0.9));
        invulnerable = 55;
      }
    }
  }
  obstacles = obstacles.filter(o => (o.x - scrollX) > -80);
}

function updateHud(){
  document.getElementById('hud-rings').textContent = rings;
  document.getElementById('hud-dist').textContent = distance;
  document.getElementById('hud-hits').textContent = hits;
  document.getElementById('boost-fill').style.width = boost + '%';
  document.getElementById('boost-label').textContent = boosting ? 'BOOST!!' : '';
  document.getElementById('spd-indicator').textContent = 'SPD ' + speed.toFixed(1);
}

function update(dt){
  if (boosting && boost > 0) {
    speed = (baseSpeed + distance * 0.0015) * BOOST_MULT;
    boost = Math.max(0, boost - BOOST_DRAIN * dt);
  } else {
    speed = baseSpeed + distance * 0.0015;
    boost = Math.min(100, boost + BOOST_REGEN * dt);
  }
  speed = Math.min(speed, 22);

  scrollX += speed * dt;
  distance = Math.floor(scrollX / 10);

  player.vy += GRAVITY * dt;
  player.y += player.vy * dt;
  if (player.y + player.r >= groundY) {
    player.y = groundY - player.r;
    player.vy = 0;
    player.grounded = true;
  } else {
    player.grounded = false;
  }

  if (scrollX + W > nextSpawnDist) spawnObstacle();
  if (invulnerable > 0) invulnerable -= dt;

  checkCollisions();
  updateHud();
}

function drawRepeating(spacing, factor, offsetY, fn){
  const offset = (scrollX * factor) % spacing;
  for (let x = -offset - spacing; x < W + spacing; x += spacing) fn(x, offsetY);
}

function drawSky(){
  const g = ctx.createLinearGradient(0, 0, 0, groundY);
  g.addColorStop(0, '#3a2d6b');
  g.addColorStop(1, '#6d93c9');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, groundY);

  const sunX = W * 0.8, sunY = H * 0.22;
  const sg = ctx.createRadialGradient(sunX, sunY, 4, sunX, sunY, 30);
  sg.addColorStop(0, '#fff2c2');
  sg.addColorStop(1, '#ffb347');
  ctx.fillStyle = sg;
  ctx.beginPath();
  ctx.arc(sunX, sunY, 18, 0, Math.PI * 2);
  ctx.fill();
}

function drawCloudAt(x, y){
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.beginPath();
  ctx.ellipse(x, y, 22, 10, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 16, y - 5, 15, 8, 0, 0, Math.PI * 2);
  ctx.ellipse(x - 15, y - 3, 13, 7, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawHill(){
  ctx.fillStyle = 'rgba(40,90,110,0.55)';
  ctx.beginPath();
  ctx.moveTo(0, groundY - 32);
  for (let x = 0; x <= W; x += 18) {
    const wobble = Math.sin((x + scrollX * 0.4) * 0.012) * 11;
    ctx.lineTo(x, groundY - 32 - wobble);
  }
  ctx.lineTo(W, groundY);
  ctx.lineTo(0, groundY);
  ctx.closePath();
  ctx.fill();
}

function drawSea(){
  ctx.fillStyle = '#3aa0c9';
  ctx.fillRect(0, groundY - 18, W, 18);
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 1.4;
  drawRepeating(40, 0.6, groundY - 10, (x, y) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 16, y);
    ctx.stroke();
  });
}

function drawPalmAt(x, y){
  ctx.strokeStyle = '#5b3b21';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x + 5, y - 26, x + 2, y - 46);
  ctx.stroke();
  ctx.fillStyle = '#2f9e46';
  for (let i = 0; i < 5; i++) {
    const ang = (i / 5) * Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(x + 2 + Math.cos(ang) * 13, y - 46 + Math.sin(ang) * 8, 13, 5, ang, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawGround(){
  ctx.fillStyle = '#3fae4c';
  ctx.fillRect(0, groundY, W, H - groundY);
  ctx.fillStyle = '#2e8f3c';
  drawRepeating(22, 1, groundY + 12, (x, y) => {
    ctx.beginPath();
    ctx.arc(x, y, 1.8, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawPlayer(){
  if (invulnerable > 0 && Math.floor(invulnerable / 4) % 2 === 0) return;
  const g = ctx.createRadialGradient(player.x - 5, player.y - 5, 2, player.x, player.y, player.r);
  g.addColorStop(0, '#6fb4ff');
  g.addColorStop(1, '#1a4fc4');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.r - 4, 0.4, 1.6);
  ctx.stroke();
}

function drawObstacles(){
  for (const o of obstacles) {
    const sx = o.x - scrollX;
    if (sx < -50 || sx > W + 50) continue;
    if (o.type === 'ring') {
      if (o.collected) continue;
      ctx.strokeStyle = '#ffd24c';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(sx, o.y, 11, 0, Math.PI * 2);
      ctx.stroke();
    } else if (o.type === 'coin') {
      if (o.collected) continue;
      ctx.fillStyle = '#4fd7ff';
      ctx.beginPath();
      ctx.arc(sx, o.y, 10, 0, Math.PI * 2);
      ctx.fill();
    } else if (o.type === 'enemy') {
      const eg = ctx.createRadialGradient(sx - 3, o.y - 3, 2, sx, o.y, 15);
      eg.addColorStop(0, '#ff7d6b');
      eg.addColorStop(1, '#c22b1f');
      ctx.fillStyle = o.hit ? 'rgba(180,180,180,0.4)' : eg;
      ctx.beginPath();
      ctx.arc(sx, o.y, 14, 0, Math.PI * 2);
      ctx.fill();
      if (!o.hit) {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(sx - 4, o.y - 3, 2, 0, Math.PI * 2);
        ctx.arc(sx + 4, o.y - 3, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

function render(){
  ctx.clearRect(0, 0, W, H);
  drawSky();
  drawRepeating(180, 0.15, H * 0.18, drawCloudAt);
  drawHill();
  drawSea();
  drawRepeating(260, 0.9, groundY, drawPalmAt);
  drawGround();
  drawObstacles();
  drawPlayer();
}

let lastTime = performance.now();
function loop(now){
  const dt = Math.min((now - lastTime) / 16.67, 3);
  lastTime = now;
  update(dt);
  render();
  requestAnimationFrame(loop);
}

resizeCanvas();
resetPlayer();
window.addEventListener('resize', () => { resizeCanvas(); resetPlayer(); });
requestAnimationFrame(loop);

\n/* RIMURU LIGHT SFX: procedural WebAudio, no external audio asset */
(function(){
  if (window.__RIMURU_LIGHT_SFX__) return;
  var ac=null, master=null, last=0;
  function init(){
    try{
      if(!ac){
        var C=window.AudioContext||window.webkitAudioContext;
        if(!C) return null;
        ac=new C();
        master=ac.createGain();
        master.gain.value=0.055;
        master.connect(ac.destination);
      }
      if(ac.state==='suspended') ac.resume();
      return ac;
    }catch(_){ return null; }
  }
  function tone(freq,dur,type,vol,when){
    var c=init(); if(!c||!master) return;
    var now=c.currentTime+(when||0), o=c.createOscillator(), g=c.createGain();
    o.type=type||'sine';
    o.frequency.setValueAtTime(freq,now);
    g.gain.setValueAtTime(0.0001,now);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0001,vol||0.12),now+0.008);
    g.gain.exponentialRampToValueAtTime(0.0001,now+(dur||0.07));
    o.connect(g); g.connect(master); o.start(now); o.stop(now+(dur||0.07)+0.015);
  }
  function cool(now){
    var t=Date.now(); if(t-last<now) return false; last=t; return true;
  }
  var api={
    init:init,
    tap:function(){ if(cool(28)) tone(520,0.045,'square',0.055); },
    move:function(){ if(cool(24)) tone(300,0.035,'triangle',0.045); },
    rotate:function(){ if(cool(24)) tone(430,0.05,'triangle',0.05); },
    drop:function(){ if(cool(20)) tone(180,0.055,'square',0.05); },
    score:function(){ if(cool(18)) { tone(660,0.055,'sine',0.055); tone(880,0.055,'sine',0.04,0.045); } },
    line:function(){ if(cool(35)) { tone(740,0.06,'sine',0.06); tone(1040,0.09,'sine',0.045,0.05); } },
    win:function(){ if(cool(60)) { tone(523,0.08,'sine',0.06); tone(659,0.08,'sine',0.05,0.07); tone(784,0.12,'sine',0.045,0.14); } },
    over:function(){ if(cool(60)) { tone(392,0.09,'sawtooth',0.055); tone(294,0.12,'sawtooth',0.04,0.08); } }
  };
  window.__RIMURU_LIGHT_SFX__=api;

  function num(el){
    var s=(el.textContent||'').replace(/,/g,'').match(/-?\d+(?:\.\d+)?/);
    return s?Number(s[0]):null;
  }
  function bindValue(el){
    var lastVal=num(el);
    var mo=new MutationObserver(function(){
      var n=num(el);
      if(n===null || lastVal===null){ lastVal=n; return; }
      if(n>lastVal){
        var id=((el.id||'')+' '+(el.className||'')).toLowerCase();
        if(/line|combo|clear|level|stage/.test(id)) api.line(); else api.score();
      } else if(n<lastVal && /life|hp|health|lives|heart/.test(((el.id||'')+' '+(el.className||'')).toLowerCase())) api.over();
      lastVal=n;
    });
    mo.observe(el,{subtree:true,childList:true,characterData:true});
  }
  function bindState(el){
    var prev=(el.textContent||'').toLowerCase(), prevCls=el.className||'';
    var mo=new MutationObserver(function(){
      var txt=(el.textContent||'').toLowerCase(), cls=el.className||'';
      var joined=txt+' '+cls.toLowerCase();
      if(joined!==prev+' '+prevCls.toLowerCase()){
        if(/game over|gameover|kalah|selesai|you lose|lose|mati|gagal|over/.test(joined)) api.over();
        else if(/menang|menang!|you win|winner|victory|berhasil|selamat/.test(joined)) api.win();
        prev=txt; prevCls=cls;
      }
    });
    mo.observe(el,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class','style','hidden','aria-hidden']});
  }
  document.addEventListener('pointerdown',function(){ api.init(); api.tap(); },{passive:true,capture:true});
  document.addEventListener('keydown',function(e){
    api.init();
    var k=e.key;
    if(/^Arrow(Left|Right|Up|Down)$/.test(k) || /^(a|d|w|s)$/i.test(k)) api.move();
    else if(k===' ' || k==='Enter') api.tap();
  },{passive:true,capture:true});
  document.addEventListener('DOMContentLoaded',function(){
    document.querySelectorAll('[id]').forEach(function(el){
      var id=((el.id||'')+' '+(el.className||'')).toLowerCase();
      if(/score|points|lines|combo|level|stage|best|coin/.test(id)) bindValue(el);
      if(/over|result|status|message|state|win|lose|modal/.test(id)) bindState(el);
    });
  });
  if(document.readyState!=='loading'){
    document.querySelectorAll('[id]').forEach(function(el){
      var id=((el.id||'')+' '+(el.className||'')).toLowerCase();
      if(/score|points|lines|combo|level|stage|best|coin/.test(id)) bindValue(el);
      if(/over|result|status|message|state|win|lose|modal/.test(id)) bindState(el);
    });
  }
})();
<\/script>
`;

const pluginConfig = {
  name: 'speedydash',
  alias: ['speedydashgame'],
  category: 'game',
  description: 'Main game endless runner Speedy Dash langsung di chat, kumpulin ring dan hindari musuh',
  usage: '',
  example: '.dash',
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  isEnabled: true
};

async function handler(m, { sock }) {
  try {
    await sock.relayMessage(
      m.chat,
      {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
          botMetadata: {}
        },

        botForwardedMessage: {
          message: {
            richResponseMessage: {
              messageType: 1,

              submessages: [
                {
                  messageType: 2,
                  messageText: 'Speedy Dash - Emerald Coast Run'
                }
              ],

              unifiedResponse: {
                data: Buffer.from(
                  JSON.stringify({
                    response_id: '9a4c2e1b-6f0d-4a88-b7e3-speedydash2026',

                    sections: [
                      {
                        view_model: {
                          primitive: {
                            __typename: 'GenAIaeacdsnwHtmlPrimitive',
                            payload: html,
                            trusted_sources: []
                          },
                          __typename: 'GenAISingleLayoutViewModel'
                        }
                      }
                    ]
                  })
                ).toString('base64')
              },

              contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedAiBotMessageInfo: {
                  botJid: '867051314767696@bot'
                },
                forwardOrigin: 4
              }
            }
          }
        }
      },
      {}
    );
  } catch (err) {
    te(m.prefix, m.command, m.pushName);
    console.error('[SPEEDYDASH ERROR]', err);
    await m.reply('❌ Gagal mengirim game Speedy Dash.');
  }
}

export { pluginConfig as config, handler };
