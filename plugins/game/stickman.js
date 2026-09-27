/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

const config = {
  name: 'stickman',
  alias: ['stick', 'stickgame'],
  category: 'game',
  description: 'Game Stickman HTML AI Rich.',
  usage: '.stickman',
  example: '.stickman',
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 0,
  isEnabled: true
};

const HTML = `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"><title>Stickman 3D</title><style>
*{box-sizing:border-box;user-select:none;-webkit-user-select:none;margin:0;padding:0}html,body{width:100%;height:100%;overflow:hidden;background:#050508;font-family:Segoe UI,Roboto,Arial,sans-serif;color:#fff}#game{position:relative;width:100vw;height:100vh;max-width:480px;max-height:854px;margin:auto;overflow:hidden;background:linear-gradient(#1a1c29,#2b2e42 42%,#151621)}canvas{width:100%;height:100%;display:block}#hud{position:absolute;top:0;left:0;width:100%;padding:10px 12px;z-index:5;background:linear-gradient(#000b,transparent);pointer-events:none}.top{display:flex;justify-content:space-between;align-items:center}.profile{display:flex;align-items:center;gap:8px}.avatar{width:42px;height:42px;border-radius:50%;border:2px solid #e74c3c;background:#222;display:grid;place-items:center;font-size:11px;font-weight:900;color:#ff5b5b}.bars{width:125px;display:grid;gap:4px}.bar{height:12px;border-radius:7px;background:#0009;border:1px solid #ffffff33;overflow:hidden;position:relative}.fill{height:100%;transition:width .15s}.hp{background:linear-gradient(90deg,#ff416c,#ff4b2b)}.xp{background:linear-gradient(90deg,#3a7bd5,#3a57e8)}.bt{position:absolute;inset:0;display:grid;place-items:center;font-size:8px;font-weight:800;text-shadow:1px 1px 2px #000}.currency{font-size:11px;font-weight:800;background:#0007;border:1px solid #fff1;padding:5px 8px;border-radius:12px}.watermark{position:absolute;top:58px;left:12px;font-size:10px;color:#fff8;letter-spacing:1px}.combo{position:absolute;right:15px;top:70px;text-align:right;opacity:0;transition:.2s;z-index:4}.combo b{font-size:28px;font-style:italic;text-shadow:0 0 10px #f39c12,2px 2px #000}.combo small{display:block;color:#f1c40f;letter-spacing:2px}.controls{position:absolute;bottom:0;left:0;width:100%;height:220px;padding:15px;display:flex;justify-content:space-between;align-items:flex-end;z-index:6;pointer-events:none}.group{display:flex;gap:10px;align-items:flex-end;pointer-events:auto}.btn{border:2px solid #fff5;background:#0008;color:#fff;display:grid;place-items:center;font-weight:900;box-shadow:0 4px 10px #0008;backdrop-filter:blur(4px);touch-action:manipulation}.dir{width:55px;height:55px;border-radius:16px;font-size:20px}.atk{width:70px;height:70px;border-radius:50%;background:#e74c3c66;border-color:#e74c3caa;font-size:25px}.skills{display:grid;grid-template-columns:repeat(2,48px);gap:10px}.skill{width:48px;height:48px;border-radius:50%;background:#3498db66;border-color:#3498dbaa;font-size:14px}.btn:active{transform:scale(.92);background:#fff4}.modal{position:absolute;inset:0;background:#000d;display:flex;align-items:center;justify-content:center;z-index:20;backdrop-filter:blur(7px)}.card{width:82%;padding:25px;text-align:center;border-radius:16px;background:#1e2230;border:2px solid #e74c3c;box-shadow:0 0 25px #e74c3c66}.title{font-size:28px;font-weight:900;color:#ff4757;letter-spacing:2px}.author{font-size:12px;color:#aaa;margin:5px 0 18px}.start{border:0;border-radius:25px;padding:12px 30px;background:linear-gradient(135deg,#ff4757,#ff6b81);color:#fff;font-weight:900;font-size:15px}#hint{position:absolute;left:50%;bottom:235px;transform:translateX(-50%);font-size:10px;color:#fff8;z-index:4;white-space:nowrap}
</style></head><body><div id="game"><canvas id="c"></canvas><div id="hud"><div class="top"><div class="profile"><div class="avatar">Lv.13</div><div class="bars"><div class="bar"><div id="hp" class="fill hp"></div><div id="hpt" class="bt">HP: 740 / 740</div></div><div class="bar"><div id="xp" class="fill xp"></div><div class="bt">EXP: 1072 / 4550</div></div></div></div><div class="currency">🪙 <span id="coins">9.60K</span>　💎 500　💀 <span id="kills">0</span></div></div></div><div class="watermark"><b>STICKMAN 3D</b> | AI Rich Game</div><div id="combo" class="combo"><b id="comboN">0</b><small>HITS</small></div><div id="hint">A/D atau tombol kiri/kanan • J/⚔ serang • 1 2 3 skill • W/▲ lompat</div><div class="controls"><div class="group"><button class="btn dir" id="l">◀</button><button class="btn dir" id="r">▶</button></div><div class="group"><div class="skills"><button class="btn skill" id="s1">⚡</button><button class="btn skill" id="s2">🔥</button><button class="btn skill" id="s3">🌀</button><button class="btn skill" id="jump">▲</button></div><button class="btn atk" id="attack">⚔</button></div></div><div id="modal" class="modal"><div class="card"><div class="title" id="mt">STICKMAN</div><div class="author">HTML AI Rich Game</div><p style="font-size:13px;color:#ccc;margin-bottom:12px">Kalahkan shadow ninja dan kumpulkan kill!</p><button class="start" id="start">MULAI GAME</button></div></div></div><script>
const c=document.getElementById('c'),x=c.getContext('2d');let W,H,run=false,last=0,kills=0,coins=9600,combo=0,comboT=0,spawnT=0,parts=[],shots=[],enemies=[];const p={x:100,y:0,vx:0,vy:0,w:34,h:62,hp:740,max:740,ground:true,face:1,atk:0,cd:[0,0,0]};const key={l:false,r:false};function resize(){W=c.width=c.clientWidth;H=c.height=c.clientHeight}resize();addEventListener('resize',resize);const ground=()=>H-150;
function audio(freq,type='sine',dur=.12){try{const A=audio.ctx||(audio.ctx=new (AudioContext||webkitAudioContext)()),o=A.createOscillator(),g=A.createGain();o.type=type;o.frequency.value=freq;g.gain.value=.12;o.connect(g);g.connect(A.destination);o.start();g.gain.exponentialRampToValueAtTime(.001,A.currentTime+dur);o.stop(A.currentTime+dur)}catch{}}
function btn(id,down){const e=document.getElementById(id);e.addEventListener('pointerdown',z=>{z.preventDefault();down()})}btn('l',()=>key.l=true);btn('r',()=>key.r=true);['l','r'].forEach(id=>document.getElementById(id).addEventListener('pointerup',()=>key[id==='l'?'l':'r']=false));
function jump(){if(run&&p.ground){p.vy=-12;p.ground=false;audio(500)}}function attack(){if(!run)return;p.atk=12;audio(380,'sine',.15);enemies.forEach(e=>{if(Math.abs(e.x-p.x)<75&&Math.abs(e.y-p.y)<65){e.hp-=35;hit()}})}function hit(){combo++;comboT=120;audio(110,'sawtooth',.1);for(let i=0;i<8;i++)parts.push({x:p.x+(Math.random()-.5)*30,y:p.y+35,vx:(Math.random()-.5)*4,vy:-Math.random()*4,t:25})}
function skill(n){if(!run||p.cd[n-1]>0)return;p.cd[n-1]=n===1?180:n===2?240:300;audio(n===1?700:n===2?220:520,'triangle',.25);let range=n===3?240:180;enemies.forEach(e=>{if(Math.abs(e.x-p.x)<range){e.hp-=n===2?85:n===3?120:55;hit()}});for(let i=0;i<20;i++)parts.push({x:p.x,y:p.y+30,vx:(Math.random()-.5)*8,vy:(Math.random()-.5)*8,t:35})}
btn('jump',jump);btn('attack',attack);btn('s1',()=>skill(1));btn('s2',()=>skill(2));btn('s3',()=>skill(3));document.getElementById('start').onclick=()=>{document.getElementById('modal').style.display='none';run=true;p.hp=p.max;enemies=[];kills=0;combo=0;coins=9600;audio(600)};addEventListener('keydown',e=>{if(e.key==='a'||e.key==='ArrowLeft')key.l=true;if(e.key==='d'||e.key==='ArrowRight')key.r=true;if(e.key==='w'||e.key==='ArrowUp'||e.key===' ')jump();if(e.key==='j'||e.key==='z')attack();if(e.key==='1')skill(1);if(e.key==='2')skill(2);if(e.key==='3')skill(3)});addEventListener('keyup',e=>{if(e.key==='a'||e.key==='ArrowLeft')key.l=false;if(e.key==='d'||e.key==='ArrowRight')key.r=false});
function enemy(){enemies.push({x:Math.random()<.5?-20:W+20,y:0,hp:80,max:80,spd:1.1+Math.random()*1.2})}function update(){if(!run)return;p.vx=(key.r?4.5:0)-(key.l?4.5:0);if(p.vx)p.face=Math.sign(p.vx);p.x=Math.max(15,Math.min(W-15,p.x+p.vx));p.vy+=.65;p.y+=p.vy;if(p.y>=ground()-p.h){p.y=ground()-p.h;p.vy=0;p.ground=true}for(let i=0;i<3;i++)p.cd[i]=Math.max(0,p.cd[i]-1);if(p.atk)p.atk--;spawnT--;if(spawnT<=0){enemy();spawnT=80+Math.random()*80}enemies.forEach(e=>{e.x+=e.x<p.x?e.spd:-e.spd;if(Math.abs(e.x-p.x)<30&&Math.abs(e.y-p.y)<60&&Math.random()<.025){p.hp-=12;audio(80,'square',.1)}});enemies=enemies.filter(e=>{if(e.hp<=0){kills++;coins+=250;return false}return true});comboT--;if(comboT<=0)combo=0;parts.forEach(q=>{q.x+=q.vx;q.y+=q.vy;q.vy+=.2;q.t--});parts=parts.filter(q=>q.t>0);if(p.hp<=0){run=false;document.getElementById('mt').textContent='GAME OVER';document.querySelector('.card p').textContent='Kill: '+kills+' • Coins: '+coins.toLocaleString('id-ID');document.getElementById('start').textContent='MAIN LAGI';document.getElementById('modal').style.display='flex'}}
function stick(a,enemy=false){x.save();x.translate(a.x,a.y);if(enemy)x.scale(-1,1);x.strokeStyle=enemy?'#e74c3c':'#f5f5f5';x.fillStyle=enemy?'#e74c3c':'#fff';x.lineWidth=5;x.lineCap='round';x.beginPath();x.arc(0,12,11,0,Math.PI*2);x.fill();x.beginPath();x.moveTo(0,23);x.lineTo(0,48);x.moveTo(0,30);x.lineTo(-15,40);x.moveTo(0,30);x.lineTo(15,40);x.moveTo(0,48);x.lineTo(-13,62);x.moveTo(0,48);x.lineTo(13,62);x.stroke();if(!enemy&&p.atk){x.strokeStyle='#ff4757';x.lineWidth=4;x.beginPath();x.moveTo(12,34);x.lineTo(58,8);x.stroke()}x.restore()}
function draw(){x.clearRect(0,0,W,H);let gy=ground();let grd=x.createLinearGradient(0,gy,0,H);grd.addColorStop(0,'#202230');grd.addColorStop(1,'#0c0d14');x.fillStyle=grd;x.fillRect(0,gy,W,H-gy);x.strokeStyle='#ffffff18';x.lineWidth=1;for(let i=0;i<W;i+=40){x.beginPath();x.moveTo(i,gy);x.lineTo(i+80,H);x.stroke()}x.fillStyle='#ffffff10';for(let i=0;i<8;i++){x.beginPath();x.arc((i*97+80)%W,80+(i%3)*45,2,0,7);x.fill()}enemies.forEach(e=>stick({x:e.x,y:gy-62},true));stick({x:p.x,y:p.y});parts.forEach(q=>{x.fillStyle='#ffb347';x.fillRect(q.x,q.y,3,3)});x.fillStyle='#fff';x.font='bold 11px Arial';enemies.forEach(e=>{x.fillStyle='#0009';x.fillRect(e.x-22,gy-78,44,5);x.fillStyle='#ff4757';x.fillRect(e.x-22,gy-78,44*(e.hp/e.max),5)});document.getElementById('hp').style.width=Math.max(0,p.hp/p.max*100)+'%';document.getElementById('hpt').textContent='HP: '+Math.max(0,Math.ceil(p.hp))+' / '+p.max;document.getElementById('kills').textContent=kills;document.getElementById('coins').textContent=coins>=1000?(coins/1000).toFixed(2)+'K':coins;document.getElementById('comboN').textContent=combo;document.getElementById('combo').style.opacity=combo?'1':'0'}function loop(t){update();draw();requestAnimationFrame(loop)}requestAnimationFrame(loop);
</script></body></html>`;

