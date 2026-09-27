/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import te from '../../src/lib/elaina-error.js';

const pluginConfig = {
    name: 'mortalkombat',
    alias: ['mortal', 'mk'],
    category: 'game',
    description: 'Mortal Kombat mini - fight 1 vs 1!',
    usage: '',
    example: '.mk',
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
.card{width:100%;max-width:400px;}
.header{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid var(--line);gap:8px;}
.header__title{font-size:17px;font-weight:600;color:var(--ink);}
.header__sub{font-size:12px;color:var(--muted);}
.status{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;font-size:13px;gap:8px;}
.status__health{display:flex;gap:8px;width:100%;align-items:center;}
.status__health .hp-bar{flex:1;height:12px;background:#2a1a1a;border-radius:6px;overflow:hidden;border:1px solid #4a2a2a;}
.status__health .hp-fill{height:100%;transition:width 0.2s;}
.status__health .hp-fill.p1{background:linear-gradient(90deg,#ff6b6b,#ee5a24);}
.status__health .hp-fill.p2{background:linear-gradient(90deg,#4a7bec,#0652DD);}
.status__health .hp-label{font-size:11px;font-weight:700;min-width:40px;}
.board-wrap{position:relative;width:100%;aspect-ratio:16/10;background:#0a0a1a;border-radius:8px;overflow:hidden;border:2px solid var(--line-strong);}
canvas{width:100%;height:100%;display:block;cursor:pointer;touch-action:none;image-rendering:pixelated;}
.controls{margin-top:12px;display:flex;flex-direction:column;gap:6px;}
.controls-row{display:flex;gap:6px;justify-content:center;}
.controls button{border:none;border-radius:8px;padding:8px 0;font-size:13px;font-weight:700;color:#0b141a;cursor:pointer;font-family:inherit;background:var(--card-2);color:var(--ink);border:1px solid var(--line);flex:1;min-width:45px;}
.controls button:active{filter:brightness(.85);transform:scale(0.94);}
.btn-punch{background:linear-gradient(180deg,#ff6b6b,#ee5a24);color:#fff !important;}
.btn-kick{background:linear-gradient(180deg,#4a7bec,#0652DD);color:#fff !important;}
.btn-block{background:linear-gradient(180deg,#f9ca24,#f0932b);color:#fff !important;}
.btn-reset{background:var(--accent);color:#0b141a !important;border-color:var(--accent) !important;flex:2;}
</style>

<main class="stage">
<div class="card">
<div class="header">
<div class="header__title">⚔️ Mortal Kombat</div>
<div class="header__sub">fight!</div>
</div>
<div class="status">
<div class="status__health">
<span class="hp-label" id="p1-name">Player</span>
<div class="hp-bar"><div class="hp-fill p1" id="p1-hp" style="width:100%"></div></div>
<span class="hp-label" id="p2-name">AI</span>
<div class="hp-bar"><div class="hp-fill p2" id="p2-hp" style="width:100%"></div></div>
</div>
</div>
<div class="board-wrap">
<canvas id="board"></canvas>
</div>
<div class="controls">
<div class="controls-row">
<button class="btn-punch" id="btn-punch">👊 PUNCH</button>
<button class="btn-kick" id="btn-kick">🦵 KICK</button>
<button class="btn-block" id="btn-block">🛡️ BLOCK</button>
</div>
<div class="controls-row">
<button class="btn-reset" id="btn-reset">🔄 Reset Fight</button>
</div>
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

const fighters={
p1:{
x:60,y:0,w:30,h:50,
hp:100,maxHp:100,
attack:8,
defense:5,
speed:3,
blocking:false,
cooldown:0,
combo:0,
anim:'idle',
frame:0,
animTimer:0,
hit:false
},
p2:{
x:260,y:0,w:30,h:50,
hp:100,maxHp:100,
attack:7,
defense:4,
speed:2,
blocking:false,
cooldown:0,
combo:0,
anim:'idle',
frame:0,
animTimer:0,
hit:false
}
};

let groundY=0,gameOver=false,winner=null,round=1,message='',msgTimer=0;
let p1Action=null,p2Action=null,actionTimer=0;

function resetFight(){
fighters.p1.hp=100;fighters.p1.blocking=false;fighters.p1.cooldown=0;fighters.p1.combo=0;fighters.p1.anim='idle';fighters.p1.frame=0;fighters.p1.hit=false;
fighters.p2.hp=100;fighters.p2.blocking=false;fighters.p2.cooldown=0;fighters.p2.combo=0;fighters.p2.anim='idle';fighters.p2.frame=0;fighters.p2.hit=false;
groundY=H*0.78;
fighters.p1.y=groundY-50;
fighters.p2.y=groundY-50;
gameOver=false;winner=null;message='FIGHT!';msgTimer=60;
updateUI();
}

function updateUI(){
document.getElementById('p1-hp').style.width=(fighters.p1.hp/fighters.p1.maxHp*100)+'%';
document.getElementById('p2-hp').style.width=(fighters.p2.hp/fighters.p2.maxHp*100)+'%';
}

function getRandomAction(){
const actions=['punch','kick','block','punch','kick','punch'];
return actions[Math.floor(Math.random()*actions.length)];
}

function aiAction(){
if(gameOver||fighters.p2.cooldown>0)return;
const action=getRandomAction();
const hpPercent=fighters.p2.hp/fighters.p2.maxHp;
if(hpPercent<0.3&&Math.random()<0.5){
p2Action='block';
}else{
p2Action=action;
}
}

function playerAction(action){
if(gameOver||fighters.p1.cooldown>0)return;
p1Action=action;
}

function resolveActions(){
if(!p1Action&&!p2Action)return;

const p1Block=fighters.p1.blocking;
const p2Block=fighters.p2.blocking;
let p1Dmg=0,p2Dmg=0;

if(p1Action==='punch'){
if(p2Block){
fighters.p2.hp-=Math.floor(fighters.p1.attack*0.2);
fighters.p2.hit=true;
}else{
fighters.p2.hp-=fighters.p1.attack;
fighters.p2.hit=true;
}
fighters.p1.cooldown=10;
}

if(p1Action==='kick'){
if(p2Block){
fighters.p2.hp-=Math.floor(fighters.p1.attack*0.1);
}else{
fighters.p2.hp-=Math.floor(fighters.p1.attack*1.2);
}
fighters.p1.cooldown=15;
}

if(p2Action==='punch'){
if(p1Block){
fighters.p1.hp-=Math.floor(fighters.p2.attack*0.2);
}else{
fighters.p1.hp-=fighters.p2.attack;
}
fighters.p2.cooldown=10;
}

if(p2Action==='kick'){
if(p1Block){
fighters.p1.hp-=Math.floor(fighters.p2.attack*0.1);
}else{
fighters.p1.hp-=Math.floor(fighters.p2.attack*1.2);
}
fighters.p2.cooldown=15;
}

if(p1Action==='block'){fighters.p1.blocking=true;}
if(p2Action==='block'){fighters.p2.blocking=true;}

fighters.p1.hp=Math.max(0,fighters.p1.hp);
fighters.p2.hp=Math.max(0,fighters.p2.hp);

p1Action=null;p2Action=null;
actionTimer=0;
updateUI();

if(fighters.p1.hp<=0){gameOver=true;winner='AI';message='💀 AI WINS!';msgTimer=120;}
if(fighters.p2.hp<=0){gameOver=true;winner='Player';message='🏆 YOU WIN!';msgTimer=120;}
}

function update(){
if(gameOver){
msgTimer--;
if(msgTimer<=0){message='';}
return;
}

if(fighters.p1.cooldown>0)fighters.p1.cooldown--;
if(fighters.p2.cooldown>0)fighters.p2.cooldown--;

if(!fighters.p1.blocking)fighters.p1.blocking=false;
if(!fighters.p2.blocking)fighters.p2.blocking=false;

if(fighters.p1.hit){
fighters.p1.hit=false;
fighters.p1.anim='hit';
}
if(fighters.p2.hit){
fighters.p2.hit=false;
fighters.p2.anim='hit';
}

if(fighters.p1.anim==='hit'&&fighters.p1.animTimer>0)fighters.p1.animTimer--;
else if(fighters.p1.anim==='hit'){fighters.p1.anim='idle';fighters.p1.animTimer=0;}

if(fighters.p2.anim==='hit'&&fighters.p2.animTimer>0)fighters.p2.animTimer--;
else if(fighters.p2.anim==='hit'){fighters.p2.anim='idle';fighters.p2.animTimer=0;}

fighters.p1.frame++;
fighters.p2.frame++;

if(Math.random()<0.02&&!gameOver){
aiAction();
}
}

function drawPixel(x,y,size,color){
ctx.fillStyle=color;
ctx.fillRect(x,y,size,size);
}

function drawFighter(f,isPlayer){
const x=f.x,y=f.y,w=f.w,h=f.h;
const isHit=f.anim==='hit'&&f.animTimer>0;
const isBlock=f.blocking;

ctx.save();

if(isHit){
ctx.fillStyle='rgba(255,0,0,0.2)';
ctx.fillRect(x-5,y-5,w+10,h+10);
}

ctx.fillStyle='#1a1a2e';
ctx.fillRect(x-2,y-2,w+4,h+4);

const skin=isPlayer?'#e8b88a':'#d4a574';
ctx.fillStyle=skin;
ctx.fillRect(x+4,y+4,8,8);
ctx.fillRect(x+18,y+4,8,8);

ctx.fillStyle=isPlayer?'#2d3436':'#1a1a1a';
ctx.fillRect(x+4,y+12,8,10);
ctx.fillRect(x+18,y+12,8,10);

ctx.fillStyle=isPlayer?'#e74c3c':'#c0392b';
ctx.fillRect(x+2,y+22,26,16);

ctx.fillStyle=isPlayer?'#2980b9':'#2c3e50';
ctx.fillRect(x+6,y+38,6,10);
ctx.fillRect(x+18,y+38,6,10);

ctx.fillStyle=isPlayer?'#f1c40f':'#f39c12';
ctx.fillRect(x+10,y+20,10,4);

ctx.fillStyle='#fff';
ctx.fillRect(x+6,y+6,3,3);
ctx.fillRect(x+21,y+6,3,3);
ctx.fillStyle='#1a1a1a';
ctx.fillRect(x+7,y+7,1.5,1.5);
ctx.fillRect(x+22,y+7,1.5,1.5);

if(isBlock){
ctx.strokeStyle='#f9ca24';
ctx.lineWidth=3;
ctx.strokeRect(x-4,y-4,w+8,h+8);
ctx.fillStyle='rgba(249,202,36,0.15)';
ctx.fillRect(x-4,y-4,w+8,h+8);
}

if(f.cooldown>0){
ctx.fillStyle='rgba(255,255,255,0.2)';
ctx.fillRect(x,y,w,h);
}

ctx.restore();

if(f.anim==='idle'&&f.frame%30<15){
ctx.fillStyle='rgba(255,255,255,0.05)';
ctx.fillRect(x+2,y+h-4,4,2);
ctx.fillRect(x+w-6,y+h-4,4,2);
}
}

function drawGround(){
ctx.fillStyle='#1a1a2e';
ctx.fillRect(0,groundY+4,W,H-groundY-4);

ctx.fillStyle='#2d2d44';
for(let i=0;i<W;i+=20){
const offset=(i+Date.now()*0.02)%40;
ctx.fillRect(i-offset,groundY+6,10,2);
}

ctx.fillStyle='#3d3d5c';
ctx.fillRect(0,groundY,W,4);
}

function drawBg(){
const grad=ctx.createLinearGradient(0,0,0,groundY);
grad.addColorStop(0,'#0a0a1a');
grad.addColorStop(0.5,'#1a0a1a');
grad.addColorStop(1,'#2a1a1a');
ctx.fillStyle=grad;
ctx.fillRect(0,0,W,groundY);

ctx.fillStyle='rgba(255,200,50,0.05)';
ctx.fillRect(0,0,W,30);
ctx.fillStyle='rgba(255,200,50,0.03)';
ctx.fillRect(0,30,W,20);

ctx.fillStyle='rgba(255,255,255,0.02)';
for(let i=0;i<W;i+=60){
ctx.fillRect(i+Math.sin(i*0.02+Date.now()*0.001)*10,0,30,groundY);
}
}

function drawUI(){
if(message){
ctx.save();
ctx.fillStyle='rgba(0,0,0,0.5)';
const tw=ctx.measureText(message).width||200;
ctx.fillRect(W/2-tw/2-20,H/2-30,tw+40,50);
ctx.fillStyle=message.includes('WIN')?'#f1c40f':'#ff6b6b';
ctx.font='bold 24px sans-serif';
ctx.textAlign='center';ctx.textBaseline='middle';
ctx.fillText(message,W/2,H/2);
ctx.restore();
}
}

function render(){
ctx.clearRect(0,0,W,H);
drawBg();
drawGround();

drawFighter(fighters.p1,true);
drawFighter(fighters.p2,false);

ctx.fillStyle='rgba(255,255,255,0.1)';
ctx.fillRect(W/2-1,0,2,H);

ctx.fillStyle='#ffd93d';
ctx.font='10px sans-serif';
ctx.textAlign='center';
ctx.fillText('ROUND '+round,W/2,18);

drawUI();
}

function gameLoop(){
update();
render();
requestAnimationFrame(gameLoop);
}

document.getElementById('btn-punch').addEventListener('click',()=>{if(!gameOver)playerAction('punch');});
document.getElementById('btn-kick').addEventListener('click',()=>{if(!gameOver)playerAction('kick');});
document.getElementById('btn-block').addEventListener('click',()=>{if(!gameOver)playerAction('block');});
document.getElementById('btn-reset').addEventListener('click',resetFight);

document.addEventListener('keydown',(e)=>{
const k=e.key.toLowerCase();
if(k==='a'||k==='1'){e.preventDefault();if(!gameOver)playerAction('punch');}
if(k==='s'||k==='2'){e.preventDefault();if(!gameOver)playerAction('kick');}
if(k==='d'||k==='3'){e.preventDefault();if(!gameOver)playerAction('block');}
if(k==='r'){e.preventDefault();resetFight();}
});

resizeCanvas();
resetFight();
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
                                    messageText: 'Mortal Kombat'
                                }
                            ],
                            unifiedResponse: {
                                data: Buffer.from(
                                    JSON.stringify({
                                        response_id: 'mortalkombat2026',
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
        console.error('[MK ERROR]', err);
        await m.reply('❌ Gagal mengirim game Mortal Kombat.');
    }
}

export { pluginConfig as config, handler };
