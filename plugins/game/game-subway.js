import { randomUUID } from 'crypto';

const htmlPayload = String.raw`<style>
*{box-sizing:border-box;margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}
html,body{width:100%}
body{background:linear-gradient(165deg,#071538,#040a1e 60%,#02061a);padding:8px;color:#eaf2ff;overflow-y:auto}
#app{max-width:420px;margin:0 auto}
.hdr{display:flex;justify-content:space-between;align-items:center;padding:2px 2px 7px;gap:8px}
.tt{font:900 18px 'Arial Black';color:#58c7ff;text-shadow:0 0 12px #58c7ff66;letter-spacing:1px}
.tt small{display:block;font:700 6.5px Arial;letter-spacing:2px;color:#7a9cc8;text-shadow:none}
.hrs{display:flex;gap:6px;align-items:center}
.hr{background:rgba(0,0,0,.42);border:1px solid rgba(88,199,255,.3);border-radius:9px;padding:3px 9px;text-align:center;min-width:52px}
.hr i{display:block;font:700 7px Arial;font-style:normal;letter-spacing:1px;color:#7a9cc8}
.hr b{font:900 13px 'Arial Black';color:#ffd75e;font-variant-numeric:tabular-nums}
.mbtn{width:34px;height:34px;border:2px solid rgba(88,199,255,.3);border-radius:9px;background:rgba(0,0,0,.42);color:#fff;font-size:15px;cursor:pointer;touch-action:none}
.mbtn:active{filter:brightness(1.6)}
.gw{position:relative;border:2px solid rgba(88,199,255,.3);border-radius:14px;overflow:hidden;background:#000;box-shadow:0 0 18px rgba(88,199,255,.15)}
canvas{width:100%;display:block;touch-action:none}
.pads{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;margin-top:8px}
.pd{height:52px;border:2px solid rgba(255,255,255,.18);border-radius:12px;font:900 14px 'Arial Black';color:#fff;cursor:pointer;touch-action:none;box-shadow:0 4px 0 rgba(0,0,0,.5)}
.pd:active{transform:translateY(3px);box-shadow:none;filter:brightness(1.5)}
#lB{background:linear-gradient(#3d475e,#232a3a 60%,#10141f)}
#rB{background:linear-gradient(#3d475e,#232a3a 60%,#10141f)}
#jB{background:linear-gradient(#58c7ff,#1f7fd6 60%,#0a3a6e)}
#sB{background:linear-gradient(#ffd75e,#e09406 60%,#7a5205);color:#3a2805}
.hint{text-align:center;font:600 9px Arial;color:#7a9cc8;margin-top:6px}
</style>
<div id="app">
<div class="hdr"><div class="tt">🚇 SUBWAY SURF<small>RICH RUN · LINTAS REL</small></div><div class="hrs"><div class="hr"><i>COINS</i><b id="co">0</b></div><div class="hr"><i>METER</i><b id="mt">0</b></div><div class="hr"><i>BEST</i><b id="bs">0</b></div><button class="mbtn" id="muteB">🔊</button></div></div>
<div class="gw"><canvas id="cv" width="360" height="560"></canvas></div>
<div class="pads">
<button class="pd" id="lB">◀</button>
<button class="pd" id="rB">▶</button>
<button class="pd" id="jB">⤒ JUMP</button>
<button class="pd" id="sB">▽ SLIDE</button>
</div>
<div class="hint">Geser LR / tombol = pindah rel · ⤒ lompat rintangan rendah · ▽ slide portal tinggi · himpit koin &amp; power-up!</div>
</div>
<script>
window.onerror=function(m,s,l){var e=document.querySelector('.hint');if(e){e.textContent='⚠ '+m+' @'+l;e.style.color='#ff7a8a'}};
(function(){
/* ============ SETUP + RES 2X ============ */
var cv=document.getElementById('cv'),x=cv.getContext('2d'),W=360,H=560;
var DPR=2;cv.width=W*DPR;cv.height=H*DPR;
x.setTransform(DPR,0,0,DPR,0,0);
var coEl=document.getElementById('co'),mtEl=document.getElementById('mt'),bsEl=document.getElementById('bs');
var BEST=0;try{BEST=parseInt(localStorage.getItem('subway_best')||'0',10)||0}catch(e){}
bsEl.textContent=BEST;
function saveBest(){try{localStorage.setItem('subway_best',String(BEST))}catch(e){}}

/* ============ AUDIO CORE ============ */
var AC=null,MUTED=false;
try{MUTED=localStorage.getItem('subway_mute')==='1'}catch(e){}
function ac(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){return null}}if(AC&&AC.state==='suspended'){try{AC.resume()}catch(e){}}return AC}
function tone(f,d,t,v,at,sl){var a=AC;if(!a||MUTED)return;try{var n=a.currentTime+(at||0),o=a.createOscillator(),g=a.createGain();o.type=t||'square';o.frequency.setValueAtTime(f,n);if(sl)o.frequency.exponentialRampToValueAtTime(sl,n+d);g.gain.setValueAtTime(v||.1,n);g.gain.exponentialRampToValueAtTime(.0001,n+d);o.connect(g);g.connect(a.destination);o.start(n);o.stop(n+d+.03)}catch(e){}}
function noiz(d,v,at,fc){var a=AC;if(!a||MUTED)return;try{var n=a.currentTime+(at||0),len=Math.floor(a.sampleRate*d),b=a.createBuffer(1,len,a.sampleRate),c=b.getChannelData(0),i;for(i=0;i<len;i++)c[i]=Math.random()*2-1;var s=a.createBufferSource(),g=a.createGain(),f=a.createBiquadFilter();s.buffer=b;f.type='lowpass';f.frequency.value=fc||1200;g.gain.setValueAtTime(v,n);g.gain.exponentialRampToValueAtTime(.0001,n+d);s.connect(f);f.connect(g);g.connect(a.destination);s.start(n);s.stop(n+d+.03)}catch(e){}}
/* sfx */
function sJump(){tone(260,.12,'sine',.13,0,780);tone(150,.06,'square',.05)}
function sSlide(){noiz(.2,.18,0,700);tone(500,.12,'sine',.1,0,200)}
function sCoin(){tone(988,.045,'triangle',.12);tone(1319,.16,'sine',.14,.04);tone(2637,.11,'sine',.05,.04)}
function sLane(){tone(660,.05,'square',.09);tone(880,.06,'square',.07,.05)}
function sPower(){[523,659,784,1047].forEach(function(f,i){tone(f,.1,'square',.11,i*.07)});tone(2093,.2,'sine',.08,.28)}
function sBoost(){noiz(.35,.22,0,700);tone(160,.4,'sawtooth',.12,0,720);tone(80,.4,'sawtooth',.1,0,320)}
function sShield(){[392,523,659,784].forEach(function(f,i){tone(f,.14,'triangle',.11,i*.06)})}
function sCrash(){noiz(.3,.3,0,1400);tone(180,.16,'square',.2,0,60);tone(1200,.08,'square',.1)}
function sDie(){[523,392,330,262,196,131].forEach(function(f,i){tone(f,.2,'triangle',.13,i*.14)});noiz(.5,.2,.84,300)}
function sMile(){[659,784,1047,1319].forEach(function(f,i){tone(f,.1,'square',.1,i*.07)});tone(2093,.2,'sine',.08,.28)}
function sReady(){tone(1319,.07,'sine',.12);tone(1760,.12,'sine',.1,.06)}
function sBest(at){at=at||0;[523,659,784,1047,784,1047,1319,1568].forEach(function(f,i){tone(f,.13,'square',.11,at+i*.09)})}

/* ============ MUSIK ============ */
var mStep=0,mNext=0;
var MEL=[523,659,784,988,880,784,659,880];
var BASS=[131,0,0,131,110,0,0,147];
function mTick(){
var a=AC;if(!a)return;
var now=performance.now();
if(now>=mNext){
if(MUTED){}else{try{tone(MEL[mStep],.13,'square',.05);tone(MEL[mStep]*2,.08,'triangle',.02,.02);tone(BASS[mStep],.2,'triangle',.05) }catch(e){}}
mStep=(mStep+1)%MEL.length;mNext=now+150;
}
}

/* ============ HELPERS ============ */
function rr(xx,yy,ww,hh,rrr){x.beginPath();if(x.roundRect){x.roundRect(xx,yy,ww,hh,rrr)}else{x.moveTo(xx+rrr,yy);x.arcTo(xx+ww,yy,xx+ww,yy+hh,rrr);x.arcTo(xx+ww,yy+hh,xx,yy+hh,rrr);x.arcTo(xx,yy+hh,xx,yy,rrr);x.arcTo(xx,yy,xx+ww,yy,rrr);x.closePath()}}

/* ============ GAME STATE ============ */
var state='ready',frame=0;
var RUN=false,dist=0,pxTotal=0,coins=0,spd=4.2;
var GROUND=H-70;
var LANES=[112,180,248];
var lane=1,targetLane=1;
var air=false,vy=0,jumpH=0;
var slideT=0,slideMax=.55;
var invT=0,shieldT=0,magnetT=0,boostT=0;
var lastHit=0;
var moved=false,touched=false,t0=0;

var objs=[],picks=[],parts=[],pops=[];
var spawnPx=120;

/* ============ PLAYER ============ */
var px=180,py=GROUND,lean=0,runP=0;

function resetRun(){
RUN=true;dist=0;pxTotal=0;coins=0;spd=4.2;
lane=1;targetLane=1;px=180;py=GROUND;air=false;vy=0;jumpH=0;
slideT=0;invT=0;magnetT=0;boostT=0;
objs=[];picks=[];parts=[];pops=[];spawnPx=140;
coEl.textContent=0;mtEl.textContent=0;
moved=false;
sReady();
}

/* ============ WAVE GENERATOR ============ */
function laneFreePool(){
var occ={};
objs.forEach(function(o){if(o.type==='train'||o.type==='low'||o.type==='high')occ[o.lane]=true});
var free=[];
for(var i=0;i<3;i++)if(!occ[i])free.push(i);
return free;
}
function spawnWave(){
var d=Math.min(1,dist/2600);
var count=1+(d>.35?1:0)+(d>.72&&Math.random()<.4?1:0);
if(count>3)count=3;
var pool=[0,1,2],chosen=[];
var free=laneFreePool();
if(free.length===0)free=[Math.floor(Math.random()*3)];
/* jamin minimal 1 lajur bebas */
if(count===3){count=2}
while(chosen.length<count&&pool.length){
var idx=Math.floor(Math.random()*pool.length);
chosen.push(pool.splice(idx,1)[0]);
}
for(var c=0;c<chosen.length;c++){
var l=chosen[c],r=Math.random(),t='low';
if(d>.2&&r<.2)t='train';
else if(d>.12&&r<.45)t='high';
else if(r<.75)t='low';
else t='high';
if(t==='train'&&d<.3&&Math.random()<.5)t='low';
spawnObs(t,l);
}
/* koin susun di jalur non-obstacle (acak) */
var coinLane=Math.floor(Math.random()*3);
var blocked={};chosen.forEach(function(l2){blocked[l2]=true});
if(blocked[coinLane]){
var cand=[];for(var i=0;i<3;i++)if(!blocked[i])cand.push(i);
if(cand.length)coinLane=cand[Math.floor(Math.random()*cand.length)];
}
if(Math.random()<.85)picks.push({type:'coin',lane:coinLane,y:-30-gapY(),n:4+Math.floor(Math.random()*3)});
/* power-up langka */
if(Math.random()<.055){
var pl=laneFreePool()[Math.floor(Math.random()*Math.max(1,laneFreePool().length))];
var pt=['magnet','shield','boost'][Math.floor(Math.random()*3)];
picks.push({type:pt,lane:pl,y:-30});
}
}
function gapY(){return 40+Math.random()*40}
function spawnObs(t,l){
var h;
if(t==='train')h=120;else if(t==='high')h=64;else h=30;
var w=t==='train'?58:(t==='high'?56:54);
objs.push({type:t,lane:l,x:LANES[l],y:-h-40,w:w,h:h,prevY:-h-40,hit:false});
}

/* ============ UPDATE ============ */
function update(dt){
frame++;
mTick();
if(state!=='play')return;
drawWorldSpeed=spd;
pxTotal+=spd*dt;
dist=Math.floor(pxTotal/26);
mtEl.textContent=dist;
spd=Math.min(9,3.6+dist*.0011);

/* spawn wave */
if(pxTotal>=spawnPx){
spawnWave();
spawnPx=pxTotal+(d0sMin()+Math.random()*60);
}
function d0sMin(){var d=Math.min(1,dist/2600);return 250-d*130}

/* player lane lerp (frame independent) */
var k=1-Math.pow(.00004,dt);
px+=(LANES[targetLane]-px)*k;
var dv=LANES[targetLane]-px;
lean=nz(dv*0.006,lean);

/* jump/slide timers */
if(slideT>0)slideT=Math.max(0,slideT-dt);
if(air){
vy+=0.55*dt;py+=vy*dt;
if(py>=GROUND){py=GROUND;air=false;vy=0;jumpH=0;spawnDust(8)}
}else if(!slideT){
py+=Math.min(1.4,spd*0.16)*dt;
}
if(invT>0)invT-=dt;
if(magnetT>0)magnetT-=dt;

/* run cycle */
runP+=spd*dt*0.045;

/* obstacles move + collide */
var bandTop,bandBot,o;
for(var i=objs.length-1;i>=0;i--){
o=objs[i];
o.prevY=o.y;o.y+=spd*dt;
if(o.y>H+60){objs.splice(i,1);continue}
if(o.hit)continue;
bandTop=py-playerVisualH(o);
bandBot=py+8;
if(o.y+o.h>=bandTop&&o.y+o.h<=bandBot+60&&o.y+o.h>=bandTop-(spd*dt)){
var sameLane=Math.abs(o.x-px)<((o.w+30)/2-3);
if(sameLane){
var passable=false;
if(o.type==='train')passable=false;
else if(o.type==='low')passable=air&&(GROUND-py)>(o.h-6);
else if(o.type==='high')passable=slideT>0&&!air;
if(passable){
if(o.type==='low'){spawnPop('Lompat!','#9fd8ff');}
o.hit=true;
}else{
if(invT>0||boostT>0){
o.hit=true;destroyObstacle(o);
}else if(shieldT>0){
shieldT=0;o.hit=true;destroyObstacle(o);spawnPop('🛡 pecah!','#a7f3d0');sShield();
}else{
crash(o);
break;
}
}
}
}
}
/* picks move + collect */
for(var j=picks.length-1;j>=0;j--){
var p=picks[j];
p.prevY=p.y;p.y+=spd*dt;
if(p.y>H+40){picks.splice(j,1);continue}
var plx=LANES[p.lane],dx=p.x=p.prevX||plx;
if(p.type==='coin'&&magnetT>0){
p.x+=(px-p.x)*Math.min(1,0.16*dt);p.y+=(py-p.y)*Math.min(1,0.16*dt);
}
if(typeof p.n==='number'){if(magnetT>0&&!p.started){/* n/a */}}
if(p.x===undefined)p.x=plx;
if(p.type==='coin'){
if(Math.abs(p.x-px)<26&&p.y+9>=py-playerVisualH(p)&&p.y-9<=py+8){
coins+=1;coEl.textContent=coins;picks.splice(j,1);spawnPop('+1','#ffd75e');sCoin();
}
}else{
if(p.y+16>=py-playerVisualH(p)&&p.y-16<=py+8&&Math.abs(p.x-px)<30){
applyPick(p.type);picks.splice(j,1);
}
}
}
/* particles + pops */
for(var q=parts.length-1;q>=0;q--){
var pr=parts[q];pr.x+=pr.vx*dt;pr.y+=pr.vy*dt;pr.vy+=0.18*dt;pr.t-=0.03*dt;
if(pr.t<=0)parts.splice(q,1);
}
for(var w2=pops.length-1;w2>=0;w2--){
var pp=pops[w2];pp.t-=0.045*dt;
if(pp.t<=0)pops.splice(w2,1);
}
}
function nz(v,prev){return prev*0.8+v*0.2}
function playerVisualH(o){
if(slideT>0&&!air)return 24;
return 44;
}
function destroyObstacle(o){
spawnBurst(o.x,o.y+o.h/2,'#ffd75e',12);
spawnPop('+50','#ffd75e');
if(o.type==='train'){coins+=50;}else{coins+=25;}
coEl.textContent=coins;sCrash();
}
function crash(o){
state='dead';
spawnBurst(o.x,o.y+o.h/2,'#ff6b7a',26);
spawnBurst(px,py,'#ffd75e',18);
sDie();
if(dist>BEST){BEST=dist;saveBest();bsEl.textContent=BEST;sBest(.7)}
mtEl.textContent=dist;
}
function applyPick(t){
if(t==='magnet'){magnetT=7;spawnPop('🧲 MAGNET','#58c7ff');}
else if(t==='shield'){shieldT=9999;spawnPop('🛡 SHIELD','#a7f3d0');}
else if(t==='boost'){boostT=4;spd=Math.min(11,spd+4);spawnPop('⚡ BOOST','#ff9a3c');}
sPower();
}
function spawnDust(n){
for(var i=0;i<n;i++)parts.push({x:px+(Math.random()*20-10),y:GROUND+6,vx:Math.random()*30-15,vy:-Math.random()*22,vy2:0,t:0.5,c:'rgba(160,180,220,0.5)',r:2+Math.random()*3});
}
function spawnBurst(xx,yy,c,n){
for(var i=0;i<n;i++)parts.push({x:xx,y:yy,vx:Math.random()*160-80,vy:-Math.random()*140-10,vy2:0,t:0.6+Math.random()*0.3,c:c,r:2+Math.random()*3.5});
}
function spawnPop(txt,c){
pops.push({txt:txt,c:c,t:1,x:px,y:py-58});
}

/* ============ DRAW ============ */
var stars=[],builds=[],winSeed=0;
(function(){for(var i=0;i<34;i++)stars.push({x:Math.random()*W,y:Math.random()*H*.55,r:.5+Math.random()*1.3,ph:Math.random()*6.28,sp:.02+Math.random()*.03});
for(var i=0;i<10;i++)builds.push({x:Math.random()*W,w:18+Math.random()*34,h:20+Math.random()*42,tone:4+Math.floor(Math.random()*3),wins:Math.floor(Math.random()*4+2)});})();

function drawBackground(){
var g=x.createLinearGradient(0,0,0,H);
g.addColorStop(0,'#071538');g.addColorStop(.5,'#0a1128');g.addColorStop(1,'#02061a');
x.fillStyle=g;x.fillRect(0,0,W,H);
/* stars */
for(var i=0;i<stars.length;i++){
var s=stars[i];var al=.4+.4*Math.sin(frame*s.sp+s.ph);
x.fillStyle='rgba(220,235,255,'+al+')';
x.fillRect(s.x,s.y,s.r,s.r);
}
/* bulan */
x.fillStyle='rgba(255,235,190,.12)';x.beginPath();x.arc(316,52,26,0,6.283);x.fill();
x.fillStyle='rgba(255,240,200,.75)';x.beginPath();x.arc(312,50,20,0,6.283);x.fill();
/* city skyline paralaks */
var off=pxTotal*.04;
for(var b=0;b<builds.length;b++){
var bd=builds[b],by=H*.62-bd.h*2.2;
x.fillStyle='rgba(30,46,90,.55)';x.fillRect(bd.x,(by+off*.3)%H,bd.w,bd.h*2.2+40);
x.fillStyle='rgba(88,199,255,.18)';
for(var k2=0;k2<bd.wins;k2++)x.fillRect(bd.x+3+((k2*7)%(bd.w-6)),(by+off*.3)%H+8+((k2*11)%Math.max(6,bd.h*2.2-16)),2,3);
}
}
function drawGround(){
/* aspal malam + rel */
x.fillStyle='#0b0f1c';x.fillRect(60,GROUND-4,W-120,H-GROUND+4);
/* bantalan (sleeper) */
var step=34,off=(pxTotal)%step;
for(var y=GROUND-4-step+off;y<H+10;y+=step){
x.fillStyle='rgba(120,96,52,.9)';x.fillRect(76,y,202,7);
x.fillStyle='rgba(30,24,12,.6)';x.fillRect(76,y,202,2);
}
/* dua rel neon */
x.strokeStyle='rgba(88,199,255,.5)';x.lineWidth=2;
x.beginPath();x.moveTo(76,GROUND-4);x.lineTo(76,H);x.stroke();
x.beginPath();x.moveTo(278,GROUND-4);x.lineTo(278,H);x.stroke();
x.strokeStyle='rgba(255,215,94,.4)';x.lineWidth=1;
x.beginPath();x.moveTo(70,GROUND-4);x.lineTo(70,H);x.stroke();
x.beginPath();x.moveTo(284,GROUND-4);x.lineTo(284,H);x.stroke();
/* garis lajur putus */
x.strokeStyle='rgba(255,215,94,.5)';x.lineWidth=5;x.setLineDash([12,16]);
x.lineDashOffset=-pxTotal*.4;
x.beginPath();x.moveTo(180,GROUND+2);x.lineTo(180,H);x.stroke();
x.setLineDash([]);
/* kilau track bawah */
var g2=x.createLinearGradient(0,GROUND,0,H);
g2.addColorStop(0,'rgba(88,199,255,.08)');g2.addColorStop(1,'rgba(2,6,26,0)');
x.fillStyle=g2;x.fillRect(60,GROUND,W-120,H-GROUND);
}
function drawObstacles(){
for(var i=0;i<objs.length;i++){
var o=objs[i];
if(o.y<-o.h-20&&!o.hit)continue;
var cx=o.x,topY=o.y;
if(o.type==='train'){
var g=x.createLinearGradient(cx-29,0,cx+29,0);
g.addColorStop(0,'#2a3145');g.addColorStop(.5,'#4a5570');g.addColorStop(1,'#20263a');
x.fillStyle=g;rr(cx-o.w/2,topY,o.w,o.h,10);x.fill();
x.strokeStyle='rgba(88,199,255,.35)';x.lineWidth=2;rr(cx-o.w/2,topY,o.w,o.h,10);x.stroke();
x.fillStyle='rgba(255,215,94,.9)';rr(cx-22,topY+6,44,8,3);x.fill();
x.fillStyle='rgba(255,120,120,.9)';rr(cx-o.w/2+4,topY+o.h-26,o.w-8,26,6);x.fill();
x.fillStyle='rgba(255,150,150,.55)';rr(cx-o.w/2+4,topY+o.h-26,o.w-8,5,3);x.fill();
}
else if(o.type==='high'){
/* portal (+bar overhead) — slide di bawah */
x.strokeStyle='rgba(200,170,255,.9)';x.lineWidth=6;
x.beginPath();x.moveTo(cx-o.w/2+6,topY+16);x.lineTo(cx-o.w/2+6,topY+o.h);x.stroke();
x.beginPath();x.moveTo(cx+o.w/2-6,topY+16);x.lineTo(cx+o.w/2-6,topY+o.h);x.stroke();
x.lineWidth=9;x.strokeStyle='#c4a7ff';
x.beginPath();x.moveTo(cx-o.w/2+6,topY+16);x.lineTo(cx+o.w/2-6,topY+16);x.stroke();
x.strokeStyle='#ff9a3c';x.lineWidth=3;
x.beginPath();x.moveTo(cx-o.w/2+6,topY+16);x.lineTo(cx+o.w/2-6,topY+16);x.stroke();
}
else {
/* rendah: barrier kuning-hitam / beton */
var g3=x.createLinearGradient(cx-o.w/2,0,cx+o.w/2,0);
g3.addColorStop(0,'#ffd75e');g3.addColorStop(.5,'#ff9a3c');g3.addColorStop(1,'#d97a00');
x.fillStyle=g3;rr(cx-o.w/2,topY,o.w,o.h,6);x.fill();
x.fillStyle='rgba(0,0,0,.25)';
x.fillRect(cx-o.w/2-1,topY+7,o.w+2,4);
x.fillStyle='rgba(255,255,255,.65)';x.font='700 9px Arial';x.textAlign='center';
x.fillText('!',cx,topY+o.h/2+3);
}
}
x.textAlign='left';
}
function drawPicks(){
for(var i=0;i<picks.length;i++){
var p=picks[i];
if(p.y<-20&&p.x===undefined)continue;
var cx2=p.x!==undefined?p.x:LANES[p.lane];
if(p.type==='coin'){
var r=8+Math.sin(frame*.14+i)*1.4;
var g5=x.createLinearGradient(cx2-r,0,cx2+r,0);
g5.addColorStop(0,'#ffe066');g5.addColorStop(1,'#e0a20c');
x.beginPath();x.ellipse(cx2,p.y,r,r*.72,0,0,6.283);x.fillStyle=g5;x.fill();
x.strokeStyle='#a06c00';x.lineWidth=1.6;x.stroke();
}else{
var em=p.type==='magnet'?'🧲':(p.type==='shield'?'🛡':'⚡');
x.font='18px Arial';x.textAlign='center';
var bob=8+Math.sin(frame*.1+i)*3;
x.fillStyle='rgba(88,199,255,.25)';x.beginPath();x.arc(cx2,p.y+bob,16,0,6.283);x.fill();
x.fillText(em,cx2,p.y+bob+6);
x.textAlign='left';
}
}
}
function drawPlayer(){
var sl=slideT>0&&!air;
var bob=air?0:Math.abs(Math.sin(runP))*3;
var pyy=py+bob;
x.save();
x.translate(px,pyy);
x.rotate(lean*.22);
if(invT>0||boostT>0){
x.strokeStyle='rgba(255,215,94,'+(0.35+0.35*Math.sin(frame*.5))+')';x.lineWidth=3;
x.beginPath();x.arc(0,-20,34,0,6.283);x.stroke();
}
/* bayangan */
x.fillStyle='rgba(0,0,0,.3)';x.beginPath();x.ellipse(0,GROUND-pyy+26,20,5,0,0,6.283);x.fill();
if(sl){
/* slide: tubuh rebah */
x.fillStyle='#1f7fd6';
rr(-18,-10,36,16,8);x.fill();
x.fillStyle='#3b82f6';rr(-6,-10,10,16,4);x.fill();
x.fillStyle='#ffd75e';x.beginPath();x.arc(18,-6,8,0,6.283);x.fill();
x.fillStyle='#1e293b';x.beginPath();x.arc(20,-7,3,0,6.283);x.fill();
x.fillStyle='#f2c49b';x.beginPath();x.arc(22,-4,7,0,6.283);x.fill();
x.restore();return;
}
/* kaki lari */
var ph=Math.sin(runP*2)*.7;
var kolor='#2b55a8';
x.fillStyle=kolor;
rr(-8,-2+ph*7,9,13,4);x.fill();
rr(2,-2-ph*7,9,13,4);x.fill();
x.fillStyle='#fff';rr(-10,8+ph*7,13,4,2);x.fill();rr(0,8-ph*7,13,4,2);x.fill();
/* badan jaket hoodie */
var g4=x.createLinearGradient(-14,0,14,0);
g4.addColorStop(0,'#1f7fd6');g4.addColorStop(.5,'#58c7ff');g4.addColorStop(1,'#1f7fd6');
x.fillStyle=g4;rr(-14,-30,28,32,11);x.fill();
x.strokeStyle='rgba(255,255,255,.35)';x.lineWidth=1.5;rr(-14,-30,28,32,11);x.stroke();
/* garis tengah hoodie */
x.fillStyle='rgba(255,255,255,.4)';x.fillRect(-2,-30,4,32);
/* lengan */
x.fillStyle='#1f7fd6';
x.save();x.translate(-14,-18);x.rotate(-.4+ph*.3);rr(-12,-5,13,10,5);x.fill();x.restore();
x.save();x.translate(14,-18);x.rotate(.4-ph*.3);rr(-1,-5,13,10,5);x.fill();x.restore();
/* kepala + hood */
x.fillStyle='#f2c49b';x.beginPath();x.arc(0,-38,9,0,6.283);x.fill();
x.fillStyle='#1f7fd6';x.beginPath();x.arc(0,-40,10,0,Math.PI,false);x.fill();
x.fillStyle='#3b82f6';rr(-11,-44,22,6,3);x.fill();
/* mata visor */
x.fillStyle='#0b0f1c';rr(3,-40,8,4,2);x.fill();
x.fillStyle='#58c7ff';rr(4,-41,4,2,1);x.fill();
x.restore();
}
function drawHUD(){
if(invT>0||shieldT>0||magnetT>0||boostT>0){
var bx=8,by=H-30;
x.font='700 10px Arial';
var items=0;
if(shieldT>0){x.fillStyle='rgba(200,170,255,.3)';rr(bx,by,54,18,9);x.fill();x.fillStyle='#d9c9ff';x.fillText('🛡 Shield',bx+6,by+13);}
if(boostT>0){x.fillStyle='rgba(255,215,94,.3)';rr(bx+60,by,50,18,9);x.fill();x.fillStyle='#ffe066';x.fillText('⚡ Boost',bx+66,by+13);}
if(magnetT>0){x.fillStyle='rgba(88,199,255,.3)';rr(bx+116,by,54,18,9);x.fill();x.fillStyle='#bfe9ff';x.fillText('🧲 Mag',bx+122,by+13);}
}
}
function drawOverlays(){
if(state==='ready'){
x.fillStyle='rgba(2,8,26,.55)';x.fillRect(0,0,W,H);
x.textAlign='center';
x.font='900 30px Arial';x.lineWidth=6;x.strokeStyle='rgba(8,16,40,.9)';x.strokeText('SUBWAY SURF',W/2,150);
var tg=x.createLinearGradient(0,112,0,150);tg.addColorStop(0,'#bfe9ff');tg.addColorStop(.55,'#58c7ff');tg.addColorStop(1,'#2f7fd6');
x.fillStyle=tg;x.fillText('SUBWAY SURF',W/2,150);
x.font='700 11px Arial';x.fillStyle='#9fd8ff';x.fillText('3 REL · LOMPAT · SLIDE · MAGNET',W/2,172);
if(BEST>0){x.font='bold 12px monospace';x.fillStyle='#ffd75e';x.fillText('BEST: '+BEST+'m',W/2,196)}
/* mini player ilustrasi */
x.save();x.translate(W/2,262);x.beginPath();x.arc(0,0,40,0,6.283);x.fillStyle='rgba(88,199,255,.08)';x.fill();
x.fillStyle='#1f7fd6';rr(-20,-30,40,36,12);x.fill();
x.fillStyle='#f2c49b';x.beginPath();x.arc(0,-40,11,0,6.283);x.fill();
x.restore();
x.font='900 16px Arial';x.fillStyle='rgba(255,255,255,'+(.55+.45*Math.sin(frame*.09))+')';x.fillText('TAP ATAU GESER UNTUK MULAI',W/2,330);
x.font='600 9px Arial';x.fillStyle='#7a9cc8';x.fillText('◀▶ pindah rel · ⤒ lompat barrier · ▽ slide portal · himpit koin',W/2,352);
x.textAlign='left';
}else if(state==='dead'){
x.fillStyle='rgba(2,8,26,.55)';x.fillRect(0,0,W,H);
rr(42,150,276,140,14);x.fillStyle='rgba(8,18,46,.92)';x.fill();
x.strokeStyle='rgba(88,199,255,.45)';x.lineWidth=2;x.stroke();
x.textAlign='center';
x.font='900 27px Arial';
var dg=x.createLinearGradient(0,190,0,216);dg.addColorStop(0,'#ff8aa0');dg.addColorStop(1,'#d61f3e');
x.fillStyle=dg;x.fillText('GAME OVER',W/2,208);
x.font='bold 13px monospace';x.fillStyle='#eaf2ff';x.fillText('JARAK '+dist+'m   ·   KOIN '+coins,W/2,242);
if(dist>BEST-1&&dist>0){x.fillStyle='rgba(255,215,94,'+(.6+.4*Math.sin(frame*.2))+')';x.font='900 14px Arial';x.fillText('★ NEW BEST: '+BEST+'m ★',W/2,268)}
else{x.fillStyle='#9fd8ff';x.font='bold 12px monospace';x.fillText('BEST: '+BEST+'m',W/2,268)}
x.font='700 12px Arial';x.fillStyle='rgba(255,255,255,'+(.5+.5*Math.sin(frame*.1))+')';x.fillText('TAP / TEKAN SPASI UNTUK MAIN LAGI',W/2,300);
x.textAlign='left';
}
}
function draw(){
x.clearRect(0,0,W,H);
drawBackground();
drawGround();
drawObstacles();
drawPicks();
drawPlayer();
for(var i=0;i<parts.length;i++){
var p=parts[i];x.globalAlpha=Math.max(0,p.t);x.fillStyle=p.c;
x.fillRect(p.x-p.r/2,p.y-p.r/2,p.r,p.r);
}
x.globalAlpha=1;
for(var q=0;q<pops.length;q++){
var pp=pops[q];x.globalAlpha=Math.max(0,pp.t);
x.font='900 13px Arial';x.textAlign='center';
var pyy=pp.y-(1-pp.t)*18;
x.lineWidth=3;x.strokeStyle='rgba(10,20,50,.7)';x.strokeText(pp.txt,pp.x,pyy);
x.fillStyle=pp.c;x.fillText(pp.txt,pp.x,pyy);
}
x.globalAlpha=1;x.textAlign='left';
drawHUD();
drawOverlays();
}

/* ============ LOOP + AUTO-QUALITY ============ */
var perfA=0,perfN=0,perfDone=false,lastT=0,dt=1;
function loop(t){
if(!perfDone&&perfN>60&&perfN<160)perfA+=(t-lastT);
if(!perfDone&&perfN===160){perfA/=100;if(perfA>22){DPR=1;cv.width=W;cv.height=H;x.setTransform(1,0,0,1,0,0)}perfDone=true}
perfN++;
var raw=(t-lastT)/16.667;
lastT=t;
dt=Math.max(0.2,Math.min(2.5,raw||1));
if(state==='play')update(dt);
else mTick();
draw();
requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

/* ============ INPUT ============ */
function setLane(d){
if(state!=='play')return;
var nv=targetLane+d;
if(nv<0||nv>2)return;
targetLane=nv;sLane();spawnDust(3);
}
function doJump(){
if(state!=='play')return;
if(!air&&slideT<=0){air=true;vy=-11;jumpH=1;sJump();spawnDust(5)}
}
function doSlide(){
if(state!=='play')return;
if(!air){slideT=slideMax;sSlide();spawnDust(5)}
}
document.addEventListener('keydown',function(e){
if(state==='ready'){if(e.key===' '||e.key==='Enter'||e.key==='Spacebar'){resetRun();state='play';startRun();}return}
if(state==='dead'){if(e.key===' '||e.key==='Enter'){resetRun();state='play';startRun();}return}
if(e.key==='ArrowLeft'||e.key==='a'||e.key==='A')setLane(-1);
else if(e.key==='ArrowRight'||e.key==='d'||e.key==='D')setLane(1);
else if(e.key==='ArrowUp'||e.key==='w'||e.key==='W'||e.key===' ')doJump();
else if(e.key==='ArrowDown'||e.key==='s'||e.key==='S')doSlide();
});
function startRun(){ac();}
document.getElementById('muteB').addEventListener('click',function(){MUTED=!MUTED;this.textContent=MUTED?'🔇':'🔊';try{localStorage.setItem('subway_mute',MUTED?'1':'0')}catch(e){}});
if(MUTED)document.getElementById('muteB').textContent='🔇';
/* touch buttons */
var btns={lB:-1,rB:1,jB:'j',sB:'s'};
for(var k in btns){
(function(id,val){
var el=document.getElementById(id);
var act=function(){if(val==='j')doJump();else if(val==='s')doSlide();else setLane(val);};
el.addEventListener('touchstart',function(e){e.preventDefault();act()});
el.addEventListener('mousedown',function(e){e.preventDefault();act()});
})(k,btns[k]);
}
/* swipe canvas */
var sx=0,sy=0,st=false,mv=0;
cv.addEventListener('touchstart',function(e){
e.preventDefault();var to=e.changedTouches[0];sx=to.clientX;sy=to.clientY;st=true;mv=false;touched=true;
if(state==='ready'||state==='dead'){resetRun();state='play';startRun();}
},{passive:false});
cv.addEventListener('touchmove',function(e){e.preventDefault();var to=e.changedTouches[0];if(Math.abs(to.clientX-sx)+Math.abs(to.clientY-sy)>10)mv=true;},{passive:false});
cv.addEventListener('touchend',function(e){
e.preventDefault();if(!st)return;st=false;
var to=e.changedTouches[0],dx=to.clientX-sx,dy=to.clientY-sy;
if(state!=='play')return;
if(!mv)return;
if(Math.abs(dx)>Math.abs(dy)){setLane(dx>0?1:-1)}
else if(dy<-28)doJump();
else if(dy>28)doSlide();
},{passive:false});
cv.addEventListener('mousedown',function(e){sx=e.clientX;sy=e.clientY;st=true;mv=false;touched=true;
if(state==='ready'||state==='dead'){resetRun();state='play';startRun();}
});
cv.addEventListener('mouseup',function(e){if(!st)return;st=false;
var dx=e.clientX-sx,dy=e.clientY-sy;
if(state!=='play')return;
if(!mv){if(!touchedAt(mv)){}}
if(Math.abs(dx)>Math.abs(dy)&&mv){setLane(dx>0?1:-1)}
else if(!mv){doJump()}
else if(dy>28)doSlide();
});
function touchedAt(){return true}
/* klik tanpa geser = jump (tap) */
cv.addEventListener('click',function(){});
})();
</script>`;

