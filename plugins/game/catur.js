/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { randomUUID } from 'crypto'

const CATUR_HTML = `<style>
*{box-sizing:border-box;margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}
html,body{width:100%;min-height:100%}
body{background:radial-gradient(circle at 50% -10%,#24345f 0%,#09122d 42%,#030712 100%);padding:8px;color:#eef4ff;overflow-y:auto}
#app{max-width:420px;margin:0 auto}
.hdr{display:flex;justify-content:space-between;align-items:center;padding:2px 2px 8px;gap:8px}
.tt{font:900 18px 'Arial Black';color:#e9d79a;text-shadow:0 0 14px #e9d79a55;letter-spacing:1px}
.tt small{display:block;font:700 6.5px Arial;letter-spacing:2px;color:#93a6c9;text-shadow:none}
.hrs{display:flex;gap:5px;align-items:center}
.hr{background:rgba(0,0,0,.34);border:1px solid rgba(233,215,154,.28);border-radius:9px;padding:3px 8px;text-align:center;min-width:54px}
.hr i{display:block;font:700 7px Arial;font-style:normal;letter-spacing:1px;color:#93a6c9}
.hr b{font:900 12px 'Arial Black';color:#f5d67d;font-variant-numeric:tabular-nums}
.mbtn{width:34px;height:34px;border:2px solid rgba(233,215,154,.28);border-radius:9px;background:rgba(0,0,0,.34);color:#fff;font-size:15px;cursor:pointer;touch-action:none}
.mbtn:active{filter:brightness(1.45);transform:scale(.96)}
.gw{position:relative;border:2px solid rgba(233,215,154,.26);border-radius:14px;overflow:hidden;background:#070b14;box-shadow:0 0 22px rgba(0,0,0,.45)}
canvas{width:100%;display:block;touch-action:none}
.bar{display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px;margin-top:8px}
.pd{height:42px;border:2px solid rgba(255,255,255,.16);border-radius:12px;font:900 12px Arial;color:#fff;cursor:pointer;touch-action:none;box-shadow:0 4px 0 rgba(0,0,0,.45);background:linear-gradient(#344466,#18223a)}
.pd:active{transform:translateY(3px);box-shadow:none;filter:brightness(1.35)}
#newB{background:linear-gradient(#d9c27c,#8d6c27);color:#251b07}
#botB{background:linear-gradient(#4aa6f0,#2263a7)}
#flipB{background:linear-gradient(#6d7c9a,#3b465e)}
.hint{text-align:center;font:600 9px Arial;color:#8fa3c8;margin-top:7px;line-height:1.35}
.credit{text-align:center;font:600 8px Arial;color:#65779a;margin-top:7px;padding-bottom:2px}
.credit a{color:#e9d79a;text-decoration:none}.credit a:active{filter:brightness(1.5)}
</style>
<div id="app">
  <div class="hdr">
    <div class="tt">♟ RIMURU CHESS<small>ROYAL BOARD · MOBILE EDITION</small></div>
    <div class="hrs">
      <div class="hr"><i>TURN</i><b id="turnEl">WHITE</b></div>
      <div class="hr"><i>MOVE</i><b id="moveEl">1</b></div>
      <button class="mbtn" id="muteB">🔊</button>
    </div>
  </div>
  <div class="gw"><canvas id="cv" width="404" height="468"></canvas></div>
  <div class="bar">
    <button class="pd" id="newB">♜ NEW GAME</button>
    <button class="pd" id="botB">🤖 VS BOT</button>
    <button class="pd" id="flipB">↕ FLIP</button>
  </div>
  <div class="hint" id="hint">Tap bidak lalu tap kotak tujuan. Mode BOT bermain sebagai hitam.</div>
  <div class="credit">Chess Engine built-in</div>
</div>
<script>
window.onerror=function(m,s,l){var e=document.getElementById('hint');if(e){e.textContent='⚠ '+m+' @'+l;e.style.color='#ff7a8a'}};
(function(){
'use strict';

/* ============ SETUP ============ */
var cv=document.getElementById('cv'),ctx=cv.getContext('2d');
var W=404,H=468,DPR=Math.max(1,Math.min(2,window.devicePixelRatio||1));
cv.width=W*DPR;cv.height=H*DPR;

var turnEl=document.getElementById('turnEl');
var moveEl=document.getElementById('moveEl');
var hintEl=document.getElementById('hint');
var muted=false,AC=null;

function audio(){
  if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){return null}}
  try{if(AC.state==='suspended')AC.resume()}catch(e){}
  return AC;
}
function tone(f,d,type,v,delay){
  var a=audio();if(!a||muted)return;
  try{
    var t=a.currentTime+(delay||0),o=a.createOscillator(),g=a.createGain();
    o.type=type||'sine';o.frequency.setValueAtTime(f,t);
    g.gain.setValueAtTime(v||.07,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);
    o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+d+.02)
  }catch(e){}
}
function sMove(){tone(580,.08,'triangle',.08);tone(880,.1,'sine',.06,.04)}
function sCapture(){tone(220,.1,'square',.09);tone(130,.16,'triangle',.06,.05)}
function sCheck(){tone(660,.08,'square',.08);tone(990,.12,'square',.07,.09)}
function sCastle(){tone(430,.08,'sine',.06);tone(650,.11,'sine',.07,.06)}
function sEnd(){tone(520,.14,'triangle',.08);tone(392,.18,'triangle',.07,.14);tone(262,.26,'triangle',.06,.3)}

document.getElementById('muteB').addEventListener('pointerdown',function(e){
  e.preventDefault();e.stopPropagation();audio();
  muted=!muted;this.textContent=muted?'🔇':'🔊';
});

/* ============ CHESS CORE ============ */
var PIECES={
  w:{k:'♔',q:'♕',r:'♖',b:'♗',n:'♘',p:'♙'},
  b:{k:'♚',q:'♛',r:'♜',b:'♝',n:'♞',p:'♟'}
};
var files='abcdefgh';
var board,turn,selected,legalForSelected,history,halfmove,fullmove;
var flipped=false,vsBot=true,botThinking=false,gameOver=false,statusText='';
var lastMove=null,checkSquare=null,anim=0;

function piece(color,type){return {c:color,t:type,m:false}}
function initial(){
  return [
    [piece('b','r'),piece('b','n'),piece('b','b'),piece('b','q'),piece('b','k'),piece('b','b'),piece('b','n'),piece('b','r')],
    [piece('b','p'),piece('b','p'),piece('b','p'),piece('b','p'),piece('b','p'),piece('b','p'),piece('b','p'),piece('b','p')],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [piece('w','p'),piece('w','p'),piece('w','p'),piece('w','p'),piece('w','p'),piece('w','p'),piece('w','p'),piece('w','p')],
    [piece('w','r'),piece('w','n'),piece('w','b'),piece('w','q'),piece('w','k'),piece('w','b'),piece('w','n'),piece('w','r')]
  ];
}
function cloneBoard(b){return b.map(r=>r.map(p=>p?{c:p.c,t:p.t,m:p.m}:null))}
function inside(r,c){return r>=0&&r<8&&c>=0&&c<8}
function other(c){return c==='w'?'b':'w'}

function findKing(b,color){
  for(var r=0;r<8;r++)for(var c=0;c<8;c++){var p=b[r][c];if(p&&p.c===color&&p.t==='k')return {r:r,c:c}}
  return null;
}
function attacked(b,r,c,by){
  var pawnDir=by==='w'?-1:1;
  for(var dc of [-1,1]){
    var pr=r-pawnDir,pc=c-dc;
    if(inside(pr,pc)&&b[pr][pc]&&b[pr][pc].c===by&&b[pr][pc].t==='p')return true;
  }
  var knr=[[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];
  for(var k of knr){
    var rr=r+k[0],cc=c+k[1];
    if(inside(rr,cc)&&b[rr][cc]&&b[rr][cc].c===by&&b[rr][cc].t==='n')return true;
  }
  var dirsB=[[1,1],[1,-1],[-1,1],[-1,-1]];
  for(var d of dirsB){
    var rr2=r+d[0],cc2=c+d[1];
    while(inside(rr2,cc2)){
      var q=b[rr2][cc2];
      if(q){if(q.c===by&&(q.t==='b'||q.t==='q'))return true;break}
      rr2+=d[0];cc2+=d[1];
    }
  }
  var dirsR=[[1,0],[-1,0],[0,1],[0,-1]];
  for(var d2 of dirsR){
    var rr3=r+d2[0],cc3=c+d2[1];
    while(inside(rr3,cc3)){
      var q2=b[rr3][cc3];
      if(q2){if(q2.c===by&&(q2.t==='r'||q2.t==='q'))return true;break}
      rr3+=d2[0];cc3+=d2[1];
    }
  }
  for(var dr=-1;dr<=1;dr++)for(var dc2=-1;dc2<=1;dc2++){
    if(!dr&&!dc2)continue;
    var rr4=r+dr,cc4=c+dc2;
    if(inside(rr4,cc4)&&b[rr4][cc4]&&b[rr4][cc4].c===by&&b[rr4][cc4].t==='k')return true;
  }
  return false;
}
function inCheck(b,color){
  var k=findKing(b,color);return !k||attacked(b,k.r,k.c,other(color));
}

function rawMoves(b,r,c,extra){
  var p=b[r][c],out=[];if(!p)return out;
  var add=function(rr,cc,special){
    if(!inside(rr,cc))return false;
    var q=b[rr][cc];
    if(q&&q.c===p.c)return false;
    out.push({r:rr,c:cc,special:special||null});return !q;
  };
  if(p.t==='p'){
    var dir=p.c==='w'?-1:1,start=p.c==='w'?6:1;
    if(inside(r+dir,c)&&!b[r+dir][c]){
      out.push({r:r+dir,c:c});
      if(r===start&&!b[r+2*dir][c])out.push({r:r+2*dir,c:c,special:'double'});
    }
    for(var dc=-1;dc<=1;dc+=2){
      var rr=r+dir,cc=c+dc;
      if(!inside(rr,cc))continue;
      if(b[rr][cc]&&b[rr][cc].c!==p.c)out.push({r:rr,c:cc});
      if(extra&&extra.enpassant&&extra.enpassant.r===rr&&extra.enpassant.c===cc)out.push({r:rr,c:cc,special:'ep'});
    }
  }else if(p.t==='n'){
    [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]].forEach(a=>add(r+a[0],c+a[1]));
  }else if(p.t==='b'||p.t==='r'||p.t==='q'){
    var ds=[];
    if(p.t==='b'||p.t==='q')ds=ds.concat([[1,1],[1,-1],[-1,1],[-1,-1]]);
    if(p.t==='r'||p.t==='q')ds=ds.concat([[1,0],[-1,0],[0,1],[0,-1]]);
    for(var d of ds){
      var rr2=r+d[0],cc2=c+d[1];
      while(inside(rr2,cc2)){
        var can=add(rr2,cc2);if(!can)break;rr2+=d[0];cc2+=d[1];
      }
    }
  }else if(p.t==='k'){
    for(var dr=-1;dr<=1;dr++)for(var dc2=-1;dc2<=1;dc2++){if(dr||dc2)add(r+dr,c+dc2)}
    var home=p.c==='w'?7:0;
    if(r===home&&c===4&&!inCheck(b,p.c)){
      var rookK=b[home][7],rookQ=b[home][0];
      if(rookK&&rookK.c===p.c&&rookK.t==='r'&&!rookK.m&&!b[home][5]&&!b[home][6]&&!attacked(b,home,5,other(p.c))&&!attacked(b,home,6,other(p.c)))out.push({r:home,c:6,special:'castleK'});
      if(rookQ&&rookQ.c===p.c&&rookQ.t==='r'&&!rookQ.m&&!b[home][1]&&!b[home][2]&&!b[home][3]&&!attacked(b,home,3,other(p.c))&&!attacked(b,home,2,other(p.c)))out.push({r:home,c:2,special:'castleQ'});
    }
  }
  return out;
}

function applyMove(b,m,extra){
  var nb=cloneBoard(b),p=nb[m.fr][m.fc],captured=nb[m.tr][m.tc],epCapture=null;
  if(m.special==='ep'){epCapture=nb[m.fr][m.tc];captured=epCapture;nb[m.fr][m.tc]=null}
  nb[m.fr][m.fc]=null;
  if(m.special==='castleK'){nb[m.tr][m.tc]=p;nb[m.tr][m.tc].m=true;nb[m.tr][5]=nb[m.tr][7];nb[m.tr][7]=null;if(nb[m.tr][5])nb[m.tr][5].m=true}
  else if(m.special==='castleQ'){nb[m.tr][m.tc]=p;nb[m.tr][m.tc].m=true;nb[m.tr][3]=nb[m.tr][0];nb[m.tr][0]=null;if(nb[m.tr][3])nb[m.tr][3].m=true}
  else{
    nb[m.tr][m.tc]=p; p.m=true;
    if(p.t==='p'&&(m.tr===0||m.tr===7))p.t=extra&&extra.promotion||'q';
  }
  return {board:nb,captured:captured};
}
function legalMoves(b,r,c,extra){
  var p=b[r][c],out=[];if(!p)return out;
  var raws=rawMoves(b,r,c,extra);
  for(var m of raws){
    var test=applyMove(b,{fr:r,fc:c,tr:m.r,tc:m.c,special:m.special},extra).board;
    if(!inCheck(test,p.c))out.push({fr:r,fc:c,tr:m.r,tc:m.c,special:m.special});
  }
  return out;
}
function allMoves(b,color,extra){
  var out=[];for(var r=0;r<8;r++)for(var c=0;c<8;c++)if(b[r][c]&&b[r][c].c===color)out.push.apply(out,legalMoves(b,r,c,extra));
  return out;
}

function squareName(r,c){return files[c]+(8-r)}
function snapshot(){
  return {board:cloneBoard(board),turn:turn,halfmove:halfmove,fullmove:fullmove,lastMove:lastMove,checkSquare:checkSquare,statusText:statusText}
}

function reset(){
  board=initial();turn='w';selected=null;legalForSelected=[];history=[];halfmove=0;fullmove=1;lastMove=null;checkSquare=null;
  botThinking=false;gameOver=false;statusText='';anim=0;
  hintEl.textContent=vsBot?'Tap bidak lalu tujuan. Kamu bermain WHITE melawan BOT.':'Tap bidak lalu tujuan. Dua pemain lokal.';
  updateHUD();tone(440,.12,'sine',.06);setTimeout(()=>tone(660,.14,'sine',.05),90);
}

function updateHUD(){
  turnEl.textContent=turn==='w'?'WHITE':'BLACK';
  moveEl.textContent=String(fullmove);
  turnEl.style.color=turn==='w'?'#f3e8bf':'#d8e4ff';
}

function commitMove(m,promo){
  if(gameOver)return false;
  var extra={promotion:promo||'q'};
  var before=snapshot(),res=applyMove(board,m,extra);
  history.push(before);board=res.board;lastMove=m;
  if(m.special==='castleK'||m.special==='castleQ')sCastle();else if(res.captured)sCapture();else sMove();
  if(board[m.tr][m.tc]&&board[m.tr][m.tc].t==='p'&&(m.tr===0||m.tr===7)){board[m.tr][m.tc].t=promo||'q'}
  if(board[m.tr][m.tc]&&board[m.tr][m.tc].t==='p')halfmove=0;else if(res.captured)halfmove=0;else halfmove++;
  if(turn==='b')fullmove++;
  // En passant target is derived only for immediate next move.
  var ep=null;
  if(board[m.tr][m.tc]&&board[m.tr][m.tc].t==='p'&&Math.abs(m.tr-m.fr)===2)ep={r:(m.tr+m.fr)/2,c:m.fc};
  turn=other(turn);updateHUD();
  selected=null;legalForSelected=[];
  var enemyMoves=allMoves(board,turn,{enpassant:ep});
  var enemyCheck=inCheck(board,turn);
  checkSquare=enemyCheck?findKing(board,turn):null;
  if(enemyCheck)sCheck();
  if(!enemyMoves.length){
    gameOver=true;
    if(enemyCheck){statusText=(turn==='w'?'BLACK':'WHITE')+' WINS · CHECKMATE';hintEl.textContent=statusText}
    else{statusText='DRAW · STALEMATE';hintEl.textContent=statusText}
    sEnd();
  }else if(enemyCheck){
    hintEl.textContent='CHECK! '+(turn==='w'?'WHITE':'BLACK')+' harus merespons.';
  }else{
    hintEl.textContent=vsBot&&turn==='b'?'BOT sedang berpikir…':'Giliran '+(turn==='w'?'WHITE':'BLACK')+'.';
  }
  draw();
  return true;
}

/* Keep en-passant state by deriving from last two-step pawn move in current position. */
function currentExtra(){
  if(!lastMove)return {};
  var moved=board[lastMove.tr][lastMove.tc];
  if(moved&&moved.t==='p'&&Math.abs(lastMove.tr-lastMove.fr)===2){
    return {enpassant:{r:(lastMove.tr+lastMove.fr)/2,c:lastMove.fc}};
  }
  return {};
}

function promoteChoice(){
  // Compact mobile promotion menu.
  var pick=prompt('Promosi pion: Q = Ratu, R = Benteng, B = Gajah, N = Kuda','Q');
  var v=(pick||'Q').toLowerCase();return ['q','r','b','n'].includes(v)?v:'q';
}
function clickBoard(clientX,clientY){
  var rect=cv.getBoundingClientRect();
  var mx=(clientX-rect.left)*(W/rect.width),my=(clientY-rect.top)*(H/rect.height);
  var bx=8,by=56,size=48;
  if(mx<bx||mx>=bx+size*8||my<by||my>=by+size*8)return;
  var cc=Math.floor((mx-bx)/size),rr=Math.floor((my-by)/size);
  if(flipped){rr=7-rr;cc=7-cc}
  if(gameOver||botThinking)return;
  if(vsBot&&turn==='b')return;
  var p=board[rr][cc],extra=currentExtra();
  if(selected){
    var dest=legalForSelected.find(m=>m.tr===rr&&m.tc===cc);
    if(dest){
      var moving=board[selected.r][selected.c],promo=null;
      if(moving.t==='p'&&(rr===0||rr===7))promo=promoteChoice();
      commitMove(dest,promo);
      if(vsBot&&!gameOver&&turn==='b')setTimeout(botMove,260);
      return;
    }
  }
  if(p&&p.c===turn){
    selected={r:rr,c:cc};legalForSelected=legalMoves(board,rr,cc,extra);tone(430,.05,'triangle',.05);
    hintEl.textContent=(turn==='w'?'WHITE':'BLACK')+' · '+squareName(rr,cc)+' · '+legalForSelected.length+' legal moves';
  }else{
    selected=null;legalForSelected=[];
  }
  draw();
}
cv.addEventListener('pointerdown',function(e){e.preventDefault();audio();clickBoard(e.clientX,e.clientY)});

/* ============ SIMPLE BOT ============ */
var vals={p:100,n:320,b:330,r:500,q:900,k:20000};
function evaluate(b){
  var s=0;
  for(var r=0;r<8;r++)for(var c=0;c<8;c++){var p=b[r][c];if(!p)continue;var center=(3.5-Math.abs(3.5-c))+(3.5-Math.abs(3.5-r));var v=vals[p.t]+center*(p.t==='p'?2.4:1.1);s+=(p.c==='b'?v:-v)}
  return s;
}
function botMove(){
  if(!vsBot||turn!=='b'||gameOver||botThinking)return;
  botThinking=true;hintEl.textContent='BOT sedang memilih langkah…';draw();
  setTimeout(function(){
    var moves=allMoves(board,'b',currentExtra());
    if(!moves.length){botThinking=false;return}
    var best=-1e9,bestMoves=[];
    for(var m of moves){
      var res=applyMove(board,m,{promotion:'q'}),score;
      var gives=inCheck(res.board,'w'), reply=allMoves(res.board,'w',{});
      score=evaluate(res.board);
      if(gives)score+=120;
      if(!reply.length&&gives)score+=5000;
      if(board[m.tr][m.tc])score+=vals[board[m.tr][m.tc].t]*0.7;
      score+=(Math.random()-0.5)*35;
      if(score>best){best=score;bestMoves=[m]}else if(Math.abs(score-best)<25)bestMoves.push(m);
    }
    var chosen=bestMoves[Math.floor(Math.random()*bestMoves.length)];
    botThinking=false;
    var moving=board[chosen.fr][chosen.fc],promo=(moving.t==='p'&&(chosen.tr===0||chosen.tr===7))?'q':null;
    commitMove(chosen,promo);
  },220);
}

/* ============ BUTTONS ============ */
document.getElementById('newB').addEventListener('pointerdown',function(e){e.preventDefault();audio();reset();draw()});
document.getElementById('botB').addEventListener('pointerdown',function(e){
  e.preventDefault();audio();vsBot=!vsBot;this.textContent=vsBot?'🤖 VS BOT':'👥 2 PLAYER';reset();draw();
});
document.getElementById('flipB').addEventListener('pointerdown',function(e){e.preventDefault();flipped=!flipped;draw()});
window.addEventListener('keydown',function(e){
  if(e.key==='Escape'){selected=null;legalForSelected=[];draw()}
  if(e.key.toLowerCase()==='n'){reset();draw()}
  if(e.key.toLowerCase()==='f'){flipped=!flipped;draw()}
});

/* ============ DRAW ============ */
function rr(x0,y0,w0,h0,r0){
  ctx.beginPath();ctx.moveTo(x0+r0,y0);ctx.lineTo(x0+w0-r0,y0);ctx.quadraticCurveTo(x0+w0,y0,x0+w0,y0+r0);
  ctx.lineTo(x0+w0,y0+h0-r0);ctx.quadraticCurveTo(x0+w0,y0+h0,x0+w0-r0,y0+h0);
  ctx.lineTo(x0+r0,y0+h0);ctx.quadraticCurveTo(x0,y0+h0,x0,y0+h0-r0);ctx.lineTo(x0,y0+r0);ctx.quadraticCurveTo(x0,y0,x0+r0,y0);ctx.closePath();
}
function drawPiece(p,cx,cy){
  var ch=PIECES[p.c][p.t],font='42px "DejaVu Sans", "Noto Sans Symbols 2", serif';
  ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=font;
  ctx.shadowColor=p.c==='w'?'rgba(255,255,255,.25)':'rgba(0,0,0,.65)';ctx.shadowBlur=4;
  if(p.c==='w'){ctx.fillStyle='#fff9e9';ctx.strokeStyle='rgba(31,35,45,.8)'}else{ctx.fillStyle='#20242d';ctx.strokeStyle='rgba(255,240,190,.16)'}
  ctx.lineWidth=1.2;ctx.strokeText(ch,cx,cy+2);ctx.fillText(ch,cx,cy+2);ctx.restore();
}
function draw(){
  anim++;
  ctx.setTransform(DPR,0,0,DPR,0,0);
  ctx.clearRect(0,0,W,H);

  var bg=ctx.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#0a1020');bg.addColorStop(1,'#050914');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);

  // Top status panel.
  rr(8,8,388,40,11);ctx.fillStyle='rgba(14,21,39,.95)';ctx.fill();
  ctx.strokeStyle='rgba(233,215,154,.22)';ctx.lineWidth=1;ctx.stroke();
  ctx.textAlign='left';ctx.font='800 10px Arial';ctx.fillStyle='#9bacca';
  ctx.fillText(vsBot?'MODE: PLAYER vs BOT':'MODE: LOCAL 2 PLAYER',18,24);
  ctx.textAlign='right';ctx.fillStyle=checkSquare?'#ff7f8d':'#d5c68f';
  ctx.fillText(gameOver?statusText:(checkSquare?'CHECK':'READY'),386,24);

  var ox=8,oy=56,size=48;
  // Board shadow/frame.
  rr(4,52,396,396,14);ctx.fillStyle='#17130c';ctx.fill();
  ctx.strokeStyle='rgba(233,215,154,.34)';ctx.lineWidth=2;ctx.stroke();

  for(var dr=0;dr<8;dr++)for(var dc=0;dc<8;dc++){
    var rr0=flipped?7-dr:dr,cc0=flipped?7-dc:dc;
    var light=(rr0+cc0)%2===0;
    var px=ox+dc*size,py=oy+dr*size;
    var isSel=selected&&selected.r===rr0&&selected.c===cc0;
    var isDest=legalForSelected.some(m=>m.tr===rr0&&m.tc===cc0);
    var isLast=lastMove&&((rr0===lastMove.fr&&cc0===lastMove.fc)||(rr0===lastMove.tr&&cc0===lastMove.tc));
    var isCheck=checkSquare&&checkSquare.r===rr0&&checkSquare.c===cc0;
    ctx.fillStyle=light?'#e8d9af':'#7a5b38';ctx.fillRect(px,py,size,size);
    if(isLast){ctx.fillStyle=light?'rgba(255,205,75,.38)':'rgba(210,158,48,.34)';ctx.fillRect(px,py,size,size)}
    if(isSel){ctx.fillStyle='rgba(70,170,255,.38)';ctx.fillRect(px,py,size,size)}
    if(isCheck){var g=ctx.createRadialGradient(px+24,py+24,3,px+24,py+24,31);g.addColorStop(0,'rgba(255,50,70,.8)');g.addColorStop(1,'rgba(255,50,70,0)');ctx.fillStyle=g;ctx.fillRect(px,py,size,size)}
    if(isDest){ctx.fillStyle='rgba(22,112,82,.72)';ctx.beginPath();ctx.arc(px+24,py+24,8,0,Math.PI*2);ctx.fill();if(board[rr0][cc0]){ctx.strokeStyle='rgba(22,112,82,.95)';ctx.lineWidth=4;ctx.beginPath();ctx.arc(px+24,py+24,20,0,Math.PI*2);ctx.stroke()}}
    var p=board[rr0][cc0];if(p)drawPiece(p,px+24,py+25);
  }

  // Coordinates.
  ctx.font='700 7px monospace';ctx.fillStyle='rgba(27,24,16,.72)';ctx.textAlign='center';
  for(var cc=0;cc<8;cc++)ctx.fillText(files[flipped?7-cc:cc],ox+cc*size+43,oy+size*8+11);
  ctx.textAlign='left';
  for(var rr1=0;rr1<8;rr1++)ctx.fillText(String(flipped?rr1+1:8-rr1),ox-5,oy+rr1*size+9);

  // Captured pieces and turn glow.
  rr(8,458,388,4,2);ctx.fillStyle='rgba(233,215,154,.18)';ctx.fill();

  if(botThinking){
    ctx.textAlign='center';ctx.font='800 11px Arial';ctx.fillStyle='rgba(233,215,154,'+(.55+.4*Math.sin(anim*.12))+')';
    ctx.fillText('BOT THINKING…',202,456);ctx.textAlign='left';
  }
}
reset();draw();

})();
</script>`

