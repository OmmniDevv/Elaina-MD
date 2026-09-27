/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import te from '../../src/lib/elaina-error.js';

const html = `
<style>
:root{
  --ink:#e9edef;
  --ink-soft:#aebac1;
  --muted:#8696a0;
  --accent:#00a884;
  --line:#2a3942;
  --line-strong:#374248;
  --cell-bg:#111b21;
  --card-2:#2a3942;
  --sys:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
}
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
html,body{background:transparent;color:var(--ink);font-family:var(--sys);min-height:100vh;overflow-x:hidden;-webkit-font-smoothing:antialiased;}
.stage{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 16px;}
.card{width:100%;max-width:380px;}
.header{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid var(--line);gap:8px;}
.header__title{font-size:17px;font-weight:600;color:var(--ink);}
.header__sub{font-size:12px;color:var(--muted);}
.status{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;font-size:13px;gap:8px;}
.status__info{display:flex;gap:16px;color:var(--muted);font-size:12px;}
.status__info b{color:var(--ink);}
.board-wrap{position:relative;width:100%;aspect-ratio:1/1;background:var(--cell-bg);border-radius:12px;overflow:hidden;border:1px solid var(--line);}
canvas{width:100%;height:100%;display:block;cursor:pointer;touch-action:none;}
.footer{margin-top:12px;display:flex;justify-content:center;gap:12px;}
.footer__btn{background:var(--card-2);border:none;color:var(--ink);font-family:inherit;font-size:13px;font-weight:500;cursor:pointer;padding:8px 20px;border-radius:8px;border:1px solid var(--line);}
.footer__btn:active{filter:brightness(.92);}
.footer__btn--primary{background:var(--accent);color:#0b141a;border-color:var(--accent);}
</style>

<main class="stage">
<div class="card">
<div class="header">
<div class="header__title">🧠 Memory Match</div>
<div class="header__sub">cocokin pasangan</div>
</div>
<div class="status">
<div class="status__info">
<span>Pasangan <b id="pairs-matched">0</b>/8</span>
<span>Langkah <b id="moves-count">0</b></span>
<span>⏱️ <b id="timer-display">0s</b></span>
</div>
</div>
<div class="board-wrap">
<canvas id="board"></canvas>
</div>
<div class="footer">
<button class="footer__btn" id="reset-btn">🔄 Ulang</button>
<button class="footer__btn footer__btn--primary" id="newgame-btn">🎮 Game Baru</button>
</div>
</div>
</main>

<script>
const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
let W=320,H=320,cols=4,rows=4,cellSize=80;

function resizeCanvas(){
const rect=canvas.getBoundingClientRect();
W=canvas.width=Math.max(280,Math.floor(rect.width));
H=canvas.height=Math.max(280,Math.floor(rect.height));
cellSize=W/cols;
}

const EMOJIS=['🐱','🐶','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🐤','🐣','🐺','🐗','🐴','🦄','🐝','🐛','🦋','🐌','🐞','🐜','🪰','🪲','🪳','🦗','🦟','🪳','🦎','🐍','🐢','🐊','🦖','🦕','🐙','🦑','🦐','🦞','🦀','🐡','🐠','🐟','🐬','🐳','🐋','🦈','🐊','🐅','🐆','🦓','🦍','🐘','🦛','🦏','🐪','🐫','🦒','🐃','🐂','🐄','🐎','🐖','🐏','🐑','🐐','🦌','🐕','🐩','🐈','🐓','🦃','🦚','🦜','🦢','🕊️','🐇','🦝','🦡','🦨','🦦','🦥','🐿️','🦔'];
let cards=[],flipped=[],matched=[],moves=0,pairsMatched=0,timer=0,timerInterval=null,gameStarted=false,gameOver=false,flipBackTimeout=null;
let selectedFirst=null;

function shuffle(arr){for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}return arr;}

function initGame(){
const pairs=8;
const selected=shuffle([...EMOJIS]).slice(0,pairs);
cards=shuffle([...selected,...selected]).map((emoji,idx)=>({id:idx,emoji,flipped:false,matched:false}));
flipped=[];matched=[];moves=0;pairsMatched=0;gameStarted=false;gameOver=false;selectedFirst=null;
if(timerInterval){clearInterval(timerInterval);timerInterval=null;}
timer=0;
if(flipBackTimeout){clearTimeout(flipBackTimeout);flipBackTimeout=null;}
updateUI();render();
}

function startTimer(){if(!gameStarted&&!gameOver){gameStarted=true;timerInterval=setInterval(()=>{timer++;document.getElementById('timer-display').textContent=timer+'s';},1000);}}

function checkMatch(){
if(flipped.length!==2)return;
const [a,b]=flipped;
if(cards[a].emoji===cards[b].emoji){
cards[a].matched=true;cards[b].matched=true;
matched.push(a,b);pairsMatched++;
flipped=[];
if(pairsMatched===8){gameOver=true;if(timerInterval){clearInterval(timerInterval);timerInterval=null;}}
updateUI();render();return;
}
flipBackTimeout=setTimeout(()=>{
cards[a].flipped=false;cards[b].flipped=false;
flipped=[];
render();
flipBackTimeout=null;
},600);
}

function handleClick(e){
if(gameOver)return;
const rect=canvas.getBoundingClientRect();
const scaleX=canvas.width/rect.width;
const scaleY=canvas.height/rect.height;
const clientX=e.clientX||(e.touches?e.touches[0].clientX:0);
const clientY=e.clientY||(e.touches?e.touches[0].clientY:0);
const x=(clientX-rect.left)*scaleX;
const y=(clientY-rect.top)*scaleY;
const col=Math.floor(x/cellSize);
const row=Math.floor(y/cellSize);
const idx=row*cols+col;
if(idx>=cards.length||cards[idx].flipped||cards[idx].matched)return;
if(flipped.length>=2)return;
startTimer();
cards[idx].flipped=true;
flipped.push(idx);
if(flipped.length===2){moves++;document.getElementById('moves-count').textContent=moves;checkMatch();}
updateUI();render();
}

function updateUI(){
document.getElementById('pairs-matched').textContent=pairsMatched;
document.getElementById('moves-count').textContent=moves;
}

function render(){
ctx.clearRect(0,0,W,H);
const gap=4;
for(let i=0;i<cards.length;i++){
const row=Math.floor(i/cols),col=i%cols;
const x=col*cellSize+gap/2,y=row*cellSize+gap/2;
const size=cellSize-gap;
if(cards[i].matched){
ctx.fillStyle='rgba(0,168,132,0.15)';
ctx.fillRect(x,y,size,size);
ctx.strokeStyle='var(--accent)';
ctx.lineWidth=1.5;
ctx.strokeRect(x,y,size,size);
ctx.fillStyle='var(--ink)';
ctx.font=\`\${size*0.5}px sans-serif\`;
ctx.textAlign='center';ctx.textBaseline='middle';
ctx.fillText(cards[i].emoji,x+size/2,y+size/2);
continue;
}
if(cards[i].flipped){
const g=ctx.createRadialGradient(x+size/2,y+size/2,0,x+size/2,y+size/2,size/2);
g.addColorStop(0,'#2a3942');g.addColorStop(1,'#111b21');
ctx.fillStyle=g;ctx.fillRect(x,y,size,size);
ctx.strokeStyle='var(--line-strong)';ctx.lineWidth=1.5;ctx.strokeRect(x,y,size,size);
ctx.fillStyle='var(--ink)';ctx.font=\`\${size*0.55}px sans-serif\`;
ctx.textAlign='center';ctx.textBaseline='middle';
ctx.fillText(cards[i].emoji,x+size/2,y+size/2);
}else{
ctx.fillStyle='#2a3942';ctx.fillRect(x,y,size,size);
ctx.strokeStyle='var(--line)';ctx.lineWidth=1.5;ctx.strokeRect(x,y,size,size);
ctx.fillStyle='rgba(255,255,255,0.05)';
ctx.beginPath();ctx.arc(x+size/2,y+size/2,size*0.25,0,Math.PI*2);ctx.fill();
ctx.fillStyle='var(--muted)';ctx.font=\`\${size*0.2}px sans-serif\`;
ctx.textAlign='center';ctx.textBaseline='middle';
ctx.fillText('?',x+size/2,y+size/2+1);
}
}
if(gameOver){
ctx.fillStyle='rgba(0,0,0,0.5)';
ctx.fillRect(0,0,W,H);
ctx.fillStyle='var(--accent)';ctx.font='bold 28px sans-serif';
ctx.textAlign='center';ctx.textBaseline='middle';
ctx.fillText(pairsMatched===8?'🎉 SELESAI!':'✖ GAME OVER',W/2,H/2-10);
ctx.fillStyle='var(--muted)';ctx.font='14px sans-serif';
ctx.fillText('Klik "Game Baru" untuk main lagi',W/2,H/2+30);
}
}

canvas.addEventListener('click',handleClick);
canvas.addEventListener('touchstart',(e)=>{e.preventDefault();handleClick(e);},{passive:false});
document.getElementById('reset-btn').addEventListener('click',()=>{if(timerInterval){clearInterval(timerInterval);timerInterval=null;}initGame();});
document.getElementById('newgame-btn').addEventListener('click',()=>{if(timerInterval){clearInterval(timerInterval);timerInterval=null;}initGame();});
resizeCanvas();initGame();
window.addEventListener('resize',()=>{resizeCanvas();render();});
function gameLoop(){render();requestAnimationFrame(gameLoop);}
gameLoop();
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
name: 'memorymatch',
alias: ['memorymatchgame', 'mmatch'],
category: 'game',
description: 'Game hafalan kartu - cocokin pasangan emoji!',
usage: '',
example: '.memory',
isOwner: false,
isPremium: false,
isGroup: false,
isPrivate: false,
cooldown: 3,
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
messageText: 'Memory Match'
}
],
unifiedResponse: {
data: Buffer.from(
JSON.stringify({
response_id: 'memorymatch2026',
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
console.error('[MEMORY ERROR]', err);
await m.reply('❌ Gagal mengirim game Memory Match.');
}
}

export { pluginConfig as config, handler };