let handler = async (m, { conn }) => {
    const responseId = randomUUID();
    await conn.relayMessage(
        m.chat,
        {
            botForwardedMessage: {
                message: {
                    richResponseMessage: {
                        messageType: 1,
                        submessages: [
                            {
                                messageType: 2,
                                messageText: "Subway Surfers"
                            }
                        ],
                        unifiedResponse: {
                            data: Buffer.from(JSON.stringify({
                                "response_id": responseId,
                                "sections": [
                                    {
                                        "view_model": {
                                            "primitive": {
                                                "__typename": "GenAIaeacdsnwHtmlPrimitive",
                                                "payload": htmlPayload,
                                                "trusted_sources": [
                                                    "lumnztyz.dev"
                                                ]
                                            },
                                            "__typename": "GenAISingleLayoutViewModel"
                                        }
                                    }
                                ]
                            })).toString('base64')
                        },
                        contextInfo: {
                            forwardingScore: 1,
                            isForwarded: true,
                            forwardedAiBotMessageInfo: {
                                botJid: "867051314767696@bot"
                            },
                            forwardOrigin: 4
                        }
                    }
                }
            }
        },
        {
            messageId: responseId
        }
    );
};

handler.help = ['subway', 'subwaysurfers', 'subwaysurf'];
handler.tags = ['game'];
handler.category = 'game';
handler.description = 'Main game Subway Surfers HTML interaktif via Rich Message';
handler.command = /^(subway|subwaysurfers|subwaysurf)$/i;

export default handler;
