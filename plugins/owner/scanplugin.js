/**
 * ╔══════════════════════════════════════════╗
 * ║         E L A I N A  -  M D             ║
 * ║   Script by OmmniDevv — Jangan Dijual!  ║
 * ║  https://github.com/OmmniDevv/Elaina-MD ║
 * ╚══════════════════════════════════════════╝
 */

import fs from 'fs';
import path from 'path';
import axios from 'axios';
const pluginConfig = {
name: "scanplugin",
alias: ["checkplugin"],
category: "owner",
description: "Scan plugin error dan API mati",
usage: ".scanplugin",
isOwner: true,
cooldown: 5,
isEnabled: true
}

async function handler(m,{ sock }){

const pluginsDir = path.join(process.cwd(),'plugins')

let total = 0
let errorPlugins = []
let deadApi = []

const folders = fs.readdirSync(pluginsDir)

for (const folder of folders){

const folderPath = path.join(pluginsDir,folder)

if (!fs.statSync(folderPath).isDirectory()) continue

const files = fs.readdirSync(folderPath).filter(v=>v.endsWith('.js'))

for (const file of files){

total++

const filePath = path.join(folderPath,file)

try{

const code = fs.readFileSync(filePath,'utf8')

/* cek syntax */
new Function(code)

/* cek api */
const apiMatch = code.match(/https?:\/\/[^\s'"]+/g)

if(apiMatch){

for(const url of apiMatch){

try{
await axios.get(url,{timeout:4000})
}catch{
deadApi.push(`${folder}/${file}`)
break
}

}

}

}catch{

errorPlugins.push(`${folder}/${file}`)

}

}

}

let normal = total - errorPlugins.length - deadApi.length

let text =
`╭─〔 ❤️ RIMURU SCAN PLUGIN 〕
│
│ 📦 Total Plugin : ${total}
│ ✅ Normal : ${normal}
│ ❌ Error : ${errorPlugins.length}
│ ☠️ API Mati : ${deadApi.length}
│`

if(errorPlugins.length){

text += `

├─ Plugin Error
${errorPlugins.map(v=>`│ • ${v}`).join('\n')}`

}

if(deadApi.length){

text += `

├─ API Mati
${deadApi.map(v=>`│ • ${v}`).join('\n')}`

}

text += `

╰────────────`

m.reply(text)

}

export { pluginConfig as config, handler };
