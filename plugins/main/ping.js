/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import { createCanvas } from "@napi-rs/canvas"
import { performance } from "perf_hooks"
import os from "os"
import config from "../../config.js"
import te from "../../src/lib/elaina-error.js"

const pluginConfig = {
  name: "ping",
  alias: ["speed", "p", "latency", "sys", "status"],
  category: "main",
  description: "Cek performa dan status sistem bot secara real-time (Canvas Epic)",
  usage: ".ping",
  example: ".ping",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
}

const fmtSize = (b) => {
  if (!b || b === 0) return "0 B"
  const u = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(b) / Math.log(1024))
  return (b / Math.pow(1024, i)).toFixed(2) + " " + u[i]
}

const fmtUp = (s) => {
  s = Number(s)
  const d = Math.floor(s / 86400),
    h = Math.floor((s % 86400) / 3600),
    m = Math.floor((s % 3600) / 60),
    sc = Math.floor(s % 60)
  if (d > 0) return `${d}d ${h}h ${m}m`
  if (h > 0) return `${h}h ${m}m ${sc}s`
  return `${m}m ${sc}s`
}

function drawCyberBox(ctx, x, y, w, h, title, glowColor) {
    const boxGradient = ctx.createLinearGradient(x, y, x, y + h);
    boxGradient.addColorStop(0, 'rgba(30, 41, 59, 0.8)');
    boxGradient.addColorStop(1, 'rgba(15, 23, 42, 0.6)');
    
    ctx.fillStyle = boxGradient;
    ctx.fillRect(x, y, w, h);
    
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.strokeRect(x, y, w, h);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.lineWidth = 4;
    ctx.strokeStyle = glowColor;
    ctx.shadowBlur = 20;
    ctx.shadowColor = glowColor;
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.moveTo(x, y + h - 10);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x + 10, y + h);
    ctx.lineWidth = 3;
    ctx.strokeStyle = glowColor;
    ctx.shadowBlur = 10;
    ctx.shadowColor = glowColor;
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.moveTo(x + w - 10, y + h);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x + w, y + h - 10);
    ctx.lineWidth = 3;
    ctx.strokeStyle = glowColor;
    ctx.shadowBlur = 10;
    ctx.shadowColor = glowColor;
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = glowColor;
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(`⌖ ${title.toUpperCase()}`, x + 20, y + 35);
}

function drawGauge(ctx, x, y, radius, percentage, color, label) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0.75 * Math.PI, 2.25 * Math.PI);
    ctx.lineWidth = 30;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, radius, 0.75 * Math.PI, 0.75 * Math.PI + (1.5 * Math.PI * (percentage / 100)));
    ctx.lineWidth = 30;
    
    const grad = ctx.createLinearGradient(x - radius, y - radius, x + radius, y + radius);
    grad.addColorStop(0, color);
    grad.addColorStop(1, '#ffffff');

    ctx.strokeStyle = grad;
    ctx.shadowBlur = 25;
    ctx.shadowColor = color;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 70px sans-serif';
    ctx.textAlign = 'center';
    
    ctx.shadowBlur = 15;
    ctx.shadowColor = color;
    ctx.fillText(`${percentage}%`, x, y + 15);
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = color;
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(label, x, y + 60);
    ctx.textAlign = 'left';
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    for(let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
}

