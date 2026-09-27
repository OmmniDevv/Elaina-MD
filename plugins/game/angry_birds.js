/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import te from '../../src/lib/elaina-error.js';

const pluginConfig = {
    name: 'angrybirds',
    alias: ['angrybird', 'abirds'],
    category: 'game',
    description: 'Angry Birds mini - tembak burung ke target!',
    usage: '',
    example: '.angrybird',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    isEnabled: true
};

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
.status__score{display:flex;gap:16px;color:var(--muted);font-size:12px;}
.status__score b{color:var(--ink);}
.board-wrap{position:relative;width:100%;aspect-ratio:16/10;background:#87CEEB;border-radius:8px;overflow:hidden;border:1px solid var(--line);}
canvas{width:100%;height:100%;display:block;cursor:crosshair;touch-action:none;}
.controls{margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;justify-content:center;}
.controls button{border:none;border-radius:10px;padding:10px 16px;font-size:13px;font-weight:700;color:#0b141a;cursor:pointer;font-family:inherit;background:var(--card-2);color:var(--ink);border:1px solid var(--line);}
.controls button:active{filter:brightness(.85);transform:scale(0.95);}
.btn-shoot{background:linear-gradient(180deg,#e74c3c,#c0392b);color:#fff !important;}
.btn-reset{background:var(--accent);color:#0b141a !important;border-color:var(--accent) !important;}
.btn-power{background:linear-gradient(180deg,#f39c12,#d68910);color:#fff !important;}
</style>

<main class="stage">
<div class="card">
<div class="header">
<div class="header__title">🐦 Angry Birds</div>
<div class="header__sub">tembak babi!</div>
</div>
<div class="status">
<div class="status__score">
<span>Skor <b id="score-display">0</b></span>
<span>Burung <b id="birds-display">5</b></span>
<span>Target <b id="targets-display">0</b></span>
</div>
</div>
<div class="board-wrap">
<canvas id="board"></canvas>
</div>
<div class="controls">
<button class="btn-shoot" id="btn-shoot">🎯 Tembak</button>
<button class="btn-power" id="btn-power">⚡ Power +10</button>
<button class="btn-reset" id="btn-reset">🔄 Ulang</button>
</div>
</div>
</main>

<script>
const canvas=document.getElementById('board');
const ctx=canvas.getContext('2d');
let W=400,H=250;

function resizeCanvas(){
const rect=canvas.getBoundingClientRect();
W=canvas.width=Math.max(320,Math.floor(rect.width));
H=canvas.height=Math.max(200,Math.floor(rect.height));
}

let birds=[],targets=[],projectiles=[],score=0,birdCount=5,level=1,gameOver=false;
let power=50,maxPower=100,charging=false,chargeTimer=null;
let birdX=60,birdY=0,groundY=0;
let dragStart=null,dragEnd=null,isDragging=false;
let particles=[],explosions=[];

function resetGame(){
birds=[];targets=[];projectiles=[];particles=[];explosions=[];
score=0;birdCount=5;level=1;gameOver=false;power=50;
groundY=H*0.82;
birdX=60;
birdY=groundY-20;
spawnTargets();
updateUI();
}

function spawnTargets(){
const count=3+level;
targets=[];
for(let i=0;i<count;i++){
const x=W*0.5+40+Math.random()*(W*0.35);
const y=groundY-20-Math.random()*(H*0.35);
const size=16+Math.random()*8;
targets.push({
x:x,y:y,w:size,h:size,
hp:1+Math.floor(level/2),
maxHp:1+Math.floor(level/2),
alive:true,
type:Math.random()>0.7?'pig':'block'
});
}
document.getElementById('targets-display').textContent=targets.filter(t=>t.alive).length;
}

function updateUI(){
document.getElementById('score-display').textContent=score;
document.getElementById('birds-display').textContent=birdCount;
document.getElementById('targets-display').textContent=targets.filter(t=>t.alive).length;
}

function shoot(){
if(gameOver)return;
if(birdCount<=0){gameOver=true;return;}
if(projectiles.length>0)return;

const angle=-45+Math.random()*30;
const powerFactor=power/50;
const vx=Math.cos(angle*Math.PI/180)*powerFactor*4;
const vy=-Math.sin(angle*Math.PI/180)*powerFactor*4-2;

projectiles.push({
x:birdX+20,y:birdY-10,
vx:vx,vy:vy,
r:10,
life:true,
gravity:0.3
});

birdCount--;
updateUI();
}

function shootWithPower(pwr){
if(gameOver)return;
if(birdCount<=0){gameOver=true;return;}
if(projectiles.length>0)return;

const angle=-40+Math.random()*20;
const powerFactor=pwr/50;
const vx=Math.cos(angle*Math.PI/180)*powerFactor*5;
const vy=-Math.sin(angle*Math.PI/180)*powerFactor*5-3;

projectiles.push({
x:birdX+20,y:birdY-10,
vx:vx,vy:vy,
r:10,
life:true,
gravity:0.3
});

birdCount--;
updateUI();
}

function addExplosion(x,y,color,count){
for(let i=0;i<count;i++){
const angle=Math.random()*Math.PI*2;
const speed=1+Math.random()*4;
particles.push({
x:x,y:y,
vx:Math.cos(angle)*speed,
vy:Math.sin(angle)*speed-1,
life:30+Math.random()*30,
maxLife:60,
r:2+Math.random()*4,
color:color
});
}
}

function update(){
if(gameOver)return;

for(let i=projectiles.length-1;i>=0;i--){
const p=projectiles[i];
p.x+=p.vx;
p.y+=p.vy;
p.vy+=p.gravity;

if(p.y+p.r>groundY){
p.y=groundY-p.r;
p.vx*=0.8;
p.vy*=-0.3;
if(Math.abs(p.vy)<0.5)p.vy=0;
}

if(p.x>W||p.x<0||p.y>H){
projectiles.splice(i,1);
continue;
}

let hit=false;
for(const target of targets){
if(!target.alive)continue;
if(p.x>target.x&&p.x<target.x+target.w&&
p.y>target.y&&p.y<target.y+target.h){
target.hp--;
if(target.hp<=0){
target.alive=false;
score+=10+level*5;
addExplosion(target.x+target.w/2,target.y+target.h/2,'#ff6b6b',20);
addExplosion(target.x+target.w/2,target.y+target.h/2,'#ffd93d',10);
}
addExplosion(p.x,p.y,'#ffd93d',15);
projectiles.splice(i,1);
hit=true;
updateUI();
break;
}
}
if(hit)continue;

if(p.vx===0&&p.vy===0&&p.y+p.r>=groundY-2){
projectiles.splice(i,1);
}
}

for(let i=particles.length-1;i>=0;i--){
const p=particles[i];
p.x+=p.vx;
p.y+=p.vy;
p.vy+=0.05;
p.life--;
if(p.life<=0)particles.splice(i,1);
}

if(projectiles.length===0){
const alive=targets.filter(t=>t.alive).length;
if(alive===0){
level++;
spawnTargets();
birdCount=Math.min(birdCount+2,10);
updateUI();
}else if(birdCount<=0&&projectiles.length===0){
gameOver=true;
}
}

updateUI();
}

function render(){
ctx.clearRect(0,0,W,H);

const sky=ctx.createLinearGradient(0,0,0,H);
sky.addColorStop(0,'#87CEEB');
sky.addColorStop(0.6,'#b8d4e3');
sky.addColorStop(1,'#d4e9f2');
ctx.fillStyle=sky;
ctx.fillRect(0,0,W,H);

for(let x=0;x<W+40;x+=60){
const wx=(x+Date.now()*0.01)%120;
ctx.fillStyle='rgba(255,255,255,0.3)';
ctx.beginPath();
ctx.ellipse(x-40+wx,30+Math.sin(x*0.02+Date.now()*0.001)*10,25,8,0,0,Math.PI*2);
ctx.fill();
}

ctx.fillStyle='#8BC34A';
ctx.fillRect(0,groundY,W,H-groundY);
ctx.fillStyle='#689F38';
ctx.fillRect(0,groundY,W,6);

ctx.fillStyle='#795548';
for(let x=0;x<W+40;x+=30){
ctx.fillRect(x+(Date.now()*0.02)%60,groundY+10,4,8);
}

ctx.fillStyle='#2E7D32';
ctx.fillRect(0,groundY+4,W,4);

for(const target of targets){
if(!target.alive)continue;
const cx=target.x+target.w/2;
const cy=target.y+target.h/2;
if(target.type==='pig'){
ctx.fillStyle='#4CAF50';
ctx.beginPath();
ctx.arc(cx,cy,target.w/2,0,Math.PI*2);
ctx.fill();
ctx.fillStyle='#388E3C';
ctx.beginPath();
ctx.arc(cx-3,cy-3,target.w/4,0,Math.PI*2);
ctx.fill();
ctx.fillStyle='#1B5E20';
ctx.fillRect(cx-2,cy-1,4,2);
ctx.fillStyle='#fff';
ctx.fillRect(cx-4,cy-4,2,2);
ctx.fillRect(cx+2,cy-4,2,2);
ctx.fillStyle='#1B5E20';
ctx.fillRect(cx-3,cy-3,1,1);
ctx.fillRect(cx+2,cy-3,1,1);
ctx.fillStyle='#1B5E20';
ctx.beginPath();
ctx.arc(cx,cy+2,3,0,Math.PI);
ctx.fill();
}else{
ctx.fillStyle='#8D6E63';
ctx.fillRect(target.x,target.y,target.w,target.h);
ctx.fillStyle='#6D4C41';
ctx.fillRect(target.x+2,target.y+2,target.w-4,target.h-4);
ctx.fillStyle='#A1887F';
ctx.fillRect(target.x+4,target.y+4,target.w-8,target.h-8);
}
ctx.fillStyle='rgba(255,255,255,0.3)';
ctx.fillRect(target.x+2,target.y+2,target.w-4,3);

if(target.hp<target.maxHp){
ctx.fillStyle='#e74c3c';
ctx.fillRect(target.x,target.y-6,target.w*(target.hp/target.maxHp),3);
}
}

for(const p of projectiles){
const grad=ctx.createRadialGradient(p.x-3,p.y-3,2,p.x,p.y,p.r);
grad.addColorStop(0,'#ff6b6b');
grad.addColorStop(0.5,'#e74c3c');
grad.addColorStop(1,'#c0392b');
ctx.fillStyle=grad;
ctx.beginPath();
ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
ctx.fill();
ctx.fillStyle='#fff';
ctx.beginPath();
ctx.arc(p.x-3,p.y-4,3,0,Math.PI*2);
ctx.fill();
ctx.fillStyle='#1a1a1a';
ctx.beginPath();
ctx.arc(p.x-4,p.y-5,1.5,0,Math.PI*2);
ctx.fill();
ctx.fillStyle='#f39c12';
ctx.beginPath();
ctx.moveTo(p.x+6,p.y-2);
ctx.lineTo(p.x+12,p.y-4);
ctx.lineTo(p.x+10,p.y+2);
ctx.closePath();
ctx.fill();
}

for(const p of particles){
const alpha=p.life/p.maxLife;
ctx.globalAlpha=alpha;
ctx.fillStyle=p.color;
ctx.beginPath();
ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
ctx.fill();
ctx.globalAlpha=1;
}

ctx.fillStyle='#e52521';
ctx.beginPath();
ctx.arc(birdX,birdY,14,0,Math.PI*2);
ctx.fill();
ctx.fillStyle='#c0392b';
ctx.beginPath();
ctx.arc(birdX-2,birdY-2,8,0,Math.PI*2);
ctx.fill();
ctx.fillStyle='#fff';
ctx.beginPath();
ctx.arc(birdX-4,birdY-4,3,0,Math.PI*2);
ctx.fill();
ctx.fillStyle='#1a1a1a';
ctx.beginPath();
ctx.arc(birdX-5,birdY-5,1.5,0,Math.PI*2);
ctx.fill();
ctx.fillStyle='#f39c12';
ctx.beginPath();
ctx.moveTo(birdX+8,birdY-3);
ctx.lineTo(birdX+16,birdY-6);
ctx.lineTo(birdX+14,birdY+1);
ctx.closePath();
ctx.fill();
ctx.fillStyle='#f5cba7';
ctx.fillRect(birdX-2,birdY+4,4,3);

ctx.fillStyle='rgba(255,255,255,0.2)';
ctx.fillRect(10,10,120,18);
ctx.fillStyle='#fff';
ctx.font='11px sans-serif';
ctx.fillText('Power: '+Math.round(power)+'%',16,24);

ctx.fillStyle='rgba(0,0,0,0.3)';
ctx.fillRect(12,30,100,6);
const grad2=ctx.createLinearGradient(12,0,112,0);
grad2.addColorStop(0,'#e74c3c');
grad2.addColorStop(0.5,'#f39c12');
grad2.addColorStop(1,'#2ecc71');
ctx.fillStyle=grad2;
ctx.fillRect(12,30,power,6);

if(gameOver){
ctx.fillStyle='rgba(0,0,0,0.6)';
ctx.fillRect(0,0,W,H);
ctx.fillStyle='#e74c3c';
ctx.font='bold 28px sans-serif';
ctx.textAlign='center';ctx.textBaseline='middle';
ctx.fillText('💀 GAME OVER',W/2,H/2-20);
ctx.fillStyle='#fff';
ctx.font='16px sans-serif';
ctx.fillText('Skor: '+score+' | Level: '+level,W/2,H/2+25);
ctx.fillStyle='var(--muted)';
ctx.font='13px sans-serif';
ctx.fillText('Klik 🔄 Ulang untuk main lagi',W/2,H/2+65);
}

if(birdCount<=0&&projectiles.length===0&&!gameOver){
ctx.fillStyle='rgba(0,0,0,0.4)';
ctx.fillRect(0,0,W,H);
ctx.fillStyle='#fff';
ctx.font='bold 22px sans-serif';
ctx.textAlign='center';ctx.textBaseline='middle';
ctx.fillText('🔄 Burung habis!',W/2,H/2-10);
ctx.fillStyle='var(--muted)';
ctx.font='14px sans-serif';
ctx.fillText('Klik 🔄 Ulang',W/2,H/2+30);
}

document.getElementById('score-display').textContent=score;
document.getElementById('birds-display').textContent=birdCount;
document.getElementById('targets-display').textContent=targets.filter(t=>t.alive).length;
}

function gameLoop(){
update();
render();
requestAnimationFrame(gameLoop);
}

canvas.addEventListener('click',(e)=>{
if(gameOver)return;
const rect=canvas.getBoundingClientRect();
const scaleX=canvas.width/rect.width;
const scaleY=canvas.height/rect.height;
const x=(e.clientX-rect.left)*scaleX;
const y=(e.clientY-rect.top)*scaleY;
if(x>birdX+30){
const dist=Math.sqrt((x-birdX)**2+(y-birdY)**2);
const pwr=Math.min(100,dist/3);
power=pwr;
}
});

document.getElementById('btn-shoot').addEventListener('click',()=>{
if(gameOver)return;
const pwr=power;
shootWithPower(pwr);
power=Math.max(10,power-10);
});

document.getElementById('btn-power').addEventListener('click',()=>{
power=Math.min(100,power+10);
});

document.getElementById('btn-reset').addEventListener('click',resetGame);

resizeCanvas();
resetGame();
window.addEventListener('resize',()=>{resizeCanvas();});
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
                                    messageText: 'Angry Birds Mini'
                                }
                            ],
                            unifiedResponse: {
                                data: Buffer.from(
                                    JSON.stringify({
                                        response_id: 'angrybirds2026',
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
        console.error('[ANGRYBIRD ERROR]', err);
        await m.reply('❌ Gagal mengirim game Angry Birds.');
    }
}

export { pluginConfig as config, handler };
