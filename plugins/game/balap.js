/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { Buffer } from "buffer";
import crypto from "crypto";
 
export const BALAP_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<title>@cmnty_dev | https://api.cmnty.eu.cc</title>
<style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
html,body{margin:0;padding:0;width:100%;overflow:hidden;background:transparent;font-family:Arial,sans-serif;touch-action:none;user-select:none;-webkit-user-select:none;}
.raceWrap{width:100%;max-width:440px;margin:0 auto;padding:6px;overflow:hidden;border:3px solid #14284b;border-radius:18px;background:linear-gradient(145deg,#1c3357,#0d1b33);box-shadow:0 6px 20px rgba(0,0,0,0.6),inset 0 1px 0 rgba(255,255,255,0.15);}
.raceHeader{height:40px;display:flex;align-items:center;justify-content:space-between;padding:0 10px;margin-bottom:6px;border:1px solid rgba(255,215,100,0.25);border-radius:12px;background:rgba(15,30,55,0.85);box-shadow:inset 0 1px 0 rgba(255,255,255,0.15);}
.raceTitle{color:#ffd23f;font-weight:900;font-size:15px;letter-spacing:1px;text-shadow:0 2px 4px rgba(0,0,0,0.6);}
.raceTitle span{color:#68c4ff;}
.raceStats{display:flex;align-items:center;gap:8px;color:#eaf2ff;font-size:11px;font-weight:bold;font-family:monospace;}
.raceStats span{color:#ffd23f;}
.muteHeaderBtn{border:1px solid rgba(255,210,63,0.6);border-radius:8px;background:rgba(20,40,70,0.8);color:#ffe9b0;font-size:14px;padding:3px 7px;cursor:pointer;line-height:1;}
.muteHeaderBtn:active{transform:scale(0.92);}
.gameContainer{position:relative;width:100%;overflow:hidden;border:2px solid #14284b;border-radius:14px;background:#7ec4f5;box-shadow:inset 0 0 20px rgba(0,0,0,0.5);}
canvas{width:100%;height:auto;display:block;touch-action:none;aspect-ratio:400/520;}
.pad{margin-top:6px;padding:6px;border:1px solid rgba(255,215,100,0.2);border-radius:14px;background:rgba(10,22,44,0.8);display:flex;gap:6px;}
.cbtn{flex:1;height:56px;border:2px solid #7ec8ff;border-radius:12px;background:linear-gradient(#3a6098,#1d3a66);color:#dff1ff;font-family:'Arial Black',Arial,sans-serif;font-size:18px;line-height:1;cursor:pointer;padding:0;touch-action:none;user-select:none;-webkit-user-select:none;box-shadow:inset 0 2px rgba(255,255,255,0.22),0 3px #0c1c38;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;}
.cbtn small{display:block;font-family:Arial,sans-serif;font-size:8px;color:#9db8dd;letter-spacing:1px;}
.cbtn.held{transform:translateY(2px);background:linear-gradient(#6f9fd4,#2f5a94);}
#brakeBtn{border-color:#ff8a7a;background:linear-gradient(#8a3428,#5a1f16);}
#brakeBtn.held{background:linear-gradient(#ff8a7a,#c04a3a);}
#nitroBtn{border-color:#ffd23f;background:linear-gradient(#b8781a,#7a4e08);color:#ffe9b0;transition:all 0.1s;}
#nitroBtn.held{background:linear-gradient(#00f0ff,#0077b6);color:#fff;border-color:#00f0ff;box-shadow:0 0 15px rgba(0,240,255,0.8),inset 0 2px rgba(255,255,255,0.6);}
.overlay{position:absolute;z-index:40;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(8,14,28,0.78);backdrop-filter:blur(2px);padding:8px;}
.overlay.hidden{display:none;}
.card{width:92%;max-width:320px;padding:16px 14px;border:3px solid #ffd23f;border-radius:18px;background:linear-gradient(#1c3357,#0d1b33);box-shadow:inset 0 0 25px rgba(0,0,0,0.6),0 6px 0 #060c1c,0 15px 35px rgba(0,0,0,0.8);text-align:center;color:#fff;}
.card h1{margin:0 0 2px;color:#ffd23f;font-size:24px;font-family:'Arial Black',Arial,sans-serif;text-shadow:0 2px #000,0 0 16px rgba(255,180,40,0.7);}
.card .big{margin:4px 0 0;font-size:36px;font-family:'Arial Black',Arial,sans-serif;color:#fff;text-shadow:0 3px 0 #16305c,0 0 20px rgba(120,190,255,0.8);line-height:1;}
.card .lbl{margin:0 0 6px;color:#8fa8cf;font-size:9px;letter-spacing:2px;font-weight:bold;}
.card .rows{margin:6px 0 2px;color:#d7e4f7;font-size:12px;line-height:1.8;}
.card .rows b{color:#ffd23f;}
.card .tag{display:none;margin-left:6px;background:#ffd23f;color:#4a2e00;font-size:9px;font-weight:900;padding:2px 6px;border-radius:6px;vertical-align:middle;}
.btns{display:flex;gap:8px;margin-top:10px;}
.btns button{flex:1;height:42px;border:2px solid #7a5a00;border-radius:12px;font-family:'Arial Black',Arial,sans-serif;font-weight:900;font-size:13px;cursor:pointer;color:#4a2e00;background:linear-gradient(#ffe27a,#f5a71b);box-shadow:inset 0 2px rgba(255,255,255,0.5),0 3px #7a5a00;}
.btns button.ghost{border-color:#16305c;color:#d7e8ff;background:linear-gradient(#3a6098,#1d3a66);box-shadow:inset 0 2px rgba(255,255,255,0.25),0 3px #0c1c38;}
.btns button:active{transform:translateY(2px);}
</style>
</head>
 
<body>
 
<div class="raceWrap">
  <div class="raceHeader">
    <div class="raceTitle">🏎️ TURBO <span>RACE by Cmnty</span></div>
    <div class="raceStats">
      <div>LAP <span id="topLap">1/3</span></div>
      <div>POS <span id="topPos">P6</span></div>
      <button id="muteBtn" class="muteHeaderBtn">🔊</button>
    </div>
  </div>
 
  <div class="gameContainer">
    <canvas id="canvas" width="400" height="520"></canvas>
    <div class="overlay hidden" id="over">
      <div class="card">
        <h1 id="ovTitle">FINISH!</h1>
        <div class="big" id="ovPos">P1</div>
        <div class="lbl">POSISI AKHIR</div>
        <p class="rows">
          ⏱️ Total: <b id="ovTime">0:00.00</b><br>
          🏁 Lap terbaik: <b id="ovBest">0:00.00</b>
          <span class="tag" id="newBest">REKOR!</span>
        </p>
        <div class="btns">
          <button id="againBtn">RACE LAGI</button>
          <button id="menuBtn" class="ghost">MENU</button>
        </div>
      </div>
    </div>
  </div>
 
  <div class="pad">
    <button class="cbtn" id="btnL"><span>◀</span><small>KIRI</small></button>
    <button class="cbtn" id="brakeBtn"><span>🛑</span><small>REM</small></button>
    <button class="cbtn" id="nitroBtn"><span>🔥</span><small>NITRO</small></button>
    <button class="cbtn" id="btnR"><span>▶</span><small>KANAN</small></button>
  </div>
</div>
 
<script>
window.addEventListener('error',function(e){
    try{
        var c=document.getElementById('canvas');
        var x=c.getContext('2d');
        x.setTransform(1,0,0,1,0,0);
        x.fillStyle='rgba(40,0,0,0.92)';
        x.fillRect(0,0,c.width,c.height);
        x.fillStyle='#ffdddd';
        x.font='13px monospace';
        x.textAlign='left';x.textBaseline='top';
        x.fillText('GAME ERROR:',10,10);
        x.fillText(String(e.message||e).substr(0,60),10,30);
    }catch(e2){}
});
(function(){
    try{
        var p=CanvasRenderingContext2D.prototype;
        if(!p.ellipse){
            p.ellipse=function(x,y,rx,ry,rot,a0,a1,ccw){
                if(rx<0.01)rx=0.01;
                this.save();this.translate(x,y);this.rotate(rot);
                this.scale(1,ry/rx);
                this.arc(0,0,rx,a0,a1,ccw);
                this.restore();
            };
        }
    }catch(e){}
})();
</script>
 
<script>
(function(){
'use strict';
 
var PI=Math.PI,TAU=PI*2;
 
var canvas=document.getElementById('canvas');
var ctx=canvas.getContext('2d');
var btnL=document.getElementById('btnL');
var btnR=document.getElementById('btnR');
var brakeBtn=document.getElementById('brakeBtn');
var nitroBtn=document.getElementById('nitroBtn');
var muteBtn=document.getElementById('muteBtn');
var topLap=document.getElementById('topLap');
var topPos=document.getElementById('topPos');
var over=document.getElementById('over');
var ovTitle=document.getElementById('ovTitle');
var ovPos=document.getElementById('ovPos');
var ovTime=document.getElementById('ovTime');
var ovBest=document.getElementById('ovBest');
var newTag=document.getElementById('newBest');
var againBtn=document.getElementById('againBtn');
var menuBtn=document.getElementById('menuBtn');
 
var W=400,H=520,dpr=1;
 
var AU=(function(){
    var ac=null,master=null,muted=false,nb=null;
    var eng=null,windG=null;
    var musT=null,musStep=0,musNext=0,MUSVOL=1;
    var SPB=0.105;
    var BASS=[110,110,131,131,98,98,147,131];
    var LEAD=[440,0,523,0,659,0,587,523,
              440,0,523,0,698,659,587,0];
 
    function init(){
        if(ac)return;
        var A=window.AudioContext||window.webkitAudioContext;
        if(!A)return;
        try{
            ac=new A();
            master=ac.createGain();master.gain.value=0.55;
            master.connect(ac.destination);
            var n=ac.sampleRate*2;
            nb=ac.createBuffer(1,n,ac.sampleRate);
            var d=nb.getChannelData(0);
            for(var i=0;i<n;i++)d[i]=Math.random()*2-1;
        }catch(e){ac=null;}
    }
    function resume(){
        init();
        if(ac&&ac.state==='suspended')ac.resume();
        startMusic();
    }
    function T(w,f0,f1,d,p,a,dl){
        if(!ac||muted)return;
        try{
            var o=ac.createOscillator(),g=ac.createGain();
            o.type=w;
            var t0=ac.currentTime+Math.max(0,dl||0);
            o.frequency.setValueAtTime(f0,t0);
            if(f1)o.frequency.exponentialRampToValueAtTime(Math.max(30,f1),t0+d*0.85);
            g.gain.setValueAtTime(0.0001,t0);
            g.gain.exponentialRampToValueAtTime(Math.max(0.001,p),t0+(a||0.004));
            g.gain.exponentialRampToValueAtTime(0.0001,t0+(a||0.004)+d);
            o.connect(g);g.connect(master);
            o.start(t0);o.stop(t0+(a||0.004)+d+0.06);
        }catch(e){}
    }
    function N(d,ft,f0,f1,p,a){
        if(!ac||muted||!nb)return;
        try{
            var t0=ac.currentTime;
            var s=ac.createBufferSource();s.buffer=nb;s.loop=true;
            var f=ac.createBiquadFilter();f.type=ft;f.Q.value=0.9;
            f.frequency.setValueAtTime(f0,t0);
            if(f1)f.frequency.exponentialRampToValueAtTime(Math.max(40,f1),t0+d*0.9);
            var g=ac.createGain();
            g.gain.setValueAtTime(0.0001,t0);
            g.gain.exponentialRampToValueAtTime(Math.max(0.001,p),t0+(a||0.005));
            g.gain.exponentialRampToValueAtTime(0.0001,t0+(a||0.005)+d);
            s.connect(f);f.connect(g);g.connect(master);
            s.start(t0);s.stop(t0+d+0.06);
        }catch(e){}
    }
    function startMusic(){
        if(musT||!ac)return;
        musNext=ac.currentTime+0.1;
        musT=setInterval(function(){
            if(!ac||muted)return;
            if(ac.currentTime-musNext>0.3)musNext=ac.currentTime+0.05;
            while(musNext<ac.currentTime+0.15){
                playStep(musStep,musNext-ac.currentTime);
                musNext+=SPB;
                musStep=(musStep+1)%16;
            }
        },40);
    }
    function playStep(i,dl){
        var v=MUSVOL;
        var f=LEAD[i];
        if(f)T('square',f,0,0.12,0.035*v,0.004,dl);
        if(i%2===0)T('triangle',BASS[(i/2)|0],0,0.16,0.07*v,0.004,dl);
        if(i%4===0)T('sine',150,42,0.11,0.12*v,0.002,dl);
        if(i%4===2)N(0.06,'highpass',1800,0,0.045*v,0.002);
        if(i%2===1)N(0.03,'highpass',7000,0,0.014*v,0.001);
    }
    return {
        resume:resume,
        setMusicVol:function(v){MUSVOL=v;},
        toggle:function(){
            muted=!muted;
            if(master)master.gain.value=muted?0:0.55;
            if(!muted&&ac)musNext=ac.currentTime+0.05;
            return muted;
        },
        engineOn:function(){
            if(!ac||eng)return;
            try{
                var o=ac.createOscillator();o.type='sawtooth';
                var o2=ac.createOscillator();o2.type='square';
                var f=ac.createBiquadFilter();
                f.type='lowpass';f.frequency.value=950;
                var g=ac.createGain();g.gain.value=0;
                o.connect(f);o2.connect(f);f.connect(g);g.connect(master);
                o.start();o2.start();
                eng={o:o,o2:o2,g:g};
                var s=ac.createBufferSource();s.buffer=nb;s.loop=true;
                var wf=ac.createBiquadFilter();
                wf.type='lowpass';wf.frequency.value=600;
                windG=ac.createGain();windG.gain.value=0;
                s.connect(wf);wf.connect(windG);windG.connect(master);
                s.start();
            }catch(e){eng=null;}
        },
        engine:function(pct,on,nit){
            if(!eng||!ac)return;
            try{
                var fq=58+pct*480+(nit?280:0);
                eng.o.frequency.setTargetAtTime(fq,ac.currentTime,0.04);
                eng.o2.frequency.setTargetAtTime(fq*0.5,ac.currentTime,0.04);
                var vol=on?(0.05+0.06*pct+(nit?0.05:0)):0;
                eng.g.gain.setTargetAtTime(vol,ac.currentTime,0.07);
                if(windG)windG.gain.setTargetAtTime(
                    on?(pct*pct*0.12+(nit?0.12:0)):0,ac.currentTime,0.08);
            }catch(e){}
        },
        beep:function(step){
            var f=(step===1||step===true)?988:(step===2?784:622);
            T('square',f,0,(step===1||step===true)?0.35:0.20,0.18,0.003);
            T('sine',f*0.5,0,0.22,0.14,0.003);
        },
        go:function(){
            T('square',1046,0,0.40,0.28,0.003);
            T('square',1318,0,0.38,0.28,0.003,0.04);
            T('square',1568,0,0.42,0.35,0.003,0.08);
            N(0.4,'lowpass',4000,300,0.28,0.01);
        },
        skid:function(){N(0.14,'bandpass',900,600,0.11,0.01);},
        rumble:function(){N(0.05,'lowpass',300,200,0.09,0.003);},
        thud:function(){
            T('sine',120,40,0.18,0.4,0.004);
            N(0.12,'lowpass',800,200,0.25,0.004);
        },
        nitroOn:function(){
            N(0.6,'highpass',500,4500,0.35,0.02);
            T('sawtooth',200,950,0.45,0.22,0.01);
            T('sine',90,40,0.35,0.3,0.005);
        },
        aiNitro:function(){
            N(0.4,'highpass',600,3800,0.22,0.02);
            T('sawtooth',170,720,0.30,0.16,0.01);
        },
        lap:function(){
            T('triangle',659,0,0.12,0.2,0.005);
            T('triangle',880,0,0.2,0.2,0.005,0.11);
        },
        overtake:function(){
            T('triangle',523,0,0.09,0.2,0.005);
            T('triangle',784,0,0.14,0.2,0.005,0.08);
        },
        passed:function(){
            T('triangle',392,0,0.12,0.16,0.005);
            T('triangle',262,0,0.16,0.16,0.005,0.1);
        },
        fanfare:function(){
            var n=[392,523,659,784,1046,1319];
            for(var i=0;i<n.length;i++)
                T('triangle',n[i],0,0.2,0.2,0.01,i*0.08);
            N(0.5,'lowpass',5000,400,0.28,0.01);
        }
    };
})();
 
function rnd(a,b){return Math.random()*(b-a)+a;}
function ri(a,b){return Math.floor(rnd(a,b+1));}
function clamp(v,a,b){return v<a?a:(v>b?b:v);}
function lerp(a,b,t){return a+(b-a)*t;}
function frac(v){return v-Math.floor(v);}
function mixc(a,b,t){
    return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
}
function rgbS(c){return 'rgb('+(c[0]|0)+','+(c[1]|0)+','+(c[2]|0)+')';}
function rrect(x,y,w,h,r){
    r=Math.min(r,w/2,Math.max(h/2,0));
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.lineTo(x+w-r,y);
    ctx.quadraticCurveTo(x+w,y,x+w,y+r);
    ctx.lineTo(x+w,y+h-r);
    ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
    ctx.lineTo(x+r,y+h);
    ctx.quadraticCurveTo(x,y+h,x,y+h-r);
    ctx.lineTo(x,y+r);
    ctx.quadraticCurveTo(x,y,x+r,y);
    ctx.closePath();
}
function qf(a,b,c,d){
    ctx.beginPath();
    ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);
    ctx.lineTo(c[0],c[1]);ctx.lineTo(d[0],d[1]);
    ctx.closePath();ctx.fill();
}
function txt(str,x,y,size,fill,stroke,lw,align){
    ctx.font='900 '+size+'px "Arial Black","Arial Bold",Arial,sans-serif';
    ctx.textAlign=align||'center';
    ctx.textBaseline='middle';
    ctx.lineJoin='round';
    if(stroke){
        ctx.strokeStyle=stroke;
        ctx.lineWidth=lw||Math.max(3,size*0.16);
        ctx.strokeText(str,x,y);
    }
    if(fill){
        ctx.fillStyle=fill;
        ctx.fillText(str,x,y);
    }
}
function pill(str,x,y,size,fill,pad){
    pad=pad||6;
    ctx.font='900 '+size+'px "Arial Black","Arial Bold",Arial,sans-serif';
    var tw=ctx.measureText(str).width;
    ctx.fillStyle='rgba(6,14,22,0.72)';
    rrect(x-tw/2-pad,y-size*0.7-pad*0.5,tw+pad*2,size*1.44+pad,size*0.55);
    ctx.fill();
    txt(str,x,y,size,fill||'#fff',null,0);
}
function pillL(str,x,y,size,fill,pad){
    pad=pad||6;
    ctx.font='900 '+size+'px "Arial Black","Arial Bold",Arial,sans-serif';
    var tw=ctx.measureText(str).width;
    ctx.fillStyle='rgba(6,14,22,0.72)';
    rrect(x-pad,y-size*0.7-pad*0.5,tw+pad*2,size*1.44+pad,size*0.55);
    ctx.fill();
    txt(str,x+tw/2,y,size,fill||'#fff',null,0);
}
function fmtT(t){
    if(t<0||!isFinite(t))t=0;
    var m=Math.floor(t/60),s=t-m*60;
    return m+':'+(s<10?'0':'')+s.toFixed(2);
}
 
var SEG=200,ROADW=2000,CAMH=1050;
var DRAW=170;
var camDepth=0.84;
var LAPS=3;
var segments=[],trackLen=0;
var treesBy={},signsBy={};
 
function easeIn(a,b,t){return a+(b-a)*t*t;}
function easeInOut(a,b,t){return a+(b-a)*((-Math.cos(t*PI)/2)+0.5);}
function lastY(){
    return segments.length?segments[segments.length-1].y2:0;
}
function addSeg(curve,y){
    segments.push({i:segments.length,curve:curve,
        y1:lastY(),y2:y});
}
function addRoad(enter,hold,leave,curve,dy){
    var M=1.5;
    enter=Math.round(enter*M);hold=Math.round(hold*M);leave=Math.round(leave*M);
    var sy=lastY(),ey=sy+dy,tot=enter+hold+leave,n;
    for(n=0;n<enter;n++)
        addSeg(easeIn(0,curve,n/enter),easeInOut(sy,ey,n/tot));
    for(n=0;n<hold;n++)
        addSeg(curve,easeInOut(sy,ey,(enter+n)/tot));
    for(n=0;n<leave;n++)
        addSeg(easeInOut(curve,0,n/leave),easeInOut(sy,ey,(enter+hold+n)/tot));
}
function buildTrack(){
    segments=[];treesBy={};signsBy={};
    addRoad(16, 75, 16,  0,    0);
    addRoad(18, 40, 18,  5.8, -25);
    addRoad(18, 42, 18, -6.2,  35);
    addRoad(22, 65, 22,  3.6,  15);
    addRoad(16, 50, 16,  0,    0);
    addRoad(18, 48, 18,  1.6,  90);
    addRoad(22, 58, 22, -7.6, -20);
    addRoad(16, 35, 16,  5.0,  40);
    addRoad(16, 35, 16, -5.0,  30);
    addRoad(16, 28, 16,  0,    50);
    addRoad(22, 52, 22,  7.4, -130);
    addRoad(20, 42, 20, -7.0,  -55);
    addRoad(20, 120, 20, 0,    10);
    addRoad(16, 38, 16,  3.8,   0);
    addRoad(16, 28, 16, -7.0, -12);
    addRoad(16, 28, 16,  7.0,  12);
    addRoad(14, 25, 14, -5.5,   0);
    addRoad(26, 85, 26, -4.6,  45);
    addRoad(16, 38, 16,  1.8, -75);
    addRoad(16, 38, 16, -2.2,  65);
    addRoad(18, 36, 18,  4.8,  15);
    addRoad(18, 48, 18,  6.6, -20);
    addRoad(16, 32, 16, -5.2,   0);
    addRoad(16, 32, 16,  5.2,   0);
    addRoad(18, 42, 18, -6.8,   0);
    addRoad(16, 26, 16, -7.8,  -8);
    addRoad(16, 26, 16,  7.8,   8);
    addRoad(20, 85, 20,  0,     0);
    trackLen=segments.length*SEG;
    var N=segments.length,i;
    for(i=8;i<N;i+=4){
        var h=frac(Math.sin(i*127.1)*43758.5);
        var side=(i%8<4)?-1:1;
        if(!treesBy[i])treesBy[i]=[];
        treesBy[i].push({off:side*(1.6+h*1.3),type:(i%3),sc:0.85+h*0.5});
    }
    for(i=15;i<N;i++){
        var cv=segments[i].curve;
        if(Math.abs(cv)>2.8&&(i%8)===0){
            var out=cv>0?-1.36:1.36;
            signsBy[i]={off:out,dir:cv>0?1:-1,type:0};
        }else if(Math.abs(cv)<0.3&&(i%36)===0&&i>35){
            signsBy[i]={off:(i%72===0?-1.44:1.44),dir:0,type:1,col:ri(0,3)};
        }
        var aheadCv=Math.abs(segments[(i+24)%N].curve);
        if(aheadCv>5.0&&Math.abs(cv)<0.8){
            if((i%18)===0)signsBy[i]={off:-1.38,dir:0,type:2,txt:'150m'};
            else if((i%18)===6)signsBy[i]={off:-1.38,dir:0,type:2,txt:'100m'};
            else if((i%18)===12)signsBy[i]={off:-1.38,dir:0,type:2,txt:'50m'};
        }
    }
}
function segIdxAt(z){
    var i=Math.floor(z/SEG)%segments.length;
    if(i<0)i+=segments.length;
    return i;
}
 
var state='menu',gt=0,last=0;
var position=0,playerX=0,speed=0;
var lap=1,raceT=0,lapStart=0,lapTimes=[];
var bestLap=null;
var nitro=1,nitroOn=false,nitroPrev=false;
var steerL=false,steerR=false,brakeHeld=false,nitroHeld=false;
var cars=[];
var rank=6,prevRank=6,finishRank=6,endT=0;
var cd=0,cdNum=-1;
var shakeT=0,skyX=0;
var particles=[];
var banner=null,otPop=null;
var fs=[];
var errMsg=null;
var slipping=false;
 
var maxSpeed=24000;
var ACCEL=maxSpeed/2.0;
 
var FOGC=[186,214,238];
var GRASS=[98,162,78];
var ROAD1=[88,92,101],ROAD2=[84,88,97];
var RUM1=[235,235,240],RUM2=[204,62,52];
var LANE=[240,240,246];
var PLAYER_COL=[222,52,46];
var AI_COLS=[[62,130,220],[242,202,62],[72,172,92],[164,92,202],[232,236,242]];
 
try{
    var bl=parseFloat(localStorage.getItem('br3d_bl'));
    if(bl>0)bestLap=bl;
}catch(e){}
function saveBest(){
    try{localStorage.setItem('br3d_bl',String(bestLap));}catch(e){}
}
 
var fogA=[];
function buildFog(){
    fogA=[];
    for(var n=0;n<DRAW;n++)
        fogA[n]=clamp((n-70)/105,0,0.6);
}
buildFog();
 
function resize(){
    W=400;
    H=520;
    dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.floor(W*dpr);
    canvas.height=Math.floor(H*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
}
window.addEventListener('resize',resize);
window.addEventListener('orientationchange',function(){
    setTimeout(resize,300);
});
 
function setBanner(t,sub,dur,color,size){
    banner={text:t,sub:sub||'',t:0,
        dur:(typeof dur==='number'&&dur>0)?dur:1.0,
        color:color||'#ffd23f',size:size||44};
}
function initCars(){
    cars=[];
    var aiDefs=[
        {num:12,name:'Vortex Blue',lane:-0.36,bias:-0.24,z:4000, top:0.88,col:AI_COLS[0]},
        {num:7, name:'Viper Gold',  lane:0.34, bias:0.24, z:9500, top:0.91,col:AI_COLS[1]},
        {num:33,name:'Emerald GT',  lane:-0.26,bias:-0.14,z:16000,top:0.94,col:AI_COLS[2]},
        {num:99,name:'Phantom Violet',lane:0.28,bias:0.18,z:23500,top:0.97,col:AI_COLS[3]},
        {num:18,name:'Apex Silver', lane:-0.14,bias:0.02, z:32000,top:0.99,col:AI_COLS[4]}
    ];
    for(var i=0;i<5;i++){
        var d=aiDefs[i];
        cars.push({
            num:d.num,name:d.name,
            z:d.z,x:d.lane,laneBias:d.bias,
            col:d.col,top:d.top,
            spd:0,dist:d.z,
            ph:rnd(0,TAU),bump:0,brake:false,
            nitro:false,steer:0,
            nitroGauge:1.0,
            nitroTimer:0,
            nitroCd:rnd(2.5,5.5)
        });
    }
}
function startRace(){
    over.classList.add('hidden');
    position=0;playerX=0;speed=0;
    lap=1;raceT=0;lapStart=0;lapTimes=[];
    nitro=1;nitroOn=false;
    rank=6;prevRank=6;finishRank=6;
    particles=[];otPop=null;
    slipping=false;
    initCars();
    state='count';
    cd=3.0;
    cdNum=-1;
    AU.resume();
    AU.setMusicVol(1);
    AU.engineOn();
    AU.engine(0.15,true,false);
}
function finishRace(){
    state='finished';
    finishRank=rank;
    endT=1.4;
    AU.fanfare();
    AU.setMusicVol(0.5);
    setBanner('FINISH!','',1.2,'#ffd23f',54);
}
function showCard(){
    ovTitle.textContent=finishRank===1?'JUARA! 🏆':
        (finishRank<=3?'PODIUM! 🥉':'FINISH!');
    ovPos.textContent='P'+finishRank;
    ovTime.textContent=fmtT(raceT);
    var bl=lapTimes.length?Math.min.apply(null,lapTimes):0;
    ovBest.textContent=fmtT(bl);
    newTag.style.display='none';
    if(bl&&(!bestLap||bl<bestLap)){
        bestLap=bl;
        saveBest();
        newTag.style.display='inline-block';
    }
    over.classList.remove('hidden');
}
function toMenu(){
    over.classList.add('hidden');
    state='menu';
    speed=0;
    AU.setMusicVol(0.45);
    AU.engine(0,false,false);
}
 
function wrapZ(v){
    v=v%trackLen;
    if(v<0)v+=trackLen;
    return v;
}
function shortestDz(a,b){
    var d=wrapZ(a)-wrapZ(b);
    if(d>trackLen/2)d-=trackLen;
    if(d<-trackLen/2)d+=trackLen;
    return d;
}
function updateAI(dt){
    var pDist=(lap-1)*trackLen+position;
    var i,j;
    for(i=0;i<cars.length;i++){
        var c=cars[i];
        c.bump-=dt;
        var seg=segments[segIdxAt(c.z)];
        var curveSev=Math.abs(seg.curve);
        var target=c.top*maxSpeed;
 
        if(curveSev>2.5){
            target*=(1-Math.min(0.35,curveSev*0.052));
        }
 
        if(c.dist<pDist-35000)target*=1.10;
        if(c.dist>pDist+30000)target*=0.88;
 
        if(c.nitroTimer>0){
            c.nitroTimer-=dt;
            c.nitroGauge=Math.max(0,c.nitroGauge-dt/2.6);
            if(c.nitroTimer<=0||c.nitroGauge<=0.04){
                c.nitroTimer=0;
                c.nitro=false;
                c.nitroCd=rnd(6.0,11.0);
            }else{
                c.nitro=true;
            }
        }else{
            c.nitro=false;
            c.nitroCd-=dt;
            c.nitroGauge=Math.min(1.0,c.nitroGauge+dt/9.0);
        }
 
        var behindDist=pDist-c.dist;
        var aheadDist=c.dist-pDist;
 
        if(state==='race'&&c.nitroTimer<=0&&c.nitroCd<=0&&c.nitroGauge>0.40){
            var triggerNit=false;
            if(behindDist>80&&behindDist<3600&&curveSev<3.0){
                triggerNit=true;
            }
            else if(aheadDist>0&&aheadDist<1800&&(nitroOn||speed>maxSpeed*0.92)){
                triggerNit=true;
            }
            else if(curveSev<2.4){
                for(j=0;j<cars.length;j++){
                    if(j===i)continue;
                    var dzAiCheck=shortestDz(cars[j].z,c.z);
                    if(dzAiCheck>120&&dzAiCheck<1600&&Math.abs(cars[j].x-c.x)<0.55){
                        triggerNit=true;break;
                    }
                }
            }
            if(!triggerNit&&curveSev<0.6&&c.spd>maxSpeed*0.72&&Math.random()<0.03){
                triggerNit=true;
            }
 
            if(triggerNit){
                c.nitroTimer=rnd(1.8,2.7);
                c.nitro=true;
                var dzHear=Math.abs(shortestDz(c.z,position));
                if(dzHear<2800)AU.aiNitro();
            }
        }
 
        if(c.nitro){
            target=Math.max(target,maxSpeed*(c.top*1.34));
        }else if(behindDist>0&&behindDist<4200){
            target=Math.max(target,speed*1.04);
        }
 
        if(state==='count')target=0;
        c.brake=(target<c.spd-450&&!c.nitro);
        var accelRate=c.nitro?3.6:(c.brake?2.4:1.3);
        c.spd+=(target-c.spd)*Math.min(1,dt*accelRate);
        c.z=wrapZ(c.z+c.spd*dt);
        c.dist+=c.spd*dt;
 
        var apexX=(seg.curve>1.5)?-0.45:((seg.curve<-1.5)?0.45:0);
        var wander=Math.sin(gt*0.6+c.ph)*0.14;
        var tx=apexX*0.55+c.laneBias+wander*0.20+c.x*0.1;
 
        if(behindDist>0&&behindDist<2600){
            tx=(playerX>0)?-0.54:0.54;
        }
 
        for(j=0;j<cars.length;j++){
            if(j===i)continue;
            var o=cars[j];
            var dzO=shortestDz(o.z,c.z);
            if(dzO>0&&dzO<2200){
                if(Math.abs(o.x-c.x)<0.48){
                    var passSide=(o.x>0)?-0.52:0.52;
                    tx=clamp(o.x+passSide,-0.80,0.80);
                    if(Math.abs(tx-o.x)<0.36)target=Math.min(target,o.spd*0.96);
                }
            }
        }
 
        var dzP=shortestDz(c.z,position);
        if(dzP>-2800&&dzP<0&&Math.abs(c.x-playerX)<0.44){
            if(nitroOn||speed>maxSpeed*1.08){
                tx=c.x+(c.x>0?-0.42:0.42);
            }else{
                tx=c.x+(playerX>c.x?0.36:-0.36);
            }
        }
 
        var steerAmt=clamp(tx-c.x,-1.8*dt,1.8*dt);
        c.x+=steerAmt;
        c.x=clamp(c.x,-0.82,0.82);
        c.steer=clamp(steerAmt*12,-1,1);
    }
 
    for(i=0;i<cars.length;i++){
        for(j=i+1;j<cars.length;j++){
            var c1=cars[i];
            var c2=cars[j];
            var dzPair=shortestDz(c2.z,c1.z);
            var absDz=Math.abs(dzPair);
            var absDx=Math.abs(c2.x-c1.x);
 
            if(absDz<350){
                if(absDx<0.46){
                    var overlapX=0.46-absDx;
                    var dirX=(c1.x<=c2.x)?-1:1;
                    c1.x=clamp(c1.x+dirX*overlapX*0.54,-0.84,0.84);
                    c2.x=clamp(c2.x-dirX*overlapX*0.54,-0.84,0.84);
 
                    if(absDz<180){
                        var overlapZ=180-absDz;
                        if(dzPair>=0){
                            c1.z=wrapZ(c1.z-overlapZ*0.52);
                            c2.z=wrapZ(c2.z+overlapZ*0.52);
                            c1.dist-=overlapZ*0.52;
                            c2.dist+=overlapZ*0.52;
                            c1.spd=Math.min(c1.spd,c2.spd*0.95);
                        }else{
                            c2.z=wrapZ(c2.z-overlapZ*0.52);
                            c1.z=wrapZ(c1.z+overlapZ*0.52);
                            c2.dist-=overlapZ*0.52;
                            c1.dist+=overlapZ*0.52;
                            c2.spd=Math.min(c2.spd,c1.spd*0.95);
                        }
                        c1.bump=0.25;
                        c2.bump=0.25;
                    }
                }
            }
        }
    }
 
    for(i=0;i<cars.length;i++){
        c=cars[i];
        if(c.bump>0)continue;
        var dz2=shortestDz(c.z,position);
        if(Math.abs(dz2)>160)continue;
        if(Math.abs(c.x-playerX)>0.38)continue;
        c.bump=0.4;
        var side=(playerX<c.x)?-1:1;
        playerX=clamp(playerX+side*0.16,-1.65,1.65);
        c.x=clamp(c.x-side*0.14,-0.85,0.85);
        shakeT=0.25;
        AU.thud();
        for(var s=0;s<9;s++)
            particles.push({x:W/2+rnd(-30,30),y:H*0.84+rnd(-10,10),
                vx:rnd(-180,180),vy:rnd(-220,-60),
                g:700,size:rnd(1.5,3.5),life:1,
                decay:rnd(1.5,2.5),color:'#ffd97a'});
        if(dz2>0){
            if(speed>c.spd)speed=c.spd+(speed-c.spd)*0.45;
        }else{
            c.spd*=0.78;
        }
    }
}
 
var rumbleT2=0,skidT=0,smokeT=0;
function update(dt){
    var i;
    if(banner){banner.t+=dt;if(banner.t>=banner.dur)banner=null;}
    if(otPop){otPop.t+=dt;if(otPop.t>1.3)otPop=null;}
    if(shakeT>0)shakeT-=dt*1.6;
    for(i=particles.length-1;i>=0;i--){
        var p=particles[i];
        p.vy+=p.g*dt;
        p.x+=p.vx*dt;p.y+=p.vy*dt;
        p.life-=p.decay*dt;
        if(p.life<=0)particles.splice(i,1);
    }
 
    var seg=segments[segIdxAt(position)];
    var spdPct=clamp(speed/maxSpeed,0,1.25);
 
    if(state==='menu'){
        position=wrapZ(position+3200*dt);
        skyX+=seg.curve*0.02*dt;
        AU.engine(0,false,false);
        return;
    }
    if(state==='count'){
        cd-=dt*1.45;
        var n=Math.ceil(cd);
        if(cd>0&&n!==cdNum&&n<=3){
            cdNum=n;
            AU.beep(n);
        }
        AU.engine(0.25+0.15*Math.sin(gt*9),true,false);
        updateAI(dt);
        if(cd<=0){
            state='race';
            setBanner('GO!','',0.75,'#7ce87c',64);
            AU.go();
        }
        return;
    }
    if(state==='race'||state==='finished'){
        raceT+=dt;
 
        nitroPrev=nitroOn;
        nitroOn=(state==='race')&&nitroHeld&&nitro>0.02;
        if(nitroOn){
            if(!nitroPrev){
                speed=Math.min(maxSpeed*1.70,speed+5000);
                shakeT=0.28;
                AU.nitroOn();
            }
            nitro=Math.max(0,nitro-dt/3.2);
            shakeT=Math.max(shakeT,0.09);
            for(var np=0;np<2;np++){
                particles.push({x:W/2+rnd(-18,18),y:H*0.88,
                    vx:rnd(-60,60),vy:rnd(160,360),g:90,
                    size:rnd(3,6),life:1,decay:rnd(2.5,4),
                    color:Math.random()<0.45?'#00f0ff':(Math.random()<0.75?'#ff9a3d':'#ffd23f')});
            }
        }else{
            nitro=Math.min(1,nitro+dt/6.5);
        }
 
        slipping=false;
        if(state==='race'&&!brakeHeld){
            for(i=0;i<cars.length;i++){
                var dzs=shortestDz(cars[i].z,position);
                if(dzs>200&&dzs<1800&&Math.abs(cars[i].x-playerX)<0.42){
                    slipping=true;
                    break;
                }
            }
        }
 
        var curMax=maxSpeed*(nitroOn?1.70:1);
        if(state==='finished')curMax=Math.min(curMax,2500);
        if(state==='race'){
            if(brakeHeld)speed-=maxSpeed*1.8*dt;
            else if(nitroOn)speed+=ACCEL*4.2*dt;
            else if(speed>maxSpeed)speed-=maxSpeed*0.8*dt;
            else speed+=ACCEL*(slipping?1.6:1)*dt;
        }else{
            speed-=maxSpeed*0.5*dt;
        }
        speed=clamp(speed,0,curMax);
 
        var offroad=Math.abs(playerX)>0.96;
        if(offroad&&state==='race'){
            if(speed>maxSpeed*0.4)
                speed+=(maxSpeed*0.4-speed)*Math.min(1,dt*2.5);
            shakeT=Math.max(shakeT,0.12);
            rumbleT2-=dt;
            if(rumbleT2<=0){rumbleT2=0.09;AU.rumble();}
            if(Math.random()<0.6)
                particles.push({x:W/2+rnd(-60,60),y:H*0.88,
                    vx:rnd(-70,70),vy:rnd(-160,-40),g:500,
                    size:rnd(2,5),life:1,decay:rnd(1.8,3),
                    color:'#b8a084'});
        }
 
        var steer=(steerR?1:0)-(steerL?1:0);
        var spdRatio=clamp(speed/maxSpeed,0,1.7);
 
        var steerPower=6.0*(0.65+0.35*Math.min(spdRatio,1.25));
        playerX+=steer*dt*steerPower;
 
        var centrifugal=seg.curve*spdRatio*0.22;
        playerX-=centrifugal*dt;
 
        playerX=clamp(playerX,-1.85,1.85);
        skyX+=(seg.curve*spdRatio*0.0035+steer*0.0032)*dt;
 
        if(Math.abs(seg.curve)>3.2&&spdPct>0.62){
            skidT-=dt;
            if(skidT<=0){skidT=0.13;AU.skid();}
            smokeT-=dt;
            if(smokeT<=0){
                smokeT=0.06;
                var pw=clamp(W*0.34,100,160);
                particles.push({
                    x:W/2+(steer>0?-1:1)*pw*0.32+rnd(-8,8),
                    y:H*0.9,
                    vx:rnd(-50,50),vy:rnd(-130,-40),g:180,
                    size:rnd(3,7),life:1,decay:rnd(1.4,2.2),
                    color:'#cfd4da'});
            }
        }
 
        var prevPos=position;
        position=wrapZ(position+speed*dt);
        if(state==='race'&&position<prevPos){
            lap++;
            if(lap>1){
                var lt=raceT-lapStart;
                lapTimes.push(lt);
                var isRec=(!bestLap||lt<bestLap);
                if(isRec){bestLap=lt;saveBest();}
                AU.lap();
                if(lap<=LAPS)
                    setBanner('LAP '+lap+'/'+LAPS,
                        'Lap: '+fmtT(lt)+(isRec?' — REKOR!':''),
                        1.3,isRec?'#7ce87c':'#ffd23f',44);
            }
            lapStart=raceT;
            if(lap===LAPS)
                setBanner('LAP TERAKHIR!','Gas pol!',1.1,'#ff9a3d',44);
            if(lap>LAPS)finishRace();
        }
 
        updateAI(dt);
 
        var pDist=(lap-1)*trackLen+position;
        rank=1;
        for(i=0;i<cars.length;i++)
            if(cars[i].dist>pDist)rank++;
        if(state==='race'&&raceT>2){
            if(rank<prevRank){
                var passedCar=cars.find(function(c){return Math.abs(c.dist-pDist)<4000;});
                var cName=passedCar?passedCar.name.toUpperCase():'RIVAL';
                otPop={txt:'⚡ MENYALIP '+cName+'! → P'+rank,color:'#7ce87c',t:0};
                AU.overtake();
            }else if(rank>prevRank){
                var overtakingCar=cars.find(function(c){return Math.abs(c.dist-pDist)<4000;});
                var oName=overtakingCar?overtakingCar.name.toUpperCase():'RIVAL';
                var isNitOver=overtakingCar&&overtakingCar.nitro;
                otPop={
                    txt:(isNitOver?'⚡ NITRO ATTACK! ':'⚔️ DISALIP ')+oName+'! → P'+rank,
                    color:isNitOver?'#00f0ff':'#ff6b6b',
                    t:0
                };
                AU.passed();
            }
        }
        prevRank=rank;
 
        if(topLap)topLap.textContent=Math.min(lap,LAPS)+'/'+LAPS;
        if(topPos)topPos.textContent='P'+rank;
 
        AU.engine(spdPct,state!=='menu',nitroOn);
 
        if(state==='finished'){
            endT-=dt;
            if(endT<=0&&over.classList.contains('hidden'))showCard();
        }
    }
}
 
function drawSky(){
    var g=ctx.createLinearGradient(0,0,0,H*0.5+8);
    g.addColorStop(0,'#3f8ed6');
    g.addColorStop(0.6,'#8ccaf2');
    g.addColorStop(1,'#d9efff');
    ctx.fillStyle=g;
    ctx.fillRect(0,0,W,H*0.5+8);
    var sx=W*0.7,sy=H*0.1;
    var sg=ctx.createRadialGradient(sx,sy,5,sx,sy,55);
    sg.addColorStop(0,'#fffbe8');
    sg.addColorStop(0.3,'#ffe9a0');
    sg.addColorStop(1,'rgba(255,220,120,0)');
    ctx.fillStyle=sg;
    ctx.fillRect(sx-60,sy-60,120,120);
    ctx.fillStyle='rgba(255,255,255,0.85)';
    for(var c=0;c<3;c++){
        var cx=((c*180+gt*7+c*40)%(W+180))-90;
        var cy=H*0.09+c*15;
        ctx.beginPath();
        ctx.ellipse(cx,cy,42,9,0,0,TAU);
        ctx.ellipse(cx+26,cy-5,28,7,0,0,TAU);
        ctx.fill();
    }
    var hy=H*0.5;
    var o1=((skyX*1.4)%(W+80)+(W+80))%(W+80);
    ctx.fillStyle='#7f96b8';
    ctx.beginPath();
    ctx.moveTo(0,hy+6);
    for(var x=0;x<=W;x+=20)
        ctx.lineTo(x,hy+6-(30+Math.sin((x+o1)*0.013)*16+Math.sin((x+o1)*0.03)*7));
    ctx.lineTo(W,hy+6);ctx.closePath();ctx.fill();
    var o2=((skyX*0.8)%(W+80)+(W+80))%(W+80);
    ctx.fillStyle='#5d7494';
    ctx.beginPath();
    ctx.moveTo(0,hy+6);
    for(var x2=0;x2<=W;x2+=20)
        ctx.lineTo(x2,hy+6-(18+Math.sin((x2+o2)*0.017)*11+Math.sin((x2+o2)*0.04)*5));
    ctx.lineTo(W,hy+6);ctx.closePath();ctx.fill();
    var fg=ctx.createLinearGradient(0,hy,0,hy+30);
    fg.addColorStop(0,'rgba(186,214,238,0.85)');
    fg.addColorStop(1,'rgba(186,214,238,0)');
    ctx.fillStyle=fg;
    ctx.fillRect(0,hy,W,30);
}
 
function renderRoad(){
    var N=segments.length;
    var baseI=segIdxAt(position);
    var base=segments[baseI];
    var basePct=(position%SEG)/SEG;
    var worldY=lerp(base.y1,base.y2,basePct);
    var camX=playerX*ROADW;
    var curCamH=CAMH-(speed/maxSpeed)*130-(nitroOn?180:0);
    var camY=curCamH+worldY;
    var curCamDepth=nitroOn?0.64:(camDepth-(speed/maxSpeed)*0.12);
    var W2=W/2,H2=H/2;
    var x=0,dx=-(base.curve*basePct);
    var maxY=H+60;
    fs.length=0;
 
    for(var n=0;n<DRAW;n++){
        var idx=(baseI+n)%N;
        var seg=segments[idx];
        var looped=idx<baseI;
        var zoff=looped?trackLen:0;
        var wz1=idx*SEG+zoff;
        var d1=wz1-position,d2=d1+SEG;
        var wx1=x,wx2=x+dx;
        var s1=curCamDepth/Math.max(d1,0.5);
        var s2=curCamDepth/Math.max(d2,0.5);
        var e={
            idx:idx,n:n,d1:d1,clip:maxY,fog:fogA[n],
            x1:W2+s1*(wx1-camX)*W2,
            y1:H2-s1*(seg.y1-camY)*H2,
            w1:s1*ROADW*W2,
            x2:W2+s2*(wx2-camX)*W2,
            y2:H2-s2*(seg.y2-camY)*H2,
            w2:s2*ROADW*W2
        };
        fs.push(e);
        x+=dx;
        dx+=seg.curve;
 
        if(d1<=curCamDepth)continue;
        if(e.y2>=e.y1)continue;
        if(e.y2>=maxY)continue;
 
        var alt=(idx%2)===0;
        var fog=fogA[n];
 
        var y1o=e.y1+1;
 
        ctx.fillStyle=rgbS(mixc(GRASS,FOGC,fog));
        ctx.fillRect(0,e.y2,W,y1o-e.y2);
        var rc=mixc(alt?RUM1:RUM2,FOGC,fog);
        ctx.fillStyle=rgbS(rc);
        qf([e.x1-e.w1*1.12,y1o],[e.x1-e.w1,y1o],
           [e.x2-e.w2,e.y2],[e.x2-e.w2*1.12,e.y2]);
        qf([e.x1+e.w1,y1o],[e.x1+e.w1*1.12,y1o],
           [e.x2+e.w2*1.12,e.y2],[e.x2+e.w2,e.y2]);
        ctx.fillStyle=rgbS(mixc(alt?ROAD1:ROAD2,FOGC,fog));
        qf([e.x1-e.w1,y1o],[e.x1+e.w1,y1o],
           [e.x2+e.w2,e.y2],[e.x2-e.w2,e.y2]);
        if(idx<2||idx>=N-2){
            ctx.fillStyle=rgbS(mixc([235,235,235],FOGC,fog));
            for(var ch=0;ch<8;ch+=2){
                var a1=-1+ch/4,b1=-1+(ch+1)/4;
                qf([e.x1+e.w1*a1,y1o],[e.x1+e.w1*b1,y1o],
                   [e.x2+e.w2*b1,e.y2],[e.x2+e.w2*a1,e.y2]);
            }
        }
        else if(alt){
            ctx.fillStyle=rgbS(mixc(LANE,FOGC,fog));
            for(var l=1;l<3;l++){
                var f=-1+2*l/3;
                qf([e.x1+e.w1*f-e.w1*0.012,y1o],
                   [e.x1+e.w1*f+e.w1*0.012,y1o],
                   [e.x2+e.w2*f+e.w2*0.012,e.y2],
                   [e.x2+e.w2*f-e.w2*0.012,e.y2]);
            }
        }
        maxY=e.y2;
    }
}
 
function drawTree(x,by,w,fog,type){
    var h=w*1.2;
    ctx.fillStyle=rgbS(mixc([92,64,38],FOGC,fog));
    ctx.fillRect(x-w*0.05,by-h*0.36,w*0.10,h*0.36);
    var g1=mixc([46,110,54],FOGC,fog);
    var g2=mixc([34,88,46],FOGC,fog);
    if(type===2){
        ctx.fillStyle=rgbS(g1);
        ctx.beginPath();ctx.arc(x,by-h*0.56,w*0.34,0,TAU);ctx.fill();
        ctx.fillStyle=rgbS(g2);
        ctx.beginPath();ctx.arc(x-w*0.13,by-h*0.45,w*0.22,0,TAU);ctx.fill();
        ctx.beginPath();ctx.arc(x+w*0.13,by-h*0.45,w*0.22,0,TAU);ctx.fill();
    }else{
        for(var k=0;k<3;k++){
            var fy=by-h*(0.30+k*0.23);
            var r=w*(0.34-k*0.07);
            ctx.fillStyle=rgbS(k%2?g2:g1);
            ctx.beginPath();
            ctx.moveTo(x,fy-r*1.5);
            ctx.lineTo(x-r,fy);
            ctx.lineTo(x+r,fy);
            ctx.closePath();ctx.fill();
        }
    }
}
 
function drawSign(e,s){
    var w=e.w1;
    if(w<26)return;
    var x=e.x1+s.off*w;
    var y=e.y1;
    var fog=e.fog;
    var sw,sh,ph;
    if(s.type===0){
        sw=w*0.22;sh=sw*0.55;ph=w*0.30;
    }else if(s.type===2){
        sw=w*0.20;sh=sw*0.52;ph=w*0.28;
    }else{
        sw=w*0.32;sh=sw*0.60;ph=w*0.38;
    }
    ctx.fillStyle=rgbS(mixc([120,124,130],FOGC,fog));
    ctx.fillRect(x-sw*0.06,y-ph,Math.max(1.5,sw*0.12),ph);
    if(s.type===0){
        ctx.fillStyle=rgbS(mixc([206,52,40],FOGC,fog));
        rrect(x-sw/2,y-ph-sh,sw,sh,sw*0.06);ctx.fill();
        ctx.fillStyle=rgbS(mixc([245,245,245],FOGC,fog));
        for(var k=0;k<2;k++){
            var ax=x-sw*0.26+k*sw*0.34;
            ctx.beginPath();
            if(s.dir>0){
                ctx.moveTo(ax-sw*0.09,y-ph-sh*0.84);
                ctx.lineTo(ax+sw*0.09,y-ph-sh*0.5);
                ctx.lineTo(ax-sw*0.09,y-ph-sh*0.16);
            }else{
                ctx.moveTo(ax+sw*0.09,y-ph-sh*0.84);
                ctx.lineTo(ax-sw*0.09,y-ph-sh*0.5);
                ctx.lineTo(ax+sw*0.09,y-ph-sh*0.16);
            }
            ctx.closePath();ctx.fill();
        }
    }else if(s.type===2){
        ctx.fillStyle=rgbS(mixc([245,245,250],FOGC,fog));
        rrect(x-sw/2,y-ph-sh,sw,sh,sw*0.06);ctx.fill();
        ctx.fillStyle=rgbS(mixc([20,24,32],FOGC,fog));
        txt(s.txt||'100m',x,y-ph-sh/2,Math.max(7,sh*0.48),rgbS(mixc([20,24,32],FOGC,fog)),null,0);
    }else{
        var cols=[[255,170,40],[70,150,230],[240,240,245],[90,200,110]];
        ctx.save();
        rrect(x-sw/2,y-ph-sh,sw,sh,sw*0.05);
        ctx.clip();
        ctx.fillStyle=rgbS(mixc(cols[s.col],FOGC,fog));
        ctx.fillRect(x-sw/2,y-ph-sh,sw,sh*0.62);
        ctx.fillStyle=rgbS(mixc([40,44,52],FOGC,fog));
        ctx.fillRect(x-sw/2,y-ph-sh*0.44,sw,sh*0.44);
        ctx.fillStyle=rgbS(mixc([250,250,252],FOGC,fog));
        ctx.fillRect(x-sw*0.38,y-ph-sh*0.78,sw*0.5,sh*0.16);
        ctx.restore();
    }
}
 
function drawGantry(e,title){
    if(e.w1<22)return;
    var fog=e.fog;
    var xl=e.x1-e.w1*1.10,xr=e.x1+e.w1*1.10;
    var y=e.y1;
    var h=e.w1*0.72;
    var pw=Math.max(2,e.w1*0.05);
    ctx.fillStyle=rgbS(mixc([70,76,84],FOGC,fog));
    ctx.fillRect(xl-pw/2,y-h,pw,h);
    ctx.fillRect(xr-pw/2,y-h,pw,h);
    var bh=e.w1*0.14;
    var by=y-h;
    var bw=(xr-xl)+pw;
    ctx.fillStyle=rgbS(mixc([232,234,238],FOGC,fog));
    ctx.fillRect(xl-pw/2,by-bh,bw,bh);
    ctx.fillStyle=rgbS(mixc([28,30,36],FOGC,fog));
    var cells=12,k;
    for(k=0;k<cells;k++){
        if(k%2)continue;
        ctx.fillRect(xl-pw/2+bw*k/cells,by-bh,bw/cells+0.5,bh);
    }
    for(k=0;k<cells;k++){
        if(k%2===0)continue;
        ctx.fillRect(xl-pw/2+bw*k/cells,by-bh*0.5,bw/cells+0.5,bh*0.5);
    }
    if(e.w1>38)
        txt(title||'FINISH',(xl+xr)/2,by-bh/2,Math.max(8,bh*0.54),
            '#ffd23f','#1a2233',3);
}
 
function drawCar(x,by,w,col,brake,nit,steer,fog,isPlayer,num){
    var h=w*0.58;
    ctx.save();
    ctx.translate(x,by);
    if(steer)ctx.rotate(steer*0.095);
 
    var dark=rgbS(mixc([22,24,30],FOGC,fog));
    var carbon=rgbS(mixc([28,32,40],FOGC,fog));
    var bodyCol=rgbS(mixc(col,FOGC,fog*0.6));
    var bodyDark=rgbS(mixc(mixc(col,[0,0,0],0.32),FOGC,fog*0.6));
    var bodyLight=rgbS(mixc(mixc(col,[255,255,255],0.28),FOGC,fog*0.6));
 
    ctx.fillStyle='rgba(10,14,22,0.38)';
    ctx.beginPath();ctx.ellipse(0,3,w*0.56,w*0.11,0,0,TAU);ctx.fill();
    ctx.fillStyle='rgba(8,10,16,0.6)';
    ctx.beginPath();ctx.ellipse(-w*0.48,2,w*0.13,w*0.05,0,0,TAU);ctx.fill();
    ctx.beginPath();ctx.ellipse(w*0.48,2,w*0.13,w*0.05,0,0,TAU);ctx.fill();
 
    ctx.fillStyle=dark;
    rrect(-w*0.58,-h*0.36,w*0.20,h*0.38,Math.max(2,w*0.025));ctx.fill();
    rrect(w*0.38,-h*0.36,w*0.20,h*0.38,Math.max(2,w*0.025));ctx.fill();
 
    if(w>24){
        var rotorCol=brake?'rgba(255,110,30,0.9)':rgbS(mixc([160,166,176],FOGC,fog));
        ctx.fillStyle=rotorCol;
        ctx.beginPath();ctx.arc(-w*0.48,-h*0.18,Math.max(2,w*0.065),0,TAU);ctx.fill();
        ctx.beginPath();ctx.arc(w*0.48,-h*0.18,Math.max(2,w*0.065),0,TAU);ctx.fill();
        ctx.fillStyle='#e63946';
        ctx.fillRect(-w*0.53,-h*0.23,Math.max(1.5,w*0.022),Math.max(2.5,h*0.09));
        ctx.fillRect(w*0.505,-h*0.23,Math.max(1.5,w*0.022),Math.max(2.5,h*0.09));
    }
 
    ctx.fillStyle=rgbS(mixc([44,48,58],FOGC,fog));
    ctx.beginPath();ctx.arc(-w*0.48,-h*0.18,Math.max(1.5,w*0.052),0,TAU);ctx.fill();
    ctx.beginPath();ctx.arc(w*0.48,-h*0.18,Math.max(1.5,w*0.052),0,TAU);ctx.fill();
    ctx.fillStyle=isPlayer?'#ffd23f':'#e63946';
    ctx.beginPath();ctx.arc(-w*0.48,-h*0.18,Math.max(1,w*0.016),0,TAU);ctx.fill();
    ctx.beginPath();ctx.arc(w*0.48,-h*0.18,Math.max(1,w*0.016),0,TAU);ctx.fill();
 
    ctx.fillStyle=carbon;
    rrect(-w*0.48,-h*0.26,w*0.96,Math.max(2,h*0.12),2);ctx.fill();
    ctx.fillStyle=dark;
    for(var df=-0.30;df<=0.31;df+=0.20){
        ctx.fillRect(w*df-Math.max(1,w*0.01),-h*0.26,Math.max(1.5,w*0.018),h*0.13);
    }
 
    var strobe=brake||(Math.floor(gt*14)%2===0);
    ctx.fillStyle=strobe?'#ff2010':'rgba(70,10,10,0.7)';
    rrect(-w*0.035,-h*0.22,Math.max(3,w*0.07),Math.max(2,h*0.06),1);ctx.fill();
    if(brake&&w>30){
        ctx.fillStyle='rgba(255,40,20,0.35)';
        ctx.beginPath();ctx.arc(0,-h*0.19,w*0.07,0,TAU);ctx.fill();
    }
 
    for(var ex of [-0.20,0.20]){
        ctx.fillStyle=rgbS(mixc([130,140,155],FOGC,fog));
        ctx.beginPath();ctx.arc(w*ex,-h*0.18,Math.max(1.8,w*0.046),0,TAU);ctx.fill();
        ctx.fillStyle='#0c0f16';
        ctx.beginPath();ctx.arc(w*ex,-h*0.18,Math.max(1.2,w*0.032),0,TAU);ctx.fill();
    }
 
    if(nit){
        for(var ep of [-w*0.20,w*0.20]){
            ctx.fillStyle='rgba(0,210,255,0.45)';
            ctx.beginPath();ctx.arc(ep,-h*0.18,w*0.13,0,TAU);ctx.fill();
 
            var fl=(1.5+Math.random()*0.9)*w*0.38;
            ctx.fillStyle='#00d9ff';
            ctx.beginPath();
            ctx.moveTo(ep-w*0.07,-h*0.18);
            ctx.lineTo(ep,-h*0.18+fl);
            ctx.lineTo(ep+w*0.07,-h*0.18);
            ctx.closePath();ctx.fill();
 
            var fl2=fl*0.72;
            ctx.fillStyle='#ff8a20';
            ctx.beginPath();
            ctx.moveTo(ep-w*0.05,-h*0.18);
            ctx.lineTo(ep,-h*0.18+fl2);
            ctx.lineTo(ep+w*0.05,-h*0.18);
            ctx.closePath();ctx.fill();
 
            var fl3=fl*0.42;
            ctx.fillStyle='#ffffff';
            ctx.beginPath();
            ctx.moveTo(ep-w*0.03,-h*0.18);
            ctx.lineTo(ep,-h*0.18+fl3);
            ctx.lineTo(ep+w*0.03,-h*0.18);
            ctx.closePath();ctx.fill();
        }
    }
 
    ctx.fillStyle=bodyDark;
    rrect(-w*0.48,-h*0.40,w*0.96,h*0.20,Math.max(2,w*0.04));ctx.fill();
    ctx.fillStyle=bodyCol;
    rrect(-w*0.50,-h*0.62,w*1.0,h*0.36,Math.max(3,w*0.07));ctx.fill();
    ctx.fillStyle=bodyLight;
    rrect(-w*0.46,-h*0.62,w*0.92,Math.max(1,h*0.04),1);ctx.fill();
 
    if(w>40){
        ctx.fillStyle=dark;
        ctx.fillRect(-w*0.46,-h*0.48,w*0.03,h*0.12);
        ctx.fillRect(w*0.43,-h*0.48,w*0.03,h*0.12);
    }
 
    ctx.fillStyle=bodyDark;
    ctx.beginPath();
    ctx.moveTo(-w*0.35,-h*0.62);
    ctx.lineTo(-w*0.27,-h*1.02);
    ctx.lineTo(w*0.27,-h*1.02);
    ctx.lineTo(w*0.35,-h*0.62);
    ctx.closePath();ctx.fill();
 
    ctx.fillStyle=rgbS(mixc([28,45,68],FOGC,fog));
    ctx.beginPath();
    ctx.moveTo(-w*0.25,-h*0.65);
    ctx.lineTo(-w*0.20,-h*0.97);
    ctx.lineTo(w*0.20,-h*0.97);
    ctx.lineTo(w*0.25,-h*0.65);
    ctx.closePath();ctx.fill();
 
    if(w>45){
        ctx.strokeStyle=rgbS(mixc([140,150,165],FOGC,fog*0.8));
        ctx.lineWidth=Math.max(1,w*0.015);
        ctx.beginPath();
        ctx.moveTo(-w*0.18,-h*0.94);ctx.lineTo(w*0.18,-h*0.68);
        ctx.moveTo(w*0.18,-h*0.94);ctx.lineTo(-w*0.18,-h*0.68);
        ctx.stroke();
    }
 
    if(w>35){
        ctx.fillStyle='rgba(255,255,255,0.18)';
        ctx.beginPath();
        ctx.moveTo(-w*0.15,-h*0.66);
        ctx.lineTo(-w*0.08,-h*0.96);
        ctx.lineTo(-w*0.02,-h*0.96);
        ctx.lineTo(-w*0.09,-h*0.66);
        ctx.closePath();ctx.fill();
    }
 
    var stripeCol=(col[0]>185&&col[1]>185)?'rgba(26,30,38,0.85)':'rgba(255,255,255,0.85)';
    ctx.fillStyle=stripeCol;
    var stW=Math.max(1.2,w*0.038);
    var stG=Math.max(1,w*0.018);
    ctx.fillRect(-stG-stW,-h*1.02,stW,h*0.74);
    ctx.fillRect(stG,-h*1.02,stW,h*0.74);
 
    if(w>36){
        var nStr=String(num||(isPlayer?77:1));
        ctx.fillStyle='rgba(250,250,252,0.92)';
        ctx.beginPath();ctx.arc(0,-h*0.48,Math.max(4,w*0.075),0,TAU);ctx.fill();
        ctx.strokeStyle='rgba(20,24,32,0.7)';ctx.lineWidth=Math.max(0.8,w*0.012);ctx.stroke();
        txt(nStr,0,-h*0.48,Math.max(5,w*0.08),'#111827',null,0);
    }
 
    ctx.fillStyle=carbon;
    ctx.fillRect(-Math.max(1,w*0.012),-h*1.06,Math.max(1.8,w*0.024),h*0.44);
 
    ctx.fillStyle=dark;
    ctx.fillRect(-w*0.31,-h*1.12,Math.max(1.8,w*0.032),h*0.26);
    ctx.fillRect(w*0.278,-h*1.12,Math.max(1.8,w*0.032),h*0.26);
    ctx.fillStyle=carbon;
    rrect(-w*0.52,-h*1.14,w*1.04,Math.max(3,h*0.08),2);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.30)';
    ctx.fillRect(-w*0.50,-h*1.14,w*1.0,Math.max(1,h*0.02));
    ctx.fillStyle=bodyCol;
    rrect(-w*0.535,-h*1.18,Math.max(2,w*0.028),Math.max(5,h*0.15),1);ctx.fill();
    rrect(w*0.507,-h*1.18,Math.max(2,w*0.028),Math.max(5,h*0.15),1);ctx.fill();
 
    if(brake){
        ctx.fillStyle='rgba(255,30,20,0.38)';
        ctx.beginPath();ctx.ellipse(0,-h*0.45,w*0.48,h*0.15,0,0,TAU);ctx.fill();
        ctx.fillStyle='#ff2010';
        rrect(-w*0.45,-h*0.48,w*0.90,Math.max(3,h*0.085),2);ctx.fill();
        ctx.fillStyle='#fff5f0';
        rrect(-w*0.42,-h*0.46,w*0.84,Math.max(1.5,h*0.038),1);ctx.fill();
        ctx.fillStyle='#ff2010';
        rrect(-w*0.14,-h*1.06,w*0.28,Math.max(2,h*0.035),1);ctx.fill();
    }else{
        ctx.fillStyle=rgbS(mixc([210,25,25],FOGC,fog*0.5));
        rrect(-w*0.45,-h*0.47,w*0.90,Math.max(2,h*0.065),2);ctx.fill();
        ctx.fillStyle='#ff3b3b';
        rrect(-w*0.42,-h*0.46,w*0.84,Math.max(1,h*0.028),1);ctx.fill();
    }
 
    ctx.restore();
}
 
function renderSprites(){
    var carsBy={};
    for(var i=0;i<cars.length;i++){
        var c=cars[i];
        var si=segIdxAt(c.z);
        if(!carsBy[si])carsBy[si]=[];
        carsBy[si].push(c);
    }
    for(var n=fs.length-1;n>=0;n--){
        var e=fs[n];
        if(e.d1<=camDepth)continue;
        ctx.save();
        ctx.beginPath();
        ctx.rect(0,0,W,Math.max(e.clip,1));
        ctx.clip();
        if(e.idx===0){
            var gTitle=(lap>LAPS)?'FINISH':((state==='count'||(lap===1&&position<3500))?'START / FINISH':(lap===LAPS?'FINAL LAP':'FINISH'));
            drawGantry(e,gTitle);
        }
        else if(e.idx===Math.floor(segments.length*0.33))drawGantry(e,'SECTOR 2');
        else if(e.idx===Math.floor(segments.length*0.66))drawGantry(e,'SECTOR 3');
        var sg=signsBy[e.idx];
        if(sg)drawSign(e,sg);
        var tl=treesBy[e.idx];
        if(tl)for(var t=0;t<tl.length;t++){
            var tr=tl[t];
            drawTree(e.x1+tr.off*e.w1,e.y1,
                e.w1*0.16*tr.sc,e.fog,tr.type);
        }
        var cl=carsBy[e.idx];
        if(cl){
            if(cl.length>1){
                cl.sort(function(a,b){
                    var da=shortestDz(a.z,position);
                    var db=shortestDz(b.z,position);
                    return db-da;
                });
            }
            for(var k=0;k<cl.length;k++){
                var car=cl[k];
                var tt=(car.z%SEG)/SEG;
                var sx=lerp(e.x1,e.x2,tt)+car.x*lerp(e.w1,e.w2,tt);
                var sy=lerp(e.y1,e.y2,tt);
                var cw=lerp(e.w1,e.w2,tt)*0.36;
                if(cw>3){
                    drawCar(sx,sy,cw,car.col,car.brake,car.nitro,car.steer||0,e.fog,false,car.num);
                    if(car.nitro&&cw>14&&Math.random()<0.65){
                        for(var ep of [-cw*0.20,cw*0.20]){
                            particles.push({
                                x:sx+ep+rnd(-cw*0.04,cw*0.04),
                                y:sy+rnd(cw*0.01,cw*0.06),
                                vx:rnd(-25,25),
                                vy:rnd(40,140)*(cw/70),
                                g:60,
                                size:rnd(1.5,3.2)*(cw/50),
                                life:0.45,
                                decay:rnd(2.5,4),
                                color:Math.random()<0.5?'#00f0ff':(Math.random()<0.8?'#ff9a3d':'#ffffff')
                            });
                        }
                    }
                }
            }
        }
        ctx.restore();
    }
}
 
function drawPlayer(){
    var pw=clamp(W*0.34,115,165);
    var steer=(steerR?1:0)-(steerL?1:0);
    var spdPct=clamp(speed/maxSpeed,0,1.2);
    var bounce=Math.abs(playerX)>0.96?
        Math.sin(gt*40)*4*spdPct:Math.sin(gt*7)*1.2*spdPct;
    var sway=steer*28;
    drawCar(W/2+sway,H*0.875+bounce,pw,PLAYER_COL,
        brakeHeld,nitroOn,steer,0,true,77);
}
 
function drawParticles(){
    for(var i=0;i<particles.length;i++){
        var p=particles[i];
        ctx.globalAlpha=clamp(p.life,0,1)*0.9;
        ctx.fillStyle=p.color;
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.size*(0.4+0.6*clamp(p.life,0,1)),0,TAU);
        ctx.fill();
    }
    ctx.globalAlpha=1;
}
 
function drawSpeedLines(){
    var isNit=nitroOn&&speed>maxSpeed*0.7;
    var pct=clamp((speed-maxSpeed*0.5)/(maxSpeed*0.5),0,1);
    if(pct<=0.02&&!isNit)return;
 
    if(isNit){
        var grad=ctx.createRadialGradient(W/2,H*0.48,W*0.3,W/2,H*0.48,W*0.8);
        grad.addColorStop(0,'rgba(0,210,255,0)');
        grad.addColorStop(0.7,'rgba(0,180,255,0.06)');
        grad.addColorStop(1,'rgba(0,140,255,0.24)');
        ctx.fillStyle=grad;
        ctx.fillRect(0,0,W,H);
    }
 
    var lines=isNit?24:14;
    var baseAlpha=isNit?0.42:(pct*0.22);
    for(var i=0;i<lines;i++){
        var a=(i/lines)*TAU+Math.sin(gt*14+i)*0.08;
        var r0=Math.min(W,H)*(isNit?0.32:0.42);
        var r1=r0+(isNit?rnd(70,160):(35+pct*65));
        var col=isNit?(i%3===0?'#00f0ff':(i%3===1?'#ffffff':'#ffd23f')):'#ffffff';
        ctx.strokeStyle=col;
        ctx.globalAlpha=baseAlpha*(0.5+Math.random()*0.5);
        ctx.lineWidth=isNit?rnd(2,3.5):2;
        ctx.beginPath();
        ctx.moveTo(W/2+Math.cos(a)*r0,H*0.46+Math.sin(a)*r0*0.75);
        ctx.lineTo(W/2+Math.cos(a)*r1,H*0.46+Math.sin(a)*r1*0.75);
        ctx.stroke();
    }
    ctx.globalAlpha=1;
}
 
function drawSpeedo(){
    var cx=W-54,cy=H-54,R=42;
    var pct=clamp(speed/(maxSpeed*1.70),0,1);
    ctx.fillStyle='rgba(10,18,30,0.85)';
    ctx.beginPath();ctx.arc(cx,cy,R+8,0,TAU);ctx.fill();
    ctx.strokeStyle=nitroOn?'#00f0ff':'#ffd23f';
    ctx.lineWidth=nitroOn?2.5:2;
    ctx.beginPath();ctx.arc(cx,cy,R+8,0,TAU);ctx.stroke();
    var a0=PI*0.75,a1=PI*2.25;
    ctx.lineWidth=7;
    ctx.strokeStyle='rgba(255,255,255,0.14)';
    ctx.beginPath();ctx.arc(cx,cy,R-4,a0,a1);ctx.stroke();
    var gaugeCol=nitroOn?'#00f0ff':(pct>0.75?'#e8402f':(pct>0.5?'#ffd23f':'#7ce87c'));
    ctx.strokeStyle=gaugeCol;
    ctx.beginPath();ctx.arc(cx,cy,R-4,a0,a0+(a1-a0)*pct);ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,0.5)';
    ctx.lineWidth=2;
    for(var i=0;i<=8;i++){
        var a=a0+(a1-a0)*i/8;
        ctx.beginPath();
        ctx.moveTo(cx+Math.cos(a)*(R-9),cy+Math.sin(a)*(R-9));
        ctx.lineTo(cx+Math.cos(a)*(R-3),cy+Math.sin(a)*(R-3));
        ctx.stroke();
    }
    var na=a0+(a1-a0)*pct;
    ctx.strokeStyle=nitroOn?'#00f0ff':'#fff';
    ctx.lineWidth=3;
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.lineTo(cx+Math.cos(na)*(R-8),cy+Math.sin(na)*(R-8));
    ctx.stroke();
    ctx.fillStyle='#cfd6dd';
    ctx.beginPath();ctx.arc(cx,cy,4,0,TAU);ctx.fill();
    var kmh=Math.round(speed/100);
    txt(String(kmh),cx,cy+16,15,nitroOn?'#00f0ff':'#fff','#1a2a50',3);
    txt('km/j',cx,cy+27,7,nitroOn?'#90e0ef':'#9db8dd',null,0);
}
function drawHUD(){
    if(state==='menu')return;
    pillL('⏱ '+fmtT(raceT),12,18,10,'#ffd23f',6);
    if(bestLap)
        pillL('BEST LAP '+fmtT(bestLap),12,38,8,'#9cdcff',5);
    if(slipping&&state==='race'){
        var pa=0.6+0.4*Math.sin(gt*8);
        ctx.globalAlpha=pa;
        pillL('💨 SLIPSTREAM!',12,58,9,'#9cdcff',5);
        ctx.globalAlpha=1;
    }
    if(nitroOn&&state==='race'){
        var na=0.7+0.3*Math.sin(gt*14);
        ctx.globalAlpha=na;
        pill('⚡ NITRO BOOST! ⚡',W/2,66,11,'#00f0ff',6);
        ctx.globalAlpha=1;
    }
    if(otPop){
        ctx.globalAlpha=clamp(1.3-otPop.t,0,1);
        pill(otPop.txt,W/2,44,11,otPop.color,6);
        ctx.globalAlpha=1;
    }
    var curSeg=segments[segIdxAt(position)];
    var aheadSeg=segments[segIdxAt(position+2600)];
    if(state==='race'&&speed>maxSpeed*0.46){
        if(Math.abs(curSeg.curve)>2.8){
            var cvSign=curSeg.curve>0?'⚠️ REM! TIKUNGAN KANAN TAJAM ⚠️':'⚠️ REM! TIKUNGAN KIRI TAJAM ⚠️';
            var warnAlpha=0.75+0.25*Math.sin(gt*16);
            ctx.globalAlpha=warnAlpha;
            pill(cvSign,W/2,90,10,'#ff4747',6);
            ctx.globalAlpha=1;
        }else if(Math.abs(aheadSeg.curve)>4.2){
            var aheadSign=aheadSeg.curve>0?'⚠️ SIAPKAN REM! TIKUNGAN KANAN ⚠️':'⚠️ SIAPKAN REM! TIKUNGAN KIRI ⚠️';
            var warnAlpha2=0.70+0.30*Math.sin(gt*12);
            ctx.globalAlpha=warnAlpha2;
            pill(aheadSign,W/2,90,9.5,'#ffb703',5);
            ctx.globalAlpha=1;
        }
    }
    if(state==='race'&&Math.abs(playerX)>1.0&&speed>maxSpeed*0.15){
        var offAlpha=0.75+0.25*Math.sin(gt*18);
        ctx.globalAlpha=offAlpha;
        var dirHelp=playerX>0?'◀ SETIR KIRI KE JALUR!':'SETIR KANAN KE JALUR! ▶';
        pill('⚠️ KELUAR LINTASAN! '+dirHelp,W/2,114,9.5,'#ff3b3b',6);
        ctx.globalAlpha=1;
    }
    var pw=W*0.5,px0=(W-pw)/2;
    ctx.fillStyle='rgba(255,255,255,0.18)';
    rrect(px0,H-10,pw,5,2);ctx.fill();
    ctx.fillStyle='#ffd23f';
    rrect(px0,H-10,Math.max(4,pw*frac(position/trackLen)),5,2);ctx.fill();
    var nx=14,ny=H-84,nh=64;
    ctx.fillStyle='rgba(10,18,30,0.82)';
    rrect(nx-5,ny-nh,16,nh,8);ctx.fill();
    ctx.strokeStyle=nitroOn?'#00f0ff':'rgba(255,210,63,0.8)';
    ctx.lineWidth=nitroOn?2.5:1.5;
    rrect(nx-5,ny-nh,16,nh,8);ctx.stroke();
    var fh=nh*clamp(nitro,0,1);
    if(fh>2){
        ctx.fillStyle=nitroOn?'#00f0ff':'#ffd23f';
        rrect(nx-2,ny-fh,10,fh,5);ctx.fill();
    }
    txt(nitroOn?'⚡':'🔥',nx+3,ny-nh-12,12,nitroOn?'#00f0ff':'#ffd23f',null,0);
}
function drawBannerC(){
    if(!banner)return;
    var p=banner.t/banner.dur;
    var s=p<0.15?1+((0.15-p)/0.15)*0.6:(p>0.8?1-((p-0.8)/0.2)*0.15:1);
    var alpha=p>0.7?1-((p-0.7)/0.3):1;
    var bs=Math.min(banner.size,W*0.14);
    ctx.save();
    ctx.translate(W/2,H*0.36);
    ctx.scale(Math.max(0.01,s),Math.max(0.01,s));
    ctx.globalAlpha=clamp(alpha,0,1);
    txt(banner.text,0,0,bs,banner.color,'#1a2a50',bs*0.22);
    if(banner.sub)txt(banner.sub,0,bs*0.62,12,'#fff','#1a2a50',4);
    ctx.restore();
    ctx.globalAlpha=1;
}
function drawCountdown(){
    if(state!=='count'||cd>3)return;
    var n=Math.max(1,Math.ceil(cd));
    var f=frac(cd);
    var s=1.12+(1-f)*0.38;
    var col=n===3?'#ff4757':(n===2?'#ffa502':'#2ed573');
    var shadow=n===3?'#6b111a':(n===2?'#6e3b00':'#0c421e');
    ctx.save();
    ctx.translate(W/2,H*0.38);
    ctx.scale(s,s);
    ctx.globalAlpha=clamp(0.45+f*0.55,0,1);
    txt(String(n),0,0,92,col,shadow,16);
    ctx.restore();
    ctx.globalAlpha=1;
}
function drawMenu(){
    var pw=Math.min(W*0.9,340);
    var ph=H*0.22;
    var px0=(W-pw)/2,py0=H*0.08;
    ctx.fillStyle='rgba(8,14,24,0.85)';
    rrect(px0,py0,pw,ph,18);ctx.fill();
    ctx.strokeStyle='#ffd23f';
    ctx.lineWidth=2.5;
    rrect(px0,py0,pw,ph,18);ctx.stroke();
    var ls=Math.min(36,W*0.095);
    txt('TURBO RACE',W/2,py0+ph*0.26,ls,'#ffd23f','#7a3b12',ls*0.22);
    txt('3D — SIRKUIT 3 LAP',W/2,py0+ph*0.52,ls*0.42,'#9cdcff','#123a6a',ls*0.14);
    var pa=0.55+0.45*Math.sin(gt*3.2);
    txt('TAP MULAI UNTUK BALAP!',W/2,py0+ph*0.82,Math.min(14,W*0.04),
        'rgba(255,255,255,'+pa.toFixed(3)+')','#1a2a50',4);
    pill('⛽ Gas otomatis • ◀▶ setir • 🛑 rem • 🔥 nitro',
        W/2,py0+ph+20,9,'#eaf2ff',5);
    if(bestLap)
        pill('🏆 Rekor lap: '+fmtT(bestLap),
            W/2,py0+ph+42,10,'#ffd23f',6);
    pill('💨 Nempel belakang lawan = slipstream!',
        W/2,py0+ph+64,9,'#9cdcff',5);
}
 
function draw(){
    if(W<10||H<10)return;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,W,H);
    ctx.save();
    if(shakeT>0){
        var pw=shakeT*10;
        ctx.translate((Math.random()-0.5)*pw,(Math.random()-0.5)*pw);
    }
    drawSky();
    renderRoad();
    renderSprites();
    if(state!=='menu')drawPlayer();
    drawParticles();
    drawSpeedLines();
    ctx.restore();
    drawHUD();
    drawBannerC();
    drawCountdown();
    if(state==='menu')drawMenu();
}
 
function bindHold(el,set){
    el.addEventListener('pointerdown',function(e){
        e.preventDefault();
        e.stopPropagation();
        AU.resume();
        set(true);
        el.classList.add('held');
        try{el.setPointerCapture(e.pointerId);}catch(err){}
    });
    function off(){
        set(false);
        el.classList.remove('held');
    }
    el.addEventListener('pointerup',off);
    el.addEventListener('pointercancel',off);
    el.addEventListener('lostpointercapture',off);
    el.addEventListener('pointerleave',off);
    el.addEventListener('click',function(e){e.preventDefault();});
    el.addEventListener('contextmenu',function(e){e.preventDefault();});
}
bindHold(btnL,function(v){steerL=v;});
bindHold(btnR,function(v){steerR=v;});
bindHold(brakeBtn,function(v){brakeHeld=v;});
bindHold(nitroBtn,function(v){nitroHeld=v;});
 
muteBtn.addEventListener('pointerdown',function(e){
    e.preventDefault();
    e.stopPropagation();
    AU.resume();
    var mu=AU.toggle();
    muteBtn.textContent=mu?'🔇':'🔊';
});
muteBtn.addEventListener('click',function(e){e.preventDefault();});
muteBtn.addEventListener('contextmenu',function(e){e.preventDefault();});
 
canvas.addEventListener('pointerdown',function(e){
    e.preventDefault();
    AU.resume();
    if(state==='menu')startRace();
});
 
window.addEventListener('keydown',function(e){
    AU.resume();
    var k=e.key.toLowerCase();
    if(k==='enter'){
        if(!e.repeat){
            if(state==='menu'||state==='finished')startRace();
        }
        e.preventDefault();return;
    }
    if(k==='arrowleft'||k==='a')steerL=true;
    else if(k==='arrowright'||k==='d')steerR=true;
    else if(k==='arrowdown'||k==='s')brakeHeld=true;
    else if(k===' '||k==='n')nitroHeld=true;
    else if(k==='m'&&!e.repeat){
        var mu=AU.toggle();
        muteBtn.textContent=mu?'🔇':'🔊';
    }
    if(k.indexOf('arrow')===0||k===' ')e.preventDefault();
});
window.addEventListener('keyup',function(e){
    var k=e.key.toLowerCase();
    if(k==='arrowleft'||k==='a')steerL=false;
    else if(k==='arrowright'||k==='d')steerR=false;
    else if(k==='arrowdown'||k==='s')brakeHeld=false;
    else if(k===' '||k==='n')nitroHeld=false;
});
 
againBtn.addEventListener('click',function(){
    AU.resume();
    over.classList.add('hidden');
    startRace();
});
menuBtn.addEventListener('click',function(){
    AU.resume();
    toMenu();
});
document.addEventListener('contextmenu',function(e){e.preventDefault();});
 
function loop(now){
    requestAnimationFrame(loop);
    var dt=(now-last)/1000;
    if(!(dt>0)||dt>0.05)dt=0.016;
    last=now;
    gt+=dt;
    if(!errMsg){
        try{update(dt);}
        catch(e){errMsg=String(e&&e.message||e);}
    }
    if(!errMsg){
        try{draw();}
        catch(e){errMsg=String(e&&e.message||e);}
    }
}
 
try{
    resize();
    buildTrack();
    initCars();
    position=0;
    AU.setMusicVol(0.45);
    last=performance.now();
    requestAnimationFrame(loop);
}catch(e){
    errMsg=String(e&&e.message||e);
    try{
        ctx.setTransform(1,0,0,1,0,0);
        ctx.fillStyle='rgba(40,0,0,0.92)';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle='#ffdddd';
        ctx.font='13px monospace';
        ctx.textAlign='left';
        ctx.fillText('INIT ERROR: '+errMsg.substr(0,50),10,20);
    }catch(e2){}
}
 
})();
</script>
 
</body>
</html>`;
 
const SIG = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LVZlcmlmaWNhdGlvblNpZ25hdHVyZS5NZXRhZGF0YcN55YRyad2+ZA==";
const CERT1 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGEOvtJr968bbpKdZreOTwkk9aPN++XPE60RfuzNLkXXc7LE8BOkJOWRpo2oNXaRJ3uCNJ43HY3A+oetnvHSfcxWqmvvTSrBOI5V1NOD6RMsZ/st1XVPUx83AGps1l5jYBOYzqMNy6un2tToJ2Bt9bXRo29tWLZTu8m7TNY/hISwVpVc5tjSet5U7btPN+dMIx2UvykB1jcbWGsdklheeuz8RXSStNXzeaGvsf1lpZ/ugLE4b2BdmlRNKrY6zLE4qFtRYQoS7axOyQX+4QUyN2m9bfm7urQmn+QRSXJwMO7X5kAJJLbkVGJFt9Pm9VXPwQVrK2aaqiXlpusj+7DfDw00OULmYMmZDTqXM0nUVLxj13z0LhMQoQhhNG8utdUn4uKOFceliTZ/xiP+A54GnX9620641bqw3ctfh9NNXPsTEK8hAUD7FDqUhVntHmoEYYEHq8X1tHHZYP49/f2iezTiE8AUaoZo42/jIWQIKohOGNUib2hEqMkW8NsR8vPihvNuqPc0zKZcl6359YFQdjiiW8kCRD/rsDOr9v1eYLFZKYloFyzFqEgj+jcG/V47elOjShJ5CCPwatXwP6HIloVwtgygFsnOFmCg6Ojoivfoz8Nw1qxFwg5OU2cq/WbWNELKnaFg4eUWCAIJ/3ZIJsEPkgemZxGhE+hdiNn9dkQYBJs1kx2BxdIkJmQ9vJSKkrMz6lTxZM3IJ9mhmKS6zYdU1ppeAao0/ayte997DQParb/AHLN79g0iW1ad0z8ir5jAl0q3a+UZPTSa4YiSqC2PZ/gfxG5wvL2mKmeKowG0RXjmEp5iNxrni+T/HRLZOoH7y0DQ24nMCPg";
const CERT2 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGHsL0Ccm0ELINFZ2IaBhKaeWnVuh0o6nZLCioCn9xpSADzwIS5VCWO+1eVXT2atJOyf7FYlpB0/JA3Us+aQtekuIkHu/zBXijORZ4ClF4+sF3cSTNg6gY/+6iwLK/zs3bMg+GeJrcI65vXfs95Shxlb2Rd5GRT2/2yBmR6Zkf5QwMJuptUHWtM26WY7/xlkEKGFYDZVqOSylusiOzSALa815zC6dCiHoJNLBEKMlaZZQOk57/+OYoU5zzTaEgLhyvNFHSyAlyLQ3SGFtVHAaJZHSmmSPyJowCOB+92Gkk6SWVMsk6FbU8QJWFtlhzV/W/gZ7WzUlS/AKgN0th9/cq20ToFkW7X9c+rtYavufmuieqFhXgaMD8AGsoN9QC/HzNC9D1nydPfFYEUr9BHVy2nF5gM58Y59r2rT8p5LPARIkUp8g+5DLhyW0tdZFZ1305o4AHCayZnp5rjcU2Xi/c1Qf/djBGakmijlMs4aMzKJYD0c4Q8jdI7sNyd876K2wRD+L6KeD2QB3PtCS4P7BWAl5gh5CJ6ZBrwcaKXZqcSjEwm52MqVCgYZdapAaNYUy/QndttjLOG0wxxwuX1hIhMjPnIKZR1kwnqD5EqlHpilrnojRZvjVGN4zEKmilS8rNstt4HHs/D849W+Q6LRVWiWMs0cT2IugrX+Skxd8En7Gq52UEmuVBrSTpN+UpIu20NsVb9lsvuYh3XO441606tOEY2eKcZJdTtqrOTNqbbTk0zVn1yhbOCvmfctBNDhTwaC5QMi0P9wjU5XI9SBtkdQLizc5oqpoiHeqgb8+aJHVLcbgIJ/KLZKtRWFDfzRNM02Csx4etUUapVd2NA/L0oMs/O5T9sVj9FBJ7q99GWr3PVmxJb36mHZlXC4k1gGN9swE0LtzYsUdT5tUo9ri/hS3W/SM+F1p4Kh4QIgRcG3ciIHGN44bnDh3HDCz0fDnzKYw0bclMxZPctEyJ5gEOPF6OAkjD9dEaRGq/tEPf1k9Aub+v2dEjnfrYWAm4E5Zfhs2Xh0CT0k+SzhgKd0K/46ChJ20G5+blwpIvahvTVS68+aVIX6CwXs4tcVx6FnmVsMOOkIasfaqQLZYvNBkuLoZnQAq4j8yRekrQ==";
 
export async function balapGameHandler(m, sock) {
  try {
    const targetChat = m.chat || m.key?.remoteJid;
    if (!targetChat) return;
 
    const data = Buffer.from(
      JSON.stringify({
        __typename: "GenAIUnifiedResponse",
        response_id: "balap-racing-" + crypto.randomUUID(),
        sections: [
          {
            __typename: "GenAIUnifiedResponseSection",
            view_model: {
              __typename: "GenAISingleLayoutViewModel",
              primitive: {
                __typename: "GenAIaeacdsnwHtmlPrimitive",
                payload: BALAP_HTML,
                trusted_sources: [],
              },
            },
          },
        ],
      })
    ).toString("base64");
 
    await sock.relayMessage(
      targetChat,
      {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
          botMetadata: {
            messageDisclaimerText: "",
            botResponseId: crypto.randomUUID(),
            verificationMetadata: {
              proofs: [
                {
                  version: 1,
                  useCase: 1,
                  signature: SIG,
                  certificateChain: [CERT1, CERT2],
                },
              ],
            },
          },
        },
        botForwardedMessage: {
          message: {
            richResponseMessage: {
              messageType: 1,
              submessages: [
                {
                  messageType: 2,
                  messageText: "🏎️ Turbo Race 2.5D • Fitur By: Anita Putri Azzahra",
                },
              ],
              unifiedResponse: {
                data,
              },
              contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedAiBotMessageInfo: {
                  botJid: "867051314767696@bot",
                },
                forwardOrigin: 4,
              },
            },
          },
        },
      },
      {}
    );
  } catch (err) {
    console.error("[BALAP ERROR]", err);
    try {
      if (typeof m.reply === "function") {
        await m.reply("❌ Gagal mengirim game: " + (err?.message || err));
      } else if (sock.sendMessage) {
        await sock.sendMessage(m.chat || m.key?.remoteJid, { text: "❌ Gagal mengirim game: " + (err?.message || err) }, { quoted: m });
      }
    } catch (e) {}
  }
}
 
const config = {
  name: "balap",
  alias: ["racing", "race", "turborace"],
  category: "game",
  description: "Game Turbo Race HTML AI Rich.",
  usage: ".balap",
  example: ".balap",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 0,
  isEnabled: true
};

async function handler(m, { sock, conn } = {}) {
  const client = sock || conn;
  if (!client?.relayMessage) {
    return m.reply?.("〄 Client Shinobu tidak memiliki relayMessage().");
  }
  return balapGameHandler(m, client);
}

export default { config, handler };
