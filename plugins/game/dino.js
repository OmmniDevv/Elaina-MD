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
 * @source Qiro Ai - No Comot, No Ganti Nama
 */

'use strict'

const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<title>Qiro Ai Dino Run</title>
<style>
:root{--bg:#061012;--panel:#0b191b;--panel2:#102426;--line:rgba(170,255,229,.14);--text:#f2fff9;--muted:#8ba7a2;--mint:#61f4c2;--lime:#d3ff70;--gold:#ffd66b;--red:#ff718c;--brown:#6d5141}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{margin:0;min-height:100%;background:radial-gradient(circle at 50% -15%,#1d5a4c 0,#0a2224 32%,#04090b 75%);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif}
body{padding:8px;overflow-x:hidden}.app{width:min(100%,760px);margin:auto}
.top{display:flex;align-items:center;justify-content:space-between;gap:9px;margin-bottom:9px}.brand{display:flex;align-items:center;gap:10px;min-width:0}.logo{width:47px;height:47px;flex:none;border-radius:14px;display:grid;place-items:center;background:linear-gradient(145deg,#1d725c,#0d2e2b);border:1px solid var(--line);box-shadow:0 10px 30px #0007}.logo svg{width:33px;height:33px}.name{font-size:19px;font-weight:900;letter-spacing:-.4px}.sub{font-size:10.5px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pill{padding:8px 11px;border-radius:12px;border:1px solid var(--line);background:#ffffff07;color:#d9f7ee;font-size:9px;font-weight:800;letter-spacing:.4px}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-bottom:9px}.stat{min-width:0;padding:10px 11px;border:1px solid var(--line);border-radius:14px;background:linear-gradient(145deg,#ffffff09,#ffffff03);box-shadow:0 10px 26px #0002}.stat b{display:block;font-size:17px;line-height:1.05}.stat span{display:block;margin-top:5px;font-size:8.5px;color:var(--muted);text-transform:uppercase;letter-spacing:.7px}
.gameShell{padding:6px;border-radius:21px;background:linear-gradient(145deg,#ffffff13,#ffffff04);border:1px solid var(--line);box-shadow:0 24px 70px #0008,0 0 40px #54e9bd10}.stage{position:relative;width:100%;height:auto;aspect-ratio:16/8.2;min-height:242px;overflow:hidden;border-radius:16px;background:#092022;touch-action:none;user-select:none;contain:layout paint;isolation:isolate}.scene{position:absolute;inset:0;overflow:hidden;contain:strict;pointer-events:none}.sky{position:absolute;inset:0;background:linear-gradient(180deg,#071b20 0%,#0b302f 48%,#17443b 100%)}.glow{position:absolute;width:42%;aspect-ratio:1;left:7%;top:-25%;border-radius:50%;background:radial-gradient(circle,#83f5c43d 0,#54e9bd14 34%,transparent 70%);filter:blur(8px);will-change:transform;animation:glowDrift 18s ease-in-out infinite alternate}.moon{position:absolute;right:10%;top:12%;width:48px;height:48px;border-radius:50%;background:#d9fff0;box-shadow:0 0 28px #c9ffe055;will-change:transform;animation:moonDrift 13s ease-in-out infinite alternate}.moon:after{content:"";position:absolute;width:42px;height:42px;right:-7px;top:-5px;border-radius:50%;background:#0b2b2c}.stars{position:absolute;inset:-4%;opacity:.74;background-image:radial-gradient(circle at 12% 24%,#c8fff8 0 1px,transparent 1.5px),radial-gradient(circle at 29% 16%,#c8fff8 0 1px,transparent 1.5px),radial-gradient(circle at 48% 28%,#c8fff8 0 1px,transparent 1.5px),radial-gradient(circle at 67% 12%,#c8fff8 0 1px,transparent 1.5px),radial-gradient(circle at 83% 31%,#c8fff8 0 1px,transparent 1.5px),radial-gradient(circle at 92% 17%,#c8fff8 0 1px,transparent 1.5px);will-change:transform;animation:starsDrift 22s linear infinite}.hills{position:absolute;left:-5%;right:-5%;bottom:23%;height:35%;background:#0c2d2b;clip-path:polygon(0 78%,8% 55%,15% 72%,24% 30%,31% 65%,39% 45%,48% 72%,57% 25%,65% 65%,74% 40%,84% 70%,93% 38%,100% 65%,100% 100%,0 100%);opacity:.95;will-change:transform;animation:hillsDrift 28s linear infinite}.hills.back{bottom:28%;height:29%;opacity:.42;transform:scaleX(1.06);animation:hillsBackDrift 42s linear infinite reverse}.jungle{position:absolute;left:0;right:0;bottom:19%;height:20%;background:linear-gradient(180deg,transparent,#071d1c99)}.tree{position:absolute;bottom:18%;width:16px;height:60px;background:#071818;border-radius:10px 10px 2px 2px;box-shadow:0 -35px 0 12px #0a2825,0 -58px 0 6px #0b302b;will-change:transform}.t1{left:4%;transform:scale(.8);animation:treeDriftA 14s ease-in-out infinite}.t2{left:30%;transform:scale(.55);animation:treeDriftB 19s ease-in-out infinite}.t3{left:57%;transform:scale(.72);animation:treeDriftC 17s ease-in-out infinite reverse}.t4{right:4%;transform:scale(.95);animation:treeDriftD 23s ease-in-out infinite reverse}.ground{position:absolute;left:0;right:0;bottom:0;height:21%;background:linear-gradient(180deg,#275842 0%,#1d4234 11%,#152f28 38%,#0a1d1a 100%);overflow:hidden}.groundLine{position:absolute;left:0;right:0;top:0;height:4px;background:linear-gradient(90deg,#52e7b6,#b9ff78,#52e7b6);box-shadow:0 0 12px #63f4c277}.groundLine:after{content:"";position:absolute;left:0;right:0;top:4px;height:7px;background:repeating-linear-gradient(90deg,transparent 0 11px,#76b76b66 12px 14px,transparent 15px 25px)}.road{position:absolute;inset:0;background:linear-gradient(180deg,transparent 0%,#081a1840 100%),repeating-linear-gradient(90deg,transparent 0 24px,#b8e7c514 25px 27px,transparent 28px 67px);transform:translate3d(var(--road,0px),0,0);opacity:.9;will-change:transform}.road:before{content:"";position:absolute;inset:35% 0 0;background:repeating-linear-gradient(90deg,transparent 0 56px,#7ea99318 57px 60px,transparent 61px 110px)}.scan{position:absolute;left:0;right:0;bottom:0;height:22%;background:linear-gradient(180deg,transparent,#06101244);pointer-events:none}.soil{position:absolute;left:0;right:0;bottom:0;height:62%;background:radial-gradient(circle at 8% 40%,#d2bd8a77 0 2px,transparent 2.8px),radial-gradient(circle at 15% 78%,#856d4e88 0 1.5px,transparent 2.4px),radial-gradient(circle at 27% 54%,#bca57666 0 2px,transparent 3px),radial-gradient(circle at 39% 73%,#6f5d4888 0 1.5px,transparent 2.5px),radial-gradient(circle at 50% 41%,#d1ba8566 0 1.8px,transparent 2.7px),radial-gradient(circle at 61% 70%,#7d684f88 0 2px,transparent 3px),radial-gradient(circle at 73% 52%,#c7ad7a66 0 1.6px,transparent 2.6px),radial-gradient(circle at 86% 74%,#76614888 0 1.8px,transparent 2.8px),repeating-linear-gradient(172deg,transparent 0 9px,#c09f6a18 10px 11px,transparent 12px 21px),linear-gradient(180deg,#1d3b30 0%,#122a23 100%)}.soil:before{content:"";position:absolute;left:0;right:0;top:24%;height:2px;background:repeating-linear-gradient(90deg,#9c815d20 0 18px,transparent 18px 31px)}.soil:after{content:"";position:absolute;left:0;right:0;bottom:12%;height:18px;background:radial-gradient(ellipse at 7% 60%,#7d684e88 0 7px,transparent 8px),radial-gradient(ellipse at 19% 20%,#bca37566 0 5px,transparent 6px),radial-gradient(ellipse at 36% 72%,#725d4780 0 6px,transparent 7px),radial-gradient(ellipse at 54% 34%,#b79e7266 0 5px,transparent 6px),radial-gradient(ellipse at 71% 68%,#6c59467d 0 7px,transparent 8px),radial-gradient(ellipse at 89% 30%,#ae956d66 0 5px,transparent 6px)}.grassBits{position:absolute;left:0;right:0;top:5px;height:18px;background:repeating-linear-gradient(112deg,transparent 0 7px,#76c76b 8px 10px,transparent 11px 18px),repeating-linear-gradient(70deg,transparent 0 13px,#3f9150aa 14px 16px,transparent 17px 27px);opacity:.9;filter:drop-shadow(0 1px 0 #8fe47d55)}.hud{position:absolute;z-index:5;left:10px;right:10px;top:10px;display:flex;justify-content:space-between;pointer-events:none}.hud span{padding:7px 9px;border-radius:10px;background:#061110a8;border:1px solid #ffffff12;color:#dcfff5;font-size:9px;font-weight:800;letter-spacing:.4px}.hud .live{color:var(--mint)}
.player{position:absolute;z-index:4;left:0;top:0;width:54px;height:70px;transform:translate3d(115px,0,0);will-change:transform;filter:drop-shadow(0 7px 6px #0007);contain:layout paint}.dinoBody{position:absolute;left:17%;top:26%;width:62%;height:58%;border-radius:42% 46% 34% 28%;background:linear-gradient(160deg,#72ffd2 0%,#36c69a 58%,#1e9776 100%);box-shadow:inset -5px -7px 0 #168366}.dinoBody:before{content:"";position:absolute;left:42%;top:-18%;width:32%;height:30%;border-radius:50%;background:#41d3a4}.dinoBody:after{content:"";position:absolute;left:18%;top:18%;width:38%;height:13%;border-radius:50%;background:#9affd8aa}.dinoNeck{position:absolute;left:48%;top:12%;width:21%;height:48%;border-radius:12px;background:linear-gradient(90deg,#40c69a,#7cffd0 62%,#29a982);transform:rotate(-18deg);transform-origin:bottom center}.dinoHead{position:absolute;left:49%;top:0;width:57%;height:42%;border-radius:44% 45% 25% 33%;background:linear-gradient(145deg,#c7ff7a 0%,#7fe6a1 48%,#54bf8b 100%);box-shadow:inset -4px -5px 0 #3c9e77}.dinoHead:before{content:"";position:absolute;left:8%;top:35%;width:76%;height:8%;border-radius:99px;background:#dffff0aa;transform:rotate(-3deg)}.snout{position:absolute;right:-33%;top:38%;width:55%;height:32%;border-radius:9px 12px 8px 10px;background:linear-gradient(145deg,#b7f66f,#65cd92);box-shadow:inset -3px -3px 0 #3d9f73}.eye{position:absolute;right:21%;top:23%;width:8%;height:12%;border-radius:50%;background:#071513;box-shadow:0 0 0 1px #ecfff744}.eye:after{content:"";position:absolute;right:17%;top:17%;width:35%;height:35%;border-radius:50%;background:#f7fff0}.jaw{position:absolute;right:-29%;top:62%;width:46%;height:13%;border-radius:0 0 7px 7px;background:#d1ff7d;transform:rotate(2deg)}.teeth{position:absolute;right:-17%;top:72%;width:32%;height:8%;background:repeating-linear-gradient(90deg,#ffffff 0 3px,transparent 3px 6px);clip-path:polygon(0 0,100% 0,88% 100%,76% 0,64% 100%,52% 0,40% 100%,28% 0,16% 100%)}.arm{position:absolute;right:8%;top:51%;width:26%;height:10%;border-radius:8px;background:#42d0a0;transform:rotate(22deg);transform-origin:left center}.claw{position:absolute;right:-11%;top:-5%;width:22%;height:45%;border-right:2px solid #c7ff8b;border-bottom:2px solid #c7ff8b;border-radius:0 0 8px 0;transform:rotate(-8deg)}.tail{position:absolute;left:-14%;top:54%;width:45%;height:17%;border-radius:80% 18% 12% 80%;background:linear-gradient(150deg,#2ab78d,#168365);transform:rotate(-16deg);transform-origin:right center}.tail:after{content:"";position:absolute;left:-24%;top:16%;width:48%;height:70%;border-radius:50%;background:#269d7c;transform:rotate(-16deg)}.leg{position:absolute;bottom:5%;width:19%;height:31%;border-radius:9px 9px 5px 5px;background:linear-gradient(180deg,#4bdda9,#219672)}.leg.a{left:23%;transform-origin:50% 15%}.leg.b{left:57%;transform-origin:50% 15%}.foot{position:absolute;left:-18%;bottom:-3%;width:140%;height:23%;border-radius:70% 30% 35% 30%;background:#1a8066}.player.run .leg.a{animation:legA .22s ease-in-out infinite alternate}.player.run .leg.b{animation:legB .22s ease-in-out infinite alternate}.player.jump .leg.a,.player.jump .leg.b{animation:none}.player.duck .dinoBody{left:18%;top:37%;width:73%;height:43%;border-radius:48% 42% 30% 34%;transform:skewX(-8deg)}.player.duck .dinoNeck{left:51%;top:26%;height:35%;transform:rotate(-33deg)}.player.duck .dinoHead{left:53%;top:16%;transform:rotate(11deg) scale(.96)}.player.duck .snout{top:42%;right:-34%;transform:rotate(1deg)}.player.duck .tail{top:57%;transform:rotate(-10deg)}.player.duck .arm{top:57%;transform:rotate(28deg)}.player.duck .leg{height:24%;bottom:5%}.player.jump{filter:drop-shadow(0 12px 9px #0007)}
.object{position:absolute;z-index:3;left:0;top:0;bottom:auto;will-change:transform;transform-origin:center bottom;contain:layout paint}.cactus{width:35px;height:62px;filter:drop-shadow(0 5px 4px #0006);overflow:visible}.cactus .stem{position:absolute;left:9px;bottom:0;width:17px;height:62px;border-radius:10px 10px 6px 6px;background:radial-gradient(circle at 28% 13%,#f4ffd0 0 1px,transparent 1.8px),radial-gradient(circle at 68% 26%,#efffb8 0 1px,transparent 1.8px),radial-gradient(circle at 35% 42%,#efffb8 0 1px,transparent 1.8px),radial-gradient(circle at 71% 56%,#efffb8 0 1px,transparent 1.8px),radial-gradient(circle at 28% 73%,#efffb8 0 1px,transparent 1.8px),linear-gradient(90deg,#527f38 0%,#8dbb4d 26%,#d0ef79 48%,#91bd54 74%,#5c893a 100%);box-shadow:inset 3px 0 #e7f59a33,inset -4px 0 #4b7434}.cactus .stem:before{content:"";position:absolute;left:4px;top:7px;bottom:7px;width:2px;border-radius:99px;background:#efffb86b;box-shadow:5px 0 #efffb82a}.cactus .stem:after{content:"";position:absolute;left:3px;right:3px;top:12px;height:38px;background:repeating-linear-gradient(90deg,transparent 0 4px,#efffb833 4px 5px,transparent 5px 8px);opacity:.55}.cactus .arm1,.cactus .arm2{position:absolute;background:linear-gradient(90deg,#5d8b3b 0%,#a9d55f 34%,#d2ee81 54%,#80ae49 78%,#557f37 100%);border:1px solid #4d7233;box-shadow:inset -3px 0 #4a7133;transform-origin:50% 100%}.cactus .arm1{left:0px;top:25px;width:13px;height:31px;border-radius:7px 7px 5px 6px;transform:rotate(-7deg)}.cactus .arm1:before{content:"";position:absolute;left:4px;top:-15px;width:10px;height:20px;border-radius:7px 7px 3px 3px;background:linear-gradient(90deg,#668f40,#c0e66f,#6f9e43);box-shadow:inset -2px 0 #4e7837;transform:rotate(-8deg)}.cactus .arm1:after{content:"";position:absolute;left:7px;top:-2px;width:6px;height:6px;border-radius:50%;background:#efffb86b;box-shadow:0 9px #efffb85c}.cactus .arm2{right:0px;top:33px;width:12px;height:25px;border-radius:6px 7px 5px 6px;transform:rotate(8deg)}.cactus .arm2:before{content:"";position:absolute;right:1px;top:-12px;width:9px;height:17px;border-radius:6px 6px 3px 3px;background:linear-gradient(90deg,#648f3e,#bedf6c,#6d9e42);box-shadow:inset -2px 0 #4d7637;transform:rotate(7deg)}.cactus .arm2:after{content:"";position:absolute;left:2px;top:2px;width:6px;height:5px;border-radius:50%;background:#efffb86b;box-shadow:0 8px #efffb855}.cactus .spine{position:absolute;width:2px;height:7px;border-radius:2px;background:#f4ffcf;opacity:.86;box-shadow:0 9px 0 #f4ffcf66}.cactus .s1{left:14px;top:9px;transform:rotate(27deg)}.cactus .s2{left:6px;top:29px;transform:rotate(-30deg)}.cactus .s3{left:20px;top:42px;transform:rotate(40deg)}.treeObs{width:82px;height:118px;filter:drop-shadow(0 7px 5px #0007)}.treeObs .trunk{position:absolute;left:34%;bottom:0;width:28%;height:54%;border-radius:9px 9px 5px 5px;background:linear-gradient(90deg,#55382a,#9a6846 45%,#5f3d2c);box-shadow:inset 5px 0 #bd835a55}.treeObs .root1,.treeObs .root2{position:absolute;bottom:0;width:30%;height:12%;background:#6b4733;border-radius:70% 10% 10% 10%}.treeObs .root1{left:13%;transform:rotate(15deg)}.treeObs .root2{right:13%;transform:rotate(-15deg)}.treeObs .canopy{position:absolute;left:5%;top:0;width:90%;height:63%;border-radius:48% 52% 44% 48%;background:radial-gradient(circle at 35% 28%,#a7e36d 0 8%,transparent 9%),radial-gradient(circle at 62% 22%,#79c957 0 12%,transparent 13%),radial-gradient(circle at 48% 55%,#4d9b50 0 28%,#347848 29% 55%,#245c3e 56%);box-shadow:inset -9px -8px #1b4b35aa,0 0 0 3px #1d4f3988}.treeObs .leaf1,.treeObs .leaf2,.treeObs .leaf3{position:absolute;background:#5faa4e;border-radius:50%;z-index:2}.treeObs .leaf1{width:24%;height:22%;left:2%;top:32%}.treeObs .leaf2{width:25%;height:24%;right:3%;top:29%}.treeObs .leaf3{width:21%;height:20%;left:42%;top:5%}.rock{width:52px;height:38px;filter:drop-shadow(0 5px 4px #0006)}.rock .shape{position:absolute;inset:0 2px 0 0;background:linear-gradient(145deg,#d0b093,#765b4b);clip-path:polygon(0 100%,8% 38%,38% 8%,67% 18%,92% 48%,100% 100%);border-radius:10px}.rock .shine{position:absolute;left:18px;top:11px;width:10px;height:5px;border-radius:50%;background:#dfbda2}.bird{width:58px;height:30px;filter:drop-shadow(0 4px 3px #0006)}.bird .wing{position:absolute;left:14px;top:7px;width:28px;height:12px;border-radius:20px 20px 3px 3px;background:#d89c72;transform:rotate(-8deg)}.bird .wing:after{content:"";position:absolute;left:18px;top:3px;width:23px;height:9px;background:#ff718c;border-radius:12px 12px 3px 3px}.bird .eye{position:absolute;right:6px;top:10px;width:4px;height:4px;background:#26160f}.bird .beak{position:absolute;right:-1px;top:12px;width:8px;height:5px;background:#ffd66b;clip-path:polygon(0 0,100% 50%,0 100%)}
.pickup{position:absolute;z-index:3;left:0;top:0;bottom:auto;width:25px;height:25px;will-change:transform;contain:layout paint}.coin{border-radius:50%;border:4px solid #ffd66b;background:#9c7122;box-shadow:0 0 15px #ffd66b88,inset 0 0 0 2px #ffe99c}.coin:after{content:"+";position:absolute;inset:0;display:grid;place-items:center;color:#fff1a8;font-weight:900;font-size:11px}.shield{border-radius:50%;border:3px solid #61f4c2;background:#0e5e50;box-shadow:0 0 18px #61f4c277}.shield:after{content:"◆";position:absolute;inset:0;display:grid;place-items:center;color:#9dffe1;font-size:11px}.particle{position:absolute;z-index:6;width:5px;height:5px;border-radius:50%;pointer-events:none;will-change:transform,opacity;contain:strict}.notice{position:absolute;z-index:8;left:50%;top:50%;transform:translate(-50%,-50%);padding:10px 14px;border-radius:12px;background:#061211dd;border:1px solid #8dffdc38;color:#eafff7;font-size:10px;font-weight:900;opacity:0;pointer-events:none;transition:.18s}.notice.show{opacity:1}.tapHint{position:absolute;z-index:4;left:50%;bottom:10%;transform:translateX(-50%);padding:6px 9px;border-radius:99px;background:#0611107a;border:1px solid #ffffff10;color:#c8ddd7;font-size:8px;opacity:.9;pointer-events:none}
@keyframes legA{from{transform:rotate(18deg)}to{transform:rotate(-22deg)}}@keyframes legB{from{transform:rotate(-22deg)}to{transform:rotate(18deg)}}@keyframes starsDrift{from{transform:translate3d(-1%,0,0) scale(1)}to{transform:translate3d(1.5%,1%,0) scale(1.02)}}@keyframes moonDrift{from{transform:translate3d(0,2px,0)}to{transform:translate3d(-10px,-5px,0)}}@keyframes glowDrift{from{transform:translate3d(-3%,0,0)}to{transform:translate3d(9%,7%,0)}}@keyframes hillsDrift{from{transform:translate3d(-1%,0,0)}to{transform:translate3d(1.5%,0,0)}}@keyframes hillsBackDrift{from{transform:scaleX(1.06) translate3d(-1%,0,0)}to{transform:scaleX(1.06) translate3d(1.2%,0,0)}}
@media (prefers-reduced-motion:reduce){.glow,.moon,.stars,.hills,.tree{animation:none!important}}
.lite .glow{display:none}.lite .player,.lite .object{filter:none}.lite .coin,.lite .shield{box-shadow:none}.lite .particle{display:none}.lite .tree{box-shadow:0 -35px 0 10px #0a2825,0 -55px 0 5px #0b302b}

.controls{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:9px}.btn{min-height:48px;border:1px solid var(--line);border-radius:13px;background:linear-gradient(145deg,#ffffff0b,#ffffff03);color:#f3fff9;font-size:11.5px;font-weight:900;cursor:pointer;box-shadow:0 8px 20px #0002;touch-action:manipulation}.btn:active{transform:scale(.98)}.btn.main{background:linear-gradient(145deg,#1d755f,#124b40);border-color:#65efc080}.btn.jump{background:linear-gradient(145deg,#3d7338,#28522d);border-color:#c9ff7070}.btn.duck{background:linear-gradient(145deg,#564035,#352a23);border-color:#ffd86b50}
.bottom{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:9px}.panel{padding:11px 12px;border:1px solid var(--line);border-radius:14px;background:#ffffff05}.panelTitle{font-size:9.5px;font-weight:900;color:#d9eee8}.mini{display:flex;justify-content:space-between;gap:8px;margin-top:7px;color:var(--muted);font-size:9.5px}.mini b{color:#ecfff8}.progress{height:6px;margin-top:8px;border-radius:99px;background:#ffffff0a;overflow:hidden}.progress i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--mint),var(--lime));border-radius:99px}.help{margin-top:8px;padding:9px 11px;border-radius:12px;background:#ffffff04;border:1px solid var(--line);color:#91aba6;text-align:center;font-size:8px}
.overlay{position:fixed;inset:0;z-index:30;display:flex;align-items:center;justify-content:center;padding:16px;background:#020708c7;backdrop-filter:blur(8px)}.overlay.hide{display:none}.modal{width:min(92vw,430px);padding:20px;border:1px solid #8dffdc24;border-radius:22px;background:linear-gradient(145deg,#102725,#091517);box-shadow:0 30px 100px #000b;text-align:center}.hero{width:72px;height:72px;margin:auto auto 7px;border-radius:22px;display:grid;place-items:center;background:#ffffff08;border:1px solid var(--line)}.hero svg{width:54px;height:54px}.modal h2{margin:3px 0;font-size:24px}.modal p{margin:7px 0 15px;color:var(--muted);font-size:11px;line-height:1.5}.result{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:12px}.result div{padding:9px;border-radius:12px;background:#ffffff06;border:1px solid var(--line)}.result b{display:block;font-size:16px}.result span{font-size:8px;color:var(--muted)}.modalBtns{display:grid;grid-template-columns:1fr 1fr;gap:7px}.toast{position:fixed;z-index:40;left:50%;bottom:110px;transform:translate(-50%,12px);opacity:0;pointer-events:none;padding:9px 12px;border-radius:11px;background:#102825ee;border:1px solid #8dffdc33;color:#eafff7;font-size:9px;font-weight:900;transition:.2s;white-space:nowrap}.toast.show{opacity:1;transform:translate(-50%,0)}
@media(max-width:470px){body{padding:6px}.stats{gap:5px}.stat{padding:9px 6px}.stat b{font-size:15px}.stat span{font-size:7.5px}.stage{min-height:232px}.controls{gap:6px}.btn{min-height:46px;font-size:10.5px}.bottom{gap:6px}.panel{padding:10px}.pill{display:none}}
</style>
</head>
<body>
<div class="app">
<div class="top"><div class="brand"><div class="logo"><svg viewBox="0 0 64 64" fill="none"><path d="M13 47V27c0-10 8-18 18-18h9v9h10v12h-8v17H30V31h-7v16H13Z" fill="#61f4c2"/><path d="M39 18h11v10H39z" fill="#d3ff70"/><circle cx="42" cy="24" r="2.4" fill="#071013"/><path d="M21 18h9" stroke="#071013" stroke-width="3" stroke-linecap="round"/></svg></div><div><div class="name">Qiro Ai Dino Run</div><div class="sub">Neon Jungle Expedition • Endless Runner</div></div></div><div class="pill" id="statePill">READY</div></div>
<div class="stats"><div class="stat"><b id="score">0</b><span>Score</span></div><div class="stat"><b id="hi">0</b><span>Best</span></div><div class="stat"><b id="dist">0m</b><span>Distance</span></div><div class="stat"><b id="combo">x1</b><span>Combo</span></div></div>
<div class="gameShell"><div class="stage" id="stage"><div class="scene"><div class="sky"></div><div class="glow"></div><div class="moon"></div><div class="stars"></div><div class="hills back"></div><div class="hills"></div><div class="jungle"></div><div class="tree t1"></div><div class="tree t2"></div><div class="tree t3"></div><div class="tree t4"></div><div class="ground"><div class="groundLine"></div><div class="grassBits"></div><div class="road" id="road"></div><div class="soil"></div></div><div class="scan"></div></div><div class="hud"><span id="speedHud">SPEED 1.0x</span><span class="live" id="missionHud">RUN 0s</span></div><div class="player" id="player"><div class="tail"></div><div class="dinoBody"></div><div class="dinoNeck"></div><div class="dinoHead"><div class="eye"></div><div class="snout"><div class="jaw"></div><div class="teeth"></div></div></div><div class="arm"><div class="claw"></div></div><div class="leg a"><div class="foot"></div></div><div class="leg b"><div class="foot"></div></div></div><div class="tapHint" id="tapHint">TAP / SWIPE • JUMP / DUCK</div><div class="notice" id="notice"></div></div></div>
<div class="controls"><button class="btn main" id="startBtn" type="button">▶ MULAI</button><button class="btn jump" id="jumpBtn" type="button">⬆ LOMPAT</button><button class="btn duck" id="duckBtn" type="button">⬇ MERUNDUK</button></div>
<div class="bottom"><div class="panel"><div class="panelTitle">PROGRESS RUN</div><div class="mini"><span>Jarak</span><b id="distanceText">0 / ∞ m</b></div><div class="progress"><i id="progressBar"></i></div><div class="mini"><span>Kecepatan</span><b id="speedText">1.0x</b></div></div><div class="panel"><div class="panelTitle">STATUS</div><div class="mini"><span>Perisai</span><b id="shieldText">OFF</b></div><div class="mini"><span>Koin</span><b id="coinText">0</b></div><div class="mini"><span>Rekor</span><b id="recordText">0</b></div></div></div><div class="help">SPACE / ↑ = lompat • ↓ = merunduk • P = pause • R = ulangi • TAP = lompat</div>
</div>
<div class="overlay" id="overlay"><div class="modal"><div class="hero"><svg viewBox="0 0 64 64" fill="none"><path d="M13 47V27c0-10 8-18 18-18h9v9h10v12h-8v17H30V31h-7v16H13Z" fill="#61f4c2"/><path d="M39 18h11v10H39z" fill="#d3ff70"/><circle cx="42" cy="24" r="2.4" fill="#071013"/><path d="M21 18h9" stroke="#071013" stroke-width="3" stroke-linecap="round"/></svg></div><h2 id="modalTitle">Dino Run</h2><p id="modalText">Lari sejauh mungkin, hindari rintangan, ambil koin dan pertahankan combo.</p><div class="result"><div><b id="modalScore">0</b><span>SCORE</span></div><div><b id="modalBest">0</b><span>BEST</span></div></div><div class="modalBtns"><button class="btn main" id="modalStart" type="button">▶ MULAI RUN</button><button class="btn" id="modalClose" type="button">TUTUP</button></div></div></div><div class="toast" id="toast"></div>
<script>
'use strict';
(function(){
var $=function(id){return document.getElementById(id)};
var stage=$('stage'),playerEl=$('player'),road=$('road'),overlay=$('overlay'),notice=$('notice');
var ui={score:$('score'),hi:$('hi'),dist:$('dist'),combo:$('combo'),speedHud:$('speedHud'),missionHud:$('missionHud'),speedText:$('speedText'),distanceText:$('distanceText'),progressBar:$('progressBar'),shieldText:$('shieldText'),coinText:$('coinText'),recordText:$('recordText'),statePill:$('statePill'),startBtn:$('startBtn'),tapHint:$('tapHint'),modalTitle:$('modalTitle'),modalText:$('modalText'),modalScore:$('modalScore'),modalBest:$('modalBest'),toast:$('toast')};
var raf=0,last=0,acc=0,running=false,paused=false,over=false,score=0,best=0,distance=0,coins=0,combo=1,comboTimer=0,speed=96,spawn=1.8,runTime=0,shield=0,roadX=0,shake=0,ducking=false,touchStartY=0,lastAction=0,grace=0,uiClock=0;
var stepHz=60,step=1/stepHz;
var world={w:1000,h:512,ground:404,playerX:115,playerW:48,playerH:70,py:334,vy:0,grounded:true};
var obstacles=[],pickups=[],nextId=1;
var particlePool=[],particleActive=[],particleLimit=24;
var lowPower=!!(navigator.saveData||((navigator.hardwareConcurrency||8)<=4)||((navigator.deviceMemory||8)<=4));
if(lowPower)document.body.classList.add('lite');
particleLimit=lowPower?10:24;

function storageGet(){try{return Number(localStorage.getItem('qiro_dino_best')||0)||0}catch(e){return 0}}
function storageSet(v){try{localStorage.setItem('qiro_dino_best',String(v))}catch(e){}}
best=storageGet();

function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function rnd(a,b){return a+Math.random()*(b-a)}
function fit(){var r=stage.getBoundingClientRect();world.w=Math.max(320,r.width);world.h=Math.max(220,r.height);world.ground=world.h*.79;world.playerH=world.h*.145;world.playerW=world.playerH*.69;world.playerX=world.w*.115;if(world.grounded)world.py=world.ground-world.playerH;renderPlayer()}
function setTransform(el,x,y,sx,sy){el.style.transform='translate3d('+x+'px,'+y+'px,0)'+(sx?' scale('+sx+','+(sy||sx)+')':'')}
function renderPlayer(){setTransform(playerEl,world.playerX,world.py);playerEl.style.width=world.playerW+'px';playerEl.style.height=world.playerH+'px';playerEl.classList.toggle('duck',ducking);playerEl.classList.toggle('jump',!world.grounded);playerEl.classList.toggle('run',running&&!paused&&!over&&world.grounded&&!ducking)}
function toast(t){ui.toast.textContent=t;ui.toast.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(function(){ui.toast.classList.remove('show')},900)}
function pop(t,x,y){notice.textContent=t;notice.style.left=x+'px';notice.style.top=y+'px';notice.classList.add('show');clearTimeout(pop.t);pop.t=setTimeout(function(){notice.classList.remove('show')},420)}
function initParticles(){for(var i=0;i<particleLimit;i++){var el=document.createElement('i');el.className='particle';el.style.display='none';stage.appendChild(el);particlePool.push(el)}}
function addParticle(x,y,type){if(!particlePool.length)return;var el=particlePool.pop();el.style.display='block';el.style.background=type==='gold'?'#ffd66b':type==='red'?'#ff718c':'#61f4c2';var p={el:el,x:x,y:y,vx:rnd(-72,72),vy:rnd(-178,-42),life:.42,max:.42,size:rnd(2,5)};particleActive.push(p)}
function burst(x,y,type,n){if(lowPower)return;var count=Math.min(n||8,particlePool.length);for(var i=0;i<count;i++)addParticle(x,y,type)}
function releaseParticle(p){p.el.style.display='none';particlePool.push(p.el)}
function clearWorld(){for(var i=0;i<obstacles.length;i++)obstacles[i].el.remove();for(var j=0;j<pickups.length;j++)pickups[j].el.remove();for(var k=0;k<particleActive.length;k++)releaseParticle(particleActive[k]);obstacles=[];pickups=[];particleActive=[]}
function reset(){clearWorld();score=0;distance=0;coins=0;combo=1;comboTimer=0;speed=96;spawn=1.25;runTime=0;shield=0;grace=1.15;ducking=false;world.vy=0;world.grounded=true;world.py=world.ground-world.playerH;over=false;paused=false;roadX=0;shake=0;uiClock=0;acc=0;ui.modalScore.textContent='0';ui.modalBest.textContent=best;ui.startBtn.textContent='▶ MULAI';ui.statePill.textContent='READY';ui.tapHint.style.display='block';updateUI(true);renderPlayer()}
function start(){if(running&&!paused)return;if(over||!running)reset();running=true;renderPlayer();paused=false;over=false;overlay.classList.add('hide');ui.statePill.textContent='RUNNING';ui.startBtn.textContent='Ⅱ PAUSE';ui.tapHint.style.display='none';last=performance.now();acc=0;cancelAnimationFrame(raf);raf=requestAnimationFrame(loop)}
function pause(){if(!running||over)return;paused=!paused;ui.statePill.textContent=paused?'PAUSED':'RUNNING';ui.startBtn.textContent=paused?'▶ LANJUT':'Ⅱ PAUSE';renderPlayer();if(!paused){last=performance.now();acc=0;cancelAnimationFrame(raf);raf=requestAnimationFrame(loop)}}
function end(){running=false;over=true;paused=false;var n=Math.floor(score);if(n>best){best=n;storageSet(best);toast('🏆 REKOR BARU!')}ui.statePill.textContent='GAME OVER';ui.startBtn.textContent='▶ ULANGI';ui.modalTitle.textContent='Run Selesai';ui.modalText.textContent='Skor '+n+' • '+Math.floor(distance)+'m • '+coins+' koin. Tekan mulai untuk mencoba lagi.';ui.modalScore.textContent=n;ui.modalBest.textContent=best;ui.modalScore.textContent=n;overlay.classList.remove('hide');burst(world.playerX+world.playerW/2,world.py+world.playerH/2,'red',18);renderPlayer()}
function jump(){var now=Date.now();if(now-lastAction<70)return;lastAction=now;if(!running){start();setTimeout(jump,30);return}if(paused||over)return;if(world.grounded){ducking=false;world.vy=-world.h*1.84;world.grounded=false;burst(world.playerX+8,world.ground-3,'mint',5);renderPlayer()}}
function setDuck(v){if(!running){if(v)start();return}if(!paused&&!over){ducking=!!v&&world.grounded;renderPlayer()}}
function makeObstacle(type){var el=document.createElement('div');el.className='object '+type;if(type==='cactus')el.innerHTML='<div class="stem"></div><div class="arm1"></div><div class="arm2"></div><i class="spine s1"></i><i class="spine s2"></i><i class="spine s3"></i>';if(type==='treeObs')el.innerHTML='<div class="canopy"></div><div class="leaf1"></div><div class="leaf2"></div><div class="leaf3"></div><div class="trunk"></div><div class="root1"></div><div class="root2"></div>';if(type==='rock')el.innerHTML='<div class="shape"></div><div class="shine"></div>';if(type==='bird')el.innerHTML='<div class="wing"></div><div class="eye"></div><div class="beak"></div>';stage.appendChild(el);var h=type==='cactus'?world.h*.125:type==='treeObs'?world.h*.235:type==='rock'?world.h*.075:world.h*.058;var w=type==='cactus'?world.w*.035:type==='treeObs'?world.w*.09:type==='rock'?world.w*.052:world.w*.058;el.style.width=w+'px';el.style.height=h+'px';return{id:nextId++,el:el,type:type,x:world.w+50,y:world.ground-h,w:w,h:h,passed:false}}
function makePickup(type,y){var el=document.createElement('div');el.className='pickup '+type;stage.appendChild(el);var w=type==='coin'?world.w*.026:world.w*.034;el.style.width=w+'px';el.style.height=w+'px';return{id:nextId++,el:el,type:type,x:world.w+35,y:y,w:w,h:w,rot:rnd(0,6.28)}}
function spawnObstacle(){var r=Math.random(),type;if(runTime<7){type=r<.45?'cactus':r<.78?'rock':'treeObs'}else{type=r<.12?'bird':r<.35?'rock':r<.63?'treeObs':'cactus'}var o=makeObstacle(type);if(type==='bird')o.y=world.ground-rnd(world.h*.16,world.h*.24);obstacles.push(o);if(Math.random()<.68){var p=makePickup(Math.random()<.11?'shield':'coin',world.ground-rnd(world.h*.12,world.h*.25));pickups.push(p)}}
function rectHit(a,b){var padX=Math.min(a.w,b.w)*.18,padY=Math.min(a.h,b.h)*.1;return a.x+padX<b.x+b.w-padX&&a.x+a.w-padX>b.x+padX&&a.y+padY<b.y+b.h-padY&&a.y+a.h-padY>b.y+padY}
function playerBox(){var h=ducking?world.playerH*.58:world.playerH*.80;var w=world.playerW*.58;return{x:world.playerX+world.playerW*.2,y:world.py+world.playerH-h,w:w,h:h}}
function simulate(dt){runTime+=dt;speed=Math.min(340,96+runTime*4.1);distance+=speed*dt/17;roadX=(roadX+speed*dt)%110;road.style.setProperty('--road',(-roadX)+'px');comboTimer-=dt;if(comboTimer<=0)combo=1;if(shield>0)shield=Math.max(0,shield-dt);if(grace>0)grace=Math.max(0,grace-dt);
var g=world.ground;var ph=world.playerH;world.vy+=world.h*5.18*dt;world.py+=world.vy*dt;
if(world.py+ph>=g){if(!world.grounded&&world.vy>world.h*.25)burst(world.playerX+9,g,'mint',4);world.py=g-ph;world.vy=0;world.grounded=true}else world.grounded=false;
renderPlayer();
spawn-=dt;
if(spawn<=0){spawn=Math.max(1.48,rnd(2.1,2.85)-Math.min(.42,runTime*.003));spawnObstacle()}
var pbox=playerBox();
for(var i=obstacles.length-1;i>=0;i--){var o=obstacles[i];o.x-=speed*dt;if(o.type==='bird')o.y+=Math.sin(runTime*4+o.id)*world.h*.0009;setTransform(o.el,o.x,o.y);if(!o.passed&&o.x+o.w<world.playerX){o.passed=true;var gain=12*combo;score+=gain;combo=Math.min(9,combo+1);comboTimer=2.1;if(!lowPower){pop('+'+gain,world.playerX+world.playerW*1.2,Math.max(20,world.py-world.h*.08));burst(o.x,o.y,'mint',3)}}if(grace<=0&&rectHit(pbox,o)){if(shield>0){shield=0;var hx=o.x,hy=o.y;o.x=-100;o.el.remove();score+=55;shake=.13;burst(hx,hy,'mint',lowPower?0:12);pop('SHIELD!',world.playerX+world.playerW,world.py-world.h*.1)}else{end();return}}if(o.x+o.w<-60){o.el.remove();obstacles.splice(i,1)}}
for(var j=pickups.length-1;j>=0;j--){var p=pickups[j];p.x-=speed*dt;p.rot+=dt*4;p.el.style.transform='translate3d('+p.x+'px,'+p.y+'px,0) rotate('+p.rot+'rad)';if(rectHit(pbox,p)){p.el.remove();pickups.splice(j,1);if(p.type==='coin'){coins++;var cg=30*combo;score+=cg;combo=Math.min(9,combo+1);comboTimer=2.2;pop('COIN +'+cg,p.x,p.y);burst(p.x,p.y,'gold',lowPower?0:8)}else{shield=7;score+=80;pop('SHIELD 7s',p.x,p.y);burst(p.x,p.y,'mint',lowPower?0:12)}}else if(p.x+p.w<-50){p.el.remove();pickups.splice(j,1)}}
for(var q=particleActive.length-1;q>=0;q--){var a=particleActive[q];a.x+=a.vx*dt;a.y+=a.vy*dt;a.vy+=world.h*2.25*dt;a.life-=dt;a.el.style.transform='translate3d('+a.x+'px,'+a.y+'px,0) scale('+(a.size/4)+')';a.el.style.opacity=clamp(a.life/a.max,0,1);if(a.life<=0){releaseParticle(a);particleActive.splice(q,1)}}
if(shake>0){shake=Math.max(0,shake-dt);stage.style.transform='translate3d('+rnd(-2.2,2.2)+'px,'+rnd(-1.5,1.5)+'px,0)'}else stage.style.transform='';
score+=dt*(8+speed/110)*(1+combo*.05);uiClock+=dt;if(uiClock>=.09){updateUI(false);uiClock=0}}
function updateUI(force){if(!ui.score||!ui.hi||!ui.dist||!ui.combo)return;ui.score.textContent=Math.floor(score);ui.hi.textContent=Math.max(best,Math.floor(score));ui.dist.textContent=Math.floor(distance)+'m';ui.combo.textContent='x'+combo;ui.speedHud.textContent='SPEED '+(speed/96).toFixed(1)+'x';ui.missionHud.textContent='RUN '+Math.floor(runTime)+'s';ui.speedText.textContent=(speed/96).toFixed(1)+'x';ui.distanceText.textContent=Math.floor(distance)+' / ∞ m';ui.progressBar.style.width=(distance%100)+'%';ui.shieldText.textContent=shield>0?'ON '+shield.toFixed(1)+'s':'OFF';ui.coinText.textContent=coins;ui.recordText.textContent=best}
function loop(t){if(!running)return;raf=requestAnimationFrame(loop);if(paused){last=t;return}var frame=Math.min(.05,Math.max(0,(t-last)/1000||0));last=t;acc=Math.min(acc+frame,.1);var steps=0;while(acc>=step&&steps<4){simulate(step);acc-=step;steps++}if(steps===4)acc=0}
function button(el,fn){var busy=0;el.addEventListener('click',function(e){e.preventDefault();if(Date.now()-busy<180)return;busy=Date.now();fn()},{passive:false});el.addEventListener('touchend',function(e){e.preventDefault();if(Date.now()-busy<180)return;busy=Date.now();fn()},{passive:false})}
button(ui.startBtn,function(){if(running&&!over){pause()}else{start()}});
button($('jumpBtn'),jump);
$('duckBtn').addEventListener('pointerdown',function(e){e.preventDefault();setDuck(true)},{passive:false});
$('duckBtn').addEventListener('pointerup',function(e){e.preventDefault();setDuck(false)},{passive:false});
$('duckBtn').addEventListener('pointercancel',function(e){e.preventDefault();setDuck(false)},{passive:false});
$('duckBtn').addEventListener('pointerleave',function(){setDuck(false)});
button($('modalStart'),start);
button($('modalClose'),function(){overlay.classList.add('hide')});
stage.addEventListener('pointerdown',function(e){if(e.pointerType==='touch'||e.pointerType==='pen')touchStartY=e.clientY},{passive:true});
stage.addEventListener('pointerup',function(e){if(e.pointerType==='touch'||e.pointerType==='pen'){var dy=e.clientY-touchStartY;if(dy>25){setDuck(true);setTimeout(function(){setDuck(false)},220)}else jump()}},{passive:true});
stage.addEventListener('click',function(e){if(e.target===stage||e.target.classList.contains('scene')||e.target.classList.contains('sky'))jump()});
window.addEventListener('keydown',function(e){var k=e.key.toLowerCase();if(k===' '||k==='arrowup'||k==='arrowdown')e.preventDefault();if(k===' '||k==='arrowup')jump();if(k==='arrowdown')setDuck(true);if(k==='p')pause();if(k==='r')start()},{passive:false});
window.addEventListener('keyup',function(e){if(e.key.toLowerCase()==='arrowdown')setDuck(false)});
window.addEventListener('resize',fit);
document.addEventListener('visibilitychange',function(){if(document.hidden){last=performance.now();acc=0}});
window.addEventListener('blur',function(){last=performance.now();acc=0});
initParticles();
fit();
reset();
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
</script>
</body>
</html>
`

const pluginConfig = {
  name: 'dino',
  alias: ['dinorun'],
  category: 'game',
  description: 'Game Dino Run inline HTML dengan endless runner, skor, combo, koin dan perisai',
  usage: '.dino',
  example: '.dino',
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  isEnabled: true
}

const handler = async (m, { sock }) => {
  if (!m?.chat || !sock) return

  const reactionKey = m?.raw?.key || m?.key
  if (reactionKey) await sock.sendMessage(m.chat, { react: { text: '🦖', key: reactionKey } }).catch(() => {})

  await sock.relayMessage(
    m.chat,
    {
      messageContextInfo: {
        deviceListMetadata: {},
        deviceListMetadataVersion: 2,
        botMetadata: {},
      },
      botForwardedMessage: {
        message: {
          richResponseMessage: {
            messageType: 1,
            submessages: [
              {
                messageType: 2,
                messageText: 'Qiro Ai Dino Run 🦖✨',
              },
            ],
            unifiedResponse: {
              data: Buffer.from(
                JSON.stringify({
                  response_id: 'qiro-ai-dino-2026',
                  sections: [
                    {
                      view_model: {
                        primitive: {
                          __typename: 'GenAIaeacdsnwHtmlPrimitive',
                          payload: html,
                          trusted_sources: [],
                        },
                        __typename: 'GenAISingleLayoutViewModel',
                      },
                    },
                  ],
                })
              ).toString('base64'),
            },
            contextInfo: {
              forwardingScore: 1,
              isForwarded: true,
              forwardedAiBotMessageInfo: {
                botJid: '867051314767696@bot',
              },
              forwardOrigin: 4,
            },
          },
        },
      },
    },
    {}
  )
}


export { pluginConfig as config, handler };