async function handler(m, { sock }) {
  const chat = m.chat || m.key?.remoteJid;
  if (!chat) return;

  try {
    const responseId = `stickman-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const payload = Buffer.from(JSON.stringify({
      response_id: responseId,
      sections: [
        {
          view_model: {
            primitive: {
              __typename: 'GenAIaeacdsnwHtmlPrimitive',
              payload: HTML,
              trusted_sources: []
            },
            __typename: 'GenAISingleLayoutViewModel'
          }
        }
      ]
    })).toString('base64');

    const msg = {
      messageContextInfo: {
        deviceListMetadata: {},
        deviceListMetadataVersion: 2,
        botMetadata: {
          messageDisclaimerText: '',
          botResponseId: responseId
        }
      },
      botForwardedMessage: {
        message: {
          richResponseMessage: {
            messageType: 1,
            submessages: [
              { messageType: 2, messageText: 'Stickman 3D • Fitur By: Anita Putri Azzahra' }
            ],
            unifiedResponse: { data: payload },
            contextInfo: {
              forwardingScore: 1,
              isForwarded: true,
              forwardedAiBotMessageInfo: { botJid: '867051314767696@bot' },
              forwardOrigin: 4
            }
          }
        }
      }
    };

    await sock.relayMessage(chat, msg, {
      messageId: responseId
    });
  } catch (e) {
    try {
      await sock.sendMessage(
        chat,
        { text: `〄 Stickman gagal dikirim: ${e?.message || e}` },
        { quoted: m }
      );
    } catch {}
  }
}

export default { config, handler };