const SIG = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LVZlcmlmaWNhdGlvblNpZ25hdHVyZS5NZXRhZGF0YcN55YRyad2+ZA=="
const CERT1 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGEOvtJr968bbpKdZreOTwkk9aPN++XPE60RfuzNLkXXc7LE8BOkJOWRpo2oNXaRJ3uCNJ43HY3A+oetnvHSfcxWqmvvTSrBOI5V1NOD6RMsZ/st1XVPUx83AGps1l5jYBOYzqMNy6un2tToJ2Bt9bXRo29tWLZTu8m7TNY/hISwVpVc5tjSet5U7btPN+dMIx2UvykB1jcbWGsdklheeuz8RXSStNXzeaGvsf1lpZ/ugLE4b2BdmlRNKrY6zLE4qFtRYQoS7axOyQX+4QUyN2m9bfm7urQmn+QRSXJwMO7X5kAJJLbkVGJFt9Pm9VXPwQVrK2aaqiXlpusj+7DfDw00OULmYMmZDTqXM0nUVLxj13z0LhMQoQhhNG8utdUn4uKOFceliTZ/xiP+A54GnX9620641bqw3ctfh9NNXPsTEK8hAUD7FDqUhVntHmoEYYEHq8X1tHHZYP49/f2iezTiE8AUaoZo42/jIWQIKohOGNUib2hEqMkW8NsR8vPihvNuqPc0zKZcl6359YFQdjiiW8kCRD/rsDOr9v1eYLFZKYloFyzFqEgj+jcG/V47elOjShJ5CCPwatXwP6HIloVwtgygFsnOFmCg6Ojoivfoz8Nw1qxFwg5OU2cq/1WbWNELKnaFg4eUWCAIJ/3ZIJsEPkgemZxGhE+hdiNn9dkQYBJs1kx2BxdIkJmQ9vJSKkrMz6lTxZM3IJ9mhmKS6zYdU1ppeAao0/ayte997DQParb/AHLN79g0iW1ad0z8ir5jAl0q3a+UZPTSa4YiSqC2PZ/gfxG5wvL2mKmeKowG0RXjmEp5iNxrni+T/HRLZOoH7y0DQ24nMCPg"
const CERT2 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGHsL0Ccm0ELINFZ2IaBhKaeWnVuh0o6nZLCioCn9xpSADzwIS5VCWO+1eVXT2atJOyf7FYlpB0/JA3Us+aQtekuIkHu/zBXijORZ4ClF4+sF3cSTNg6gY/+6iwLK/zs3bMg+GeJrcI65vXfs95Shxlb2Rd5GRT2/2yBmR6Zkf5QwMJuptUHWtM26WY7/xlkEKGFYDZVqOSylusiOzSALa815zC6dCiHoJNLBEKMlaZZQOk57/+OYoU5zzTaEgLhyvNFHSyAlyLQ3SGFtVHAaJZHSmmSPyJowCOB+92Gkk6SWVMsk6FbU8QJWFtlhzV/W/gZ7WzUlS/AKgN0th9/cq20ToFkW7X9c+rtYavufmuieqFhXgaMD8AGsoN9QC/HzNC9D1nydPfFYEUr9BHVy2nF5gM58Y59r2rT8p5LPARIkUp8g+5DLhyW0tdZFZ1305o4AHCayZnp5rjcU2Xi/c1Qf/djBGakmijlMs4aMzKJYD0c4Q8jdI7sNyd876K2wRD+L6KeD2QB3PtCS4P7BWAl5gh5CJ6ZBrwcaKXZqcSjEwm52MqVCgYZdapAaNYUy/QndttjLOG0wxxwuX1hIhMjPnIKZR1kwnqD5EqlHpilrnojRZvjVGN4zEKmilS8rNstt4HHs/D849W+Q6LRVWiWMs0cT2IugrX+Skxd8En7Gq52UEmuVBrSTpN+UpIu20NsVb9lsvuYh3XO441606tOEY2eKcZJdTtqrOTNqbbTk0zVn1yhbOCvmfctBNDhTwaC5QMi0P9wjU5XI9SBtkdQLizc5oqpoiHeqgb8+aJHVLcbgIJ/KLZKtRWFDfzRNM02Csx4etUUapVd2NA/L0oMs/O5T9sVj9FBJ7q99GWr3PVmxJb36mHZlXC4k1gGN9swE0LtzYsUdT5tUo9ri/hS3W/SM+F1p4Kh4QIgRcG3ciIHGN44bnDh3HDCz0fDnzKYw0bclMxZPctEyJ5gEOPF6OAkjD9dEaRGq/tEPf1k9Aub+v2dEjnfrYWAm4E5Zfhs2Xh0CT0k+SzhgKd0K/46ChJ20G5+blwpIvahvTVS68+aVIX6CwXs4tcVx6FnmVsMOOkIasfaqQLZYvNBkuLoZnQAq4j8yRekrQ=="

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

const pluginConfig = {
  name: "catur",
  alias: ['chess', 'caturn', 'rcatur'],
  category: "game",
  description: "Inline Chess game",
  usage: ".catur",
  example: ".catur",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 1,
  energi: 0,
  isEnabled: true,
}

async function handler(m, { sock }) {
  try {
    await kirimForwardSigned(sock, m.chat, CATUR_HTML, '♟️ RIMURU CHESS v1')
  } catch (e) {
    console.error('[CATUR]', e?.message || e)
    await m.reply('❌ Gagal mengirim game: ' + (e?.message || e))
  }
}

export { pluginConfig as config, handler }
export default { config: pluginConfig, handler }