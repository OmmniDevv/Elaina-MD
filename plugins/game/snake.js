/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

/**
 * ╔══════════════
 * ║  ------ QIRO AI --------
 * ║ WA Bot • by Awang OfficiaL   
 * ╚══════════════
 * 
 * @author Awang Official
 * @website awangofc.my.id
 * @wa  wa.me/556184127506
 * @source Qiro Ai - No Comot, No Ganti Nama
 */

'use strict'

const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<meta name="theme-color" content="#111314">
<title>Qiro Ai Ular Rimba</title>
<style>
:root{--bg:#111314;--wood:#d4b48f;--text:#ece7de;--dim:#95a1a8;--panel:#232d32;--panel2:#1a2225;--line:#3b4b54;--green:#8fb17a;--green2:#5c8650;--red:#e56a62;--gold:#d8b77f}
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{min-height:100%;background:radial-gradient(900px 500px at 50% -10%,#2e3a3e 0%,var(--bg) 68%);color:var(--text);font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif}
body{display:flex;justify-content:center;align-items:center;padding:max(10px,env(safe-area-inset-top)) max(10px,env(safe-area-inset-right)) max(12px,env(safe-area-inset-bottom)) max(10px,env(safe-area-inset-left));overflow-x:hidden;touch-action:manipulation}
.app{width:min(100%,540px);margin:auto}
.console{width:100%;background:linear-gradient(180deg,#303b42,#1d2529);border:1px solid #42525b;border-radius:26px;padding:12px;box-shadow:0 30px 80px #000a,inset 0 1px 0 #ffffff14}
.head{display:flex;align-items:center;justify-content:space-between;gap:10px;background:#181e21;border:1px solid #344047;border-radius:15px;padding:9px 10px;margin-bottom:9px}
.brand{display:flex;align-items:center;gap:9px;min-width:0}.logo{width:38px;height:38px;flex:none;display:grid;place-items:center;border-radius:10px;background:radial-gradient(120% 120% at 30% 20%,#e9c9a0,#8d6e4a);color:#241a0b;font-size:21px;font-weight:950;box-shadow:0 4px 0 #5a3f28}.brandText{min-width:0}.title{font-family:Georgia,serif;font-size:16px;font-weight:900;letter-spacing:.2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sub{margin-top:2px;color:var(--dim);font-size:8px;letter-spacing:.35px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.chips{display:grid;grid-template-columns:repeat(2,minmax(54px,1fr));gap:6px;flex:none}.chip{min-width:54px;padding:5px 7px;text-align:center;background:#1c2225;border:1px solid #35444c;border-radius:9px}.chip b{display:block;color:var(--dim);font-size:6.5px;letter-spacing:.13em}.chip span{display:block;margin-top:2px;color:var(--wood);font-size:13px;font-weight:900;line-height:1}
.arena{position:relative;width:100%;padding:7px;border:1px solid #2f3d44;border-radius:17px;background:#11171a;box-shadow:inset 0 12px 28px #000d;overflow:hidden}.canvasWrap{position:relative;width:100%;aspect-ratio:1/1;border-radius:11px;overflow:hidden;background:#1a2225}.canvasWrap canvas{display:block;width:100%;height:100%;background:#1a2225;image-rendering:auto;touch-action:none;user-select:none}.hint{position:absolute;left:9px;right:9px;top:9px;display:flex;justify-content:space-between;gap:8px;pointer-events:none}.badge{padding:5px 7px;border-radius:999px;background:#10181bd9;border:1px solid #ffffff12;color:#dce6e1;font-size:6.7px;font-weight:900;letter-spacing:.04em}.badge.gold{color:var(--wood)}
.overlay{position:absolute;inset:7px;border-radius:11px;display:grid;place-items:center;background:#0a0e0fcc;backdrop-filter:blur(10px);opacity:0;pointer-events:none;transition:opacity .2s ease}.overlay.show{opacity:1;pointer-events:auto}.modal{width:min(84%,320px);padding:20px 16px;text-align:center;border:1px solid #4d5e68;border-radius:16px;background:linear-gradient(180deg,#35444d,#242d32);box-shadow:0 18px 40px #0008}.modalIcon{font-size:30px;line-height:1}.modal h2{margin-top:7px;font-family:Georgia,serif;font-size:21px}.modal p{margin-top:5px;color:var(--dim);font-size:9px;line-height:1.45}.modal .miniRow{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:10px}.mini{padding:7px;border:1px solid #41515a;border-radius:8px;background:#1b2428}.mini b{display:block;color:var(--wood);font-size:13px}.mini span{display:block;margin-top:2px;color:var(--dim);font-size:6.4px;letter-spacing:.04em;text-transform:uppercase}
.ctrl{margin-top:9px;padding:10px;border:1px solid #3b4b54;border-radius:16px;background:linear-gradient(180deg,#28343a,#1f282d)}.ctrlTop{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}.ctrlTop b{font-size:7px;letter-spacing:.13em;color:var(--dim)}.ctrlTop b:last-child{color:var(--wood)}
.actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin-bottom:9px}.btn{min-height:41px;border:1px solid #53636a;border-radius:10px;background:linear-gradient(180deg,#3e4e56,#2b363c);color:var(--text);font:900 8px system-ui;letter-spacing:.04em;box-shadow:0 4px 0 #13191d,inset 0 1px 0 #ffffff1a;touch-action:manipulation;user-select:none}.btn.primary{background:linear-gradient(180deg,#9fc08b,#5c8650);border-color:#89aa78;color:#0f1a0e}.btn.active{transform:translateY(3px);box-shadow:0 1px 0 #13191d}.btn:focus-visible{outline:2px solid var(--wood);outline-offset:2px}
.dpadWrap{display:flex;justify-content:center}.dpad{position:relative;width:min(55vw,230px);height:min(55vw,230px);min-width:182px;min-height:182px;max-width:230px;max-height:230px;border-radius:50%;border:1px solid #3a4a53;background:radial-gradient(100% 100% at 50% 45%,#202a2f,#151c1f);box-shadow:inset 0 8px 20px #000b;touch-action:none}.pad{position:absolute;width:29%;height:29%;min-width:52px;min-height:52px;max-width:68px;max-height:68px;border:1px solid #5a6d79;border-radius:17px;display:grid;place-items:center;background:linear-gradient(180deg,#404f58,#28333a);color:#e3ebee;font-size:20px;font-weight:900;box-shadow:0 7px 0 #131a1e,0 12px 20px #0006,inset 0 1px 0 #ffffff1f;touch-action:manipulation;user-select:none;transition:transform .05s ease,background .05s ease}.pad.up{top:4.3%;left:50%;transform:translateX(-50%)}.pad.down{bottom:4.3%;left:50%;transform:translateX(-50%)}.pad.left{left:4.3%;top:50%;transform:translateY(-50%)}.pad.right{right:4.3%;top:50%;transform:translateY(-50%)}.pad.active{background:linear-gradient(180deg,#4a5d69,#323f47)}.pad.up.active,.pad.down.active{transform:translateX(-50%) translateY(4px) scale(.97)}.pad.left.active,.pad.right.active{transform:translateY(-50%) translateY(4px) scale(.97)}.centerDot{position:absolute;left:50%;top:50%;width:22%;height:22%;min-width:42px;min-height:42px;max-width:52px;max-height:52px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(100% at 30% 30%,#d4b48f,#7a5a36);border:1px solid #a68660;box-shadow:0 5px 0 #4a3a27,inset 0 1px 0 #ffffff80}
.footer{display:flex;justify-content:space-between;gap:8px;margin-top:7px;padding:0 3px;color:#6f7e84;font-size:6.5px}.footer span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.footer kbd{padding:2px 4px;border:1px solid #37464d;border-radius:4px;background:#131a1d;color:#97a5aa;font:700 6px system-ui}
@media(max-width:380px){body{padding:7px}.console{padding:9px;border-radius:22px}.head{padding:8px;margin-bottom:7px}.logo{width:34px;height:34px;font-size:18px}.title{font-size:14px}.sub{font-size:7px}.chip{min-width:48px}.chip b{font-size:5.8px}.chip span{font-size:11px}.ctrl{padding:8px}.actions{gap:5px}.btn{min-height:38px;font-size:7px}.dpad{width:205px;height:205px}}
@media(min-width:700px){body{padding-top:20px;padding-bottom:20px}.console{padding:14px;border-radius:28px}}
</style>
</head>
<body>
<div class="app">
  <div class="console">
    <div class="head">
      <div class="brand">
        <div class="logo">S</div>
        <div class="brandText"><div class="title">ULAR RIMBA</div><div class="sub">QIRO AI MINI GAME</div></div>
      </div>
      <div class="chips">
        <div class="chip"><b>SKOR</b><span id="score">0</span></div>
        <div class="chip"><b>LEVEL</b><span id="level">1</span></div>
      </div>
    </div>
    <div class="arena">
      <div class="canvasWrap"><canvas id="game" width="720" height="720"></canvas>
        <div class="hint"><span class="badge" id="stateBadge">SIAP</span><span class="badge gold" id="bestBadge">BEST 0</span></div>
        <div class="overlay" id="overlay"><div class="modal"><div class="modalIcon" id="modalIcon">🐍</div><h2 id="modalTitle">Ular Rimba</h2><p id="modalText">Tekan MULAI untuk berburu.</p><div class="miniRow"><div class="mini"><b id="modalScore">0</b><span>Skor</span></div><div class="mini"><b id="modalBest">0</b><span>Best</span></div></div></div></div>
      </div>
    </div>
    <div class="ctrl">
      <div class="ctrlTop"><b>◈ KONTROL</b><b>© AWANG OFFICIAL</b></div>
      <div class="actions"><button class="btn primary" id="startBtn" type="button">▶ MULAI</button><button class="btn" id="resetBtn" type="button">↻ ULANG</button></div>
      <div class="dpadWrap"><div class="dpad" id="dpad"><button class="pad up" data-dir="up" type="button" aria-label="Atas">▲</button><button class="pad down" data-dir="down" type="button" aria-label="Bawah">▼</button><button class="pad left" data-dir="left" type="button" aria-label="Kiri">◀</button><button class="pad right" data-dir="right" type="button" aria-label="Kanan">▶</button><div class="centerDot"></div></div></div>
      <div class="footer"><span>Geser layar atau gunakan tombol arah</span><span><kbd>WASD</kbd> <kbd>←↑↓→</kbd> <kbd>SPACE</kbd></span></div>
    </div>
  </div>
</div>
<script>
'use strict';
(()=>{
const canvas=document.getElementById('game'),ctx=canvas.getContext('2d',{alpha:false});
const scoreEl=document.getElementById('score'),levelEl=document.getElementById('level'),stateBadge=document.getElementById('stateBadge'),bestBadge=document.getElementById('bestBadge');
const overlay=document.getElementById('overlay'),modalIcon=document.getElementById('modalIcon'),modalTitle=document.getElementById('modalTitle'),modalText=document.getElementById('modalText'),modalScore=document.getElementById('modalScore'),modalBest=document.getElementById('modalBest');
const startBtn=document.getElementById('startBtn'),resetBtn=document.getElementById('resetBtn');
const GRID=20,CELL=canvas.width/GRID,BASE_SPEED=145,MIN_SPEED=78,LEVEL_SCORE=40;
let snake=[],prevSnake=[],dir={x:1,y:0},nextDir={x:1,y:0},inputQueue=[],fruit=null,score=0,best=0,running=false,paused=false,gameOver=false,speed=BASE_SPEED,accumulator=0,lastTime=0,visualAngle=0,targetAngle=0,bodyAngles=[],particles=[],tongue=0,pulse=0,swipeStart=null,trail=[],visualHead={x:10,y:10},lastTrailPoint={x:10,y:10};
const pattern=document.createElement('canvas');pattern.width=40;pattern.height=20;const pctx=pattern.getContext('2d');pctx.strokeStyle='rgba(0,0,0,.18)';pctx.lineWidth=.8;for(let x=0;x<40;x+=10){pctx.beginPath();pctx.moveTo(x,0);pctx.lineTo(x+5,10);pctx.lineTo(x+10,0);pctx.stroke();pctx.beginPath();pctx.moveTo(x,10);pctx.lineTo(x+5,20);pctx.lineTo(x+10,10);pctx.stroke()}const scaleTex=ctx.createPattern(pattern,'repeat');
try{best=Number(localStorage.getItem('qiro_ai_snake_best')||0)||0}catch{}
function cloneSnake(a){return a.map(s=>({x:s.x,y:s.y}))}
function safeBestSave(){try{localStorage.setItem('qiro_ai_snake_best',String(best))}catch{}}
function wrapDelta(d){if(d>GRID/2)return d-GRID;if(d<-GRID/2)return d+GRID;return d}
function normalizeCoord(v){return((v%GRID)+GRID)%GRID}
function spawnFruit(){let f,guard=0;do{f={x:Math.floor(Math.random()*GRID),y:Math.floor(Math.random()*GRID),type:Math.random()<.7?(Math.random()<.6?'apple':'banana'):'shroom'};guard++}while(snake.some(s=>s.x===f.x&&s.y===f.y)&&guard<500);return f}
function updateUi(){scoreEl.textContent=score;levelEl.textContent=Math.floor(score/LEVEL_SCORE)+1;bestBadge.textContent='BEST '+best;stateBadge.textContent=gameOver?'K.O':paused?'JEDA':running?'BERBURU':'SIAP';startBtn.textContent=gameOver?'▶ MULAI':paused?'▶ LANJUT':running?'Ⅱ JEDA':'▶ MULAI';modalScore.textContent=score;modalBest.textContent=best}
function show(title,text,icon='🐍'){modalIcon.textContent=icon;modalTitle.textContent=title;modalText.textContent=text;modalScore.textContent=score;modalBest.textContent=best;overlay.classList.add('show');updateUi()}
function hide(){overlay.classList.remove('show')}
function reset(){snake=[{x:10,y:10},{x:9,y:10},{x:8,y:10}];prevSnake=cloneSnake(snake);dir={x:1,y:0};nextDir={x:1,y:0};inputQueue=[];fruit=spawnFruit();score=0;speed=BASE_SPEED;accumulator=0;running=false;paused=false;gameOver=false;visualAngle=0;targetAngle=0;bodyAngles=[0,0,0];particles=[];tongue=0;visualHead={x:10,y:10};trail=[{x:10,y:10},{x:9.2,y:10},{x:8.4,y:10},{x:7.6,y:10}];lastTrailPoint={x:10,y:10};hide();updateUi();draw(0)}
function start(){if(gameOver){reset()}if(running)return;paused=false;running=true;hide();lastTime=performance.now();accumulator=0;updateUi()}
function togglePause(){if(gameOver){reset();start();return}if(!running){start();return}paused=!paused;if(!paused){lastTime=performance.now();accumulator=0;hide()}else show('Jeda','Tekan LANJUT untuk kembali berburu.','⏸️');updateUi()}
function endGame(){if(gameOver)return;gameOver=true;running=false;paused=false;if(score>best){best=score;safeBestSave()}stateBadge.textContent='K.O';show('Ular Tumbang','Skor '+score+' • Best '+best+' • Tekan ULANG.','💥')}
function setDirection(x,y){const last=inputQueue.length?inputQueue[inputQueue.length-1]:nextDir;if(last.x===-x&&last.y===-y)return;if(last.x===x&&last.y===y)return;if(inputQueue.length<4)inputQueue.push({x,y});targetAngle=Math.atan2(y,x);if(!running&&!gameOver)start()}
function logicTick(){prevSnake=cloneSnake(snake);if(inputQueue.length){nextDir=inputQueue.shift()}dir=nextDir;targetAngle=Math.atan2(dir.y,dir.x);let h={x:snake[0].x+dir.x,y:snake[0].y+dir.y};if(h.x<0)h.x=GRID-1;if(h.x>=GRID)h.x=0;if(h.y<0)h.y=GRID-1;if(h.y>=GRID)h.y=0;const tailCanMove=h.x===snake[snake.length-1]?.x&&h.y===snake[snake.length-1]?.y;const bodyHit=snake.some((s,i)=>i<snake.length-1&&!tailCanMove&&s.x===h.x&&s.y===h.y)||snake.slice(0,-1).some(s=>s.x===h.x&&s.y===h.y);if(bodyHit){endGame();return}snake.unshift(h);bodyAngles.unshift(targetAngle);if(h.x===fruit.x&&h.y===fruit.y){const gain=fruit.type==='apple'?10:fruit.type==='banana'?20:50;score+=gain;tongue=10;burst(h.x*CELL+CELL/2,h.y*CELL+CELL/2,fruit.type);fruit=spawnFruit();speed=Math.max(MIN_SPEED,BASE_SPEED-Math.floor(score/50)*4);if(score>best){best=score;safeBestSave()}}else{snake.pop();bodyAngles.pop()}updateUi()}
function burst(x,y,type){for(let i=0;i<14;i++){const a=Math.random()*Math.PI*2,v=1.4+Math.random()*3.2;particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-1.2,life:20+Math.random()*10,max:30,type})}}
function unwrapTarget(prev,curr){let d=curr-prev;if(d>GRID/2)curr-=GRID;if(d<-GRID/2)curr+=GRID;return curr}
function trailPointAt(distance){if(!trail.length)return{x:visualHead.x,y:visualHead.y};let remain=distance;for(let i=0;i<trail.length-1;i++){const a=trail[i],b=trail[i+1];const dx=wrapDelta(b.x-a.x),dy=wrapDelta(b.y-a.y);const len=Math.hypot(dx,dy);if(len<=0)continue;if(remain<=len){const q=remain/len;return{x:normalizeCoord(a.x+dx*q),y:normalizeCoord(a.y+dy*q)}}remain-=len}const z=trail[trail.length-1];return{x:normalizeCoord(z.x),y:normalizeCoord(z.y)}}
function drawWrappedSegment(x,y,r,i,angle,alpha=1){const cx=x*CELL+CELL/2,cy=y*CELL+CELL/2,canvasSize=canvas.width,extent=r*1.45+2,wrapPx=GRID*CELL;for(let ox=-1;ox<=1;ox++){for(let oy=-1;oy<=1;oy++){const px=cx+ox*wrapPx,py=cy+oy*wrapPx;if(px+extent<0||px-extent>canvasSize||py+extent<0||py-extent>canvasSize)continue;snakeDraw(px,py,r,i,angle,alpha)}}}
function angleBetween(a,b,fallback=0){const dx=wrapDelta(b.x-a.x),dy=wrapDelta(b.y-a.y);return Math.hypot(dx,dy)>.001?Math.atan2(dy,dx):fallback}
function snakeDraw(x,y,r,i,angle,alpha=1){ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.rotate(angle);ctx.fillStyle='rgba(0,0,0,.38)';ctx.beginPath();ctx.ellipse(3,7,r,r*.6,0,0,Math.PI*2);ctx.fill();const grad=ctx.createLinearGradient(-r,-r*.8,r,r*.8);if(i===0){grad.addColorStop(0,'#e2f0c8');grad.addColorStop(.35,'#8fb17a');grad.addColorStop(1,'#1e2f18')}else{const sh=Math.max(.62,1-i*.02);grad.addColorStop(0,'rgba('+Math.round(110*sh)+','+Math.round(150*sh)+','+Math.round(90*sh)+',1)');grad.addColorStop(.5,'rgba(65,95,52,1)');grad.addColorStop(1,'rgba(28,42,22,1)')}ctx.fillStyle=grad;ctx.beginPath();ctx.ellipse(0,0,r*1.22,r*.9,0,0,Math.PI*2);ctx.fill();if(scaleTex){ctx.fillStyle=scaleTex;ctx.globalAlpha=alpha*.32;ctx.beginPath();ctx.ellipse(0,0,r*1.15,r*.82,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=alpha}ctx.fillStyle='rgba(230,214,160,.2)';ctx.beginPath();for(let xx=-r*1.1;xx<r*1.1;xx+=4)ctx.rect(xx,r*.32+Math.sin(xx*.8+i)*1.2,2.5,2);ctx.fill();if(i&&i%3===0){ctx.fillStyle='rgba(12,22,10,.48)';ctx.beginPath();ctx.ellipse(0,0,6,4.5,0,0,Math.PI*2);ctx.fill()}if(i===0){ctx.fillStyle='#0e1710';ctx.beginPath();ctx.ellipse(r*.35,-r*.42,3.8,5.2,0,0,Math.PI*2);ctx.ellipse(r*.35,r*.42,3.8,5.2,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ffeb3b';ctx.beginPath();ctx.arc(r*.58,-r*.42,1.4,0,Math.PI*2);ctx.arc(r*.58,r*.42,1.4,0,Math.PI*2);ctx.fill();ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(r*.35,-r*.42,1.1,2.4,0,0,Math.PI*2);ctx.ellipse(r*.35,r*.42,1.1,2.4,0,0,Math.PI*2);ctx.fill();if(tongue>0){ctx.strokeStyle='#ff3434';ctx.lineWidth=2.2;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(r*1.18,0);ctx.lineTo(r*1.18+11,-3);ctx.moveTo(r*1.18,0);ctx.lineTo(r*1.18+11,3);ctx.stroke()}}ctx.fillStyle='rgba(255,255,255,.17)';ctx.beginPath();ctx.ellipse(-r*.28,-r*.35,r*.55,r*.28,0,0,Math.PI*2);ctx.fill();ctx.restore()}
function drawFruit(){const fx=fruit.x*CELL+CELL/2,fy=fruit.y*CELL+CELL/2,p=.8+Math.sin(performance.now()/250)*.08;ctx.fillStyle='rgba(0,0,0,.45)';ctx.beginPath();ctx.ellipse(fx+3,fy+10,10,5,0,0,Math.PI*2);ctx.fill();const fg=ctx.createRadialGradient(fx-4,fy-6,2,fx,fy,14);if(fruit.type==='apple'){fg.addColorStop(0,'#ffb2b2');fg.addColorStop(1,'#8f1d1d')}else if(fruit.type==='banana'){fg.addColorStop(0,'#fff2a0');fg.addColorStop(1,'#b78a00')}else{fg.addColorStop(0,'#c5e8b0');fg.addColorStop(1,'#314d26')}ctx.save();ctx.translate(fx,fy);ctx.scale(p,p);ctx.fillStyle=fg;ctx.beginPath();if(fruit.type==='banana'){ctx.ellipse(0,0,14,9,-.32,0,Math.PI*2);ctx.fill()}else{ctx.arc(0,0,12,0,Math.PI*2);ctx.fill()}if(fruit.type==='apple'){ctx.fillStyle='#3c2918';ctx.fillRect(-1,-14,3,5)}if(fruit.type==='shroom'){ctx.fillStyle='#5b7440';ctx.fillRect(-1,-14,2,6)}ctx.restore()}
function draw(t){ctx.fillStyle='#1b2225';ctx.fillRect(0,0,canvas.width,canvas.height);for(let y=0;y<GRID;y++)for(let x=0;x<GRID;x++){ctx.fillStyle=(x+y)%2?'#1e272b':'#1b2225';ctx.fillRect(x*CELL,y*CELL,CELL,CELL)}drawFruit();const headPrev=prevSnake[0]||snake[0];const headCurr=snake[0];let tx=unwrapTarget(headPrev.x,headCurr.x),ty=unwrapTarget(headPrev.y,headCurr.y);visualHead={x:normalizeCoord(headPrev.x+(tx-headPrev.x)*t),y:normalizeCoord(headPrev.y+(ty-headPrev.y)*t)};if(Math.hypot(wrapDelta(visualHead.x-lastTrailPoint.x),wrapDelta(visualHead.y-lastTrailPoint.y))>=.035){trail.unshift({x:visualHead.x,y:visualHead.y});lastTrailPoint={x:visualHead.x,y:visualHead.y}}const maxTrail=Math.max(24,Math.ceil(snake.length*CELL*.92/.6)+12);if(trail.length>maxTrail)trail.length=maxTrail;for(let i=snake.length-1;i>=0;i--){const p=trailPointAt(i*.92);const q=trailPointAt(Math.max(0,i*.92-.55));const ang=i===0?visualAngle:angleBetween(p,q,bodyAngles[i]??visualAngle);drawWrappedSegment(p.x,p.y,CELL*.46,i,ang,1)}if(isFinite(t))for(const p of particles){p.x+=p.vx;p.y+=p.vy;p.vy+=.14;p.life-=1;ctx.globalAlpha=Math.max(0,p.life/p.max);ctx.fillStyle=p.type==='apple'?'#ff6b6b':p.type==='banana'?'#ffd166':'#8fb17a';ctx.beginPath();ctx.arc(p.x,p.y,3.6,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1}particles=particles.filter(p=>p.life>0);if(tongue>0&&running)tongue--}
function frame(now){requestAnimationFrame(frame);if(!lastTime)lastTime=now;const dt=Math.min(40,Math.max(0,now-lastTime));lastTime=now;pulse=now;if(running&&!paused&&!gameOver){accumulator+=dt;while(accumulator>=speed){logicTick();accumulator-=speed;if(gameOver)break}let d=targetAngle-visualAngle;while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;const turnEase=1-Math.exp(-dt*.032);visualAngle+=d*turnEase;for(let i=1;i<bodyAngles.length;i++){let q=bodyAngles[i-1]-bodyAngles[i];while(q>Math.PI)q-=Math.PI*2;while(q<-Math.PI)q+=Math.PI*2;bodyAngles[i]+=q*(1-Math.exp(-dt*.028))}}draw(running&&!paused&&!gameOver?Math.min(1,accumulator/speed):0)}
function bind(){startBtn.addEventListener('pointerdown',e=>{e.preventDefault();togglePause()},{passive:false});resetBtn.addEventListener('pointerdown',e=>{e.preventDefault();reset();show('Siap','Tekan MULAI untuk memulai.','🐍')},{passive:false});document.querySelectorAll('.pad').forEach(btn=>{const press=e=>{e.preventDefault();btn.classList.add('active');const d=btn.dataset.dir;if(d==='up')setDirection(0,-1);else if(d==='down')setDirection(0,1);else if(d==='left')setDirection(-1,0);else setDirection(1,0)};const release=()=>btn.classList.remove('active');btn.addEventListener('pointerdown',press,{passive:false});btn.addEventListener('pointerup',release);btn.addEventListener('pointercancel',release);btn.addEventListener('pointerleave',release)});document.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(k===' '){e.preventDefault();togglePause();return}if(k==='r'){e.preventDefault();reset();show('Siap','Tekan MULAI untuk memulai.','🐍');return}if(k==='w'||k==='arrowup')setDirection(0,-1);else if(k==='s'||k==='arrowdown')setDirection(0,1);else if(k==='a'||k==='arrowleft')setDirection(-1,0);else if(k==='d'||k==='arrowright')setDirection(1,0)},{passive:false});canvas.addEventListener('pointerdown',e=>{swipeStart={x:e.clientX,y:e.clientY}},{passive:true});canvas.addEventListener('pointerup',e=>{if(!swipeStart)return;const dx=e.clientX-swipeStart.x,dy=e.clientY-swipeStart.y;swipeStart=null;if(Math.max(Math.abs(dx),Math.abs(dy))<18)return;if(Math.abs(dx)>Math.abs(dy))setDirection(dx>0?1:-1,0);else setDirection(0,dy>0?1:-1)},{passive:true});document.addEventListener('visibilitychange',()=>{if(document.hidden&&running&&!paused){paused=true;show('Jeda','Game dijeda otomatis saat layar ditinggalkan.','⏸️');updateUi()}})}
reset();show('Ular Rimba','Tekan MULAI untuk berburu.','🐍');bind();requestAnimationFrame(frame);
})();
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
</script>
</body>
</html>`

const pluginConfig = {
  name: 'snake',
  alias: ['ular', 'ularrimba', 'snakegame'],
  category: 'game',
  description: 'Game Snake inline HTML dengan kontrol sentuh dan keyboard',
  usage: '.snake',
  example: '.snake',
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  isEnabled: true
}

const handler = async (m, { sock }) => {
  if (!m?.chat || !sock) return

  const reactionKey = m?.raw?.key || m?.key
  if (reactionKey) await sock.sendMessage(m.chat, { react: { text: '🐍', key: reactionKey } }).catch(() => {})

  await sock.relayMessage(
    m.chat,
    {
      messageContextInfo: {
        deviceListMetadata: {},
        deviceListMetadataVersion: 2,
        botMetadata: {},
      },
      botForwardedMessage: {
        message: {
          richResponseMessage: {
            messageType: 1,
            submessages: [
              {
                messageType: 2,
                messageText: 'Qiro Ai Ular Rimba 🐍',
              },
            ],
            unifiedResponse: {
              data: Buffer.from(
                JSON.stringify({
                  response_id: 'qiro-ai-snake-2026',
                  sections: [
                    {
                      view_model: {
                        primitive: {
                          __typename: 'GenAIaeacdsnwHtmlPrimitive',
                          payload: html,
                          trusted_sources: [],
                        },
                        __typename: 'GenAISingleLayoutViewModel',
                      },
                    },
                  ],
                })
              ).toString('base64'),
            },
            contextInfo: {
              forwardingScore: 1,
              isForwarded: true,
              forwardedAiBotMessageInfo: {
                botJid: '867051314767696@bot',
              },
              forwardOrigin: 4,
            },
          },
        },
      },
    },
    {}
  )
}


export { pluginConfig as config, handler };
