import { AIRich, MB } from '../../messagebuilder.js'; 

const htmlPayload = String.raw`<style>
* { -webkit-tap-highlight-color: transparent; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; box-sizing: border-box; }
body { margin: 0; background: transparent; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #eee; touch-action: manipulation; cursor: pointer; }
.wrap { width: 100%; max-width: 560px; margin: auto; padding: 12px; }
.card { background: rgba(15, 18, 28, 0.88); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(0, 243, 255, 0.25); border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0, 243, 255, 0.15), 0 0 15px rgba(157, 78, 221, 0.2); }
.head { padding: 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; justify-content: space-between; align-items: center; background: linear-gradient(90deg, rgba(0,243,255,0.05), rgba(157,78,221,0.05)); }
.brand { font-size: 10px; letter-spacing: 2px; color: #00f3ff; font-weight: 700; text-transform: uppercase; }
.title { font-size: 19px; font-weight: 900; color: #fff; text-shadow: 0 0 10px rgba(0, 243, 255, 0.6); letter-spacing: 1px; }
.stats { text-align: right; display: flex; align-items: center; gap: 12px; }
.label { font-size: 9px; color: rgba(255, 255, 255, 0.5); font-weight: 600; }
.value { font-size: 16px; font-weight: 900; color: #00f3ff; text-shadow: 0 0 10px rgba(0, 243, 255, 0.8); }
.main { padding: 12px; position: relative; }
.board { position: relative; width: 100%; border-radius: 12px; overflow: hidden; border: 1px solid rgba(0, 243, 255, 0.2); background: #080b12; }
canvas#game { width: 100%; height: auto; display: block; touch-action: none; }
.overlay { position: absolute; inset: 0; background: rgba(6, 9, 17, 0.85); backdrop-filter: blur(6px); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10; transition: opacity 0.2s ease; }
.overlay.hidden { opacity: 0; pointer-events: none; }
.overlay-title { font-size: 28px; font-weight: 900; color: #ff0055; text-shadow: 0 0 15px rgba(255,0,85,0.5); margin-bottom: 5px; }
.overlay-sub { font-size: 12px; color: rgba(255,255,255,0.7); font-weight: 600; letter-spacing: 1px; }
.button { background: linear-gradient(135deg, #00f3ff, #7209b7); border: none; border-radius: 8px; color: #fff; font-weight: 900; padding: 10px 24px; cursor: pointer; font-size: 12px; box-shadow: 0 4px 15px rgba(0,243,255,0.3); }
.button:active { transform: scale(0.95); }
.status { text-align: center; margin-top: 8px; font-size: 11px; color: rgba(255, 255, 255, 0.6); font-weight: 600; letter-spacing: 1px; }
.controls { display: flex; justify-content: center; margin-top: 12px; }
.pad { display: grid; grid-template-columns: repeat(3, 52px); grid-template-rows: repeat(2, 44px); gap: 6px; }
.pad .button { padding: 0; font-size: 18px; }
.up { grid-column: 2; }
.left { grid-column: 1; }
.down { grid-column: 2; }
.right { grid-column: 3; }
</style><body><div class="wrap"><div class="card"><div class="head"><div><div class="brand">LUMNZTYZ6X</div><div class="title">NEON SNAKE</div></div><div class="stats"><div><div class="label">SCORE</div><div class="value" id="score">00000</div></div><div><div class="label">BEST</div><div class="value" id="best">00000</div></div></div></div>
<div class="main"><div class="board" id="board"><canvas id="game" width="560" height="300"></canvas><div class="overlay" id="overlay"><div class="overlay-title" id="overTitle">NEON SNAKE</div><div class="overlay-sub" id="overSub">EAT THE DOTS &bull; DO NOT CRASH</div><button class="button primary" id="start" style="margin-top:15px">START</button></div></div><div class="controls"><div class="pad"><button class="button up" data-dir="up">&#9650;</button><button class="button left" data-dir="left">&#9664;</button><button class="button down" data-dir="down">&#9660;</button><button class="button right" data-dir="right">&#9654;</button></div></div><div class="status" id="status">SPEED 1.0x</div></div></div></div>
<script>
const c=document.getElementById('game'),x=c.getContext('2d'),overlay=document.getElementById('overlay'),scoreEl=document.getElementById('score'),bestEl=document.getElementById('best'),statusEl=document.getElementById('status');const size=20,cols=28,rows=15;let snake,food,dir,next,score=0,best=0,playing=false,timer,startX=0,startY=0;
try{best=parseInt(localStorage.getItem('cylic_snake_best')||'0',10)||0}catch(e){}
function pad(v){return String(v).padStart(5,'0')}function placeFood(){do{food={x:Math.floor(Math.random()*cols),y:Math.floor(Math.random()*rows)}}while(snake.some(p=>p.x===food.x&&p.y===food.y))}
function speedDelay(){return Math.max(80,150-Math.floor(score/20)*7)}function schedule(){clearInterval(timer);timer=setInterval(tick,speedDelay())}
function reset(){snake=[{x:8,y:7},{x:7,y:7},{x:6,y:7}];dir={x:1,y:0};next={x:1,y:0};score=0;playing=true;placeFood();overlay.classList.add('hidden');schedule();updateUI();draw()}
function setDir(name){const d={up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}}[name];if(!d||d.x===-dir.x&&d.y===-dir.y)return;next=d}
function tick(){if(!playing)return;dir=next;const head={x:snake[0].x+dir.x,y:snake[0].y+dir.y};if(head.x<0||head.x>=cols||head.y<0||head.y>=rows||snake.some(p=>p.x===head.x&&p.y===head.y))return gameOver();snake.unshift(head);if(head.x===food.x&&head.y===food.y){score+=10;best=Math.max(best,score);placeFood();schedule()}else snake.pop();updateUI();draw()}
function gameOver(){playing=false;clearInterval(timer);try{localStorage.setItem('cylic_snake_best',String(best))}catch(e){}document.getElementById('overTitle').textContent='GAME OVER';document.getElementById('overSub').textContent='SCORE '+score;document.getElementById('start').textContent='PLAY AGAIN';overlay.classList.remove('hidden')}
function updateUI(){scoreEl.textContent=pad(score);bestEl.textContent=pad(best);statusEl.textContent='LENGTH '+snake.length+' • SPEED '+(150/speedDelay()).toFixed(1)+'x'}
function draw(){const bg=x.createLinearGradient(0,0,0,300);bg.addColorStop(0,'#17272e');bg.addColorStop(1,'#091014');x.fillStyle=bg;x.fillRect(0,0,560,300);x.strokeStyle='rgba(255,255,255,.025)';for(let i=0;i<=cols;i++){x.beginPath();x.moveTo(i*size,0);x.lineTo(i*size,300);x.stroke()}for(let i=0;i<=rows;i++){x.beginPath();x.moveTo(0,i*size);x.lineTo(560,i*size);x.stroke()}x.fillStyle='#ff667f';x.shadowColor='#ff667f';x.shadowBlur=14;x.beginPath();x.arc(food.x*size+10,food.y*size+10,6,0,Math.PI*2);x.fill();x.shadowBlur=0;snake.forEach((p,i)=>{x.fillStyle=i===0?'#91ffe0':'#00b98d';x.fillRect(p.x*size+2,p.y*size+2,16,16)})}
document.getElementById('start').addEventListener('pointerdown',e=>{e.preventDefault();reset()});document.querySelectorAll('[data-dir]').forEach(b=>b.addEventListener('pointerdown',e=>{e.preventDefault();setDir(b.dataset.dir)}));document.addEventListener('keydown',e=>{const d={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right'}[e.key];if(d){e.preventDefault();setDir(d)}});c.addEventListener('pointerdown',e=>{startX=e.clientX;startY=e.clientY});c.addEventListener('pointerup',e=>{const dx=e.clientX-startX,dy=e.clientY-startY;if(Math.max(Math.abs(dx),Math.abs(dy))<16)return;setDir(Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up'))});snake=[{x:8,y:7},{x:7,y:7},{x:6,y:7}];food={x:18,y:7};updateUI();draw();
</script></body>`

let handler = async (m, { conn, args, text }) => {
    try {
        const rich = new AIRich(conn, {
            dynamic: true,
            unsupportedTypeAlert: false
        });

        rich.addSection(MB.htmlSection(htmlPayload, { trustedSources: ['lumnztyz.dev'] }))

        await rich.send(m.chat, {
            quoted: m,
            includesUnifiedResponse: true,
            includesSubmessages: false,
            forwarded: true,
            notification: false
        });

    } catch (error) {
        console.error('Gagal mengirim pesan snake:', error);
        m.reply('Eror!');
    }
};

handler.help = ['snake'];
handler.tags = ['game'];
handler.command = /^(snake)$/i;

export default handler;
