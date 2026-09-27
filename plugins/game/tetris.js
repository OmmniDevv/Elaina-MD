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
 */

import { randomUUID } from 'crypto'

const TETRIS_HTML = `<style>
*{box-sizing:border-box;margin:0;padding:0;font-family:Arial,sans-serif;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}
html,body{width:100%;min-height:100%;background:#0e0718;color:#f6f0ff}
body{padding:8px;overflow-y:auto}
#tetris-app{width:min(94vw,420px);margin:0 auto;padding:4px}
.t-title{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin:2px 2px 10px}
.t-name{font:900 20px Arial Black,Arial,sans-serif;letter-spacing:1px;color:#f4e8ff;text-shadow:0 0 12px rgba(184,89,255,.35)}
.t-sub{font:700 8px Arial;letter-spacing:2px;color:#a89bb7;margin-top:2px}
.t-brand{font:900 11px Arial;color:#b998ff;margin-top:2px}
.t-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-bottom:10px}
.t-stat{background:#21142f;border:1px solid rgba(255,255,255,.04);border-radius:11px;padding:8px 5px;text-align:center;box-shadow:inset 0 1px rgba(255,255,255,.03)}
.t-stat b{display:block;font:900 19px Arial Black,Arial;color:#fff}
.t-stat span{display:block;font:700 8px Arial;letter-spacing:1px;color:#a89bb7;margin-top:2px}
.t-main{display:grid;grid-template-columns:minmax(0,1fr) 92px;gap:10px;align-items:start}
.t-board-wrap{background:#180e22;border:2px solid #342341;border-radius:16px;padding:8px;box-shadow:0 8px 22px rgba(0,0,0,.24)}
#t-board{display:grid;grid-template-columns:repeat(10,1fr);grid-template-rows:repeat(20,1fr);width:100%;aspect-ratio:1/2;border-radius:9px;overflow:hidden;background:#07040b;border:1px solid #33253b}
.t-cell{position:relative;border:1px solid rgba(255,255,255,.035);background:#0b0710;overflow:hidden}
.t-cell.filled{box-shadow:inset 0 0 0 2px rgba(255,255,255,.25),inset 0 0 12px rgba(255,255,255,.16)}
.t-cell.active{box-shadow:inset 0 0 0 2px rgba(255,255,255,.56),0 0 9px rgba(255,255,255,.18)}
.t-cell.cyan{background:#30d5e8}.t-cell.yellow{background:#f5d85a}.t-cell.purple{background:#ad6cff}.t-cell.green{background:#57d77e}.t-cell.red{background:#ff5b69}.t-cell.blue{background:#5b8dff}.t-cell.orange{background:#ff9b4a}
.t-preview{background:#21142f;border:1px solid rgba(255,255,255,.04);border-radius:12px;padding:9px}
.t-preview h4{font:800 10px Arial;letter-spacing:1.2px;color:#a89bb7;margin-bottom:8px}
#t-next{display:grid;grid-template-columns:repeat(4,12px);grid-auto-rows:12px;gap:2px;justify-content:center;min-height:58px;align-content:center;background:#110a18;border-radius:10px}
.ncell{width:12px;height:12px;border-radius:2px;background:transparent}.ncell.cyan{background:#30d5e8}.ncell.yellow{background:#f5d85a}.ncell.purple{background:#ad6cff}.ncell.green{background:#57d77e}.ncell.red{background:#ff5b69}.ncell.blue{background:#5b8dff}.ncell.orange{background:#ff9b4a}
.t-side{margin-top:8px;display:flex;flex-direction:column;gap:7px}
.t-mini{background:#21142f;border:1px solid rgba(255,255,255,.04);border-radius:10px;padding:7px;text-align:center;color:#b7a7c8;font:700 8px Arial;line-height:1.3}
.t-controls{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px}
.t-btn{height:54px;border:0;border-radius:13px;background:#25192f;color:#fff;box-shadow:0 5px 0 rgba(0,0,0,.24),inset 0 1px rgba(255,255,255,.04);font:700 22px Arial;cursor:pointer;touch-action:manipulation}
.t-btn:active{transform:translateY(4px);box-shadow:0 1px 0 rgba(0,0,0,.24);filter:brightness(1.18)}
.t-btn.small{font-size:24px}.t-btn.drop{font-size:14px;line-height:1.1}.t-btn.reset{font-size:20px}
.t-drop{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}
.t-info{text-align:center;color:#a89bb7;font:600 9px Arial;line-height:1.55;margin:9px 6px 2px}
.t-over{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;background:rgba(10,4,16,.78);backdrop-filter:blur(2px);color:#fff;text-align:center}
.t-over b{font:900 24px Arial Black,Arial;color:#ff7d97;text-shadow:0 0 12px rgba(255,85,115,.28)}
.t-over span{font:700 10px Arial;color:#c2b4cf;margin-top:5px}
#t-wrap{position:relative}
@media (max-width:360px){.t-main{grid-template-columns:minmax(0,1fr) 82px}.t-stat b{font-size:17px}.t-btn{height:50px}.t-preview{padding:7px}}
</style>
<div id="tetris-app">
  <div class="t-title"><div><div class="t-name">TETRIS</div><div class="t-sub">DROP • MOVE • CLEAR</div></div><div class="t-brand">oh</div></div>
  <div class="t-stats">
    <div class="t-stat"><b id="t-score">0</b><span>SCORE</span></div>
    <div class="t-stat"><b id="t-lines">0</b><span>LINES</span></div>
    <div class="t-stat"><b id="t-level">1</b><span>LEVEL</span></div>
  </div>
  <div class="t-main">
    <div class="t-board-wrap">
      <div id="t-wrap"><div id="t-board"></div><div id="t-overlay" style="display:none" class="t-over"><b>GAME OVER</b><span id="t-over-text">Tekan ↻ untuk mulai lagi</span></div></div>
      <div class="t-controls">
        <button class="t-btn" id="t-left" aria-label="Kiri">‹</button>
        <button class="t-btn reset" id="t-reset" aria-label="Reset">↻</button>
        <button class="t-btn" id="t-right" aria-label="Kanan">›</button>
      </div>
      <div class="t-drop">
        <button class="t-btn drop" id="t-soft">⌄ Soft Drop</button>
        <button class="t-btn drop" id="t-hard">⇣ Hard Drop</button>
      </div>
    </div>
    <div>
      <div class="t-preview"><h4>NEXT</h4><div id="t-next"></div></div>
      <div class="t-side">
        <div class="t-mini" id="t-piece-info">Blok turun dari atas</div>
        <div class="t-mini">Tap papan untuk mengarahkan blok ke kolom yang kamu pilih.</div>
        <button class="t-btn small" id="t-rotate" aria-label="Rotasi">⟳</button>
      </div>
    </div>
  </div>
  <div class="t-info">Klik ‹ / › untuk geser · ⟳ untuk putar · Soft Drop untuk mempercepat · Hard Drop untuk jatuhkan langsung. Baris penuh langsung hancur.</div>
</div>
<script>
(function(){
  'use strict';
  var W=10,H=20;
  var shapes={
    I:[[1,1,1,1]],
    O:[[1,1],[1,1]],
    T:[[0,1,0],[1,1,1]],
    S:[[0,1,1],[1,1,0]],
    Z:[[1,1,0],[0,1,1]],
    J:[[1,0,0],[1,1,1]],
    L:[[0,0,1],[1,1,1]]
  };
  var colors={I:'cyan',O:'yellow',T:'purple',S:'green',Z:'red',J:'blue',L:'orange'};
  var board,active,nextType,score,lines,level,over,dropTimer,dropDelay,locked=false;
  var scoreEl=document.getElementById('t-score'),linesEl=document.getElementById('t-lines'),levelEl=document.getElementById('t-level');
  var boardEl=document.getElementById('t-board'),nextEl=document.getElementById('t-next'),overlay=document.getElementById('t-overlay'),overText=document.getElementById('t-over-text');
  function clone(m){return m.map(function(r){return r.slice()});}
  function randomType(){var k=Object.keys(shapes);return k[Math.floor(Math.random()*k.length)];}
  function resetBoard(){board=[];for(var r=0;r<H;r++){board[r]=[];for(var c=0;c<W;c++)board[r][c]=null;}}
  function newActive(type){
    var m=clone(shapes[type]);
    return {type:type,shape:m,x:Math.floor((W-m[0].length)/2),y:-1};
  }
  function canPlace(p,dx,dy,shape){shape=shape||p.shape;for(var r=0;r<shape.length;r++)for(var c=0;c<shape[r].length;c++)if(shape[r][c]){var x=p.x+c+dx,y=p.y+r+dy;if(x<0||x>=W||y>=H)return false;if(y>=0&&board[y][x])return false;}return true;}
  function merge(){for(var r=0;r<active.shape.length;r++)for(var c=0;c<active.shape[r].length;c++)if(active.shape[r][c]){var y=active.y+r,x=active.x+c;if(y>=0)board[y][x]=active.type;}}
  function clearLines(){var cleared=0;for(var r=H-1;r>=0;r--){var full=true;for(var c=0;c<W;c++)if(!board[r][c]){full=false;break;}if(full){board.splice(r,1);var row=[];for(var k=0;k<W;k++)row.push(null);board.unshift(row);cleared++;r++;}}
    if(cleared){var pts=[0,100,300,500,800][cleared]||1200;score+=pts*level;lines+=cleared;level=1+Math.floor(lines/10);dropDelay=Math.max(90,750-(level-1)*55);restartTimer();}
  }
  function rotate(){
    if(over||locked)return;
    var s=active.shape, rows=s.length, cols=s[0].length, n=[];
    for(var c=0;c<cols;c++){n[c]=[];for(var r=rows-1;r>=0;r--)n[c].push(s[r][c]);}
    var kicks=[0,-1,1,-2,2];
    for(var i=0;i<kicks.length;i++)if(canPlace(active,kicks[i],0,n)){active.shape=n;active.x+=kicks[i];render();return;}
  }
  function move(dx){if(over||locked)return;if(canPlace(active,dx,0)){active.x+=dx;render();}}
  function softDrop(){if(over||locked)return;if(canPlace(active,0,1)){active.y++;score+=1;render();}else lockPiece();}
  function hardDrop(){if(over||locked)return;var d=0;while(canPlace(active,0,d+1))d++;active.y+=d;score+=2*d;lockPiece();}
  function lockPiece(){if(locked)return;locked=true;merge();clearLines();spawn();locked=false;render();}
  function spawn(){
    active=newActive(nextType||randomType());nextType=randomType();
    if(!canPlace(active,0,0)){over=true;clearInterval(dropTimer);overlay.style.display='flex';overText.textContent='Score '+score+' · Tekan ↻ untuk main lagi';}
  }
  function tick(){if(over)return;if(canPlace(active,0,1)){active.y++;render();}else lockPiece();}
  function restartTimer(){clearInterval(dropTimer);if(!over)dropTimer=setInterval(tick,dropDelay);}
  function start(){score=0;lines=0;level=1;dropDelay=750;over=false;locked=false;overlay.style.display='none';resetBoard();active=newActive(randomType());nextType=randomType();restartTimer();render();}
  function render(){
    for(var i=0;i<W*H;i++){var cell=boardEl.children[i],r=Math.floor(i/W),c=i%W;cell.className='t-cell';var v=board[r][c];if(v)cell.classList.add('filled',colors[v]);}
    if(active){for(var r=0;r<active.shape.length;r++)for(var c=0;c<active.shape[r].length;c++)if(active.shape[r][c]){var x=active.x+c,y=active.y+r;if(y>=0&&y<H&&x>=0&&x<W){var idx=y*W+x;boardEl.children[idx].classList.add('active',colors[active.type]);}}}
    scoreEl.textContent=score;linesEl.textContent=lines;levelEl.textContent=level;
    renderNext();
  }
  function renderNext(){nextEl.innerHTML='';var s=shapes[nextType]||shapes.I;var cols=Math.max(4,s[0].length);nextEl.style.gridTemplateColumns='repeat('+cols+',12px)';for(var r=0;r<s.length;r++)for(var c=0;c<cols;c++){var d=document.createElement('div');d.className='ncell'+(s[r]&&s[r][c]?(' '+colors[nextType]):'');nextEl.appendChild(d);}}
  function buildBoard(){boardEl.innerHTML='';for(var i=0;i<W*H;i++){var d=document.createElement('div');d.className='t-cell';d.dataset.index=i;d.addEventListener('click',function(){var idx=Number(this.dataset.index),col=idx%W;if(over)return;var center=active.x+(active.shape[0].length-1)/2;if(col<center)move(-1);else if(col>center)move(1);else rotate();});boardEl.appendChild(d);}}
  document.getElementById('t-left').addEventListener('click',function(){move(-1)});
  document.getElementById('t-right').addEventListener('click',function(){move(1)});
  document.getElementById('t-rotate').addEventListener('click',rotate);
  document.getElementById('t-soft').addEventListener('click',softDrop);
  document.getElementById('t-hard').addEventListener('click',hardDrop);
  document.getElementById('t-reset').addEventListener('click',start);
  document.addEventListener('keydown',function(e){var k=e.key;if(k==='ArrowLeft')move(-1);else if(k==='ArrowRight')move(1);else if(k==='ArrowUp')rotate();else if(k==='ArrowDown')softDrop();else if(k===' ')hardDrop();});
  buildBoard();start();
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
</script>`

