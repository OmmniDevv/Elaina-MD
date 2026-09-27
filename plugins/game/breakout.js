/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import crypto from 'node:crypto'

const pluginConfig = {
    name: 'breakout',
    alias: ['arrowbreakout'],
    category: 'game',
    description: 'Game webview Arrow Breakout interaktif',
    usage: '.breakout',
    example: '.breakout',
    cooldown: 10,
    energi: 1,
    isEnabled: true
}

async function handler(m, { sock }) {
try {
        await m.reply('🎮 _Memuat Arrow Breakout..._')

        
        const responseId = crypto.randomUUID()

        const html = `<style>
*{
    box-sizing:border-box;
    -webkit-tap-highlight-color:transparent;
    -webkit-user-select:none;
    user-select:none
}

html,body{
    margin:0;
    padding:0;
    width:100%;
    overflow:hidden;
    background:transparent;
    font-family:Arial,sans-serif;
    touch-action:none
}

.aWrap{
    width:100%;
    padding:6px;
    border:2px solid rgba(0, 210, 255, 0.4);
    border-radius:19px;
    background:
        radial-gradient(circle at 50% -20%,rgba(0, 210, 255, .15),transparent 45%),
        linear-gradient(145deg,#1f2240,#101223);
    box-shadow:
        0 5px 25px rgba(0,0,0,.5),
        inset 0 1px 0 rgba(255,255,255,.15)
}

.aHeader{
    height:43px;
    display:flex;
    align-items:center;
    justify-content:center;
    position:relative;
    border:1px solid rgba(0, 210, 255, .3);
    border-radius:13px;
    margin-bottom:5px;
    background:linear-gradient(180deg,#2b2f52,#15182b);
    overflow:hidden
}

.aTitle{
    color:#fff;
    font:900 20px Arial;
    letter-spacing:2px;
    text-shadow:0 0 8px #00d2ff,0 0 18px rgba(0, 210, 255, .4)
}

.aTitle span{color:#00d2ff}

.aIcon{
    position:absolute;
    font-size:20px;
    filter:drop-shadow(0 0 7px #00d2ff);
    animation:floatIcon 2s ease-in-out infinite
}
.aIcon.left{left:12px}
.aIcon.right{right:12px;animation-delay:.8s}

@keyframes floatIcon{
    0%,100%{transform:translateY(0) rotate(-5deg)}
    50%{transform:translateY(-3px) rotate(5deg)}
}

.aMain{
    position:relative;
    height:340px;
    border:2px solid rgba(0, 210, 255, .3);
    border-radius:14px;
    background:#13152c;
    box-shadow:inset 0 0 40px rgba(0, 210, 255, .06);
    overflow:hidden;
}

#aCanvas{
    display:block;
    width:100%;
    height:100%;
}

.aStats{
    position:absolute;
    z-index:5;
    top:8px;
    left:0;
    right:0;
    text-align:center;
    color:#9ba8c9;
    font:bold 12px monospace;
    pointer-events:none;
}

.aStats span{
    color:#00d2ff;
    font-size: 16px;
    text-shadow: 0 0 5px #00d2ff;
}

.aOverlay{
    position:absolute;
    inset:0;
    z-index:20;
    display:flex;
    align-items:center;
    justify-content:center;
    flex-direction:column;
    background:rgba(8,11,26,.85);
    backdrop-filter:blur(3px);
}

.aOverlay.hide{display:none}

.aOverlayTitle{
    color:white;
    font:900 24px Arial;
    text-shadow:0 0 10px #00d2ff, 0 0 25px #00d2ff;
    margin-bottom:8px;
    letter-spacing:1px;
}

.aText{
    color:#a1e8ff;
    font:bold 11px monospace;
    text-align:center;
    line-height:1.5;
}

.aButton{
    margin-top:16px;
    padding:10px 22px;
    border:0;
    border-radius:10px;
    background:#00d2ff;
    color:#061320;
    font:900 12px Arial;
    box-shadow:
        0 0 15px rgba(0, 210, 255, .5),
        0 4px 0 #0093b3;
    transition:.1s;
}

.aButton:active{
    transform:translateY(4px);
    box-shadow:0 0px 0 #0093b3;
}

.aFooter{
    height:30px;
    display:flex;
    align-items:center;
    justify-content:space-between;
    padding:0 12px;
    margin-top:5px;
    border:1px solid rgba(0, 210, 255, .2);
    border-radius:10px;
    background:#181b33;
    color:#8190ae;
    font:bold 9px monospace;
}
.aFooter span{color:#00d2ff}

</style>

<div class="aWrap">
    <div class="aHeader">
        <div class="aIcon left">↗️</div>
        <div class="aTitle">ARROW</span></div>
        <div class="aIcon right">↘️</div>
    </div>

    <div class="aMain">
        <div class="aStats">LEVEL <span id="aLevel">1</span></div>
        
        <canvas id="aCanvas"></canvas>

        <div class="aOverlay" id="aStart">
            <div class="aOverlayTitle">BREAKOUT!</div>
            <div class="aText">Tap panah untuk meluncur!<br>Pastikan jalurnya tidak terhalang.</div>
            <button class="aButton" id="btnStart">MAIN SEKARANG</button>
        </div>

        <div class="aOverlay hide" id="aNext">
            <div class="aOverlayTitle" style="color:#ffde00; text-shadow:0 0 15px #ffde00;">LEVEL CLEAR!</div>
            <div class="aText">Semua panah berhasil lolos!</div>
            <button class="aButton" id="btnNext" style="background:#ffde00; box-shadow:0 4px 0 #b39b00; color:#201a00;">NEXT LEVEL</button>
        </div>
    </div>

    <div class="aFooter">
        <div>🎯 TAP PANAH TERLUAR</div>
        <div>Furina AI</div>
    </div>
</div>

<script>
(function(){

const canvas = document.getElementById('aCanvas');
const ctx = canvas.getContext('2d');
const wrap = document.querySelector('.aMain');
const levelEl = document.getElementById('aLevel');
const startOverlay = document.getElementById('aStart');
const nextOverlay = document.getElementById('aNext');
const btnStart = document.getElementById('btnStart');
const btnNext = document.getElementById('btnNext');

let W = 0, H = 0;
let audioCtx = null;
let running = false;
let currentLevel = 0;

let blocks = [];
let escapedBlocks = [];
let particles = [];
let gridSize = 0;
let offsetX = 0, offsetY = 0;
let rows = 0, cols = 0;

// MAPS (U=Up, D=Down, L=Left, R=Right, 0=Empty)
const LEVELS = [
    [
        ['R','R','U'],
        ['D','0','U'],
        ['D','L','L']
    ],
    [
        ['0','U','U','0'],
        ['L','R','U','R'],
        ['L','D','L','R'],
        ['0','D','D','0']
    ],
    [
        ['R','R','R','U','0'],
        ['U','U','R','U','U'],
        ['L','0','R','0','R'],
        ['D','D','L','D','D'],
        ['0','L','L','L','L']
    ],
    [
        ['R','D','0','0','L','U'],
        ['U','R','D','D','L','D'],
        ['U','U','R','L','D','D'],
        ['U','U','R','L','D','D'],
        ['U','R','U','U','L','D'],
        ['D','R','0','0','L','U']
    ]
];

function initAudio(){
    if(audioCtx) return;
    try {
        const AC = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AC();
    } catch(e){}
}

function tone(freq, duration, type='sine', vol=0.03){
    if(!audioCtx) return;
    try{
        if(audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    }catch(e){}
}

function soundTap(){ tone(600, 0.1, 'square', 0.04); tone(900, 0.15, 'sine', 0.03); }
function soundError(){ tone(150, 0.15, 'sawtooth', 0.05); }
function soundWin(){
    tone(400, 0.1, 'triangle', 0.05);
    setTimeout(()=>tone(500, 0.1, 'triangle', 0.05), 100);
    setTimeout(()=>tone(650, 0.2, 'triangle', 0.05), 200);
    setTimeout(()=>tone(880, 0.4, 'triangle', 0.05), 300);
}

function resize(){
    const rect = wrap.getBoundingClientRect();
    W = rect.width; H = rect.height;
    const dpr = Math.min(window.devicePixelRatio||1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    calculateGrid();
}

function calculateGrid(){
    if(!blocks.length) return;
    gridSize = Math.min(W / (cols+2), H / (rows+2));
    if(gridSize > 55) gridSize = 55;
    offsetX = (W - (cols * gridSize)) / 2;
    offsetY = (H - (rows * gridSize)) / 2;
}

function loadLevel(lvlIdx){
    blocks = [];
    escapedBlocks = [];
    particles = [];
    
    let map = LEVELS[lvlIdx % LEVELS.length];
    rows = map.length;
    cols = map[0].length;
    
    for(let r=0; r<rows; r++){
        for(let c=0; c<cols; c++){
            if(map[r][c] !== '0'){
                blocks.push({
                    r: r, c: c, dir: map[r][c],
                    x: c, y: r,
                    shake: 0,
                    isEscaping: false,
                    ex: 0, ey: 0 // escape target coords
                });
            }
        }
    }
    
    levelEl.innerText = (currentLevel + 1);
    resize();
}

function getBlockAt(r, c){
    return blocks.find(b => b.r === r && b.c === c && !b.isEscaping);
}

function canEscape(block){
    let {r, c, dir} = block;
    if (dir === 'U') { for(let i=r-1; i>=0; i--) if(getBlockAt(i, c)) return false; }
    if (dir === 'D') { for(let i=r+1; i<rows; i++) if(getBlockAt(i, c)) return false; }
    if (dir === 'L') { for(let i=c-1; i>=0; i--) if(getBlockAt(r, i)) return false; }
    if (dir === 'R') { for(let i=c+1; i<cols; i++) if(getBlockAt(r, i)) return false; }
    return true;
}

function createConfetti(){
    for(let i=0; i<60; i++){
        particles.push({
            x: W/2, y: H/2,
            vx: (Math.random()-0.5)*10,
            vy: (Math.random()-0.5)*10 - 2,
            size: Math.random()*5+3,
            color: ['#00d2ff','#ffde00','#ff5370','#00ffae'][Math.floor(Math.random()*4)],
            life: 1
        });
    }
}

function drawArrowPath(cx, cy, size, dir){
    ctx.save();
    ctx.translate(cx, cy);
    if(dir==='R') ctx.rotate(0);
    else if(dir==='D') ctx.rotate(Math.PI/2);
    else if(dir==='L') ctx.rotate(Math.PI);
    else if(dir==='U') ctx.rotate(-Math.PI/2);
    
    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = size * 0.15;
    ctx.strokeStyle = '#ffffff';
    
    // Line
    ctx.moveTo(-size*0.25, 0);
    ctx.lineTo(size*0.25, 0);
    // Arrow head
    ctx.moveTo(size*0.05, -size*0.2);
    ctx.lineTo(size*0.25, 0);
    ctx.lineTo(size*0.05, size*0.2);
    ctx.stroke();
    ctx.restore();
}

function render(){
    ctx.clearRect(0,0,W,H);
    
    // Draw background dots for grid
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    for(let r=0; r<=rows; r++){
        for(let c=0; c<=cols; c++){
            ctx.beginPath();
            ctx.arc(offsetX + c*gridSize, offsetY + r*gridSize, 2, 0, Math.PI*2);
            ctx.fill();
        }
    }

    // Draw Escaping Trails
    escapedBlocks.forEach(b => {
        ctx.beginPath();
        ctx.moveTo(offsetX + b.c*gridSize + gridSize/2, offsetY + b.r*gridSize + gridSize/2);
        ctx.lineTo(offsetX + b.x*gridSize + gridSize/2, offsetY + b.y*gridSize + gridSize/2);
        ctx.strokeStyle = '#ffde00';
        ctx.lineWidth = gridSize * 0.3;
        ctx.lineCap = 'round';
        ctx.stroke();
    });

    // Draw Blocks
    [...blocks, ...escapedBlocks].forEach(b => {
        let drawX = offsetX + b.x * gridSize;
        let drawY = offsetY + b.y * gridSize;
        
        if(b.shake > 0){
            drawX += (Math.random()-0.5)*6;
            drawY += (Math.random()-0.5)*6;
            b.shake--;
        }
        
        const pad = gridSize * 0.08;
        const s = gridSize - pad*2;
        
        // Shadow & Body
        ctx.fillStyle = '#006580'; // Darker blue base
        ctx.beginPath();
        ctx.roundRect(drawX+pad, drawY+pad + (b.isEscaping?0:4), s, s, 10);
        ctx.fill();
        
        // Top Face
        ctx.fillStyle = b.isEscaping ? '#ffde00' : '#00d2ff';
        ctx.beginPath();
        ctx.roundRect(drawX+pad, drawY+pad, s, s, 10);
        ctx.fill();
        
        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath();
        ctx.roundRect(drawX+pad, drawY+pad, s, s*0.2, [10,10,0,0]);
        ctx.fill();
        
        drawArrowPath(drawX + gridSize/2, drawY + gridSize/2, gridSize, b.dir);
    });
    
    // Draw Particles
    particles.forEach((p, i) => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3; // gravity
        p.life -= 0.02;
        if(p.life <= 0) particles.splice(i, 1);
    });
    ctx.globalAlpha = 1;
}

function update(){
    if(!running) return;
    
    let isMoving = false;
    
    for(let i = escapedBlocks.length-1; i>=0; i--){
        let b = escapedBlocks[i];
        const speed = 0.4;
        isMoving = true;
        
        if(b.dir==='U') b.y -= speed;
        if(b.dir==='D') b.y += speed;
        if(b.dir==='L') b.x -= speed;
        if(b.dir==='R') b.x += speed;
        
        // Remove if way off screen
        if(b.x < -5 || b.x > cols+5 || b.y < -5 || b.y > rows+5){
            escapedBlocks.splice(i, 1);
        }
    }
    
    if(blocks.length === 0 && escapedBlocks.length === 0){
        running = false;
        soundWin();
        createConfetti();
        setTimeout(() => {
            nextOverlay.classList.remove('hide');
        }, 800);
    }
}

function loop(){
    update();
    render();
    requestAnimationFrame(loop);
}

// Controls
canvas.addEventListener('pointerdown', (e) => {
    if(!running) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio||1, 2);
    const mx = (e.clientX - rect.left);
    const my = (e.clientY - rect.top);
    
    const clickC = Math.floor((mx - offsetX) / gridSize);
    const clickR = Math.floor((my - offsetY) / gridSize);
    
    let clickedBlockIndex = blocks.findIndex(b => b.r === clickR && b.c === clickC);
    
    if(clickedBlockIndex !== -1){
        let b = blocks[clickedBlockIndex];
        initAudio();
        
        if(canEscape(b)){
            b.isEscaping = true;
            escapedBlocks.push(b);
            blocks.splice(clickedBlockIndex, 1);
            soundTap();
        } else {
            b.shake = 12;
            soundError();
        }
    }
});

btnStart.addEventListener('click', () => {
    initAudio();
    startOverlay.classList.add('hide');
    loadLevel(currentLevel);
    running = true;
});

btnNext.addEventListener('click', () => {
    nextOverlay.classList.add('hide');
    currentLevel++;
    loadLevel(currentLevel);
    running = true;
});

window.addEventListener('resize', resize);
resize();
loop();

})();
</script>`

        await sock.relayMessage(
            m.chat,
            {
                messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2,
                    botMetadata: {
                        messageDisclaimerText: "",
                        botResponseId: responseId
                    }
                },
                botForwardedMessage: {
                    message: {
                        richResponseMessage: {
                            messageType: 1,
                            submessages: [
                                {
                                    messageType: 2,
                                    messageText: "Arrow Breakout • Fitur By: Anita Putri Azzahra"
                                }
                            ],
                            unifiedResponse: {
                                data: Buffer.from(
                                    JSON.stringify({
                                        response_id: responseId,
                                        sections: [
                                            {
                                                view_model: {
                                                    primitive: {
                                                        __typename: "GenAIaeacdsnwHtmlPrimitive",
                                                        payload: html,
                                                        trusted_sources: []
                                                    },
                                                    __typename: "GenAISingleLayoutViewModel"
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
        )

    } catch (e) {
        console.error(e)
        m.reply(`❌ *Gagal merender Arrow Breakout!*\nLog error: ${e.message}`)
    }
}

export { pluginConfig as config, handler }
