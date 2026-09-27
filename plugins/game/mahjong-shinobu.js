/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

// ============================================================
//  KYOKO MAHJONG v6.2 — FIX MENU KEpotong (FORWARD + SIGNATURE)
//  ✅ FIX#4: menu kesulitan kepotong atas/bawah di webview pendek
//     - kontainer menu: overflow-y:auto (bisa discroll)
//     - kartu: margin:auto (center kalau muat, scroll kalau nggak)
//     - kartu dirampingkan: judul 1 baris + tombol pendek (~300px)
//  ✅ Overlay menang juga dikasih perlakuan sama (anti kepotong)
//  ✅ Semua fix v6.1 tetap (ResizeObserver, kotak gelap, render 1x)
// ============================================================

import {
    randomUUID
} from 'crypto'

const MJ_HTML = `<style>
*{box-sizing:border-box;margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none}
html,body{width:100%}
body{background:radial-gradient(circle at 50% 0,#132b1f,#0a1a12 55%,#050d09);padding:8px;color:#eef7f0;overflow-y:auto}
#app{max-width:420px;margin:0 auto}
.frame{position:relative;border-radius:28px;padding:10px 12px 14px;
background:linear-gradient(115deg,#5c3a12,#d9a441 10%,#6b4416 24%,#8a5a1f 55%,#6b4416 82%,#d9a441 94%,#4a2e0c);
box-shadow:inset 0 0 0 3px #f0d290,inset 0 0 0 6px #8a5a1f,0 8px 0 #241503,0 14px 22px rgba(0,0,0,.6)}
.frame::before{content:"";position:absolute;inset:12px;border:2px solid rgba(255,224,150,.35);border-radius:20px;pointer-events:none;z-index:0}
.banner{position:relative;z-index:1;text-align:center;padding:6px 0 9px}
.banner h1{font:900 19px 'Arial Black';color:#fff3d6;letter-spacing:2px;text-shadow:0 2px 0 #4a2008,0 0 14px #ffd75e44}
.banner small{display:block;font:700 7px Arial;letter-spacing:3px;color:#e8c88a;margin-top:1px}
.stats{position:relative;z-index:1;display:flex;gap:5px;padding:2px 2px 9px}
.st{flex:1;background:rgba(0,0,0,.4);border:1px solid rgba(255,224,150,.25);border-radius:10px;padding:3px 2px;text-align:center}
.st i{display:block;font:700 6.5px Arial;font-style:normal;letter-spacing:1px;color:#c9a86a}
.st b{font:900 12px 'Arial Black';color:#fff}
.st b.gold{color:#ffd75e}
.table{position:relative;z-index:1;background:radial-gradient(ellipse at 50% 28%,#2f7a58,#1e5a3d 62%,#123a29);
border-radius:18px;overflow:hidden;box-shadow:inset 0 0 26px rgba(0,0,0,.55),inset 0 3px 8px rgba(0,0,0,.4)}
.table::after{content:"京";position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:110px;opacity:.06;pointer-events:none}
#board{position:relative;width:100%;z-index:2}
.tile{position:absolute;border-radius:14%;cursor:pointer;touch-action:manipulation;
background:linear-gradient(160deg,#fffdf4,#f5eeda 50%,#e7dcbe);
border:1px solid rgba(120,100,60,.3);
box-shadow:0 3px 0 #b3a37c,0 6px 8px rgba(0,0,0,.4);
display:flex;align-items:center;justify-content:center;
transition:transform .16s cubic-bezier(.3,1.4,.5,1),opacity .3s}
.tile .fc{font-size:inherit;font-weight:900;line-height:1;text-shadow:0 1px 0 #fff;pointer-events:none}
.fw{color:#27348c}.fr{color:#c0272d}.fg{color:#1e8a44}.fu{color:#6b34a8}.ff{color:#b3541e}
.tile.sel{transform:translateY(-8px) scale(1.07);box-shadow:0 11px 0 #b3a37c,0 15px 16px rgba(0,0,0,.5),0 0 14px #ffd75eaa}
.tile.blk{background:linear-gradient(160deg,#e6dfc6,#cfc4a4 50%,#b9ab85);border-color:rgba(90,75,45,.35)}
.tile.blk .fc{opacity:.55}
.tile.hnt{animation:hsh .45s ease-in-out 2}
@keyframes hsh{25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
.tile.out{opacity:0;transform:translateY(-30px) scale(.55) rotate(10deg);pointer-events:none}
.tile.deal{animation:dealIn .5s cubic-bezier(.22,1.15,.36,1) both}
@keyframes dealIn{from{opacity:0;transform:translate(0,-65vh) rotate(-22deg) scale(.35)}}
.btns{display:flex;justify-content:center;gap:20px;padding:12px 0 4px}
.rbt{width:60px;height:60px;border-radius:50%;border:3px solid #ffd75e;cursor:pointer;position:relative;touch-action:manipulation;
background:radial-gradient(circle at 50% 26%,#6b4a22,#3a230e 68%);
box-shadow:0 5px 0 #241505,0 9px 15px rgba(0,0,0,.55),inset 0 2px 5px rgba(255,220,150,.35);
font-size:24px;color:#ffd75e;display:flex;align-items:center;justify-content:center;
transition:transform .1s cubic-bezier(.3,1.4,.5,1),box-shadow .1s}
.rbt:active{transform:translateY(4px) scale(.96);box-shadow:0 1px 0 #241505,0 3px 6px rgba(0,0,0,.5)}
.rbt .lb{position:absolute;bottom:-15px;left:50%;transform:translateX(-50%);font:900 8px Arial;letter-spacing:1px;color:#d9b878;white-space:nowrap}
.wm{position:relative;z-index:1;text-align:center;padding:14px 0 2px;font:700 8px Arial;letter-spacing:3px;color:rgba(255,224,150,.55)}
#msg{text-align:center;font:700 11px Arial;color:#ffe9a8;min-height:15px;padding:14px 0 0;text-shadow:0 1px 3px #000}
#asf{position:absolute;inset:0;z-index:500;display:none;align-items:center;justify-content:center;background:rgba(8,26,16,.72);border-radius:18px}
#asf.on{display:flex}
#asf span{font:900 16px 'Arial Black';color:#ffd75e;animation:aas .5s ease infinite alternate;text-shadow:0 0 12px #ffd75e66}
@keyframes aas{to{transform:scale(1.12) rotate(2deg)}}
.win{position:fixed;inset:0;z-index:2000;display:none;overflow-y:auto;-webkit-overflow-scrolling:touch;background:rgba(4,18,10,.9);text-align:center}
.win.on{display:flex}
.win .in{margin:auto;padding:20px 0;animation:pp .45s cubic-bezier(.3,1.5,.5,1)}
@keyframes pp{from{transform:scale(.5);opacity:0}}
.win h2{font:900 30px 'Arial Black';color:#ffd75e;text-shadow:0 0 18px #ffd75e66}
.win p{font:600 13px Arial;color:#cfe9d8;margin-top:6px;padding:0 18px}
.wbtn{margin-top:14px;padding:10px 22px;border-radius:12px;border:2px solid #ffd75e;background:radial-gradient(circle at 50% 30%,#6b4a22,#3a230e);color:#ffd75e;font:900 13px 'Arial Black';cursor:pointer}
.cf{position:fixed;top:-14px;z-index:2001;font-size:15px;animation:cfl linear forwards;pointer-events:none}
@keyframes cfl{to{transform:translateY(106vh) rotate(720deg)}}
/* ==== FIX#4: menu bisa discroll + kartu margin:auto (anti kepotong) ==== */
.menu{position:fixed;inset:0;z-index:3000;display:none;overflow-y:auto;-webkit-overflow-scrolling:touch;background:rgba(4,14,9,.93);padding:14px 0}
.menu.on{display:flex}
.mcard{margin:auto;width:88%;max-width:340px;border-radius:22px;padding:14px 14px 16px;text-align:center;
background:linear-gradient(115deg,#5c3a12,#d9a441 10%,#6b4416 24%,#8a5a1f 55%,#6b4416 82%,#d9a441 94%,#4a2e0c);
border:3px solid #f0d290;box-shadow:0 10px 0 #241503,0 18px 30px rgba(0,0,0,.65)}
.mcard h1{font:900 21px 'Arial Black';color:#fff3d6;letter-spacing:2px;text-shadow:0 3px 0 #4a2008,0 0 16px #ffd75e55}
.mcard .mj{font-size:24px;line-height:1.2}
.mcard small{display:block;font:700 8px Arial;letter-spacing:3px;color:#e8c88a;margin:4px 0 10px}
.mbtn{display:block;width:100%;margin-top:8px;padding:9px 8px 8px;border-radius:13px;border:2px solid #ffd75e;cursor:pointer;touch-action:manipulation;
background:radial-gradient(circle at 50% 20%,#7a5426,#3a230e 75%);color:#fff;font:900 14px 'Arial Black';letter-spacing:1px;
box-shadow:0 4px 0 #241505,0 7px 12px rgba(0,0,0,.5);transition:transform .1s}
.mbtn:active{transform:translateY(3px) scale(.98);box-shadow:0 1px 0 #241505}
.mbtn span{display:block;font:700 8px Arial;letter-spacing:1px;color:#e8c88a;margin-top:3px}
.mbtn.cont{background:linear-gradient(#2f8a5c,#145238);border-color:#8dffb9}
.mbtn.off{display:none}
.mfoot{margin-top:10px;font:700 8px Arial;letter-spacing:3px;color:rgba(255,224,150,.5)}
</style>
<div id="app">
<div class="frame">
<div class="banner"><h1>🀄 KYOKO MAHJONG</h1><small>TUMPUK ALA ASLI · PILIH MODE DI MENU</small></div>
<div class="stats">
<div class="st"><i>PASANG</i><b id="pr">-</b></div>
<div class="st"><i>WAKTU</i><b id="tm">0:00</b></div>
<div class="st"><i>RONDE</i><b id="rd">-</b></div>
<div class="st"><i>BEST</i><b class="gold" id="bt">-</b></div>
</div>
<div class="table"><div id="board"></div><div id="asf"><span>🔀 DIACAK…</span></div></div>
<div id="msg">Pilih mode untuk mulai!</div>
<div class="btns">
<button class="rbt" id="menuB"><span class="ic">🏠</span><span class="lb">MENU</span></button>
<button class="rbt" id="hintB"><span class="ic">💡</span><span class="lb">HINT</span></button>
<button class="rbt" id="undoB"><span class="ic">➦</span><span class="lb">UNDO</span></button>
</div>
<div class="wm">🎮 KYOKO MAHJONG · AZULEJOS EDITION</div>
</div>
</div>
<div class="win" id="win"><div class="in"><h2>🎉 BERES!</h2><p id="winTxt"></p><button class="wbtn" id="modeB">🎯 GANTI MODE</button></div></div>
<div class="menu on" id="menu">
<div class="mcard">
<div class="mj">🀄</div>
<h1>KYOKO MAHJONG</h1>
<small>PILIH TINGKAT KESULITAN</small>
<button class="mbtn cont off" id="contB">▶ LANJUTKAN<span id="contTxt"></span></button>
<button class="mbtn" data-d="0">🟢 MUDAH<span>36 tile · 2 lapis · santai</span></button>
<button class="mbtn" data-d="1">🟡 SEDANG<span>58 tile · 3-4 lapis · menantang</span></button>
<button class="mbtn" data-d="2">🔴 SULIT<span>90-94 tile · 4 lapis · klasik</span></button>
<div class="mfoot">🎮 KYOKO MAHJONG</div>
</div>
</div>
<script>
window.onerror=function(m){if(!/ResizeObserver/i.test(String(m))){try{var e=document.getElementById('msg');if(e)e.textContent='⚠ '+String(m).slice(0,70)}catch(x){}}return true};
(function(){
var AC=null;
function ac(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){return null}}if(AC&&AC.state==='suspended'){try{AC.resume()}catch(e){}}return AC}
function tone(f,d,t,v,at){var a=AC;if(!a)return;try{var n=a.currentTime+(at||0),o=a.createOscillator(),g=a.createGain();o.type=t||'sine';o.frequency.setValueAtTime(f,n);g.gain.setValueAtTime(v||.1,n);g.gain.exponentialRampToValueAtTime(.0001,n+d);o.connect(g);g.connect(a.destination);o.start(n);o.stop(n+d+.02)}catch(e){}}
function sSel(){tone(620,.06,'triangle',.09)}
function sBad(){tone(210,.11,'sawtooth',.08);tone(165,.13,'sawtooth',.06,.07)}
function sMatch(){tone(660,.1,'triangle',.11);tone(880,.11,'triangle',.1,.08);tone(1320,.15,'triangle',.09,.16)}
function sShuf(){tone(300,.05,'square',.06);tone(380,.05,'square',.06,.07);tone(470,.05,'square',.06,.14);tone(560,.05,'square',.06,.21)}
function sDeal(){for(var i=0;i<9;i++)tone(260+i*44,.05,'square',.04,i*.14)}
function sWin(){[523,659,784,1046,1318].forEach(function(f,i){tone(f,.2,'triangle',.11,i*.12)})}
document.addEventListener('pointerdown',function(){ac()},{once:true});

var FACES=[
['一萬','fw'],['二萬','fw'],['三萬','fr'],['四萬','fw'],['五萬','fr'],['六萬','fw'],['七萬','fr'],['八萬','fw'],['九萬','fr'],
['中','fr'],['發','fg'],['東','fu'],['南','fu'],['西','fu'],['北','fu'],
['🌸','ff'],['🌺','ff'],['🍀','ff'],['🎋','ff'],['🎍','ff'],['🌻','ff'],['☘️','ff'],['🦋','ff'],['🍂','ff']
];
function sh(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function fitDeck(n){
while(n%2)n--;
var idx=sh(FACES.map(function(_,i){return i}));
var need=n/2,deck=[];
if(need<=FACES.length){
idx.slice(0,need).forEach(function(fi){deck.push(fi,fi)});
}else{
var full=Math.floor(need/FACES.length),rem=need-full*FACES.length,i,f;
for(i=0;i<full;i++)for(f=0;f<FACES.length;f++)deck.push(f,f);
idx.slice(0,rem).forEach(function(fi){deck.push(fi,fi)});
}
return sh(deck);
}

function R(p,x0,x1,y0,y1,z){for(var y=y0;y<=y1;y++)for(var x=x0;x<=x1+.01;x+=1)p.push({x:x,y:y,z:z})}
function P(p,x,y,z){p.push({x:x,y:y,z:z})}
function layBunga(){var p=[];
R(p,3,5,0,0,0);R(p,2,6,1,1,0);R(p,1,7,2,3,0);R(p,2,6,4,4,0);R(p,3,5,5,5,0);
R(p,3.5,5.5,2,3,1);
return p}
function layPirKecil(){var p=[];
R(p,1,6,0,3,0);
R(p,1.5,5.5,1,2,1);
P(p,3.5,1,2);P(p,3.5,2,2);
return p}
function layKetupat(){var p=[];
R(p,2,5,0,0,0);R(p,1,6,1,1,0);R(p,0,7,2,3,0);R(p,1,6,4,4,0);R(p,2,5,5,5,0);
R(p,2.5,5.5,1,4,1);
R(p,3.5,4.5,2,3,2);
P(p,4,2.5,3);P(p,4,3.5,3);
return p}
function layGerbang(){var p=[];
R(p,0,7,0,4,0);
R(p,1.5,5.5,1,2,1);R(p,2.5,4.5,3,3,1);
R(p,2.5,4.5,1,2,2);
return p}
function layKura(){var p=[];
R(p,2,7,0,0,0);R(p,1,8,1,1,0);R(p,0,9,2,4,0);R(p,1,8,5,5,0);R(p,2,7,6,6,0);
R(p,2.5,7.5,2,4,1);
R(p,3.5,6.5,2,4,2);
P(p,4.5,2.5,3);P(p,4.5,3.5,3);
return p}
function layBenteng(){var p=[];
R(p,0,8,0,5,0);
R(p,.5,1.5,0,5,1);R(p,6.5,7.5,0,5,1);
R(p,1,1,0,5,2);R(p,7,7,0,5,2);
P(p,1,2,3);P(p,1,3,3);P(p,7,2,3);P(p,7,3,3);
return p}
var SHAPES=[layBunga,layPirKecil,layKetupat,layGerbang,layKura,layBenteng];
var SNAMES=['Bunga','Piramida','Ketupat','Gerbang','Kura-Kura','Benteng'];
var DIFFS=[
{name:'MUDAH',icon:'🟢',shapes:[0,1]},
{name:'SEDANG',icon:'🟡',shapes:[2,3]},
{name:'SULIT',icon:'🔴',shapes:[4,5]}
];

var boardEl=document.getElementById('board'),
prEl=document.getElementById('pr'),tmEl=document.getElementById('tm'),btEl=document.getElementById('bt'),rdEl=document.getElementById('rd'),
msgEl=document.getElementById('msg'),winEl=document.getElementById('win'),winTxt=document.getElementById('winTxt'),
asfEl=document.getElementById('asf'),menuEl=document.getElementById('menu'),
contB=document.getElementById('contB'),contTxt=document.getElementById('contTxt');
var tiles=[],sel=-1,pairs=0,secs=0,timer=null,started=false,hist=[],OVER=false,shapeIdx=0,startedAt=null,round=0,diff=0,dealing=false,nextPending=false,winTO=null,rsT=null,lastW=-1;
var BEST=null;
try{BEST=parseInt(localStorage.getItem('kyoko_best')||'0',10)||null}catch(e){}
if(BEST)btEl.textContent=fmtT(BEST);
function fmtT(s){return Math.floor(s/60)+':'+('0'+(s%60)).slice(-2)}
function save(){
try{localStorage.setItem('kyoko_save',JSON.stringify({
diff:diff,shape:shapeIdx,secs:secs,over:OVER,started:started,startedAt:startedAt,round:round,
slots:tiles.map(function(t){return t.x+'_'+t.y+'_'+t.z}),
faces:tiles.map(function(t){return t.face}),
out:tiles.map(function(t){return t.out?1:0})
}))}catch(e){}
}
function load(){
try{var s=JSON.parse(localStorage.getItem('kyoko_save')||'null');
if(s&&!s.over&&s.slots&&s.faces&&s.slots.length===s.faces.length&&s.slots.length>=30&&s.diff>=0&&s.diff<3){
s.slots=s.slots.map(function(k){var a=k.split('_');return{x:parseFloat(a[0]),y:parseFloat(a[1]),z:parseFloat(a[2])}});
return s}}catch(e){}
return null;
}
function clearSave(){try{localStorage.removeItem('kyoko_save')}catch(e){}}

function covered(t){var i,o;
for(i=0;i<tiles.length;i++){o=tiles[i];
if(o.out||o.z<=t.z)continue;
if(Math.abs(o.x-t.x)<.99&&Math.abs(o.y-t.y)<.99)return true}
return false}
function sideBlocked(t,dir){var i,o,dx;
for(i=0;i<tiles.length;i++){o=tiles[i];
if(o.out||o.z!==t.z)continue;
dx=dir<0?(t.x-o.x):(o.x-t.x);
if(dx>.01&&dx<1.01&&Math.abs(o.y-t.y)<.99)return true}
return false}
function free(t){
if(t.out)return false;
if(covered(t))return false;
return !sideBlocked(t,-1)||!sideBlocked(t,1)}

function setFace(t){if(t.el&&t.el.firstChild){var f=FACES[t.face];t.el.firstChild.className='fc '+f[1];t.el.firstChild.textContent=f[0]}}
function pick(t){sel=t.i;t.el.classList.add('sel');t.el.style.zIndex=9999}
function unpick(t){if(t&&t.el){t.el.classList.remove('sel');t.el.style.zIndex=t.zi}}

function mapEls(){var ch=boardEl.children,i,el,id;
for(i=0;i<ch.length;i++){el=ch[i];id=parseInt(el.getAttribute('data-i'),10);if(!isNaN(id))tiles[id].el=el}}
function render(deal){
if(!tiles.length){boardEl.style.height='220px';boardEl.innerHTML='';return}
var W=boardEl.clientWidth||0;
if(!W){if((render._try||0)<8){render._try=(render._try||0)+1;setTimeout(function(){render(deal)},150)}return}
render._try=0;
var minX=1e9,maxX=-1e9,minY=1e9,maxY=-1e9,maxZ=0,i,t;
for(i=0;i<tiles.length;i++){t=tiles[i];
if(t.x<minX)minX=t.x;if(t.x>maxX)maxX=t.x;
if(t.y<minY)minY=t.y;if(t.y>maxY)maxY=t.y;
if(t.z>maxZ)maxZ=t.z}
var uw=maxX+1-minX,rows=maxY+1-minY;
var cellW=W/uw,cellH=cellW*1.15,lift=Math.min(cellW,cellH)*.17;
boardEl.style.height=Math.round(rows*cellH+maxZ*lift+10)+'px';
lastW=W;
var sorted=tiles.slice().sort(function(a,b){return a.z-b.z||a.y-b.y||a.x-b.x});
var h='';
for(i=0;i<sorted.length;i++){t=sorted[i];
var f=FACES[t.face];
t.zi=10+t.z*40+Math.round((t.y-minY)*2);
var left=Math.round((t.x-minX)*cellW+t.z*lift);
var top=Math.round((t.y-minY)*cellH+t.z*lift*.9+2);
var w=Math.round(cellW*.84),ht=Math.round(cellH*.88);
var fs=Math.round((f[1]==='ff')?cellW*.58:cellW*.5);
h+='<div class="tile'+(t.out?' out':(free(t)?'':' blk'))+(deal&&!t.out?' deal':'')+'" data-i="'+t.i+'" style="z-index:'+t.zi+';left:'+left+'px;top:'+top+'px;width:'+w+'px;height:'+ht+'px;font-size:'+fs+'px'+(deal&&!t.out?';animation-delay:'+Math.round(40+i*9)+'ms':'')+'"><span class="fc '+f[1]+'">'+f[0]+'</span></div>';
}
boardEl.innerHTML=h;
mapEls();
upd();save();
}
function upd(){
pairs=tiles.filter(function(t){return !t.out}).length/2;
prEl.textContent=tiles.length?pairs:'-';
}
function tap(i){
if(OVER||dealing||menuEl.classList.contains('on'))return;
var t=tiles[i];
if(!t||t.out)return;
if(!free(t)){note('Tile masih tertimpa/terhimpit!');sBad();shake(t);return}
if(!started)startTimer();
if(sel===i){unpick(t);sel=-1;return}
if(sel<0){pick(t);sSel();return}
var a=tiles[sel];
if(a.face===t.face){
unpick(a);sel=-1;
setTimeout(function(){
a.el.classList.add('out');t.el.classList.add('out');
a.out=true;t.out=true;
hist.push([a.i,t.i]);
sMatch();upd();refresh();save();
if(pairs===0)setTimeout(win,380);
else if(!anyMove())autoShuffle();
},160);
}else{
unpick(a);sel=-1;
note('Bukan pasangan!');sBad();
pick(t);sSel();
}
}
function shake(t){if(!t.el)return;t.el.classList.add('hnt');setTimeout(function(){t.el.classList.remove('hnt')},950)}
function refresh(){tiles.forEach(function(t){if(t.el&&!t.out)t.el.classList.toggle('blk',!free(t))})}
function anyMove(){
var F=[],i,j;
for(i=0;i<tiles.length;i++)if(!tiles[i].out)F.push([tiles[i],free(tiles[i])]);
for(i=0;i<F.length;i++){if(!F[i][1])continue;
for(j=i+1;j<F.length;j++)if(F[j][1]&&F[i][0].face===F[j][0].face)return true}
return false}
function note(s){msgEl.textContent=s}
function startTicker(){if(timer)return;timer=setInterval(function(){secs++;tmEl.textContent=fmtT(secs);save()},1000)}
function startTimer(){started=true;if(!startedAt)startedAt=Date.now();startTicker()}
function pauseTimer(){clearInterval(timer);timer=null}

function ensureMoves(min){
var made=0,guard=0;
while(made<min&&guard++<90){
var F=[],i;
for(i=0;i<tiles.length;i++)if(!tiles[i].out&&free(tiles[i]))F.push(tiles[i]);
if(F.length<2)break;
var a=F[Math.floor(Math.random()*F.length)];
var b=F[Math.floor(Math.random()*F.length)];
if(b===a)continue;
if(a.face===b.face){made++;continue}
var tw=null,t;
for(i=0;i<tiles.length;i++){t=tiles[i];
if(!t.out&&t!==a&&t!==b&&t.face===a.face){tw=t;break}}
if(!tw)continue;
var tmp=b.face;b.face=a.face;tw.face=tmp;
setFace(b);setFace(tw);
made++;
}
refresh();upd();
return anyMove();
}
function autoShuffle(){
if(OVER||dealing)return;
if(sel>=0){unpick(tiles[sel]);sel=-1}
note('Gak ada langkah — diacak otomatis! 🔀');
asfEl.classList.add('on');sShuf();
setTimeout(function(){doReshuffle();asfEl.classList.remove('on')},700);
}
function doReshuffle(){
var L=[],i,att;
for(i=0;i<tiles.length;i++)if(!tiles[i].out)L.push(tiles[i]);
for(att=0;att<3;att++){
var fs=sh(L.map(function(t){return t.face}));
for(i=0;i<L.length;i++){L[i].face=fs[i];setFace(L[i])}
if(ensureMoves(3))break;
}
if(sel>=0){unpick(tiles[sel]);sel=-1}
refresh();upd();
if(anyMove()){note('Dapat langkah! Lanjut 💪')}
else{emergencySwap();note('Diacak paksa! 🔧')}
save();
}
function emergencySwap(){
var cov=[],fr=[],i,t;
for(i=0;i<tiles.length;i++){t=tiles[i];if(t.out)continue;
if(covered(t))cov.push(t);else if(free(t))fr.push(t)}
if(cov.length&&fr.length){
var c=cov[Math.floor(Math.random()*cov.length)],f=fr[Math.floor(Math.random()*fr.length)];
var a=c.x,b=c.y,q=c.z;
c.x=f.x;c.y=f.y;c.z=f.z;f.x=a;f.y=b;f.z=q;
render(false);
}
}

function startGame(si,saved,deal,msgTxt,dIdx){
clearInterval(timer);timer=null;clearTimeout(winTO);nextPending=false;
winEl.classList.remove('on');asfEl.classList.remove('on');
OVER=false;hist=[];sel=-1;dealing=false;
if(dIdx>=0&&dIdx<3)diff=dIdx;
if(si>=0&&si<SHAPES.length)shapeIdx=si;
var pos=SHAPES[shapeIdx]();
var n=pos.length;while(n%2)n--;pos=pos.slice(0,n);
if(saved&&(saved.faces.length!==pos.length))saved=null;
var deck=saved?saved.faces:fitDeck(n);
tiles=[];
for(var i=0;i<pos.length;i++){
var p=saved?saved.slots[i]:pos[i];
tiles.push({i:i,face:deck[i],x:p.x,y:p.y,z:p.z,el:null,out:saved?!!saved.out[i]:false,zi:0});
}
if(!saved)ensureMoves(2);
if(saved&&saved.started&&!saved.over){
started=true;
startedAt=saved.startedAt||(Date.now()-(saved.secs||0)*1000);
secs=Math.max(saved.secs||0,Math.floor((Date.now()-startedAt)/1000));
tmEl.textContent=fmtT(secs);
startTicker();
note('Sesi dilanjutkan — waktu tetap berjalan!');
}else{
started=false;startedAt=null;secs=0;tmEl.textContent='0:00';
}
if(saved){round=saved.round||1;diff=saved.diff||diff}
else{round++;rdEl.textContent=round}
render(deal&&!saved);
if(deal&&!saved){
dealing=true;sDeal();
note(msgTxt||('🏗️ Menata '+tiles.length+' tile…'));
setTimeout(function(){
var ch=boardEl.children,i;
for(i=0;i<ch.length;i++)ch[i].classList.remove('deal');
dealing=false;
if(OVER)return;
var w=boardEl.clientWidth||0;
if(w&&Math.abs(w-lastW)>3){render(false)}
if(!anyMove())autoShuffle();
else note('Tap 2 tile kembar yang bebas!');
},tiles.length*9+720);
}
save();
}

// ==== MENU (FIX#4: buka/tutup, selalu scrollable) ====
function openMenu(){
pauseTimer();save();
// FIX#4: reset scroll ke atas biar judul selalu kelihatan saat menu dibuka
menuEl.scrollTop=0;
var hasNow=tiles.length&&!OVER;
var s=hasNow?null:load();
if(hasNow||s){
contB.classList.remove('off');
if(hasNow)contTxt.textContent=DIFFS[diff].name+' · Ronde '+round+' · '+fmtT(secs);
else contTxt.textContent=DIFFS[s.diff].name+' · Ronde '+(s.round||1);
}else{contB.classList.add('off')}
menuEl.classList.add('on');
}
function closeMenu(){menuEl.classList.remove('on')}
contB.addEventListener('pointerdown',function(e){e.preventDefault();ac();sSel();closeMenu();
if(!tiles.length){var s=load();if(s){startGame(s.shape,s,false);return}}
if(started&&!OVER)startTicker();
note('Lanjut! 👊');
});
var mbs=document.querySelectorAll('.mbtn[data-d]');
for(var _mi=0;_mi<mbs.length;_mi++){(function(b){
b.addEventListener('pointerdown',function(e){e.preventDefault();ac();sSel();closeMenu();
var d=parseInt(b.getAttribute('data-d'),10);
var opts=DIFFS[d].shapes.slice();
var sIdx=opts[Math.floor(Math.random()*opts.length)];
clearSave();round=0;
startGame(sIdx,null,true,d===0?'🟢 MUDAH · santai!':d===1?'🟡 SEDANG · gas!':'🔴 SULIT · hati-hati! 🔥',d);
});
})(mbs[_mi])}
document.getElementById('menuB').addEventListener('pointerdown',function(e){e.preventDefault();ac();sShuf();openMenu();note('Game dijeda — menu terbuka')});

boardEl.addEventListener('pointerdown',function(e){
e.preventDefault();
if(OVER||dealing||menuEl.classList.contains('on'))return;
var n=e.target;
while(n&&n!==boardEl&&!(n.classList&&n.classList.contains('tile')))n=n.parentNode;
if(!n||n===boardEl||!n.getAttribute)return;
var id=parseInt(n.getAttribute('data-i'),10);
if(!isNaN(id))tap(id);
});

document.getElementById('hintB').addEventListener('pointerdown',function(e){e.preventDefault();
ac();if(OVER||dealing||!tiles.length||menuEl.classList.contains('on'))return;
var F=[],i,j;
for(i=0;i<tiles.length;i++)if(!tiles[i].out)F.push([tiles[i],free(tiles[i])]);
for(i=0;i<F.length;i++){if(!F[i][1])continue;
for(j=i+1;j<F.length;j++){
if(F[j][1]&&F[i][0].face===F[j][0].face){
if(sel>=0){unpick(tiles[sel]);sel=-1}
shake(F[i][0]);shake(F[j][0]);note('Pasangan ini! 💡');sSel();return;
}}}
autoShuffle();
});
document.getElementById('undoB').addEventListener('pointerdown',function(e){e.preventDefault();
ac();if(OVER||dealing||!tiles.length||menuEl.classList.contains('on'))return;
if(!hist.length){note('Belum ada langkah untuk di-undo');return}
var m=hist.pop(),a=tiles[m[0]],b=tiles[m[1]];
a.out=false;b.out=false;
a.el.classList.remove('out');b.el.classList.remove('out');
if(sel>=0){unpick(tiles[sel]);sel=-1}
sShuf();refresh();upd();save();note('Undo! ✓');
});
addEventListener('resize',function(){
clearTimeout(rsT);
rsT=setTimeout(function(){
var w=boardEl.clientWidth||0;
if(!w||dealing)return;
if(Math.abs(w-lastW)>3)render(false);
},260);
});
document.addEventListener('pagehide',save);
document.addEventListener('visibilitychange',function(){if(document.hidden)save()});

function win(){
OVER=true;pauseTimer();sWin();save();
var rec=false;
if(!BEST||secs<BEST){BEST=secs;rec=true;
try{localStorage.setItem('kyoko_best',String(BEST))}catch(e){}
btEl.textContent=fmtT(BEST);
}
winTxt.innerHTML=DIFFS[diff].icon+' '+DIFFS[diff].name+' · Ronde '+round+' selesai dalam <b style="color:#ffd75e">'+fmtT(secs)+'</b>'+(rec?' — REKOR BARU! 🏆':' · Best: '+fmtT(BEST))+'<br><span style="font-size:11px;color:#9fd8b8">ronde baru menyusul…</span>';
winEl.classList.add('on');
var cv=['🎉','✨','🀄','🎊','💫'];
for(var i=0;i<26;i++){(function(k){
var d=document.createElement('div');d.className='cf';
d.textContent=cv[k%cv.length];
d.style.left=Math.random()*94+'vw';
d.style.animationDuration=(2.2+Math.random()*1.8)+'s';
d.style.animationDelay=(Math.random()*.7)+'s';
document.body.appendChild(d);
setTimeout(function(){d.remove()},5200);
})(i)}
nextPending=true;
winTO=setTimeout(nextRound,3400);
}
function nextRound(){
if(!nextPending)return;nextPending=false;
var opts=DIFFS[diff].shapes,s=shapeIdx;
if(opts.length>1){while(s===shapeIdx)s=opts[Math.floor(Math.random()*opts.length)]}
startGame(s,null,true,'Ronde '+(round+1)+' · bentuk '+SNAMES[s]+'! 🀄');
}
document.getElementById('modeB').addEventListener('pointerdown',function(e){e.preventDefault();
ac();sSel();clearTimeout(winTO);nextPending=false;
winEl.classList.remove('on');
openMenu();
});
winEl.addEventListener('pointerdown',function(e){if(nextPending&&e.target.id!=='modeB'){clearTimeout(winTO);nextRound()}});

(function boot(){
rdEl.textContent='-';prEl.textContent='-';
openMenu();
})();
})();
</script>`

// ============================================================
//  SIGNATURE & CERTIFICATE (dari contoh publik MessageBuilder V4.7)
// ============================================================
const SIG = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LVZlcmlmaWNhdGlvblNpZ25hdHVyZS5NZXRhZGF0YcN55YRyad2+ZA=="
const CERT1 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGEOvtJr968bbpKdZreOTwkk9aPN++XPE60RfuzNLkXXc7LE8BOkJOWRpo2oNXaRJ3uCNJ43HY3A+oetnvHSfcxWqmvvTSrBOI5V1NOD6RMsZ/st1XVPUx83AGps1l5jYBOYzqMNy6un2tToJ2Bt9bXRo29tWLZTu8m7TNY/hISwVpVc5tjSet5U7btPN+dMIx2UvykB1jcbWGsdklheeuz8RXSStNXzeaGvsf1lpZ/ugLE4b2BdmlRNKrY6zLE4qFtRYQoS7axOyQX+4QUyN2m9bfm7urQmn+QRSXJwMO7X5kAJJLbkVGJFt9Pm9VXPwQVrK2aaqiXlpusj+7DfDw00OULmYMmZDTqXM0nUVLxj13z0LhMQoQhhNG8utdUn4uKOFceliTZ/xiP+A54GnX9620641bqw3ctfh9NNXPsTEK8hAUD7FDqUhVntHmoEYYEHq8X1tHHZYP49/f2iezTiE8AUaoZo42/jIWQIKohOGNUib2hEqMkW8NsR8vPihvNuqPc0zKZcl6359YFQdjiiW8kCRD/rsDOr9v1eYLFZKYloFyzFqEgj+jcG/V47elOjShJ5CCPwatXwP6HIloVwtgygFsnOFmCg6Ojoivfoz8Nw1qxFwg5OU2cq/1WbWNELKnaFg4eUWCAIJ/3ZIJsEPkgemZxGhE+hdiNn9dkQYBJs1kx2BxdIkJmQ9vJSKkrMz6lTxZM3IJ9mhmKS6zYdU1ppeAao0/ayte997DQParb/AHLN79g0iW1ad0z8ir5jAl0q3a+UZPTSa4YiSqC2PZ/gfxG5wvL2mKmeKowG0RXjmEp5iNxrni+T/HRLZOoH7y0DQ24nMCPg"
const CERT2 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGHsL0Ccm0ELINFZ2IaBhKaeWnVuh0o6nZLCioCn9xpSADzwIS5VCWO+1eVXT2atJOyf7FYlpB0/JA3Us+aQtekuIkHu/zBXijORZ4ClF4+sF3cSTNg6gY/+6iwLK/zs3bMg+GeJrcI65vXfs95Shxlb2Rd5GRT2/2yBmR6Zkf5QwMJuptUHWtM26WY7/xlkEKGFYDZVqOSylusiOzSALa815zC6dCiHoJNLBEKMlaZZQOk57/+OYoU5zzTaEgLhyvNFHSyAlyLQ3SGFtVHAaJZHSmmSPyJowCOB+92Gkk6SWVMsk6FbU8QJWFtlhzV/W/gZ7WzUlS/AKgN0th9/cq20ToFkW7X9c+rtYavufmuieqFhXgaMD8AGsoN9QC/HzNC9D1nydPfFYEUr9BHVy2nF5gM58Y59r2rT8p5LPARIkUp8g+5DLhyW0tdZFZ1305o4AHCayZnp5rjcU2Xi/c1Qf/djBGakmijlMs4aMzKJYD0c4Q8jdI7sNyd876K2wRD+L6KeD2QB3PtCS4P7BWAl5gh5CJ6ZBrwcaKXZqcSjEwm52MqVCgYZdapAaNYUy/QndttjLOG0wxxwuX1hIhMjPnIKZR1kwnqD5EqlHpilrnojRZvjVGN4zEKmilS8rNstt4HHs/D849W+Q6LRVWiWMs0cT2IugrX+Skxd8En7Gq52UEmuVBrSTpN+UpIu20NsVb9lsvuYh3XO441606tOEY2eKcZJdTtqrOTNqbbTk0zVn1yhbOCvmfctBNDhTwaC5QMi0P9wjU5XI9SBtkdQLizc5oqpoiHeqgb8+aJHVLcbgIJ/KLZKtRWFDfzRNM02Csx4etUUapVd2NA/L0oMs/O5T9sVj9FBJ7q99GWr3PVmxJb36mHZLXC4k1gGN9swE0LtzYsUdT5tUo9ri/hS3W/SM+F1p4Kh4QIgRcG3ciIHGN44bnDh3HDCz0fDnzKYw0bclMxZPctEyJ5gEOPF6OAkjD9dEaRGq/tEPf1k9Aub+v2dEjnfrYWAm4E5Zfhs2Xh0CT0k+SzhgKd0K/46ChJ20G5+blwpIvahvTVS68+aVIX6CwXs4tcVx6FnmVsMOOkIasfaqQLZYbNBkuLoZnQAq4j8yRekrQ=="

async function kirimForwardSigned(conn, chatId, html, judul) {
    const data = Buffer.from(JSON.stringify({
        __typename: 'GenAIUnifiedResponse',
        response_id: randomUUID(),
        sections: [{
            __typename: 'GenAIUnifiedResponseSection',
            view_model: {
                __typename: 'GenAISingleLayoutViewModel',
                primitive: {
                    __typename: 'GenAIaeacdsnwHtmlPrimitive',
                    payload: html,
                    trusted_sources: []
                }
            }
        }]
    })).toString('base64')

    return conn.relayMessage(chatId, {
        messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2,
            botMetadata: {
                messageDisclaimerText: "",
                botResponseId: randomUUID(),
                verificationMetadata: {
                    proofs: [{
                        version: 1,
                        useCase: 1,
                        signature: SIG,
                        certificateChain: [CERT1, CERT2]
                    }]
                }
            }
        },
        botForwardedMessage: {
            message: {
                richResponseMessage: {
                    messageType: 1,
                    submessages: [{
                        messageType: 2,
                        messageText: judul
                    }],
                    unifiedResponse: {
                        data
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
    }, {})
}

const config = {
    name: 'mahjong',
    alias: ['mjong', 'mj', 'kyoko'],
    category: 'game',
    description: 'Kyoko Mahjong v6.2 dengan HTML AI Rich Message.',
    usage: '.mahjong',
    example: '.mahjong',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    try {
        await kirimForwardSigned(sock, m.chat, MJ_HTML, '🀄 KYOKO MAHJONG • Fitur By: Anita Putri Azzahra')
    } catch (e) {
        console.error('[KYOKO MAHJONG]', e?.stack || e?.message || e)
        try {
            await m.reply('〄 Gagal mengirim mahjong: ' + (e?.message || e))
        } catch {}
    }
}

export default {
    config,
    handler
}