const SIG = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LVZlcmlmaWNhdGlvblNpZ25hdHVyZS5NZXRhZGF0YcN55YRyad2+ZA=="
const CERT1 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGEOvtJr968bbpKdZreOTwkk9aPN++XPE60RfuzNLkXXc7LE8BOkJOWRpo2oNXaRJ3uCNJ43HY3A+oetnvHSfcxWqmvvTSrBOI5V1NOD6RMsZ/st1XVPUx83AGps1l5jYBOYzqMNy6un2tToJ2Bt9bXRo29tWLZTu8m7TNY/hISwVpVc5tjSet5U7btPN+dMIx2UvykB1jcbWGsdklheeuz8RXSStNXzeaGvsf1lpZ/ugLE4b2BdmlRNKrY6zLE4qFtRYQoS7axOyQX+4QUyN2m9bfm7urQmn+QRSXJwMO7X5kAJJLbkVGJFt9Pm9VXPwQVrK2aaqiXlpusj+7DfDw00OULmYMmZDTqXM0nUVLxj13z0LhMQoQhhNG8utdUn4uKOFceliTZ/xiP+A54GnX9620641bqw3ctfh9NNXPsTEK8hAUD7FDqUhVntHmoEYYEHq8X1tHHZYP49/f2iezTiE8AUaoZo42/jIWQIKohOGNUib2hEqMkW8NsR8vPihvNuqPc0zKZcl6359YFQdjiiW8kCRD/rsDOr9v1eYLFZKYloFyzFqEgj+jcG/V47elOjShJ5CCPwatXwP6HIloVwtgygFsnOFmCg6Ojoivfo8Nw1qxFwg5OU2cq/1WbWNELKnaFg4eUWCAIJ/3ZIJsEPkgemZxGhE+hdiNn9dkQYBJs1kx2BxdIkJmQ9vJSKkrMz6lTxZM3IJ9mhmKS6zYdU1ppeAao0/ayte997DQParb/AHLN79g0iW1ad0z8ir5jAl0q3a+UZPTSa4YiSqC2PZ/gfxG5wvL2mKmeKowG0RXjmEp5iNxrni+T/HRLZOoH7y0DQ24nMCPg"
const CERT2 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGHsL0Ccm0ELINFZ2IaBhKaeWnVuh0o6nZLCioCn9xpSADzwIS5VCWO+1eVXT2atJOyf7FYlpB0/JA3Us+aQtekuIkHu/zBXijORZ4ClF4+sF3cSTNg6gY/+6iwLK/zs3bMg+GeJrcI65vXfs95Shxlb2Rd5GRT2/2yBmR6Zkf5QwMJuptUHWtM26WY7/xlkEKGFYDZVqOSylusiOzSALa815zC6dCiHoJNLBEKMlaZZQOk57/+OYoU5zzTaEgLhyvNFHSyAlyLQ3SGFtVHAaJZHSmmSPyJowCOB+92Gkk6SWVMsk6FbU8QJWFtlhzV/W/gZ7WzUlS/AKgN0th9/cq20ToFkW7X9c+rtYavufmuieqFhXgaMD8AGsoN9QC/HzNC9D1nydPfFYEUr9BHVy2nF5gM58Y59r2rT8p5LPARIkUp8g+5DLhyW0tdZFZ1305o4AHCayZnp5rjcU2Xi/c1Qf/djBGakmijlMs4aMzKJYD0c4Q8jdI7sNyd876K2wRD+L6KeD2QB3PtCS4P7BWAl5gh5CJ6ZBrwcaKXZqcSjEwm52MqVCgYZdapAaNYUy/QndttjLOG0wxxwuX1hIhMjPnIKZR1kwnqD5EqlHpilrnojRZvjVGN4zEKmilS8rNstt4HHs/D849W+Q6LRVWiWMs0cT2IugrX+Skxd8En7Gq52UEmuVBrSTpN+UpIu20NsVb9lsvuYh3XO441606tOEY2eKcZJdTtqrOTNqbbTk0zVn1yhbOCvmfctBNDhTwaC5QMi0P9wjU5XI9SBtkdQLizc5oqpoiHeqgb8+aJHVLcbgIJ/KLZKtRWFDfzRNM02Csx4etUUapVd2NA/L0oMs/O5T9sVj9FBJ7q99GWr3PVmxJb36mHZlXC4k1gGN9swE0LtzYsUdT5tUo9ri/hS3W/SM+F1p4Kh4QIgRcG3ciIHGN44bnDh3HDCz0fDnzKYw0bclMxZPctEyJ5gEOPF6OAkjD9dEaRGq/tEPf1k9Aub+v2dEjnfrYWAm4Qq4j8yRekrQ=="

async function kirimForwardSigned(sock, chatId, html, judul) {
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

    return sock.relayMessage(chatId, {
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
                    unifiedResponse: { data },
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedAiBotMessageInfo: { botJid: "867051314767696@bot" },
                        forwardOrigin: 4
                    }
                }
            }
        }
    }, {})
}

const pluginConfig = {
  name: 'tetris',
  alias: ['tetri'],
  category: 'game',
  description: 'Game Tetris inline HTML',
  usage: '.tetris',
  example: '.tetris',
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  isEnabled: true
}

const handler = async (m, { sock }) => {
    try {
        await kirimForwardSigned(sock, m.chat, TETRIS_HTML, '🧱 TETRIS')
    } catch (e) {
        console.error('[TETRIS]', e?.message || e)
        await sock.sendMessage(
            m.chat,
            { text: '❌ Gagal mengirim game: ' + (e?.message || e) },
            { quoted: m.raw }
        ).catch(() => {})
    }
}

handler.command = /^(?:tetris|tetri)$/i

export { pluginConfig as config, handler };