async function createEpicPingCanvas(data) {
    const width = 1200;
    const height = 800;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    const bgGrad = ctx.createRadialGradient(width/2, height/2, 100, width/2, height/2, width);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(1, '#020617');
    
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
    ctx.lineWidth = 1;
    for(let i = 0; i < width; i += 40) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
    }
    for(let i = 0; i < height; i += 40) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(100, 100, 400, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.05)';
    ctx.filter = 'blur(80px)';
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(1100, 700, 300, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(192, 132, 252, 0.05)';
    ctx.fill();
    ctx.filter = 'none';

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 50px sans-serif';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#38bdf8';
    ctx.fillText('SYSTEM DIAGNOSTICS', 50, 70);
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 24px Courier New';
    ctx.fillText(`STATUS: ONLINE | TERMINAL: Rimuru MD`, 50, 110);
    
    ctx.beginPath();
    ctx.moveTo(50, 130);
    ctx.lineTo(width - 50, 130);
    ctx.lineWidth = 3;
    const lineGrad = ctx.createLinearGradient(50, 130, width - 50, 130);
    lineGrad.addColorStop(0, '#38bdf8');
    lineGrad.addColorStop(0.5, '#c084fc');
    lineGrad.addColorStop(1, 'transparent');
    ctx.strokeStyle = lineGrad;
    ctx.stroke();

    const col1X = 50, colWidth = 330;

    drawCyberBox(ctx, col1X, 160, colWidth, 180, 'LATENCY PING', '#4ade80');
    const pingColor = data.ping < 100 ? '#4ade80' : (data.ping < 500 ? '#facc15' : '#f87171');
    ctx.fillStyle = pingColor;
    ctx.font = 'bold 70px sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowBlur = 20;
    ctx.shadowColor = pingColor;
    ctx.fillText(`${data.ping}`, col1X + colWidth/2 - 20, 260);
    ctx.shadowBlur = 0;
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText(`ms`, col1X + colWidth/2 + ctx.measureText(`${data.ping}`).width/2 + 10, 260);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 18px sans-serif';
    let pStatus = data.ping < 100 ? 'EXCELLENT' : (data.ping < 500 ? 'MODERATE' : 'POOR');
    ctx.fillText(`CONNECTION: ${pStatus}`, col1X + 20, 310);

    drawCyberBox(ctx, col1X, 360, colWidth, 230, 'CPU PROCESSOR', '#fbbf24');
    ctx.fillStyle = '#f8fafc';
    ctx.font = '22px sans-serif';
    wrapText(ctx, data.cpuModel, col1X + 20, 430, colWidth - 40, 30);
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`Cores:`, col1X + 20, 520);
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(`${data.cpuCores} Threads`, col1X + 110, 520);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`Speed:`, col1X + 20, 555);
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(`${data.cpuSpeed} MHz`, col1X + 110, 555);

    drawCyberBox(ctx, col1X, 610, colWidth, 140, 'SYSTEM LOAD', '#f43f5e');
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 24px Courier New';
    ctx.fillText(`1m:  ${data.load[0]}`, col1X + 20, 680);
    ctx.fillText(`5m:  ${data.load[1]}`, col1X + 20, 710);
    ctx.fillText(`15m: ${data.load[2]}`, col1X + 180, 680);

    const col2X = 410, col2Width = 380;
    const gaugeX = col2X + col2Width/2;
    const gaugeY = 380;
    
    ctx.fillStyle = '#c084fc';
    ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#c084fc';
    ctx.fillText('MEMORY USAGE', gaugeX, 200);
    ctx.shadowBlur = 0;
    ctx.textAlign = 'left';

    drawGauge(ctx, gaugeX, gaugeY, 140, data.memPct, '#c084fc', 'USED RAM');

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Used: ${fmtSize(data.usedMem)}`, gaugeX, 580);
    ctx.fillText(`Free: ${fmtSize(data.freeMem)}`, gaugeX, 615);
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(`TOTAL: ${fmtSize(data.totalMem)}`, gaugeX, 660);
    ctx.textAlign = 'left';

    const col3X = 820, col3Width = 330;

    drawCyberBox(ctx, col3X, 160, col3Width, 230, 'NODE.JS ENGINE', '#38bdf8');
    const nY = 220;
    const nColor = '#38bdf8';
    ctx.fillStyle = '#94a3b8'; ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`RSS:`, col3X + 20, nY);       ctx.fillStyle = nColor; ctx.fillText(fmtSize(data.memNode.rss), col3X + 140, nY);
    ctx.fillStyle = '#94a3b8'; ctx.fillText(`Heap Used:`, col3X + 20, nY+35); ctx.fillStyle = nColor; ctx.fillText(fmtSize(data.memNode.heapUsed), col3X + 140, nY+35);
    ctx.fillStyle = '#94a3b8'; ctx.fillText(`Heap Total:`, col3X + 20, nY+70); ctx.fillStyle = nColor; ctx.fillText(fmtSize(data.memNode.heapTotal), col3X + 140, nY+70);
    ctx.fillStyle = '#94a3b8'; ctx.fillText(`External:`, col3X + 20, nY+105); ctx.fillStyle = nColor; ctx.fillText(fmtSize(data.memNode.external), col3X + 140, nY+105);
    ctx.fillStyle = '#94a3b8'; ctx.fillText(`V8 Engine:`, col3X + 20, nY+140); ctx.fillStyle = '#f8fafc'; ctx.fillText(data.v8, col3X + 140, nY+140);

    drawCyberBox(ctx, col3X, 410, col3Width, 180, 'SYSTEM SPECS', '#a855f7');
    const osY = 470;
    ctx.fillStyle = '#94a3b8'; ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`OS:`, col3X + 20, osY);      ctx.fillStyle = '#f8fafc'; ctx.fillText(`${data.osType} ${data.osRel}`, col3X + 80, osY);
    ctx.fillStyle = '#94a3b8'; ctx.fillText(`Arch:`, col3X + 20, osY+35);    ctx.fillStyle = '#f8fafc'; ctx.fillText(`${data.osPlatform} (${data.osArch})`, col3X + 80, osY+35);
    ctx.fillStyle = '#94a3b8'; ctx.fillText(`Host:`, col3X + 20, osY+70);    ctx.fillStyle = '#f8fafc'; ctx.fillText(`${data.osHost}`, col3X + 80, osY+70);
    ctx.fillStyle = '#94a3b8'; ctx.fillText(`Node:`, col3X + 20, osY+105);   ctx.fillStyle = '#f8fafc'; ctx.fillText(`${data.nodeVer}`, col3X + 80, osY+105);

    drawCyberBox(ctx, col3X, 610, col3Width, 140, 'UPTIME', '#ec4899');
    ctx.fillStyle = '#94a3b8'; ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`Server:`, col3X + 20, 670); ctx.fillStyle = '#ec4899'; ctx.font = 'bold 22px sans-serif'; ctx.fillText(data.upOS, col3X + 100, 670);
    ctx.fillStyle = '#94a3b8'; ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`Bot:`, col3X + 20, 715);    ctx.fillStyle = '#ec4899'; ctx.font = 'bold 22px sans-serif'; ctx.fillText(data.upBot, col3X + 100, 715);

    return canvas.toBuffer('image/png');
}

async function handler(m, { sock }) {
  try {
    const tStart = performance.now();

    const cpus = os.cpus();
    const loadAvg = os.loadavg();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memPct = ((usedMem / totalMem) * 100).toFixed(1);

    const tEnd = performance.now();
    const execTime = (tEnd - tStart).toFixed(0);

    const data = {
        ping: execTime,
        cpuModel: cpus[0]?.model || "Unknown CPU",
        cpuSpeed: cpus[0]?.speed || 0,
        cpuCores: cpus.length,
        load: [loadAvg[0].toFixed(2), loadAvg[1].toFixed(2), loadAvg[2].toFixed(2)],
        totalMem, freeMem, usedMem, memPct,
        memNode: process.memoryUsage(),
        osType: os.type(),
        osRel: os.release(),
        osPlatform: os.platform(),
        osArch: os.arch(),
        osHost: os.hostname(),
        nodeVer: process.version,
        v8: process.versions.v8,
        upOS: fmtUp(os.uptime()),
        upBot: fmtUp(process.uptime())
    };

    await m.react('🕕');

    const imageBuffer = await createEpicPingCanvas(data);

    const caption = 
      `🏓 *PONG!* (${data.ping}ms)\n\n` +
      `Berikut adalah detail spesifikasi dan performa server secara lengkap:\n\n` +
      `🖥️ *INFORMASI SISTEM*\n` +
      `> ◦ *OS:* ${data.osType} (${data.osRel})\n` +
      `> ◦ *Platform:* ${data.osPlatform} (${data.osArch})\n` +
      `> ◦ *Hostname:* ${data.osHost}\n` +
      `> ◦ *NodeJS:* ${data.nodeVer}\n` +
      `> ◦ *Engine V8:* ${data.v8}\n\n` +
      `💻 *INFORMASI CPU*\n` +
      `> ◦ *Model:* ${data.cpuModel.trim()}\n` +
      `> ◦ *Cores:* ${data.cpuCores} Core(s)\n` +
      `> ◦ *Speed:* ${data.cpuSpeed} MHz\n` +
      `> ◦ *Load Avg:* ${data.load[0]} (1m), ${data.load[1]} (5m), ${data.load[2]} (15m)\n\n` +
      `🧠 *PENGGUNAAN MEMORI*\n` +
      `> ◦ *Total RAM:* ${fmtSize(data.totalMem)}\n` +
      `> ◦ *Dipakai:* ${fmtSize(data.usedMem)} (${data.memPct}%)\n` +
      `> ◦ *Sisa Bebas:* ${fmtSize(data.freeMem)}\n\n` +
      `📦 *MEMORI NODEJS*\n` +
      `> ◦ *RSS:* ${fmtSize(data.memNode.rss)}\n` +
      `> ◦ *Heap Total:* ${fmtSize(data.memNode.heapTotal)}\n` +
      `> ◦ *Heap Used:* ${fmtSize(data.memNode.heapUsed)}\n` +
      `> ◦ *External:* ${fmtSize(data.memNode.external)}\n\n` +
      `⏱️ *WAKTU AKTIF (UPTIME)*\n` +
      `> ◦ *Uptime Server:* ${data.upOS}\n` +
      `> ◦ *Uptime Bot:* ${data.upBot}\n\n` +
      `Sistem berjalan stabil dan menyelesaikan kalkulasi dalam waktu eksekusi *${data.ping}ms*.`;

    await sock.sendMessage(m.chat, { image: imageBuffer, caption: caption }, { quoted: m });
    await m.react("✅");

  } catch (error) {
    await m.react("❌");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler }
