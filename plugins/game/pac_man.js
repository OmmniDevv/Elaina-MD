/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import te from '../../src/lib/elaina-error.js';

const pluginConfig = {
    name: 'pacman',
    alias: ['pac'],
    category: 'game',
    description: 'Pac-Man classic - makan titik & hindari hantu!',
    usage: '',
    example: '.pacman',
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
.status__score{display:flex;gap:16px;color:var(--muted);font-size:12px;}
.status__score b{color:var(--ink);}
.board-wrap{position:relative;width:100%;aspect-ratio:1/1;background:#0a0a1a;border-radius:8px;overflow:hidden;border:2px solid var(--line-strong);}
canvas{width:100%;height:100%;display:block;cursor:pointer;touch-action:none;image-rendering:pixelated;}
.controls{margin-top:12px;display:flex;flex-direction:column;gap:6px;}
.controls-row{display:flex;gap:6px;justify-content:center;}
.controls button{border:none;border-radius:8px;padding:10px 0;font-size:18px;font-weight:700;color:#0b141a;cursor:pointer;font-family:inherit;background:var(--card-2);color:var(--ink);border:1px solid var(--line);flex:1;min-width:50px;}
.controls button:active{filter:brightness(.85);transform:scale(0.94);}
.btn-up{background:linear-gradient(180deg,#6c5ce7,#4834d4);color:#fff !important;}
.btn-down{background:linear-gradient(180deg,#6c5ce7,#4834d4);color:#fff !important;}
.btn-left{background:linear-gradient(180deg,#6c5ce7,#4834d4);color:#fff !important;}
.btn-right{background:linear-gradient(180deg,#6c5ce7,#4834d4);color:#fff !important;}
.btn-reset{background:var(--accent);color:#0b141a !important;border-color:var(--accent) !important;flex:2;}
</style>

<main class="stage">
<div class="card">
<div class="header">
<div class="header__title">🟡 Pac-Man</div>
<div class="header__sub">classic maze</div>
</div>
<div class="status">
<div class="status__score">
<span>Skor <b id="score-display">0</b></span>
<span>Level <b id="level-display">1</b></span>
<span>Nyawa <b id="lives-display">3</b></span>
</div>
</div>
<div class="board-wrap">
<canvas id="board"></canvas>
</div>
<div class="controls">
<div class="controls-row">
<button class="btn-up" id="btn-up">⬆</button>
</div>
<div class="controls-row">
<button class="btn-left" id="btn-left">⬅</button>
<button class="btn-reset" id="btn-reset">🔄 Reset</button>
<button class="btn-right" id="btn-right">➡</button>
</div>
<div class="controls-row">
<button class="btn-down" id="btn-down">⬇</button>
</div>
</div>
</div>
</main>

<script>
const canvas=document.getElementById('board');
const ctx=canvas.getContext('2d');
let W=400,H=400,cellSize=0,cols=21,rows=21;

function resizeCanvas(){
const rect=canvas.getBoundingClientRect();
W=canvas.width=Math.max(320,Math.floor(rect.width));
H=canvas.height=Math.max(320,Math.floor(rect.height));
cellSize=W/21;
}

const mapTemplate=[
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,1,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,0,0,1],
[1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
[1,0,1,0,1,0,1,1,0,1,1,1,1,1,0,1,0,1,0,0,1],
[1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,1,0,1,0,1,1,0,1,1,1,1,1,0,1,0,1,0,0,1],
[1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
[1,0,1,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,1,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,0,0,1],
[1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
[1,0,1,0,1,0,1,1,0,1,1,1,1,1,0,1,0,1,0,0,1],
[1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,1,0,1,0,1,1,0,1,1,1,1,1,0,1,0,1,0,0,1],
[1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
[1,0,1,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

let map=[],dots=[],powerPellets=[],ghosts=[],pacman={},score=0,lives=3,level=1,gameOver=false;
let ghostFrightened=false,frightenTimer=0,direction='right',nextDirection='right';
let ghostColors=['#ff3b30','#ff9500','#34c759','#ff2d55'];
let ghostNames=['Blinky','Pinky','Inky','Clyde'];
let ghostModes=['chase','scatter','frightened'];
let ghostMode='scatter',modeTimer=0,ghostSpeed=1.2;
let animFrame=0,dotTotal=0,dotEaten=0;

function initMap(){
map=mapTemplate.map(row=>[...row]);
dots=[];powerPellets=[];
for(let r=0;r<rows;r++){
for(let c=0;c<cols;c++){
if(map[r][c]===0){
const isPower=(r===1&&c===1)||(r===1&&c===19)||(r===19&&c===1)||(r===19&&c===19);
if(isPower){
powerPellets.push({r,c});
map[r][c]=2;
}else{
dots.push({r,c,collected:false});
}
}
}
}
dotTotal=dots.length;
dotEaten=0;
}

function initGhosts(){
const spawn=[10,9];
ghosts=[
{r:spawn[0],c:spawn[1]-1,color:ghostColors[0],dir:'left',scatter:{r:1,c:1},scatterTimer:0},
{r:spawn[0],c:spawn[1]+1,color:ghostColors[1],dir:'right',scatter:{r:1,c:19},scatterTimer:0},
{r:spawn[0]-1,c:spawn[1],color:ghostColors[2],dir:'up',scatter:{r:19,c:1},scatterTimer:0},
{r:spawn[0]+1,c:spawn[1],color:ghostColors[3],dir:'down',scatter:{r:19,c:19},scatterTimer:0}
];
ghosts.forEach(g=>{
g.origR=g.r;g.origC=g.c;
g.frightened=false;
g.inHouse=true;
g.exitTimer=60+Math.random()*120;
});
ghosts[0].inHouse=false;
}

function resetPacman(){
pacman={r:10,c:10,dir:'right',mouth:0,open:true,dying:false,deathTimer:0};
direction='right';nextDirection='right';
}

function resetGame(){
score=0;lives=3;level=1;gameOver=false;ghostFrightened=false;frightenTimer=0;ghostMode='scatter';modeTimer=0;
initMap();
initGhosts();
resetPacman();
updateUI();
}

function nextLevel(){
level++;
initMap();
initGhosts();
resetPacman();
ghostSpeed=Math.min(2,ghostSpeed+0.1);
updateUI();
}

function updateUI(){
document.getElementById('score-display').textContent=score;
document.getElementById('level-display').textContent=level;
document.getElementById('lives-display').textContent=lives;
}

function getCell(r,c){
if(r<0||r>=rows||c<0||c>=cols)return 1;
return map[r][c];
}

function isWalkable(r,c){
if(r<0||r>=rows||c<0||c>=cols)return false;
return map[r][c]!==1;
}

function pacmanMove(){
if(gameOver||pacman.dying)return;
const dirs={up:[-1,0],down:[1,0],left:[0,-1],right:[0,1]};
const [dr,dc]=dirs[nextDirection]||[0,0];
if(isWalkable(pacman.r+dr,pacman.c+dc)){
direction=nextDirection;
pacman.r+=dr;pacman.c+=dc;
}else{
const [cr,cc]=dirs[direction]||[0,0];
if(isWalkable(pacman.r+cr,pacman.c+cc)){
pacman.r+=cr;pacman.c+=cc;
}
}

const cell=map[pacman.r][pacman.c];
if(cell===0){
const idx=dots.findIndex(d=>d.r===pacman.r&&d.c===pacman.c&&!d.collected);
if(idx!==-1){
dots[idx].collected=true;
score+=10;
dotEaten++;
updateUI();
}
}
if(cell===2){
const idx=powerPellets.findIndex(p=>p.r===pacman.r&&p.c===pacman.c);
if(idx!==-1){
powerPellets.splice(idx,1);
score+=50;
ghostFrightened=true;
frightenTimer=400;
updateUI();
}
}

if(pacman.r===10&&pacman.c===0){
pacman.c=20;
}
if(pacman.r===10&&pacman.c===20){
pacman.c=0;
}
}

function ghostMove(ghost){
if(ghost.inHouse){
ghost.exitTimer--;
if(ghost.exitTimer<=0){
ghost.inHouse=false;
ghost.r=10;ghost.c=10;
}
return;
}
if(ghost.frightened){
const dirs=['up','down','left','right'];
const shuffled=dirs.sort(()=>Math.random()-0.5);
for(const d of shuffled){
const [dr,dc]=getDir(d);
if(isWalkable(ghost.r+dr,ghost.c+dc)&&!isGhostAt(ghost.r+dr,ghost.c+dc,ghost)){
ghost.dir=d;
break;
}
}
const [dr,dc]=getDir(ghost.dir);
if(isWalkable(ghost.r+dr,ghost.c+dc)&&!isGhostAt(ghost.r+dr,ghost.c+dc,ghost)){
ghost.r+=dr;ghost.c+=dc;
}
return;
}

const target=ghostMode==='chase'?{r:pacman.r,c:pacman.c}:ghost.scatter;
const dirs=['up','down','left','right'];
let bestDir=ghost.dir;
let bestDist=Infinity;
for(const d of dirs){
const [dr,dc]=getDir(d);
const nr=ghost.r+dr,nc=ghost.c+dc;
if(!isWalkable(nr,nc)||isGhostAt(nr,nc,ghost))continue;
if(d===getOpposite(ghost.dir))continue;
const dist=(nr-target.r)**2+(nc-target.c)**2;
if(dist<bestDist){
bestDist=dist;bestDir=d;
}
}
if(bestDir===ghost.dir){
const [dr,dc]=getDir(ghost.dir);
if(isWalkable(ghost.r+dr,ghost.c+dc)&&!isGhostAt(ghost.r+dr,ghost.c+dc,ghost)){
ghost.r+=dr;ghost.c+=dc;
}else{
const fallback=dirs.find(d=>{
const [dr2,dc2]=getDir(d);
return isWalkable(ghost.r+dr2,ghost.c+dc2)&&!isGhostAt(ghost.r+dr2,ghost.c+dc2,ghost)&&d!==getOpposite(ghost.dir);
});
if(fallback){
const [dr2,dc2]=getDir(fallback);
ghost.r+=dr2;ghost.c+=dc2;
ghost.dir=fallback;
}
}
}else{
ghost.dir=bestDir;
const [dr,dc]=getDir(ghost.dir);
ghost.r+=dr;ghost.c+=dc;
}

if(ghost.r===10&&ghost.c===0){ghost.c=20;}
if(ghost.r===10&&ghost.c===20){ghost.c=0;}
}

function isGhostAt(r,c,exclude){
return ghosts.some(g=>g!==exclude&&g.r===r&&g.c===c&&!g.inHouse);
}

function getDir(dir){
const map2={up:[-1,0],down:[1,0],left:[0,-1],right:[0,1]};
return map2[dir]||[0,0];
}

function getOpposite(dir){
const opp={up:'down',down:'up',left:'right',right:'left'};
return opp[dir]||dir;
}

function checkCollisions(){
for(const ghost of ghosts){
if(ghost.inHouse)continue;
if(ghost.r===pacman.r&&ghost.c===pacman.c){
if(ghostFrightened){
ghost.frightened=false;
ghost.inHouse=true;
ghost.exitTimer=60;
score+=200;
updateUI();
}else{
pacmanDie();
return;
}
}
}
}

function pacmanDie(){
pacman.dying=true;
pacman.deathTimer=60;
lives--;
updateUI();
if(lives<=0){
gameOver=true;
}
}

function update(){
if(gameOver)return;

if(pacman.dying){
pacman.deathTimer--;
if(pacman.deathTimer<=0){
pacman.dying=false;
if(lives>0){resetPacman();}
}
return;
}

modeTimer--;
if(modeTimer<=0){
if(ghostMode==='scatter'){
ghostMode='chase';
modeTimer=400;
}else{
ghostMode='scatter';
modeTimer=200;
}
}

if(ghostFrightened){
frightenTimer--;
if(frightenTimer<=0){
ghostFrightened=false;
ghosts.forEach(g=>g.frightened=false);
}
}

pacmanMove();
for(const ghost of ghosts){
ghostMove(ghost);
}
checkCollisions();

if(pacman.mouth%2===0)pacman.open=!pacman.open;
pacman.mouth++;

if(dotEaten>=dotTotal){
nextLevel();
}
updateUI();
}

function drawPixel(x,y,size,color){
ctx.fillStyle=color;
ctx.fillRect(x,y,size,size);
}

function drawMaze(){
for(let r=0;r<rows;r++){
for(let c=0;c<cols;c++){
const x=c*cellSize,y=r*cellSize;
if(map[r][c]===1){
ctx.fillStyle='#1a1a3a';
ctx.fillRect(x,y,cellSize,cellSize);
ctx.strokeStyle='#2a2a5a';
ctx.lineWidth=1;
ctx.strokeRect(x,y,cellSize,cellSize);
}else{
ctx.fillStyle='#0a0a1a';
ctx.fillRect(x,y,cellSize,cellSize);
}
}
}
}

function drawDots(){
for(const dot of dots){
if(dot.collected)continue;
const x=dot.c*cellSize+cellSize/2;
const y=dot.r*cellSize+cellSize/2;
ctx.fillStyle='#ffb8a0';
ctx.beginPath();
ctx.arc(x,y,cellSize*0.08,0,Math.PI*2);
ctx.fill();
}
for(const pp of powerPellets){
const x=pp.c*cellSize+cellSize/2;
const y=pp.r*cellSize+cellSize/2;
ctx.fillStyle='#ff6b6b';
ctx.beginPath();
ctx.arc(x,y,cellSize*0.2,0,Math.PI*2);
ctx.fill();
ctx.fillStyle='#ff9f43';
ctx.beginPath();
ctx.arc(x,y,cellSize*0.1,0,Math.PI*2);
ctx.fill();
}
}

function drawPacman(){
if(pacman.dying){
const x=pacman.c*cellSize+cellSize/2;
const y=pacman.r*cellSize+cellSize/2;
const r=cellSize*0.4;
const progress=1-pacman.deathTimer/60;
ctx.fillStyle='#ffd93d';
ctx.beginPath();
ctx.arc(x,y,r*progress,0,Math.PI*2);
ctx.fill();
return;
}
const x=pacman.c*cellSize+cellSize/2;
const y=pacman.r*cellSize+cellSize/2;
const r=cellSize*0.4;
const mouthAngle=pacman.open?0.25:0.05;
const dirs={up:-Math.PI/2,down:Math.PI/2,left:Math.PI,right:0};
const start=dirs[direction]||0;
ctx.fillStyle='#ffd93d';
ctx.beginPath();
ctx.arc(x,y,r,start+mouthAngle,start+Math.PI*2-mouthAngle);
ctx.lineTo(x,y);
ctx.closePath();
ctx.fill();
ctx.fillStyle='#1a1a1a';
const eyeX=x+Math.cos(start-0.2)*r*0.4;
const eyeY=y+Math.sin(start-0.2)*r*0.4;
ctx.beginPath();
ctx.arc(eyeX,eyeY,r*0.15,0,Math.PI*2);
ctx.fill();
}

function drawGhost(ghost){
if(ghost.inHouse)return;
const x=ghost.c*cellSize+cellSize/2;
const y=ghost.r*cellSize+cellSize/2;
const r=cellSize*0.4;
const color=ghost.frightened?'#4a6fa5':ghost.color;
const color2=ghost.frightened?'#6b8cae':ghost.color;
ctx.fillStyle=color;
ctx.beginPath();
ctx.arc(x,y,r,Math.PI,0);
ctx.fill();
ctx.fillRect(x-r,y,r*2,r);
ctx.fillStyle='#0a0a1a';
for(let i=-1;i<=1;i+=2){
const wx=x+i*r*0.35;
const wy=y+r*0.4;
const wave=Math.sin(animFrame*0.1+ghost.r)*3;
ctx.fillRect(wx-3,wy+wave,6,8);
}
ctx.fillStyle='#fff';
ctx.beginPath();
ctx.arc(x-r*0.35,y-r*0.2,r*0.2,0,Math.PI*2);
ctx.fill();
ctx.beginPath();
ctx.arc(x+r*0.35,y-r*0.2,r*0.2,0,Math.PI*2);
ctx.fill();
ctx.fillStyle='#1a1a3a';
ctx.beginPath();
ctx.arc(x-r*0.25,y-r*0.15,r*0.08,0,Math.PI*2);
ctx.fill();
ctx.beginPath();
ctx.arc(x+r*0.45,y-r*0.15,r*0.08,0,Math.PI*2);
ctx.fill();
if(ghost.frightened){
ctx.fillStyle='#ff6b6b';
ctx.font='12px sans-serif';
ctx.textAlign='center';ctx.textBaseline='middle';
ctx.fillText('😱',x,y+r*0.5);
}
}

function render(){
ctx.clearRect(0,0,W,H);
drawMaze();
drawDots();
for(const ghost of ghosts)drawGhost(ghost);
drawPacman();

if(gameOver){
ctx.fillStyle='rgba(0,0,0,0.7)';
ctx.fillRect(0,0,W,H);
ctx.fillStyle='#ff3b30';
ctx.font='bold 32px sans-serif';
ctx.textAlign='center';ctx.textBaseline='middle';
ctx.fillText('💀 GAME OVER',W/2,H/2-30);
ctx.fillStyle='#fff';
ctx.font='18px sans-serif';
ctx.fillText('Skor: '+score,W/2,H/2+20);
ctx.fillStyle='var(--muted)';
ctx.font='14px sans-serif';
ctx.fillText('Klik 🔄 Reset',W/2,H/2+70);
}

animFrame++;
}

function gameLoop(){
update();
render();
requestAnimationFrame(gameLoop);
}

const dirBtns={
'up':()=>{nextDirection='up';},
'down':()=>{nextDirection='down';},
'left':()=>{nextDirection='left';},
'right':()=>{nextDirection='right';}
};

document.getElementById('btn-up').addEventListener('click',()=>dirBtns.up());
document.getElementById('btn-down').addEventListener('click',()=>dirBtns.down());
document.getElementById('btn-left').addEventListener('click',()=>dirBtns.left());
document.getElementById('btn-right').addEventListener('click',()=>dirBtns.right());
document.getElementById('btn-reset').addEventListener('click',resetGame);

document.addEventListener('keydown',(e)=>{
const k=e.key;
if(k==='ArrowUp'){e.preventDefault();dirBtns.up();}
if(k==='ArrowDown'){e.preventDefault();dirBtns.down();}
if(k==='ArrowLeft'){e.preventDefault();dirBtns.left();}
if(k==='ArrowRight'){e.preventDefault();dirBtns.right();}
if(k===' '){e.preventDefault();}
});

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
                                    messageText: 'Pac-Man Classic'
                                }
                            ],
                            unifiedResponse: {
                                data: Buffer.from(
                                    JSON.stringify({
                                        response_id: 'pacman2026',
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
        console.error('[PACMAN ERROR]', err);
        await m.reply('❌ Gagal mengirim game Pac-Man.');
    }
}

export { pluginConfig as config, handler };
