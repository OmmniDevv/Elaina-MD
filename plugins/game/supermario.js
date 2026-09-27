/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import te from '../../src/lib/elaina-error.js';

const pluginConfig = {
    name: 'supermario',
    alias: ['mario'],
    category: 'game',
    description: 'Super Mario Bros mini - lompatin musuh & kumpulin koin!',
    usage: '',
    example: '.mario',
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
.board-wrap{position:relative;width:100%;aspect-ratio:16/10;background:#1a2b4d;border-radius:8px;overflow:hidden;border:1px solid var(--line);}
canvas{width:100%;height:100%;display:block;cursor:pointer;touch-action:none;}
.controls{margin-top:12px;display:flex;flex-direction:column;gap:8px;}
.controls-row{display:flex;gap:8px;justify-content:center;}
.controls button{border:none;border-radius:10px;padding:12px 0;font-size:16px;font-weight:700;color:#0b141a;cursor:pointer;font-family:inherit;letter-spacing:.3px;background:var(--card-2);color:var(--ink);border:1px solid var(--line);flex:1;min-width:50px;}
.controls button:active{filter:brightness(.85);transform:scale(0.95);}
.btn-jump{background:linear-gradient(180deg,#55b8ff,#1b7fe0);color:#fff !important;flex:2;}
.btn-left{background:linear-gradient(180deg,#f39c12,#d68910);color:#fff !important;}
.btn-right{background:linear-gradient(180deg,#f39c12,#d68910);color:#fff !important;}
.btn-reset{background:var(--accent);color:#0b141a !important;border-color:var(--accent) !important;flex:1;}
.btn-spawn{background:linear-gradient(180deg,#9b59b6,#8e44ad);color:#fff !important;flex:1;}
</style>

<main class="stage">
<div class="card">
<div class="header">
<div class="header__title">🍄 Super Mario</div>
<div class="header__sub">mini adventure</div>
</div>
<div class="status">
<div class="status__score">
<span>Koin <b id="coin-display">0</b></span>
<span>Skor <b id="score-display">0</b></span>
<span>Nyawa <b id="lives-display">3</b></span>
</div>
</div>
<div class="board-wrap">
<canvas id="board"></canvas>
</div>
<div class="controls">
<div class="controls-row">
<button class="btn-left" id="btn-left">◀ Kiri</button>
<button class="btn-jump" id="btn-jump">⬆ Lompat</button>
<button class="btn-right" id="btn-right">Kanan ▶</button>
</div>
<div class="controls-row">
<button class="btn-reset" id="btn-reset">🔄 Reset Game</button>
<button class="btn-spawn" id="btn-spawn">🏠 Ke Spawn</button>
</div>
</div>
</div>
</main>

<script>
const canvas=document.getElementById('board');
const ctx=canvas.getContext('2d');
let W=400,H=250,groundY=0,gravity=0.6,jumpPower=-11,moveSpeed=3.5;

function resizeCanvas(){
const rect=canvas.getBoundingClientRect();
W=canvas.width=Math.max(320,Math.floor(rect.width));
H=canvas.height=Math.max(200,Math.floor(rect.height));
groundY=H*0.78;
}

const player={
x:50,y:0,w:24,h:32,vy:0,grounded:false,dir:1,frame:0,frameTimer:0,spawnX:50
};

let coins=[],enemies=[],platforms=[],score=0,coinsCollected=0,lives=3,gameOver=false,started=false,scrollX=0,worldWidth=2400;
let keys={},gameLoopId=null;

function resetPlayer(){
player.x=player.spawnX;
player.y=groundY-player.h;
player.vy=0;
player.grounded=true;
player.dir=1;
player.frame=0;
}

function goToSpawn(){
if(gameOver)return;
player.x=player.spawnX;
player.y=groundY-player.h;
player.vy=0;
player.grounded=true;
scrollX=Math.max(0,player.x-W*0.3);
}

function initGame(){
coins=[];enemies=[];platforms=[];
score=0;coinsCollected=0;lives=3;gameOver=false;started=true;scrollX=0;
player.spawnX=50;
resetPlayer();

platforms.push({x:0,y:groundY-20,w:200,h:20});
platforms.push({x:250,y:groundY-60,w:80,h:16});
platforms.push({x:380,y:groundY-100,w:80,h:16});
platforms.push({x:510,y:groundY-60,w:80,h:16});
platforms.push({x:640,y:groundY-20,w:120,h:20});
platforms.push({x:800,y:groundY-70,w:80,h:16});
platforms.push({x:930,y:groundY-110,w:80,h:16});
platforms.push({x:1060,y:groundY-70,w:80,h:16});
platforms.push({x:1190,y:groundY-20,w:120,h:20});
platforms.push({x:1360,y:groundY-50,w:80,h:16});
platforms.push({x:1490,y:groundY-90,w:80,h:16});
platforms.push({x:1620,y:groundY-50,w:80,h:16});
platforms.push({x:1750,y:groundY-20,w:150,h:20});
platforms.push({x:1950,y:groundY-60,w:80,h:16});
platforms.push({x:2080,y:groundY-100,w:80,h:16});

const coinPositions=[
[120,groundY-50],[160,groundY-50],[200,groundY-50],
[270,groundY-90],[310,groundY-90],
[400,groundY-130],[440,groundY-130],
[530,groundY-90],[570,groundY-90],
[660,groundY-50],[700,groundY-50],[740,groundY-50],
[820,groundY-100],[860,groundY-100],
[950,groundY-140],[990,groundY-140],
[1080,groundY-100],[1120,groundY-100],
[1210,groundY-50],[1250,groundY-50],
[1380,groundY-80],[1420,groundY-80],
[1510,groundY-120],[1550,groundY-120],
[1640,groundY-80],[1680,groundY-80],
[1770,groundY-50],[1810,groundY-50],[1850,groundY-50],
[1970,groundY-90],[2010,groundY-90],
[2100,groundY-130],[2140,groundY-130]
];
coinPositions.forEach(p=>coins.push({x:p[0],y:p[1],w:16,h:16,collected:false}));

const enemyPositions=[
[180,groundY-20],[380,groundY-20],[550,groundY-20],
[720,groundY-20],[900,groundY-20],[1100,groundY-20],
[1300,groundY-20],[1500,groundY-20],[1700,groundY-20],
[1900,groundY-20],[2100,groundY-20]
];
enemyPositions.forEach(p=>enemies.push({x:p[0],y:p[1],w:28,h:28,dir:1,speed:1.2,alive:true}));

updateUI();
}

function updateUI(){
document.getElementById('coin-display').textContent=coinsCollected;
document.getElementById('score-display').textContent=score;
document.getElementById('lives-display').textContent=lives;
}

function jump(){
if(gameOver||!started)return;
if(player.grounded){
player.vy=jumpPower;
player.grounded=false;
}
}

function resetGame(){
if(gameLoopId){cancelAnimationFrame(gameLoopId);gameLoopId=null;}
initGame();
}

function checkCollisions(){
const px=player.x,py=player.y,pw=player.w,ph=player.h;

player.grounded=false;

for(const plat of platforms){
if(px+pw>plat.x+8&&px<plat.x+plat.w-8){
if(py+ph>plat.y&&py+ph<plat.y+plat.h+10&&player.vy>=0){
player.y=plat.y-ph;
player.vy=0;
player.grounded=true;
}
}
}

if(player.y+player.h>=groundY){
player.y=groundY-player.h;
player.vy=0;
player.grounded=true;
}

for(const coin of coins){
if(!coin.collected&&px+pw>coin.x+2&&px<coin.x+coin.w-2&&py+ph>coin.y+2&&py<coin.y+coin.h-2){
coin.collected=true;
coinsCollected++;
score+=10;
updateUI();
}
}

for(const enemy of enemies){
if(!enemy.alive)continue;
const ex=enemy.x+scrollX,ey=enemy.y;
if(px+pw>ex+4&&px<ex+enemy.w-4&&py+ph>ey+4&&py<ey+enemy.h-4){
if(player.vy>0&&py+ph-8<ey+4){
enemy.alive=false;
score+=20;
player.vy=-8;
updateUI();
}else{
lives--;
updateUI();
if(lives<=0){gameOver=true;return;}
resetPlayer();
}
}
}

if(player.x<0){player.x=0;}
if(player.x+player.w>worldWidth){player.x=worldWidth-player.w;}

if(player.y<0){player.y=0;player.vy=0;}
if(player.y+player.h>groundY+50){lives--;updateUI();if(lives<=0){gameOver=true;return;}resetPlayer();}
}

function update(){
if(gameOver||!started)return;

player.vy+=gravity;
player.y+=player.vy;

checkCollisions();

if(player.x>scrollX+W*0.3&&scrollX<worldWidth-W){
scrollX=Math.min(scrollX+moveSpeed,worldWidth-W);
}
if(player.x<scrollX+W*0.1&&scrollX>0){
scrollX=Math.max(scrollX-moveSpeed,0);
}

player.x=Math.max(0,Math.min(player.x,worldWidth-player.w));

const moveX=keys['ArrowRight']||keys['d']?moveSpeed:keys['ArrowLeft']||keys['a']?-moveSpeed:0;
if(moveX!==0){
player.x+=moveX;
player.dir=moveX>0?1:-1;
player.frameTimer++;
if(player.frameTimer>6){player.frame=(player.frame+1)%4;player.frameTimer=0;}
}else{
player.frame=0;
}

if(player.x<0)player.x=0;
if(player.x>worldWidth-player.w)player.x=worldWidth-player.w;

updateUI();
}

function drawCloud(x,y,s){
ctx.fillStyle='rgba(255,255,255,0.85)';
ctx.beginPath();
ctx.ellipse(x,y,s*1.2,s*0.6,0,0,Math.PI*2);
ctx.ellipse(x+s*0.8,y-s*0.3,s*0.8,s*0.5,0,0,Math.PI*2);
ctx.ellipse(x-s*0.7,y-s*0.2,s*0.7,s*0.45,0,0,Math.PI*2);
ctx.fill();
}

function drawMario(x,y,dir,frame){
const sx=x, sy=y;
ctx.save();

ctx.fillStyle='#e52521';
ctx.fillRect(sx+4,sy,16,8);
ctx.fillRect(sx, sy+8,24,12);

ctx.fillStyle='#f5cba7';
ctx.fillRect(sx+4,sy+6,6,6);
ctx.fillRect(sx+14,sy+6,6,6);

ctx.fillStyle='#1a1a1a';
ctx.fillRect(sx+6,sy+8,3,3);
ctx.fillRect(sx+15,sy+8,3,3);

ctx.fillStyle='#f5cba7';
ctx.fillRect(sx+18,sy+6,4,4);

ctx.fillStyle='#c0392b';
ctx.fillRect(sx+2,sy+16,5,8);
ctx.fillRect(sx+17,sy+16,5,8);

ctx.fillStyle='#f1c40f';
ctx.fillRect(sx+6,sy+22,12,6);

ctx.fillStyle='#2980b9';
ctx.fillRect(sx+8,sy+28,8,4);

if(frame!==0){
const offset=frame%2===0?1:-1;
ctx.fillStyle='#2c3e50';
ctx.fillRect(sx+4+offset*2,sy+24,6,8);
ctx.fillRect(sx+14+offset*2,sy+24,6,8);
}

ctx.restore();
}

function drawEnemy(x,y,dir){
ctx.save();
ctx.fillStyle='#e74c3c';
ctx.fillRect(x+4,y,20,18);
ctx.fillRect(x,y+8,28,10);

ctx.fillStyle='#c0392b';
ctx.fillRect(x+6,y+14,6,4);
ctx.fillRect(x+16,y+14,6,4);

ctx.fillStyle='#fff';
ctx.fillRect(x+6,y+4,5,5);
ctx.fillRect(x+17,y+4,5,5);

ctx.fillStyle='#1a1a1a';
ctx.fillRect(x+7,y+5,3,3);
ctx.fillRect(x+18,y+5,3,3);

ctx.restore();
}

function drawCoin(x,y){
ctx.save();
ctx.fillStyle='#f1c40f';
ctx.beginPath();
ctx.arc(x+8,y+8,8,0,Math.PI*2);
ctx.fill();
ctx.fillStyle='#f39c12';
ctx.beginPath();
ctx.arc(x+8,y+8,5,0,Math.PI*2);
ctx.fill();
ctx.fillStyle='#fff';
ctx.beginPath();
ctx.arc(x+6,y+6,2,0,Math.PI*2);
ctx.fill();
ctx.restore();
}

function render(){
ctx.clearRect(0,0,W,H);

const g=ctx.createLinearGradient(0,0,0,H);
g.addColorStop(0,'#5dade2');
g.addColorStop(0.7,'#85c1e9');
g.addColorStop(1,'#a9cce3');
ctx.fillStyle=g;
ctx.fillRect(0,0,W,H);

drawCloud(80+scrollX*0.1,30,18);
drawCloud(220+scrollX*0.1,50,22);
drawCloud(380+scrollX*0.1,25,16);
drawCloud(550+scrollX*0.1,45,20);
drawCloud(720+scrollX*0.1,35,17);
drawCloud(900+scrollX*0.1,55,23);

ctx.fillStyle='#27ae60';
ctx.fillRect(0,groundY,W,H-groundY+5);

ctx.fillStyle='#2ecc71';
ctx.fillRect(0,groundY,W,6);

ctx.fillStyle='#1a5276';
for(let x=0;x<W+40;x+=40){
const wx=(x+scrollX*0.5)%80;
ctx.fillRect(x-20+wx,groundY+15,8,8);
ctx.fillRect(x+wx,groundY+25,6,6);
}

for(const plat of platforms){
const px=plat.x-scrollX;
if(px>-plat.w&&px<W){
ctx.fillStyle='#8B6914';
ctx.fillRect(px,plat.y,plat.w,plat.h);
ctx.fillStyle='#A0522D';
ctx.fillRect(px+4,plat.y-3,plat.w-8,4);
}
}

for(const coin of coins){
if(!coin.collected){
const cx=coin.x-scrollX;
if(cx>-20&&cx<W)drawCoin(cx,coin.y);
}
}

for(const enemy of enemies){
if(enemy.alive){
const ex=enemy.x-scrollX;
if(ex>-40&&ex<W)drawEnemy(ex,enemy.y,enemy.dir);
}
}

const px=player.x-scrollX;
if(px>-50&&px<W+50)drawMario(px,player.y,player.dir,player.frame);

if(gameOver){
ctx.fillStyle='rgba(0,0,0,0.6)';
ctx.fillRect(0,0,W,H);
ctx.fillStyle='#e74c3c';
ctx.font='bold 32px sans-serif';
ctx.textAlign='center';ctx.textBaseline='middle';
ctx.fillText('💀 GAME OVER',W/2,H/2-20);
ctx.fillStyle='#fff';
ctx.font='18px sans-serif';
ctx.fillText('Skor: '+score+' | Koin: '+coinsCollected,W/2,H/2+30);
ctx.fillStyle='var(--muted)';
ctx.font='14px sans-serif';
ctx.fillText('Klik 🔄 Reset Game untuk main lagi',W/2,H/2+70);
}

document.getElementById('coin-display').textContent=coinsCollected;
document.getElementById('score-display').textContent=score;
document.getElementById('lives-display').textContent=lives;
}

function gameLoop(){
update();
render();
gameLoopId=requestAnimationFrame(gameLoop);
}

canvas.addEventListener('click',jump);
canvas.addEventListener('touchstart',(e)=>{e.preventDefault();jump();},{passive:false});

document.getElementById('btn-jump').addEventListener('click',jump);
document.getElementById('btn-reset').addEventListener('click',resetGame);
document.getElementById('btn-spawn').addEventListener('click',goToSpawn);

const leftBtn=document.getElementById('btn-left');
const rightBtn=document.getElementById('btn-right');

leftBtn.addEventListener('mousedown',()=>{keys['ArrowLeft']=true;});
leftBtn.addEventListener('mouseup',()=>{keys['ArrowLeft']=false;});
leftBtn.addEventListener('mouseleave',()=>{keys['ArrowLeft']=false;});
leftBtn.addEventListener('touchstart',(e)=>{e.preventDefault();keys['ArrowLeft']=true;});
leftBtn.addEventListener('touchend',()=>{keys['ArrowLeft']=false;});

rightBtn.addEventListener('mousedown',()=>{keys['ArrowRight']=true;});
rightBtn.addEventListener('mouseup',()=>{keys['ArrowRight']=false;});
rightBtn.addEventListener('mouseleave',()=>{keys['ArrowRight']=false;});
rightBtn.addEventListener('touchstart',(e)=>{e.preventDefault();keys['ArrowRight']=true;});
rightBtn.addEventListener('touchend',()=>{keys['ArrowRight']=false;});

document.addEventListener('keydown',(e)=>{
keys[e.key]=true;
if(e.key===' '||e.key==='ArrowUp'||e.key==='w'){e.preventDefault();jump();}
});
document.addEventListener('keyup',(e)=>{keys[e.key]=false;});

resizeCanvas();
initGame();
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
                                    messageText: 'Super Mario Mini'
                                }
                            ],
                            unifiedResponse: {
                                data: Buffer.from(
                                    JSON.stringify({
                                        response_id: 'supermario2026',
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
        console.error('[SUPERMARIO ERROR]', err);
        await m.reply('❌ Gagal mengirim game Super Mario.');
    }
}

export { pluginConfig as config, handler };
