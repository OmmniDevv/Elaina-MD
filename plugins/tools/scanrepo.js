/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import axios from "axios"

const pluginConfig = {
  name: "scanrepo",
  alias: ["scanrepodev"],
  category: "tools",
  description: "Scan repository GitHub untuk security risk",
  usage: ".scanrepo <github-url>",
  example: ".scanrepo https://github.com/owner/repo",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 30,
  energi: 2,
  isEnabled: true,
}

const API_URL = "https://www.scanrepo.dev/api/scan"

function riskEmoji(level) {
  switch (String(level || "").toLowerCase()) {
    case "critical": return "🔴"
    case "high": return "🟠"
    case "medium": return "🟡"
    case "low": return "🟢"
    default: return "⚪"
  }
}

async function handler(m) {
  let url = m.text?.trim()
  if (!url) return m.reply(`🔍 *SCANREPO*\n\nScan repository GitHub untuk security risk.\n\nContoh:\n\`${m.prefix}scanrepo https://github.com/owner/repo\``)
  if (!/^https?:\/\/github\.com\/[^\/]+\/[^\/]+/i.test(url)) {
    if (!url.startsWith("http")) url = `https://${url}`
    if (!/^https?:\/\/github\.com\/[^\/]+\/[^\/]+/i.test(url)) return m.reply("❌ URL GitHub tidak valid.")
  }
  await m.react("🔍")
  try {
    const res = await axios.post(API_URL, { url }, {
      timeout: 120000,
      headers: { "Content-Type": "application/json", Accept: "text/plain", "User-Agent": "Mozilla/5.0" },
      responseType: "text"
    })
    const raw = String(res.data || "")
    let result = null
    for (const line of raw.split(/\r?\n/)) {
      if (!line.trim()) continue
      try {
        const item = JSON.parse(line)
        if (item.type === "result") result = item.data
        if (item.type === "error") throw new Error(item.error || "scan error")
      } catch (e) {
        if (e?.message === "scan error" || /^HTTP|^scan error/.test(e?.message || "")) throw e
      }
    }
    if (!result) {
      try { result = JSON.parse(raw)?.data || JSON.parse(raw) } catch {}
    }
    if (!result) throw new Error("Tidak ada hasil scan")
    const meta = result.meta || {}
    const findings = (result.categories || []).flatMap(c => (c.findings || []).map(f => ({ ...f, category: c.name })))
    let txt = `╔═ 『 🔍 SCANREPO 』\n║ 📦 *${meta.owner && meta.repo ? `${meta.owner}/${meta.repo}` : url}*\n╠══════════════════════════\n║ ${riskEmoji(result.riskLevel)} *Risk Score:* *${Number(result.riskScore || 0).toFixed(0)} / 100*\n║ ├ Level: *${String(result.riskLevel || "UNKNOWN").toUpperCase()}*\n║ └ Files: *${result.filesScanned ?? 0} / ${result.totalRepoFiles ?? 0}*\n╠══════════════════════════`
    if (findings.length) {
      txt += `\n║ ⚠️ *Findings* (${findings.length})`
      for (const f of findings.slice(0, 8)) {
        txt += `\n║ ├ *${f.title || "Finding"}*\n║ │ ├ ${f.file || "?"}${f.line ? `:${f.line}` : ""}\n║ │ └ +${f.points || 0}pts`
      }
    }
    txt += `\n╚══════════════════════════`
    await m.reply(txt)
    await m.react("✅")
  } catch (e) {
    await m.react("❌")
    return m.reply(`❌ ScanRepo gagal: ${e.message}`)
  }
}

export { pluginConfig as config, handler }
