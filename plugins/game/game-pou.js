import { randomUUID } from 'crypto';

const htmlPayload = String.raw`<style>*{box-sizing:border-box;margin:0;padding:0;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;touch-action:manipulation}html,body{height:100%}#gameCanvas{box-shadow:0 10px 30px rgba(0,0,0,0.5)}.font-game{font-family:system-ui,-apple-system,'Segoe UI','Fredoka One',cursive;font-weight:800}.glass-panel{background:rgba(15,23,42,0.75);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.15)}.btn-bounce{transition:transform 0.1s ease,box-shadow 0.1s ease}.btn-bounce:active{transform:scale(0.92)}.btn-primary{background:linear-gradient(90deg,#34d399,#14b8a6);color:#020617}.btn-primary:hover{background:linear-gradient(90deg,#6ee7b7,#2dd4bf)}.w-full{width:100%}.max-w-xs{max-width:20rem}.w-8{width:32px}.h-8{height:32px}.w-10{width:40px}.h-10{height:40px}.w-12{width:48px}.h-12{height:48px}.w-16{width:64px}.h-16{height:64px}.w-20{width:80px}.h-20{height:80px}.w-28{width:112px}.h-28{height:112px}.flex{display:flex}.flex-col{flex-direction:column}.flex-1{flex:1}.items-center{align-items:center}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-1{gap:4px}.gap-1\.5{gap:6px}.gap-2{gap:8px}.gap-3{gap:12px}.gap-4{gap:16px}.space-y-3 > * + *{margin-top:12px}.relative{position:relative}.absolute{position:absolute}.inset-0{top:0;right:0;bottom:0;left:0}.bottom-4{bottom:16px}.left-4{left:16px}.right-4{right:16px}.z-10{z-index:10}.z-20{z-index:20}.z-30{z-index:30}.overflow-hidden{overflow:hidden}.overflow-y-auto{overflow-y:auto}.block{display:block}.hidden{display:none !important}.pointer-events-none{pointer-events:none}.pointer-events-auto{pointer-events:auto}.p-3{padding:12px}.p-4{padding:16px}.p-6{padding:24px}.px-3{padding-left:12px;padding-right:12px}.px-4{padding-left:16px;padding-right:16px}.py-1{padding-top:4px;padding-bottom:4px}.py-2{padding-top:8px;padding-bottom:8px}.py-3\.5{padding-top:14px;padding-bottom:14px}.py-4{padding-top:16px;padding-bottom:16px}.pt-2{padding-top:8px}.pb-3{padding-bottom:12px}.pr-1{padding-right:4px}.mb-1{margin-bottom:4px}.mb-2{margin-bottom:8px}.mb-4{margin-bottom:16px}.mb-6{margin-bottom:24px}.mb-8{margin-bottom:32px}.mt-6{margin-top:24px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:12px}.rounded-2xl{border-radius:16px}.border{border:1px solid rgba(255,255,255,0.1)}.border-2{border:2px solid rgba(255,255,255,0.1)}.border-b{border-bottom-width:1px;border-bottom-style:solid}.border-t{border-top-width:1px;border-top-style:solid}.border-amber-300{border-color:#fcd34d}.border-rose-500\/40{border-color:rgba(244,63,94,0.4)}.border-white\/10{border-color:rgba(255,255,255,0.1)}.border-white\/20{border-color:rgba(255,255,255,0.2)}.text-center{text-align:center}.uppercase{text-transform:uppercase}.font-bold{font-weight:700}.font-semibold{font-weight:600}.text-xs{font-size:12px}.text-sm{font-size:14px}.text-base{font-size:16px}.text-lg{font-size:18px}.text-xl{font-size:20px}.text-2xl{font-size:24px}.text-3xl{font-size:30px}.text-4xl{font-size:36px}.tracking-wide{letter-spacing:0.025em}.tracking-wider{letter-spacing:0.05em}.tracking-widest{letter-spacing:0.1em}.drop-shadow-md{filter:drop-shadow(0 4px 4px rgba(0,0,0,0.12))}.drop-shadow-lg{filter:drop-shadow(0 8px 8px rgba(0,0,0,0.15))}.text-white{color:#fff}.text-slate-950{color:#020617}.text-slate-200{color:#e2e8f0}.text-slate-300{color:#cbd5e1}.text-slate-400{color:#94a3b8}.text-amber-400{color:#fbbf24}.text-emerald-400{color:#34d399}.text-sky-400{color:#38bdf8}.text-yellow-300{color:#fde047}.text-yellow-400{color:#facc15}.bg-slate-800{background:#1e293b}.bg-slate-800\/80{background:rgba(30,41,59,0.8)}.bg-slate-900{background:#0f172a}.bg-slate-950\/85{background:rgba(2,6,23,0.85)}.bg-slate-950\/90{background:rgba(2,6,23,0.9)}.bg-black\/40{background:rgba(0,0,0,0.4)}.bg-black\/50{background:rgba(0,0,0,0.5)}.bg-white\/10{background:rgba(255,255,255,0.1)}.bg-emerald-500{background:#10b981}.bg-amber-500{background:#f59e0b}.bg-amber-500\/90{background:rgba(245,158,11,0.9)}.bg-amber-500\/20{background:rgba(245,158,11,0.2)}.bg-rose-500\/20{background:rgba(244,63,94,0.2)}.bg-slate-700{background:#334155}.shadow{box-shadow:0 1px 3px rgba(0,0,0,0.12)}.shadow-md{box-shadow:0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06)}.shadow-lg{box-shadow:0 10px 15px -3px rgba(0,0,0,0.12),0 4px 6px -2px rgba(0,0,0,0.06)}.shadow-inner{box-shadow:inset 0 2px 4px rgba(0,0,0,0.08)}.backdrop-blur-sm{backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)}.backdrop-blur-md{backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}.hover\:bg-amber-600:hover{background:#d97706}.hover\:bg-slate-700:hover{background:#334155}.hover\:text-white:hover{color:#fff}.active\:bg-white\/30:active{background:rgba(255,255,255,0.3)}.active\:scale-95:active{transform:scale(0.95)}.transition-all{transition:all 0.2s ease}.transition-transform{transition:transform 0.2s ease}.icon{display:inline-block;flex:none;vertical-align:middle}.icon-sm{width:14px;height:14px}.icon-md{width:16px;height:16px}.icon-lg{width:30px;height:30px}.skin-btn{border:none;cursor:pointer;color:#fff}</style></style>
<body style="margin:0;background:transparent;font-family:Arial,sans-serif;color:#eee;touch-action:manipulation;cursor:pointer">
<div style="width:100%;max-width:620px;margin:auto;padding:16px;box-sizing:border-box">
<div style="background:rgba(255,255,255,.07);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.14);border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.35)">
<div class="flex flex-col items-center justify-center">

        <div class="w-full flex flex-col items-center justify-between overflow-hidden bg-slate-800 rounded-xl">

            <!-- Header HUD Area -->
            <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px;border-bottom:1px solid rgba(255,255,255,.12)">
                <div class="flex items-center gap-2">
                    <div class="bg-amber-500/90 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg pointer-events-auto">
                        <svg class="icon icon-sm" viewBox="0 0 24 24">
                            <circle cx="8.5" cy="14.5" r="6" fill="#fbbf24" stroke="#b45309" stroke-width="1.4"/>
                            <circle cx="15.5" cy="9.5" r="6" fill="#fde68a" stroke="#b45309" stroke-width="1.4"/>
                        </svg>
                        <span id="coinCount">0</span>
                    </div>
                </div>

                <div class="text-center">
                    <span class="text-xs text-slate-300 font-semibold block uppercase tracking-wider">Tinggi</span>
                    <span id="scoreDisplay" class="text-2xl font-game text-yellow-300 drop-shadow-md">0m</span>
                </div>

                <div class="flex gap-2 pointer-events-auto">
                    <button id="soundBtn" class="w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center border border-white/20 btn-bounce shadow">
                        <span id="sndOn" class="flex items-center justify-center">
                            <svg class="icon icon-md" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M4 9v6h4l5 5V4L8 9H4z"/>
                                <path d="M16.5 8.5a5 5 0 0 1 0 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                <path d="M19 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </span>
                        <span id="sndOff" class="flex items-center justify-center" style="display:none">
                            <svg class="icon icon-md" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M4 9v6h4l5 5V4L8 9H4z"/>
                                <path d="M16.5 10.5l5 5M21.5 10.5l-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </span>
                    </button>
                    <button id="shopBtn" class="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center border border-amber-300 btn-bounce shadow">
                        <svg class="icon icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M4 9l1.6-4.5A1.5 1.5 0 0 1 7 3.5h10a1.5 1.5 0 0 1 1.4 1L20 9"/>
                            <path d="M4.5 9v11h15V9"/>
                            <path d="M9 20v-5h6v5"/>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Main Game Canvas Container -->
            <div style="position:relative">
                <canvas id="gameCanvas" width="360" height="640" style="display:block;width:100%;height:auto;background:linear-gradient(to bottom,#38ef7d,#11998e);cursor:pointer"></canvas>

                <!-- START SCREEN OVERLAY -->
                <div id="startMenu" class="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-black/50 backdrop-blur-sm text-center">
                    <div class="mb-4">
                        <span class="bg-emerald-500 text-slate-950 font-bold px-3 py-1 rounded-full text-xs tracking-widest uppercase shadow-md block">AiRich Web View</span>
                    </div>
                    <h1 class="text-4xl font-game text-white mb-2 drop-shadow-lg tracking-wide">
                        POU <span class="text-sky-400">SKY JUMP</span>
                    </h1>
                    <p class="text-slate-200 text-sm mb-8 max-w-xs text-slate-300">Melompatlah setinggi mungkin di atas awan, kumpulkan koin &amp; hindari awan jebakan!</p>

                    <!-- Character Preview Box -->
                    <div class="w-28 h-28 mb-6 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-inner relative">
                        <canvas id="pouPreviewCanvas" width="90" height="90"></canvas>
                    </div>

                    <button id="startPlayBtn" class="w-full max-w-xs py-4 rounded-2xl btn-primary font-game text-xl shadow-lg btn-bounce flex items-center justify-center gap-2">
                        <svg class="icon icon-md" viewBox="0 0 24 24" fill="#020617">
                            <path d="M8 5.14v13.72c0 .83.9 1.34 1.6.92l10-6.86c.6-.42.6-1.42 0-1.84l-10-6.86C8.9 3.8 8 4.3 8 5.14z"/>
                        </svg>
                        MULAI MAIN
                    </button>

                    <div class="mt-6 flex items-center gap-4 text-xs text-slate-300 bg-black/40 px-4 py-2 rounded-xl border border-white/10">
                        <div class="flex items-center gap-1">
                            <svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                                <rect x="2" y="6" width="20" height="12" rx="2"/>
                                <path d="M6 9.5h.01M9.5 9.5h.01M13 9.5h.01M16.5 9.5h.01M6 13h4M14 13h4"/>
                            </svg>
                            Tombol Panah/A-D
                        </div>
                        <div>•</div>
                        <div class="flex items-center gap-1">
                            <svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                                <circle cx="12" cy="12" r="3.2"/>
                                <circle cx="12" cy="12" r="7.2" stroke-dasharray="3 4"/>
                            </svg>
                            Sentuh Layar
                        </div>
                    </div>
                </div>

                <!-- GAME OVER OVERLAY -->
                <div id="gameOverMenu" class="hidden absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-slate-950/85 backdrop-blur-md text-center">
                    <div class="w-20 h-20 bg-rose-500/20 border-2 border-rose-500/40 rounded-full flex items-center justify-center mb-4">
                        <svg class="icon icon-lg" viewBox="0 0 24 24" fill="#fb7185">
                            <path d="M12 21C7 16.5 2.5 12.9 2.5 8.7 2.5 5.6 4.9 3.5 7.5 3.5c1.7 0 3.3.9 4.5 2.4C13.2 4.4 14.8 3.5 16.5 3.5c2.6 0 5 2.1 5 5.2 0 4.2-4.5 7.8-9.5 12.3z"/>
                            <path d="M7.5 12l3-3 2 2 4-4" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <h2 class="text-3xl font-game text-white mb-1">GAME OVER!</h2>
                    <p class="text-slate-400 text-sm mb-6">Pou jatuh terlalu dalam...</p>

                    <div class="w-full max-w-xs glass-panel rounded-2xl p-4 mb-6 space-y-3">
                        <div class="flex justify-between items-center text-sm">
                            <span class="text-slate-400">Tinggi Dicapai:</span>
                            <span id="finalScore" class="font-game text-xl text-yellow-400">0m</span>
                        </div>
                        <div class="flex justify-between items-center text-sm border-t border-white/10 pt-2">
                            <span class="text-slate-400">Rekor Tertinggi:</span>
                            <span id="highScoreDisplay" class="font-game text-xl text-emerald-400">0m</span>
                        </div>
                        <div class="flex justify-between items-center text-sm border-t border-white/10 pt-2">
                            <span class="text-slate-400">Koin Diberoleh:</span>
                            <span class="font-game text-amber-400 flex items-center gap-1">
                                <svg class="icon icon-sm" viewBox="0 0 24 24">
                                    <circle cx="8.5" cy="14.5" r="6" fill="#fbbf24" stroke="#b45309" stroke-width="1.4"/>
                                    <circle cx="15.5" cy="9.5" r="6" fill="#fde68a" stroke="#b45309" stroke-width="1.4"/>
                                </svg>
                                <span id="earnedCoins">0</span>
                            </span>
                        </div>
                    </div>

                    <div class="flex gap-3 w-full max-w-xs">
                        <button id="restartBtn" class="flex-1 py-3.5 rounded-xl btn-primary font-game text-base shadow-lg btn-bounce">
                            <svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="#020617" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20 12a8 8 0 1 1-2.34-5.66"/>
                                <path d="M20 3v5h-5"/>
                            </svg>
                            COBA LAGI
                        </button>
                        <button id="gameOverShopBtn" class="py-3.5 px-4 rounded-xl bg-amber-500 text-white font-game text-base shadow-lg btn-bounce">
                            <svg class="icon icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 9l1.6-4.5A1.5 1.5 0 0 1 7 3.5h10a1.5 1.5 0 0 1 1.4 1L20 9"/>
                                <path d="M4.5 9v11h15V9"/>
                                <path d="M9 20v-5h6v5"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- SHOP MODAL -->
                <div id="shopModal" class="hidden absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md p-6 flex flex-col">
                    <div class="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
                        <h3 class="text-xl font-game text-amber-400 flex items-center gap-2">
                            <svg class="icon icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 9l1.6-4.5A1.5 1.5 0 0 1 7 3.5h10a1.5 1.5 0 0 1 1.4 1L20 9"/>
                                <path d="M4.5 9v11h15V9"/>
                                <path d="M9 20v-5h6v5"/>
                            </svg>
                            Toko AiRich Pou
                        </h3>
                        <button id="closeShopBtn" class="w-8 h-8 rounded-full bg-white/10 text-slate-300 hover:text-white flex items-center justify-center">
                            <svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
                                <path d="M6 6l12 12M18 6L6 18"/>
                            </svg>
                        </button>
                    </div>

                    <div class="flex justify-between items-center bg-slate-800/80 p-3 rounded-xl mb-4 border border-white/10">
                        <span class="text-sm text-slate-300">Total Koin Anda:</span>
                        <span class="font-game text-amber-400 flex items-center gap-1.5 text-lg">
                            <svg class="icon icon-md" viewBox="0 0 24 24">
                                <circle cx="8.5" cy="14.5" r="6" fill="#fbbf24" stroke="#b45309" stroke-width="1.4"/>
                                <circle cx="15.5" cy="9.5" r="6" fill="#fde68a" stroke="#b45309" stroke-width="1.4"/>
                            </svg>
                            <span id="shopTotalCoins">0</span>
                        </span>
                    </div>

                    <div class="flex-1 overflow-y-auto space-y-3 pr-1" id="skinList">
                        <!-- Skin items populated dynamically -->
                    </div>
                </div>

                <!-- Mobile Controls Overlay (Bottom) -->
                <div id="touchControls" class="absolute bottom-4 left-4 right-4 z-10 flex justify-between pointer-events-none">
                    <button id="btnLeft" class="w-16 h-16 rounded-2xl bg-white/10 active:bg-white/30 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center pointer-events-auto active:scale-95 transition-transform">
                        <svg class="icon icon-md" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M15 5l-7 7 7 7"/>
                        </svg>
                    </button>
                    <button id="btnRight" class="w-16 h-16 rounded-2xl bg-white/10 active:bg-white/30 backdrop-blur-sm border border-white/20 text-white text-2xl flex items-center justify-center pointer-events-auto active:scale-95 transition-transform">
                        <svg class="icon icon-md" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 5l7 7-7 7"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
</div>
<script>
        // Polyfill roundRect untuk webview lama
        if (window.CanvasRenderingContext2D && !CanvasRenderingContext2D.prototype.roundRect) {
            CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
                r = Math.min(r, w / 2, h / 2);
                this.beginPath();
                this.moveTo(x + r, y);
                this.arcTo(x + w, y, x + w, y + h, r);
                this.arcTo(x + w, y + h, x, y + h, r);
                this.arcTo(x, y + h, x, y, r);
                this.arcTo(x, y, x + w, y, r);
                this.closePath();
                return this;
            };
        }

        class SoundFX {
            constructor() {
                this.ctx = null;
                this.muted = false;
            }

            init() {
                if (!this.ctx) {
                    const AudioContext = window.AudioContext || window.webkitAudioContext;
                    this.ctx = new AudioContext();
                }
            }

            playJump() {
                if (this.muted || !this.ctx) return;
                try {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);

                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(650, this.ctx.currentTime + 0.15);

                    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
                    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

                    osc.start();
                    osc.stop(this.ctx.currentTime + 0.15);
                } catch(e){}
            }

            playSpring() {
                if (this.muted || !this.ctx) return;
                try {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);

                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
                    osc.frequency.linearRampToValueAtTime(900, this.ctx.currentTime + 0.25);

                    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
                    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

                    osc.start();
                    osc.stop(this.ctx.currentTime + 0.25);
                } catch(e){}
            }

            playCoin() {
                if (this.muted || !this.ctx) return;
                try {
                    const now = this.ctx.currentTime;
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);

                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(987.77, now); // B5
                    osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

                    gain.gain.setValueAtTime(0.3, now);
                    gain.gain.linearRampToValueAtTime(0.01, now + 0.25);

                    osc.start(now);
                    osc.stop(now + 0.25);
                } catch(e){}
            }

            playCrumble() {
                if (this.muted || !this.ctx) return;
                try {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);

                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
                    osc.frequency.linearRampToValueAtTime(60, this.ctx.currentTime + 0.15);

                    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
                    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

                    osc.start();
                    osc.stop(this.ctx.currentTime + 0.15);
                } catch(e){}
            }

            playGameOver() {
                if (this.muted || !this.ctx) return;
                try {
                    const now = this.ctx.currentTime;
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);

                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(400, now);
                    osc.frequency.linearRampToValueAtTime(150, now + 0.4);

                    gain.gain.setValueAtTime(0.4, now);
                    gain.gain.linearRampToValueAtTime(0.01, now + 0.4);

                    osc.start(now);
                    osc.stop(now + 0.4);
                } catch(e){}
            }
        }

        const audio = new SoundFX();

        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const previewCanvas = document.getElementById('pouPreviewCanvas');
        const pCtx = previewCanvas.getContext('2d');

        // Skins definitions
        const SKINS = [
            { id: 'classic', name: 'Classic Pou', price: 0, color: '#b38250', belly: '#fce3b8', unlocked: true },
            { id: 'gold', name: 'AiRich Gold', price: 50, color: '#f59e0b', belly: '#fef08a', unlocked: false },
            { id: 'neon', name: 'Cyber Neon', price: 100, color: '#06b6d4', belly: '#cffaff', unlocked: false },
            { id: 'pink', name: 'Kawaii Pink', price: 150, color: '#ec4899', belly: '#fce7f3', unlocked: false },
            { id: 'monster', name: 'Green Monster', price: 200, color: '#10b981', belly: '#d1fae5', unlocked: false }
        ];

        let state = { coins: 0, highScore: 0, activeSkin: 'classic', unlockedSkins: ['classic'] };
        try {
            const coins = parseInt(localStorage.getItem('airich_coins') || '0');
            const high = parseInt(localStorage.getItem('airich_highscore') || '0');
            const skin = localStorage.getItem('airich_skin') || 'classic';
            const unlocked = JSON.parse(localStorage.getItem('airich_unlocked') || '["classic"]');
            state = {
                coins: Number.isFinite(coins) ? coins : 0,
                highScore: Number.isFinite(high) ? high : 0,
                activeSkin: skin,
                unlockedSkins: Array.isArray(unlocked) ? unlocked : ['classic']
            };
        } catch(e){}

        // Ensure state consistency
        SKINS.forEach(s => {
            if (state.unlockedSkins.includes(s.id)) s.unlocked = true;
        });

        // Game World variables
        let isPlaying = false;
        let score = 0;
        let sessionCoins = 0;
        let cameraY = 0;
        let gameWidth = 360;
        let gameHeight = 640;

        // Pou Player Object
        const player = {
            x: 180,
            y: 500,
            width: 44,
            height: 42,
            vx: 0,
            vy: 0,
            speed: 6.5,
            gravity: 0.38,
            jumpForce: -12.5,
            facingRight: true,
            isBouncing: false
        };

        // Inputs
        const keys = { left: false, right: false };

        // Collections
        let platforms = [];
        let coinsList = [];
        let particles = [];

        function resizeCanvas() {
            canvas.width = 360;
            canvas.height = 640;
            gameWidth = canvas.width;
            gameHeight = canvas.height;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Draw Pou Character Function
        function drawPou(targetCtx, x, y, width, height, skinId, facingRight, vy = 0) {
            const skin = SKINS.find(s => s.id === skinId) || SKINS[0];
            targetCtx.save();
            targetCtx.translate(x, y);

            // Squash and Stretch effect on bounce
            let scaleX = 1;
            let scaleY = 1;
            if (vy < -2) {
                scaleX = 0.88; scaleY = 1.12; // Jumping stretch
            } else if (vy > 2) {
                scaleX = 1.08; scaleY = 0.92; // Falling squish
            }

            targetCtx.scale(scaleX, scaleY);

            // Main Blob Body (Pou classic shape)
            targetCtx.fillStyle = skin.color;
            targetCtx.beginPath();
            targetCtx.moveTo(0, -height / 2);
            targetCtx.bezierCurveTo(width / 1.8, -height / 2, width / 1.8, height / 2, 0, height / 2);
            targetCtx.bezierCurveTo(-width / 1.8, height / 2, -width / 1.8, -height / 2, 0, -height / 2);
            targetCtx.closePath();
            targetCtx.fill();
            targetCtx.lineWidth = 3;
            targetCtx.strokeStyle = 'rgba(0,0,0,0.2)';
            targetCtx.stroke();

            // Belly Patch
            targetCtx.fillStyle = skin.belly;
            targetCtx.beginPath();
            targetCtx.ellipse(0, height * 0.1, width * 0.32, height * 0.28, 0, 0, Math.PI * 2);
            targetCtx.fill();

            // Eyes
            const eyeOffsetX = facingRight ? 6 : -6;
            targetCtx.fillStyle = '#ffffff';
            // Left Eye
            targetCtx.beginPath();
            targetCtx.ellipse(-10 + eyeOffsetX * 0.3, -6, 7, 9, 0, 0, Math.PI * 2);
            targetCtx.fill();
            targetCtx.stroke();

            // Right Eye
            targetCtx.beginPath();
            targetCtx.ellipse(10 + eyeOffsetX * 0.3, -6, 7, 9, 0, 0, Math.PI * 2);
            targetCtx.fill();
            targetCtx.stroke();

            // Pupils
            targetCtx.fillStyle = '#1e293b';
            targetCtx.beginPath();
            targetCtx.arc(-10 + eyeOffsetX * 0.8, -5, 3.5, 0, Math.PI * 2);
            targetCtx.arc(10 + eyeOffsetX * 0.8, -5, 3.5, 0, Math.PI * 2);
            targetCtx.fill();

            // Cute Mouth
            targetCtx.beginPath();
            targetCtx.arc(0 + eyeOffsetX * 0.3, 4, 5, 0.1 * Math.PI, 0.9 * Math.PI);
            targetCtx.lineWidth = 2.5;
            targetCtx.strokeStyle = '#1e293b';
            targetCtx.stroke();

            // Cute Cheeks
            targetCtx.fillStyle = 'rgba(244, 63, 94, 0.35)';
            targetCtx.beginPath();
            targetCtx.arc(-15, 2, 4, 0, Math.PI * 2);
            targetCtx.arc(15, 2, 4, 0, Math.PI * 2);
            targetCtx.fill();

            targetCtx.restore();
        }

        // Render Preview Pou in Menu/Shop
        function renderPouPreview() {
            pCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
            drawPou(pCtx, 45, 48, 48, 46, state.activeSkin, true, 0);
        }

        class Platform {
            constructor(x, y, type = 'normal') {
                this.x = x;
                this.y = y;
                this.width = 72;
                this.height = 18;
                this.type = type; // normal, moving, broken, spring
                this.vx = (type === 'moving') ? (Math.random() < 0.5 ? 1.5 : -1.5) : 0;
                this.broken = false;
                this.hasSpring = (type === 'spring');
                this.springCompressed = false;
            }

            update() {
                if (this.type === 'moving') {
                    this.x += this.vx;
                    if (this.x <= 10 || this.x + this.width >= gameWidth - 10) {
                        this.vx *= -1;
                    }
                }
            }

            draw(ctx) {
                if (this.broken) return;

                ctx.save();
                
                // Draw Cloud Platform base
                if (this.type === 'broken') {
                    ctx.fillStyle = '#94a3b8';
                } else if (this.type === 'moving') {
                    ctx.fillStyle = '#38bdf8';
                } else {
                    ctx.fillStyle = '#ffffff';
                }

                // Cloud shape puffies
                const x = this.x;
                const y = this.y;
                const w = this.width;
                const h = this.height;

                ctx.beginPath();
                ctx.roundRect(x, y, w, h, 10);
                ctx.fill();

                // Decorative cloud bumps
                ctx.beginPath();
                ctx.arc(x + 15, y, 12, 0, Math.PI * 2);
                ctx.arc(x + 36, y - 4, 15, 0, Math.PI * 2);
                ctx.arc(x + 57, y, 12, 0, Math.PI * 2);
                ctx.fill();

                // Shading underneath
                ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
                ctx.fillRect(x + 5, y + h - 4, w - 10, 4);

                // Spring rendering if spring cloud
                if (this.hasSpring) {
                    const springX = x + w / 2;
                    const springY = y - 8;
                    ctx.fillStyle = '#ef4444';
                    if (this.springCompressed) {
                        ctx.fillRect(springX - 8, springY + 4, 16, 4);
                    } else {
                        ctx.fillRect(springX - 8, springY - 4, 16, 12);
                    }
                }

                ctx.restore();
            }
        }

        class Coin {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.radius = 10;
                this.collected = false;
                this.animFrame = Math.random() * Math.PI * 2;
            }

            update() {
                this.animFrame += 0.08;
            }

            draw(ctx) {
                if (this.collected) return;
                ctx.save();
                const scale = Math.sin(this.animFrame) * 0.2 + 0.8;
                ctx.translate(this.x, this.y);
                ctx.scale(scale, 1);

                ctx.fillStyle = '#fbbf24';
                ctx.beginPath();
                ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#d97706';
                ctx.stroke();

                ctx.fillStyle = '#fef08a';
                ctx.font = 'bold 10px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('$', 0, 0);

                ctx.restore();
            }
        }

        function initGame() {
            score = 0;
            sessionCoins = 0;
            cameraY = 0;

            player.x = gameWidth / 2;
            player.y = gameHeight - 120;
            player.vx = 0;
            player.vy = player.jumpForce;

            platforms = [];
            coinsList = [];
            particles = [];

            // Base platform
            platforms.push(new Platform(gameWidth / 2 - 36, gameHeight - 60, 'normal'));

            // Generate initial clouds upwards
            let currentY = gameHeight - 140;
            for (let i = 0; i < 15; i++) {
                spawnPlatform(currentY);
                currentY -= 70 + Math.random() * 20;
            }

            document.getElementById('scoreDisplay').textContent = '0m';
            document.getElementById('coinCount').textContent = state.coins;
        }

        function spawnPlatform(y) {
            const margin = 20;
            const x = margin + Math.random() * (gameWidth - 72 - margin * 2);
            let type = 'normal';

            const rand = Math.random();
            if (rand < 0.25) type = 'moving';
            else if (rand < 0.4) type = 'broken';
            else if (rand < 0.5) type = 'spring';

            const plat = new Platform(x, y, type);
            platforms.push(plat);

            // Chance to spawn coin on normal/moving platform
            if (type !== 'broken' && Math.random() < 0.35) {
                coinsList.push(new Coin(x + plat.width / 2, y - 20));
            }
        }

        function updatePhysics() {
            // Horizontal Movement
            if (keys.left) {
                player.vx = -player.speed;
                player.facingRight = false;
            } else if (keys.right) {
                player.vx = player.speed;
                player.facingRight = true;
            } else {
                player.vx *= 0.82; // Friction
            }

            player.x += player.vx;

            // Screen Wrap around
            if (player.x < -player.width / 2) player.x = gameWidth + player.width / 2;
            if (player.x > gameWidth + player.width / 2) player.x = -player.width / 2;

            // Vertical Movement & Gravity
            player.vy += player.gravity;
            player.y += player.vy;

            // Camera follow player upwards
            if (player.y < gameHeight * 0.4) {
                const diff = gameHeight * 0.4 - player.y;
                player.y = gameHeight * 0.4;
                cameraY += diff;

                // Increase score based on height climbed
                const currentScore = Math.floor(cameraY / 10);
                if (currentScore > score) {
                    score = currentScore;
                    document.getElementById('scoreDisplay').textContent = score + 'm';
                }

                // Move all entities down relative to camera
                platforms.forEach(p => p.y += diff);
                coinsList.forEach(c => c.y += diff);
            }

            // Platform Collisions (only when falling downwards)
            if (player.vy > 0) {
                platforms.forEach(p => {
                    if (
                        !p.broken &&
                        player.x + player.width / 3 > p.x &&
                        player.x - player.width / 3 < p.x + p.width &&
                        player.y + player.height / 2 >= p.y &&
                        player.y + player.height / 2 <= p.y + p.height + player.vy
                    ) {
                        if (p.type === 'broken') {
                            p.broken = true;
                            audio.playCrumble();
                        } else if (p.hasSpring) {
                            p.springCompressed = true;
                            player.vy = player.jumpForce * 1.6; // High Jump Boost!
                            audio.playSpring();
                            setTimeout(() => p.springCompressed = false, 300);
                        } else {
                            player.vy = player.jumpForce;
                            audio.playJump();
                        }
                    }
                });
            }

            // Coin Collections
            coinsList.forEach(c => {
                if (!c.collected) {
                    const dx = player.x - c.x;
                    const dy = player.y - c.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < player.width / 2 + c.radius) {
                        c.collected = true;
                        sessionCoins++;
                        state.coins++;
                        document.getElementById('coinCount').textContent = state.coins;
                        localStorage.setItem('airich_coins', state.coins);
                        audio.playCoin();
                    }
                }
            });

            // Update platforms & Coins
            platforms.forEach(p => p.update());
            coinsList.forEach(c => c.update());

            // Recycle off-screen platforms and generate new ones above
            platforms = platforms.filter(p => p.y < gameHeight + 50);
            coinsList = coinsList.filter(c => c.y < gameHeight + 50);

            const highestPlatformY = Math.min(...platforms.map(p => p.y), gameHeight);
            if (highestPlatformY > 80) {
                spawnPlatform(highestPlatformY - (65 + Math.random() * 25));
            }

            // Game Over Condition (Fell off bottom of screen)
            if (player.y - player.height > gameHeight) {
                triggerGameOver();
            }
        }

        function drawBackground() {
            // Dynamic sky gradient changes as height increases
            const skyGradient = ctx.createLinearGradient(0, 0, 0, gameHeight);
            if (score < 200) {
                skyGradient.addColorStop(0, '#38ef7d'); skyGradient.addColorStop(1, '#11998e');
            } else if (score < 500) {
                skyGradient.addColorStop(0, '#f97316'); skyGradient.addColorStop(1, '#6366f1');
            } else if (score < 1000) {
                skyGradient.addColorStop(0, '#312e81'); skyGradient.addColorStop(1, '#4c1d95');
            } else {
                skyGradient.addColorStop(0, '#090d16'); skyGradient.addColorStop(1, '#1e1b4b');
            }
            ctx.fillStyle = skyGradient;
            ctx.fillRect(0, 0, gameWidth, gameHeight);

            // Subtle background decorative clouds
            ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
            ctx.beginPath();
            ctx.arc((gameWidth * 0.2 + cameraY * 0.1) % (gameWidth + 100) - 50, 100, 40, 0, Math.PI * 2);
            ctx.arc((gameWidth * 0.7 - cameraY * 0.05) % (gameWidth + 100) - 50, 260, 50, 0, Math.PI * 2);
            ctx.fill();
        }

        function gameLoop() {
            if (!isPlaying) return;

            ctx.clearRect(0, 0, gameWidth, gameHeight);

            drawBackground();

            // Render Platforms
            platforms.forEach(p => p.draw(ctx));

            // Render Coins
            coinsList.forEach(c => c.draw(ctx));

            // Render Pou
            drawPou(ctx, player.x, player.y, player.width, player.height, state.activeSkin, player.facingRight, player.vy);

            updatePhysics();

            requestAnimationFrame(gameLoop);
        }

        function triggerGameOver() {
            isPlaying = false;
            audio.playGameOver();

            if (score > state.highScore) {
                state.highScore = score;
                localStorage.setItem('airich_highscore', state.highScore);
            }

            document.getElementById('finalScore').textContent = score + 'm';
            document.getElementById('highScoreDisplay').textContent = state.highScore + 'm';
            document.getElementById('earnedCoins').textContent = sessionCoins;
            document.getElementById('gameOverMenu').classList.remove('hidden');
        }

        function setupShop() {
            const listEl = document.getElementById('skinList');
            listEl.innerHTML = '';
            document.getElementById('shopTotalCoins').textContent = state.coins;

            SKINS.forEach(skin => {
                const isSelected = state.activeSkin === skin.id;
                const isUnlocked = skin.unlocked;

                const item = document.createElement('div');
                item.className = 'flex items-center justify-between p-3 rounded-2xl border transition-all ' +
                    (isSelected ? 'bg-amber-500/20 border-amber-400' : 'bg-slate-800/60 border-white/10');

                item.innerHTML =
                    '<div class="flex items-center gap-3">' +
                    '  <div class="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center overflow-hidden border border-white/10">' +
                    '    <span class="w-8 h-8 rounded-full" style="background:' + skin.color + '"></span>' +
                    '  </div>' +
                    '  <div>' +
                    '    <div class="font-bold text-sm text-white">' + skin.name + '</div>' +
                    '    <div class="text-xs text-slate-400">' + (isUnlocked ? 'Terbuka' : skin.price + ' Koin') + '</div>' +
                    '  </div>' +
                    '</div>' +
                    '<button class="skin-btn px-4 py-2 rounded-xl font-game text-xs transition-all btn-bounce" data-id="' + skin.id + '">' +
                    (isSelected ? '<span class="text-emerald-400">Dipakai</span>' : (isUnlocked ? 'Pakai' : 'Beli')) +
                    '</button>';

                const btn = item.querySelector('.skin-btn');
                if (!isSelected) {
                    btn.classList.add(isUnlocked ? 'bg-slate-700' : 'bg-amber-500');
                    btn.addEventListener('click', () => handleSkinAction(skin));
                }

                listEl.appendChild(item);
            });
        }

        function handleSkinAction(skin) {
            if (skin.unlocked) {
                state.activeSkin = skin.id;
                localStorage.setItem('airich_skin', skin.id);
            } else if (state.coins >= skin.price) {
                state.coins -= skin.price;
                skin.unlocked = true;
                state.activeSkin = skin.id;
                state.unlockedSkins.push(skin.id);

                localStorage.setItem('airich_coins', state.coins);
                localStorage.setItem('airich_skin', skin.id);
                localStorage.setItem('airich_unlocked', JSON.stringify(state.unlockedSkins));
            }
            renderPouPreview();
            setupShop();
        }

        document.getElementById('startPlayBtn').addEventListener('click', () => {
            audio.init();
            document.getElementById('startMenu').classList.add('hidden');
            isPlaying = true;
            initGame();
            gameLoop();
        });

        document.getElementById('restartBtn').addEventListener('click', () => {
            document.getElementById('gameOverMenu').classList.add('hidden');
            isPlaying = true;
            initGame();
            gameLoop();
        });

        // Sound Toggle
        const soundBtn = document.getElementById('soundBtn');
        const sndOn = document.getElementById('sndOn');
        const sndOff = document.getElementById('sndOff');
        soundBtn.addEventListener('click', () => {
            audio.muted = !audio.muted;
            if (sndOn) sndOn.style.display = audio.muted ? 'none' : 'flex';
            if (sndOff) sndOff.style.display = audio.muted ? 'flex' : 'none';
        });

        // Shop Modal Events
        const shopModal = document.getElementById('shopModal');
        document.getElementById('shopBtn').addEventListener('click', () => {
            setupShop();
            shopModal.classList.remove('hidden');
        });
        document.getElementById('gameOverShopBtn').addEventListener('click', () => {
            setupShop();
            shopModal.classList.remove('hidden');
        });
        document.getElementById('closeShopBtn').addEventListener('click', () => {
            shopModal.classList.add('hidden');
        });

        // Keyboard Controls
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
        });
        window.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
        });

        // Mobile On-screen Touch Controls
        const btnLeft = document.getElementById('btnLeft');
        const btnRight = document.getElementById('btnRight');

        const bindTouch = (elem, keyName) => {
            elem.addEventListener('touchstart', (e) => { e.preventDefault(); keys[keyName] = true; });
            elem.addEventListener('touchend', (e) => { e.preventDefault(); keys[keyName] = false; });
            elem.addEventListener('mousedown', () => { keys[keyName] = true; });
            elem.addEventListener('mouseup', () => { keys[keyName] = false; });
        };
        bindTouch(btnLeft, 'left');
        bindTouch(btnRight, 'right');

        // Initial Preview Render
        renderPouPreview();
    </script>
</body>`;

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
                                messageText: "Pou Sky Jump"
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

handler.help = ['pou', 'pouskyjump'];
handler.tags = ['game'];
handler.category = 'game';
handler.description = 'Main game Pou Sky Jump HTML interaktif via Rich Message';
handler.command = /^(pou|pouskyjump)$/i;

export default handler;
