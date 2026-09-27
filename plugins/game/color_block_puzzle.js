/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import te from '../../src/lib/elaina-error.js';

const pluginConfig = {
    name: 'colorblock',
    alias: ['colorblockpuzzle', 'cbp'],
    category: 'game',
    description: 'Puzzle kotak warna - geser balok kiri/kanan, samakan warna biar hancur!',
    usage: '',
    example: '.colorblock',
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
.board-wrap{position:relative;width:100%;aspect-ratio:9/13;background:var(--cell-bg);border-radius:8px;overflow:hidden;border:1px solid var(--line);}
canvas{width:100%;height:100%;display:block;cursor:pointer;touch-action:none;}
.controls{margin-top:12px;display:flex;flex-direction:column;gap:8px;}
.controls-row{display:flex;gap:8px;justify-content:center;}
.controls button{border:none;border-radius:10px;padding:12px 0;font-size:16px;font-weight:700;color:#0b141a;cursor:pointer;font-family:inherit;letter-spacing:.3px;background:var(--card-2);color:var(--ink);border:1px solid var(--line);flex:1;min-width:50px;}
.controls button:active{filter:brightness(.85);transform:scale(0.95);}
.btn-left{background:linear-gradient(180deg,#f39c12,#d68910);color:#fff !important;}
.btn-right{background:linear-gradient(180deg,#f39c12,#d68910);color:#fff !important;}
.btn-drop{background:linear-gradient(180deg,#55b8ff,#1b7fe0);color:#fff !important;flex:2;}
.btn-reset{background:var(--accent);color:#0b141a !important;border-color:var(--accent) !important;flex:1;}
</style>

<main class="stage">
<div class="card">
<div class="header">
<div class="header__title">🧩 Color Block Puzzle</div>
<div class="header__sub">samakan warna, hancurkan!</div>
</div>
<div class="status">
<div class="status__score">
<span>Skor <b id="score-display">0</b></span>
<span>Level <b id="level-display">1</b></span>
<span>Sisa <b id="lives-display">3</b></span>
</div>
</div>
<div class="board-wrap">
<canvas id="board"></canvas>
</div>
<div class="controls">
<div class="controls-row">
<button class="btn-left" id="btn-left">◀ Kiri</button>
<button class="btn-drop" id="btn-drop">⬇ Jatuhkan</button>
<button class="btn-right" id="btn-right">Kanan ▶</button>
</div>
<div class="controls-row">
<button class="btn-reset" id="btn-reset">🔄 Reset Game</button>
</div>
</div>
</div>
</main>

<script>
const canvas=document.getElementById('board');
const ctx=canvas.getContext('2d');
let W=270,H=390;

const COLS=7;
const ROWS=10;
let cellSize=0;

const COLORS=['#e74c3c','#3498db','#2ecc71','#f1c40f','#9b59b6','#e67e22'];

function resizeCanvas(){
const rect=canvas.getBoundingClientRect();
W=canvas.width=Math.max(240,Math.floor(rect.width));
H=canvas.height=Math.max(340,Math.floor(rect.height));
cellSize=W/COLS;
}

let grid=[];
let activeCol=3;
let activeColor=0;
let nextColor=0;
let score=0,level=1,lives=3,gameOver=false,started=false;
let dropTimer=0,dropInterval=90;
let animParticles=[];
let gameLoopId=null;

function randColor(){return Math.floor(Math.random()*COLORS.length);}

function initGame(){
grid=[];
for(let r=0;r<ROWS;r++){
grid.push(new Array(COLS).fill(-1));
}
const startRows=3;
for(let r=ROWS-startRows;r<ROWS;r++){
for(let c=0;c<COLS;c++){
if(Math.random()<0.75){
grid[r][c]=randColor();
}
}
}
score=0;level=1;lives=3;gameOver=false;started=true;
dropInterval=90;dropTimer=0;
activeCol=Math.floor(COLS/2);
activeColor=randColor();
nextColor=randColor();
animParticles=[];
updateUI();
}

function updateUI(){
document.getElementById('score-display').textContent=score;
document.getElementById('level-display').textContent=level;
document.getElementById('lives-display').textContent=lives;
}

function resetGame(){
if(gameLoopId){cancelAnimationFrame(gameLoopId);gameLoopId=null;}
initGame();
}

function moveLeft(){
if(gameOver||!started)return;
if(activeCol>0)activeCol--;
}
function moveRight(){
if(gameOver||!started)return;
if(activeCol<COLS-1)activeCol++;
}

function findLandingRow(col){
for(let r=0;r<ROWS;r++){
if(grid[r][col]!==-1){
return r-1;
}
}
return ROWS-1;
}

function spawnParticles(col,row,color){
const cx=col*cellSize+cellSize/2;
const cy=row*cellSize+cellSize/2;
for(let i=0;i<8;i++){
const ang=(Math.PI*2*i)/8;
animParticles.push({
x:cx,y:cy,
vx:Math.cos(ang)*3,vy:Math.sin(ang)*3,
life:20,color:COLORS[color]
});
}
}

function clearMatches(col,row){
let cleared=[[col,row]];
let visited=new Set([col+','+row]);
const targetColor=grid[row][col];
let queue=[[col,row]];
while(queue.length){
const [c,r]=queue.shift();
const neighbors=[[c-1,r],[c+1,r],[c,r-1],[c,r+1]];
for(const [nc,nr] of neighbors){
if(nc<0||nc>=COLS||nr<0||nr>=ROWS)continue;
const key=nc+','+nr;
if(visited.has(key))continue;
if(grid[nr][nc]===targetColor){
visited.add(key);
cleared.push([nc,nr]);
queue.push([nc,nr]);
}
}
}
if(cleared.length>=2){
for(const [c,r] of cleared){
spawnParticles(c,r,grid[r][c]);
grid[r][c]=-1;
}
score+=cleared.length*15;
updateUI();
return true;
}
return false;
}

function applyGravity(){
for(let c=0;c<COLS;c++){
let write=ROWS-1;
for(let r=ROWS-1;r>=0;r--){
if(grid[r][c]!==-1){
grid[write][c]=grid[r][c];
if(write!==r)grid[r][c]=-1;
write--;
}
}
for(let r=write;r>=0;r--){
grid[r][c]=-1;
}
}
}

function dropActive(){
if(gameOver||!started)return;
const landRow=findLandingRow(activeCol);
if(landRow<0){
lives--;
updateUI();
if(lives<=0){
gameOver=true;
return;
}
for(let c=0;c<COLS;c++){
for(let r=0;r<3;r++){
grid[r][c]=-1;
}
}
activeColor=nextColor;
nextColor=randColor();
return;
}
grid[landRow][activeCol]=activeColor;
let matched=clearMatches(activeCol,landRow);
if(matched){
applyGravity();
let chainMatched=true;
let safety=0;
while(chainMatched&&safety<20){
chainMatched=false;
safety++;
for(let r=0;r<ROWS;r++){
for(let c=0;c<COLS;c++){
if(grid[r][c]!==-1){
if(clearMatches(c,r)){
chainMatched=true;
applyGravity();
}
}
}
}
}
}
activeColor=nextColor;
nextColor=randColor();

if(score>level*200){
level++;
dropInterval=Math.max(30,dropInterval-8);
}
}

function update(){
if(gameOver||!started)return;

for(let i=animParticles.length-1;i>=0;i--){
const p=animParticles[i];
p.x+=p.vx;p.y+=p.vy;p.life--;
if(p.life<=0)animParticles.splice(i,1);
}

dropTimer++;
if(dropTimer>=dropInterval){
dropTimer=0;
dropActive();
}

for(let c=0;c<COLS;c++){
if(grid[0][c]!==-1&&grid[1]&&grid[1][c]!==-1&&grid[2]&&grid[2][c]!==-1){
let colFull=true;
for(let r=0;r<3;r++){
if(grid[r][c]===-1){colFull=false;break;}
}
if(colFull){
gameOver=true;
return;
}
}
}
}

function drawBlock(x,y,size,color,pulse){
ctx.save();
const pad=2;
const s=pulse?size*0.92:size-pad*2;
const offset=(size-s)/2;
const grad=ctx.createLinearGradient(x+offset,y+offset,x+offset,y+offset+s);
grad.addColorStop(0,color);
grad.addColorStop(1,shadeColor(color,-25));
ctx.fillStyle=grad;
roundRect(x+offset,y+offset,s,s,6);
ctx.fill();
ctx.strokeStyle='rgba(255,255,255,0.25)';
ctx.lineWidth=1.5;
roundRect(x+offset+1,y+offset+1,s-2,s-2,5);
ctx.stroke();
ctx.restore();
}

function shadeColor(hex,percent){
let r=parseInt(hex.slice(1,3),16);
let g=parseInt(hex.slice(3,5),16);
let b=parseInt(hex.slice(5,7),16);
r=Math.max(0,Math.min(255,r+percent));
g=Math.max(0,Math.min(255,g+percent));
b=Math.max(0,Math.min(255,b+percent));
return 'rgb('+r+','+g+','+b+')';
}

function roundRect(x,y,w,h,r){
ctx.beginPath();
ctx.moveTo(x+r,y);
ctx.arcTo(x+w,y,x+w,y+h,r);
ctx.arcTo(x+w,y+h,x,y+h,r);
ctx.arcTo(x,y+h,x,y,r);
ctx.arcTo(x,y,x+w,y,r);
ctx.closePath();
}

function render(){
ctx.clearRect(0,0,W,H);

ctx.fillStyle='#0b141a';
ctx.fillRect(0,0,W,H);

for(let r=0;r<ROWS;r++){
for(let c=0;c<COLS;c++){
ctx.strokeStyle='rgba(255,255,255,0.04)';
ctx.lineWidth=1;
ctx.strokeRect(c*cellSize,r*cellSize,cellSize,cellSize);
if(grid[r][c]!==-1){
drawBlock(c*cellSize,r*cellSize,cellSize,COLORS[grid[r][c]],false);
}
}
}

if(started&&!gameOver){
const landRow=findLandingRow(activeCol);
if(landRow>=0){
ctx.save();
ctx.globalAlpha=0.25;
drawBlock(activeCol*cellSize,landRow*cellSize,cellSize,COLORS[activeColor],false);
ctx.restore();
}
const bob=Math.sin(Date.now()/200)*2;
drawBlock(activeCol*cellSize,2+bob,cellSize,COLORS[activeColor],true);

ctx.save();
ctx.fillStyle='var(--muted)';
ctx.font='10px sans-serif';
ctx.textAlign='left';
ctx.fillText('berikutnya',6,H-8);
ctx.restore();
const nx=W-cellSize*0.7-6;
drawBlock(nx,H-cellSize*0.9,cellSize*0.7,COLORS[nextColor],false);
}

for(const p of animParticles){
ctx.save();
ctx.globalAlpha=Math.max(0,p.life/20);
ctx.fillStyle=p.color;
ctx.beginPath();
ctx.arc(p.x,p.y,3,0,Math.PI*2);
ctx.fill();
ctx.restore();
}

if(gameOver){
ctx.fillStyle='rgba(0,0,0,0.65)';
ctx.fillRect(0,0,W,H);
ctx.fillStyle='#e74c3c';
ctx.font='bold 22px sans-serif';
ctx.textAlign='center';ctx.textBaseline='middle';
ctx.fillText('💀 GAME OVER',W/2,H/2-30);
ctx.fillStyle='#fff';
ctx.font='15px sans-serif';
ctx.fillText('Skor: '+score+' | Level: '+level,W/2,H/2+10);
ctx.fillStyle='#8696a0';
ctx.font='12px sans-serif';
ctx.fillText('Klik 🔄 Reset Game untuk main lagi',W/2,H/2+42);
}

document.getElementById('score-display').textContent=score;
document.getElementById('level-display').textContent=level;
document.getElementById('lives-display').textContent=lives;
}

function gameLoop(){
update();
render();
gameLoopId=requestAnimationFrame(gameLoop);
}

canvas.addEventListener('click',(e)=>{
const rect=canvas.getBoundingClientRect();
const x=(e.clientX-rect.left)*(W/rect.width);
const col=Math.floor(x/cellSize);
if(col<activeCol)moveLeft();
else if(col>activeCol)moveRight();
else dropActive();
});

document.getElementById('btn-left').addEventListener('click',moveLeft);
document.getElementById('btn-right').addEventListener('click',moveRight);
document.getElementById('btn-drop').addEventListener('click',dropActive);
document.getElementById('btn-reset').addEventListener('click',resetGame);

document.addEventListener('keydown',(e)=>{
if(e.key==='ArrowLeft'){e.preventDefault();moveLeft();}
if(e.key==='ArrowRight'){e.preventDefault();moveRight();}
if(e.key===' '||e.key==='ArrowDown'){e.preventDefault();dropActive();}
});

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
                                    messageText: 'Color Block Puzzle'
                                }
                            ],
                            unifiedResponse: {
                                data: Buffer.from(
                                    JSON.stringify({
                                        response_id: 'colorblock2026',
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
        console.error('[COLORBLOCK ERROR]', err);
        await m.reply('❌ Gagal mengirim game Color Block Puzzle.');
    }
}

export { pluginConfig as config, handler };
