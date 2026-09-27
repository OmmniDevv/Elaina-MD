/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { randomUUID } from 'crypto'

const SLOT_HTML = `<style>
*{box-sizing:border-box;margin:0;font-family:'Segoe UI',Arial,sans-serif;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent}
html,body{width:100%}
body{background:radial-gradient(circle at 50% 8%,#1d6a50,#0f4938 48%,#07291f);padding:9px;color:#e9e3bc;overflow-y:auto}
.machine{width:100%;max-width:420px;margin:0 auto;position:relative;padding:10px 12px 12px;border:4px solid #b9954d;border-radius:26px;background:linear-gradient(110deg,#061e17,#1b644b 12%,#0b382a 30%,#15543f 55%,#092f24 80%,#28775a 94%,#071f18);box-shadow:inset 0 0 0 3px #163f31,inset 0 16px 26px #73d2a31f,0 8px 0 #041a13,0 16px 24px #000c}
.lights{height:9px;margin:0 12px 7px;border:2px solid #123d2f;border-radius:8px;background:repeating-radial-gradient(circle at 6px 50%,#dfffdc 0 2px,#82c878 3px 5px,#164936 6px 12px);box-shadow:0 0 12px #67b881;animation:blink .55s steps(2) infinite}
.title{padding:10px 4px 8px;border:3px solid #b99a54;border-radius:16px 16px 11px 11px;color:#e9e3bc;background:radial-gradient(ellipse at 50% 0,#2b8a6c,#11513f 60%,#082a24);text-align:center;font:900 25px Impact,'Arial Black',sans-serif;letter-spacing:1px;text-shadow:0 3px #193f31,0 0 12px #7ddc8a66}
.jack{width:76%;margin:6px auto;padding:3px;border:2px solid #a98c4d;border-radius:9px;color:#ded7ad;background:linear-gradient(#245d48,#0b3025);text-align:center;font:bold 10px monospace;letter-spacing:1px}
.stats{display:flex;margin:0 2px 8px;padding:5px;border:2px solid #537d64;border-radius:9px;background:linear-gradient(#102d24,#061812);box-shadow:inset 0 0 9px #000}
.stats div{flex:1;border-right:1px solid #416452;text-align:center;font:bold 10px monospace;color:#91b59f}
.stats div:last-child{border:0}
.stats b{display:block;margin-top:2px;font-size:15px;color:#e3dfbb;text-shadow:0 0 6px #62a77d}
.frame{padding:8px;border:4px solid #315c47;border-radius:16px;background:linear-gradient(90deg,#09271e,#b49a59 5%,#174936 10%,#174936 90%,#b49a59 95%,#09271e);box-shadow:inset 0 0 0 3px #071b15,0 4px 0 #09271e,0 8px 15px #000a}
#reels{display:grid;grid-template-columns:repeat(5,1fr);height:192px;overflow:hidden;border:3px solid #071c15;border-radius:10px;background:#071a14;box-shadow:inset 0 12px 18px #0009,inset 0 -12px 18px #0009}
.reel{position:relative;overflow:hidden;background:linear-gradient(90deg,#8f6a39,#fff8d8 17%,#fffdf0 50%,#f0dfad 82%,#79552c);box-shadow:inset 7px 0 8px #573b1d55,inset -7px 0 8px #573b1d55}
.reel+.reel{border-left:2px solid #573512}
.reel:after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(#1c0d05bb 0,transparent 18%,transparent 80%,#281208cc 100%)}
.strip{will-change:transform}
.strip.moving{filter:blur(1.4px) saturate(1.2)}
.sym{height:64px;display:flex;align-items:center;justify-content:center;border-bottom:1px solid #9f7e4f44;font-family:'Apple Color Emoji','Segoe UI Emoji',sans-serif;font-size:40px;line-height:1;text-shadow:0 3px 0 #72101822,0 0 4px #fff}
.s7{font:900 42px Impact,'Arial Black',sans-serif;color:#ef1726;-webkit-text-stroke:2px #850815;text-shadow:0 3px #5d0509,0 0 5px #fff}
.sbar{width:52px;height:22px;display:flex;align-items:center;justify-content:center;font:900 12px 'Arial Black',sans-serif;color:#fff4c4;background:radial-gradient(ellipse at center,#e22d35 0,#6f0910 55%,transparent 56%);text-shadow:0 2px #401010}
.win{animation:winP .5s ease-in-out infinite;background:radial-gradient(circle,#fff8a9,#ffae00 55%,transparent 72%)}
@keyframes winP{50%{transform:scale(1.09);filter:brightness(1.4)}}
.message{height:34px;margin:9px 2px 7px;display:flex;align-items:center;justify-content:center;border:2px solid #537d64;border-radius:8px;background:linear-gradient(#102d24,#061812);box-shadow:inset 0 0 8px #000;color:#e3dfbb;font:bold 14px monospace;text-shadow:0 0 7px #62a77d;text-align:center}
.console{display:grid;grid-template-columns:46px 1fr 1.8fr;gap:8px;margin:0 3px;padding:9px 8px 11px;border:3px solid #416a53;border-radius:9px 9px 16px 16px;background:linear-gradient(#9c8c59,#315d48 37%,#0a2e22 39%,#123e2f);box-shadow:inset 0 2px #d9c992,0 6px #061d16,0 12px 18px #0009}
button{height:53px;border:3px solid #0b2e22;border-radius:13px;color:#fff;font-weight:900;cursor:pointer;touch-action:manipulation}
.mute{background:linear-gradient(#d9b04a,#8a6d08 55%,#5d4805);box-shadow:0 4px #3d2f02;font-size:18px}
.bet{background:linear-gradient(#4f9a77,#216348 53%,#103d2d);box-shadow:inset 0 4px 4px #d8ffe055,0 4px #092a20}
.spin{background:radial-gradient(circle at 50% 32%,#a8d96f,#4b8d46 47%,#1e542f 76%);box-shadow:inset 0 4px 5px #e8ffd488,0 4px #12351e,0 0 14px #79b85c88;font-size:18px;text-shadow:0 2px #06420d}
button:disabled{filter:saturate(.4) brightness(.75)}
.tray{width:48%;height:17px;margin:13px auto 0;border:4px solid #244d3a;border-radius:4px 4px 10px 10px;background:#061a13;box-shadow:inset 0 6px 9px #000,0 3px #897945}
.winner .lights{animation-duration:.16s}
.winner .title{animation:winP .6s ease-in-out 2}
.over{position:absolute;inset:0;z-index:10;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;border-radius:20px;background:#03150eec;color:#ffe5a0;text-align:center}
.over.off{display:none}
.over h2{margin:0 0 6px;font-size:24px;color:#ff3449;text-shadow:0 0 12px #f00}
.over p{font-size:13px;color:#cfe6c8}
.over button{padding:0 22px;height:40px;background:#ffd15a;color:#271204}
@keyframes blink{50%{filter:brightness(1.7)}}
</style>
<div class="machine" id="machine">
<div class="lights"></div>
<div class="title">FRUIT BONANZA</div>
<div class="jack">JACKPOT · 10.000 CREDITS</div>
<div class="stats"><div>CREDITS<b id="credits">500</b></div><div>BET<b id="betValue">10</b></div><div>BEST WIN<b id="best">0</b></div></div>
<div class="frame"><div id="reels"></div></div>
<div id="message" class="message">SPIN UNTUK MULAI</div>
<div class="console"><button id="mute" class="mute">🔊</button><button id="bet" class="bet">BET +</button><button id="spin" class="spin">🎰 SPIN</button></div>
<div class="tray"></div>
<div id="over" class="over off"><h2>GAME OVER</h2><p>Credits habis!<br>Best Win: <b id="finalBest">0</b></p><button id="restart">MAIN LAGI</button></div>
</div>
<script>
(function(){
var AC=null,MUTED=false;
try{MUTED=localStorage.getItem('slot_mute')==='1'}catch(e){}
function ac(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){return null}}if(AC.state==='suspended'){try{AC.resume()}catch(e){}}return AC;}
function tone(f,dur,type,vol,delay,slide){var a=ac();if(!a||MUTED)return;try{var t=a.currentTime+(delay||0),o=a.createOscillator(),g=a.createGain();o.type=type||'square';o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+dur);g.gain.setValueAtTime(vol||.12,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+dur+.03);}catch(e){}}
function sndClick(){tone(650,.05,'square',.08)}
function sndSpin(){tone(700,.28,'sawtooth',.06,0,150);for(var i=0;i<8;i++)tone(170,.03,'square',.05,.1+i*.1)}
function sndStop(c){tone(150+c*35,.09,'square',.16)}
function sndWin(){[660,880,1100].forEach(function(f,i){tone(f,.14,'triangle',.14,i*.09)})}
function sndJackpot(){[523,659,784,1046,784,1046,1318,1568].forEach(function(f,i){tone(f,.16,'square',.12,i*.11);tone(f/2,.16,'triangle',.08,i*.11)})}
function sndLose(){tone(220,.2,'sawtooth',.07);tone(160,.3,'sawtooth',.07,.14)}
function sndOver(){[392,330,262,196].forEach(function(f,i){tone(f,.3,'triangle',.12,i*.28)})}
document.addEventListener('pointerdown',function(){ac()},{once:true});
var SY=['🍒','🍋','🔔','💎','7','BAR'],WT=[30,25,18,12,8,7],PAY=[2,3,5,8,12,20],SH=64,LEN=10,OFF=7,credits=500,bet=10,best=0,busy=false,reels=[],C=document.getElementById('credits'),BV=document.getElementById('betValue'),BS=document.getElementById('best'),MSG=document.getElementById('message'),SP=document.getElementById('spin'),BT=document.getElementById('bet'),MUB=document.getElementById('mute'),OV=document.getElementById('over'),FB=document.getElementById('finalBest'),MCH=document.getElementById('machine');
function pick(){var n=Math.random()*100,s=0;for(var i=0;i<6;i++){s+=WT[i];if(n<s)return i}return 0}
function symHTML(v){return '<div class="sym">'+(v===4?'<i class="s7">7</i>':v===5?'<i class="sbar">BAR</i>':SY[v])+'</div>'}
function ui(){C.textContent=credits;BV.textContent=bet;BS.textContent=best}
function msg(t){MSG.textContent=t}
function clearWin(){for(var c=0;c<5;c++)for(var i=OFF;i<LEN;i++)reels[c].strip.children[i].classList.remove('win')}
function spin(){if(busy||credits<bet)return;busy=true;clearWin();credits-=bet;ui();SP.disabled=true;BT.disabled=true;msg('GOOD LUCK ✨');sndSpin();for(var c=0;c<5;c++){var r=reels[c],vals=[],h='';for(var i=0;i<LEN;i++)vals.push(pick());for(var j=0;j<LEN;j++)h+=symHTML(vals[j]);r.vals=vals;r.strip.innerHTML=h;r.strip.style.transition='none';r.strip.style.transform='translateY(0)';r.strip.offsetHeight;var dur=1.05+c*0.22;r.strip.classList.add('moving');r.strip.style.transition='transform '+dur+'s cubic-bezier(.12,.75,.25,1)';r.strip.style.transform='translateY(-'+(OFF*SH)+'px)';(function(st,d,ix){setTimeout(function(){st.classList.remove('moving');sndStop(ix)},d*1000)})(r.strip,dur,c)}setTimeout(evalBoard,2150)}
function evalBoard(){var grid=[];for(var c=0;c<5;c++)grid.push(reels[c].vals.slice(OFF));var lines=[[0,0,0,0,0],[1,1,1,1,1],[2,2,2,2,2],[0,1,2,1,0],[2,1,0,1,2]],total=0,wc=[];lines.forEach(function(p){var a=grid[0][p[0]],n=1;for(var x=1;x<5&&grid[x][p[x]]===a;x++)n++;if(n>=3){total+=Math.floor(bet*PAY[a]*(n===3?1:n===4?2:5));for(var i=0;i<n;i++)wc.push([i,p[i]])}});if(total){credits+=total;best=Math.max(best,total);wc.forEach(function(w){reels[w[0]].strip.children[OFF+w[1]].classList.add('win')});msg(total>=bet*20?'🎰 JACKPOT +'+total:'✨ MENANG +'+total);MCH.classList.add('winner');setTimeout(function(){MCH.classList.remove('winner')},1800);if(total>=bet*20)sndJackpot();else sndWin()}else{msg('💦 BELUM HOKI!');sndLose()}SP.disabled=false;BT.disabled=false;busy=false;ui();if(credits<10)setTimeout(gameover,900);else if(bet>credits){bet=10;ui()}}
function gameover(){FB.textContent=best;OV.className='over';sndOver()}
BT.onclick=function(){if(busy)return;sndClick();bet=bet===10?20:bet===20?50:10;if(bet>credits)bet=10;ui()};SP.onclick=spin;MUB.onclick=function(){MUTED=!MUTED;MUB.textContent=MUTED?'🔇':'🔊';try{localStorage.setItem('slot_mute',MUTED?'1':'0')}catch(e){}if(!MUTED)sndClick()};if(MUTED)MUB.textContent='🔇';
document.getElementById('restart').onclick=function(){sndClick();credits=500;bet=10;best=0;busy=false;OV.className='over off';msg('SPIN UNTUK MULAI');SP.disabled=false;BT.disabled=false;clearWin();ui()};
var box=document.getElementById('reels');for(var c=0;c<5;c++){var d=document.createElement('div');d.className='reel';var s=document.createElement('div');s.className='strip';d.appendChild(s);box.appendChild(d);var h='';for(var i=0;i<LEN;i++)h+=symHTML(pick());s.innerHTML=h;s.style.transform='translateY(-'+(OFF*SH)+'px)';reels.push({strip:s,vals:[0,0,0]})}ui();
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
const CERT1 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGEOvtJr968bbpKdZreOTwkk9aPN++XPE60RfuzNLkXXc7LE8BOkJOWRpo2oNXaRJ3uCNJ43HY3A+oetnvHSfcxWqmvvTSrBOI5V1NOD6RMsZ/st1XVPUx83AGps1l5jYBOYzqMNy6un2tToJ2Bt9bXRo29tWLZTu8m7TNY/hISwVpVc5tjSet5U7btPN+dMIx2UvykB1jcbWGsdklheeuz8RXSStNXzeaGvsf1lpZ/ugLE4b2BdmlRNKrY6zLE4qFtRYQoS7axOyQX+4QUyN2m9bfm7urQmn+QRSXJwMO7X5kAJJLbkVGJFt9Pm9VXPwQVrK2aaqiXlpusj+7DfDw00OULmYMmZDTqXM0nUVLxj13z0LhMQoQhhNG8utdUn4uKOFceliTZ/xiP+A54GnX9620641bqw3ctfh9NNXPsTEK8hAUD7FDqUhVntHmoEYYEHq8X1tHHZYP49/f2iezTiE8AUaoZo42/jIWQIKohOGNUib2hEqMkW8NsR8vPihvNuqPc0zKZcl6359YFQdjiiW8kCRD/rsDOr9v1eYLFZKYloFyzFqEgj+jcG/V47elOjShJ5CCPwatXwP6HIloVwtgygFsnOFmCg6Ojoivfoz8Nw1qxFwg5OU2cq/1WbWNELKnaFg4eUWCAIJ/3ZIJsEPkgemZxGhE+hdiNn9dkQYBJs1kx2BxdIkJmQ9vJSKkrMz6lTxZM3IJ9mhmKS6zYdU1ppeAao0/ayte997DQParb/AHLN79g0iW1ad0z8ir5jAl0q3a+UZPTSa4YiSqC2PZ/gfxG5wvL2mKmeKowG0RXjmEp5iNxrni+T/HRLZOoH7y0DQ24nMCPg"
const CERT2 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGHsL0Ccm0ELINFZ2IaBhKaeWnVuh0o6nZLCioCn9xpSADzwIS5VCWO+1eVXT2atJOyf7FYlpB0/JA3Us+aQtekuIkHu/zBXijORZ4ClF4+sF3cSTNg6gY/+6iwLK/zs3bMg+GeJrcI65vXfs95Shxlb2Rd5GRT2/2yBmR6Zkf5QwMJuptUHWtM26WY7/xlkEKGFYDZVqOSylusiOzSALa815zC6dCiHoJNLBEKMlaZZQOk57/+OYoU5zzTaEgLhyvNFHSyAlyLQ3SGFtVHAaJZHSmmSPyJowCOB+92Gkk6SWVMsk6FbU8QJWFtlhzV/W/gZ7WzUlS/AKgN0th9/cq20ToFkW7X9c+rtYavufmuieqFhXgaMD8AGsoN9QC/HzNC9D1nydPfFYEUr9BHVy2nF5gM58Y59r2rT8p5LPARIkUp8g+5DLhyW0tdZFZ1305o4AHCayZnp5rjcU2Xi/c1Qf/djBGakmijlMs4aMzKJYD0c4Q8jdI7sNyd876K2wRD+L6KeD2QB3PtCS4P7BWAl5gh5CJ6ZBrwcaKXZqcSjEwm52MqVCgYZdapAaNYUy/QndttjLOG0wxxwuX1hIhMjPnIKZR1kwnqD5EqlHpilrnojRZvjVGN4zEKmilS8rNstt4HHs/D849W+Q6LRVWiWMs0cT2IugrX+Skxd8En7Gq52UEmuVBrSTpN+UpIu20NsVb9lsvuYh3XO441606tOEY2eKcZJdTtqrOTNqbbTk0zVn1yhbOCvmfctBNDhTwaC5QMi0P9wjU5XI9SBtkdQLizc5oqpoiHeqgb8+aJHVLcbgIJ/KLZKtRWFDfzRNM02Csx4etUUapVd2NA/L0oMs/O5T9sVj9FBJ7q99GWr3PVmxJb36mHZlXC4k1gGN9swE0LtzYsUdT5tUo9ri/hS3W/SM+F1p4Kh4QIgRcG3ciIHGN44bnDh3HDCz0fDnzKYw0bclMxZPctEyJ5gEOPF6OAkjD9dEaRGq/tEPf1k9Aub+v2dEjnfrYWAm4E5Zfhs2Xh0CT0k+SzhgKd0K/46ChJ20G5+blwpIvahvTVS68+aVIX6CwXs4tcVx6FnmVsMOOkIasfaqQLZYvNBkuLoZnQAq4j8yRekrQ=="

async function kirimSlot(conn, chatId) {
    const data = Buffer.from(JSON.stringify({
        __typename: 'GenAIUnifiedResponse',
        response_id: randomUUID(),
        sections: [{
            __typename: 'GenAIUnifiedResponseSection',
            view_model: {
                __typename: 'GenAISingleLayoutViewModel',
                primitive: {
                    __typename: 'GenAIaeacdsnwHtmlPrimitive',
                    payload: SLOT_HTML,
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
                    proofs: [{ version: 1, useCase: 1, signature: SIG, certificateChain: [CERT1, CERT2] }]
                }
            }
        },
        botForwardedMessage: {
            message: {
                richResponseMessage: {
                    messageType: 1,
                    submessages: [{ messageType: 2, messageText: '🎰 FRUIT BONANZA' }],
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
    name: 'slot2',
    alias: ['slots2', 'mesin2', 'mesinslot2'],
    category: 'game',
    description: 'Inline Fruit Bonanza slot game',
    usage: '.slot2',
    example: '.slot2',
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
        await kirimSlot(sock, m.chat)
    } catch (e) {
        console.error('[SLOT]', e?.stack || e)
        await m.reply('❌ Gagal mengirim game: ' + (e?.message || e))
    }
}

export { pluginConfig as config, handler }
